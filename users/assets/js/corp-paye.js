const payerId = userData.tax_number;
const tableBody = $("#business-table tbody");
function fetchpaye() {
  const $allTbody = $("#business-table tbody");

  const loaderRow = `
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
    `;

  // Show loader in all tables
  $allTbody.html(loaderRow);

  // Simulating AJAX call with the provided JSON
  $.ajax({
    type: "GET",
    url: `${HOST}/get-special-users?payer_id=${payerId}`, // Replace with actual endpoint
    dataType: "json",
    success: function (response) {
      if (response.status === "success" && response.data.length > 0) {
        const paye = response.data;
        dataToExport = paye;

        // Clear loaders
        $allTbody.empty();

        paye.forEach((taxpayer, index) => {
          const row = `
              <tr>
                <td>${index + 1}</td>
                <td><a class="text-primary" href="payedetails.html?id=${
                  taxpayer.id
                }&payerId=${taxpayer.payer_id}">${taxpayer.payer_id}</a></td>
                <td>${taxpayer.name}</td>
                <td>${taxpayer.industry}</td>
                <td>${taxpayer.employee_count}</td>
                <td>₦&nbsp;${parseFloat(
                  taxpayer.total_annual_tax
                ).toLocaleString()}</td>
                <td>₦&nbsp;${parseFloat(
                  taxpayer.total_monthly_tax
                ).toLocaleString()}</td>
                <td>₦&nbsp;${parseFloat(
                  taxpayer.total_payments
                ).toLocaleString()}</td>
                <td>
                  <span class="badge ${getDynamicStatusBadge(taxpayer)}">
                    ${getStatusText(taxpayer)}
                  </span>
                </td>
                <td>
                  <a href="payedetails.html?id=${taxpayer.id}&payerId=${
            taxpayer.payer_id
          }" class="btn btn-primary btn-sm">View</a>
                </td>
              </tr>
            `;

          // Add to all tables
          $allTbody.append(row);
        });
      } else {
        // Handle no data scenario
        $allTbody.html(
          '<tr><td colspan="10" class="text-center">No paye found.</td></tr>'
        );
      }
    },
    error: function (err) {
      console.error("Error fetching paye:", err);

      const errorRow = `
          <tr>
            <td colspan="10" class="text-center text-danger">
              An error occurred while fetching paye.
            </td>
          </tr>
        `;

      $allTbody.html(errorRow);
    },
  });
}

// fetchpaye();

