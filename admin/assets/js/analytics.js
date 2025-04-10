// Updated chart colors for a professional look
const chartColors = {
  primary: "#4e73df",
  success: "#1cc88a",
  danger: "#e74a3b",
  warning: "#f6c23e",
  info: "#36b9cc",
};

async function fetchTaxpayerRegistrationChart() {
  try {
    // Check if Chart.js is loaded
    if (typeof Chart === "undefined") {
      throw new Error("Chart.js is not loaded");
    }

    // Check if the canvas element exists
    const chartCanvas = document.getElementById("taxpayerPieChart");

    if (!chartCanvas) {
      throw new Error("Chart canvas or table element not found");
    }

    // Fetch data from API
    const response = await fetch(
      `${HOST}/analytics-taxpayers-total`, // Adjust endpoint as needed
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + authToken,
          "Content-Type": "application/json",
        },
      }
    );

    // Check if the response is OK
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    // Validate response structure
    if (!result || result.status !== "success" || !result.data) {
      throw new Error("Invalid data structure received");
    }

    // Extract data
    const totalVerified = parseInt(result.data.total_verified);
    const totalUnverified = parseInt(result.data.total_unverified);
    const totalRegistered = result.data.total_registered;

    // Prepare chart data
    const labels = ["Verified", "Unverified"];
    const dataValues = [
      result.data.percent_verified,
      result.data.percent_unverified,
    ];

    // Predefined color palette
    const backgroundColors = [
      "#28a745", // Green for Verified
      "#dc3545", // Red for Unverified
    ];

    // Get canvas context
    const ctx = chartCanvas.getContext("2d");

    // Destroy existing chart if it exists
    if (chartCanvas.chart) {
      chartCanvas.chart.destroy();
    }

    // Render new chart
    chartCanvas.chart = new Chart(ctx, {
      type: "pie",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Taxpayer Registration Status",
            data: dataValues,
            backgroundColor: backgroundColors,
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: "bottom",
            labels: {
              usePointStyle: true,
              pointStyle: "circle",
            },
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const value = context.parsed;
                const label = context.label;
                const count =
                  label === "Verified" ? totalVerified : totalUnverified;
                return `${label}: ${value.toFixed(2)}% (${count} taxpayers)`;
              },
            },
          },
        },
      },
    });
  } catch (error) {
    console.error("Error in taxpayer registration chart rendering:", error);

    // Optional: Display user-friendly error message
    const errorContainer = document.getElementById("chart-error-message");
    if (errorContainer) {
      errorContainer.textContent =
        "Unable to load taxpayer registration chart. Please try again later.";
      errorContainer.style.display = "block";
    }
  }
}

// Call the function when needed
fetchTaxpayerRegistrationChart();

async function fetchTaxpayerSegmentationChart() {
  try {
    // Check if Chart.js is loaded
    if (typeof Chart === "undefined") {
      throw new Error("Chart.js is not loaded");
    }

    // Check if the canvas element exists
    const chartCanvas = document.getElementById("taxpayerBarChart");

    if (!chartCanvas) {
      throw new Error("Chart canvas element not found");
    }

    // Fetch data from API
    const response = await fetch(
      `${HOST}/analytics-taxpayers-segmentation`, // Adjust endpoint as needed
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + authToken,
          "Content-Type": "application/json",
        },
      }
    );

    // Check if the response is OK
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    // Validate response structure
    if (!result || result.status !== "success" || !result.data) {
      throw new Error("Invalid data structure received");
    }

    // Extract data
    const categories = result.data.categories.map(
      (category) => category.category
    );
    const dataValues = result.data.categories.map(
      (category) => category.total_count
    );

    // Predefined color palette
    const backgroundColors = [
      chartColors.primary,
      chartColors.warning,
      chartColors.info,
    ];

    // Get canvas context
    const ctx = chartCanvas.getContext("2d");

    // Destroy existing chart if it exists
    if (chartCanvas.chart) {
      chartCanvas.chart.destroy();
    }

    // Render new chart
    chartCanvas.chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: categories,
        datasets: [
          {
            label: "Taxpayers",
            data: dataValues,
            backgroundColor: backgroundColors,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
        },
        scales: {
          x: { stacked: true },
          y: { stacked: true, beginAtZero: true },
        },
      },
    });
  } catch (error) {
    console.error("Error in taxpayer segmentation chart rendering:", error);

    // Optional: Display user-friendly error message
    const errorContainer = document.getElementById("chart-error-message");
    if (errorContainer) {
      errorContainer.textContent =
        "Unable to load taxpayer segmentation chart. Please try again later.";
      errorContainer.style.display = "block";
    }
  }
}

// Call the function when needed
fetchTaxpayerSegmentationChart();

// Compliance Rate (Doughnut/Gauge Chart)
async function fetchComplianceRateChart() {
  try {
    // Check if Chart.js is loaded
    if (typeof Chart === "undefined") {
      throw new Error("Chart.js is not loaded");
    }

    // Check if the canvas element exists
    const chartCanvas = document.getElementById("complianceGaugeChart");

    if (!chartCanvas) {
      throw new Error("Chart canvas element not found");
    }

    // Fetch data from API
    const response = await fetch(
      `${HOST}/analytics-compliance-rate`, // Adjust endpoint as needed
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + authToken,
          "Content-Type": "application/json",
        },
      }
    );

    // Check if the response is OK
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    // Validate response structure
    if (!result || result.status !== "success" || !result.data) {
      throw new Error("Invalid data structure received");
    }

    // Extract data
    const complianceRate = result.data.compliance_rate;
    const nonComplianceRate = result.data.non_compliance_rate;
    const compliantTaxpayers = result.data.compliant_taxpayers;
    const nonCompliantTaxpayers = result.data.non_compliant_taxpayers;

    // Get canvas context
    const ctx = chartCanvas.getContext("2d");

    // Destroy existing chart if it exists
    if (chartCanvas.chart) {
      chartCanvas.chart.destroy();
    }

    // Render new chart
    chartCanvas.chart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Compliant", "Non-Compliant"],
        datasets: [
          {
            data: [complianceRate, nonComplianceRate],
            backgroundColor: [chartColors.success, chartColors.danger],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: "bottom" },
          tooltip: {
            callbacks: {
              label: function (context) {
                const value = context.parsed;
                const label = context.label;
                const count =
                  label === "Compliant"
                    ? compliantTaxpayers
                    : nonCompliantTaxpayers;
                return `${label}: ${value.toFixed(2)}% (${count} taxpayers)`;
              },
            },
          },
        },
        cutout: "80%",
      },
    });
  } catch (error) {
    console.error("Error in compliance rate chart rendering:", error);

    // Optional: Display user-friendly error message
    const errorContainer = document.getElementById("chart-error-message");
    if (errorContainer) {
      errorContainer.textContent =
        "Unable to load compliance rate chart. Please try again later.";
      errorContainer.style.display = "block";
    }
  }
}

// Call the function when needed
fetchComplianceRateChart();

// Top Defaulters (Horizontal Bar Chart)
async function fetchTopDefaultersChart() {
  try {
    // Check if Chart.js is loaded
    if (typeof Chart === "undefined") {
      throw new Error("Chart.js is not loaded");
    }

    // Check if the canvas element exists
    const chartCanvas = document.getElementById("topDefaultersBarChart");

    if (!chartCanvas) {
      throw new Error("Chart canvas element not found");
    }

    // Fetch data from API
    const response = await fetch(
      `${HOST}/analytics-top-defaulters`, // Adjust endpoint as needed
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + authToken,
        },
      }
    );

    // Check if the response is OK
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    // Validate response structure
    if (!result || result.status !== "success" || !result.data) {
      throw new Error("Invalid data structure received");
    }

    // Extract data
    const labels = result.data.map(
      (item) => item.taxpayer_name + " " + item.taxpayer_surname || "Unknown"
    );
    const dataValues = result.data.map((item) => item.total_amount);

    // Get canvas context
    const ctx = chartCanvas.getContext("2d");

    // Destroy existing chart if it exists
    if (chartCanvas.chart) {
      chartCanvas.chart.destroy();
    }

    // Render new chart
    chartCanvas.chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Debt (₦)",
            data: dataValues,
            backgroundColor: chartColors.danger,
          },
        ],
      },
      options: {
        indexAxis: "y",
        responsive: true,
        plugins: {
          legend: { display: false },
        },
        scales: {
          x: { beginAtZero: true },
        },
      },
    });
  } catch (error) {
    console.error("Error in top defaulters chart rendering:", error);

    // Optional: Display user-friendly error message
    const errorContainer = document.getElementById("chart-error-message");
    if (errorContainer) {
      errorContainer.textContent =
        "Unable to load top defaulters chart. Please try again later.";
      errorContainer.style.display = "block";
    }
  }
}

