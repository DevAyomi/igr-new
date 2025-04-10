$(document).ready(function () {
  function listenForSelection() {
    const radioButtons = document.querySelectorAll(
      '.firstInpts[name="identificationMethod"]'
    );

    radioButtons.forEach((radio) => {
      radio.addEventListener("change", () => {
        if (radio.checked) {
          $("#identiMethod").html(radio.id);
        }
      });
    });
  }

  // Call the function to start listening
  listenForSelection();
});

let userFetchedData = {}

async function fetchUserDetails() {
  let paramUrl = "";

  let $selected_verification = $('input[name="identificationMethod"]:checked');

  if ($selected_verification.val() === "TaxRegID") {
    let taxID = $("#identificationInput").val();
    paramUrl = `tax_number=${taxID}`;
  } else if ($selected_verification.val() === "TIN") {
    let taxID = $("#identificationInput").val();
    paramUrl = `tax_number=${taxID}`;
  } else if ($selected_verification.val() === "Email") {
    let taxID = $("#identificationInput").val();
    paramUrl = `email=${taxID}`;
  } else if ($selected_verification.val() === "Phone") {
    let taxID = $("#identificationInput").val();
    paramUrl = `phone=${taxID}`;
  }

  if ($("#identificationInput").val() === "") {
    alert("Field cannot be empty");
    return;
  }

  // console.log(paramUrl);

  $("#submitFetch")
    .prop("disabled", true)
    .html('<i class="custom-spinner"></i> Fetching ...');

  try {
    const response = await fetch(`${HOST}/noauth-get-taxpayers?${paramUrl}`);
    const result = await response.json();
    $("#submitFetch").prop("disabled", false).html("Continue");
    // console.log(result);

    if (result.status === "success" && result.data.length > 0) {
      let data = result.data[0];
      userFetchedData = data;

      nextPrev(1)
      fetchSpecialUsers()
    } else {
      Swal.fire({
        title: "User Not Found",
        text: "No Information found with the provided data",
        html: `<p>Please register as a corporate account to continue</p>`,
        icon: "warning",
        confirmButtonColor: "#02A75A",
        confirmButtonText: "Go to Registration",
        showCancelButton: true,
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "../register/index.html";
        }

      });
    }
  } catch (error) {
    console.log(error);
    $("#submitFetch").prop("disabled", false).html("Continue");

    Swal.fire({
      // title: "Us",
      text: "Failed to Fetch User Information",
      icon: "error",
      confirmButtonColor: "#02A75A",
      confirmButtonText: "Fill Manually",
    }).then((result) => {
      fillManually(2);
    });
  }
}

function fetchSpecialUsers() {
  $("#businessContainer").html(`
    <div class="flex justify-center items-center gap-2 mt-5">
      <div class="loader">
        <div class="rotating-dots">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
      <span>Loading...</span>
    </div>
  `)

  $.ajax({
    url: `${HOST}/noauth-get-special-users?payer_id=${userFetchedData.tax_number}`,
    method: "GET",
    success: function (response) {
      let data = response.data;

      let allContainer = ""
      let allEmployeeCount = 0;

      data.forEach((business, index) => {
        allEmployeeCount += business.employee_count;
      });

      allContainer += `
        <div class="row">
          <div class="col-6">
            <div class="card card-body">
              <h5 class="card-title text-sm font-bold">No. of Business(s)</h5>
              <p class="card-text text-[#17A349] text-xl font-bold">${data.length}</p>
            </div>
          </div>

          <div class="col-6">
            <div class="card card-body">
              <h5 class="card-title text-sm font-bold">No. of Employees</h5>
              <p class="card-text text-[#17A349] text-xl font-bold">${allEmployeeCount}</p>
            </div>
          </div>
        </div>

        <div class="mt-6">
        <h5 class="text-base font-semibold mb-2">List of Business(s)</h5>
      `
      if (data.length === 0) {
        allContainer += `
          <div class="bg-gray-100 p-4 rounded-lg mb-4">
            <p class="font-bold mb-2 text-center">No Business Found</p>

          </div>  

          <p class="text-center text-lg mb-4">Please login into your account to add and manage your business(s). </p>
          <a href="../signin.html" class="block text-center w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-500 transition">
            Login
          </a>
        `

      } else {
        data.forEach((business, index) => {
          allContainer += `   
            <div class="business-list bg-gray-100 p-4 rounded-lg mb-4">
              <div class="flex justify-between">
                <div>
                  <p class="font-bold mb-2">${business.name}</p>
                  <p class="text-green-500 text-sm font-semibold">${business.employee_count} employees</p>
                </div>
                <div>
                  <button data-theid="${business.id}"  data-thename="${business.name}" class="text-sm text-[#17A349] bg-green-200 p-2 rounded-lg font-semibold"
                    onclick="fetchEmployees(this)">View Employees</button>
                </div>
              </div>
            </div>
          `
        });
      }

      allContainer += `</div>`
      $("#businessContainer").html(allContainer);

    },
    error: function (xhr, status, error) {
      console.error("Error fetching special users:", error);
      tableBody.append(
        `<tr><td colspan="7" class="text-center">No data available</td></tr>`
      );
    }
  });
}

