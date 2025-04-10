const taxpayerId = getParameterByName("tax_number");
function fetchTaxpayerDetails(taxpayerId) {
  // Show loading state
  showLoadingState();

  $.ajax({
    type: "GET",
    url: `${HOST}/get-taxpayers?tax_number=${taxpayerId}`,
    dataType: "json",
    headers: {
      Authorization: "Bearer " + authToken,
      "Content-Type": "application/json",
    },
    success: function (response) {
      if (response.status === "success" && response.data) {
        const taxpayer = response.data[0];

        // Update profile section
        updateProfileSection(taxpayer);

        // Update contact and personal information
        updateContactInformation(taxpayer);

        // Update business information
        updateBusinessInformation(taxpayer);

        // Hide loading state
        hideLoadingState();
      } else {
        showErrorMessage("Taxpayer details not found");
        hideLoadingState();
      }
    },
    error: function (xhr, status, error) {
      console.error("Error fetching taxpayer details:", error);
      showErrorMessage("Failed to fetch taxpayer details");
      hideLoadingState();
    },
  });
}

function updateProfileSection(taxpayer) {
  // Profile Image (you might want to use actual profile image if available)
  $("#profileImage").attr("src", "./assets/img/user.png");

  // Payer ID (you might need to generate this based on your system)
  $("#payerId").text(`Payer ID: ${taxpayer.tax_number}`);

  // Taxpayer Name
  $(".taxpayer-name").text(`${taxpayer.first_name} ${taxpayer.surname}`);

  // TIN Status Badge
  const statusBadge = $("#tinStatusBadge");
  statusBadge
    .removeClass("bg-warning bg-success bg-danger")
    .addClass(getTinStatusBadgeClass(taxpayer.tin_status))
    .text(taxpayer.tin_status || "Unverified");
}

function updateContactInformation(taxpayer) {
  // Category
  $("#taxpayerCategory").html(`
      <i class="fas fa-building text-secondary"></i>
      <strong>Category:</strong> ${taxpayer.category || "-"}
    `);

  // State
  $("#taxpayerState").html(`
      <i class="fas fa-map-marker-alt text-secondary"></i>
      <strong>State:</strong> ${taxpayer.state || "-"}
    `);

  // LGA
  $("#taxpayerLGA").html(`
      <i class="fas fa-map-marked-alt text-secondary"></i>
      <strong>LGA:</strong> ${taxpayer.lga || "-"}
    `);

  // Email
  $("#taxpayerEmail").html(`
      <i class="fas fa-envelope text-secondary"></i>
      <strong>Email:</strong> ${taxpayer.email || "-"}
    `);

  // Phone
  $("#taxpayerPhone").html(`
      <i class="fas fa-phone text-secondary"></i>
      <strong>Contact:</strong> ${taxpayer.phone || "-"}
    `);

  // Tax Number
  $("#taxpayerTaxNumber").html(`
      <i class="fas fa-file-invoice text-secondary"></i>
      <strong>Tax Number:</strong> ${taxpayer.tax_number || "-"}
    `);
}

function updateBusinessInformation(taxpayer) {
  // Business Type
  $("#businessType").html(`
      <i class="fas fa-briefcase text-secondary"></i>
      <strong>Business Type:</strong> ${taxpayer.presumptive || "-"}
    `);

  // Employment Status
  $("#employmentStatus").html(`
      <i class="fas fa-user-tie text-secondary"></i>
      <strong>Employment Status:</strong> ${taxpayer.employment_status || "-"}
    `);

  // Number of Staff
  $("#numberOfStaff").html(`
      <i class="fas fa-users text-secondary"></i>
      <strong>Number of Staff:</strong> ${taxpayer.number_of_staff || "-"}
    `);
}

function getTinStatusBadgeClass(status) {
  switch (status) {
    case "verified":
      return "badge-success";
    case "unverified":
      return "badge-warning";
    default:
      return "badge-danger";
  }
}

function showLoadingState() {
  // Implement loading state for the taxpayer details section
  $(".taxpayer-details-container").addClass("loading");
}

function hideLoadingState() {
  // Remove loading state
  $(".taxpayer-details-container").removeClass("loading");
}

function showErrorMessage(message) {
  // Show error message in the taxpayer details section
  $(".taxpayer-details-container").html(`
      <div class="alert alert-danger text-center">
        ${message}
      </div>
    `);
}

// Document ready function

if (taxpayerId) {
  fetchTaxpayerDetails(taxpayerId);
} else {
  showErrorMessage("No Taxpayer ID provided");
}