// Call the function when needed
fetchTopDefaultersChart();

// Taxpayer Registration Trends (Line Chart)
async function fetchRegistrationTrendsChart() {
  try {
    // Check if Chart.js is loaded
    if (typeof Chart === "undefined") {
      throw new Error("Chart.js is not loaded");
    }

    // Check if the canvas element exists
    const chartCanvas = document.getElementById("registrationTrendsLineChart");

    if (!chartCanvas) {
      throw new Error("Chart canvas element not found");
    }

    // Fetch data from API
    const response = await fetch(
      `${HOST}/analytics-taxpayer-registration-trends`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + authToken,
        },
      }
    );

    // Check if the response is OK
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    // Validate response structure
    if (!result || result.status !== "success" || !result.data) {
      throw new Error("Invalid data structure received");
    }

    // Extract data
    const labels = result.data.map((item) =>
      new Date(item.registration_month).toLocaleString("default", {
        month: "short",
        year: "numeric",
      })
    );
    const dataValues = result.data.map((item) => item.total_registered);

    // Get canvas context
    const ctx = chartCanvas.getContext("2d");

    // Destroy existing chart if it exists
    if (chartCanvas.chart) {
      chartCanvas.chart.destroy();
    }

    // Render new chart
    chartCanvas.chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Registrations",
            data: dataValues,
            borderColor: chartColors.primary,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: "bottom" },
        },
      },
    });
  } catch (error) {
    console.error("Error in registration trends chart rendering:", error);

    // Optional: Display user-friendly error message
    const errorContainer = document.getElementById("chart-error-message");
    if (errorContainer) {
      errorContainer.textContent =
        "Unable to load registration trends chart. Please try again later.";
      errorContainer.style.display = "block";
    }
  }
}

// Call the function when needed
fetchRegistrationTrendsChart();

// Initialize the map centered on kano State
const kanoMap = L.map("geoHeatMapkano").setView([12.2287, 9.5616], 8); // kano State coordinates with zoom level 8

// Add OpenStreetMap tiles
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(kanoMap);

// Fetch data from API
async function fetchGeoHeatMapData() {
  try {
    const response = await fetch(`${HOST}/analytics-taxpayer-distribution`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + authToken,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result || result.status !== "success" || !result.data) {
      throw new Error("Invalid data structure received");
    }

    // Example data points in kano State
    const kanoDataPoints = result.data
      .filter((item) => item.state === "kano")
      .map((item) => ({
        name: item.lga || "Unknown",
        coords: getCoordinates(item.lga),
        count: item.taxpayer_count,
      }));

    // Add markers or circles for each location
    kanoDataPoints.forEach((point) => {
      L.circle(point.coords, {
        color: "blue",
        fillColor: "#007bff",
        fillOpacity: 0.5,
        radius: point.count * 100, // Adjust size based on count
      })
        .bindPopup(`<b>${point.name}</b><br>Taxpayers: ${point.count}`)
        .addTo(kanoMap);
    });
  } catch (error) {
    console.error("Error fetching geo heat map data:", error);
  }
}

// Function to get coordinates for a given LGA
function getCoordinates(lga) {
  const coordinates = {
    Dutse: [11.7591, 9.3389],
    Hadejia: [12.4539, 10.0419],
    Gumel: [12.6269, 9.3886],
    "Birnin Kudu": [11.4572, 9.4902],
    Auyo: [12.3333, 9.9333],
    Garki: [12.2256, 9.5286],
    Buji: [11.3833, 9.3],
    Babura: [12.7667, 8.8833],
  };
  return coordinates[lga] || [12.2287, 9.5616]; // Default to kano State center if LGA not found
}

// Call the function to fetch and render the data
fetchGeoHeatMapData();

// Placeholder for Geo Heat Map
// document.getElementById("geoHeatMap").innerHTML =
//   "<p>Interactive map placeholder</p>";

// Revenue Breakdown by Tax Type (Bar Chart)
async function fetchRevenueBreakdownChart() {
  try {
    // Check if Chart.js is loaded
    if (typeof Chart === "undefined") {
      throw new Error("Chart.js is not loaded");
    }

    // Check if the canvas element exists
    const chartCanvas = document.getElementById("revenueBreakdownChart");

    if (!chartCanvas) {
      throw new Error("Chart canvas element not found");
    }

    // Fetch data from API
    const response = await fetch(
      `${HOST}/analytics-taxpayer-revenue-breakdown`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + authToken,
        },
      }
    );

    // Check if the response is OK
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    // Validate response structure
    if (!result || result.status !== "success" || !result.data) {
      throw new Error("Invalid data structure received");
    }

    // Extract data
    const labels = result.data.map((item) => item.tax_type);
    const dataValues = result.data.map((item) => item.total_revenue);

    // Get canvas context
    const ctx = chartCanvas.getContext("2d");

    // Destroy existing chart if it exists
    if (chartCanvas.chart) {
      chartCanvas.chart.destroy();
    }

    // Render new chart
    chartCanvas.chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Revenue (₦)",
            data: dataValues,
            backgroundColor: ["#007bff", "#28a745", "#ffc107", "#dc3545"],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: { label: (ctx) => `₦${ctx.raw.toLocaleString()}` },
          },
        },
        scales: {
          x: { beginAtZero: true },
          y: { ticks: { callback: (value) => `₦${value.toLocaleString()}` } },
        },
      },
    });
  } catch (error) {
    console.error("Error in revenue breakdown chart rendering:", error);

    // Optional: Display user-friendly error message
    const errorContainer = document.getElementById("chart-error-message");
    if (errorContainer) {
      errorContainer.textContent =
        "Unable to load revenue breakdown chart. Please try again later.";
      errorContainer.style.display = "block";
    }
  }
}

// Call the function when needed
fetchRevenueBreakdownChart();

async function fetchZonalOfficePerformanceChart() {
  try {
    // Check if Chart.js is loaded
    if (typeof Chart === "undefined") {
      throw new Error("Chart.js is not loaded");
    }

    // Check if the canvas element exists
    const chartCanvas = document.getElementById("zonalOfficePerformanceChart");

    if (!chartCanvas) {
      throw new Error("Chart canvas element not found");
    }

    // Fetch data from API
    const response = await fetch(`${HOST}/zonal-office-performance`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Add any necessary authentication headers
      },
    });

    // Check if the response is OK
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    // Validate response structure
    if (!result || result.status !== "success" || !result.data) {
      throw new Error("Invalid data structure received");
    }

    // Extract data
    const labels = result.data.map((item) => item.zonal_office);
    const dataValues = result.data.map((item) => item.total_amount_paid);

    // Get canvas context
    const ctx = chartCanvas.getContext("2d");

    // Destroy existing chart if it exists
    if (chartCanvas.chart) {
      chartCanvas.chart.destroy();
    }

    // Render new chart
    chartCanvas.chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Revenue (₦)",
            data: dataValues,
            backgroundColor: ["#007bff", "#28a745", "#ffc107", "#dc3545"],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: { label: (ctx) => `₦${ctx.raw.toLocaleString()}` },
          },
        },
        scales: {
          x: { beginAtZero: true },
          y: { ticks: { callback: (value) => `₦${value.toLocaleString()}` } },
        },
      },
    });
  } catch (error) {
    console.error("Error in revenue breakdown chart rendering:", error);

    // Optional: Display user-friendly error message
    const errorContainer = document.getElementById("chart-error-message");
    if (errorContainer) {
      errorContainer.textContent =
        "Unable to load revenue breakdown chart. Please try again later.";
      errorContainer.style.display = "block";
    }
  }
}

// Call the function when needed
fetchZonalOfficePerformanceChart();

async function fetchTaxOfficePerformanceChart() {
  try {
    // Check if Chart.js is loaded
    if (typeof Chart === "undefined") {
      throw new Error("Chart.js is not loaded");
    }

    // Check if the canvas element exists
    const chartCanvas = document.getElementById("taxOfficePerformanceChart");

    if (!chartCanvas) {
      throw new Error("Chart canvas element not found");
    }

    // Fetch data from API
    const response = await fetch(`${HOST}/tax-office-performance`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Add any necessary authentication headers
      },
    });

    // Check if the response is OK
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    // Validate response structure
    if (!result || result.status !== "success" || !result.data) {
      throw new Error("Invalid data structure received");
    }

    // Extract data
    const labels = result.data.map((item) => item.office_name);
    const dataValues = result.data.map((item) => item.total_amount_paid);

    // Get canvas context
    const ctx = chartCanvas.getContext("2d");

    // Destroy existing chart if it exists
    if (chartCanvas.chart) {
      chartCanvas.chart.destroy();
    }

    // Render new chart
    chartCanvas.chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Revenue (₦)",
            data: dataValues,
            backgroundColor: ["#007bff", "#28a745", "#ffc107", "#dc3545"],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: { label: (ctx) => `₦${ctx.raw.toLocaleString()}` },
          },
        },
        scales: {
          x: { beginAtZero: true },
          y: { ticks: { callback: (value) => `₦${value.toLocaleString()}` } },
        },
      },
    });
  } catch (error) {
    console.error("Error in revenue breakdown chart rendering:", error);

    // Optional: Display user-friendly error message
    const errorContainer = document.getElementById("chart-error-message");
    if (errorContainer) {
      errorContainer.textContent =
        "Unable to load revenue breakdown chart. Please try again later.";
      errorContainer.style.display = "block";
    }
  }
}

