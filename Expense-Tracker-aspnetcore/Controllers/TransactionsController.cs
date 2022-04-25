using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Expense_Tracker_aspnetcore.Data;
using Expense_Tracker_aspnetcore.Models;
using Microsoft.AspNetCore.Authorization;

namespace Expense_Tracker_aspnetcore.Controllers
{
    public class TransactionsController : Controller
    {
        private readonly ExpenseTrackerContext _context;

        public TransactionsController(ExpenseTrackerContext context)
        {
            _context = context;
        }

        // GET: Transactions
        public async Task<IActionResult> Index(
            string sortOrder,
            string searchString,
            int? pageNumber,
            string currentFilter,
            DateTime dateFrom, DateTime dateTo,
            int[] selectedAccounts)
        {


            ViewData["CurrentSort"] = sortOrder;
            ViewData["DateSort"] = sortOrder == "Date" ? "date_desc" : "Date";
            ViewData["CurrentFilter"] = searchString;

            if (dateFrom == DateTime.MinValue)
                dateFrom = DateTime.Today;
            if (dateTo == DateTime.MinValue)
            {
                dateFrom = DateTime.Today.AddDays(-(DateTime.Today.Day - 1));
                dateTo = DateTime.Today;
            }
            ViewData["DateFrom"] = dateFrom;
            ViewData["DateTo"] = dateTo;


            if (searchString != null)
            {
                pageNumber = 1;
            }
            else
            {
                searchString = currentFilter;
            }

            var transactions =
                _context.Transactions.Include(t => t.Account).Include(t => t.Category)
                .Where(t => t.PostDate.Date >= dateFrom.Date && t.PostDate.Date <= dateTo.Date);



            if (selectedAccounts.Length != 0)
            {
                transactions = from t in transactions
                               where selectedAccounts.Contains(t.AccountID)
                               select t;
            }


            var accounts = from a in _context.Accounts select a;

            var categories = from c in _context.Categories select c;


            if (!String.IsNullOrEmpty(searchString))
            {
                transactions = transactions.Where(t => t.Name.Contains(searchString));
            }
            switch (sortOrder)
            {
                case "date_desc":
                    transactions.OrderByDescending(t => t.PostDate);
                    break;
                default:
                    transactions = transactions.OrderByDescending(s => s.PostDate);
                    break;
            }
            int pageSize = 10;

            var transactionViewModel = new TransactionViewModel()
            {
                Accounts = accounts,
                Categories = categories,
                Transactions = await PaginatedList<Transaction>.CreateAsync(transactions.AsNoTracking(), pageNumber ?? 1, pageSize)
            };

            return View(transactionViewModel);
        }

        // GET: Transactions/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var transaction = await _context.Transactions
                .Include(t => t.Account)
                .Include(t => t.Category)
                .FirstOrDefaultAsync(m => m.TransactionID == id);
            if (transaction == null)
            {
                return NotFound();
            }

            return View(transaction);
        }

        // GET: Transactions/Create

        //[Authorize]
        public IActionResult Create()
        {
            ViewData["Account"] = new SelectList(_context.Accounts, "AccountID", "Name");
            ViewData["Category"] = new SelectList(_context.Categories, "CategoryID", "Name");

            return PartialView("~/Views/PartialViews/_CreateTransaction.cshtml");
            //return View();
        }

        // POST: Transactions/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to, for 
        // more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("Name,Amount,PostDate,Description,AccountID,CategoryID")] Transaction transaction)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    _context.Add(transaction);
                    await _context.SaveChangesAsync();
                    return RedirectToAction(nameof(Index));
                }
            }
            catch (DbUpdateException)
            {
                ModelState.AddModelError("", "Unable to save changes. " +
                    "Try again, and if the problem persists " +
                    "see your system administrator.");
            }

            ViewData["Account"] = new SelectList(_context.Accounts, "AccountID", "AccountID", transaction.AccountID);
            ViewData["Category"] = new SelectList(_context.Categories, "CategoryID", "CategoryID", transaction.CategoryID);

            //return PartialView("~/Views/PartialViews/_CreateTransaction.cshtml");
            return View(transaction);
        }

        // GET: Transactions/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var transaction = await _context.Transactions.FindAsync(id);
            if (transaction == null)
            {
                return NotFound();
            }
            ViewData["Account"] = new SelectList(_context.Accounts, "AccountID", "Name", transaction.AccountID);
            ViewData["Category"] = new SelectList(_context.Categories, "CategoryID", "Name", transaction.CategoryID);

            return PartialView("~/Views/PartialViews/_EditTransaction.cshtml", transaction);
            //return View(transaction);
        }

        // POST: Transactions/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for 
        // more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("TransactionID,Name,Amount,PostDate,Description,AccountID,CategoryID")] Transaction transaction)
        {
            if (id != transaction.TransactionID)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(transaction);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!TransactionExists(transaction.TransactionID))
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
            ViewData["AccountID"] = new SelectList(_context.Accounts, "AccountID", "AccountID", transaction.AccountID);
            ViewData["CategoryID"] = new SelectList(_context.Categories, "CategoryID", "CategoryID", transaction.CategoryID);
            return View(transaction);
        }

        // GET: Transactions/Delete/5
        public async Task<IActionResult> Delete(int? id, bool? saveChangesError = false)
        {
            if (id == null)
            {
                return NotFound();
            }

            var transaction = await _context.Transactions
                .Include(t => t.Account)
                .Include(t => t.Category)
                .AsNoTracking()
                .FirstOrDefaultAsync(m => m.TransactionID == id);
            if (transaction == null)
            {
                return NotFound();
            }
            if (saveChangesError.GetValueOrDefault())
            {
                ViewData["ErrorMessage"] =
                    "Delete failed. Try again, and if the problem persists " +
                    "see your system administrator.";
            }
            return View(transaction);
        }

        // POST: Transactions/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var transaction = await _context.Transactions.FindAsync(id);
            if (transaction == null)
            {
                return RedirectToAction(nameof(Index));
            }

            try
            {
                _context.Transactions.Remove(transaction);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                return RedirectToAction(nameof(Delete), new { id, saveChangesError = true });
            }
            return RedirectToAction(nameof(Index));
        }

        private bool TransactionExists(int id)
        {
            return _context.Transactions.Any(e => e.TransactionID == id);
        }
    }
}
