const currentPage = 1; // Change this if paginated
const limit = 50;

function fetchInvoices(filters = {}) {
  const {
    mda,
    revenueHead,
    payment_status,
    date_created_start,
    date_created_end,
  } = filters;

  const queryParams = new URLSearchParams({
    page: currentPage,
    limit: limit,
    ...(mda && { mda }),
    ...(revenueHead && { revenueHead }),
    ...(payment_status && { payment_status }),
    ...(date_created_start && { date_created_start }),
    ...(date_created_end && { date_created_end }),
  });

  const $tbody = $("#invoice-datatable tbody");
  const $unpaidtbody = $("#unpaid-table tbody");
  const $paidtbody = $("#paid-table tbody");
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
  $tbody.html(loaderRow);
  $unpaidtbody.html(loaderRow);
  $paidtbody.html(loaderRow);

  $.ajax({
    type: "GET",
    url: `${HOST}/get-invoices?tax_number=${userData.tax_number}`,
    dataType: "json",
    headers: {
      Authorization: "Bearer " + authToken,
      "Content-Type": "application/json",
    },
    crossDomain: true,
    success: function (response) {
      if (response.status === "success" && response.data.invoices.length > 0) {
        const invoices = response.data.invoices;
        $tbody.empty(); // Clear the loader and existing rows
        $unpaidtbody.empty();
        $paidtbody.empty();
        $(".totalInvoices").text(response.data.total_invoices);

        let totalPaid = 0; // To store the total amount for 'paid'
        let totalUnpaid = 0; // To store the total amount for 'unpaid'

        invoices.forEach((invoice, index) => {
          const revenueHeads = invoice.revenue_heads
            .map((head) => `${head.item_name} (${head.mda_name})`)
            .join(", ");

          const paymentStatusClass =
            invoice.payment_status === "paid"
              ? "badge-success"
              : "badge-danger";

          const row = `
            <tr>
              <td>${index + 1}</td>
              <td>${invoice.tax_number || "N/A"}</td>
              <td>${invoice.invoice_number || "N/A"}</td>
              <td>${invoice.description || "No description provided"}</td>
              <td>₦ ${invoice.revenue_heads.reduce(
                (sum, head) => sum + head.amount,
                0
              )}</td>
              <td>₦ ${parseFloat(invoice.amount_paid).toLocaleString()}</td>
              <td>${new Date(invoice.date_created).toLocaleDateString()}</td>
              <td>${new Date(invoice.due_date).toLocaleDateString()}</td>
              <td>
                <span class="badge ${paymentStatusClass}">
                  ${invoice.payment_status}
                </span>
              </td>
              <td>
                <div>
                ${
                  invoice.payment_status !== "paid"
                    ? `<a href="../invoiceGeneration/invoice.html?invoice_number=${invoice.invoice_number}" class="btn btn-primary btn-sm" target="_blank">
                    View Invoice
                  </a>`
                    : `<a href="../invoiceGeneration/payment-receipt.html?invoice_number=${invoice.invoice_number}" type="button" class="btn btn-primary btn-sm" target="_blank">
                    View receipt
                  </a>`
                }
                </div>
              </td>
            </tr>
          `;

          // Append to main table
          $tbody.append(row);

          // Separate into paid and unpaid tables
          if (invoice.payment_status === "paid") {
            $paidtbody.append(row);
            totalPaid += parseFloat(invoice.amount_paid || 0);
          } else {
            $unpaidtbody.append(row);
            totalUnpaid += parseFloat(invoice.amount_paid || 0);
          }
        });

        // Update totals
        $(".totalPaidInvoice").text(`₦ ${totalPaid.toLocaleString()}`);
        $(".totalUnpaidInvoice").text(`₦ ${totalUnpaid.toLocaleString()}`);
      } else {
        const noDataRow =
          '<tr><td colspan="11" class="text-center">No invoices found.</td></tr>';
        $tbody.html(noDataRow);
        $unpaidtbody.html(noDataRow);
        $paidtbody.html(noDataRow);
      }
    },
    error: function (err) {
      console.error("Error fetching invoices:", err);
      const errorRow =
        '<tr><td colspan="11" class="text-center text-danger">An error occurred while fetching invoices.</td></tr>';
      $tbody.html(errorRow);
      $unpaidtbody.html(errorRow);
      $paidtbody.html(errorRow);
    },
  });
}

// Fetch invoices on page load
// fetchInvoices();