function fetchSpecialUsers() {
  tableBody.html(`
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

  $.ajax({
    url: `${HOST}/get-special-users?payer_id=${payerId}`,
    method: "GET",
    success: function (response) {
      populateTable(response.data);
      ALLSPECIALUSERS = response.data;
    },
    error: function (xhr, status, error) {
      console.error("Error fetching special users:", error);
      tableBody.append(
        `<tr><td colspan="7" class="text-center">No data available</td></tr>`
      );
    },
  });
}

// Function to populate the table with data
function populateTable(data) {
  tableBody.empty(); // Clear existing rows

  if (data.length === 0) {
    tableBody.append(
      `<tr><td colspan="7" class="text-center">No data available</td></tr>`
    );
    return;
  }

  data.forEach((user, index) => {
    const row = `
      <tr>
        <td>${index + 1}</td>
        <td>${user.name}</td>
        <td>${user.employee_count}</td>
        <td>₦ ${Number(user.total_monthly_tax).toLocaleString("en-NG", {
          minimumFractionDigits: 2,
        })}</td>
        <td>₦ ${Number(user.total_annual_tax).toLocaleString("en-NG", {
          minimumFractionDigits: 2,
        })}</td>
        <td>${new Date().toLocaleDateString()}</td>
        <td>
          <div class="flex items-center gap-x-3">
            <button class="btn btn-primary">
              <a href="staff-list.html?name=${user.name}" style="color: white;">
                <i class="far fa-eye"></i>
              </a>
            </button>
            <button class="btn btn-secondary" onclick="editFunc(this)" data-revid="${
              user.id
            }">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-danger" onclick="deletePayeeBusiness(this)" data-revid="${
              user.id
            }">
              <i class="fas fa-trash"></i>
            </button>
          </div>
          
        </td>
      </tr>
    `;
    tableBody.append(row);
  });
}

// Fetch and display data on page load
fetchSpecialUsers();

function fetchPaymentHistory(taxNumber) {
  const $paymentHistoryTbody = $("#payment-table tbody");

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
                    <td>${payment.user_id || "N/A"}</td>
                    <td>${payment.payment_reference_number || "N/A"}</td>
                    <td>Pay As You Earn(PAYE)</td>
                    <td>${getMonthInWordFromDate(
                      payment.date_payment_created
                    )}</td>
                    <td>₦&nbsp;${parseFloat(
                      payment.amount_paid || "0"
                    ).toLocaleString()}</td>
                    <td>${payment.payment_method || "N/A"}</td>
                    <td>${
                      formatDate(payment.date_payment_created) || "N/A"
                    }</td>
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

fetchPaymentHistory(userTaxNumber);

function fetchStaffList(special_user_id) {
  const $staffListTbody = $("#stafflist-table tbody");

  const loaderRow = `
                <tr class="loader-row">
                    <td colspan="9" class="text-center">
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
  $staffListTbody.html(loaderRow);

  $.ajax({
    type: "GET",
    url: `${HOST}/get-special-user-employees?special_user_id=${special_user_id}&limit=1000`,
    dataType: "json",
    headers: {
      Authorization: "Bearer " + authToken,
      "Content-Type": "application/json",
    },
    success: function (response) {
      if (response.status === "success" && response.data.length > 0) {
        const staffList = response.data;

        // Clear loader
        $staffListTbody.empty();

        staffList.forEach((staff, index) => {
          const row = `
                                <tr>
                                    <td>${index + 1}</td>
                                    <td>${staff.payer_id}</td>
                                    <td>${staff.fullname}</td>
                                    <td>₦&nbsp;${parseFloat(
                                      staff.annual_gross_income
                                    ).toLocaleString()}</td>
                                    <td>₦&nbsp;${parseFloat(
                                      staff.basic_salary
                                    ).toLocaleString()}</td>
                                    <td>₦&nbsp;${calculateAnnualTaxPayable(
                                      staff
                                    )}</td>
                                    <td>₦&nbsp;${parseFloat(
                                      staff.monthly_tax_payable
                                    ).toLocaleString()}</td>
                                    <td>${formatDate(staff.created_date)}</td>
                                    <td>
                                        <div class="flex items-center gap-2">
                                            <button class="btn btn-primary btn-sm edit-staff" 
                                                data-staff-id="${staff.id}"
                                                data-bs-toggle="modal" 
                                                data-bs-target="#editStaffModal">
                                                Edit
                                            </button>
                                            <button class="btn btn-danger btn-sm delete-staff" 
                                                data-staff-id="${staff.id}">
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            `;
          $staffListTbody.append(row);
        });
      } else {
        // Handle no data scenario
        $staffListTbody.html(`
                            <tr>
                                <td colspan="9" class="text-center">No staff members found.</td>
                            </tr>
                        `);
      }
    },
    error: function (err) {
      console.error("Error fetching staff list:", err);
      $staffListTbody.html(`
                        <tr>
                            <td colspan="9" class="text-center text-danger">
                                An error occurred while fetching staff list.
                            </td>
                        </tr>
                    `);
    },
  });
}

fetchStaffList(userId);

// Helper Functions
function calculateAnnualTaxPayable(staff) {
  // Implement your tax calculation logic
  // This is a placeholder - replace with actual tax calculation
  const annualTax = parseFloat(staff.monthly_tax_payable) * 12;
  return annualTax.toLocaleString();
}

function calculateTotalRemittance(staff) {
  // Implement total remittance calculation logic
  // This is a placeholder - replace with actual calculation
  const totalRemittance = parseFloat(staff.monthly_tax_payable) * 12;
  return totalRemittance.toLocaleString();
}