// Call the function when needed
fetchTaxOfficePerformanceChart();

// // Rate Utilization Statistics (Column Chart)
// const rateUtilizationCtx = document
//   .getElementById("rateUtilizationChart")
//   .getContext("2d");
// new Chart(rateUtilizationCtx, {
//   type: "bar",
//   data: {
//     labels: ["5%", "7.5%", "10%", "15%", "20%"],
//     datasets: [
//       {
//         label: "Utilization Frequency",
//         data: [20, 35, 40, 25, 10],
//         backgroundColor: "#6c757d",
//         borderWidth: 1,
//       },
//     ],
//   },
//   options: {
//     responsive: true,
//     plugins: {
//       legend: { display: false },
//       tooltip: { callbacks: { label: (ctx) => `${ctx.raw} times` } },
//     },
//     scales: {
//       x: { beginAtZero: true },
//       y: { ticks: { callback: (value) => `${value} times` } },
//     },
//   },
// });

// Revenue Breakdown by Tax Type (Bar Chart)
async function fetchRateUtilizationChart() {
  try {
    // Check if Chart.js is loaded
    if (typeof Chart === "undefined") {
      throw new Error("Chart.js is not loaded");
    }

    // Check if the canvas element exists
    const chartCanvas = document.getElementById("rateUtilizationChart");

    if (!chartCanvas) {
      throw new Error("Chart canvas element not found");
    }

    // Fetch data from API
    const response = await fetch(
      `${HOST}/analytics-rate-utilization-statistics`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + authToken,
        },
      }
    );

    // Check if the response is OK
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    // Validate response structure
    if (!result || result.status !== "success" || !result.data) {
      throw new Error("Invalid data structure received");
    }

    // Extract data
    const labels = result.data.map((item) => item.tax_type);
    const dataValues = result.data.map((item) => item.total_amount);

    // Get canvas context
    const ctx = chartCanvas.getContext("2d");

    // Destroy existing chart if it exists
    if (chartCanvas.chart) {
      chartCanvas.chart.destroy();
    }

    // Render new chart
    chartCanvas.chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Revenue (₦)",
            data: dataValues,
            backgroundColor: ["#007bff", "#28a745", "#ffc107", "#dc3545"],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: { label: (ctx) => `₦${ctx.raw.toLocaleString()}` },
          },
        },
        scales: {
          x: { beginAtZero: true },
          y: { ticks: { callback: (value) => `₦${value.toLocaleString()}` } },
        },
      },
    });
  } catch (error) {
    console.error("Error in revenue breakdown chart rendering:", error);

    // Optional: Display user-friendly error message
    const errorContainer = document.getElementById("chart-error-message");
    if (errorContainer) {
      errorContainer.textContent =
        "Unable to load revenue breakdown chart. Please try again later.";
      errorContainer.style.display = "block";
    }
  }
}

// Call the function when needed
fetchRateUtilizationChart();

// Exemptions and Special Rate Applications (Stacked Area Chart)
// const exemptionsCtx = document
//   .getElementById("exemptionsChart")
//   .getContext("2d");
// new Chart(exemptionsCtx, {
//   type: "line",
//   data: {
//     labels: ["2020", "2021", "2022", "2023", "2024"],
//     datasets: [
//       {
//         label: "Corporate Tax Exemptions",
//         data: [100, 150, 200, 250, 300],
//         backgroundColor: "rgba(0, 123, 255, 0.3)",
//         borderColor: "#007bff",
//         fill: true,
//       },
//       {
//         label: "VAT Exemptions",
//         data: [50, 80, 120, 170, 210],
//         backgroundColor: "rgba(40, 167, 69, 0.3)",
//         borderColor: "#28a745",
//         fill: true,
//       },
//       {
//         label: "Property Tax Exemptions",
//         data: [20, 40, 60, 80, 100],
//         backgroundColor: "rgba(220, 53, 69, 0.3)",
//         borderColor: "#dc3545",
//         fill: true,
//       },
//     ],
//   },
//   options: {
//     responsive: true,
//     plugins: {
//       tooltip: {
//         callbacks: { label: (ctx) => `${ctx.raw} applications` },
//       },
//     },
//     scales: {
//       x: { beginAtZero: true },
//       y: { ticks: { callback: (value) => `${value} apps` } },
//     },
//   },
// });

// Number of Invoices Generated (Line Chart)
async function fetchInvoicesGeneratedChart() {
  try {
    // Check if Chart.js is loaded
    if (typeof Chart === "undefined") {
      throw new Error("Chart.js is not loaded");
    }

    // Check if the canvas element exists
    const chartCanvas = document.getElementById("invoicesGeneratedChart");

    if (!chartCanvas) {
      throw new Error("Chart canvas element not found");
    }

    // Fetch data from API
    const response = await fetch(`${HOST}/analytics-invoices-generated`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + authToken,
      },
    });

    // Check if the response is OK
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    // Validate response structure
    if (!result || result.status !== "success" || !result.data) {
      throw new Error("Invalid data structure received");
    }

    // Extract data
    const labels = result.data.map((item) =>
      new Date(item.year_month).toLocaleString("default", {
        month: "short",
        year: "numeric",
      })
    );
    const dataValues = result.data.map((item) => item.total_invoices);

    // Get canvas context
    const ctx = chartCanvas.getContext("2d");

    // Destroy existing chart if it exists
    if (chartCanvas.chart) {
      chartCanvas.chart.destroy();
    }

    // Render new chart
    chartCanvas.chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Invoices Generated",
            data: dataValues,
            borderColor: "#007bff",
            backgroundColor: "rgba(0, 123, 255, 0.2)",
            tension: 0.4,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          tooltip: { callbacks: { label: (ctx) => `${ctx.raw} invoices` } },
        },
        scales: { y: { beginAtZero: true } },
      },
    });
  } catch (error) {
    console.error("Error in invoices generated chart rendering:", error);

    // Optional: Display user-friendly error message
    const errorContainer = document.getElementById("chart-error-message");
    if (errorContainer) {
      errorContainer.textContent =
        "Unable to load invoices generated chart. Please try again later.";
      errorContainer.style.display = "block";
    }
  }
}

// Call the function when needed
fetchInvoicesGeneratedChart();

// Average Billing Amount by Taxpayer Category (Bar Chart)
async function fetchAvgBillingChart() {
  try {
    // Check if Chart.js is loaded
    if (typeof Chart === "undefined") {
      throw new Error("Chart.js is not loaded");
    }

    // Check if the canvas element exists
    const chartCanvas = document.getElementById("avgBillingChart");

    if (!chartCanvas) {
      throw new Error("Chart canvas element not found");
    }

    // Fetch data from API
    const response = await fetch(`${HOST}/analytics-average-billing`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + authToken,
      },
    });

    // Check if the response is OK
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    // Validate response structure
    if (!result || result.status !== "success" || !result.data) {
      throw new Error("Invalid data structure received");
    }

    // Extract data
    const labels = result.data.map((item) => item.category || "Unknown");
    const dataValues = result.data.map((item) =>
      parseFloat(item.avg_billing_amount)
    );

    // Get canvas context
    const ctx = chartCanvas.getContext("2d");

    // Destroy existing chart if it exists
    if (chartCanvas.chart) {
      chartCanvas.chart.destroy();
    }

    // Render new chart
    chartCanvas.chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Average Billing Amount (₦)",
            data: dataValues,
            backgroundColor: ["#28a745", "#ffc107", "#dc3545"],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          tooltip: {
            callbacks: { label: (ctx) => `₦${ctx.raw.toLocaleString()}` },
          },
        },
        scales: {
          y: { ticks: { callback: (value) => `₦${value.toLocaleString()}` } },
        },
      },
    });
  } catch (error) {
    console.error("Error in average billing chart rendering:", error);

    // Optional: Display user-friendly error message
    const errorContainer = document.getElementById("chart-error-message");
    if (errorContainer) {
      errorContainer.textContent =
        "Unable to load average billing chart. Please try again later.";
      errorContainer.style.display = "block";
    }
  }
}

