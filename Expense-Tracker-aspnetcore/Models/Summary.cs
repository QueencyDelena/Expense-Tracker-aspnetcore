using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace Expense_Tracker_aspnetcore.Models
{
    public class Summary
    {

        [DataType(DataType.Date)]
        public DateTime? DateFrom { get; set; }


        [DataType(DataType.Date)]
        public DateTime? DateTo { get; set; }

        public string Key { get; set; }

        [DataType(DataType.Currency)]
        public float Amount { get; set; } = 0;
    }
}
