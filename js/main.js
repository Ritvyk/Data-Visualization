loadToChart();
document.getElementById("filter").addEventListener("change", function () {
    var dataKey = document.getElementById("Ymeasures").value.toLowerCase();
    var chartType = document.getElementById("chartPlotType").value.toLowerCase();
    var filter = document.getElementById("filter").value.toLowerCase();
    loadToChart(dataKey, chartType, filter);
    // loadToChart(document.getElementById("Ymeasures").value.toLowerCase(), document.getElementById("chartPlotType").value.toLowerCase(),document.getElementById("filter").value.toLowerCase());
});
document.getElementById("chartPlotType").addEventListener("change", function () {
    var dataKey = document.getElementById("Ymeasures").value.toLowerCase();
    var chartType = document.getElementById("chartPlotType").value.toLowerCase();
    var filter = document.getElementById("filter").value.toLowerCase();
    loadToChart(dataKey, chartType, filter);
    // loadToChart(document.getElementById("Ymeasures").value.toLowerCase(), document.getElementById("chartPlotType").value.toLowerCase(),document.getElementById("filter").value.toLowerCase());
});
document.getElementById("Ymeasures").addEventListener("change", function () {
    // console.log(document.getElementById("Ymeasures").value);
    var dataKey = document.getElementById("Ymeasures").value.toLowerCase();
    var chartType = document.getElementById("chartPlotType").value.toLowerCase();
    var filter = document.getElementById("filter").value.toLowerCase();
    loadToChart(dataKey, chartType, filter);
    // loadToChart();
});
async function loadToChart(keyValue = "intensity", graphtype = "bar", filterType = "country") {
    var dataPlot = await getData(filterType);
    var xAxisLabels = []
    if (filterType === "country") {
        xAxisLabels = dataPlot.relativeCountry;
    }
    else if (filterType === "region") {
        xAxisLabels = dataPlot.relativeRegion;
    }
    var dataValueSet = []
    if (keyValue === "intensity") {
        dataValueSet = dataPlot.relativeIntensities;
    }
    else if (keyValue === "relevance") {
        dataValueSet = dataPlot.relativeRelevance;
    }
    else if (keyValue === "likelihood") {
        dataValueSet = dataPlot.relativeLikelihood;
    }

    // var counter = -1;
    var can = document.getElementById("dataChart").getContext("2d"); //used to plot our chart
    Chart.defaults.global.defaultFontSize = 10;
    var myChart = new Chart(can, {
        type: graphtype,
        data: {
            labels: xAxisLabels.sort(),
            datasets: [{
                label: 'Heat Map',
                data: dataValueSet,
                backgroundColor: "orange",
                borderColor: "black",
                borderWidth: 1,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        callback: function (value, index, values) {
                            // counter++;          
                            // return dataPlot.relativeCountry[counter];
                            return value
                        }
                    }
                }]
            },
            legend: {
                labels: {
                    defaultFontSize: 5
                },
                display: false
            }
        }
    });
    //plot chart ends here
}
async function getData(filterType) {
    var country = {}
    var Region = {}
    var relativeCountry = [] //to remove duplicates holding each item at once
    var relativeRelevance = [];
    var relativeRegion = [];
    var relativeLikelihood = [];
    var relativeIntensities = [];
    var response = await fetch("./json/jsondata.json");
    //data set converted to json file
    var dataSet = await response.json();
    dataSet.forEach(dataChunk => {
        //to sort and make list of countries with respective datas
        var tempCountry = dataChunk.country;
        country[tempCountry] = {
            "intensity": dataChunk.intensity,
            "relevance": dataChunk.relevance,
            "likelihood": dataChunk.likelihood,
            "insight": dataChunk.insight,
            "title":dataChunk.title
        }
        Region[dataChunk.region] = {
            "intensity": dataChunk.intensity,
            "relevance": dataChunk.relevance,
            "likelihood": dataChunk.likelihood,
        }
    });
    // console.log(country);
    // console.log(Region);
    if (filterType === "country") {
        console.log("in the country")
        dataSet.forEach(item => {
            if (relativeCountry.includes(item.country) == false) {
                if (item.country != "") {
                    relativeCountry.push(item.country);
                    if (country[item.country].intensity != "") {
                        relativeIntensities.push(country[item.country].intensity);
                    }
                    if (country[item.country].likelihood != "") {
                        relativeLikelihood.push(country[item.country].likelihood);
                    }
                    if (country[item.country].relevance != "") {
                        relativeRelevance.push(country[item.country].relevance);
                    }
                }
            }
        });
        var tableBody = document.getElementById("dataBody");
        relativeCountry.forEach(data => {
            var newRow = document.createElement("tr");
            newRow.innerHTML = `
                <td>${country[data].insight}</td>
                <td>${data}</td>
                <td>${country[data].title}</td>
            `
            tableBody.appendChild(newRow);
        })
    }
    //end of if statement
    else if (filterType === "region") {
        dataSet.forEach(item => {
            if (relativeRegion.includes(item.region) == false) {
                if (item.region != "") {
                    relativeRegion.push(item.region);
                    if (Region[item.region].intensity != "") {
                        relativeIntensities.push(Region[item.region].intensity);
                    }
                    if (Region[item.region].likelihood != "") {
                        relativeLikelihood.push(Region[item.region].likelihood);
                    }
                    if (Region[item.region].relevance != "") {
                        relativeRelevance.push(Region[item.region].relevance);
                    }
                }
            }
        });
    }
    return { relativeIntensities, relativeLikelihood, relativeRelevance, relativeCountry, relativeRegion }
}
