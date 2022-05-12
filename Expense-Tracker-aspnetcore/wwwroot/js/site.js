function FilterTransactions() {
    var accountList = new Array();
    $('.chk-account').each(function () {
        if ($(this).is(":checked")) {
            accountList.push($(this).attr('data-id'));
        }
    });
    var categoryList = new Array();
    $('.chk-category').each(function () {
        if ($(this).is(":checked")) {
            categoryList.push($(this).attr('data-id'));
        }
    });

    var searchString = $('#searchBar').val();

    var dateFrom = $('#dateFrom').val();
    var dateTo = $('#dateTo').val();

    jQuery.ajaxSettings.traditional = true
    $.ajax({
        url: "/Transactions/GetTransactions",
        type: "get",
        data:
        {
            dateFrom: dateFrom,
            dateTo: dateTo,
            searchString: searchString,
            selectedAccounts: accountList,
            selectedCategories: categoryList,
        },
        success: function (result) {
            $("#transaction-table").html(result);
            TransactionPageScript();
        }
    });
}

function TransactionPageScript() {


    $("#chk-all-account").click(function () {
        $('.select-account').each(function () {
            if ($(this).is(":checked")) {
                $(this).prop('checked', false);
            }
        });
    });
    $(".chk-account").change(function () {
        if ($('.chk-account:checked').length > 0) {
            $("#chk-all-account").prop('checked', false);
        }
        else if ($('.chk-account:checked').length == 0) {
            $("#chk-all-account").prop('checked', true);
        }
    });


    $("#chk-all-category").click(function () {
        $('.chk-category').each(function () {
            if ($(this).is(":checked")) {
                $(this).prop('checked', false);
            }
        });
    });
    $(".chk-category").change(function () {
        if ($('.chk-category:checked').length > 0) {
            $("#chk-all-category").prop('checked', false);
        }
        else if ($('.chk-category:checked').length == 0) {
            $("#chk-all-category").prop('checked', true);
        }
    });



    /*Header-Button Toggle*/
    $(".transactions-table .select-transaction").change(function () {
        if ($('.transactions-table .select-transaction:checked').length > 0) {
            $('.header-buttons button').attr("hidden", false);
        }
        else {
            $('.header-buttons button').attr("hidden", true);
        }
        if ($('.transactions-table .select-transaction:checked').length == $('.select-transaction').length) {
            $('.transactions-table .select-all').prop('checked', this.checked);
        }
        else {
            $('.transactions-table .select-all').prop('checked', false);
        }
    });

    $(".transactions-table .cancel-select").click(function () {
        $('.transactions-table .select-transaction').prop('checked', false);
        $('.transactions-table .select-all').prop('checked', false);
        $('.header-buttons button').attr("hidden", true);

    });
    $(".transactions-table .select-all").click(function () {
        if ($(this).is(":checked")) {
            $('.select-transaction').prop('checked', this.checked);
            $('.header-buttons button').attr("hidden", false);
        }
        else {
            $('.select-transaction').prop('checked', false);
            $('.header-buttons button').attr("hidden", true);
        }
    });


    /* Select Transactions------------------------*/
    $(".select-transaction").click(function (e) {
        e.stopPropagation();
    });
    $(".transaction-menu").click(function (e) {
        if (e.isDropDownToggleEvent != null && e.isDropDownToggleEvent)
            return false;

        return true;
    });


    /* Create Transaction------------------------*/
    $('.create-transaction').click(function () {
        var url = "/Transactions/Create"; // the url to the controller
        $.get(url, function (data) {
            $('#modal-container').html(data);
            $('#modal').modal('show');
            $.validator.unobtrusive.parse("#modal-container");
        });
    });

    /* Edit Transaction------------------------*/
    $('.edit-transaction').click(function (e) {
        if (e.isDropDownToggleEvent != null && e.isDropDownToggleEvent) {
            return false;
        }
        var id = $(this).attr('data-id');
        var url = "/Transactions/Edit";

        $.get(url + '/' + id, function (data) {
            $('#modal-container').html(data);
            $('#modal').modal('show');
            $.validator.unobtrusive.parse("#modal-container");
        });
    });


    /* Delete Transaction------------------------*/
    $(".delete-selected-transactions").click(function () {
        $('#delete-transaction-modal').modal('show');
    });

    $(".confirm-delete").click(function () {
        var form = $('#__AjaxAntiForgeryForm');
        var token = $('input[name="__RequestVerificationToken"]', form).val();
        var idList = new Array();
        $('.select-transaction').each(function () {
            if ($(this).is(":checked")) {
                idList.push($(this).parent().parent().attr('data-id'));
            }
        });
        jQuery.ajaxSettings.traditional = true
        $.post("/Transactions/Delete", { __RequestVerificationToken: token, ids: idList }, function (result) {
            $("#transaction-table").html(result);
            TransactionTableScript();
            $('#delete-transactions-modal').modal('hide');

        });

    });
}

