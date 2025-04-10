const currentPage = 1; // Change this if paginated
const limit = 50;

let dataToExport = [];

let $paymentTable;
function fetchPayments() {
  $paymentTable = $("#payment-table").DataTable({
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
        mda: $("#mda").val(),
        tax_number: userData.tax_number,
        revenue_head_id: $("#revenueHead").val(),
        payment_status: $("#paymentStatus").val(),
        start_date: $("#fromInput").val(),
        end_date: $("#toInput").val(),
      };

      $.ajax({
        type: "GET",
        url: `${HOST}/get-payment`,
        data: filters,
        dataType: "json",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        beforeSend: function () {
          $(`#payment-table tbody`).html(`
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
          dataToExport = response.data;
          if (response.status === "success" && response.data.length > 0) {
            callback({
              draw: data.draw,
              recordsTotal: response.data.length,
              recordsFiltered: response.data.length,
              data: response.data,
            });
          } else {
            $("#payment-table tbody").html(`
              <tr>
                <td colspan="7" class="text-center text-muted">
                  No Payment data found.
                </td>
              </tr>
            `);
            callback({
              draw: data.draw,
              recordsTotal: 0,
              recordsFiltered: 0,
              data: [],
            });
          }
        },
        error: function (err) {
          console.error("Error fetching payment data:", err);
          $("#all-taxes tbody").html(`
              <tr>
                <td colspan="7" class="text-center text-danger">
                  Error loading payments. Please try again.
                </td>
              </tr>
            `);

          callback({
            draw: data.draw,
            recordsTotal: 0,
            recordsFiltered: 0,
            data: [],
          });
        },
      });
    },
    columns: [
      { data: null, render: (data, type, row, meta) => meta.row + 1 },
      { data: "user_id", defaultContent: "N/A" },
      { data: "payment_reference_number", defaultContent: "N/A" },
      {
        data: "associated_revenue_heads",
        render: (heads) =>
          heads.map((head) => head.item_name).join(", ") || "N/A",
      },
      {
        data: "amount_paid",
        render: (amount) => `₦${parseFloat(amount).toLocaleString()}`,
      },
      { data: "payment_method", defaultContent: "N/A" },
      {
        data: "amount_paid",
        render: (amount) => {
          const status = amount > 0 ? "success" : "pending";
          const statusClass =
            status === "success" ? "badge-success" : "badge-danger";
          return `<span class="badge ${statusClass}">${status}</span>`;
        },
      },
      {
        data: "invoice_created_date",
        render: (date) => new Date(date).toLocaleDateString() || "N/A",
      },
      {
        data: "date_payment_created",
        render: (date) => new Date(date).toLocaleDateString() || "N/A",
      },
      {
        data: "invoice_number",
        render: (invoice_number) => `
          <a href="../invoiceGeneration/payment-receipt.html?invoice_number=${invoice_number}" class="btn btn-primary" target="_blank">
            View receipt
          </a>`,
      },
    ],
  });
}

$("#filterInvoiceModal #applyFilter").on("click", function () {
  $paymentTable.ajax.reload();
  $("#filterInvoiceModal").modal("hide");
});

$("#filterInvoiceModal #clearFilter").on("click", function () {
  $("#filterInvoiceModal select, #filterInvoiceModal input").val("");
  $paymentTable.ajax.reload();
});

const mdaSelectize = $("#mda").selectize({
  placeholder: "Select a mda...",
});

const revenueHeadSelectize = $("#revenueHead").selectize({
  placeholder: "Select a revenue head...",
});

// Fetch MDA data
async function fetchMdaData() {
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
async function fetchRevenueHeadData(mdaId) {
  $.ajax({
    type: "GET",
    url: `${HOST}/get-revenue-head`,
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

fetchMdaData();
fetchRevenueHeadData();

// Fetch invoices on page load
$(document).ready(function () {
  fetchPayments();
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
  a.download = "collection.csv";
  a.click();
}
