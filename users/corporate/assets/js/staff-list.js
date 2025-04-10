const payeId = getParameterByName("payerId");
const special_user_id = getParameterByName("id");
const business_name = getParameterByName("name");

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
          addStaff.href = `add-staff.html?id=${paye.id}&payerId=${paye.payer_id}`;
          addStaff.classList.remove("d-none");
        }

        $("#mvieww").html(`
          <a href="add-staff.html?id=${paye.id}&payerId=${paye.payer_id}"
            class="btn btn-primary d-block d-flex align-items-center btn-sm text-nowrap gap-1">
            <div style="margin-top: 4px">
              <span class="btn-inner--icon"><i class="ni ni-fat-add"></i></span>
            </div>
            <div><span>Add Employee</span></div>
          </a>  
        `);
        $("#mvieww2").html(`
          <a href="add-staff.html?id=${paye.id}&payerId=${paye.payer_id}" class="btn btn-primary d-block d-flex align-items-center btn-sm text-nowrap gap-1">
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

fetchPayeDetails(payeId);

let urlParams = new URLSearchParams(window.location.search);
// let business_name = urlParams.get("name");

const payerId = userData?.tax_number;

const tableBody = $("#paye-table tbody");

let employeeData = [];
const revenueHeadItems = [];
sessionStorage.removeItem("payeeUpdate2");

function fetchPayments(filters = {}) {
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

  // Show loader
  $tbody.html(loaderRow);

  $.ajax({
    type: "GET",
    url: `${HOST}/get-payment?tax_number=${userData.tax_number}`,
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
                <td class="text-sm">${
                  payment.payment_reference_number || "N/A"
                }</td>
                <td class="text-sm">${paymentFor || "N/A"}</td>
                <td class="text-sm">₦${parseFloat(
                  payment.amount_paid
                ).toLocaleString()}</td>
                <td class="text-sm">${payment.payment_method || "N/A"}</td>
                <td class="text-sm">
                  <span class="badge ${paymentStatusClass}">${paymentStatus}</span>
                </td>
                <td class="text-sm">
                  <a href="../invoiceGeneration/payment-receipt.html?invoice_number=${
                    payment.invoice_number
                  }" type="button" class="btn btn-primary" target="_blank">
                    View receipt
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
fetchPayments();

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
      const revenueItems = response.data;

      revenueHeadItems.push(...revenueItems);
    } else {
      alert("Failed to fetch revenue items.");
    }
  },
  error: function (xhr, status, error) {
    console.error("An error occurred: ", error);
    alert("Could not load revenue items.");
  },
});

fetchEmployees(special_user_id);
async function fetchEmployees(the_id) {
  $.ajax({
    url: `${HOST}/get-special-user-employees?special_user_id=${the_id}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/json",
    },
    success: function (response) {
      let theresponse = response.data;

      tableBody.empty();
      if (theresponse.length > 0) {
        tableBody.empty();

        employeeData = theresponse;

        theresponse.forEach((user, index) => {
          const row = `
            <tr>
              <td>
                <div class="form-check">
                  <input type="checkbox" class="form-check-input checkboxer" data-id="${
                    user.id
                  }" id="customCheck${index}">
                  <label class="form-check-label" for="customCheck${index}"></label>
                </div>
              </td>
              <td>${user.payer_id}</td>
              <td>${user.fullname}</td>
              <td>₦ ${parseFloat(
                user.annual_gross_income
              ).toLocaleString()}</td>
              <td>₦ ${parseFloat(user.basic_salary).toLocaleString()}</td>
              <td>₦ ${parseFloat(
                user.monthly_tax_payable
              ).toLocaleString()}</td>
              <td>${user.created_date.split(" ")[0]}</td>
              <td>
                <div class="flex items-center gap-x-3">
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
      } else {
        tableBody.append(
          `<tr><td colspan="7" class="text-center">No data available</td></tr>`
        );
      }
    },
    error: function (xhr, status, error) {
      console.error("Error fetching special users:", error);
    },
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
  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      checked.push(checkbox.dataset.id);
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

  // console.log(checked);
  let amountToBePaid = 0;
  checked.forEach((id) => {
    let employee = employeeData.find((emp) => emp.id === parseInt(id));
    amountToBePaid += parseFloat(employee.monthly_tax_payable);
  });

  let selectOptions = revenueHeadItems
    .map(
      (item) =>
        `<option data-mdaid="${item.mda_id}" value="${item.id}">${item.item_name} - (${item.category})</option>`
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
          invoice_type: "direct",
          tax_office: "kano Tax Office",
          lga: "Auyo",
          description: `PAYE Invoice for ${checked.length} employees of ${business_name}`,
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
      Swal.fire({
        title: "Success",
        text: "Invoice generated successfully!",
        icon: "success",
        showCancelButton: false,
        confirmButtonColor: "#02A75A",
        confirmButtonText: "Open Invoice",
      }).then((result) => {
        window.location.reload();
        window.open(
          `../invoiceGeneration/invoice.html?invoice_number=${resulto.value.invoice_number}`
        );
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
        $("#msg_boxedit").html(`
          <p class="text-success text-center mt-4 text-lg">${data.message}</p>
        `);
        setTimeout(() => {
          fetchPayeDetails();
          $("#editStaffModal").modal("hide");
          $("#msg_boxedit").html("");
        }, 2000);
      } else {
        $("#msg_boxedit").html(`
          <p class="text-warning text-center mt-4 text-lg">${data.message}</p>
        `);
      }
    },
    error: function (request, error) {
      $("#editStaffBtn").prop("disabled", false).html(`Edit Staff`);

      $("#msg_boxedit").html(`
        <p class="text-danger text-center mt-4 text-lg">Failed to Update!</p>
      `);
      console.log(error);
    },
  });
});
