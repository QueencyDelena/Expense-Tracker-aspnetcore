using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Expense_Tracker_aspnetcore.Models
{   
    public class Transaction
    {
        public int UserID { get; set; }
        public int TransactionID { get; set; }


        public string Name { get; set; } = "Unknown";


        [DataType(DataType.Currency)]
        public float Amount { get; set; } = 0;

        [DataType(DataType.DateTime)]
        [DisplayFormat(DataFormatString = "{0:yyyy-MM-dd HH:mm}", ApplyFormatInEditMode = true)]
        public DateTime PostDate { get; set; } = DateTime.Now;

        public string Description { get; set; }


        public int AccountID { get; set; } = 1;
        public int CategoryID { get; set; } = 1;
        public Account Account { get; set; }
        public Category Category { get; set; }

        public string TransactionType { get; set; } = Enums.TransactionType.Expense.ToString();
    }
}
