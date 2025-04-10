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

let pageUrl = new URL(window.location.href);
let createdby = pageUrl.searchParams.get("createdby");

$(document).ready(function () {
  $('input[name="slector_categs"]').on("change", function () {
    if ($(this).val() === "Individual") {
      $("#firstSurname").html(`
           <div class="form-floating mb-2">
                      <input
                        type="text"
                        class="form-control regInputs"
                        name="first_name"
                        id="firstName"
                        required
                      />
                      <label for="firstName">First Name <span class="text-danger">*</span></label>
                    </div>
  
                    <!-- Surname -->
                    <div class="form-floating mb-2">
                      <input
                        type="text"
                        class="form-control regInputs"
                        name="surname"
                        id="surname"
                        data-preview="Surname"
                        required
                      />
                      <label for="surname">Surname <span class="text-danger">*</span></label>
                    </div>
        `);
    } else if ($(this).val() === "Corporate") {
      $("#firstSurname").html(`
             <div class="form-floating mb-2">
                  <input
                      type="text"
                      class="form-control regInputs"
                      name="first_name"
                      required
                  />
                  <label>Name Of Organization <span class="text-danger">*</span></label>
              </div>
  
        `);
    }
  });

  let businessSection = `
      <div class="form-floating mb-2">
          <input type="text" class="form-control regInputs" name="phone" placeholder="Business Name*" required>
          <label for="phone">Business Name <span class="text-danger">*</span></label>
      </div>
  
      <div class="form-floating mb-2">
          <select name="business_type" class="form-select regInputs" required>
              <option value="" selected>-Select the type of the business-</option>
              <option value="Commercial">Commercial</option>
              <option value="Pool">Pool betting</option>
              <option value="Education">Education</option>
              <option value="Hospitality">Hospitality</option>
              <option value="Manufacturing">Manufacturing</option>
              <option value="Retail">Retail</option>
              <option value="Mining">Mining</option>
              <option value="Services">Services</option>
              <option value="Agriculture">Agriculture</option>
              <option value="Housing">Housing/real estate/lands</option>
              <option value="Transporting">Transporting</option>
              <option value="Legal">Legal</option>
              <option value="General">General</option>
          </select>
          <label for="business_type">Type Of Business <span class="text-danger">*</span></label>
      </div>
  
      <div class="form-floating mb-2">
          <select class="form-select regInputs" name="number_of_staff" required>
              <option value=""></option>
              <option value="1-9">1-9</option>
              <option value="10-29">10-29</option>
              <option value="30-50">30-50</option>
          </select>
          <label for="number_of_staff">No of Employees <span class="text-danger">*</span></label>
      </div>
  
      <div class="form-floating mb-2">
          <select name="annual_revenue" class="form-select regInputs" required>
              <option value=""></option>
              <option value="1-100,000">1-100,000</option>
              <option value="100,001 - 499,999">100,001 - 499,999</option>
              <option value="500,000 and above">500,000 and above</option>
          </select>
          <label for="annual_revenue">Annual Revenue Return In Naira <span class="text-danger">*</span></label>
      </div>
  
      <div class="form-floating mb-2">
          <select class="form-select regInputs" name="value_business" required>
              <option value=""></option>
              <option value="1 - 500,000">1 - 500,000</option>
              <option value="500,001 - 999,999">500,001 - 999,999</option>
              <option value="1,000,000 and above">1,000,000 and above</option>
          </select>
          <label for="value_business">Value of business/assets In naira <span class="text-danger">*</span></label>
      </div>
  `;

  const $businessOwnerDropdown = $('select[name="business_own"]');

  $businessOwnerDropdown.on("change", function () {
    if ($(this).val() === "2") {
      // No
      $("#business_section").html(``);
    } else {
      // Yes
      $("#business_section").html(businessSection);
    }
  });

  const idTypeOption = $('select[name="id_type"]');
  $(".idNumberCont").hide();

  idTypeOption.on("change", function () {
    if ($(this).val() === "") {
      // No
      $("#idNumberCont").html("");
    } else if ($(this).val() === "BVN") {
      $("#idNumberCont").html(`
          <div class="form-floating mb-4">
                    <input
                      type="text"
                      class="form-control regInputs"
                      name="bvn" placeholder="Input BVN Number"
                    />
                    <label for="idNumber">Input BVN Number <span class="text-danger">*</span></label>
                  </div>
        `);
    } else if ($(this).val() === "National ID") {
      $("#idNumberCont").html(`
           <div class="form-floating mb-4">
                    <input
                      type="text"
                      class="form-control regInputs"
                      name="nin" placeholder="Input NIN Number"
                    />
                    <label for="idNumber">Input NIN Number <span class="text-danger">*</span></label>
                  </div>
        `);
    }
  });
});

async function registerUser() {
  try {
    $("#registerUserBtn")
      .prop("disabled", true)
      .html('<span class="custom-spinner"></span> Submitting...');
    $("#msg_box").html(loaderHTML);

    const allInputs = document.querySelectorAll(".regInputs");

    let selected_category = $('input[name="slector_categs"]:checked').val();

    let obj = {
      verification_status: 1,
      tin_status: 1,
      surname: "",
      category: selected_category,
      password: "12345",
      created_by: createdby === "admin" ? "admin" : "self",
    };

    allInputs.forEach((allInput) => {
      if (allInput.name === "email") {
        obj[allInput.name] = allInput.value.trim();
      } else {
        obj[allInput.name] = allInput.value;
      }
    });

    $.ajax({
      type: "POST",
      url: `${HOST}/noauth-register-taxpayer`,
      data: JSON.stringify(obj),
      dataType: "json",
      success: function (data) {
        // console.log(data);
        $("#registerUserBtn").removeClass("d-none");

        if (data.status === "success") {
          // console.log("Registration successful:", data);

          $("#tax_payer_id").html(data.tax_number);

          nextPrev(1);
        } else {
          $("#msg_box").html(
            `<p class="text-warning text-center mt-4 text-lg">${data.message}</p>`
          );
        }
      },
      error: function (request, error) {
        $("#registerUserBtn").prop("disabled", false).text("Register");
        $("#msg_box").html(
          `<p class="text-danger text-center mt-4 text-lg">${request.responseJSON.message
            ? request.responseJSON.message
            : "Registration Failed"
          }</p>`
        );
        console.log(error);
      },
    });
  } catch (error) {
    console.log(error);
  }
}

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
      let payInputs = document.querySelectorAll(".invInput");

      userItem = result.data[0];
      $("#tax_payer_id").html(userItem.tax_number);
      $(".tinHeadingMsg").html("TIN Retrieved successfully!")
      $(".tinDescriptionMsg").html("Your Tax identification Number has been successfully retrieved. Below is your Taxpayer Identification Number (TIN).")
      nextPrev(5);
    } else {
      userItem = null;
      Swal.fire({
        title: "User Not Found",
        text: "No Information found with the provided data, please proceed.",
        icon: "warning",
        confirmButtonColor: "#02A75A",
        confirmButtonText: "Proceed",
      }).then((result) => {
        if (result.isConfirmed) {
          nextPrev(1);
        }
      });
    }
  } catch (error) {
    console.log(error);
    $("#submitFetch").prop("disabled", false).html("Continue");
    userItem = null;

    Swal.fire({
      text: "Failed to Fetch User Information",
      icon: "error",
      confirmButtonColor: "#02A75A",
      confirmButtonText: "Proceed",
    }).then((result) => {
      if (result.isConfirmed) {
        nextPrev(1);
      }
    });
  }
}