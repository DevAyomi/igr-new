const taxNumber = userTaxNumber;
$(document).ready(function () {
  const $paymentTable = $("#payment-table").DataTable({
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
        employee_taxnumber: taxNumber,
        // invoice_type: "paye",
      };

      $.ajax({
        type: "GET",
        url: `${HOST}/payee-staff-remittance`,
        data: filters,
        dataType: "json",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        beforeSend: function () {
          $(`#payment-table tbody`).html(`
            <tr class="loader-row">
              <td colspan="10" class="text-center">
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
          console.log(response.data);
          if (response.status === "success" && response.data.length > 0) {
            callback({
              draw: data.draw,
              recordsTotal: response.pagination.total_records, // Total records from pagination
              recordsFiltered: response.pagination.total_records, // Filtered records
              data: response.data,
            });
          } else {
            $("#payment-table tbody").html(`
              <tr>
                <td colspan="10" class="text-center text-muted">
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
          $("#payment-table tbody").html(`
              <tr>
                <td colspan="10" class="text-center text-danger">
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
      { data: null, render: (data, type, row, meta) => meta.row + 1 }, // Row number
      { data: "payment_reference_number", defaultContent: "N/A" }, // Payment Reference Number
      { data: "invoice_number", defaultContent: "N/A" }, // Invoice Number
      { data: "payment_for", defaultContent: "PAYE" },
      {
        data: "amount_paid",
        render: (amount) => `₦${parseFloat(amount).toLocaleString()}`, // Amount Paid
      },
      { data: "staff_email", defaultContent: "N/A" }, // Staff Email
      { data: "employer_name", defaultContent: "N/A" },
      { data: "employer_industry", defaultContent: "N/A" },
      {
        data: "invoice_created_at",
        render: (date) => new Date(date).toLocaleDateString() || "N/A", // Invoice Created Date
      },
      {
        data: "date_payment_created",
        render: (date) => new Date(date).toLocaleDateString() || "N/A", // Payment Created Date
      },
      {
        data: "invoice_number",
        render: (invoice_number) => `
          <a href="../invoiceGeneration/payment-receipt.html?invoice_number=${invoice_number}" class="btn btn-primary" target="_blank">
            View receipt
          </a>`, // Link to View Receipt
      },
    ],
  });
});

function fetchPaymentHistory(taxNumber) {
  const $paymentHistoryTbody = $("#paye-table tbody");

  const loaderRow = `
        <tr class="loader-row">
          <td colspan="9" class=" text-center">
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
  $paymentHistoryTbody.html(loaderRow);

  $.ajax({
    type: "GET",
    url: `${HOST}/get-payment?tax_number=${taxNumber}`,
    dataType: "json",
    headers: {
      Authorization: "Bearer " + authToken,
      "Content-Type": "application/json",
    },
    success: function (response) {
      if (response.status === "success" && response.data.length > 0) {
        const paymentHistory = response.data;
        console.log(paymentHistory);
        // Clear loader
        $paymentHistoryTbody.empty();

        paymentHistory.forEach((payment, index) => {
          const row = `
                <tr>
                  <td>${index + 1}</td>
                  <td>${payment.payment_reference_number || "N/A"}</td>
                  <td>Pay As You Earn(PAYE)</td>
                  <td>${getMonthInWordFromDate(
                    payment.date_payment_created
                  )}</td>
                  <td>₦&nbsp;${parseFloat(
                    payment.amount_paid || "0"
                  ).toLocaleString()}</td>
                  <td>${payment.payment_method || "N/A"}</td>
                  <td>${formatDate(payment.date_payment_created) || "N/A"}</td>
                  <td>
                    <span class="badge badge-success rounded-pill">
                      Paid
                    </span>
                  </td>
                  <td>
                    <a href="../invoiceGeneration/payment-receipt.html?invoice_number=${
                      payment.invoice_number
                    }" class="btn btn-primary btn-sm" target="_blank">
                        View Receipt
                      </a>
                  </td>
                </tr>
              `;
          $paymentHistoryTbody.append(row);
        });
      } else {
        // Handle no data scenario
        $paymentHistoryTbody.html(`
              <tr>
                <td colspan="9" class="text-center">No payment records found.</td>
              </tr>
            `);
      }
    },
    error: function (err) {
      console.error("Error fetching payment history:", err);
      $paymentHistoryTbody.html(`
            <tr>
              <td colspan="9" class="text-center text-danger">
                An error occurred while fetching payment history.
              </td>
            </tr>
          `);
    },
  });
}

// fetchPaymentHistory(userTaxNumber);

function fetchPayeStatistics(taxNumber) {
  $("#total-invoices").html(
    '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>'
  );
  $("#total-amount-invoiced").html(
    '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>'
  );
  $("#total-monthly-tax").html(
    '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>'
  );
  $("#total-annual-tax").html(
    '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>'
  );
  $("#total-paid").html(
    '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>'
  );
  $("#total-annual-payments").html(
    '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>'
  );
  $("#overdue-invoices").html(
    '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>'
  );
  $.ajax({
    type: "GET",
    url: `${HOST}/payee-staff-analytics?tax_number=${taxNumber}`,
    dataType: "json",
    headers: {
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/json",
    },
    success: function (response) {
      if (response.status === "success") {
        const data = response.data;
        $("#total-invoices").text(data.total_invoices);
        $("#total-amount-invoiced").text(
          `₦${parseFloat(data.total_amount_invoiced).toLocaleString()}`
        );
        $("#total-monthly-tax").text(
          `₦${parseFloat(data.total_monthly_tax_payable).toLocaleString()}`
        );
        $("#total-annual-tax").text(
          `₦${parseFloat(data.total_annual_tax_payable).toLocaleString()}`
        );
        $("#total-paid").text(
          `₦${parseFloat(data.total_paid).toLocaleString()}`
        );
        $("#total-annual-payments").text(
          `₦${parseFloat(data.total_annual_payments).toLocaleString()}`
        );
        $("#overdue-invoices").text(data.overdue_invoices);
      } else {
        console.error("Failed to fetch analytics data:", response.message);
        $("#total-invoices").text(0);
        $("#total-amount-invoiced").text(`₦0`);
        $("#total-monthly-tax").text(`₦0`);
        $("#total-annual-tax").text(`₦0`);
        $("#total-paid").text(`₦0`);
        $("#total-annual-payments").text(`₦0`);
        $("#overdue-invoices").text("0");
      }
    },
    error: function (err) {
      console.error("Error fetching analytics data:", err);
      $("#total-invoices").text(0);
      $("#total-amount-invoiced").text(`₦0`);
      $("#total-monthly-tax").text(`₦0`);
      $("#total-annual-tax").text(`₦0`);
      $("#total-paid").text(`₦0`);
      $("#total-annual-payments").text(`₦0`);
      $("#overdue-invoices").text("0");
    },
  });
}
fetchPayeStatistics(taxNumber);
