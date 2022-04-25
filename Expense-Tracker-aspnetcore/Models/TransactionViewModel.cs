using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Expense_Tracker_aspnetcore.Models;
namespace Expense_Tracker_aspnetcore.Models
{
    public class TransactionViewModel
    {
        public PaginatedList<Transaction> Transactions;

        public IEnumerable<Account> Accounts { get; set; }

        public IEnumerable<Category> Categories { get; set; }

    }
}