function AccountTableScript() {
    $(".select-accounts").change(function () {
        if ($('.select-accounts:checked').length > 0) {
            $('#header-buttons button').attr("hidden", false);
        }
        else {
            $('#header-buttons button').attr("hidden", true);
        }


        if ($('.select-accounts:checked').length == $('.select-accounts').length) {
            $('.select-all-accounts').prop('checked', this.checked);
        }
        else {
            $('.select-all-accounts').prop('checked', false);
        }

    });

    $(".cancel-select, .select-all-accounts").click(function () {
        var $this = $(this);
        if ($this.hasClass("cancel-select")) {
            $('.select-accounts').prop('checked', false);
            $('.select-all-accounts').prop('checked', false);
            $('#header-buttons button').attr("hidden", true);
        }
        else if ($this.hasClass("select-all-accounts")) {
            if ($(this).is(":checked")) {
                $('.select-accounts').prop('checked', this.checked);
                $('#header-buttons button').attr("hidden", false);
            }
            else {
                $('.select-accounts').prop('checked', false);
                $('#header-buttons button').attr("hidden", true);
            }
        }
    });

    /* Select Accounts------------------------*/
    $(".select-accounts").click(function (e) {
        e.stopPropagation();
    });
    $(".accounts-menu").click(function (e) {
        if (e.isDropDownToggleEvent != null && e.isDropDownToggleEvent)
            return false;

        return true;
    });


    /* Create Accounts------------------------*/
    $('.create-account').click(function () {
        var url = "/Accounts/Create"; // the url to the controller
        $.get(url, function (data) {
            $('#accounts-page-container').html(data);
            $('#accounts-page-modal').modal('show');
            $.validator.unobtrusive.parse("#accounts-page-modal");
        });
    });


    /* Edit Accounts------------------------*/
    $('.edit-accounts').click(function (e) {
        if (e.isDropDownToggleEvent != null && e.isDropDownToggleEvent) {
            return false;
        }
        var id = $(this).attr('data-id');
        var url = "/Accounts/Edit";

        $.get(url + '/' + id, function (data) {
            $('#accounts-page-container').html(data);
            $('#accounts-page-modal').modal('show');
        });
    });



    /* Delete Transaction------------------------*/
    $(".delete-selected-accounts").click(function () {
        $('#delete-accounts-modal').modal('show');
    });

    $(".confirm-delete").click(function () {
        var form = $('#__AjaxAntiForgeryForm');
        var token = $('input[name="__RequestVerificationToken"]', form).val();
        var idList = new Array();
        $('.select-accounts').each(function () {
            if ($(this).is(":checked")) {
                idList.push($(this).parent().parent().attr('data-id'));
            }
        });
        jQuery.ajaxSettings.traditional = true
        $.post("/Accounts/Delete", { __RequestVerificationToken: token, ids: idList }, function (result) {
            location.reload();
        });

    });
}

function CategoryTableScript() {
    $(".select-category").change(function () {
        if ($('.select-category:checked').length > 0) {
            $('#header-buttons button').attr("hidden", false);
        }
        else {
            $('#header-buttons button').attr("hidden", true);
        }


        if ($('.select-category:checked').length == $('.select-category').length) {
            $('.select-all-category').prop('checked', this.checked);
        }
        else {
            $('.select-all-category').prop('checked', false);
        }

    });

    $(".cancel-select, .select-all-category").click(function () {
        var $this = $(this);
        if ($this.hasClass("cancel-select")) {
            $('.select-category').prop('checked', false);
            $('.select-all-category').prop('checked', false);
            $('#header-buttons button').attr("hidden", true);
        }
        else if ($this.hasClass("select-all-category")) {
            if ($(this).is(":checked")) {
                $('.select-category').prop('checked', this.checked);
                $('#header-buttons button').attr("hidden", false);
            }
            else {
                $('.select-category').prop('checked', false);
                $('#header-buttons button').attr("hidden", true);
            }
        }
    });

    /* Select category------------------------*/
    $(".select-category").click(function (e) {
        e.stopPropagation();
    });
    $(".category-menu").click(function (e) {
        if (e.isDropDownToggleEvent != null && e.isDropDownToggleEvent)
            return false;

        return true;
    });


    /* Create category------------------------*/
    $('.create-account').click(function () {
        var url = "/category/Create"; // the url to the controller
        $.get(url, function (data) {
            $('#category-page-container').html(data);
            $('#category-page-modal').modal('show');
            $.validator.unobtrusive.parse("#category-page-modal");
        });
    });


    /* Edit category------------------------*/
    $('.edit-category').click(function (e) {
        if (e.isDropDownToggleEvent != null && e.isDropDownToggleEvent) {
            return false;
        }
        var id = $(this).attr('data-id');
        var url = "/category/Edit";

        $.get(url + '/' + id, function (data) {
            $('#category-page-container').html(data);
            $('#category-page-modal').modal('show');
        });
    });



    /* Delete Transaction------------------------*/
    $(".delete-selected-category").click(function () {
        $('#delete-category-modal').modal('show');
    });

    $(".confirm-delete").click(function () {
        var form = $('#__AjaxAntiForgeryForm');
        var token = $('input[name="__RequestVerificationToken"]', form).val();
        var idList = new Array();
        $('.select-category').each(function () {
            if ($(this).is(":checked")) {
                idList.push($(this).parent().parent().attr('data-id'));
            }
        });
        jQuery.ajaxSettings.traditional = true
        $.post("/category/Delete", { __RequestVerificationToken: token, ids: idList }, function (result) {
            location.reload();
        });

    });
}

