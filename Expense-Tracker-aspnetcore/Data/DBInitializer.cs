using Expense_Tracker_aspnetcore.Models;
using System;
using System.Linq;

namespace Expense_Tracker_aspnetcore.Data
{
    public class DbInitializer
    {
        public static void Initialize(ExpenseTrackerContext context)
        {
            context.Database.EnsureCreated();

            // Look for any students.
            if (context.Transactions.Any())
            {
                return;   // DB has been seeded
            }
            var accounts = new Account[]
            {
            new Account{UserID = 0, Name="Wallet", Balance = 0},
            //new Account{Name="BPI", Balance = 0},
            //new Account{Name="BDO", Balance = 0},

            };
            foreach (Account a in accounts)
            {
                context.Accounts.Add(a);
            }
            context.SaveChanges();

            var categories = new Category[]
            {
            new Category{UserID = 0, Name="Food"},
            new Category{UserID = 0, Name="Entertainment"},
            new Category{UserID = 0, Name="Medicine"},
            };
            foreach (Category c in categories)
            {
                context.Categories.Add(c);
            }
            context.SaveChanges();

            var transactions = new Transaction[]
            {
            new Transaction{Name="Grocery", Amount=10.1f, PostDate=DateTime.Today, CategoryID = 1, AccountID = 1, UserID = 0},
            new Transaction{Name="Food Panda",Amount=11,PostDate=DateTime.Today, CategoryID = 2, AccountID = 1, UserID = 0},
            new Transaction{Name="Grab Food",Amount=20.5f,PostDate=DateTime.Today, CategoryID = 3, AccountID = 1, UserID = 0},
            new Transaction{Name="Google Play Store",Amount=10,PostDate=DateTime.Today, CategoryID = 2, AccountID = 1, UserID = 0}
            };
            foreach (Transaction t in transactions)
            {
                context.Transactions.Add(t);
            }
            context.SaveChanges();


        }
    }
}
