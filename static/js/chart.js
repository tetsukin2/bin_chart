// $(document).ready(function () {
//   var ctx = document.getElementById("myChart").getContext("2d");
//   var myChart = null;

//   function showChartStatus(message) {
//     if (message) {
//       $("#chart-container").append(
//         '<div id="chartStatus" class="chart-status">' + message + "</div>"
//       );
//       $("#myChart").hide();
//     } else {
//       $("#chartStatus").remove();
//       $("#myChart").show();
//     }
//   }

//   function generateChart(data) {
//     if (myChart) {
//       myChart.destroy();
//     }

//     try {
//       if (
//         data &&
//         data.status === "OK" &&
//         Array.isArray(data.data) &&
//         data.data.length > 0 &&
//         data.data[0].hasOwnProperty("title") &&
//         Array.isArray(data.data[0].histogram_x) &&
//         Array.isArray(data.data[0].histogram_y) &&
//         Array.isArray(data.data[0].norm_dist_x) &&
//         Array.isArray(data.data[0].norm_dist_y)
//       ) {
//         var chartData = data.data[0];

//         var allXValues = Array.from(
//           new Set([...chartData.histogram_x, ...chartData.norm_dist_x])
//         ).sort((a, b) => a - b);

//         function interpolateYValues(xValues, xData, yData) {
//           return xValues.map((x) => {
//             const index = xData.indexOf(x);
//             if (index !== -1) {
//               return yData[index];
//             } else {
//               const lowerIndex = xData.findIndex((val) => val > x) - 1;
//               const upperIndex = lowerIndex + 1;
//               if (lowerIndex < 0 || upperIndex >= xData.length) {
//                 return 0;
//               }
//               const x1 = xData[lowerIndex];
//               const x2 = xData[upperIndex];
//               const y1 = yData[lowerIndex];
//               const y2 = yData[upperIndex];
//               return y1 + ((y2 - y1) * (x - x1)) / (x2 - x1);
//             }
//           });
//         }

//         var histogramYValues = allXValues.map((x) => {
//           const index = chartData.histogram_x.indexOf(x);
//           return index !== -1 ? chartData.histogram_y[index] : 0;
//         });

//         var normDistYValues = interpolateYValues(
//           allXValues,
//           chartData.norm_dist_x,
//           chartData.norm_dist_y
//         );

//         myChart = new Chart(ctx, {
//           type: "bar",
//           data: {
//             labels: allXValues.map(String),
//             datasets: [
//               {
//                 label: chartData.title,
//                 data: histogramYValues,
//                 backgroundColor: "rgba(75, 192, 192, 0.2)",
//                 borderColor: "rgba(75, 192, 192, 1)",
//                 borderWidth: 1,
//                 yAxisID: "y-histogram",
//               },
//               {
//                 label: "Normal Distribution",
//                 data: normDistYValues,
//                 type: "line",
//                 borderColor: "rgba(255, 99, 132, 1)",
//                 fill: false,
//                 yAxisID: "y-normal",
//                 pointRadius: 3,
//                 tension: 0.4,
//                 borderDash: [],
//                 pointStyle: "circle",
//               },
//             ],
//           },
//           options: {
//             scales: {
//               "y-histogram": {
//                 type: "linear",
//                 position: "left",
//                 beginAtZero: true,
//                 max: Math.max(...histogramYValues) + 5,
//               },
//               "y-normal": {
//                 type: "linear",
//                 position: "right",
//                 beginAtZero: true,
//                 max: Math.max(...normDistYValues) + 1,
//                 grid: {
//                   drawOnChartArea: false,
//                 },
//               },
//               x: {
//                 beginAtZero: true,
//               },
//             },
//           },
//         });

//         showChartStatus("");
//       } else {
//         console.error("Invalid chart data received:", data);
//         showChartStatus("Failed to generate chart. Invalid data.");
//       }
//     } catch (error) {
//       console.error("Error rendering chart:", error);
//       showChartStatus("Error rendering chart. Check console for details.");
//     }
//   }

//   $("#generate-chart").click(function () {
//     var formData = {
//       customer: $("#customer").val(),
//       product_id: parseInt($("#product").val()),
//       "pass bin": $("#pass_bin").is(":checked"),
//       start_time: $("#date_range_start").val(),
//       end_time: $("#date_range_end").val(),
//       bin: getSelectedBins(),
//     };

//     console.log("Form Data to send:", formData);

//     $.ajax({
//       url: "/generate_chart/",
//       type: "POST",
//       contentType: "application/json",
//       data: JSON.stringify(formData),
//       success: function (response) {
//         console.log("Chart generated successfully:", response);
//         generateChart(response);
//       },
//       error: function (xhr, status, error) {
//         console.error("Error generating chart:", error, xhr.responseText);
//         alert("Error generating chart. Please check console for details.");
//         showChartStatus("Error generating chart. Check console for details.");
//       },
//     });
//   });

