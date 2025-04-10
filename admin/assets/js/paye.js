let dataToExport;
const type = getParameterByName("type");

const capitalizedType = capitalizeWords(type);
$(".payeType").text(`PAYE Manager - ${capitalizedType}`);

let monthsArray = [
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
monthsArray.forEach((month) => {
  $("#monthSelo").append(`<option value="${month}">${month}</option>`);
});

function fetchpaye(tableSelector, filterCallback) {
  if ($.fn.DataTable.isDataTable(tableSelector)) {
    $(tableSelector).DataTable().clear().destroy();
  }

  $(tableSelector).DataTable({
    serverSide: true,
    paging: true,
    ordering: false,
    pageLength: 50,
    responsive: true,
    searchDelay: 500,
    pagingType: "simple_numbers",
    ajax: function (data, callback, settings) {
      const pageNumber = Math.ceil(data.start / data.length) + 1;

      const filters = {
        page: pageNumber,
        limit: data.length,
      };

      $.ajax({
        url: `${HOST}/get-special-users?category=${type}`,
        type: "GET",
        data: filters,
        dataType: "json",
        headers: {
          Authorization: "Bearer " + authToken,
        },
        beforeSend: function () {
          $(tableSelector + " tbody").html(`
            <tr class="loader-row">
              <td colspan="9" class="text-center">
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
          `);
        },
        success: function (response) {
          if (!hasPermission(50)) {
            $(tableSelector + " tbody").html(`
              <tr class="loader-row">
                <td colspan="9" class="text-center">
                  <p>You don't have access to view this data.</p>
                </td>
              </tr>
            `);
          } else {
            const filteredData = filterCallback(response.data);
            callback({
              draw: data.draw,
              recordsTotal: response.data.length,
              recordsFiltered: filteredData.length,
              data: filteredData,
            });
          }
        },
        error: function () {
          alert("Failed to fetch data.");
        },
      });
    },
    columns: [
      { data: null, render: (data, type, row, meta) => meta.row + 1 },
      {
        data: "payer_id",
        render: function (data, type, row) {
          return `<a href="payedetails.html?id=${row.id}&payerId=${row.payer_id}&name=${row.name}" class="text-primary">${data}</a>`;
        },
      },
      { data: "name" },
      { data: "industry" },
      { data: "employee_count" },
      {
        data: "total_annual_tax",
        render: (data) =>
          `₦ ${Number(data).toLocaleString("en-NG", { minimumFractionDigits: 2 })}`,
      },
      {
        data: "total_monthly_tax",
        render: (data) =>
          `₦ ${Number(data).toLocaleString("en-NG", { minimumFractionDigits: 2 })}`,
      },
      {
        data: "total_payments",
        render: (data) =>
          `₦ ${Number(data).toLocaleString("en-NG", { minimumFractionDigits: 2 })}`,
      },
      {
        data: null,
        render: (data, type, row) => `
          <span class="badge ${getDynamicStatusBadge(row)}">
            ${getStatusText(row)}
          </span>
        `,
      },
      {
        data: "id",
        render: function (data, type, row) {
          return `<a href="payedetails.html?id=${row.id}&payerId=${row.payer_id}&name=${row.name}" class="btn btn-primary btn-sm">View</a>`;
        },
      },
    ],
  });
}
const table2 = $("#datatable1").DataTable({
  serverSide: true,
  paging: true,
  ordering: false,
  pageLength: 50,
  responsive: true,
  searchDelay: 500,
  pagingType: "simple_numbers",
  ajax: function (data, callback, settings) {
    // Convert DataTables page number to your API page number
    const pageNumber = Math.ceil(data.start / data.length) + 1;

    const filters = {
      page: pageNumber,
      limit: data.length,
      // search: data.search.value,
    };

    // Call your API with the calculated page number
    $.ajax({
      url: `${HOST}/get-special-users?category=${type}`,
      type: "GET",
      data: filters,
      dataType: "json",
      headers: {
        Authorization: "Bearer " + authToken,
      },
      beforeSend: function () {
        // Optional: Add a loading indicator
        $("#datatable1 tbody").html(`
          <tr class="loader-row">
            <td colspan="9" class="text-center">
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
        `);
      },
      success: function (response) {
        // Filter only defaulters
        if (!hasPermission(50)) {
          $("#datatable1 tbody").html(`
            <tr class="loader-row">
              <td colspan="9" class="text-center">
                <p>You don't have access to view this data.</p>
              </td>
            </tr>
          `);
        } else {
          const defaulters = response.data.filter(isDefaulter);

          // Map the filtered data to DataTables format
          callback({
            draw: data.draw, // Pass through draw counter
            recordsTotal: response.data.length, // Total records in database
            recordsFiltered: defaulters.length, // Only filtered defaulters count
            data: defaulters, // The filtered data array
          });
        }
      },
      error: function () {
        alert("Failed to fetch data.");
      },
    });
  },
  columns: [
    { data: null, render: (data, type, row, meta) => meta.row + 1 },
    {
      data: "payer_id",
      render: function (data, type, row) {
        return `
                <a href="payedetails.html?id=${row.id}&payerId=${row.payer_id}&name=${row.name}" class="text-primary">${data}</a>
          `;
      },
    },
    { data: "name" },
    { data: "industry" },
    { data: "employee_count" },
    {
      data: "total_annual_tax",
      render: (data) =>
        `₦ ${Number(data).toLocaleString("en-NG", {
          minimumFractionDigits: 2,
        })}`,
    },
    {
      data: "total_monthly_tax",
      render: (data) =>
        `₦ ${Number(data).toLocaleString("en-NG", {
          minimumFractionDigits: 2,
        })}`,
    },
    {
      data: "total_payments",
      render: (data) =>
        `₦ ${Number(data).toLocaleString("en-NG", {
          minimumFractionDigits: 2,
        })}`,
    },
    {
      data: null,
      render: (data, type, row) => `
          <span class="badge ${getDynamicStatusBadge(row)}">
            ${getStatusText(row)}
          </span>
        `,
    },
    {
      data: "id",
      render: function (data, type, row) {
        return `
                <a href="payedetails.html?id=${row.id}&payerId=${row.payer_id}&name=${row.name}" class="btn btn-primary btn-sm">View</a>
          `;
      },
    },
  ],
});

const table3 = $("#datatable2").DataTable({
  serverSide: true,
  paging: true,
  ordering: false,
  pageLength: 50,
  responsive: true,
  searchDelay: 500,
  pagingType: "simple_numbers",
  ajax: function (data, callback, settings) {
    const pageNumber = Math.ceil(data.start / data.length) + 1;

    const filters = {
      page: pageNumber,
      limit: data.length,
    };

    $.ajax({
      url: `${HOST}/get-special-users?category=${type}`,
      type: "GET",
      data: filters,
      dataType: "json",
      headers: {
        Authorization: "Bearer " + authToken,
      },
      beforeSend: function () {
        $("#datatable2 tbody").html(`
          <tr class="loader-row">
            <td colspan="9" class="text-center">
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
        `);
      },
      success: function (response) {
        // Only show current (non-defaulters)
        if (!hasPermission(50)) {
          $("#datatable2 tbody").html(`
            <tr class="loader-row">
              <td colspan="9" class="text-center">
                <p>You don't have access to view this data.</p>
              </td>
            </tr>
          `);
        } else {
          const currentUsers = response.data.filter(
            (taxpayer) => !isDefaulter(taxpayer)
          );

          callback({
            draw: data.draw,
            recordsTotal: response.data.length,
            recordsFiltered: currentUsers.length,
            data: currentUsers,
          });
        }
      },
      error: function () {
        alert("Failed to fetch data.");
      },
    });
  },
  columns: [
    { data: null, render: (data, type, row, meta) => meta.row + 1 },
    {
      data: "payer_id",
      render: function (data, type, row) {
        return `
                <a href="payedetails.html?id=${row.id}&payerId=${row.payer_id}&name=${row.name}" class="text-primary">${data}</a>
          `;
      },
    },
    { data: "name" },
    { data: "industry" },
    { data: "employee_count" },
    {
      data: "total_annual_tax",
      render: (data) =>
        `₦ ${Number(data).toLocaleString("en-NG", {
          minimumFractionDigits: 2,
        })}`,
    },
    {
      data: "total_monthly_tax",
      render: (data) =>
        `₦ ${Number(data).toLocaleString("en-NG", {
          minimumFractionDigits: 2,
        })}`,
    },
    {
      data: "total_payments",
      render: (data) =>
        `₦ ${Number(data).toLocaleString("en-NG", {
          minimumFractionDigits: 2,
        })}`,
    },
    {
      data: null,
      render: (data, type, row) => `
          <span class="badge ${getDynamicStatusBadge(row)}">
            ${getStatusText(row)}
          </span>
        `,
    },
    {
      data: "id",
      render: function (data, type, row) {
        return `
                <a href="payedetails.html?id=${row.id}&payerId=${row.payer_id}&name=${row.name}" class="btn btn-primary btn-sm">View</a>
          `;
      },
    },
  ],
});

// Helper functions
function isDefaulter(taxpayer) {
  // Example logic to determine if a taxpayer is a defaulter
  return (
    parseFloat(taxpayer.total_payments) < parseFloat(taxpayer.total_monthly_tax)
  );
}

function getDynamicStatusBadge(taxpayer) {
  if (isDefaulter(taxpayer)) {
    return "badge-danger rounded-pill";
  }
  return "badge-success rounded-pill";
}

function getStatusText(taxpayer) {
  return isDefaulter(taxpayer) ? "Defaulter" : "Current";
}

// Fetch paye on page load
$(document).ready(function () {
  fetchpaye();
});

// Optional: Add event listeners for filtering or pagination
$(".apply-filter").on("click", function () {
  fetchpaye();
});

// CARDS INTEGRATION

function getCurrentMonthYear() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

async function fetchTotalAnnualEstimate(year) {
  $("#totalAnnualEstimate").html(
    '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>'
  );
  try {
    const response = await fetch(
      `${HOST}/get-total-annual-estimate?year=${year}`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + authToken,
        "Content-Type": "application/json",
      },
    }
    );
    const data = await response.json();

    if (data.status === "success") {
      $("#totalAnnualEstimate").html(
        `₦ ${Number(data.total_annual_estimate).toLocaleString("en-NG", {
          minimumFractionDigits: 2,
        })}`
      );
    } else {
      $("#totalAnnualEstimate").html(0);
    }
  } catch (error) {
    console.error("Error fetching total annual revenue:", error);
    $("#totalAnnualEstimate").html(0);
  }
}

