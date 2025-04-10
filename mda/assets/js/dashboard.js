const currentPage = 1; // Change this if paginated
const limit = 50;

let dataToExport;

$("#entity-name").text(mdaUser.fullname)
$("#entity-id").text(mdaId)
$("#emailText").text(mdaUser.email)

async function fetchAndUpdateTaxTiles() {
  try {
    // Fetch data from API
    const response = await fetch(
      `${HOST}/mda-tiles-breakdown?mda_id=${mdaId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
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

    // Destructure the data
    const {
      total_outstanding,
      total_revenue,
      total_tcc_applications,
      total_taxpayers,
    } = result.data;

    // Update Total Total Revenue Collected

    const totalRevenueElement = document.querySelector("#ttlRevColleted");
    if (totalRevenueElement) {
      totalRevenueElement.textContent = `₦ ${parseFloat(total_revenue).toLocaleString("en-US", { maximumFractionDigits: 2 })}` || "₦ 0";
    }

    // Update Total Amount Owed
    const outstandingElement = document.querySelector("#outstandingTotal");
    if (outstandingElement) {
      outstandingElement.textContent = `₦ ${parseFloat(total_outstanding).toLocaleString("en-US", { maximumFractionDigits: 2, })}`;
    }

    // Update Total Taxes Generated
    const totalTaxpayerElement = document.querySelector("#totalTaxpayerElement");
    if (totalTaxpayerElement) {
      totalTaxpayerElement.textContent = total_taxpayers;
    }

    // Update Total Taxes Paid
    const tccApplicationsElement = document.querySelector("#tccApplicationsElement");
    if (tccApplicationsElement) {
      tccApplicationsElement.textContent = total_tcc_applications;
    }
  } catch (error) {
    console.error("Error fetching tax tiles data:", error);

    // Optional: Display user-friendly error message or fallback values
    const errorElements = document.querySelectorAll(".numbers h5");
    errorElements.forEach((element) => {
      element.textContent = "0.00";
    });
  }
}

async function fetchAndUpdatePaymentTables() {
  const paymentHistoryTableBody = document.querySelector(
    ".payment-table tbody"
  );
  const outstandingTaxesTableBody = document.querySelector(
    ".outstand-table tbody"
  );

  const loaderRow = `
    <tr class="loader-row">
      <td colspan="11" class="text-center">
        <div class="loader">
          <div class="rotating-dots">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
        <span>Loading...</span>
      </td>
    </tr>
  `;

  // Show loader
  if (paymentHistoryTableBody) {
    paymentHistoryTableBody.innerHTML = loaderRow;
  }
  if (outstandingTaxesTableBody) {
    outstandingTaxesTableBody.innerHTML = loaderRow;
  }

  try {
    // Fetch data from API
    const response = await fetch(
      `${HOST}/mda-payment-outstanding?mda_id=${mdaId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken}`,
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

    // Destructure the data
    const { payment_history = {}, outstanding_taxes = {} } = result.data;

    // Update Payment History Table
    if (paymentHistoryTableBody) {
      // Clear existing rows
      paymentHistoryTableBody.innerHTML = "";

      if (Array.isArray(payment_history.records)) {
        // Populate Payment History rows
        payment_history.records.forEach((record) => {
          const row = `
            <tr>
              <td>
                <p class="text-sm mb-0">${formatDate(record.date_created)}</p>
              </td>
              <td>
                <p class="text-sm mb-0">${record.invoice_number}</p>
              </td>
              <td>
                <p class="text-sm mb-0">₦${formatCurrency(
            record.amount_paid
          )}</p>
              </td>
              <td>
                <p class="text-sm mb-0">
                  <span class="badge badge-${getStatusColor(
            record.payment_status
          )}">
                    ${record.payment_status}
                  </span>
                </p>
              </td>
            </tr>
          `;
          paymentHistoryTableBody.insertAdjacentHTML("beforeend", row);
        });
      }
    }

    // Update Outstanding Taxes Table
    if (outstandingTaxesTableBody) {
      // Clear existing rows
      outstandingTaxesTableBody.innerHTML = "";

      if (Array.isArray(outstanding_taxes.records)) {
        // Populate Outstanding Taxes rows
        outstanding_taxes.records.forEach((record) => {
          const row = `
            <tr>
              <td>
                <p class="text-sm mb-0">${formatDate(record.due_date)}</p>
              </td>
              <td>
                <p class="text-sm mb-0">₦${formatCurrency(
            record.amount_paid
          )}</p>
              </td>
              <td>
                <p class="text-sm mb-0">₦${formatCurrency(
            record.outstanding_amount
          )}</p>
              </td>
              <td>
                <p class="text-sm mb-0">
                  <span class="badge badge-${getStatusColor(
            record.payment_status
          )}">
                    ${record.payment_status}
                  </span>
                </p>
              </td>
            </tr>
          `;
          outstandingTaxesTableBody.insertAdjacentHTML("beforeend", row);
        });
      }
    }
  } catch (error) {
    console.error("Error fetching payment tables data:", error);

    // Optional: Display error message
    const tableContainers = document.querySelectorAll(".col-sm-6");
    tableContainers.forEach((container) => {
      const errorMessage = container.querySelector(".card-body");
      if (errorMessage) {
        errorMessage.innerHTML = `
          <div class="alert alert-danger">
            Unable to load payment information. Please try again later.
          </div>
        `;
      }
    });
  }
}

async function fetchDataAndRenderChart() {
  try {
    // Check if Chart.js is loaded
    if (typeof Chart === "undefined") {
      throw new Error("Chart.js is not loaded");
    }

    // Check if the canvas element exists
    const chartCanvas = document.getElementById("chart-doughnut");
    const tableBody = document.querySelector(".taxTypeTable tbody");

    if (!chartCanvas || !tableBody) {
      throw new Error("Chart canvas or table element not found");
    }

    // Fetch data from API
    const response = await fetch(
      `${HOST}/mda-type-breakdown?mda_id=${mdaId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
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
    if (!result || result.status !== "success" || !Array.isArray(result.data)) {
      throw new Error("Invalid data structure received");
    }

    // Prepare chart data with fallback and validation
    const labels = result.data.map((item) => item.name || "Unknown");
    const dataValues = result.data.map((item) =>
      typeof item.percentage === "number" ? item.percentage : 0
    );

    // Ensure we have data to display
    if (dataValues.length === 0) {
      throw new Error("No data available to render chart");
    }

    // Predefined color palette with fallback
    const backgroundColors = [
      "#2152ff",
      "#3A416F",
      "#f53939",
      "#a8b8d8",
      "#5e72e4",
      "#ffcc00",
      "#36a2eb",
      // Add more colors if needed
    ];

    // Extend colors if needed
    const finalColors = backgroundColors.slice(0, dataValues.length);

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
        // labels: labels,
        datasets: [
          {
            label: "Revenue Percentage",
            weight: 9,
            cutout: 60,
            tension: 0.9,
            pointRadius: 2,
            borderWidth: 2,
            backgroundColor: finalColors,
            data: dataValues,
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: "top",
            labels: {
              usePointStyle: true,
              pointStyle: "circle",
            },
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                return `${context.label}: ${context.formattedValue}%`;
              },
            },
          },
        },
        interaction: {
          intersect: false,
          mode: "index",
        },
      },
    });

    // Dynamically populate the table
    // Clear existing table rows
    tableBody.innerHTML = "";

    // Create table rows for each data point
    labels.forEach((label, index) => {
      const percentage = dataValues[index];
      const color = finalColors[index];

      const row = `
        <tr>
          <td>
            <div class="d-flex px-2 py-1">
              <div class="d-flex flex-column justify-content-center">
                <strong class="mb-0 text-xs">${label}</strong>
              </div>
            </div>
          </td>
          <td class="align-middle text-center text-sm">
            <span class="text-xs font-weight-bold" style="color: ${color};">
              ${percentage.toFixed(2)}%
            </span>
          </td>
        </tr>
      `;

      tableBody.insertAdjacentHTML("beforeend", row);
    });
  } catch (error) {
    console.error("Error in chart rendering:", error);

    // Optional: Display user-friendly error message
    const errorContainer = document.getElementById("chart-error-message");
    if (errorContainer) {
      errorContainer.textContent =
        "Unable to load chart. Please try again later.";
      errorContainer.style.display = "block";
    }
  }
}

