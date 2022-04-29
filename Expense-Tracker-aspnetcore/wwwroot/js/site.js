
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