const currentPage = 1; // Change this if paginated
const limit = 50;

let dataToExport;

function fetchRecentPayments() {
  const $tbody = $("#payment-table tbody");
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
    url: `${HOST}/get-mda-payments?mda_id=${mdaId}`,
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
            .map((head) => `${head.item_name}`)
            .join(", "),
          UserName: `${payment.user_info?.first_name || "N/A"} ${
            payment.user_info?.surname || "N/A"
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
                
                <td>${payment.user_info?.first_name || "N/A"} ${
            payment.user_info?.surname || "N/A"
          }</td>
          <td>${revenueHeads}</td>
                <td>₦ ${parseFloat(payment.amount_paid).toLocaleString()}</td>
                <td>${new Date(
                  payment.date_payment_created
                ).toLocaleDateString()}</td>
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

fetchRecentPayments();

function fetchInvoiceStatistics() {
  $.ajax({
    type: "GET",
    url: `${HOST}/invoices-summary?mda_id=${mdaId}`,
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

function fetchRevenueHeadStatistics() {
  $.ajax({
    type: "GET",
    url: `${HOST}/revenue-heads-summary-by-mda?mda_id=${mdaId}`,
    dataType: "json",
    headers: {
      Authorization: "Bearer " + authToken,
      "Content-Type": "application/json",
    },
    success: function (response) {
      if (response.status === "success") {
        const stats = response.data;

        $("#activeRev").text(stats.active_revenue_heads);
        $("#inactiveRev").text(stats.inactive_revenue_heads);
        $("#totalRev").text(stats.total_revenue_heads);
      } else {
        console.error("Failed to fetch revenue head statistics");
        //   resetStatisticCards();
      }
    },
    error: function (xhr, status, error) {
      console.error("Error fetching revenue head statistics:", error);
      //   resetStatisticCards();
    },
  });
}

fetchRevenueHeadStatistics();

function fetchKPIStatistics() {
  $.ajax({
    type: "GET",
    url: `${HOST}/kpi-summary?mda_id=${mdaId}`,
    dataType: "json",
    headers: {
      Authorization: "Bearer " + authToken,
      "Content-Type": "application/json",
    },
    success: function (response) {
      if (response.status === "success") {
        const stats = response.data;

        $(".totalRevenueCollected").text(
          `₦ ${stats.total_revenue_collected.toLocaleString()}`
        );
        $(".outstandingRevenue").text(
          `₦ ${stats.outstanding_revenue.toLocaleString()}`
        );
        $(".complianceRate").text(`${stats.compliance_rate}%`);
        $(".pendingTCCApplications").text(stats.pending_tcc_applications);
      } else {
        console.error("Failed to fetch KPI statistics");
      }
    },
    error: function (xhr, status, error) {
      console.error("Error fetching KPI statistics:", error);
    },
  });
}

function fetchRevenueByTaxType() {
  $.ajax({
    type: "GET",
    url: `${HOST}/revenue-by-tax-type?mda_id=${mdaId}`,
    dataType: "json",
    headers: {
      Authorization: "Bearer " + authToken,
      "Content-Type": "application/json",
    },
    success: function (response) {
      if (response.status === "success") {
        const data = response.data;
        const ctx = document
          .getElementById("revenueByTaxTypeChart")
          .getContext("2d");
        new Chart(ctx, {
          type: "pie",
          data: {
            labels: data.labels,
            datasets: [
              {
                data: data.values,
                backgroundColor: data.colors,
              },
            ],
          },
        });
      } else {
        console.error("Failed to fetch revenue by tax type");
      }
    },
    error: function (xhr, status, error) {
      console.error("Error fetching revenue by tax type:", error);
    },
  });
}

function fetchMonthlyRevenueTrends() {
  $.ajax({
    type: "GET",
    url: `${HOST}/monthly-revenue-trends?mda_id=${mdaId}`,
    dataType: "json",
    headers: {
      Authorization: "Bearer " + authToken,
      "Content-Type": "application/json",
    },
    success: function (response) {
      if (response.status === "success") {
        const data = response.data;
        const ctx = document
          .getElementById("monthlyRevenueTrendsChart")
          .getContext("2d");
        new Chart(ctx, {
          type: "line",
          data: {
            labels: data.labels,
            datasets: [
              {
                label: "Monthly Revenue",
                data: data.values,
                borderColor: "rgba(75, 192, 192, 1)",
                fill: false,
              },
            ],
          },
        });
      } else {
        console.error("Failed to fetch monthly revenue trends");
      }
    },
    error: function (xhr, status, error) {
      console.error("Error fetching monthly revenue trends:", error);
    },
  });
}

function fetchNonCompliantTaxpayers() {
  const $tbody = $("#nonCompliantTaxpayersTable tbody");
  $tbody.html('<tr><td colspan="3" class="text-center">Loading...</td></tr>');

  $.ajax({
    type: "GET",
    url: `${HOST}/non-compliant-taxpayers?mda_id=${mdaId}`,
    dataType: "json",
    headers: {
      Authorization: "Bearer " + authToken,
      "Content-Type": "application/json",
    },
    success: function (response) {
      if (response.status === "success" && response.data.length > 0) {
        const taxpayers = response.data;
        $tbody.empty();

        taxpayers.forEach((taxpayer, index) => {
          const row = `
            <tr>
              <td>${index + 1}</td>
              <td>${taxpayer.name}</td>
              <td>₦ ${parseFloat(
                taxpayer.outstanding_amount
              ).toLocaleString()}</td>
            </tr>
          `;
          $tbody.append(row);
        });
      } else {
        $tbody.html(
          '<tr><td colspan="3" class="text-center">No non-compliant taxpayers found.</td></tr>'
        );
      }
    },
    error: function (err) {
      console.error("Error fetching non-compliant taxpayers:", err);
      $tbody.html(
        '<tr><td colspan="3" class="text-center text-danger">An error occurred while fetching data.</td></tr>'
      );
    },
  });
}

function fetchPendingTCCApplications() {
  const $tbody = $("#pendingTCCApplicationsTable tbody");
  $tbody.html('<tr><td colspan="3" class="text-center">Loading...</td></tr>');

  $.ajax({
    type: "GET",
    url: `${HOST}/pending-tcc-applications?mda_id=${mdaId}`,
    dataType: "json",
    headers: {
      Authorization: "Bearer " + authToken,
      "Content-Type": "application/json",
    },
    success: function (response) {
      if (response.status === "success" && response.data.length > 0) {
        const applications = response.data;
        $tbody.empty();

        applications.forEach((application, index) => {
          const row = `
            <tr>
              <td>${index + 1}</td>
              <td>${application.applicant_name}</td>
              <td>${new Date(
                application.application_date
              ).toLocaleDateString()}</td>
            </tr>
          `;
          $tbody.append(row);
        });
      } else {
        $tbody.html(
          '<tr><td colspan="3" class="text-center">No pending TCC applications found.</td></tr>'
        );
      }
    },
    error: function (err) {
      console.error("Error fetching pending TCC applications:", err);
      $tbody.html(
        '<tr><td colspan="3" class="text-center text-danger">An error occurred while fetching data.</td></tr>'
      );
    },
  });
}

fetchKPIStatistics();
fetchRevenueByTaxType();
fetchMonthlyRevenueTrends();
fetchNonCompliantTaxpayers();
fetchPendingTCCApplications();