// Call the function when needed
fetchAvgBillingChart();

// Total Unpaid Invoices (Column Chart)
async function fetchUnpaidInvoicesChart() {
  try {
    // Check if Chart.js is loaded
    if (typeof Chart === "undefined") {
      throw new Error("Chart.js is not loaded");
    }

    // Check if the canvas element exists
    const chartCanvas = document.getElementById("unpaidInvoicesChart");

    if (!chartCanvas) {
      throw new Error("Chart canvas element not found");
    }

    // Fetch data from API
    const response = await fetch(`${HOST}/analytics-unpaid-invoices`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + authToken,
      },
    });

    // Check if the response is OK
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    // Validate response structure
    if (!result || result.status !== "success" || !result.data) {
      throw new Error("Invalid data structure received");
    }

    // Extract data
    const labels = Object.keys(result.data).map((date) =>
      new Date(date).toLocaleString("default", {
        month: "short",
        year: "numeric",
      })
    );
    const dataValues = Object.values(result.data).map(
      (item) => item.total_unpaid_invoices
    );

    // Get canvas context
    const ctx = chartCanvas.getContext("2d");

    // Destroy existing chart if it exists
    if (chartCanvas.chart) {
      chartCanvas.chart.destroy();
    }

    // Render new chart
    chartCanvas.chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Unpaid Invoices",
            data: dataValues,
            backgroundColor: "#6c757d",
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          tooltip: { callbacks: { label: (ctx) => `${ctx.raw} invoices` } },
        },
        scales: { y: { beginAtZero: true } },
      },
    });
  } catch (error) {
    console.error("Error in unpaid invoices chart rendering:", error);

    // Optional: Display user-friendly error message
    const errorContainer = document.getElementById("chart-error-message");
    if (errorContainer) {
      errorContainer.textContent =
        "Unable to load unpaid invoices chart. Please try again later.";
      errorContainer.style.display = "block";
    }
  }
}

// Call the function when needed
fetchUnpaidInvoicesChart();

// Outstanding Amounts (Pie Chart)
const outstandingAmountsCtx = document
  .getElementById("outstandingAmountsChart")
  .getContext("2d");
new Chart(outstandingAmountsCtx, {
  type: "pie",
  data: {
    labels: ["Individuals", "SMEs", "Corporations"],
    datasets: [
      {
        label: "Outstanding Amounts",
        data: [1000000, 5000000, 3000000],
        backgroundColor: ["#007bff", "#28a745", "#ffc107"],
      },
    ],
  },
  options: {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: { label: (ctx) => `₦${ctx.raw.toLocaleString()}` },
      },
    },
  },
});

async function fetchInvoiceCountByCategoryChart() {
  try {
    const response = await fetch(`${HOST}/invoice-count-by-category`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    if (!result || result.status !== "success" || !result.data) {
      throw new Error("Invalid data structure received");
    }

    // Extract data
    const labels = result.data.map((item) => item.user_category);
    const collectedData = result.data.map((item) => item.invoice_count);

    // Invoice Count by Category (Pie Chart)
    const invoiceCountCtx = document
      .getElementById("invoiceCountByCategoryChart")
      .getContext("2d");
    new Chart(invoiceCountCtx, {
      type: "pie",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Invoice Count",
            data: collectedData,
            backgroundColor: ["#007bff", "#28a745", "#ffc107"],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          tooltip: {
            callbacks: { label: (ctx) => `${ctx.raw} invoices` },
          },
        },
      },
    });
  } catch (error) {
    console.error("Error fetching invoice count by category data:", error);
  }
}
fetchInvoiceCountByCategoryChart();

async function fetchInvoiceCountByCategoryPaidChart() {
  try {
    const response = await fetch(
      `${HOST}/invoice-count-by-category?payment_status=paid`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    if (!result || result.status !== "success" || !result.data) {
      throw new Error("Invalid data structure received");
    }

    // Extract data
    const labels = result.data.map((item) => item.user_category);
    const collectedData = result.data.map((item) => item.invoice_count);

    // Invoice Count by Category (Pie Chart)
    const invoiceCountCtx = document
      .getElementById("invoiceCountByCategoryPaidChart")
      .getContext("2d");
    new Chart(invoiceCountCtx, {
      type: "pie",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Invoice Count",
            data: collectedData,
            backgroundColor: ["#007bff", "#28a745", "#ffc107"],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          tooltip: {
            callbacks: { label: (ctx) => `${ctx.raw} invoices` },
          },
        },
      },
    });
  } catch (error) {
    console.error("Error fetching invoice count by category data:", error);
  }
}
fetchInvoiceCountByCategoryPaidChart();
// Collection Performance by Tax Period (Line Chart)

async function fetchCollectionPerformanceData() {
  try {
    const response = await fetch(`${HOST}/analytics-collection-performance`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    if (!result || result.status !== "success" || !result.data) {
      throw new Error("Invalid data structure received");
    }

    const collectionPerformanceCtx = document
      .getElementById("collectionPerformanceChart")
      .getContext("2d");

    const labels = Object.keys(result.data);
    const collectedData = labels.map((key) => result.data[key].total_collected);
    const outstandingData = labels.map(
      (key) => result.data[key].total_outstanding
    );

    new Chart(collectionPerformanceCtx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Total Collected (₦)",
            data: collectedData,
            borderColor: "#17a2b8",
            backgroundColor: "rgba(23, 162, 184, 0.2)",
            tension: 0.4,
            fill: true,
          },
          {
            label: "Total Outstanding (₦)",
            data: outstandingData,
            borderColor: "#dc3545",
            backgroundColor: "rgba(220, 53, 69, 0.2)",
            tension: 0.4,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          tooltip: {
            callbacks: {
              label: (ctx) => `₦${ctx.raw.toLocaleString()}`,
            },
          },
        },
        scales: {
          y: {
            ticks: {
              callback: (value) => `₦${value.toLocaleString()}`,
            },
          },
        },
      },
    });
  } catch (error) {
    console.error("Error fetching collection performance data:", error);
  }
}

fetchCollectionPerformanceData();

// Total Payments Received
async function fetchTotalPaymentsChart() {
  try {
    // Check if Chart.js is loaded
    if (typeof Chart === "undefined") {
      throw new Error("Chart.js is not loaded");
    }

    // Check if the canvas element exists
    const chartCanvas = document.getElementById("totalPaymentsChart");

    if (!chartCanvas) {
      throw new Error("Chart canvas element not found");
    }

    // Fetch data from API
    const response = await fetch(`${HOST}/analytics-payments-by-year-month`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + authToken,
      },
    });

    // Check if the response is OK
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    // Validate response structure
    if (!result || result.status !== "success" || !result.data) {
      throw new Error("Invalid data structure received");
    }

    // Extract data
    const labels = result.data.payments.map((item) =>
      new Date(item.year_months).toLocaleString("default", {
        month: "short",
        year: "numeric",
      })
    );
    const dataValues = result.data.payments.map((item) =>
      parseFloat(item.total_payments)
    );

    // Get canvas context
    const ctx = chartCanvas.getContext("2d");

    // Destroy existing chart if it exists
    if (chartCanvas.chart) {
      chartCanvas.chart.destroy();
    }

    // Render new chart
    chartCanvas.chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Total Payments (₦)",
            data: dataValues,
            borderColor: "#4caf50",
            borderWidth: 2,
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          tooltip: {
            callbacks: { label: (ctx) => `₦${ctx.raw.toLocaleString()}` },
          },
        },
        scales: {
          y: { ticks: { callback: (value) => `₦${value.toLocaleString()}` } },
        },
      },
    });
  } catch (error) {
    console.error("Error in total payments chart rendering:", error);

    // Optional: Display user-friendly error message
    const errorContainer = document.getElementById("chart-error-message");
    if (errorContainer) {
      errorContainer.textContent =
        "Unable to load total payments chart. Please try again later.";
      errorContainer.style.display = "block";
    }
  }
}

// Call the function when needed
fetchTotalPaymentsChart();

