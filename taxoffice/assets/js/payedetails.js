const special_user_id = getParameterByName("id");
const payeId = getParameterByName("payerId");
const businessName = getParameterByName("name");
const page = getParameterByName("page") || 1;
const limit = getParameterByName("limit") || 100;

function fetchPayeDetails(payeId) {
  // Show loading state

  $.ajax({
    type: "GET",
    url: `${HOST}/get-special-users?name=${businessName}`,
    dataType: "json",
    headers: {
      Authorization: "Bearer " + authToken,
      "Content-Type": "application/json",
    },
    success: function (response) {
      if (response.status === "success" && response.data) {
        const paye = response.data[0];
        $("#payerId").text(paye.payer_id);
        $("#payeName").text(paye.name);
        $("#payeEmail").text(paye.email);
        $("#payePhone").text(paye.phone);
        $("#payeAddress").text(`${paye.lga}, ${paye.state}`);
        $("#payeRegisterStaff").text(paye.employee_count);
        $("#payeMonthlyRemittance").text(
          parseFloat(paye.total_monthly_tax).toLocaleString()
        );

        let addStaff = document.querySelector("#addStaff");
        if (addStaff) {
          addStaff.href = `add-staff.html?id=${paye.id}&payerId=${paye.payer_id}`;
          addStaff.classList.remove("d-none");
        }
      } else {
      }
    },
    error: function (xhr, status, error) {
      console.error("Error fetching paye details:", error);
    },
  });
}

fetchPayeDetails(payeId);

