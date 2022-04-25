using Microsoft.EntityFrameworkCore;
using Expense_Tracker_aspnetcore.Models;

namespace Expense_Tracker_aspnetcore.Data
{
    public class ExpenseTrackerContext : DbContext
    {
        public ExpenseTrackerContext(DbContextOptions<ExpenseTrackerContext> options) : base(options)
        {
        }
        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<Account> Accounts { get; set; }
        public DbSet<Category> Categories { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Transaction>().ToTable("Transaction");
            modelBuilder.Entity<Account>().ToTable("Account");
            modelBuilder.Entity<Category>().ToTable("Category");
        }
    }
}