async function fetchTotalAnnualRemittance(year) {
  $("#totalAnnualRemittance").html(
    '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>'
  );
  try {
    const response = await fetch(
      `${HOST}/get-total-annual-remittance?year=${year}`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + authToken,
        "Content-Type": "application/json",
      },
    }
    );
    const data = await response.json();

    if (data.status === "success") {
      $("#totalAnnualRemittance").html(
        `₦ ${Number(data.total_annual_remittance).toLocaleString("en-NG", {
          minimumFractionDigits: 2,
        })}`
      );
    } else {
      $("#totalAnnualRemittance").html(0);
    }
  } catch (error) {
    console.error("Error fetching total annual revenue:", error);
    $("#totalAnnualRemittance").html(0);
  }
}

async function fetchTotalMonthlyEstimate(monthYear) {
  $("#monthlyEstimate").html(
    '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>'
  );
  const [year, month] = monthYear.split("-");
  try {
    const response = await fetch(
      `${HOST}/get-monthly-estimate?month=${month}&year=${year}`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + authToken,
        "Content-Type": "application/json",
      },
    }
    );
    const data = await response.json();

    if (data.status === "success") {
      $("#monthlyEstimate").html(
        `₦ ${Number(data.total_monthly_estimate).toLocaleString("en-NG", {
          minimumFractionDigits: 2,
        })}`
      );
    } else {
      $("#monthlyEstimate").html(0);
    }
  } catch (error) {
    console.error("Error fetching total revenue:", error);
    $("#monthlyEstimate").html(0);
  }
}

