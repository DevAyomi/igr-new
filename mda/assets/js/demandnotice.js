const $tableBody = $(".demandTable tbody");

let currentPage = 1;
const limit = 50;

let dataToExport = [];

$(document).ready(function () {

  if ($.fn.DataTable.isDataTable('#datatable')) {
    $('#datatable').DataTable().clear().destroy();
  }

  table = $("#datatable").DataTable({
    // processing: true,
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
        // Add any additional filters
        mda_id: mdaId,
      };

      // Call your API with the calculated page number
      $.ajax({
        url: `${HOST}/get-demand-notice-invoices`,
        type: 'GET',
        data: filters,
        headers: {
          Authorization: "Bearer " + authToken,
        },
        dataType: "json",
        beforeSend: function () {
          // Optional: Add a loading indicator
          $("#datatable tbody").html(`
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
        `);
        },
        success: function (response) {
          // Map the API response to DataTables expected format
          callback({
            draw: data.draw, // Pass through draw counter
            recordsTotal: response.data.total_demand_notices, // Total records in your database
            recordsFiltered: response.data.total_demand_notices, // Filtered records count
            data: response.data.demand_notices, // The actual data array from your API
          });

        },
        error: function () {
          $("#datatable tbody").html(`
            <tr>
              <td colspan="8" class="text-center">
                Failed to Fetch Data
              </td>
            </tr>
          `);
        },
      });
    },
    columns: [
      {
        data: null,
        render: function (data, type, row, meta) {
          return meta.row + 1; // Serial number
        },
      },
      { data: "tax_number" },
      {
        data: "revenue_heads",
        render: function (data) {
          return data.map((head) => head.mda_name).join("<br>");
        },
      },
      {
        data: "revenue_heads",
        render: function (data) {
          return data.map((head) => head.item_name).join("<br>");
        },
      },
      {
        data: null,
        render: function (data, type, row) {
          return `${row.tax_first_name} ${row.tax_last_name}`;
        },
      },
      { data: "invoice_number" },
      {
        data: "amount_paid",
        render: function (data) {
          return `₦ ${parseFloat(data).toLocaleString()}`;
        },
      },
      {
        data: "date_created",
        render: function (data) {
          return new Date(data).toLocaleDateString();
        },
      },
      {
        data: "payment_status",
        render: function (data) {
          const statusClass =
            data === "paid" ? "badge-success" : "badge-danger";
          return `<span class="badge ${statusClass}">${data}</span>`;
        },
      },
      {
        data: "invoice_number",
        render: function (data, type, row) {
          return `
            <a href="./demandnotice/demandinvoice.html.html?invoice_number=${data}" 
               class="btn btn-primary btn-sm" target="_blank">
                View Invoice
            </a>
          `;
        },
      },
    ],
  });


  $("#applyFilter").on("click", function (e) {
    $("#datatable").DataTable().draw(); // Redraw the table with new filters
    $("#filterInvoiceModal").modal("hide")
  });

  // Optional: Clear filters
  $("#clear-filters").on("click", function () {
    $("#revenue_head, #status, #start_date, #end_date").val("");
    $("#datatable").DataTable().draw();
  });
});


async function fetchDemandNotice(page) {
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
  $(".demandTable tbody").html(loaderRow);

  $.ajax({
    type: "GET",
    url: `${HOST}/get-demand-notice-invoices?page=${page}&limit=${limit}&mda_id=${mdaId}`,
    dataType: "json",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + authToken
    },
    success: function (response) {
      $tableBody.empty();
      if (response.status === "success") {
        const demandNotices = response.data.demand_notices;

        dataToExport = demandNotices;
        demandNotices.forEach((demandNotice, index) => {
          const row = `
            <tr>
              <td>${index + 1}</td>
              <td>${demandNotice.tax_number}</td>
              <td>${demandNotice.revenue_heads[0].mda_name}</td>
              <td>${demandNotice.revenue_heads[0].item_name}</td>
              <td>${demandNotice.tax_first_name} ${demandNotice.tax_last_name
            }</td>
              <td>${demandNotice.invoice_number}</td>
              <td>₦ ${parseFloat(demandNotice.amount_paid).toLocaleString(
              "en-NG",
              { minimumFractionDigits: 2 }
            )}</td>
              <td>${demandNotice.date_created.split(" ")[0]}</td>
              <td>${demandNotice.payment_status === "paid"
              ? `<span class="badge badge-success rounded-pill">paid</span>`
              : `<span class="badge badge-danger rounded-pill">unpaid</span>`
            }</td>
              <td>
                <a href="./demandnotice/demandinvoice.html?invoice_number=${demandNotice.invoice_number
            }" class="btn btn-sm btn-primary">View</a>
              </td>
            </tr>
          `;
          $tableBody.append(row);
        });
      } else {
        alert(response.message || "Failed to fetch data.");
      }
    },
    error: function (err) {
      showLoader(false); // Hide the loader
      console.error("Error fetching data:", err);
      $tableBody.html(`
          <tr>
            <td colspan="11" class="text-center text-danger">Failed to load Notices</td>
          </tr>
        `);
    },
  });
}

async function fetchStatsNotice() {
  $.ajax({
    type: "GET",
    url: `${HOST}/get-demand-notice-metrics?mda_id=${mdaId}`,
    dataType: "json",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + authToken
    },
    success: function (response) {
      $tableBody.empty();
      if (response.status === "success") {
        const demandNotices = response.data;
        $("#totalNumberOfDemandNotices").text(
          demandNotices.total_demand_notices
        );
        $("#totalAmountOfGeneratedNotices").text(
          `₦ ${parseFloat(demandNotices.total_amount_generated).toLocaleString(
            "en-NG",
            { minimumFractionDigits: 2 }
          )}`
        );
        $("#amountOfPaidNotices").text(
          `₦ ${parseFloat(demandNotices.total_amount_paid).toLocaleString(
            "en-NG",
            { minimumFractionDigits: 2 }
          )}`
        );
        $("#amountOfUnpaidNotices").text(
          `₦ ${parseFloat(demandNotices.total_amount_unpaid).toLocaleString(
            "en-NG",
            { minimumFractionDigits: 2 }
          )}`
        );
      } else {
        $("#totalNumberOfDemandNotices").text(0);
        $("#totalAmountOfGeneratedNotices").text(0);
        $("#amountOfPaidNotices").text(0);
        $("#amountOfUnpaidNotices").text(0);
      }
    },
    error: function (err) {
      console.error("Error fetching data:", err);
      $("#totalNumberOfDemandNotices").text(0);
      $("#totalAmountOfGeneratedNotices").text("₦ " + 0);
      $("#amountOfPaidNotices").text("₦ " + 0);
      $("#amountOfUnpaidNotices").text("₦ " + 0);
    },
  });
}

// fetchDemandNotice(currentPage);
fetchStatsNotice();

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
  a.download = "demandnotice.csv";
  a.click();
}