async function fetchEmployees(e) {
  nextPrev(1)
  $("#business-name").html(e.dataset.thename)
  $("#employeeContainer").html(`
    <tr class="loader-row flex justify-center">
      <td colspan="4" class="text-center">
        <div class="loader">
          <div class="rotating-dots">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </td>
    </tr>
  `)
  let tableBody = document.querySelector("#employeeContainer")
  $.ajax({
    url: `${HOST}/noauth-get-special-user-employees?special_user_id=${e.dataset.theid}`,
    method: "GET",
    success: function (response) {
      let theresponse = response.data;


      if (theresponse.length > 0) {
        tableBody.innerHTML = "";


        theresponse.forEach((user, index) => {
          const row = `
            <tr>
              <td>${user.fullname}</td>
              <td>${user.email}</td>
              <td>₦ ${parseFloat(user.monthly_tax_payable).toLocaleString()}</td>
              <td>${user.created_date.split(" ")[0]}</td>
            </tr>
          `;
          tableBody.innerHTML += row;
        });
      } else {
        tableBody.innerHTML =
          `<tr><td colspan="7" class="text-center">No data available</td></tr>`;
      }

    },
    error: function (xhr, status, error) {
      console.error("Error fetching special users:", error);
      tableBody.innerHTML =
        `<tr><td colspan="7" class="text-center">No data available</td></tr>`;
    }
  });
}

function validateAndProceed(formId, callback) {
  const form = document.getElementById(formId);

  // Check if the form is valid
  if (form.checkValidity()) {
    // If valid, execute the callback function
    if (callback && typeof callback === "function") {
      callback(); // Execute the callback function
    }
  } else {
    // If not valid, show validation messages
    form.reportValidity(); // This will show the default validation messages
  }
}

async function checkEmailExists() {
  const emailInput = document.getElementById("email");
  const personalSubmitBtn = document.getElementById("personalSubmitBtn");
  const emailResponseDiv = document.getElementById("emailResponse");
  const email = emailInput.value;

  // Clear previous response
  emailResponseDiv.style.display = "none";
  emailResponseDiv.textContent = "";

  if (email) {
    try {
      const response = await fetch(`${HOST}/noauth-get-taxpayers?email=${email}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const res = await response.json();
      const data = res.data;

      if (response.ok) {
        // Assuming the API returns a message indicating if the email exists
        if (data.length > 0) {
          emailResponseDiv.textContent = "This email is already registered.";
          emailResponseDiv.classList.remove("text-success");
          emailResponseDiv.classList.add("text-danger");
          personalSubmitBtn.disabled = true;
        } else {
          emailResponseDiv.textContent = "";
          emailResponseDiv.classList.remove("text-danger");
          //   emailResponseDiv.classList.add("text-success");
          personalSubmitBtn.disabled = false;
        }
      } else {
        emailResponseDiv.textContent =
          "Error checking email. Please try again.";
        emailResponseDiv.classList.add("text-danger");
      }
    } catch (error) {
      console.log(error);
      emailResponseDiv.textContent = "Network error. Please try again.";
      emailResponseDiv.classList.add("text-danger");
    }

    // Show the response message
    emailResponseDiv.style.display = "block";
  }
}

function validatePassword() {
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirm_password");
  const passwordErrorDiv = document.getElementById("passwordError");
  const registerUserBtn = document.getElementById("registerUserBtn");

  // Clear previous error message
  passwordErrorDiv.style.display = "none";
  passwordErrorDiv.textContent = "";

  // Check if passwords match
  if (confirmPasswordInput.value) {
    if (passwordInput.value !== confirmPasswordInput.value) {
      passwordErrorDiv.textContent = "Passwords do not match.";
      passwordErrorDiv.style.display = "block";
      registerUserBtn.disabled = true;
    } else {
      registerUserBtn.disabled = false;
    }
  }
}

function showPreview() {
  const form = document.getElementById("personalDetailsForm");
  const previewContent = document.getElementById("previewContent");
  const userPreview = document.getElementById("userPreview");

  // Clear previous preview content
  previewContent.innerHTML = "";

  // Collect form data
  const firstName = form.first_name.value;
  const surname = form.surname.value;
  const email = form.email.value;
  const phone = form.phone.value;
  const state = form.state.value;
  const lga = form.lga.value;
  const address = form.address.value;

  // Create preview items
  const previewItems = [
    { label: "First Name", value: firstName },
    { label: "Surname", value: surname },
    { label: "Email", value: email },
    { label: "Phone", value: phone },
    { label: "State", value: state },
    { label: "LGA", value: lga },
    { label: "Address", value: address },
  ];

  // Populate preview content
  previewItems.forEach((item) => {
    const preview = `
      <div class="preview-item flex justify-between items-center">
        <span class="preview-label text-gray-500 capitalize">${item.label}:</span>
        <span class="preview-value font-medium">${item.value}</span>
      </div>
    `;
  });

  // Show the preview section
  userPreview.style.display = "block";
}

showPreview();