// Function to fetch and render payment trends chart
async function fetchAndRenderPaymentTrendsChart() {
  try {
    // Check if Chart.js is loaded
    if (typeof Chart === "undefined") {
      throw new Error("Chart.js is not loaded");
    }

    // Get the chart canvas
    const chartCanvas = document.getElementById("payment-trends-chart");
    if (!chartCanvas) {
      throw new Error("Chart canvas not found");
    }

    // Get the 2D rendering context
    const ctx1 = chartCanvas.getContext("2d");

    // Fetch data from API
    const response = await fetch(
      `${HOST}/mda-payment-trends?mda_id=${mdaId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
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
    if (!result || result.status !== "success" || !Array.isArray(result.data)) {
      throw new Error("Invalid data structure received");
    }

    // Prepare data for chart
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    // Map payments and invoices data from the response
    const paymentsMap = result.data.reduce((acc, item) => {
      acc[item.month] = item.payments;
      return acc;
    }, {});

    const invoicesMap = result.data.reduce((acc, item) => {
      acc[item.month] = item.invoices;
      return acc;
    }, {});

    const paymentsData = months.map((month) => paymentsMap[month] || 0);
    const invoicesData = months.map((month) => invoicesMap[month] || 0);

    // Abbreviated month labels
    const shortMonths = months.map((month) => month.substring(0, 3));

    // Create gradient for Payments
    const gradientStroke1 = ctx1.createLinearGradient(0, 230, 0, 50);
    gradientStroke1.addColorStop(1, "rgba(203,12,159,0.2)");
    gradientStroke1.addColorStop(0.2, "rgba(72,72,176,0.0)");
    gradientStroke1.addColorStop(0, "rgba(203,12,159,0)");

    // Create gradient for Invoices
    const gradientStroke2 = ctx1.createLinearGradient(0, 230, 0, 50);
    gradientStroke2.addColorStop(1, "rgba(20,23,39,0.2)");
    gradientStroke2.addColorStop(0.2, "rgba(72,72,176,0.0)");
    gradientStroke2.addColorStop(0, "rgba(20,23,39,0)");

    // Render chart
    new Chart(ctx1, {
      type: "line",
      data: {
        labels: shortMonths,
        datasets: [
          {
            label: "Payments",
            tension: 0.4,
            borderWidth: 3,
            pointRadius: 2,
            pointBackgroundColor: "#02a75a",
            borderColor: "#02a75a",
            backgroundColor: gradientStroke1,
            data: paymentsData,
            maxBarThickness: 6,
          },
          {
            label: "Invoices",
            tension: 0.4,
            borderWidth: 3,
            pointRadius: 2,
            pointBackgroundColor: "#000",
            borderColor: "#000",
            backgroundColor: gradientStroke2,
            data: invoicesData,
            maxBarThickness: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false, // Display legend to differentiate between lines
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                return `${context.dataset.label}: ${context.formattedValue}`;
              },
            },
          },
        },
        interaction: {
          intersect: false,
          mode: "index",
        },
        scales: {
          y: {
            grid: {
              drawBorder: false,
              display: true,
              drawOnChartArea: true,
              drawTicks: false,
              borderDash: [5, 5],
            },
            ticks: {
              display: true,
              padding: 10,
              color: "#9ca2b7",
              beginAtZero: true,
            },
          },
          x: {
            grid: {
              drawBorder: false,
              display: true,
              drawOnChartArea: true,
              drawTicks: true,
              borderDash: [5, 5],
            },
            ticks: {
              display: true,
              color: "#9ca2b7",
              padding: 10,
            },
          },
        },
      },
    });
  } catch (error) {
    console.error("Error fetching or rendering payment trends chart:", error);

    // Optional: Display error message
    const chartContainer = document.querySelector(".payment-trends-container");
    if (chartContainer) {
      chartContainer.innerHTML = `
        <div class="alert alert-danger">
          Unable to load payment trends. Please try again later.
        </div>
      `;
    }
  }
}


// Utility functions
function formatDate(dateString) {
  try {
    return new Date(dateString).toISOString().split("T")[0];
  } catch {
    return dateString;
  }
}

function formatCurrency(amount) {
  return parseFloat(amount).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function getStatusColor(status) {
  switch (status.toLowerCase()) {
    case "paid":
      return "success";
    case "unpaid":
      return "danger";
    case "partial":
      return "warning";
    default:
      return "secondary";
  }
}

// Call the function when DOM is loaded
document.addEventListener("DOMContentLoaded", fetchAndUpdatePaymentTables);
document.addEventListener("DOMContentLoaded", fetchDataAndRenderChart);
document.addEventListener("DOMContentLoaded", fetchAndRenderPaymentTrendsChart);
document.addEventListener("DOMContentLoaded", fetchAndUpdateTaxTiles);


function getTccPending() {
  const $tbody = $("#tcc-table tbody");
  const loaderRow = `
      <tr class="loader-row">
        <td colspan="4" class="text-center">
            <div class="loader">
                <div class="rotating-dots">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
            <span>Loading...</span>
        </td>
      </tr>
    `;

  // Show loader
  $tbody.html(loaderRow);

  $.ajax({
    type: "GET",
    url: `${HOST}/get-tcc?status=pending&mda_id=${mdaId}`,
    dataType: "json",
    headers: {
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/json",
    },
    crossDomain: true,
    success: function (response) {
      if (response.status === "success" && response.data.length > 0) {
        $tbody.empty(); // Clear the loader and existing rows

        const tccs = response.data;

        tccs.forEach((tcc, index) => {
          const row = `
            <tr>
              <td>
                <p class="text-sm mb-0">${tcc.tcc_number}</p>
              </td>
              <td>
                <p class="text-sm mb-0">${tcc.taxpayer_first_name} ${tcc.taxpayer_surname}</p>
              </td>
              <td class="text-center">
                <span class="badge badge-warning">Pending</span>
              </td>
              <td class="text-center">
                <button class="btn btn-sm btn-primary" style="margin-bottom: 0px;">Review</button>
              </td>
            </tr>
          `;
          $tbody.append(row);
        });
      } else {
        $tbody.html('<tr><td colspan="4" class="text-center">No TCC Requests found.</td></tr>');
      }
    },
    error: function (err) {
      console.error("Error fetching payments:", err);
      $tbody.html('<tr><td colspan="4" class="text-center text-danger">An error occurred while TCC Requests.</td></tr>');
    },
  });
}

getTccPending();


function fetchInvoiceStatistics() {
  $.ajax({
    type: "GET",
    url: `${HOST}/invoices-summary?mda_id=${mdaId}`,
    dataType: "json",
    headers: {
      Authorization: "Bearer " + authToken,
      "Content-Type": "application/json",
    },
    success: function (response) {
      if (response.status === "success") {
        const stats = response.data;

        $(".totalInvoices").text(stats.total_invoices);
        $(".totalInvoiced").text(
          `₦ ${stats.total_amount_invoiced.toLocaleString()}`
        );
        $(".totalPaidInvoice").text(
          `₦ ${stats.total_amount_paid.toLocaleString()}`
        );
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

// fetchInvoiceStatistics();

function fetchRevenueHeadStatistics() {
  $.ajax({
    type: "GET",
    url: `${HOST}/revenue-heads-summary-by-mda?mda_id=${mdaId}`,
    dataType: "json",
    headers: {
      Authorization: "Bearer " + authToken,
      "Content-Type": "application/json",
    },
    success: function (response) {
      if (response.status === "success") {
        const stats = response.data;

        $("#activeRev").text(stats.active_revenue_heads);
        $("#inactiveRev").text(stats.inactive_revenue_heads);
        $("#totalRev").text(stats.total_revenue_heads);
      } else {
        console.error("Failed to fetch revenue head statistics");
        //   resetStatisticCards();
      }
    },
    error: function (xhr, status, error) {
      console.error("Error fetching revenue head statistics:", error);
      //   resetStatisticCards();
    },
  });
}

// fetchRevenueHeadStatistics();
