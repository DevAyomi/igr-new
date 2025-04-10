const currentPage = 1; // Change this if paginated
const limit = 50;

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
        // search: data.search.value,
        // Add any additional filters
        mda_id: mdaId,

      };

      // Call your API with the calculated page number
      $.ajax({
        url: `${HOST}/get-mda-payments`,
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
            recordsTotal: response.pagination.total_records, // Total records in your database
            recordsFiltered: response.pagination.total_records, // Filtered records count
            data: response.data, // The actual data array from your API
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

      {
        data: "associated_revenue_heads",
        render: function (data) {
          return data.map((head) => head.item_name).join("<br>");
        },
      },
      {
        data: "user_info",
        render: function (data, type, row) {
          return `${data?.first_name} ${data?.surname}`;
        }
      },
      { data: "invoice_number" },
      {
        data: "amount_paid",
        render: function (data) {
          return `₦ ${parseFloat(data).toLocaleString()}`;
        },
      },
      {
        data: "date_payment_created", render: function (data) {
          return new Date(data).toLocaleDateString();
        }
      },
      { data: "payment_channel" },
      { data: "payment_reference_number" },
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

function fetchPayments(filters = {}) {
  const { revenue_head, invoice_number, payment_status, start_date, end_date } =
    filters;

  const queryParams = new URLSearchParams({
    page: currentPage,
    limit: limit,
    ...(invoice_number && { invoice_number }),
    ...(revenue_head && { revenue_head }),
    ...(payment_status && { payment_status }),
    ...(start_date && { start_date }),
    ...(end_date && { end_date }),
  });

  const $tbody = $("#datatable tbody");
  const loaderRow = `
      <tr class="loader-row">
        <td colspan="16" class="text-center">
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
    url: `${HOST}/get-mda-payments?mda_id=${mdaId}&${queryParams.toString()}`,
    dataType: "json",
    headers: {
      Authorization: "Bearer " + authToken,
      "Content-Type": "application/json",
    },
    crossDomain: true,
    success: function (response) {
      if (response.status === "success" && response.data.length > 0) {
        const payments = response.data;

        dataToExport = payments.map((payment, index) => ({
          SNo: index + 1,
          RevenueHeads: payment.associated_revenue_heads
            .map((head) => `${head.item_name} (${head.mda_name})`)
            .join(", "),
          UserName: `${payment.user_info?.first_name || "N/A"} ${payment.user_info?.surname || "N/A"
            }`,
          InvoiceNumber: payment.invoice_number || "N/A",
          AmountPaid: `₦ ${parseFloat(payment.amount_paid).toLocaleString()}`,
          Date: new Date(payment.date_payment_created).toLocaleDateString(),
          PaymentMethod: payment.payment_method || "N/A",
          PaymentReference: payment.payment_reference_number || "N/A",
        }));
        $tbody.empty(); // Clear the loader and existing rows

        payments.forEach((payment, index) => {
          const revenueHeads = payment.associated_revenue_heads
            .map((head) => `${head.item_name}`)
            .join(", ");

          const row = `
              <tr>
                <td>${index + 1}</td>
                <td>${revenueHeads}</td>
                <td>${payment.user_info?.first_name || "N/A"} ${payment.user_info?.surname || "N/A"
            }</td>
                <td>${payment.invoice_number || "N/A"}</td>
                <td>₦ ${parseFloat(payment.amount_paid).toLocaleString()}</td>
                <td>${new Date(
              payment.date_payment_created
            ).toLocaleDateString()}</td>
                
                <td>${payment.payment_method || "N/A"}</td>
                <td>${payment.payment_reference_number || "N/A"}</td>
                <td>
                  <div>
                    <a href="../invoiceGeneration/payment-receipt.html?invoice_number=${payment.invoice_number
            }" class="btn btn-primary btn-sm" target="_blank">
                      View Receipt
                    </a>
                  </div>
                </td>
              </tr>
            `;
          $tbody.append(row);
        });
      } else {
        $tbody.html(
          '<tr><td colspan="16" class="text-center">No payments found.</td></tr>'
        );
      }
    },
    error: function (err) {
      console.error("Error fetching payments:", err);
      $tbody.html(
        '<tr><td colspan="16" class="text-center text-danger">An error occurred while fetching payments.</td></tr>'
      );
    },
  });
}

// fetchPayments();

// Event listener for "Apply" button in the filter modal
// $("#filterInvoiceModal #applyFilter").on("click", function () {
//   const filters = {
//     mda: $("#mda").val(),
//     revenue_head: $("#revenueHead").val(),
//     invoice_number: $("#invoiceNumber").val(),
//     payment_channel: $("#paymentChannel").val(),
//     start_date: $("#fromInput").val(),
//     end_date: $("#toInput").val(),
//   };

//   // Close modal after applying filter
//   $("#filterInvoiceModal").modal("hide");

//   // Fetch payments with the applied filters
//   fetchPayments(filters);
// });

// // Event listener for "Clear filter" button
// $("#filterInvoiceModal #clearFilter").on("click", function () {
//   // Reset all filter fields
//   $("#filterInvoiceModal select, #filterInvoiceModal input").val("");
//   $("#filterInvoiceModal").modal("hide");
//   // Refresh payment list without filters
//   fetchPayments();
// });

// Initialize Selectize on #mda and #revenueHead
const paymentSelectize = $("#paymentChannel").selectize({
  placeholder: "Select a channel...",
});

const revenueHeadSelectize = $("#revenueHead").selectize({
  placeholder: "Select a revenue head...",
});

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

fetchRevenueHeadData(mdaId);

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
