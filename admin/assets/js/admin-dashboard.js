function getCurrentMonthYear() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

async function fetchTotalRevenue(monthYear) {
  $("#totalMonthlyRevenue").html(
    '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>'
  );
  const [year, month] = monthYear.split("-");
  try {
    const response = await fetch(
      `${HOST}/get-total-amount-paid?month=${month}&year=${year}`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + authToken,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();

    if (data.status === "success") {
      $("#totalMonthlyRevenue").html(
        `₦ ${Number(data.total_amount_paid).toLocaleString("en-NG", {
          minimumFractionDigits: 2,
        })}`
      );
    } else {
      $("#totalMonthlyRevenue").html(0);
    }
  } catch (error) {
    console.error("Error fetching total revenue:", error);
    $("#totalMonthlyRevenue").html(0);
  }
}

async function fetchTotalAnnualRevenue(year) {
  $("#totalAnnualRevenue").html(
    '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>'
  );
  try {
    const response = await fetch(
      `${HOST}/get-total-amount-paid-yearly?year=${year}`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + authToken,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();

    if (data.status === "success") {
      $("#totalAnnualRevenue").html(
        `₦ ${Number(data.total_amount_paid).toLocaleString("en-NG", {
          minimumFractionDigits: 2,
        })}`
      );
    } else {
      $("#totalAnnualRevenue").html(0);
    }
  } catch (error) {
    console.error("Error fetching total annual revenue:", error);
    $("#totalAnnualRevenue").html(0);
  }
}

async function fetchExpectedMonthlyRevenue(monthYear) {
  $("#expectedMonthlyRevenue").html(
    '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>'
  );
  const [year, month] = monthYear.split("-");
  try {
    const response = await fetch(
      `${HOST}/get-expected-monthly-revenue?month=${month}&year=${year}`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + authToken,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();

    if (data.status === "success") {
      $("#expectedMonthlyRevenue").html(
        `₦ ${Number(data.expected_monthly_revenue).toLocaleString("en-NG", {
          minimumFractionDigits: 2,
        })}`
      );
    } else {
      $("#expectedMonthlyRevenue").html(0);
    }
  } catch (error) {
    console.error("Error fetching total revenue:", error);
    $("#expectedMonthlyRevenue").html(0);
  }
}

async function fetchExpectedAccruedRevenue(monthYear) {
  $("#expectedAccruedRevenue").html(
    '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>'
  );
  const [year, month] = monthYear.split("-");
  try {
    const response = await fetch(
      `${HOST}/get-accrued-monthly-revenue?month=${month}&year=${year}`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + authToken,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();

    if (data.status === "success") {
      $("#expectedAccruedRevenue").html(
        `₦ ${Number(data.unpaid_monthly_revenue).toLocaleString("en-NG", {
          minimumFractionDigits: 2,
        })}`
      );
    } else {
      $("#expectedAccruedRevenue").html(0);
    }
  } catch (error) {
    console.error("Error fetching total revenue:", error);
    $("#expectedAccruedRevenue").html(0);
  }
}

function populateYearDropdown() {
  const yearSelects = document.querySelectorAll(".annualRevFilter");
  const currentYear = new Date().getFullYear();
  const startYear = 2024; // Fixed start year
  const endYear = currentYear; // 2 years beyond current year

  yearSelects.forEach((yearSelect) => {
    for (let year = startYear; year <= endYear; year++) {
      const option = document.createElement("option");
      option.value = year;
      option.textContent = year;
      yearSelect.appendChild(option);
    }

    yearSelect.value = currentYear;
  });
}

function fetchTaxpayerStatistics() {
  $("#registeredTaxPayers").html(
    '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>'
  );
  $.ajax({
    type: "GET",
    url: `${HOST}/get-taxpayer-statistics`,
    dataType: "json",
    headers: {
      Authorization: "Bearer " + authToken,
      "Content-Type": "application/json",
    },
    success: function (response) {
      if (response.status === "success") {
        const stats = response.data;

        $("#registeredTaxPayers").text(
          stats.total_registered_taxpayers.toLocaleString()
        );
      } else {
        $("#registeredTaxPayers").text(0);
      }
    },
    error: function (xhr, status, error) {
      console.error("Error fetching taxpayer statistics:", error);
      $("#registeredTaxPayers").text(0);
    },
  });
}

function fetchInvoiceStatistics() {
  $("#totalInvoices").html(
    '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>'
  );
  $("#totalInvoiced").html(
    '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>'
  );
  $("#totalPaidInvoice").html(
    '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>'
  );
  $("#totalUnpaidInvoice").html(
    '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>'
  );
  $("#totalInvoicesDue").html(
    '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>'
  );
  $("#totalInvoicesPaid").html(
    '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>'
  );
  $("#totalAmountDue").html(
    '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>'
  );
  $("#totalMDA").html(
    '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>'
  );
  $("#totalRevenueHeads").html(
    '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>'
  );
  $.ajax({
    type: "GET",
    url: `${HOST}/invoices-summary`,
    dataType: "json",
    headers: {
      Authorization: "Bearer " + authToken,
      "Content-Type": "application/json",
    },
    success: function (response) {
      if (response.status === "success") {
        const stats = response.data;

        $("#totalInvoices").text(stats.total_invoices);
        $("#totalInvoiced").text(
          `₦ ${stats.total_amount_invoiced.toLocaleString(undefined, {
            minimumFractionDigits: 2,
          })}`
        );
        $("#totalPaidInvoice").text(
          `₦ ${stats.total_amount_paid.toLocaleString(undefined, {
            minimumFractionDigits: 2,
          })}`
        );
        $("#totalUnpaidInvoice").text(
          `₦ ${stats.total_amount_unpaid.toLocaleString(undefined, {
            minimumFractionDigits: 2,
          })}`
        );
        $("#totalInvoicesDue").text(stats.total_invoices_due);
        $("#totalInvoicesPaid").text(stats.total_invoices_paid);
        $("#totalAmountDue").text(
          `₦ ${stats.total_invoices_amount_due.toLocaleString(undefined, {
            minimumFractionDigits: 2,
          })}`
        );
        $("#totalMDA").text(stats.total_mda);
        $("#totalRevenueHeads").text(stats.total_rh);
      } else {
        console.error("Failed to fetch invoice statistics");
        //   resetStatisticCards();
      }
    },
    error: function (xhr, status, error) {
      console.error("Error fetching invoice statistics:", error);
      //   resetStatisticCards();
    },
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const monthInput = document.querySelector(".monthlyRevFilter");
  const yearInput = document.querySelector(".annualRevFilter");
  const monthInput2 = document.querySelector(".expectedMonthlyRevFilter");
  const monthInput3 = document.querySelector(".expectedAccruedRevFilter");
  const monthInput4 = document.querySelector(".totalMonthlyInvoiceFilter");
  const currentMonthYear = getCurrentMonthYear();
  const currentYear = new Date().getFullYear();

  populateYearDropdown();

  monthInput.value = currentMonthYear;
  yearInput.value = currentYear;
  monthInput2.value = currentMonthYear;
  monthInput3.value = currentMonthYear;
  monthInput4.value = currentMonthYear;

  fetchTotalRevenue(currentMonthYear);
  fetchTotalAnnualRevenue(currentYear);
  fetchExpectedMonthlyRevenue(currentMonthYear);
  fetchExpectedAccruedRevenue(currentMonthYear);
  fetchTotalMonthlyInvoice(currentMonthYear);
  fetchTaxpayerStatistics();
  fetchInvoiceStatistics();

  monthInput.addEventListener("change", (event) => {
    const selectedMonthYear = event.target.value;
    fetchTotalRevenue(selectedMonthYear);
  });

  yearInput.addEventListener("change", (event) => {
    const selectedYear = event.target.value;
    fetchTotalAnnualRevenue(selectedYear);
  });

  monthInput2.addEventListener("change", (event) => {
    const selectedMonthYear = event.target.value;
    fetchExpectedMonthlyRevenue(selectedMonthYear);
  });

  monthInput3.addEventListener("change", (event) => {
    const selectedMonthYear = event.target.value;
    fetchExpectedAccruedRevenue(selectedMonthYear);
  });

  monthInput4.addEventListener("change", (event) => {
    const selectedMonthYear = event.target.value;
    fetchTotalMonthlyInvoice(selectedMonthYear);
  });
});

function fetchTaxSummary(monthYear, isMonthYear = false) {
  // Show loading indicators
  $("#tinIssued").html(
    '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>'
  );
  $("#tccIssued").html(
    '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>'
  );
  $("#payeRemitted").html(
    '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>'
  );
  $("#totalAmountUnpaidPaye").html(
    '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>'
  );
  $("#totalUnpaidPaye").html(
    '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>'
  );

  let url = `${HOST}/admin-tax-summary`;
  if (isMonthYear && monthYear) {
    const [year, month] = monthYear.split("-");
    url += `?year=${year}&month=${month}`;
  }

  $.ajax({
    type: "GET",
    url: url,
    dataType: "json",
    headers: {
      Authorization: "Bearer " + authToken,
      "Content-Type": "application/json",
    },
    success: function (response) {
      if (response.status === "success") {
        const data = response.data;

        // Update the UI with the fetched data
        $("#tinIssued").text(data.tin_issued || 0);
        $("#tccIssued").text(data.tcc_issued || 0);
        $("#payeRemitted").text(
          `₦ ${data.paye_remitted !== null
            ? parseFloat(data.paye_remitted).toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })
            : "0.00"
          }`
        );
        $("#totalAmountUnpaidPaye").text(
          `₦ ${data.unpaid_amount_paye_taxes !== null
            ? parseFloat(data.unpaid_amount_paye_taxes).toLocaleString(
              undefined,
              { minimumFractionDigits: 2 }
            )
            : "0.00"
          }`
        );
        $("#totalUnpaidPaye").text(data.unpaid_paye_taxes || 0);
      } else {
        console.error("Failed to fetch tax summary");
      }
    },
    error: function (xhr, status, error) {
      console.error("Error fetching tax summary:", error);
    },
  });
}

fetchTaxSummary();

// Fetch data on button click
$(document).ready(function () {
  $("#filterButton").click(function () {
    const year = $("#yearSelect").val();
    const monthYear = $("#monthSelect").val();
    fetchTaxSummary(monthYear, true);
  });
});

// Initialize the map centered on Jigawa State
const jigawaMap = L.map("geoHeatMapJigawa").setView([12.2287, 9.5616], 8); // Jigawa State coordinates with zoom level 8

// Add OpenStreetMap tiles
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(jigawaMap);

// Fetch data from API
async function fetchGeoHeatMapData() {
  try {
    const response = await fetch(`${HOST}/analytics-taxpayer-distribution`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + authToken,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result || result.status !== "success" || !result.data) {
      throw new Error("Invalid data structure received");
    }

    // Example data points in Jigawa State
    const jigawaDataPoints = result.data
      .filter((item) => item.state === "Jigawa")
      .map((item) => ({
        name: item.lga || "Unknown",
        coords: getCoordinates(item.lga),
        count: item.taxpayer_count,
      }));

    // Add markers or circles for each location
    jigawaDataPoints.forEach((point) => {
      L.circle(point.coords, {
        color: "blue",
        fillColor: "#007bff",
        fillOpacity: 0.5,
        radius: point.count * 100, // Adjust size based on count
      })
        .bindPopup(`<b>${point.name}</b><br>Taxpayers: ${point.count}`)
        .addTo(jigawaMap);
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
    Biriniwa: [12.78, 10.23],
    Gagarawa: [12.4, 9.8],
    Guri: [12.8, 10.2],
    Gwaram: [11.3, 9.8833],
    Gwiwa: [12.3, 9.5],
    Jahun: [12.1, 9.7],
    "Kafin Hausa": [12.2333, 9.9167],
    Kaugama: [12.5, 10.3],
    Kazaure: [12.65, 8.4167],
    "Kiri Kasama": [12.75, 10.1667],
    Maigatari: [12.8, 9.5],
    "Malam Madori": [12.55, 9.8833],
    Miga: [12.25, 9.8333],
    Ringim: [12.15, 9.1667],
    Roni: [12.3, 9.0167],
    "Sule Tankarkar": [12.85, 9.5667],
    Taura: [12.3, 9.3333],
    Yankwashi: [12.1, 9.8],
  };

  return coordinates[lga] || [12.2287, 9.5616]; // Default to Jigawa State center if LGA not found
}

fetchGeoHeatMapData();

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
    const labels = ["Active", "Inactive"];
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
            label: "Taxpayer Status",
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
                  label === "Active" ? totalVerified : totalUnverified;
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
        "Unable to load taxpayer status chart. Please try again later.";
      errorContainer.style.display = "block";
    }
  }
}

// Call the function when needed
fetchTaxpayerRegistrationChart();

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

let revenueLineChart; // Declare the chart variable

async function fetchRevenueGrowthChart() {
  const selectedYear = document.getElementById("yearSelect").value;
  try {
    const response = await fetch(
      `${HOST}/admin-revenue-growth-2?year=${selectedYear}`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + authToken,
        "Content-Type": "application/json",
      },
    }); // Replace with your actual endpoint
    const data = await response.json();

    if (data.status === "success") {
      const monthlyGrowth = data.data.monthly_growth.filter((item) =>
        item.year_months.startsWith(selectedYear)
      );
      const monthlyLabels = monthlyGrowth.map((item) => item.year_months);
      const monthlyRevenue = monthlyGrowth.map((item) => item.total_revenue);

      // Check if the chart already exists
      if (revenueLineChart) {
        revenueLineChart.destroy(); // Destroy the existing chart
      }

      // Create a new chart
      createLineChart(monthlyLabels, monthlyRevenue);
    } else {
      console.error("Failed to fetch revenue data");
    }
  } catch (error) {
    console.error("Error fetching revenue data:", error);
  }
}

function createLineChart(monthlyLabels, monthlyRevenue) {
  const ctx = document.getElementById("revenueLineChart").getContext("2d");
  revenueLineChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: monthlyLabels,
      datasets: [
        {
          label: "Monthly Revenue",
          data: monthlyRevenue,
          borderColor: "rgba(255, 99, 132, 1)",
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          fill: true,
          tension: 0.1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

// Call the function to fetch data for the default selected year
fetchRevenueGrowthChart();

async function fetchTotalMonthlyInvoice(monthYear) {
  $("#totalMonthlyInvoice").html(
    '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>'
  );
  let url = `${HOST}/get-total-monthly-invoice`;
  if (monthYear) {
    const [year, month] = monthYear.split("-");
    url += `?month=${month}&year=${year}`;
  }
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + authToken,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();

    if (monthYear) {
      const invoiceData = data.find((inv) => inv.month === monthYear);
      if (invoiceData) {
        $("#totalMonthlyInvoice").html(invoiceData.invoice_count);
      } else {
        $("#totalMonthlyInvoice").html(0);
      }
    } else {
      const totalInvoices = data.reduce(
        (sum, inv) => sum + inv.invoice_count,
        0
      );
      $("#totalMonthlyInvoice").html(totalInvoices);
    }
  } catch (error) {
    console.error("Error fetching total revenue:", error);
    $("#totalMonthlyInvoice").html(0);
  }
}

async function fetchAverageDailyRevenue() {
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;

  const url = `${HOST}/get-average-daily-revenue?start_date=${startDate}&end_date=${endDate}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + authToken,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();

    // Prepare data for the chart
    const totalAmount = parseFloat(data.total_amount.replace(/,/g, "")) || 0.0;
    const totalDays = data.total_days || 0;
    const averageDailyRevenue = parseFloat(
      data.average_daily_revenue.replace(/,/g, "")
    );

    // Render the chart
    await renderAverageDailyRevenueChart(
      totalAmount,
      totalDays,
      averageDailyRevenue
    );
  } catch (error) {
    console.error("Error fetching average daily revenue:", error);
  }
}

async function renderAverageDailyRevenueChart(
  totalAmount,
  totalDays,
  averageDailyRevenue
) {
  const chartCanvas = document.getElementById("averageDailyRevenueChart");
  const ctx = chartCanvas.getContext("2d");

  // Destroy existing chart if it exists
  if (chartCanvas.chart) {
    chartCanvas.chart.destroy();
  }

  // Create a new chart
  chartCanvas.chart = new Chart(ctx, {
    type: "bar", // Use 'bar' for a bar chart
    data: {
      labels: ["Total Amount", "Average Daily Revenue"],
      datasets: [
        {
          label: "Revenue",
          data: [totalAmount, averageDailyRevenue],
          backgroundColor: [
            "rgba(75, 192, 192, 0.6)",
            "rgba(255, 99, 132, 0.6)",
          ],
          borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Amount",
          },
        },
      },
      plugins: {
        legend: {
          display: true,
          position: "top",
        },
        title: {
          display: true,
          text: "Average Daily Revenue Chart",
        },
      },
    },
  });
  $("#totalDays").html(`${totalDays} Days`);
}

fetchAverageDailyRevenue();

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
        Authorization: "Bearer " + authToken,
        "Content-Type": "application/json",
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
