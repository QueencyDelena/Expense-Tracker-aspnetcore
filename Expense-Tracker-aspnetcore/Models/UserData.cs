using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Expense_Tracker_aspnetcore.Models
{
    public class UserData
    {
        public int UserID { get; set; }

        public IQueryable<Transaction> UserTransactions { get; set; }
    }
}
