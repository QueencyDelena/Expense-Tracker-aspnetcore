using Expense_Tracker_aspnetcore.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Expense_Tracker_aspnetcore.Data;

namespace Expense_Tracker_aspnetcore.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly ExpenseTrackerContext _context;

        public HomeController(ILogger<HomeController> logger, ExpenseTrackerContext context)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<ActionResult> Index(DateTime dateFrom, DateTime dateTo, string filter)
        {
            if (dateFrom == DateTime.MinValue)
                dateFrom = DateTime.Today;
            if (dateTo == DateTime.MinValue)
            {
                dateFrom = DateTime.Today.AddDays(-(DateTime.Today.Day - 1));
                dateTo = DateTime.Today;
            }


            ViewData["DateFrom"] = dateFrom;
            ViewData["DateTo"] = dateTo;

            var month = DateTime.Now;

            ViewData["Month"] = month.ToString("MMMM");


            var accountSummary =
                (from t in _context.Transactions.Include(t => t.Account).Include(t => t.Category)
                 where t.PostDate.Date >= dateFrom.Date && t.PostDate.Date <= dateTo
                 group t by t.Account.Name into g
                 select new Summary()
                 {
                     Key = g.Key,
                     Amount = g.Sum(x => x.Amount),
                     DateFrom = dateFrom,
                     DateTo = dateTo

                 }).OrderByDescending(x => x.Amount);


            var categorySummary =
                (from t in _context.Transactions.Include(t => t.Account).Include(t => t.Category)
                 where t.PostDate.Date >= dateFrom.Date && t.PostDate.Date <= dateTo
                 group t by t.Category.Name into g
                 select new Summary()
                 {
                     Key = g.Key,
                     Amount = g.Sum(x => x.Amount),
                     DateFrom = dateFrom,
                     DateTo = dateTo

                 }).OrderByDescending(x => x.Amount);

            await categorySummary.ToListAsync();
            await accountSummary.ToListAsync();

            var summary = new List<IQueryable<Summary>>()
            {
                accountSummary,
                categorySummary
            };

            return View(summary);
        }

        public IActionResult About()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
