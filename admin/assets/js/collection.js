const currentPage = 1; // Change this if paginated
const limit = 50;

let dataToExport;

$(document).ready(function () {
  $("#datatable").DataTable({
    serverSide: true,
    paging: true,
    ordering: false,
    pageLength: 50,
    responsive: true,
    searchDelay: 500,
    pagingType: "simple_numbers",
    searching: false,
    ajax: function (data, callback, settings) {
      // Convert DataTables page number to your API page number
      const pageNumber = Math.ceil(data.start / data.length) + 1;

      const filters = {
        page: pageNumber,
        limit: data.length,
        // search: data.search.value,
        // Add any additional filters
        revenue_head: $("#revenueHead").val(),
        mda: $("#mda").val(),
        payment_status: $("#paymentStatus").val(),
        start_date: $("#fromInput").val(),
        end_date: $("#toInput").val(),
      };

      // Call your API with the calculated page number
      $.ajax({
        url: `${HOST}/get-payment`,
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
          // Map the API response to DataTables expected format
          if (!hasPermission(16)) { // View Collection List
            $("#datatable tbody").html(`
              <tr class="loader-row">
                <td colspan="11" class="text-center">
                  <p>You don't have access to view this data !</p>
                </td>
              </tr>
            `);
          } else {
            dataToExport = response.data
            callback({
              draw: data.draw, // Pass through draw counter
              recordsTotal: response.pagination.total_records, // Total records in your database
              recordsFiltered: response.pagination.total_records, // Filtered records count
              data: response.data, // The actual data array from your API
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

      {
        data: "associated_revenue_heads",
        render: function (data) {
          return data.map((head) => head.mda_name).join("<br>");
        },
      },
      {
        data: "associated_revenue_heads",
        render: function (data) {
          return data.map((head) => head.item_name).join("<br>");
        },
      },
      {
        data: "user_info",
        render: function (data, type, row) {
          return `${data.first_name} ${data.surname}`;
        },
      },
      { data: "tax_number" },
      { data: "invoice_number" },
      {
        data: "amount_paid",
        render: function (data) {
          return `₦ ${parseFloat(data).toLocaleString()}`;
        },
      },
      { data: "payment_gateway" },
      { data: "payment_method" },
      { data: "payment_bank" },
      { data: "payment_reference_number" },
      { data: "invoice_number" },
      {
        data: "timeIn",
        render: function (data) {
          return new Date(data).toLocaleDateString();
        },
      },
      {
        data: "invoice_number",
        render: function (data, type, row) {
          return `
            <a href="../invoiceGeneration/payment-receipt.html?invoice_number=${data}" 
               class="btn btn-primary btn-sm" target="_blank">
                View Invoice
            </a>
          `;
        },
      },
    ],
  });

  $("#filter-form").on("submit", function (e) {
    e.preventDefault();
    $("#datatable").DataTable().draw(); // Redraw the table with new filters
  });

  // Optional: Clear filters
  $("#clear-filters").on("click", function () {
    $("#revenue_head, #status, #start_date, #end_date").val("");
    $("#datatable").DataTable().draw();
  });
});

// Event listener for "Apply" button in the filter modal
$("#filterInvoiceModal #applyFilter").on("click", function () {
  const filters = {
    mda: $("#mda").val(),
    revenue_head: $("#revenueHead").val(),
    payment_status: $("#paymentStatus").val(),
    date_created_start: $("#fromInput").val(),
    date_created_end: $("#toInput").val(),
  };

  $("#datatable").DataTable().draw();

  // Close modal after applying filter
  $("#filterInvoiceModal").modal("hide");

  // Fetch payments with the applied filters
  // fetchPayments(filters);
});

// Event listener for "Clear filter" button
$("#filterInvoiceModal #clearFilter").on("click", function () {
  // Reset all filter fields
  $("#filterInvoiceModal select, #filterInvoiceModal input").val("");

  // Refresh payment list without filters
  // fetchPayments();
  $("#datatable").DataTable().draw();
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
  a.download = "collection.csv";
  a.click();
}