function populateYearDropdown(annualRevFilter) {
  const yearSelect = document.querySelector(`.${annualRevFilter}`);
  const currentYear = new Date().getFullYear();
  const startYear = 2024; // Fixed start year
  const endYear = currentYear; // 2 years beyond current year

  for (let year = startYear; year <= endYear; year++) {
    const option = document.createElement("option");
    option.value = year;
    option.textContent = year;
    yearSelect.appendChild(option);
  }

  yearSelect.value = currentYear;
}

async function fetchUserAndEmployeeCounts() {
  try {
    const [specialUsersResponse, employeesResponse] = await Promise.all([
      fetch(`${HOST}/get-total-special-users`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + authToken,
          "Content-Type": "application/json",
        },
      }),
      fetch(`${HOST}/get-total-employees`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + authToken,
          "Content-Type": "application/json",
        },
      }),
    ]);

    const specialUsersData = await specialUsersResponse.json();
    const employeesData = await employeesResponse.json();

    if (specialUsersData.status === "success") {
      $("#totalSpecialUsers").text(specialUsersData.total_special_users);
    } else {
      $("#totalSpecialUsers").text(0);
    }

    if (employeesData.status === "success") {
      $("#totalEmployees").text(employeesData.total_employees);
    } else {
      $("#totalEmployees").text(0);
    }
  } catch (error) {
    console.error("Error fetching user and employee counts:", error);

    $("#totalSpecialUsers").text(0);
    $("#totalEmployees").text(0);
  }
}

