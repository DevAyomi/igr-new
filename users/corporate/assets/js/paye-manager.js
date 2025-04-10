const payeId = getParameterByName("payerId");
const special_user_id = userData.user_id;
const business_name = getParameterByName("name");

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
        tax_number: userData.tax_number,
        invoice_type: "paye",
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
          `);
        },
        success: function (response) {
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
          $("#payment-table tbody").html(`
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
});

function fetchPayeDetails(payeId) {
  // Show loading state

  $.ajax({
    type: "GET",
    url: `${HOST}/get-special-users?name=${business_name}`,
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
          addStaff.href = `create-staff.html?id=${paye.id}&payerId=${paye.payer_id}`;
          addStaff.classList.remove("d-none");
        }

        $("#mvieww").html(`
          <a href="create-staff.html?id=${paye.id}&payerId=${paye.payer_id}"
            class="btn btn-primary d-block d-flex align-items-center btn-sm text-nowrap gap-1">
            <div style="margin-top: 4px">
              <span class="btn-inner--icon"><i class="ni ni-fat-add"></i></span>
            </div>
            <div><span>Add Employee</span></div>
          </a>  
        `);
        $("#mvieww2").html(`
          <a href="create-staff.html?id=${paye.id}&payerId=${paye.payer_id}" class="btn btn-primary d-block d-flex align-items-center btn-sm text-nowrap gap-1">
            <div style="margin-top: 4px">
              <span class="btn-inner--icon"><i class="ni ni-fat-add"></i></span>
            </div>
            <div><span>Add Employee</span></div>
          </a>
        `);
      } else {
      }
    },
    error: function (xhr, status, error) {
      console.error("Error fetching paye details:", error);
    },
  });
}

// fetchPayeDetails(payeId);

let urlParams = new URLSearchParams(window.location.search);
// let business_name = urlParams.get("name");

const payerId = userData?.tax_number;

const tableBody = $("#paye-table tbody");

let employeeData = [];
const revenueHeadItems = [];
sessionStorage.removeItem("payeeUpdate2");

$.ajax({
  url: `${HOST}/get-revenue-head`,
  type: "GET",
  headers: {
    Authorization: `Bearer ${authToken}`,
    "Content-Type": "application/json",
  },
  success: function (response) {
    if (response.status === "success") {
      // Get the revenue items data
      const revenueItems = response.data.filter(
        (item) => item.item_name === "PAYE"
      );
      revenueHeadItems.push(...revenueItems);
    } else {
      console.error("Failed to fetch revenue items.");
    }
  },
  error: function (xhr, status, error) {
    console.error("An error occurred: ", error);
    // alert("Could not load revenue items.");
  },
});

fetchEmployees(special_user_id);

$("#mvieww").html(`
  <a href="add-staff.html?id=${special_user_id}&payerId=${payerId}"
    class="btn btn-primary d-block d-flex align-items-center btn-sm text-nowrap gap-1">
    <div style="margin-top: 4px">
      <span class="btn-inner--icon"><i class="ni ni-fat-add"></i></span>
    </div>
    <div><span>Add Employee</span></div>
  </a>  
`);
$("#mvieww2").html(`
  <a href="add-staff.html?id=${special_user_id}&payerId=${payerId}" class="btn btn-primary d-block d-flex align-items-center btn-sm text-nowrap gap-1">
    <div style="margin-top: 4px">
      <span class="btn-inner--icon"><i class="ni ni-fat-add"></i></span>
    </div>
    <div><span>Add Employee</span></div>
  </a>
`);