function fetchStaffList(filters = {}) {
  // Prepare query parameters
  const queryParams = new URLSearchParams();

  // Add filters to query params if they exist
  Object.keys(filters).forEach((key) => {
    if (
      filters[key] !== undefined &&
      filters[key] !== null &&
      filters[key] !== ""
    ) {
      queryParams.append(key, filters[key]);
    }
  });

  // Pagination and sorting (optional)
  queryParams.append("page", filters.page || 1);
  queryParams.append("limit", filters.limit || 0);

  const $staffListTbody = $("#datatable tbody");

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

  // Show loader
  $staffListTbody.html(loaderRow);

  $.ajax({
    type: "GET",
    url: `${HOST}/get-special-user-employees?special_user_id=${special_user_id}&page=${page}&limit=${limit}`,
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
                <td>${staff.email}</td>
                <td>₦&nbsp;${parseFloat(
            staff.annual_gross_income
          ).toLocaleString()}</td>
                <td>₦&nbsp;${parseFloat(
            staff.basic_salary
          ).toLocaleString()}</td>
                <td>₦&nbsp;${calculateAnnualTaxPayable(staff)}</td>
                <td>₦&nbsp;${parseFloat(
            staff.monthly_tax_payable
          ).toLocaleString()}</td>
                <td>${formatDate(staff.created_date)}</td>
                <td>₦&nbsp;${calculateTotalRemittance(staff)}</td>
                <td>
                  ${!hasPermission(51) ? '' : `
                    <div class="flex items-center gap-2">
                        <a href="edit-staff.html?id=${staff.id}&payerId=${staff.payer_id
              }&auserId=${special_user_id}&apayerId=${payeId}&name=${businessName}" class="btn btn-primary btn-sm">Edit</a>
                      <button class="btn btn-danger btn-sm delete-staff" 
                        data-staff-id="${staff.id}">
                        Delete
                      </button>
                    </div>
                  `}
                  
                </td>
              </tr>
            `;
          $staffListTbody.append(row);
        });
      } else {
        // Handle no data scenario
        $staffListTbody.html(`
            <tr>
              <td colspan="10" class="text-center">No staff members found.</td>
            </tr>
          `);
      }
    },
    error: function (err) {
      console.error("Error fetching staff list:", err);
      $staffListTbody.html(`
          <tr>
            <td colspan="10" class="text-center text-danger">
              An error occurred while fetching staff list.
            </td>
          </tr>
        `);
    },
  });
}

// fetchPaymentHistory(payeId);

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

// Filter Form Setup
function setupStaffFilterForm() {
  const $filterForm = $("#staff-filter-form");

  $filterForm.on("submit", function (e) {
    e.preventDefault();

    // Collect form data
    const filters = {
      fullname: $("#name-filter").val(),
      payer_id: $("#payer-id-filter").val(),
      email: $("#email-filter").val(),
      min_salary: $("#min-salary-filter").val(),
      max_salary: $("#max-salary-filter").val(),

      page: 1,
      limit: 10,
    };

    // Remove empty filter values
    Object.keys(filters).forEach(
      (key) =>
        (filters[key] === "" || filters[key] === null) && delete filters[key]
    );

    // Fetch staff with applied filters
    fetchStaffList(filters);
  });

  // Reset filter button
  $("#reset-filters").on("click", function () {
    $filterForm[0].reset();
    fetchStaffList(); // Fetch default/unfiltered data
  });
}

// Edit Staff Event Listener
function setupEditStaffListener() {
  $(document).on("click", ".edit-staff", function () {
    const staffId = $(this).data("staff-id");

    // Fetch staff details for editing
    $.ajax({
      type: "GET",
      url: `${HOST}/get-staff-details/${staffId}`,
      headers: {
        Authorization: "Bearer " + authToken,
      },
      success: function (response) {
        // Populate edit modal with staff details
        populateEditStaffModal(response.data);
      },
      error: function (err) {
        console.error("Error fetching staff details:", err);
        // Show error notification
      },
    });
  });
}

// Delete Staff Event Listener
function setupDeleteStaffListener() {
  $(document).on("click", ".delete-staff", function () {
    const staffId = $(this).data("staff-id");

    const deleteData = {
      id: staffId,
    };

    // Confirm deletion using SweetAlert
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleting..",
          text: "Wait while we delete the employee!",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });
        $.ajax({
          type: "POST",
          url: `${HOST}/delete-special-user-employee?id=${staffId}`,
          headers: {
            Authorization: "Bearer " + authToken,
          },
          data: JSON.stringify(deleteData),
          success: function (response) {
            // Refresh staff list
            fetchPayeDetails(payeId);
            fetchStaffList();
            // Show success notification
            Swal.fire(
              "Deleted!",
              "The staff member has been deleted.",
              "success"
            );
          },
          error: function (err) {
            console.error("Error deleting staff:", err);
            // Show error notification
            Swal.fire(
              "Error!",
              "An error occurred while deleting the staff member.",
              "error"
            );
          },
        });
      }
    });
  });
}

// Initialize on document ready
$(document).ready(function () {
  fetchStaffList(); // Initial fetch
  setupStaffFilterForm();
  setupEditStaffListener();
  setupDeleteStaffListener();
});

function fetchPaymentHistory(taxNumber) {
  const $paymentHistoryTbody = $("#datatable1 tbody");

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

        // Clear loader
        $paymentHistoryTbody.empty();

        paymentHistory.forEach((payment, index) => {
          const row = `
              <tr>
                <td>${index + 1}</td>
                <td>${payment.payment_reference_number || "N/A"}</td>
                <td>Pay As You Earn(PAYE)</td>
                <td>${getMonthInWordFromDate(payment.date_payment_created)}</td>
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
                  <a href="./invoiceGeneration/payment-receipt.html?invoice_number=${payment.invoice_number
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

function fetchPayments(taxNumber) {
  const $tbody = $("#datatable1 tbody");
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

  $.ajax({
    type: "GET",
    url: `${HOST}/get-payment?invoice_type=paye&tax_number=${taxNumber}`,
    dataType: "json",
    headers: {
      Authorization: "Bearer " + authToken,
      "Content-Type": "application/json",
    },
    crossDomain: true,
    success: function (response) {
      $tbody.empty(); // Clear existing rows
      // console.log(response.data);
      if (response.status === "success" && response.data.length > 0) {
        response.data.forEach((payment, i) => {
          dataToExport = response.data;
          const paymentFor = payment.associated_revenue_heads
            .map((head) => head.item_name)
            .join(", ");

          const paymentStatus = payment.amount_paid > 0 ? "success" : "pending";
          const paymentStatusClass =
            paymentStatus === "success" ? "badge-success" : "badge-danger";

          const row = `
            <tr>
              <td>${i + 1}</td>
              <td class="text-sm">${payment.user_id || "N/A"}</td>
              <td class="text-sm">${payment.payment_reference_number || "N/A"
            }</td>
              <td class="text-sm">${payment.invoice_description || "N/A"}</td>
              <td class="text-sm">${payment.duration || "N/A"}</td>
              <td class="text-sm">₦${parseFloat(
              payment.amount_paid
            ).toLocaleString()}</td>
              <td class="text-sm">${payment.payment_method || "N/A"}</td>
              <td class="text-sm">
                <span class="badge ${paymentStatusClass}">${paymentStatus}</span>
              </td>
              <td class="text-sm">
                <button class="btn btn-secondary" onclick="viewStaff(this)" data-invoiceNo="${payment.invoice_number
            }">
                  <i class="fas fa-user"></i>
                </button>
                <a class="btn btn-primary" href="../../invoiceGeneration/payment-receipt.html?invoice_number=${payment.invoice_number
            }" style="color: white;">
                  <i class="far fa-eye"></i>
                </a>
              </td>
            </tr>
          `;
          $tbody.append(row);
        });
      } else {
        const noDataRow = `
            <tr>
              <td colspan="7" class="text-center">No payments found.</td>
            </tr>
          `;
        $tbody.append(noDataRow);
      }
    },
    error: function (err) {
      console.error("Error fetching invoices:", err);
      const errorRow =
        '<tr><td colspan="11" class="text-center text-danger">An error occurred while fetching payments.</td></tr>';
      $tbody.html(errorRow);
    },
  });
}

// Fetch invoices on page load
fetchPayments(payeId);

function viewStaff(button) {
  const invoiceNumber = button.getAttribute("data-invoiceNo");

  // Show loading state in the modal
  const modalBody = document.getElementById("staffModalBody");
  modalBody.innerHTML = `
    <tr>
      <td colspan="5" class="text-center">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </td>
    </tr>
  `;

  // Fetch staff data
  fetch(`${HOST}/paye-invoice-staff?invoice_number=${invoiceNumber}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + authToken,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success" && data.data.length > 0) {
        // Clear the loading state
        modalBody.innerHTML = "";

        // Append staff data to the modal
        data.data.forEach((staff) => {
          const row = `
            <tr>
              <td>${staff.staff_name}</td>
              <td>${staff.staff_email}</td>
              <td>${staff.staff_phone}</td>
              <td>₦${parseFloat(
            staff.monthly_tax_payable
          ).toLocaleString()}</td>
              <td>${staff.created_at.split(" ")[0]}</td>
            </tr>
          `;
          modalBody.innerHTML += row;
        });
      } else {
        modalBody.innerHTML = `
          <tr>
            <td colspan="5" class="text-center">No staff data found for this invoice.</td>
          </tr>
        `;
      }
    })
    .catch((error) => {
      console.error("Error fetching staff data:", error);
      modalBody.innerHTML = `
        <tr>
          <td colspan="5" class="text-center text-danger">An error occurred while fetching staff data.</td>
        </tr>
      `;
    });

  // Show the modal
  const modal = new bootstrap.Modal(document.getElementById("staffModal"));
  modal.show();
}

function getMonthInWordFromDate(dateString) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Create a Date object from the input string
  const dateObject = new Date(dateString);

  // Get the month (returns a number from 0 to 11)
  const monthNumber = dateObject.getMonth();

  // Get the month name from the array using the month number
  const monthInWord = months[monthNumber];

  return monthInWord;
}
