using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tredjepart
{
    public class StrategyFromAnotherCompany
    {
        public int Calculate(int price)
        {
            return (int)Math.Round(0.2 * price) + price;
        }
    }
}