async function fetchEmployees(the_id) {
  let noOfEmployees = 0;
  $("#noOfEmployees").html(
    '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>'
  );
  const table = $("#paye-table").DataTable({
    serverSide: true,
    paging: true,
    ordering: false,
    pageLength: 50,
    responsive: true,
    searchDelay: 500,
    searching: false,
    pagingType: "simple_numbers",
    ajax: function (data, callback, settings) {
      const pageNumber = Math.ceil(data.start / data.length) + 1;

      const filters = {
        special_user_id: the_id,
      };
      $.ajax({
        type: "GET",
        url: `${HOST}/get-special-user-employees`,
        data: filters,
        dataType: "json",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        beforeSend: function () {
          $(`#paye-table tbody`).html(`
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
              `);
        },
        success: function (response) {
          if (response.status === "success" && response.data.length > 0) {
            employeeData = response.data; // Populate employeeData
            callback({
              draw: data.draw,
              recordsTotal: response.data.length,
              recordsFiltered: response.data.length,
              data: response.data,
            });
            noOfEmployees = response.data.length;
            $("#noOfEmployees").text(noOfEmployees);
          } else {
            $("#paye-table tbody").html(`
              <tr>
                <td colspan="8" class="text-center text-muted">
                  No Employee data found.
                </td>
              </tr>
            `);
            callback({
              draw: data.draw,
              recordsTotal: 0,
              recordsFiltered: 0,
              data: [],
            });
            $("#noOfEmployees").text(noOfEmployees);
          }
        },
        error: function (err) {
          console.error("Error fetching payment data:", err);
          $("#paye-table tbody").html(`
              <tr>
                <td colspan="7" class="text-center text-danger">
                  Error loading data. Please try again.
                </td>
              </tr>
            `);

          callback({
            draw: data.draw,
            recordsTotal: 0,
            recordsFiltered: 0,
            data: [],
          });

          $("#noOfEmployees").text(noOfEmployees);
        },
      });
    },
    columns: [
      {
        data: "id",
        render: function (data, type, user, meta) {
          return `
            <div class="form-check">
              <input type="checkbox" class="form-check-input checkboxer" data-id="${user.id}" data-monthly_tax_payable="${user.monthly_tax_payable}" id="customCheck${meta.row}">
              <label class="form-check-label" for="customCheck${meta.row}"></label>
            </div>`;
        },
      },
      { data: "payer_id" },
      { data: "fullname" },
      {
        data: "annual_gross_income",
        render: function (data) {
          return `₦ ${parseFloat(data).toLocaleString()}`;
        },
      },
      {
        data: "basic_salary",
        render: function (data) {
          return `₦ ${parseFloat(data).toLocaleString()}`;
        },
      },
      {
        data: "monthly_tax_payable",
        render: function (data) {
          return `₦ ${parseFloat(data).toLocaleString()}`;
        },
      },
      {
        data: "created_date",
        render: function (data) {
          return data.split(" ")[0];
        },
      },
      {
        data: "id",
        render: function (data, type, row) {
          return `
            <div class="flex items-center gap-x-3">
              <a href="edit-staff.html?id=${row.id}&payerId=${row.payer_id}&name=${row.name}" class="btn btn-primary"><i class="fas fa-edit"></i></a>
              <button class="btn btn-danger" onclick="deletePayeeBusiness(this)" data-revid="${data}">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          `;
        },
      },
    ],
  });
}

function checkAll(e) {
  let checkboxes = document.querySelectorAll(".checkboxer[type=checkbox]");

  if (e.checked) {
    checkboxes.forEach((checkbox) => {
      checkbox.checked = true;
    });
  } else {
    checkboxes.forEach((checkbox) => {
      checkbox.checked = false;
    });
  }
}

