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
    public class CategoriesController : Controller
    {
        private readonly ExpenseTrackerContext _context;

        public CategoriesController(ExpenseTrackerContext context)
        {
            _context = context;
        }

        // GET: Categories
        public async Task<IActionResult> Index()
        {
            var categories = await
                _context.Categories
                .AsNoTracking().ToListAsync();

            var transaction = await
                _context.Transactions
                .GroupBy(trx => trx.CategoryID)
                .Select(x => new Category()
                {
                    CategoryID = x.Key,
                    Balance = (x.Sum(c => c.Amount))
                })
                .AsNoTracking().ToListAsync();


            var categoriesSummary = categories.Select(cat => new Category
            {
                CategoryID = cat.CategoryID,
                Name = cat.Name,
                Balance = transaction.Where(x => x.CategoryID  == cat.CategoryID).Select(x => x.Balance).FirstOrDefault()
            });

            return View(categoriesSummary);
        }

        // GET: Categories/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var category = await _context.Categories
                .FirstOrDefaultAsync(m => m.CategoryID == id);
            if (category == null)
            {
                return NotFound();
            }

            return View(category);
        }

        // GET: Categories/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: Categories/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to, for 
        // more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("CategoryID,Name")] Category category)
        {
            if (ModelState.IsValid)
            {
                _context.Add(category);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(category);
        }

        // GET: Categories/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var category = await _context.Categories.FindAsync(id);
            if (category == null)
            {
                return NotFound();
            }
            return View(category);
        }

        // POST: Categories/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for 
        // more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("CategoryID,Name")] Category category)
        {
            if (id != category.CategoryID)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(category);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!CategoryExists(category.CategoryID))
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
            return View(category);
        }

        // GET: Categories/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var category = await _context.Categories
                .FirstOrDefaultAsync(m => m.CategoryID == id);
            if (category == null)
            {
                return NotFound();
            }

            return View(category);
        }

        // POST: Categories/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int[] ids)
        {
            var categories = await _context.Categories
             .Where(m => ids.Contains(m.CategoryID)).ToListAsync();

            var transactions = await _context.Transactions
                .Where(m => ids.Contains(m.CategoryID)).ToListAsync();

            if (categories == null)
            {
                return RedirectToAction(nameof(Index));
            }
            try
            {
                _context.Categories.RemoveRange(categories);
                _context.Transactions.RemoveRange(transactions);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {

                return RedirectToAction(nameof(Delete), new { ids, saveChangesError = true });
            }

            return RedirectToAction(nameof(Index));
        }

        private bool CategoryExists(int id)
        {
            return _context.Categories.Any(e => e.CategoryID == id);
        }
    }
}