// Payment Methods Utilized
async function fetchPaymentMethodsChart() {
  try {
    // Check if Chart.js is loaded
    if (typeof Chart === "undefined") {
      throw new Error("Chart.js is not loaded");
    }

    // Check if the canvas element exists
    const chartCanvas = document.getElementById("paymentMethodsChart");

    if (!chartCanvas) {
      throw new Error("Chart canvas element not found");
    }

    // Fetch data from API
    const response = await fetch(`${HOST}/analytics-payment-methods-utilized`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + authToken,
      },
    });

    // Check if the response is OK
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    // Validate response structure
    if (!result || result.status !== "success" || !result.data) {
      throw new Error("Invalid data structure received");
    }

    // Extract data
    const labels = result.data.payment_methods.map(
      (item) => item.payment_method
    );
    const dataValues = result.data.payment_methods.map(
      (item) => item.percentage
    );

    // Get canvas context
    const ctx = chartCanvas.getContext("2d");

    // Destroy existing chart if it exists
    if (chartCanvas.chart) {
      chartCanvas.chart.destroy();
    }

    // Render new chart
    chartCanvas.chart = new Chart(ctx, {
      type: "pie",
      data: {
        labels: labels,
        datasets: [
          {
            data: dataValues,
            backgroundColor: ["#2196f3", "#4caf50", "#ff9800", "#f44336"],
          },
        ],
      },
    });
  } catch (error) {
    console.error("Error in payment methods chart rendering:", error);

    // Optional: Display user-friendly error message
    const errorContainer = document.getElementById("chart-error-message");
    if (errorContainer) {
      errorContainer.textContent =
        "Unable to load payment methods chart. Please try again later.";
      errorContainer.style.display = "block";
    }
  }
}

// Call the function when needed
fetchPaymentMethodsChart();

// Pending Payments
// const pendingPaymentsCtx = document
//   .getElementById("pendingPaymentsChart")
//   .getContext("2d");
// new Chart(pendingPaymentsCtx, {
//   type: "bar",
//   data: {
//     labels: ["January", "February", "March", "April", "May", "June"],
//     datasets: [
//       {
//         label: "Pending Payments",
//         data: [15, 20, 10, 25, 30, 5],
//         backgroundColor: "#f57c00",
//       },
//     ],
//   },
// });

// Top Payers (Horizontal Bar Chart)
async function fetchTopPayersChart() {
  try {
    // Check if Chart.js is loaded
    if (typeof Chart === "undefined") {
      throw new Error("Chart.js is not loaded");
    }

    // Check if the canvas element exists
    const chartCanvas = document.getElementById("topPayersChart");

    if (!chartCanvas) {
      throw new Error("Chart canvas element not found");
    }

    // Fetch data from API
    const response = await fetch(`${HOST}/analytics-top-payers`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + authToken,
      },
    });

    // Check if the response is OK
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    // Validate response structure
    if (!result || result.status !== "success" || !result.data) {
      throw new Error("Invalid data structure received");
    }

    // Extract data
    const labels = result.data.top_payers.map(
      (payer) =>
        `${payer.first_name || ""} ${payer.surname || ""}`.trim() || "Unknown"
    );
    const dataValues = result.data.top_payers.map((payer) =>
      parseFloat(payer.total_paid)
    );

    // Get canvas context
    const ctx = chartCanvas.getContext("2d");

    // Destroy existing chart if it exists
    if (chartCanvas.chart) {
      chartCanvas.chart.destroy();
    }

    // Render new chart
    chartCanvas.chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Amount Paid (₦)",
            data: dataValues,
            backgroundColor: "#673ab7",
          },
        ],
      },
      options: {
        indexAxis: "y", // Makes the bar chart horizontal
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: (ctx) => `₦${ctx.raw.toLocaleString()}`,
            },
          },
        },
        scales: {
          x: {
            beginAtZero: true,
            ticks: {
              callback: (value) => `₦${value.toLocaleString()}`,
            },
          },
        },
      },
    });
  } catch (error) {
    console.error("Error in top payers chart rendering:", error);

    // Optional: Display user-friendly error message
    const errorContainer = document.getElementById("chart-error-message");
    if (errorContainer) {
      errorContainer.textContent =
        "Unable to load top payers chart. Please try again later.";
      errorContainer.style.display = "block";
    }
  }
}

// Call the function when needed
fetchTopPayersChart();

// Average Payment Processing Time (Histogram-like Bar Chart)
async function fetchProcessingTimeChart() {
  try {
    // Check if Chart.js is loaded
    if (typeof Chart === "undefined") {
      throw new Error("Chart.js is not loaded");
    }

    // Check if the canvas element exists
    const chartCanvas = document.getElementById("processingTimeChart");

    if (!chartCanvas) {
      throw new Error("Chart canvas element not found");
    }

    // Fetch data from API
    const response = await fetch(`${HOST}/analytics-average-processing-time`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + authToken,
      },
    });

    // Check if the response is OK
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    // Validate response structure
    if (!result || result.status !== "success" || !result.data) {
      throw new Error("Invalid data structure received");
    }

    // Extract data
    const labels = result.data.map((item) =>
      new Date(item.year_month).toLocaleString("default", {
        month: "short",
        year: "numeric",
      })
    );
    const dataValues = result.data.map((item) =>
      parseFloat(item.average_processing_time_days)
    );

    // Get canvas context
    const ctx = chartCanvas.getContext("2d");

    // Destroy existing chart if it exists
    if (chartCanvas.chart) {
      chartCanvas.chart.destroy();
    }

    // Render new chart
    chartCanvas.chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Average Processing Time (Days)",
            data: dataValues,
            backgroundColor: "#03a9f4",
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: (ctx) => `${ctx.raw.toFixed(2)} days`,
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => `${value} days`,
            },
          },
        },
      },
    });
  } catch (error) {
    console.error("Error in processing time chart rendering:", error);

    // Optional: Display user-friendly error message
    const errorContainer = document.getElementById("chart-error-message");
    if (errorContainer) {
      errorContainer.textContent =
        "Unable to load processing time chart. Please try again later.";
      errorContainer.style.display = "block";
    }
  }
}

// Call the function when needed
fetchProcessingTimeChart();

// Total TCCs Issued (Pending, Rejected)
async function fetchTccIssuedChart() {
  try {
    // Check if Chart.js is loaded
    if (typeof Chart === "undefined") {
      throw new Error("Chart.js is not loaded");
    }

    // Check if the canvas element exists
    const chartCanvas = document.getElementById("tccIssuedChart");

    if (!chartCanvas) {
      throw new Error("Chart canvas element not found");
    }

    // Fetch data from API
    const response = await fetch(`${HOST}/analytics-total-issued-by-month`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + authToken,
      },
    });

    // Check if the response is OK
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    // Validate response structure
    if (!result || result.status !== "success" || !result.data) {
      throw new Error("Invalid data structure received");
    }

    // Extract data
    const labels = result.data.map((item) =>
      new Date(item.year_months).toLocaleString("default", {
        month: "short",
        year: "numeric",
      })
    );
    const pendingData = result.data.map((item) => item.total_pending);
    const rejectedData = result.data.map((item) => item.total_rejected);

    // Get canvas context
    const ctx = chartCanvas.getContext("2d");

    // Destroy existing chart if it exists
    if (chartCanvas.chart) {
      chartCanvas.chart.destroy();
    }

    // Render new chart
    chartCanvas.chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Pending",
            data: pendingData,
            backgroundColor: "#ffa726",
          },
          {
            label: "Rejected",
            data: rejectedData,
            backgroundColor: "#ef5350",
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: "top",
          },
        },
        scales: {
          x: {
            stacked: true,
            title: {
              display: true,
              text: "Months",
            },
          },
          y: {
            stacked: true,
            title: {
              display: true,
              text: "Count",
            },
            beginAtZero: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("Error in TCC issued chart rendering:", error);

    // Optional: Display user-friendly error message
    const errorContainer = document.getElementById("chart-error-message");
    if (errorContainer) {
      errorContainer.textContent =
        "Unable to load TCC issued chart. Please try again later.";
      errorContainer.style.display = "block";
    }
  }
}

// Call the function when needed
fetchTccIssuedChart();

