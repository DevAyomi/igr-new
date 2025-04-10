const tableBody = $("#paye-table tbody");

const payerId = userData.tax_number;
let ALLSPECIALUSERS = [];

sessionStorage.removeItem("payeeUpdate");
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

  let employeeCount = 0;
  let businessCount = 0;
  data.forEach((user, index) => {
    employeeCount += user.employee_count;
    businessCount++;
    const row = `
      <tr>
        <td>${index + 1}</td>
        <td><a class="text-primary" href="staff-list.html?id=${
          user.id
        }&payerId=${user.payer_id}&name=${user.name}">${user.name}</a></td>
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
              <a href="staff-list.html?id=${user.id}&payerId=${
      user.payer_id
    }&name=${user.name}" style="color: white;">
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

  $("#totalSpecialUsers").text(businessCount);
  $("#totalEmployees").text(employeeCount);
}

// Fetch and display data on page load
fetchSpecialUsers();

function registerUser() {
  const inputs = document.querySelectorAll(".payeInput");
  let isValid = true;

  inputs.forEach((input) => {
    const errorMessage = input.nextElementSibling;

    if (input.required && input.value.trim() === "") {
      isValid = false;

      input.style.border = "1px solid red";
      if (errorMessage && errorMessage.tagName === "SMALL") {
        errorMessage.classList.remove("d-none");
        errorMessage.textContent = "This field is required.";
      }

      if (isValid) input.focus();
    } else {
      input.style.border = "";
      if (errorMessage && errorMessage.tagName === "SMALL") {
        errorMessage.classList.add("d-none");
      }
    }
  });

  if (isValid) {
    $("#regBtn")
      .prop("disabled", true)
      .html(
        `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Registering...`
      );

    const authToken = localStorage.getItem("userSession");

    let dataToSend = {
      password: "12345",
      tax_number: userData.tax_number,
    };
    const inputs = document.querySelectorAll(".payeInput");
    inputs.forEach((input) => {
      dataToSend[input.name] = input.value;
    });

    // console.log(dataToSend);
    $.ajax({
      type: "POST",
      url: `${HOST}/register-special-user`,
      dataType: "json",
      headers: {
        Authorization: "Bearer " + authToken,
      },
      data: JSON.stringify(dataToSend),
      success: function (response) {
        $("#regBtn").prop("disabled", false).html(`Register`);

        if (response.status === "success") {
          Swal.fire({
            title: "Success",
            text: "Registered successfully!",
            icon: "success",
            showCancelButton: false,
            confirmButtonColor: "#02A75A",
            // cancelButtonColor: '#3085d6',
            confirmButtonText: "Continue",
          }).then((result) => {
            fetchSpecialUsers();
            $("#addBusiness").modal("hide");
          });
        } else {
          $("#msg_box").html(
            `<p class="text-warning text-center mt-4 text-lg">${data.message}</p>`
          );
        }
      },
      error: function (request, error) {
        $("#msg_box").html(
          `<p class="text-danger text-center mt-4 text-lg">${
            request.responseJSON.message
              ? request.responseJSON.message
              : "Registration Failed"
          }</p>`
        );
        console.error("Error registering user:", error);
        $("#regBtn").prop("disabled", false).html(`Register`);
      },
    });
  }
}

// CARDS INTEGRATION

function getCurrentMonthYear() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

async function fetchTotalAnnualEstimate(year) {
  $("#totalAnnualEstimate").html(
    '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>'
  );
  try {
    const response = await fetch(
      `${HOST}/get-total-annual-estimate?year=${year}`
    );
    const data = await response.json();

    if (data.status === "success") {
      $("#totalAnnualEstimate").html(
        `₦ ${Number(data.total_annual_estimate).toLocaleString("en-NG", {
          minimumFractionDigits: 2,
        })}`
      );
    } else {
      $("#totalAnnualEstimate").html(0);
    }
  } catch (error) {
    console.error("Error fetching total annual revenue:", error);
    $("#totalAnnualEstimate").html(0);
  }
}

async function fetchTotalAnnualRemittance(year) {
  $("#totalAnnualRemittance").html(
    '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>'
  );
  try {
    const response = await fetch(
      `${HOST}/get-total-annual-remittance?year=${year}`
    );
    const data = await response.json();

    if (data.status === "success") {
      $("#totalAnnualRemittance").html(
        `₦ ${Number(data.total_annual_remittance).toLocaleString("en-NG", {
          minimumFractionDigits: 2,
        })}`
      );
    } else {
      $("#totalAnnualRemittance").html(0);
    }
  } catch (error) {
    console.error("Error fetching total annual revenue:", error);
    $("#totalAnnualRemittance").html(0);
  }
}

async function fetchTotalMonthlyEstimate(monthYear) {
  $("#monthlyEstimate").html(
    '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>'
  );
  const [year, month] = monthYear.split("-");
  try {
    const response = await fetch(
      `${HOST}/get-monthly-estimate?month=${month}&year=${year}`
    );
    const data = await response.json();

    if (data.status === "success") {
      $("#monthlyEstimate").html(
        `₦ ${Number(data.total_monthly_estimate).toLocaleString("en-NG", {
          minimumFractionDigits: 2,
        })}`
      );
    } else {
      $("#monthlyEstimate").html(0);
    }
  } catch (error) {
    console.error("Error fetching total revenue:", error);
    $("#monthlyEstimate").html(0);
  }
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

document.addEventListener("DOMContentLoaded", () => {
  const yearInput = document.querySelector(".annualEstFilter");
  const yearInput2 = document.querySelector(".annualRemiFilter");
  const monthInput = document.querySelector(".monthlyEstiFilter");
  const currentMonthYear = getCurrentMonthYear();
  const currentYear = new Date().getFullYear();

  populateYearDropdown("annualEstFilter");
  populateYearDropdown("annualRemiFilter");

  yearInput.value = currentYear;
  yearInput2.value = currentYear;
  monthInput.value = currentMonthYear;

  fetchTotalAnnualEstimate(currentYear);
  fetchTotalAnnualRemittance(currentYear);
  fetchTotalMonthlyEstimate(currentMonthYear);

  yearInput.addEventListener("change", (event) => {
    const selectedYear = event.target.value;
    fetchTotalAnnualEstimate(selectedYear);
  });

  yearInput2.addEventListener("change", (event) => {
    const selectedYear = event.target.value;
    fetchTotalAnnualRemittance(selectedYear);
  });

  monthInput.addEventListener("change", (event) => {
    const selectedMonthYear = event.target.value;
    fetchTotalMonthlyEstimate(selectedMonthYear);
  });

  // monthInput2.addEventListener('change', (event) => {
  //   const selectedMonthYear = event.target.value;
  //   fetchExpectedMonthlyRevenue(selectedMonthYear);
  // });
});

// DELETE PAYEE

function deletePayeeBusiness(e) {
  let theRevId = e.dataset.revid;
  console.log(theRevId);
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
        const githubUrl = `${HOST}/delete-special-user`;
        const response = await fetch(githubUrl, {
          method: "POST",
          headers: {
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
      fetchSpecialUsers();
      Swal.fire("Deleted!", "Businesss has been deleted.", "success");
    }
  });
}

function editFunc(e) {
  let editaID = e.dataset.revid;
  // console.log(editaID)
  sessionStorage.setItem("payeeUpdate", editaID);

  $("#editBusiness").modal("show");

  let theREV = ALLSPECIALUSERS.find((dd) => dd.id === parseInt(editaID));

  let allInputs = document.querySelectorAll(".payeInput2");

  allInputs.forEach((theInpt) => {
    if (theREV[theInpt.name]) {
      theInpt.value = theREV[theInpt.name];
    }
  });
}

$("#editPayee").on("click", () => {
  $("#editPayee")
    .prop("disabled", true)
    .html(
      `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Updating...`
    );

  let theRevId = sessionStorage.getItem("payeeUpdate");

  let allInputs = document.querySelectorAll(".payeInput2");

  let obj = {
    id: parseInt(theRevId),
  };
  allInputs.forEach((allInput) => {
    obj[allInput.name] = allInput.value;
  });

  // console.log(obj);

  $.ajax({
    type: "POST",
    url: `${HOST}/edit-special-user`,
    data: JSON.stringify(obj),
    dataType: "json",
    success: function (data) {
      $("#editPayee").prop("disabled", false).html(`Edit Business`);

      if (data.status === "success") {
        $("#msg_boxedit").html(`
          <p class="text-success text-center mt-4 text-lg">${data.message}</p>
        `);
        setTimeout(() => {
          fetchSpecialUsers();
          $("#editBusiness").modal("hide");
          $("#msg_boxedit").html("");
        }, 2000);
      } else {
        $("#msg_boxedit").html(`
          <p class="text-warning text-center mt-4 text-lg">${data.message}</p>
        `);
      }
    },
    error: function (request, error) {
      $("#editPayee").prop("disabled", false).html(`Edit Business`);

      $("#msg_boxedit").html(`
        <p class="text-danger text-center mt-4 text-lg">Failed to Update!</p>
      `);
      console.log(error);
    },
  });
});
