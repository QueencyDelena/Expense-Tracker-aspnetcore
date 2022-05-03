using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Expense_Tracker_aspnetcore.Models
{
    public class Account
    {
        public int AccountID { get; set; }

        public int UserID { get; set; }
        public string Name { get; set; }

        [DataType(DataType.Currency)]
        public decimal Balance { get; set; } = 0;


    }
}