// Average Time to Process TCC (Line Chart)
async function fetchTccProcessingTimeChart() {
  try {
    // Check if Chart.js is loaded
    if (typeof Chart === "undefined") {
      throw new Error("Chart.js is not loaded");
    }

    // Check if the canvas element exists
    const chartCanvas = document.getElementById("tccProcessingTimeChart");

    if (!chartCanvas) {
      throw new Error("Chart canvas element not found");
    }

    // Fetch data from API
    const response = await fetch(
      `${HOST}/analytics-tcc-average-processing-time`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + authToken,
        },
      }
    );

    // Check if the response is OK
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    // Validate response structure
    if (!result || result.status !== "success" || !result.data) {
      throw new Error("Invalid data structure received");
    }

    // Extract data
    const labels = result.data.map((item) =>
      new Date(item.year_months).toLocaleString("default", {
        month: "short",
        year: "numeric",
      })
    );
    const dataValues = result.data.map((item) =>
      parseFloat(item.avg_processing_time_days)
    );

    // Get canvas context
    const ctx = chartCanvas.getContext("2d");

    // Destroy existing chart if it exists
    if (chartCanvas.chart) {
      chartCanvas.chart.destroy();
    }

    // Render new chart
    chartCanvas.chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Processing Time (Days)",
            data: dataValues,
            borderColor: "#29b6f6",
            backgroundColor: "rgba(41, 182, 246, 0.2)",
            fill: true,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: "top",
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: "Months",
            },
          },
          y: {
            title: {
              display: true,
              text: "Days",
            },
            beginAtZero: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("Error in TCC processing time chart rendering:", error);

    // Optional: Display user-friendly error message
    const errorContainer = document.getElementById("chart-error-message");
    if (errorContainer) {
      errorContainer.textContent =
        "Unable to load TCC processing time chart. Please try again later.";
      errorContainer.style.display = "block";
    }
  }
}

// Call the function when needed
fetchTccProcessingTimeChart();

// Percentage of Taxpayers with Valid TCCs (Gauge Chart)
async function fetchValidTccGaugeChart() {
  try {
    // Check if Chart.js is loaded
    if (typeof Chart === "undefined") {
      throw new Error("Chart.js is not loaded");
    }

    // Check if the canvas element exists
    const chartCanvas = document.getElementById("validTccGaugeChart");

    if (!chartCanvas) {
      throw new Error("Chart canvas element not found");
    }

    // Fetch data from API
    const response = await fetch(`${HOST}/analytics-tcc-validity-percentage`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + authToken,
      },
    });

    // Check if the response is OK
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    // Validate response structure
    if (!result || result.status !== "success" || !result.data) {
      throw new Error("Invalid data structure received");
    }

    // Extract data
    const validTccPercentage = result.data.valid_tcc_percentage;
    const invalidTccPercentage = result.data.invalid_tcc_percentage;
    const validTccCount = result.data.valid_tcc_count;
    const invalidTccCount = result.data.invalid_tcc_count;

    // Get canvas context
    const ctx = chartCanvas.getContext("2d");

    // Destroy existing chart if it exists
    if (chartCanvas.chart) {
      chartCanvas.chart.destroy();
    }

    // Render new chart
    chartCanvas.chart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Valid TCCs", "Invalid TCCs"],
        datasets: [
          {
            data: [validTccPercentage, invalidTccPercentage],
            backgroundColor: ["#66bb6a", "#cfd8dc"],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        cutout: "75%", // Makes it look like a gauge
        rotation: -90,
        circumference: 180,
        plugins: {
          tooltip: {
            callbacks: {
              label: function (context) {
                const value = context.raw;
                const label = context.label;
                const count =
                  label === "Valid TCCs" ? validTccCount : invalidTccCount;
                return `${label}: ${value}% (${count} taxpayers)`;
              },
            },
          },
        },
      },
    });
  } catch (error) {
    console.error("Error in valid TCC gauge chart rendering:", error);

    // Optional: Display user-friendly error message
    const errorContainer = document.getElementById("chart-error-message");
    if (errorContainer) {
      errorContainer.textContent =
        "Unable to load valid TCC gauge chart. Please try again later.";
      errorContainer.style.display = "block";
    }
  }
}

// Call the function when needed
fetchValidTccGaugeChart();

// Revenue Breakdown by Tax Type (Bar Chart)
async function fetchMdaPerformanceChart() {
  try {
    // Check if Chart.js is loaded
    if (typeof Chart === "undefined") {
      throw new Error("Chart.js is not loaded");
    }

    // Check if the canvas element exists
    const chartCanvas = document.getElementById("mdaPerformanceChart");

    if (!chartCanvas) {
      throw new Error("Chart canvas element not found");
    }

    // Fetch data from API
    const response = await fetch(`${HOST}/get-mda-performance`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Add any necessary authentication headers
      },
    });

    // Check if the response is OK
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    // Validate response structure
    if (!result || result.status !== "success" || !result.data) {
      throw new Error("Invalid data structure received");
    }

    // Extract data
    const labels = result.data.map((item) => item.mda_name);
    const dataValues = result.data.map((item) => item.total_revenue);

    // Get canvas context
    const ctx = chartCanvas.getContext("2d");

    // Destroy existing chart if it exists
    if (chartCanvas.chart) {
      chartCanvas.chart.destroy();
    }

    // Render new chart
    chartCanvas.chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Revenue (₦)",
            data: dataValues,
            backgroundColor: ["#007bff", "#28a745", "#ffc107", "#dc3545"],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: { label: (ctx) => `₦${ctx.raw.toLocaleString()}` },
          },
        },
        scales: {
          x: { beginAtZero: true },
          y: { ticks: { callback: (value) => `₦${value.toLocaleString()}` } },
        },
      },
    });
  } catch (error) {
    console.error("Error in revenue breakdown chart rendering:", error);

    // Optional: Display user-friendly error message
    const errorContainer = document.getElementById("chart-error-message");
    if (errorContainer) {
      errorContainer.textContent =
        "Unable to load revenue breakdown chart. Please try again later.";
      errorContainer.style.display = "block";
    }
  }
}

// Call the function when needed
fetchMdaPerformanceChart();

async function fetchLgaPerformance() {
  const startDate = document.getElementById("lgaStartDate").value;
  const endDate = document.getElementById("lgaEndDate").value;

  const url = `${HOST}/lga-performance?start_date=${startDate}&end_date=${endDate}`;

  try {
    const response = await fetch(url);
    const res = await response.json();
    const topPerformingLgas = res.data.top_performing_lgas;
    const leastPerformingLgas = res.data.least_performing_lgas;

    // Prepare data for the charts
    const topLgaLabels = topPerformingLgas.map((item) => item.lga);
    const topLgaRevenues = topPerformingLgas.map((item) =>
      parseFloat(item.total_revenue)
    );

    const leastLgaLabels = leastPerformingLgas.map((item) => item.lga);
    const leastLgaRevenues = leastPerformingLgas.map((item) =>
      parseFloat(item.total_revenue)
    );

    // Render the charts
    await renderLgaPerformanceChart(
      "topLgaPerformanceChart",
      "Top Performing LGAs",
      topLgaLabels,
      topLgaRevenues
    );
    await renderLgaPerformanceChart(
      "leastLgaPerformanceChart",
      "Least Performing LGAs",
      leastLgaLabels,
      leastLgaRevenues
    );
  } catch (error) {
    console.error("Error fetching LGA performance data:", error);
  }
}

async function renderLgaPerformanceChart(chartId, chartTitle, labels, data) {
  const ctx = document.getElementById(chartId).getContext("2d");

  // Destroy existing chart if it exists
  if (ctx.chart) {
    ctx.chart.destroy();
  }

  // Render new chart
  ctx.chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Revenue (₦)",
          data: data,
          backgroundColor: ["#007bff", "#28a745", "#ffc107", "#dc3545"],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: chartTitle,
        },
        tooltip: {
          callbacks: { label: (ctx) => `₦${ctx.raw.toLocaleString()}` },
        },
      },
      scales: {
        x: { beginAtZero: true },
        y: { ticks: { callback: (value) => `₦${value.toLocaleString()}` } },
      },
    },
  });
}

fetchLgaPerformance();

async function fetchRevenueHeadPerformance() {
  const startDate = document.getElementById("revenueHeadStartDate").value;
  const endDate = document.getElementById("revenueHeadEndDate").value;

  const url = `${HOST}/revenue-head-performance?start_date=${startDate}&end_date=${endDate}`;

  try {
    const response = await fetch(url);
    const res = await response.json();
    const topPerformingRevenueHeads = res.data.top_performing_revenue_heads;
    const leastPerformingRevenueHeads = res.data.least_performing_revenue_heads;

    // Prepare data for the charts
    const topRevenueHeadLabels = topPerformingRevenueHeads.map(
      (item) => item.item_name
    );
    const topRevenueHeadRevenues = topPerformingRevenueHeads.map((item) =>
      parseFloat(item.total_revenue)
    );

    const leastRevenueHeadLabels = leastPerformingRevenueHeads.map(
      (item) => item.item_name
    );
    const leastRevenueHeadRevenues = leastPerformingRevenueHeads.map((item) =>
      parseFloat(item.total_revenue)
    );

    // Render the charts
    await renderRevenueHeadPerformanceChart(
      "topRevenueHeadPerformanceChart",
      "Top Performing Revenue Heads",
      topRevenueHeadLabels,
      topRevenueHeadRevenues
    );
    await renderRevenueHeadPerformanceChart(
      "leastRevenueHeadPerformanceChart",
      "Least Performing Revenue Heads",
      leastRevenueHeadLabels,
      leastRevenueHeadRevenues
    );
  } catch (error) {
    console.error("Error fetching revenue head performance data:", error);
  }
}

