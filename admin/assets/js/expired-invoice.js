const currentPage = 1; // Change this if paginated
const limit = 50;

let dataToExport;

$(document).ready(function () {
  if ($.fn.DataTable.isDataTable("#datatable")) {
    $("#datatable").DataTable().clear().destroy();
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
        revenue_head_id: $("#revenue_head").val(),
        mda_id: $("#mda").val(),
        tax_number: $("#taxNumber").val(),
        status: $("#status").val(),
        start_date: $("#start_date").val(),
        end_date: $("#end_date").val(),
      };

      // Call your API with the calculated page number
      $.ajax({
        url: `${HOST}/get-due-invoices`,
        type: "GET",
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
          if (!hasPermission(14)) { // View Invoice List
            $("#datatable tbody").html(`
              <tr class="loader-row">
                <td colspan="11" class="text-center">
                  <p>You don't have access to view this data !</p>
                </td>
              </tr>
            `);
          } else {
            dataToExport = response.data.invoices;
            // Map the API response to DataTables expected format
            callback({
              draw: data.draw, // Pass through draw counter
              recordsTotal: response.data.total_invoices, // Total records in your database
              recordsFiltered: response.data.total_invoices, // Filtered records count
              data: response.data.invoices, // The actual data array from your API
            });
          }
        },
        error: function () {
          alert("Failed to fetch data.");
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
        data: "due_date",
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
          if (row.payment_status === "paid") {
            return `
              <a href="../invoiceGeneration/payment-receipt.html?invoice_number=${data}" 
                 class="btn btn-primary btn-sm" target="_blank">
                  View Receipt
              </a>
            `;
          } else {
            return `
              <a href="../invoiceGeneration/invoice.html?invoice_number=${data}" 
                class="btn btn-primary btn-sm" target="_blank">
                  View Invoice
              </a>
            `;
          }
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
});

// Initialize Selectize on #mda and #revenueHead
const mdaSelectize = $("#mda").selectize({
  placeholder: "Select a mda...",
});

const revenueHeadSelectize = $("#revenueHead").selectize({
  placeholder: "Select a revenue head...",
});

// Fetch MDA data
function fetchMdaData() {
  $.ajax({
    type: "GET",
    url: `${HOST}/get-mdas`,
    dataType: "json",
    headers: {
      Authorization: "Bearer " + authToken,
      "Content-Type": "application/json",
    },
    crossDomain: true,
    success: function (response) {
      if (response.status === "success" && response.data.mdas.length > 0) {
        const mdas = response.data.mdas;
        const mdaSelectizeInstance = mdaSelectize[0].selectize;

        // Clear existing options
        mdaSelectizeInstance.clearOptions();

        // Add a default placeholder option
        mdaSelectizeInstance.addOption({ value: "", text: "Select a mda..." });

        // Populate MDA options
        mdas.forEach((mda) => {
          mdaSelectizeInstance.addOption({ value: mda.id, text: mda.fullname });
        });

        // Refresh Selectize options
        mdaSelectizeInstance.refreshOptions(false);
      } else {
        alert("No MDA data available.");
      }
    },
    error: function (err) {
      console.error("Error fetching MDA data:", err);
      alert("An error occurred while fetching the MDA data.");
    },
  });
}

// Fetch Revenue Heads for selected MDA
function fetchRevenueHeadData(mdaId) {
  $.ajax({
    type: "GET",
    url: `${HOST}/get-revenue-head?mda_id=${mdaId}`,
    dataType: "json",
    headers: {
      Authorization: "Bearer " + authToken,
      "Content-Type": "application/json",
    },
    crossDomain: true,
    success: function (response) {
      const revenueHeadSelectizeInstance = revenueHeadSelectize[0].selectize;

      // Clear existing options
      revenueHeadSelectizeInstance.clearOptions();

      if (response.status === "success" && response.data.length > 0) {
        const revenueHeads = response.data;

        // Add default placeholder option
        revenueHeadSelectizeInstance.addOption({
          value: "",
          text: "Select a revenue head...",
        });

        // Populate Revenue Head options
        revenueHeads.forEach((revenueHead) => {
          revenueHeadSelectizeInstance.addOption({
            value: revenueHead.id,
            text: revenueHead.item_name,
          });
        });

        // Refresh Selectize options
        revenueHeadSelectizeInstance.refreshOptions(false);
      } else {
        revenueHeadSelectizeInstance.addOption({
          value: "",
          text: "No revenue heads available.",
        });
        revenueHeadSelectizeInstance.refreshOptions(false);
      }
    },
    error: function (err) {
      console.error("Error fetching Revenue Heads:", err);
      alert("An error occurred while fetching the Revenue Heads.");
    },
  });
}

// Listen for changes in MDA select dropdown
mdaSelectize[0].selectize.on("change", function (value) {
  if (value) {
    // Fetch revenue heads for the selected MDA
    fetchRevenueHeadData(value);
  } else {
    // Clear revenue head options if no MDA is selected
    const revenueHeadSelectizeInstance = revenueHeadSelectize[0].selectize;
    revenueHeadSelectizeInstance.clearOptions();
    revenueHeadSelectizeInstance.addOption({
      value: "",
      text: "Select a revenue head...",
    });
    revenueHeadSelectizeInstance.refreshOptions(false);
  }
});

// Fetch initial MDA data
fetchMdaData();
// Event listener for "Apply" button in the filter modal
$("#filterInvoiceModal #applyFilter").on("click", function () {
  const filters = {
    mda_id: $("#mda").val(),
    revenue_head_id: $("#revenueHead").val(),
    tax_number: $("#taxNumber").val(),
    payment_status: $("#paymentStatus").val(),
    date_created_start: $("#fromInput").val(),
    date_created_end: $("#toInput").val(),
  };

  // Close modal after applying filter
  $("#filterInvoiceModal").modal("hide");

  // Fetch invoices with the applied filters
  $("#datatable").DataTable().draw();
});

// Event listener for "Clear filter" button
$("#filterInvoiceModal #clearFilter").on("click", function () {
  // Reset all filter fields
  $("#filterInvoiceModal select, #filterInvoiceModal input").val("");

  // Refresh invoice list without filters
  $("#datatable").DataTable().draw();
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
  a.download = "expired_invoice.csv";
  a.click();
}

function fetchInvoiceStatistics() {
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

fetchInvoiceStatistics();