$(document).ready(function () {
    /*TRANSACTIONS PAGE ====================================*/
    TransactionPageScript();

    /*Deselect-All Toggle*/



    /*On Checkbox Change*/
    $(".select-accounts, .select-categories").change(function () {
        var $this = $(this);

        if ($this.hasClass("select-accounts")) {
            if ($('.select-accounts:checked').length == $('.select-accounts').length) {
                $('.select-all-accounts').prop('checked', this.checked);
            }
            else {
                $('.select-all-accounts').prop('checked', false);
            }
        }

        else if ($this.hasClass("select-categories")) {
            if ($('.select-categories:checked').length == $('.select-categories').length) {
                $('.select-all-categories').prop('checked', this.checked);
            }
            else {
                $('.select-all-categories').prop('checked', false);
            }
        }


    });



    $("#filter-transaction").click(function () {
        FilterTransactions();
    });


    AccountTableScript();
    CategoryTableScript();
});


$(".nav .nav-link").on("click", function () {
    $(".nav").find(".active").removeClass("active");
    $(this).addClass("active");
});

if (document.getElementById("Dashboard") != null) {
    loadDashboardSript();
}
function loadDashboardSript() {
    var table = document.getElementById("account-summary");

    var pielabel = table.getElementsByClassName("pie-label");
    var pievalue = table.getElementsByClassName("pie-value");

    var accountdata = [['Account', 'Balance']];
    $.each(pielabel, function (i, item) {
        accountdata.push([item.innerHTML.trim(), Number(pievalue[i].innerHTML.trim())]);
    });




    google.charts.load('current', { 'packages': ['corechart'] });
    google.charts.setOnLoadCallback(drawChart);


    var chartHeight = 50 * (pielabel.length + 1);

    if (chartHeight <= 250)
        chartHeight = 350;

    ////////////////////////////
    //// CATEGORY PIE CHART ////
    ////////////////////////////

    table = document.getElementById("category-summary");

    pielabel = table.getElementsByClassName("pie-label");
    pievalue = table.getElementsByClassName("pie-value");

    var categorydata = [['Account', 'Balance']];
    $.each(pielabel, function (i, item) {
        categorydata.push([item.innerHTML.trim(), Number(pievalue[i].innerHTML.trim())]);
    });


    google.charts.load('current', { 'packages': ['corechart'] });
    google.charts.setOnLoadCallback(drawChart);

    chartHeight = 50 * (pielabel.length + 1);

    if (chartHeight <= 250)
        chartHeight = 350;

    $(window).resize(function () {
        drawChart();
    });

    function drawChart() {
        var width = document.getElementById("account-table").offsetWidth;

        var data = google.visualization.arrayToDataTable(accountdata);

        var options = {
            colors: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 205, 86)',
                '#f6c7b6',
                'rgb(25, 23, 16)'
            ],
            legend: {
                position: 'top',
                alignment: 'start'
            },
            pieSliceTextStyle: {
                color: '#262424'
            },
            backgroundColor: {
                stroke: 'black',
                strokeWidth: 1
            },
            sliceVisibilityThreshold: 0.01,
            pieResidueSliceColor: "#d1d1d1",
            width: width,
            height: chartHeight
            /*pieSliceText: 'value',*/

            //backgroundColor: '#5e5e5e',
        };

        piechart = new google.visualization.PieChart(document.getElementById('account-piechart'));
        piechart.draw(data, options);

        data = google.visualization.arrayToDataTable(categorydata);
        piechart = new google.visualization.PieChart(document.getElementById('category-piechart'));
        piechart.draw(data, options);
    }
}