async function renderRevenueHeadPerformanceChart(
  chartId,
  chartTitle,
  labels,
  data
) {
  const ctx = document.getElementById(chartId).getContext("2d");

  // Destroy existing chart if it exists
  if (ctx.chart) {
    ctx.chart.destroy();
  }

  // Render new chart
  ctx.chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Revenue (₦)",
          data: data,
          backgroundColor: ["#007bff", "#28a745", "#ffc107", "#dc3545"],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: chartTitle,
        },
        tooltip: {
          callbacks: { label: (ctx) => `₦${ctx.raw.toLocaleString()}` },
        },
      },
      scales: {
        x: { beginAtZero: true },
        y: { ticks: { callback: (value) => `₦${value.toLocaleString()}` } },
      },
    },
  });
}

fetchRevenueHeadPerformance();

async function fetchAverageCycleTimeGauge() {
  const startDate = document.getElementById("cycleStartDate").value;
  const endDate = document.getElementById("cycleEndDate").value;
  const taxOfficeId = document.getElementById("taxOfficeSelect").value;

  const url = `${HOST}/average-transaction-cycle-time?start_date=${startDate}&end_date=${endDate}&tax_office_id=${taxOfficeId}`;

  try {
    const response = await fetch(url); // Fetch data with filters
    const data = await response.json();

    if (data.status === "success") {
      const averageCycleTime = data.average_cycle_time;

      // Render the gauge chart
      renderAverageCycleTimeGauge(averageCycleTime);
    } else {
      console.error("Failed to fetch average cycle time");
    }
  } catch (error) {
    console.error("Error fetching average cycle time:", error);
  }
}

function renderAverageCycleTimeGauge(averageCycleTime) {
  const chartCanvas = document.getElementById("averageCycleTimeGauge");
  const ctx = chartCanvas.getContext("2d");

  // Destroy existing chart if it exists
  if (chartCanvas.chart) {
    chartCanvas.chart.destroy();
  }

  // Render new gauge chart
  chartCanvas.chart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Cycle Time", "Remaining"],
      datasets: [
        {
          data: [averageCycleTime, 10 - averageCycleTime], // Assuming 10 as the maximum cycle time
          backgroundColor: ["#4e73df", "#e0e0e0"],
          borderWidth: 0,
        },
      ],
    },
    options: {
      responsive: true,
      cutout: "80%",
      plugins: {
        tooltip: {
          callbacks: {
            label: function (context) {
              return `${context.label}: ${context.raw.toFixed(2)}`;
            },
          },
        },
        legend: { display: false },
        title: {
          display: true,
          text: `Average Cycle Time: ${averageCycleTime.toFixed(2)} Days`,
        },
      },
    },
  });
}

// Call the function to fetch and render the gauge chart
fetchAverageCycleTimeGauge();

async function fetchTimeRequestCountGauge() {
  const startDate = document.getElementById("tinStartDate").value;
  const endDate = document.getElementById("tinEndDate").value;
  const datemonth = document.getElementById("tinMonth").value;
  const [year, month] = datemonth.split("-");
  // const year = document.getElementById("tinYear").value;

  const url = `${HOST}/tin-request-counts?start_date=${startDate}&end_date=${endDate}&month=${month}&year=${year}`;

  try {
    const response = await fetch(url); // Fetch data with filters
    const data = await response.json();

    if (data.status === "success") {
      const averageCycleTime = data.data.tin_request_count;
      // Render the gauge chart
      renderTimeRequestCountGauge(averageCycleTime);
    } else {
      console.error("Failed to fetch tin request count");
    }
  } catch (error) {
    console.error("Error fetching tin request count:", error);
  }
}

function renderTimeRequestCountGauge(averageCycleTime) {
  const chartCanvas = document.getElementById("tinRequestCountGauge");
  const ctx = chartCanvas.getContext("2d");

  // Destroy existing chart if it exists
  if (chartCanvas.chart) {
    chartCanvas.chart.destroy();
  }

  // Render new gauge chart
  chartCanvas.chart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Cycle Time", "Remaining"],
      datasets: [
        {
          data: [averageCycleTime, 10 - averageCycleTime], // Assuming 10 as the maximum cycle time
          backgroundColor: ["#4e73df", "#e0e0e0"],
          borderWidth: 0,
        },
      ],
    },
    options: {
      responsive: true,
      cutout: "80%",
      plugins: {
        tooltip: {
          callbacks: {
            label: function (context) {
              return `${context.label}: ${context.raw.toFixed(2)}`;
            },
          },
        },
        legend: { display: false },
        title: {
          display: true,
          text: `TIN Request Count: ${averageCycleTime}`,
        },
      },
    },
  });
}

// Call the function to fetch and render the gauge chart
fetchTimeRequestCountGauge();

// Chart.js Configuration
document.addEventListener("DOMContentLoaded", function () {
  // Total Revenue Collected Chart
  const totalRevenueCtx = document
    .getElementById("totalRevenueChart")
    .getContext("2d");
  new Chart(totalRevenueCtx, {
    type: "line",
    data: {
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      datasets: [
        {
          label: "Daily Revenue",
          data: [
            500, 600, 700, 800, 750, 850, 900, 950, 1000, 1050, 1100, 1200,
          ],
          borderColor: "#4CAF50",
          backgroundColor: "rgba(76, 175, 80, 0.1)",
          fill: true,
        },
        {
          label: "Monthly Revenue",
          data: [
            15000, 16000, 17000, 18000, 17500, 18500, 19000, 19500, 20000,
            20500, 21000, 22000,
          ],
          borderColor: "#2196F3",
          backgroundColor: "rgba(33, 150, 243, 0.1)",
          fill: true,
        },
        {
          label: "Yearly Revenue",
          data: [
            200000, 250000, 270000, 300000, 320000, 340000, 360000, 380000,
            400000, 420000, 450000, 470000,
          ],
          borderColor: "#FFC107",
          backgroundColor: "rgba(255, 193, 7, 0.1)",
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });

  // Revenue Growth Rate Chart
  const revenueGrowthCtx = document
    .getElementById("revenueGrowthChart")
    .getContext("2d");
  new Chart(revenueGrowthCtx, {
    type: "line",
    data: {
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      datasets: [
        {
          label: "Revenue Growth Rate",
          data: [5, 6, 7, 8, 7.5, 8.5, 9, 9.5, 10, 10.5, 11, 12],
          borderColor: "#E91E63",
          backgroundColor: "rgba(233, 30, 99, 0.1)",
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });

  // Top Revenue Contributors Chart
  const topContributorsCtx = document
    .getElementById("topRevenueContributorsChart")
    .getContext("2d");
  new Chart(topContributorsCtx, {
    type: "horizontalBar",
    data: {
      labels: ["Company A", "Company B", "Company C", "Company D", "Company E"],
      datasets: [
        {
          label: "Revenue Contribution (₦)",
          data: [500000, 450000, 400000, 350000, 300000],
          backgroundColor: [
            "#4CAF50",
            "#2196F3",
            "#FFC107",
            "#FF5722",
            "#E91E63",
          ],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });
});

// Map Configuration for Revenue Contributions by State/LGA
// Map Configuration for Revenue Contributions by State/LGA
document.addEventListener("DOMContentLoaded", function () {
  const map = L.map("revenueHeatMap").setView([12.0, 8.0], 6);

  // Add OpenStreetMap Tiles
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  // Example Revenue Data
  const data = [
    { state: "Kano", lat: 12.0022, lng: 8.5917, revenue: 500000 },
    { state: "Lagos", lat: 6.5244, lng: 3.3792, revenue: 700000 },
    { state: "Abuja", lat: 9.0765, lng: 7.3986, revenue: 450000 },
    { state: "Kaduna", lat: 10.5105, lng: 7.4165, revenue: 300000 },
    { state: "kano", lat: 12.1462, lng: 9.2124, revenue: 200000 },
  ];

  // Add Markers
  data.forEach((item) => {
    L.circleMarker([item.lat, item.lng], {
      color: "blue",
      fillColor: "#4CAF50",
      fillOpacity: 0.5,
      radius: Math.sqrt(item.revenue) / 100,
    })
      .addTo(map)
      .bindPopup(
        `<b>${item.state}</b><br>Revenue: ₦${item.revenue.toLocaleString()}`
      );
  });
});

// Total Penalties Imposed (Line Chart)
const penaltiesChartCtx = document
  .getElementById("totalPenaltiesChart")
  .getContext("2d");
new Chart(penaltiesChartCtx, {
  type: "line",
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Penalties Imposed (₦)",
        data: [100000, 120000, 140000, 160000, 150000, 180000],
        borderColor: "#4CAF50",
        backgroundColor: "rgba(76, 175, 80, 0.2)",
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Amount (₦)",
        },
      },
      x: {
        title: {
          display: true,
          text: "Months",
        },
      },
    },
  },
});

// Percentage of Penalties Collected vs. Imposed (Gauge Chart)
const penaltiesGaugeCtx = document
  .getElementById("penaltiesGaugeChart")
  .getContext("2d");
new Chart(penaltiesGaugeCtx, {
  type: "doughnut",
  data: {
    labels: ["Collected", "Imposed"],
    datasets: [
      {
        data: [75, 25],
        backgroundColor: ["#4CAF50", "#FFC107"],
        borderWidth: 0,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: true,
    cutout: "75%",
    plugins: {
      tooltip: { enabled: true },
      legend: { display: false },
      title: {
        display: true,
        text: "75%",
        font: {
          size: 20,
        },
        position: "center",
      },
    },
  },
});

// Interest Accrued on Overdue Payments (Line Chart)
const interestChartCtx = document
  .getElementById("interestAccruedChart")
  .getContext("2d");
new Chart(interestChartCtx, {
  type: "line",
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Interest Accrued (₦)",
        data: [5000, 7000, 9000, 12000, 11000, 15000],
        borderColor: "#FF5722",
        backgroundColor: "rgba(255, 87, 34, 0.2)",
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Amount (₦)",
        },
      },
      x: {
        title: {
          display: true,
          text: "Months",
        },
      },
    },
  },
});

// Total Exemptions Granted (Bar Chart)
const exemptionsChartCtx = document
  .getElementById("totalExemptionsChart")
  .getContext("2d");
new Chart(exemptionsChartCtx, {
  type: "bar",
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Exemptions Granted",
        data: [50, 60, 70, 80, 65, 90],
        backgroundColor: "#4CAF50",
        borderWidth: 1,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Number of Exemptions",
        },
      },
      x: {
        title: {
          display: true,
          text: "Months",
        },
      },
    },
  },
});