function generateInvoice() {
  let checkboxes = document.querySelectorAll(".checkboxer[type=checkbox]");
  let checked = [];
  let staffData = [];

  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      checked.push(checkbox.dataset.id);
      let employee = employeeData.find(
        (emp) => emp.id === parseInt(checkbox.dataset.id)
      );
      staffData.push({
        staff_id: employee.id,
        monthly_tax_payable: parseFloat(employee.monthly_tax_payable),
      });
    }
  });

  if (checked.length === 0) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Please select at least one employee to generate invoice for.",
      showConfirmButton: false,
    });
    return;
  }

  let amountToBePaid = 0;
  staffData.forEach((staff) => {
    amountToBePaid += staff.monthly_tax_payable;
  });

  let selectOptions = revenueHeadItems
    .map(
      (item) =>
        `<option data-mdaid="${item.mda_id}" ${item.item_name == "PAYE" ? "selected" : ""
        } value="${item.id}">${item.item_name} - (${item.category})</option>`
    )
    .join("");

  Swal.fire({
    title: "Generate Invoice",
    text: `Are you sure you want to generate invoice for the selected employees?`,
    html: `
      <p>Total amount to be paid: ₦ ${amountToBePaid.toLocaleString("en-NG", {
      minimumFractionDigits: 2,
    })}</p>
      <div class="form-group">
        <label for="revenueHead">Select Revenue Head:</label>
        <select id="revenueHead" class="form-select">
          <option selected disabled>-- Select from list --</option>
          ${selectOptions}
        </select>
      </div>
      <div class="form-group">
        <label for="revMonth">Select Month:</label>
        <input type="date" id="revMonth" name="month" class="form-control">
      </div>
    `,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#02A75A",
    confirmButtonText: "Generate Invoice",
    cancelButtonText: "Cancel",
    showLoaderOnConfirm: true,
    preConfirm: async (login) => {
      try {
        let userDataa = JSON.parse(localStorage.getItem("userData"));
        const selectedRevenueHead =
          document.getElementById("revenueHead").value;
        const selectedOption =
          document.getElementById("revenueHead").options[
          document.getElementById("revenueHead").selectedIndex
          ];
        const mda_id = selectedOption.getAttribute("data-mdaid");

        let dataToSend = {
          tax_number: userDataa?.tax_number,
          invoice_type: "paye",
          invoice_duration: $("#revMonth").val(),
          tax_office: "Jigawa Tax Office",
          lga: "Auyo",
          description: `PAYE Invoice for ${checked.length} employees`,
          revenue_heads: [
            {
              revenue_head_id: selectedRevenueHead,
              mda_id: mda_id,
              amount: amountToBePaid,
            },
          ],
        };
        const githubUrl = `${HOST}/create-invoice`;
        const response = await fetch(githubUrl, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSend),
        });

        if (!response.ok) {
          return Swal.showValidationMessage(`
            ${JSON.stringify(await response.json())}
          `);
        }
        return response.json();
      } catch (error) {
        Swal.showValidationMessage(`
          Request failed: ${error}
        `);
      }
    },
    allowOutsideClick: () => !Swal.isLoading(),
  }).then((resulto) => {
    if (resulto.isConfirmed) {
      const invoiceNumber = resulto.value.invoice_number;

      Swal.fire({
        title: "Generating...",
        text: "Please wait while the request is processed",
        didOpen: () => {
          Swal.showLoading();
        },
        allowOutsideClick: () => !Swal.isLoading(),
      });

      // Now, call the paye-invoice-staff endpoint
      const payeInvoiceStaffUrl = `${HOST}/paye-invoice-staff`;
      const payeInvoiceStaffData = {
        invoice_number: invoiceNumber,
        associated_special_user_id: special_user_id, // Assuming this is a fixed value or fetched from somewhere
        staff_data: staffData, // Include the staff_data array here
      };

      fetch(payeInvoiceStaffUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payeInvoiceStaffData),
      })
        .then((response) => response.json())
        .then((data) => {
          Swal.fire({
            title: "Success",
            text: "PAYE invoice staff records created successfully!",
            icon: "success",
            showCancelButton: false,
            confirmButtonColor: "#02A75A",
            confirmButtonText: "Open Invoice",
          }).then((result) => {
            window.location.href = `../../invoiceGeneration/invoice.html?invoice_number=${invoiceNumber}`;
          });
        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to associate staff with invoice.",
          });
        });
    }
  });
}

// DELETE OR EDTI PAYEE EMPLOYEE

