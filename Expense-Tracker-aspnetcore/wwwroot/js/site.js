﻿function FilterTransactions() {
    var accountList = new Array();
    $('.select-accounts').each(function () {
        if ($(this).is(":checked")) {
            accountList.push($(this).attr('data-id'));
        }
    });
    var categoryList = new Array();
    $('.select-categories').each(function () {
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
            TransactionTableScript();
        }
    });
}

function TransactionTableScript() {
    /*Header-Button Toggle*/
    $(".select-transactions").change(function () {
        if ($('.select-transactions:checked').length > 0) {
            $('#header-buttons').attr("hidden", false);
        }
        else {
            $('#header-buttons').attr("hidden", true);
        }


        if ($('.select-transactions:checked').length == $('.select-transactions').length) {
            $('.select-all-transactions').prop('checked', this.checked);
        }
        else {
            $('.select-all-transactions').prop('checked', false);
        }

    });

    $(".cancel-select, .select-all-transactions").click(function () {
        var $this = $(this);
        if ($this.hasClass("cancel-select")) {
            $('.select-transactions').prop('checked', false);
            $('.select-all-transactions').prop('checked', false);
            $('#header-buttons').attr("hidden", true);
        }
        else if ($this.hasClass("select-all-transactions")) {
            if ($(this).is(":checked")) {
                $('.select-transactions').prop('checked', this.checked);
                $('#header-buttons').attr("hidden", false);
            }
            else {
                $('.select-transactions').prop('checked', false);
                $('#header-buttons').attr("hidden", true);
            }
        }
    });

    $('.edit-transaction').click(function (e) {
        if (e.isDropDownToggleEvent != null && e.isDropDownToggleEvent) {
            return false;
        }
        var id = $(this).attr('data-id');
        var url = "/Transactions/Edit";

        $.get(url + '/' + id, function (data) {
            $('#edit-transaction-container').html(data);
            $('#edit-transaction').modal('show');
        });
    });

    /* Select Transactions------------------------*/
    $(".select-transactions").click(function (e) {
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
            $('#create-transaction-container').html(data);
            $('#create-transaction').modal('show');
            $.validator.unobtrusive.parse("#create-transaction");
        });
    });


    /* Delete Transaction------------------------*/
    $(".delete-selected-transactions").click(function () {
        $('#delete-transaction').modal('show');
    });
}

$(document).ready(function () {
    /*TRANSACTIONS PAGE ====================================*/
    TransactionTableScript();


    /*Deselect-All Toggle*/
    $(".select-all-accounts, .select-all-categories").click(function () {
        var $this = $(this);

        if ($this.hasClass("select-all-accounts")) {
            $('.select-accounts').prop('checked', this.checked);
        }
        else if ($this.hasClass("select-all-categories")) {
            $('.select-categories').prop('checked', this.checked);
        }
    });



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


    $(".confirm-delete").click(function () {
        var form = $('#__AjaxAntiForgeryForm');
        var token = $('input[name="__RequestVerificationToken"]', form).val();
        var idList = new Array();
        $('.select-transactions').each(function () {
            if ($(this).is(":checked")) {
                idList.push($(this).parent().parent().attr('data-id'));
            }
        });
        jQuery.ajaxSettings.traditional = true
        $.post("/Transactions/Delete", { __RequestVerificationToken: token, ids: idList }, function (result) {
            $("#transaction-table").html(result);
            TransactionTableScript();
            $('#delete-transaction').modal('hide');

        });

    });



    $("#filter-transaction").click(function () {
        FilterTransactions();
    });



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