// Common Reasons for Exemptions (Pie Chart)
const exemptionReasonsCtx = document
  .getElementById("exemptionReasonsChart")
  .getContext("2d");
new Chart(exemptionReasonsCtx, {
  type: "pie",
  data: {
    labels: [
      "Economic Hardship",
      "Natural Disaster",
      "Policy Change",
      "Others",
    ],
    datasets: [
      {
        data: [40, 25, 20, 15],
        backgroundColor: ["#FF5722", "#FFC107", "#4CAF50", "#03A9F4"],
        borderWidth: 0,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  },
});

// Number and Value of Tax Adjustments (Stacked Bar Chart)
const taxAdjustmentsCtx = document
  .getElementById("taxAdjustmentsChart")
  .getContext("2d");
new Chart(taxAdjustmentsCtx, {
  type: "bar",
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Number of Adjustments",
        data: [10, 15, 20, 25, 18, 22],
        backgroundColor: "#03A9F4",
      },
      {
        label: "Value of Adjustments (₦)",
        data: [50000, 70000, 90000, 120000, 80000, 100000],
        backgroundColor: "#FFC107",
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true,
        title: {
          display: true,
          text: "Months",
        },
      },
      y: {
        stacked: true,
        title: {
          display: true,
          text: "Number / Value",
        },
      },
    },
  },
});

// Number of Alerts Sent for Overdue Payments (Line Chart)
const alertsSentCtx = document
  .getElementById("alertsSentChart")
  .getContext("2d");
new Chart(alertsSentCtx, {
  type: "line",
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Alerts Sent",
        data: [50, 70, 100, 90, 110, 130],
        borderColor: "#4CAF50",
        backgroundColor: "rgba(76, 175, 80, 0.2)",
        tension: 0.3,
        fill: true,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Number of Alerts",
        },
      },
      x: {
        title: {
          display: true,
          text: "Months",
        },
      },
    },
  },
});

// Taxpayer Responsiveness to Alerts (Bar Chart)
const alertResponsesCtx = document
  .getElementById("alertResponsesChart")
  .getContext("2d");
new Chart(alertResponsesCtx, {
  type: "bar",
  data: {
    labels: ["Responded", "Ignored", "Partially Responded"],
    datasets: [
      {
        label: "Responses",
        data: [80, 50, 20],
        backgroundColor: ["#03A9F4", "#FFC107", "#FF5722"],
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Number of Responses",
        },
      },
      x: {
        title: {
          display: true,
          text: "Response Types",
        },
      },
    },
  },
});

// Upcoming vs. Overdue Deadlines (Gantt Chart using Google Charts)
google.charts.load("current", { packages: ["timeline"] });
google.charts.setOnLoadCallback(drawDeadlinesGanttChart);

function drawDeadlinesGanttChart() {
  const container = document.getElementById("deadlinesGanttChart");
  const chart = new google.visualization.Timeline(container);
  const dataTable = new google.visualization.DataTable();

  dataTable.addColumn({ type: "string", id: "Task" });
  dataTable.addColumn({ type: "string", id: "Status" });
  dataTable.addColumn({ type: "date", id: "Start Date" });
  dataTable.addColumn({ type: "date", id: "End Date" });

  dataTable.addRows([
    ["Overdue", "Payment Due", new Date(2024, 0, 1), new Date(2024, 0, 15)],
    [
      "Upcoming",
      "Filing Deadline",
      new Date(2024, 0, 20),
      new Date(2024, 0, 30),
    ],
    ["Overdue", "Audit Deadline", new Date(2024, 0, 10), new Date(2024, 0, 20)],
    ["Upcoming", "VAT Payment", new Date(2024, 1, 1), new Date(2024, 1, 10)],
  ]);

  const options = {
    timeline: { colorByRowLabel: true },
    height: 400,
    width: "100%",
  };

  chart.draw(dataTable, options);
}

google.charts.load("current", { packages: ["corechart", "bar"] });
google.charts.setOnLoadCallback(drawSystemUsageAnalytics);

function drawSystemUsageAnalytics() {
  // Active Users Over Time
  const activeUsersData = google.visualization.arrayToDataTable([
    ["Date", "Active Users"],
    ["2024-01-01", 200],
    ["2024-02-01", 300],
    ["2024-03-01", 350],
    ["2024-04-01", 500],
  ]);
  const activeUsersOptions = {
    title: "Active Users Over Time",
    curveType: "function",
    legend: { position: "bottom" },
    height: 300,
    width: "100%",
  };
  const activeUsersChart = new google.visualization.LineChart(
    document.getElementById("activeUsersChart")
  );
  activeUsersChart.draw(activeUsersData, activeUsersOptions);

  // Most Frequently Accessed Features
  const accessedFeaturesData = google.visualization.arrayToDataTable([
    ["Feature", "Usage Count"],
    ["Dashboard", 120],
    ["Reports", 80],
    ["Settings", 50],
    ["Notifications", 30],
  ]);
  const accessedFeaturesOptions = {
    title: "Most Frequently Accessed Features",
    bars: "horizontal",
    legend: { position: "none" },
    height: 300,
    width: "100%",
  };
  const accessedFeaturesChart = new google.charts.Bar(
    document.getElementById("accessedFeaturesChart")
  );
  accessedFeaturesChart.draw(accessedFeaturesData, accessedFeaturesOptions);

  // System Uptime Over Time
  const systemUptimeData = google.visualization.arrayToDataTable([
    ["Date", "Uptime (%)"],
    ["2024-01", 99.8],
    ["2024-02", 99.9],
    ["2024-03", 99.7],
    ["2024-04", 99.9],
  ]);
  const systemUptimeOptions = {
    title: "System Uptime Over Time",
    curveType: "function",
    legend: { position: "bottom" },
    height: 300,
    width: "100%",
  };
  const systemUptimeChart = new google.visualization.LineChart(
    document.getElementById("systemUptimeChart")
  );
  systemUptimeChart.draw(systemUptimeData, systemUptimeOptions);

  // Common System Errors
  const systemErrorsData = google.visualization.arrayToDataTable([
    ["Error", "Count"],
    ["Login Timeout", 20],
    ["Data Sync Failure", 15],
    ["API Errors", 30],
    ["System Crash", 10],
  ]);
  const systemErrorsOptions = {
    title: "Common System Errors",
    legend: { position: "none" },
    height: 300,
    width: "100%",
  };
  const systemErrorsChart = new google.visualization.ColumnChart(
    document.getElementById("systemErrorsChart")
  );
  systemErrorsChart.draw(systemErrorsData, systemErrorsOptions);
}