function fetchTaxpayerTables(taxpayerId) {
  // Fetch Activity Log
  fetchActivityLog(taxpayerId);

  // fetch Applicable tax
  fetchApplicableTax(taxpayerId);

  // Fetch Invoices
  fetchInvoices(taxpayerId);

  // Fetch Payment History
  fetchPaymentHistory(taxpayerId);

  // Fetch All Taxes
  fetchAllTaxes(taxpayerId);
}

function fetchApplicableTax(taxpayerId) {
  const loaderRow = `
    <tr class="loader-row">
      <td colspan="7" class="text-center">
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
  const $tbody = $("#applicable-taxes tbody");

  // Show loader
  $tbody.html(loaderRow);

  $.ajax({
    type: "GET",
    url: `${HOST}/get-taxpayer-applicable-taxes?tax_number=${taxpayerId}&limit=200`, // Updated endpoint
    dataType: "json",
    headers: {
      Authorization: "Bearer " + authToken,
      "Content-Type": "application/json",
    },
    crossDomain: true,
    success: function (response) {
      if (
        response.status === "success" &&
        response.data.applicable_taxes.length > 0
      ) {
        const data = response.data.applicable_taxes;

        $tbody.empty(); // Clear existing rows

        data.forEach((item, index) => {
          const row = `
            <tr>
              <td>
                <div class="form-check">
                  <input 
                    class="form-check-input applicable-tax-checkbox" 
                    type="checkbox" 
                    value="${item.id}" 
                    id="applicableTax-${item.id}"
                    data-revenue-head-id="${item.revenue_head_id}"
                    data-tax-number="${item.tax_number}"
                    data-mda-name="${item.mda_name}"
                    data-revenue-head-name="${item.revenue_head_name}"
                    data-amount="${parseFloat(item.amount)}"
                  >
                  <label class="form-check-label" for="applicableTax-${item.id
            }">
                    ${index + 1}
                  </label>
                </div>
              </td>
              <td>${item.mda_name || "N/A"}</td>
              <td>${item.revenue_head_name}</td>
              <td>${item.revenue_head_code}</td>
              <td>₦ ${parseFloat(item.amount).toLocaleString()}</td>
            </tr>
          `;
          $tbody.append(row);
        });

        // Setup select all functionality
        setupApplicableTaxCheckbox();
      } else {
        $tbody.html(
          '<tr><td colspan="7" class="text-center">No applicable taxes found.</td></tr>'
        );
      }
    },
    error: function (err) {
      $tbody.html(
        '<tr><td colspan="7" class="text-center">Error loading applicable taxes. Please try again.</td></tr>'
      );
      console.error("Error fetching applicable taxes:", err);

      // Optional: Show error toast or notification
      showErrorNotification(
        "Failed to load applicable taxes. Please refresh the page."
      );
    },
  });
}

function fetchActivityLog(taxpayerId) {
  const $tbody = $("#activity-table tbody");
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

  $tbody.html(loaderRow);
  $.ajax({
    type: "GET",
    url: `${HOST}/get-activity-log?tax_number=${taxpayerId}`,
    dataType: "json",
    headers: {
      Authorization: "Bearer " + authToken,
      "Content-Type": "application/json",
    },
    success: function (response) {
      $tbody.empty();

      if (response.status === "success" && response.data.length > 0) {
        response.data.forEach((log) => {
          const row = `
              <tr>
                <td>${formatDateTime(log.timestamp)}</td>
                <td>${log.description}</td>
              </tr>
            `;
          $tbody.append(row);
        });
      } else {
        $tbody.html(`
            <tr>
              <td colspan="2" class="text-center">No activity log found</td>
            </tr>
          `);
      }
    },
    error: function (xhr, status, error) {
      console.error("Error fetching activity log:", error);
      $tbody.html(`
        <tr>
          <td colspan="2" class="text-center">No activity log found</td>
        </tr>
      `);
    },
  });
}

function fetchInvoices(taxpayerId) {
  const $tbody = $("#invoice-table tbody");
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

  $tbody.html(loaderRow);
  $.ajax({
    type: "GET",
    url: `${HOST}/get-invoices?tax_number=${taxpayerId}`,
    dataType: "json",
    headers: {
      Authorization: "Bearer " + authToken,
      "Content-Type": "application/json",
    },
    success: function (response) {
      $tbody.empty();
      const invoices = response.data.invoices;

      if (response.status === "success" && invoices.length > 0) {
        invoices.forEach((invoice) => {
          const revenueHeads = invoice.revenue_heads
            .map((head) => `${head.item_name} (${head.mda_name})`)
            .join(", ");

          const paymentStatusClass =
            invoice.payment_status === "paid"
              ? "badge-success"
              : "badge-danger";
          const row = `
              <tr>
                <td>${invoice.tax_number}</td>
                <td>${invoice.invoice_number}</td>
                <td>${invoice.description}</td>
                <td>₦ ${parseFloat(invoice.amount_paid).toLocaleString()}</td>
                <td>${formatDate(invoice.due_date)}</td>
                <td>
                <span class="badge ${paymentStatusClass}">
                  ${invoice.payment_status}
                </span>
              </td>
                <td>
                <div>
                  <a href="../invoiceGeneration/invoice.html?invoice_number=${invoice.invoice_number
            }" class="btn btn-primary btn-sm" target="_blank">
                    View Invoice
                  </a>
                </div>
              </td>
              </tr>
            `;
          $tbody.append(row);
        });
      } else {
        $tbody.html(`
            <tr>
              <td colspan="7" class="text-center">No invoices found</td>
            </tr>
          `);
      }
    },
    error: function (xhr, status, error) {
      console.error("Error fetching invoices:", error);
      $tbody.html(`
        <tr>
          <td colspan="7" class="text-center">No invoices found</td>
        </tr>
      `);
    },
  });
}

function fetchPaymentHistory(taxpayerId) {
  const $tbody = $("#payment-table tbody");
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

  $tbody.html(loaderRow);
  $.ajax({
    type: "GET",
    url: `${HOST}/get-payment?tax_number=${taxpayerId}`,
    dataType: "json",
    headers: {
      Authorization: "Bearer " + authToken,
      "Content-Type": "application/json",
    },
    success: function (response) {
      $tbody.empty();

      if (response.status === "success" && response.data.length > 0) {
        response.data.forEach((payment) => {
          const paymentFor = payment.associated_revenue_heads
            .map((head) => head.item_name)
            .join(", ");

          const paymentStatus = payment.amount_paid > 0 ? "success" : "pending";
          const paymentStatusClass =
            paymentStatus === "success" ? "badge-success" : "badge-danger";

          const row = `
              <tr>
                <td>${payment.user_id || "N/A"}</td>
                <td>${payment.payment_reference_number || "N/A"}</td>
                <td>${paymentFor || "N/A"}</td>
                <td>₦${parseFloat(payment.amount_paid).toLocaleString()}</td>
                <td>${payment.payment_method || "N/A"}</td>
                <td>
                  <span class="badge ${paymentStatusClass}">${paymentStatus}</span>
                </td>
              </tr>
            `;
          $tbody.append(row);
        });
      } else {
        $tbody.html(`
            <tr>
              <td colspan="6" class="text-center">No payment history found</td>
            </tr>
          `);
      }
    },
    error: function (xhr, status, error) {
      console.error("Error fetching payment history:", error);
      $tbody.html(`
        <tr>
          <td colspan="6" class="text-center">No payment history found</td>
        </tr>
      `);
    },
  });
}

function fetchAllTaxes(taxpayerId) {
  const $tbody = $("#all-taxes tbody");
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

  $tbody.html(loaderRow);
  $.ajax({
    type: "GET",
    url: `${HOST}/get-revenue-head`,
    dataType: "json",
    headers: {
      Authorization: "Bearer " + authToken,
      "Content-Type": "application/json",
    },
    success: function (response) {
      $tbody.empty();

      if (response.status === "success" && response.data.length > 0) {
        response.data.forEach((tax, index) => {
          const row = `
                <tr>
                  <td>
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox"
                        id="taxCheck${index}"
                        ${tax.is_applicable ? "checked" : ""}
                      >
                    </div>
                  </td>
                  <td>${tax.mda_name || "N/A"}</td>
                   <td>${tax.item_name}</td>
                  <td>${tax.category}</td>
                    <td>${tax.is_compulsory ? "Yes" : "No"}</td>
                  <td>${tax.frequency}</td>
                  <td>₦ ${parseFloat(tax.amount).toLocaleString()}</td>
                </tr>
              `;
          $tbody.append(row);
        });
      } else {
        $tbody.html(`
            <tr>
              <td colspan="8" class="text-center">No taxes found</td>
            </tr>
          `);
      }
    },
    error: function (xhr, status, error) {
      console.error("Error fetching taxes:", error);
      $tbody.html(`
        <tr>
          <td colspan="8" class="text-center">No taxes found</td>
        </tr>
      `);
    },
  });
}

// Utility Functions
function formatDateTime(dateString) {
  return new Date(dateString).toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(amount);
}

function getInvoiceStatusClass(status) {
  switch (status) {
    case "paid":
      return "bg-success";
    case "pending":
      return "bg-warning";
    case "overdue":
      return "bg-danger";
    default:
      return "";
  }
}

function getPaymentStatusClass(status) {
  switch (status) {
    case "completed":
      return "bg-success";
    case "pending":
      return "bg-warning";
    case "failed":
      return "bg-danger";
    default:
      return "";
  }
}

fetchTaxpayerTables(taxpayerId);
