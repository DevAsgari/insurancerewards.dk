using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Rewards.Server.DTOs;
using Rewards.Server.Entities;
using Rewards.Server.Repositories;
using Rewards.Server.Services;
using Rewards.Server.Strategies;
namespace Rewards.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SalesController : ControllerBase
    {
        private readonly ISaleRepository _saleRepository;
        private readonly RewardService _rewardService;
        private readonly IMapper _mapper;

        public SalesController(ISaleRepository saleRepository, RewardService rewardService, IMapper mapper)
        {
            _saleRepository = saleRepository;
            _rewardService = rewardService;
            _mapper = mapper;
        }

        [ProducesResponseType(typeof(List<SaleDto>), StatusCodes.Status200OK)]
        [HttpGet]
        public async Task<ActionResult<List<SaleDto>>> GetSales()
        {
            var sales = await _saleRepository.GetAllAsync();
            var saleDtos = _mapper.Map<List<SaleDto>>(sales);

            return Ok(saleDtos);
        }

        [ProducesResponseType(typeof(SaleDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [HttpGet("{id}")]
        public async Task<ActionResult<SaleDto>> GetSaleById(Guid id)
        {
            var sale = await _saleRepository.GetByIdAsync(id);

            if (sale is null)
                return NotFound($"Sale with ID {id} not found");

            var dto = _mapper.Map<SaleDto>(sale);
            return Ok(dto);
        }


        [HttpGet("calculatereward/{strategyType}")]
        [ProducesResponseType(typeof(List<CalculateRewardDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<List<CalculateRewardDto>>> CalculateRewards(RewardStrategyType strategyType)
        {
            try
            {
                // Validate enum value
                if (!Enum.IsDefined(typeof(RewardStrategyType), strategyType))
                    return BadRequest($"Invalid strategy type: {strategyType}");

                var sales = await _saleRepository.GetAllAsync();

                // Empty list is valid - return empty result
                if (sales.Count == 0)
                    return Ok(new List<CalculateRewardDto>());

                var rewards = _rewardService.CalculateRewards(sales, strategyType);

                return Ok(rewards);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpPut("{id}/price-satisfaction")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> UpdatePriceAndSatisfaction(Guid id, UpdateSalePriceAndSatisfactionDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return await UpdateSaleAsync(id, dto);
        }

        private async Task<IActionResult> UpdateSaleAsync<TDto>(Guid id, TDto dto)
        {
            if (dto is null)
                return BadRequest("Request body is empty");

            var sale = await _saleRepository.GetByIdAsync(id);

            if (sale is null)
                return NotFound($"Sale with ID {id} not found");

            _mapper.Map(dto, sale);
            await _saleRepository.UpdateAsync(sale);

            return NoContent();
        }

        [HttpPost]
        [ProducesResponseType(typeof(SaleDto), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<SaleDto>> PostSale(CreateSaleDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var sale = _mapper.Map<Sale>(dto);
            await _saleRepository.CreateAsync(sale);

            var saleDto = _mapper.Map<SaleDto>(sale);

            return CreatedAtAction(nameof(GetSaleById),
                new { id = sale.Id }, saleDto);
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteSale(Guid id)
        {
            var exists = await _saleRepository.ExistsAsync(id);

            if (!exists)
                return NotFound($"Sale with ID {id} not found");

            await _saleRepository.DeleteAsync(id);

            return NoContent();
        }
    }
}

