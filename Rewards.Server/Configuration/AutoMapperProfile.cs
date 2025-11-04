using AutoMapper;
using Rewards.Server.DTOs;
using Rewards.Server.Entities;

namespace Rewards.Server.Configuration
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<Sale, SaleDto>();
            CreateMap<CreateSaleDto, Sale>();
            CreateMap<UpdateSalePriceAndSatisfactionDto, Sale>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.SaleType, opt => opt.Ignore())
                .ForMember(dest => dest.SaleDate, opt => opt.Ignore());
        }
    }
}