function deletePayeeBusiness(e) {
  let theRevId = e.dataset.revid;
  // console.log(theRevId);
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
    showLoaderOnConfirm: true,
    preConfirm: async (login) => {
      try {
        let thePost = {
          id: theRevId,
        };
        const githubUrl = `${HOST}/delete-special-user-employee`;
        const response = await fetch(githubUrl, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(thePost),
        });

        if (!response.ok) {
          return Swal.showValidationMessage(`
            ${JSON.stringify(await response.json())}
          `);
        }
        return response.json();
      } catch (error) {
        Swal.showValidationMessage(`
          Request failed: ${error}
        `);
      }
    },
    allowOutsideClick: () => !Swal.isLoading(),
  }).then((resulto) => {
    if (resulto.isConfirmed) {
      fetchPayeDetails();
      Swal.fire("Deleted!", "Employee has been deleted.", "success");
    }
  });
}

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

function getCurrentMonthYear() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function populateYearDropdown(annualRevFilter) {
  const yearSelect = document.querySelector(`.${annualRevFilter}`);
  const currentYear = new Date().getFullYear();
  const startYear = 2024; // Fixed start year
  const endYear = currentYear; // 2 years beyond current year

  for (let year = startYear; year <= endYear; year++) {
    const option = document.createElement("option");
    option.value = year;
    option.textContent = year;
    yearSelect.appendChild(option);
  }

  yearSelect.value = currentYear;
}

