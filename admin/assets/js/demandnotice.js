let dataToExport;

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
        revenue_head_id: $("#revenueHead").val(),
        mda_id: $("#mda").val(),
        tax_number: $("#taxNumber").val(),
        payment_status: $("#paymentStatus").val(),
        start_date: $("#fromInput").val(),
        end_date: $("#toInput").val(),
      };

      // Call your API with the calculated page number
      $.ajax({
        url: `${HOST}/get-demand-notice-invoices`,
        type: 'GET',
        data: filters,
        dataType: "json",
        headers: {
          Authorization: "Bearer " + authToken,
          "Content-Type": "application/json",
        },
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
          if (!hasPermission(55)) { // View Demand Notice
            $("#datatable tbody").html(`
              <tr class="loader-row">
                <td colspan="11" class="text-center">
                  <p>You don't have access to view this data !</p>
                </td>
              </tr>
            `);
          } else {
            dataToExport = response.data.demand_notices
            callback({
              draw: data.draw, // Pass through draw counter
              recordsTotal: response.data.total_demand_notices, // Total records in your database
              recordsFiltered: response.data.total_demand_notices, // Filtered records count
              data: response.data.demand_notices, // The actual data array from your API
            });
          }

        },
        error: function () {
          alert('Failed to fetch data.');
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

  // $('.dt-search input').off().on('keyup', function () {
  //   const searchValue = this.value;

  //   if (searchValue.length > 0) {
  //     // Client-side search — don't call API
  //     table.search(searchValue).draw(false);
  //   } else {
  //     // Only reload API if search is empty
  //     table.search('').draw();
  //   }
  // });

  $("#applyFilter").on("click", function (e) {
    e.preventDefault();
    $("#filterInvoiceModal").modal("hide")
    $("#datatable").DataTable().draw(); // Redraw the table with new filters
  });

  // Optional: Clear filters
  $("#clearFilter").on("click", function () {
    $("#revenueHead, #mda, #paymentStatus, #taxNumber, #fromInput, #toInput").val("");
    $("#filterInvoiceModal").modal("hide")
    $("#datatable").DataTable().draw();
  });
});


async function fetchStatsNotice(dateStart = "", dateEnd = "") {
  let url = `${HOST}/get-demand-notice-metrics`;

  if (dateStart && dateEnd) {
    url += `?date_created_start=${dateStart}&date_created_end=${dateEnd}`;
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
        const demandNotices = response.data;
        $("#totalNumberOfDemandNotices").text(demandNotices.total_demand_notices);
        $("#totalAmountOfGeneratedNotices").text(`₦ ${parseFloat(demandNotices.total_amount_generated).toLocaleString('en-NG', { minimumFractionDigits: 2 })}`);
        $("#amountOfPaidNotices").text(`₦ ${parseFloat(demandNotices.total_amount_paid).toLocaleString('en-NG', { minimumFractionDigits: 2 })}`);
        $("#amountOfUnpaidNotices").text(`₦ ${parseFloat(demandNotices.total_amount_unpaid).toLocaleString('en-NG', { minimumFractionDigits: 2 })}`);
      } else {
        resetStats();
      }
    },
    error: function (err) {
      console.error("Error fetching data:", err);
      resetStats();
    },
  });
}

function resetStats() {
  $("#totalNumberOfDemandNotices").html(0);
  $("#totalAmountOfGeneratedNotices").html('₦ 0.00');
  $("#amountOfPaidNotices").html('₦ 0.00');
  $("#amountOfUnpaidNotices").html('₦ 0.00');
}

$("#applyBtn").click(() => {
  const dateStart = $(".fromDate").val();
  const dateEnd = $(".toDate").val();

  if (!dateStart || !dateEnd) {
    alert("Please select both From and To dates!");
    return;
  }

  $("#totalNumberOfDemandNotices").html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>');
  $("#totalAmountOfGeneratedNotices").html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>');
  $("#amountOfPaidNotices").html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>');
  $("#amountOfUnpaidNotices").html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>');

  fetchStatsNotice(dateStart, dateEnd);
});

if (!hasPermission(55)) {
  $("#totalNumberOfDemandNotices").text(0);
  $("#totalAmountOfGeneratedNotices").text(0);
  $("#amountOfPaidNotices").text(0);
  $("#amountOfUnpaidNotices").text(0);
} else {
  fetchStatsNotice()
}

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