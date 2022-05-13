using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
namespace Expense_Tracker_aspnetcore.Models
{
    public class Category
    {

        public int UserID { get; set; }
        public int CategoryID { get; set; }

        public string Name { get; set; }


        [DataType(DataType.Currency)]
        public float Balance { get; set; } = 0;
    }
}