$(document).ready(function () {
  function setupInvoiceTables(filters = {}) {
    const {
      mda,
      revenueHead,
      payment_status,
      date_created_start,
      date_created_end,
    } = filters;

    const queryParams = {
      tax_number: userData.tax_number,
      ...(mda && { mda }),
      ...(revenueHead && { revenueHead }),
      ...(payment_status && { payment_status }),
      ...(date_created_start && { date_created_start }),
      ...(date_created_end && { date_created_end }),
    };

    const tables = [
      { selector: "#invoice-datatable", status: null },
      { selector: "#unpaid-table", status: "unpaid" },
      { selector: "#paid-table", status: "paid" },
    ];

    tables.forEach(({ selector, status }) => {
      $(selector).DataTable({
        serverSide: true,
        paging: true,
        ordering: false,
        pageLength: 50,
        responsive: true,
        searchDelay: 500,
        searching: false,
        pagingType: "simple_numbers",
        ajax: function (data, callback) {
          const pageNumber = Math.ceil(data.start / data.length) + 1;

          const params = {
            ...queryParams,
            page: pageNumber,
            limit: data.length,
            ...(status && { payment_status: status }),
          };

          $.ajax({
            url: `${HOST}/get-invoices`,
            type: "GET",
            data: params,
            headers: {
              Authorization: "Bearer " + authToken,
              "Content-Type": "application/json",
            },
            dataType: "json",
            beforeSend: function () {
              $(`${selector} tbody`).html(`
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
              if (
                response.status === "success" &&
                response.data.invoices.length > 0
              ) {
                const invoices = response.data.invoices;
                let totalPaid = 0;
                let totalUnpaid = 0;

                invoices.forEach((invoice) => {
                  if (invoice.payment_status === "paid") {
                    totalPaid += parseFloat(invoice.amount_paid || 0);
                  } else {
                    totalUnpaid += parseFloat(invoice.amount_paid || 0);
                  }
                });

                if (selector === "#invoice-datatable") {
                  $(".totalInvoices").text(response.data.total_invoices);
                }

                $(".totalPaidInvoice").text(`₦ ${totalPaid.toLocaleString()}`);
                $(".totalUnpaidInvoice").text(
                  `₦ ${totalUnpaid.toLocaleString()}`
                );

                callback({
                  draw: data.draw,
                  recordsTotal: response.data.invoices.length,
                  recordsFiltered: response.data.invoices.length,
                  data: invoices,
                });
              } else {
                $(`${selector} tbody`).html(`
                  <tr>
                    <td colspan="11" class="text-center text-muted">
                      No invoices found.
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
              console.error("Error fetching invoices:", err);
              $(`${selector} tbody`).html(`
                <tr>
                  <td colspan="11" class="text-center text-danger">
                    An error occurred while fetching invoices.
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
          {
            data: null,
            render: function (data, type, row, meta) {
              return meta.row + 1;
            },
          },
          { data: "tax_number", defaultContent: "N/A" },
          { data: "invoice_number", defaultContent: "N/A" },
          { data: "description", defaultContent: "No description provided" },

          {
            data: "revenue_heads",
            render: function (heads) {
              if (!Array.isArray(heads)) return "₦ 0";
              const totalAmount = heads.reduce(
                (sum, head) => sum + head.amount,
                0
              );
              return `₦ ${totalAmount.toLocaleString()}`;
            },
          },
          {
            data: "amount_paid",
            render: function (amount) {
              return `₦ ${parseFloat(amount || 0).toLocaleString()}`;
            },
          },
          {
            data: "date_created",
            render: function (date) {
              return new Date(date).toLocaleDateString();
            },
          },
          {
            data: "due_date",
            render: function (date) {
              return new Date(date).toLocaleDateString();
            },
          },
          {
            data: "payment_status",
            render: function (status) {
              const badgeClass =
                status === "paid" ? "badge-success" : "badge-danger";
              return `<span class="badge ${badgeClass}">${status}</span>`;
            },
          },
          {
            data: "invoice_number",
            render: function (invoice_number) {
              return `
                <div>
                  <a href="../invoiceGeneration/invoice.html?invoice_number=${invoice_number}"
                    class="btn btn-primary btn-sm" target="_blank">
                    View Invoice
                  </a>
                </div>`;
            },
          },
        ],
        drawCallback: function () {
          // Any additional UI tweaks after draw
        },
      });
    });
  }

  setupInvoiceTables();
});
