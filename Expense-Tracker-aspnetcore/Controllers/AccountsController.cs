using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Expense_Tracker_aspnetcore.Data;
using Expense_Tracker_aspnetcore.Models;

namespace Expense_Tracker_aspnetcore.Controllers
{
    public class AccountsController : Controller
    {
        private readonly ExpenseTrackerContext _context;

        public AccountsController(ExpenseTrackerContext context)
        {
            _context = context;
        }

        // GET: Accounts
        public async Task<IActionResult> Index()
        {
            var accounts = await
                _context.Accounts
                .AsNoTracking().ToListAsync();

            var transaction = await
                _context.Transactions
                .GroupBy(trx => trx.AccountID)
                .Select(x => new Account()
                {
                    AccountID = x.Key,
                    Balance = Convert.ToDecimal(x.Sum(c => c.Amount))
                })
                .AsNoTracking().ToListAsync();


            var accountSummary = accounts.Select(acc => new Account
            {
                AccountID = acc.AccountID,
                Name = acc.Name,
                Balance = transaction.Where(x => x.AccountID == acc.AccountID).Select(x => x.Balance).FirstOrDefault() + acc.Balance
            });


            return View(accountSummary);
        }

        // GET: Accounts/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var account = await _context.Accounts
                .FirstOrDefaultAsync(m => m.AccountID == id);
            if (account == null)
            {
                return NotFound();
            }

            return View(account);
        }

        // GET: Accounts/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: Accounts/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to, for 
        // more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("AccountID,Name,Balance")] Account account)
        {
            if (ModelState.IsValid)
            {
                _context.Add(account);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(account);
        }

        // GET: Accounts/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var account = await _context.Accounts.FindAsync(id);
            if (account == null)
            {
                return NotFound();
            }
            return View(account);
        }

        // POST: Accounts/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for 
        // more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("AccountID,Name,Balance")] Account account)
        {
            if (id != account.AccountID)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(account);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!AccountExists(account.AccountID))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction(nameof(Index));
            }
            return View(account);
        }

        // GET: Accounts/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var account = await _context.Accounts
                .FirstOrDefaultAsync(m => m.AccountID == id);
            if (account == null)
            {
                return NotFound();
            }

            return View(account);
        }

        // POST: Accounts/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Delete(int[] ids)
        {
            var accounts = await _context.Accounts
                .Where(m => ids.Contains(m.AccountID)).ToListAsync();

            var transactions = await _context.Transactions
                .Where(m => ids.Contains(m.AccountID)).ToListAsync();

            if (accounts == null)
            {
                return RedirectToAction(nameof(Index));
            }
            try
            {
                _context.Accounts.RemoveRange(accounts);
                _context.Transactions.RemoveRange(transactions);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {

                return RedirectToAction(nameof(Delete), new { ids, saveChangesError = true });
            }

            return RedirectToAction(nameof(Index));
        }

        private bool AccountExists(int id)
        {
            return _context.Accounts.Any(e => e.AccountID == id);
        }
    }
}