async function fetchEstimatedMonthlyTaxPayable(taxNumber, year, month) {
  $("#monthlyEstimate").html(
    '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>'
  );
  try {
    const response = await fetch(
      `${HOST}/paye-monthly-payable?tax_number=${taxNumber}&year=${year}&month=${month}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
    }
    );
    const data = await response.json();

    if (data.status === "success") {
      $("#monthlyEstimate").html(
        `₦ ${Number(data.data[0].total_monthly_payable).toLocaleString(
          "en-NG",
          {
            minimumFractionDigits: 2,
          }
        )}`
      );
    } else {
      $("#monthlyEstimate").html("₦ 0");
    }
  } catch (error) {
    console.error("Error fetching estimated monthly tax payable:", error);
    $("#monthlyEstimate").html("₦ 0");
  }
}

async function fetchEstimatedYearlyTaxPayable(taxNumber, year) {
  $("#totalAnnualEstimate").html(
    '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>'
  );
  try {
    const response = await fetch(
      `${HOST}/paye-yearly-payable?year=${year}&tax_number=${taxNumber}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();

    if (data.status === "success") {
      $("#totalAnnualEstimate").html(
        `₦ ${Number(data.data[0].total_yearly_payable).toLocaleString("en-NG", {
          minimumFractionDigits: 2,
        })}`
      );
    } else {
      $("#totalAnnualEstimate").html("₦ 0");
    }
  } catch (error) {
    console.error("Error fetching estimated yearly tax payable:", error);
    $("#totalAnnualEstimate").html("₦ 0");
  }
}

async function fetchTotalAnnualRemittance(taxNumber, year) {
  $("#totalAnnualRemittance").html(
    '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>'
  );
  try {
    const response = await fetch(
      `${HOST}/paye-invoices-paid?year=${year}&tax_number=${taxNumber}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();

    if (data.status === "success") {
      $("#totalAnnualRemittance").html(
        `₦ ${Number(data.data.total_paid).toLocaleString("en-NG", {
          minimumFractionDigits: 2,
        })}`
      );
    } else {
      $("#totalAnnualRemittance").html("₦ 0");
    }
  } catch (error) {
    console.error("Error fetching estimated yearly tax payable:", error);
    $("#totalAnnualRemittance").html("₦ 0");
  }
}

async function fetchTotalMonthlyRemittance(taxNumber, year, month) {
  $("#totalMonthlyRemittance").html(
    '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>'
  );
  try {
    const response = await fetch(
      `${HOST}/paye-invoices-paid?tax_number=${taxNumber}&year=${year}&month=${month}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();

    if (data.status === "success") {
      $("#totalMonthlyRemittance").html(
        `₦ ${Number(data.data.total_paid).toLocaleString("en-NG", {
          minimumFractionDigits: 2,
        })}`
      );
    } else {
      $("#totalMonthlyRemittance").html("₦ 0");
    }
  } catch (error) {
    console.error("Error fetching estimated monthly tax payable:", error);
    $("#totalMonthlyRemittance").html("₦ 0");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const yearInput = document.querySelector(".annualEstFilter");
  const yearInput2 = document.querySelector(".annualEstFilter2");
  const monthInput = document.querySelector(".monthlyEstiFilter");
  const monthInput2 = document.querySelector(".monthlyEstiFilter2");
  const currentMonthYear = getCurrentMonthYear();
  const currentYear = new Date().getFullYear();
  const payerId = userData?.tax_number;

  populateYearDropdown("annualEstFilter");
  populateYearDropdown("annualEstFilter2");
  yearInput.value = currentYear;
  monthInput.value = currentMonthYear;
  yearInput2.value = currentYear;
  monthInput2.value = currentMonthYear;

  // Fetch estimated monthly and yearly tax payable
  fetchEstimatedMonthlyTaxPayable(
    payerId,
    currentYear,
    monthInput.value.split("-")[1]
  );
  fetchTotalMonthlyRemittance(
    payerId,
    currentYear,
    monthInput.value.split("-")[1]
  );
  fetchEstimatedYearlyTaxPayable(payerId, currentYear);
  fetchTotalAnnualRemittance(payerId, currentYear);

  yearInput.addEventListener("change", (event) => {
    const selectedYear = event.target.value;
    fetchEstimatedYearlyTaxPayable(payerId, selectedYear);
  });

  monthInput.addEventListener("change", (event) => {
    const selectedMonthYear = event.target.value;
    fetchEstimatedMonthlyTaxPayable(
      payerId,
      selectedMonthYear.split("-")[0],
      selectedMonthYear.split("-")[1]
    );
  });

  yearInput2.addEventListener("change", (event) => {
    const selectedYear = event.target.value;
    fetchTotalAnnualRemittance(payerId, selectedYear);
  });

  monthInput2.addEventListener("change", (event) => {
    const selectedMonthYear = event.target.value;
    fetchTotalMonthlyRemittance(
      payerId,
      selectedMonthYear.split("-")[0],
      selectedMonthYear.split("-")[1]
    );
  });
});

function editFunc(e) {
  let editaID = e.dataset.revid;
  // console.log(editaID)
  sessionStorage.setItem("payeeUpdate2", editaID);

  $("#editStaffModal").modal("show");

  let theREV = employeeData.find((dd) => dd.id === parseInt(editaID));

  let allInputs = document.querySelectorAll(".enumInput2");

  allInputs.forEach((theInpt) => {
    if (theREV[theInpt.dataset.name]) {
      theInpt.value = theREV[theInpt.dataset.name];
    }
  });
}

$("#editStaffBtn").on("click", () => {
  $("#editStaffBtn")
    .prop("disabled", true)
    .html(
      `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Updating...`
    );

  let theRevId = sessionStorage.getItem("payeeUpdate2");

  let allInputs = document.querySelectorAll(".enumInput2");

  let obj = {
    id: parseInt(theRevId),
  };
  allInputs.forEach((allInput) => {
    obj[allInput.dataset.name] = allInput.value;
  });

  // console.log(obj);

  $.ajax({
    type: "POST",
    url: `${HOST}/edit-special-user-employee`,
    data: JSON.stringify(obj),
    dataType: "json",
    headers: {
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/json",
    },
    success: function (data) {
      $("#editStaffBtn").prop("disabled", false).html(`Edit Staff`);

      if (data.status === "success") {
        setTimeout(() => {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: `${data.message}`,
            showConfirmButton: false,
          });
          fetchEmployees(special_user_id);
          $("#editStaffModal").modal("hide");
        }, 2000);
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: `${data.message}`,
          showConfirmButton: false,
        });
      }
    },
    error: function (request, error) {
      $("#editStaffBtn").prop("disabled", false).html(`Edit Staff`);
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: `Failed to update staff`,
        showConfirmButton: false,
      });
      console.log(error);
    },
  });
});
