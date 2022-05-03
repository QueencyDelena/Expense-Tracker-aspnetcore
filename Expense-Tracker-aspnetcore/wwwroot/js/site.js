﻿$(document).ready(function () {
    /* Select ------------------------*/


    //unselect all transactions
    $("#cancel-selected").click(function () {
        $('.select-transactions').prop('checked', false);
        $('#select-all-transactions').prop('checked', false);
    });


    //show/hide header buttons when clicking select-transactions
    $(".select-transactions").change(function () {
        if ($('.select-transactions:checked').length > 0) {
            $('#header-buttons').attr("hidden", false);
        }
        else {
            $('#header-buttons').attr("hidden", true);
        }
    });


    //select all transaction on/off
    $("#select-all-transactions").click(function () {
        if ($(this).is(":checked")) {
            $('.select-transactions').prop('checked', this.checked);
            $('#header-buttons').attr("hidden", false);
        }
        else {
            $('.select-transactions').prop('checked', false);
            $('#header-buttons').attr("hidden", true);
        }
    });


    /* Edit ------------------------*/
    $('.edit-transaction').click(function (e) {
        if (e.isDropDownToggleEvent != null && e.isDropDownToggleEvent)
            return false;

        var url = "/Transactions/Edit"; // the url to the controller
        var id = $(this).attr('data-id'); // the id that's given to each button in the list
        $.get(url + '/' + id, function (data) {
            $('#edit-transaction-container').html(data);
            $('#edit-transaction').modal('show');
        });

    });



    /* Delete ------------------------*/
    $(".delete-selected-transactions").click(function () {
        $('#delete-transaction').modal('show');
    });


    /* Select Transactions------------------------*/
    $(".select-transactions").click(function (e) {
        e.stopPropagation();
    });


    /* Create Transaction------------------------*/
    $('.create-transaction').click(function () {
        var url = "/Transactions/Create"; // the url to the controller
        $.get(url, function (data) {
            $('#create-transaction-container').html(data);
            $('#create-transaction').modal('show');
        });
    });


    /* Delete Transaction------------------------*/
    $(".delete-selected-transactions").click(function () {
        var count = $('.chk-transactions').length;
        $('#delete-transaction').modal('show');
    });

    $(".confirm-delete").click(function () {
        var idList = new Array();
        $('.chk-transactions').each(function () {
            if ($(this).is(":checked")) {
                idList.push($(this).parent().parent().attr('data-id'));
            }
        });

        jQuery.ajaxSettings.traditional = true
        $.post("/Transactions/Delete", { ids: idList }, function (data) {

        });
    })


    $(document).ready(function () {
        $("#filter-transaction").click(function () {
            FilterTransactions();
        });
    });

    function GetTransactions(data) {
        jQuery.ajaxSettings.traditional = true
        $.ajax({
            url: "/Transactions/GetTransactions",
            type: "get",
            data: data,
            success: function (result) {
                $("#transaction-table").html(result);
            }
        });
    }
    
});



function FilterTransactions() {
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

    GetTransactions({
        dateFrom: dateFrom,
        dateTo: dateTo,
        searchString: searchString,
        selectedAccounts: accountList,
        selectedCategories: categoryList,
    });
}

AddAntiForgeryToken = function (data) {
    data.__RequestVerificationToken = $('#__AjaxAntiForgeryForm input[name=__RequestVerificationToken]').val();
    return data;
};


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