//   function getSelectedBins() {
//     var selectedBins = [];
//     $(".selected-bin").each(function () {
//       selectedBins.push($(this).attr("data-bin-id"));
//     });
//     return selectedBins;
//   }

//   showChartStatus("Chart will be displayed here!");
// });

$(document).ready(function () {
  var chartContainer = $("#chart-container");

  function showChartStatus(message) {
    if (message) {
      chartContainer.append(
        '<div id="chartStatus" class="chart-status">' + message + "</div>"
      );
    } else {
      $("#chartStatus").remove();
    }
  }

  function generateCharts(data) {
    chartContainer.empty(); // Clear previous charts
    console.log("Generating charts with data:", data);

    if (
      data &&
      data.status === "OK" &&
      Array.isArray(data.data) &&
      data.data.length > 0
    ) {
      data.data.forEach(function (chartData, index) {
        var canvasId = "chart" + index;
        console.log("Creating chart with canvas ID:", canvasId);
        chartContainer.append(
          '<div class="chart-wrapper"><canvas id="' +
            canvasId +
            '"></canvas></div>'
        );

        var ctx = document.getElementById(canvasId).getContext("2d");

        var allXValues = Array.from(
          new Set([...chartData.histogram_x, ...chartData.norm_dist_x])
        ).sort((a, b) => a - b);

        function interpolateYValues(xValues, xData, yData) {
          return xValues.map((x) => {
            const index = xData.indexOf(x);
            if (index !== -1) {
              return yData[index];
            } else {
              const lowerIndex = xData.findIndex((val) => val > x) - 1;
              const upperIndex = lowerIndex + 1;
              if (lowerIndex < 0 || upperIndex >= xData.length) {
                return 0;
              }
              const x1 = xData[lowerIndex];
              const x2 = xData[upperIndex];
              const y1 = yData[lowerIndex];
              const y2 = yData[upperIndex];
              return y1 + ((y2 - y1) * (x - x1)) / (x2 - x1);
            }
          });
        }

        var histogramYValues = allXValues.map((x) => {
          const index = chartData.histogram_x.indexOf(x);
          return index !== -1 ? chartData.histogram_y[index] : 0;
        });

        var normDistYValues = interpolateYValues(
          allXValues,
          chartData.norm_dist_x,
          chartData.norm_dist_y
        );

        new Chart(ctx, {
          type: "bar",
          data: {
            labels: allXValues.map(String),
            datasets: [
              {
                label: chartData.title,
                data: histogramYValues,
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
                yAxisID: "y-histogram",
              },
              {
                label: "Normal Distribution",
                data: normDistYValues,
                type: "line",
                borderColor: "rgba(255, 99, 132, 1)",
                fill: false,
                yAxisID: "y-normal",
                pointRadius: 3,
                tension: 0.4,
                borderDash: [],
                pointStyle: "circle",
              },
            ],
          },
          options: {
            scales: {
              "y-histogram": {
                type: "linear",
                position: "left",
                beginAtZero: true,
                max: Math.max(...histogramYValues) + 5,
              },
              "y-normal": {
                type: "linear",
                position: "right",
                beginAtZero: true,
                max: Math.max(...normDistYValues) + 1,
                grid: {
                  drawOnChartArea: false,
                },
              },
              x: {
                beginAtZero: true,
              },
            },
          },
        });
      });

      showChartStatus("");
    } else {
      console.error("Invalid chart data received:", data);
      showChartStatus("Failed to generate chart. Invalid data.");
    }
  }

  $("#generate-chart").click(function () {
    var formData = {
      customer: $("#customer").val(),
      product_id: parseInt($("#product").val()),
      "pass bin": $("#pass_bin").is(":checked"),
      start_time: $("#date_range_start").val(),
      end_time: $("#date_range_end").val(),
      bin: getSelectedBins(),
    };

    console.log("Form Data to send:", formData);

    $.ajax({
      url: "/generate_chart/",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(formData),
      success: function (response) {
        console.log("Chart generated successfully:", response);
        generateCharts(response);
      },
      error: function (xhr, status, error) {
        console.error("Error generating chart:", error, xhr.responseText);
        alert("Error generating chart. Please check console for details.");
        showChartStatus("Error generating chart. Check console for details.");
      },
    });
  });

  function getSelectedBins() {
    var selectedBins = [];
    $(".selected-bin").each(function () {
      selectedBins.push($(this).attr("data-bin-id"));
    });
    return selectedBins;
  }

  showChartStatus("Chart will be displayed here!");
});