async function fetchTotalMonthlyRemittance(monthYear) {
  const [year, month] = monthYear.split("-");
  $("#totalMonthlyRemittance").html(
    '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>'
  );
  try {
    const response = await fetch(
      `${HOST}/paye-invoices-paid?year=${year}&month=${month}`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + authToken,
        "Content-Type": "application/json",
      },
    }
    );
    const data = await response.json();

    if (data.status === "success") {
      $("#totalMonthlyRemittance").html(
        `₦ ${Number(data.data.total_paid).toLocaleString("en-NG", {
          minimumFractionDigits: 2,
        })}`
      );
    } else {
      $("#totalMonthlyRemittance").html("₦ 0");
    }
  } catch (error) {
    console.error("Error fetching estimated monthly tax payable:", error);
    $("#totalMonthlyRemittance").html("₦ 0");
  }
}

document.addEventListener("DOMContentLoaded", () => {

  const yearInput = document.querySelector(".annualEstFilter");
  const yearInput2 = document.querySelector(".annualRemiFilter");
  const monthInput = document.querySelector(".monthlyEstiFilter");
  const monthInput2 = document.querySelector(".monthlyRemiFilter2");
  const currentMonthYear = getCurrentMonthYear();
  const currentYear = new Date().getFullYear();

  populateYearDropdown("annualEstFilter");
  populateYearDropdown("annualRemiFilter");

  yearInput.value = currentYear;
  yearInput2.value = currentYear;
  monthInput.value = currentMonthYear;
  monthInput2.value = currentMonthYear;

  fetchTotalAnnualEstimate(currentYear);
  fetchTotalAnnualRemittance(currentYear);
  fetchTotalMonthlyEstimate(currentMonthYear);
  fetchTotalMonthlyRemittance(currentMonthYear);
  fetchUserAndEmployeeCounts();

  yearInput.addEventListener("change", (event) => {
    const selectedYear = event.target.value;
    fetchTotalAnnualEstimate(selectedYear);
  });

  yearInput2.addEventListener("change", (event) => {
    const selectedYear = event.target.value;
    fetchTotalAnnualRemittance(selectedYear);
  });

  monthInput.addEventListener("change", (event) => {
    const selectedMonthYear = event.target.value;
    fetchTotalMonthlyEstimate(selectedMonthYear);
  });

  monthInput2.addEventListener("change", (event) => {
    const selectedMonthYear = event.target.value;
    fetchTotalMonthlyRemittance(selectedMonthYear);
  });
});

function exportData() {
  // console.log(dataToExport)
  const csvRows = [];

  // Extract headers (keys) excluding 'id'
  const headers = Object.keys(dataToExport[0]).filter((key) => key !== "id");
  csvRows.push(headers.join(",")); // Join headers with commas

  // Loop through the data to create CSV rows
  for (const row of dataToExport) {
    const values = headers.map((header) => {
      const value = row[header];
      return `"${value}"`; // Escape values with quotes
    });
    csvRows.push(values.join(","));
  }

  // Combine all rows into a single string
  const csvString = csvRows.join("\n");

  // Export to a downloadable file
  const blob = new Blob([csvString], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "Paye.csv";
  a.click();
}
