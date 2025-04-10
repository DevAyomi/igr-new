//hide password//

// const passwordToggle = document.getElementById('password-toggle');
// const passwordIcon = document.getElementById('password-icon');
// const passwordInput = document.getElementById('password');

// const confirmPasswordToggle = document.getElementById('confirm-password-toggle');
// const confirmPasswordIcon = document.getElementById('confirm-password-icon');
// const confirmPasswordInput = document.getElementById('confirmPassword');

// const passwordFeedback = document.getElementById('password-feedback');
// const confirmPasswordFeedback = document.getElementById('confirm-password-feedback');

// passwordToggle.addEventListener('click', () => {
//   if (passwordInput.type === 'password') {
//     passwordInput.type = 'text';
//     passwordIcon.classList.remove('fa-eye');
//     passwordIcon.classList.add('fa-eye-slash');
//   } else {
//     passwordInput.type = 'password';
//     passwordIcon.classList.remove('fa-eye-slash');
//     passwordIcon.classList.add('fa-eye');
//   }
// });

// confirmPasswordToggle.addEventListener('click', () => {
//   if (confirmPasswordInput.type === 'password') {
//     confirmPasswordInput.type = 'text';
//     confirmPasswordIcon.classList.remove('fa-eye');
//     confirmPasswordIcon.classList.add('fa-eye-slash');
//   } else {
//     confirmPasswordInput.type = 'password';
//     confirmPasswordIcon.classList.remove('fa-eye-slash');
//     confirmPasswordIcon.classList.add('fa-eye');
//   }
// });

// passwordInput.addEventListener('input', () => {
//   if (passwordInput.value.length < 8) {
//     passwordFeedback.classList.add('d-block');
//     passwordInput.classList.add('is-invalid');
//   } else {
//     passwordFeedback.classList.remove('d-block');
//     passwordInput.classList.remove('is-invalid');
//   }
// });

// confirmPasswordInput.addEventListener('input', () => {
//   if (confirmPasswordInput.value !== passwordInput.value) {
//     confirmPasswordFeedback.classList.add('d-block');
//     confirmPasswordInput.classList.add('is-invalid');
//   } else {
//     confirmPasswordFeedback.classList.remove('d-block');
//     confirmPasswordInput.classList.remove('is-invalid');
//   }
// });

///end////

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

  // Validate email format
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    emailResponseDiv.textContent = "Please enter a valid email address.";
    emailResponseDiv.classList.add("text-danger");
    emailResponseDiv.style.display = "block";
    personalSubmitBtn.disabled = true;
    return;
  }

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
          checkFormValidity();
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

document.getElementById("phone").addEventListener("input", function (e) {
  this.value = this.value.replace(/\D/g, "");
});

async function checkPhoneExists() {
  const phoneInput = document.getElementById("phone");
  const personalSubmitBtn = document.getElementById("personalSubmitBtn");
  const phoneResponseDiv = document.getElementById("phoneResponse");
  const phone = phoneInput.value;

  // Clear previous response
  phoneResponseDiv.style.display = "none";
  phoneResponseDiv.textContent = "";

  // Validate phone number format (only digits)
  const phonePattern = /^\d{11}$/;
  if (!phonePattern.test(phone)) {
    phoneResponseDiv.textContent = "Please enter a valid phone number.";
    phoneResponseDiv.classList.add("text-danger");
    phoneResponseDiv.style.display = "block";
    personalSubmitBtn.disabled = true;
    return;
  }

  if (phone) {
    try {
      const response = await fetch(`${HOST}/noauth-get-taxpayers?phone=${phone}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const res = await response.json();
      const data = res.data;

      if (response.ok) {
        // Assuming the API returns a message indicating if the phone exists
        if (data.length > 0) {
          phoneResponseDiv.textContent =
            "This phone number is already registered.";
          phoneResponseDiv.classList.remove("text-success");
          phoneResponseDiv.classList.add("text-danger");
          personalSubmitBtn.disabled = true;
        } else {
          phoneResponseDiv.textContent = "";
          phoneResponseDiv.classList.remove("text-danger");
          checkFormValidity();
        }
      } else {
        phoneResponseDiv.textContent =
          "Error checking phone. Please try again.";
        phoneResponseDiv.classList.add("text-danger");
      }
    } catch (error) {
      console.log(error);
      phoneResponseDiv.textContent = "Network error. Please try again.";
      phoneResponseDiv.classList.add("text-danger");
    }

    // Show the response message
    phoneResponseDiv.style.display = "block";
  }
}

async function validateDigits() {
  const digitInput = document.querySelector(".idNumberCont input");
  const personalSubmitBtn = document.getElementById("personalSubmitBtn");
  const digitResponseDiv = document.getElementById("digitResponse");
  const digit = digitInput.value;

  // Clear previous response
  digitResponseDiv.style.display = "none";
  digitResponseDiv.textContent = "";

  personalSubmitBtn.disabled = false;
  // Validate phone number format (only digits)
  const digitPattern = /^\d{11}$/;
  if (!digitPattern.test(digit)) {
    digitResponseDiv.textContent = "Please enter a valid ID number upto 11 digits.";
    digitResponseDiv.classList.add("text-danger");
    digitResponseDiv.style.display = "block";
    personalSubmitBtn.disabled = true;
    return;
  }
}

function checkFormValidity() {
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");
  const personalSubmitBtn = document.getElementById("personalSubmitBtn");

  if (emailInput.value && phoneInput.value) {
    personalSubmitBtn.disabled = false;
  } else {
    personalSubmitBtn.disabled = true;
  }
}

// function validatePassword() {
//   const passwordInput = document.getElementById("password");
//   const confirmPasswordInput = document.getElementById("confirm_password");
//   const passwordErrorDiv = document.getElementById("passwordError");
//   const registerUserBtn = document.getElementById("registerUserBtn");

//   // Clear previous error message
//   passwordErrorDiv.style.display = "none";
//   passwordErrorDiv.textContent = "";

//   // Check if passwords match
//   if (confirmPasswordInput.value) {
//     if (passwordInput.value !== confirmPasswordInput.value) {
//       passwordErrorDiv.textContent = "Passwords do not match.";
//       passwordErrorDiv.style.display = "block";
//       registerUserBtn.disabled = true;
//     } else {
//       registerUserBtn.disabled = false;
//     }
//   }
// }

function validatePassword() {
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirm_password");
  const passwordErrorDiv = document.getElementById("passwordError");
  const registerUserBtn = document.getElementById("registerUserBtn");

  // Get checklist items
  const lengthCheck = document.getElementById("lengthCheck");
  const uppercaseCheck = document.getElementById("uppercaseCheck");
  const lowercaseCheck = document.getElementById("lowercaseCheck");
  const numberCheck = document.getElementById("numberCheck");
  const specialCharCheck = document.getElementById("specialCharCheck");
  const matchCheck = document.getElementById("matchCheck");

  // Password validation pattern
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;

  // Validation checks
  const isLongEnough = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[@$!%*?&]/.test(password);
  const passwordsMatch = confirmPassword ? password === confirmPassword : false;

  // Update checklist UI
  updateChecklistItem(lengthCheck, isLongEnough);
  updateChecklistItem(uppercaseCheck, hasUppercase);
  updateChecklistItem(lowercaseCheck, hasLowercase);
  updateChecklistItem(numberCheck, hasNumber);
  updateChecklistItem(specialCharCheck, hasSpecialChar);
  updateChecklistItem(matchCheck, passwordsMatch);

  // Enable register button if all conditions are met
  registerUserBtn.disabled = !(isLongEnough && hasUppercase && hasLowercase && hasNumber && hasSpecialChar && passwordsMatch);
}

function updateChecklistItem(element, isValid) {
  if (isValid) {
    element.style.color = "green";
    element.innerHTML = "✔ " + element.dataset.text;
  } else {
    element.style.color = "red";
    element.innerHTML = "✘ " + element.dataset.text;
  }
}


let pageUrl = new URL(window.location.href);
let createdby = pageUrl.searchParams.get("createdby");
let created_by_id = pageUrl.searchParams.get("created_by_id");

let businessFormTab = `
<div class="sm:flex lg:mx-auto max-w-6xl lg:gap-10 my-8">
              <div class="w-full sm:w-1.4/3 hidden sm:block">
                <h1 class="text-xl lg:text-5xl font-bold mb-4">
                  Taxpayer Registration
                </h1>
                <p class="text-gray-600 mb-8">
                  Register to manage your taxes, access financial services, and
                  streamline your business operations.
                </p>
                <div class="flex flex-col">
                  <div class="flex items-start mb-2">
                    <div
                      class="step-circle completed flex items-center justify-center"
                    >
                      <svg
                        class="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                    </div>
                    <span class="ml-4 font-semibold hidden sm:block"
                      >User Category</span
                    >
                  </div>
                  <div class="step-line step-active"></div>

                  <div class="flex items-start mb-2">
                    <div
                      class="step-circle completed flex items-center justify-center"
                    >
                      <svg
                        class="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                    </div>
                    <span class="ml-4 font-semibold hidden sm:block"
                      >Personal details</span
                    >
                  </div>
                  <div class="step-line step-active"></div>

                  <div class="flex items-start mb-2">
                    <div class="step-circle active"></div>
                    <span class="ml-4 font-semibold hidden sm:block"
                      >Business Information</span
                    >
                  </div>
                  <div class="step-line"></div>

                  <div class="flex items-start">
                    <div class="step-circle"></div>
                    <span class="ml-4 font-semibold hidden sm:block"
                      >Set Password</span
                    >
                  </div>
                  <div class="step-line"></div>

                  <div class="flex items-start">
                    <div class="step-circle"></div>
                    <span class="ml-4 font-semibold hidden sm:block"
                      >Account Creation</span
                    >
                  </div>
                </div>
              </div>

              <div
                class="bg-white w-full p-4 lg:p-10 sm:max-w-xl lg:rounded-2xl"
              >
                <div class="block sm:hidden">
                  <div class="flex items-center justify-between">
                    <div class="cursor-pointer">
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 32 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M21.5607 26.0607C20.9749 26.6464 20.0251 26.6464 19.4393 26.0607L10.4393 17.0607C9.85355 16.4749 9.85355 15.5251 10.4393 14.9393L19.4393 5.93934C20.0251 5.35355 20.9749 5.35355 21.5607 5.93934C22.1464 6.52513 22.1464 7.47487 21.5607 8.06066L13.6213 16L21.5607 23.9393C22.1464 24.5251 22.1464 25.4749 21.5607 26.0607Z"
                          fill="#02a75a"
                        ></path>
                      </svg>
                    </div>
                    <!---->
                  </div>
                  <div class="py-[22px]">
                    <svg
                      width="100%"
                      height="3"
                      viewBox="0 0 100 3"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect width="100%" height="3" fill="#DBE7FD"></rect>
                      <rect width="390" height="3" fill="#02a75a"></rect>
                    </svg>
                  </div>
                  <!---->
                </div>

                <button
                  class="flex gap-1 items-center text-[#17A349]"
                  onclick="nextPrev(-1)"
                >
                  <iconify-icon icon="eva:arrow-back-outline"></iconify-icon>
                  <span>Go Back</span>
                </button>
                <h2 class="text-xl font-semibold mb-2">Business Information</h2>
                <p class="text-gray-600 mb-4">
                  Fill out your Business Information
                </p>

                <form id="businessInfoForm" class="space-y-6">
                  
                      <div class="form-floating my-4">
                        <select
                          class="form-select regInputs"
                          required
                          name="business_own"
                          id="business_own"
                        >
                          <option value="" disabled selected>Select</option>

                          <option value="1">Yes</option>

                          <option value="2">No</option>
                        </select>
                        <label for="business_own">Are you a business owner? <span class="text-danger">*</span></label>
                      </div>
                  <div id="business_section" class="mt-4"></div>

                  <!-- Submit Button -->
                  <button
                    type="button"
                    onclick="validateAndProceed('businessInfoForm', () => { nextPrev(1); })"
                    class="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-500 transition"
                  >
                    Confirm & Continue
                  </button>
                </form>
              </div>
            </div>
`;

let repFormTab = `
 <div
              class="sm:flex lg:mx-auto max-w-6xl lg:gap-10 my-8"
            >
              <div class="w-full sm:w-1.4/3 hidden sm:block">
                <h1 class="text-xl lg:text-5xl font-bold mb-4">
                  Taxpayer Registration
                </h1>
                <p class="text-gray-600 mb-8">
                  Register to manage your taxes, access financial services, and
                  streamline your business operations.
                </p>
                <div class="flex flex-col">
                  <div class="flex items-start mb-2">
                    <div
                      class="step-circle completed flex items-center justify-center"
                    >
                      <svg
                        class="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                    </div>
                    <span class="ml-4 font-semibold hidden sm:block"
                      >User Category</span
                    >
                  </div>
                  <div class="step-line step-active"></div>

                  <div class="flex items-start mb-2">
                    <div class="step-circle active"></div>
                    <span class="ml-4 font-semibold hidden sm:block"
                      ><span class="bizCat"></span> details</span
                    >
                  </div>
                  <div class="step-line"></div>

                  <div class="flex items-start mb-2">
                    <div class="step-circle"></div>
                    <span class="ml-4 font-semibold hidden sm:block"
                      >Business Information</span
                    >
                  </div>
                  <div class="step-line"></div>

                  <div class="flex items-start">
                    <div class="step-circle"></div>
                    <span class="ml-4 font-semibold hidden sm:block"
                      >Set Password</span
                    >
                  </div>
                  <div class="step-line"></div>

                  <div class="flex items-start">
                    <div class="step-circle"></div>
                    <span class="ml-4 font-semibold hidden sm:block"
                      >Account Creation</span
                    >
                  </div>
                </div>
              </div>

              <div
                class="bg-white w-full p-4 lg:p-10 sm:max-w-xl lg:rounded-2xl"
              >
                <div class="block sm:hidden">
                  <div class="flex items-center justify-between">
                    <div class="cursor-pointer">
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 32 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M21.5607 26.0607C20.9749 26.6464 20.0251 26.6464 19.4393 26.0607L10.4393 17.0607C9.85355 16.4749 9.85355 15.5251 10.4393 14.9393L19.4393 5.93934C20.0251 5.35355 20.9749 5.35355 21.5607 5.93934C22.1464 6.52513 22.1464 7.47487 21.5607 8.06066L13.6213 16L21.5607 23.9393C22.1464 24.5251 22.1464 25.4749 21.5607 26.0607Z"
                          fill="#02a75a"
                        ></path>
                      </svg>
                    </div>
                    <!---->
                  </div>
                  <div class="py-[22px]">
                    <svg
                      width="100%"
                      height="3"
                      viewBox="0 0 100 3"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect width="100%" height="3" fill="#DBE7FD"></rect>
                      <rect width="260" height="3" fill="#02a75a"></rect>
                    </svg>
                  </div>
                  <!---->
                </div>

                <button
                  class="flex gap-1 items-center text-[#17A349]"
                  onclick="nextPrev(-1)"
                >
                  <iconify-icon icon="eva:arrow-back-outline"></iconify-icon>
                  <span>Go Back</span>
                </button>
                <h2 class="text-xl font-semibold mb-2">
                  Representative details
                </h2>
                <p class="text-gray-600 mb-4">
                  Fill out your Representative details
                </p>

                <form
                  class="space-y-6"
                  id="repDetailsForm"
                  onSubmit="return false;"
                >
                  <div class="form-floating mb-2">
                    <input
                      type="text"
                      class="form-control regInputs"
                      name="rep_firstname"
                      id="rep_firstname"
                      required
                    />
                    <label for="rep_firstname">First Name <span class="text-danger">*</span></label>
                  </div>

                  <!-- Surname -->
                  <div class="form-floating mb-2">
                    <input
                      type="text"
                      class="form-control regInputs"
                      name="rep_surname"
                      id="rep_surname"
                      required
                    />
                    <label for="rep_surname">Surname <span class="text-danger">*</span></label>
                  </div>

                  <!-- Email -->
                  <div class="form-floating mb-2">
                    <input
                      type="email"
                      class="form-control regInputs"
                      name="rep_email"
                      id="rep_email"
                      required
                    />
                    <label for="rep_email">Email <span class="text-danger">*</span></label>
                  </div>

                  <!-- Phone -->
                  <div class="form-floating mb-2">
                    <input
                      type="tel"
                      class="form-control regInputs phoneentered"
                      name="rep_phone"
                      id="rep_phone"
                      data-preview="Phone Number"
                      required
                    />
                    <label for="rep_phone">Phone <span class="text-danger">*</span></label>
                  </div>

                  <div class="form-floating my-4">
                    <select
                      class="form-select regInputs"
                      required
                      name="id_type"
                    >
                      <option value="" disabled selected>Select id type</option>

                      <option value="BVN">BVN</option>

                      <option value="National ID">NIN</option>
                    </select>

                    <label for="id_type">ID Type <span class="text-danger">*</span></label>
                  </div>
                  <div class="idNumberCont" class="mt-3"></div>
                  <div class="form-floating mb-4">
                    <input
                      type="text"
                      class="form-control regInputs"
                      name="tin"
                    />
                    <label for="tin">TIN (optional)</label>
                  </div>

                  <div class="form-floating">
                    <select
                      class="form-select regInputs"
                      name="rep_position"
                      data-preview="rep_position"
                      id="rep_position"
                      required
                    >
                      <option value="1">CEO</option>
                      <option value="2">Director</option>
                      <option value="3">MD</option>
                      <option value="4">Board Chairman</option>
                      <option value="5">Other please specify</option>
                    </select>
                    <label for="rep_position">Position <span class="text-danger">*</span></label>
                  </div>

                  <div id='rep_position_cont'></div>

                  <div class="grid grid-cols-1 lg:grid-cols-2 gap-2">
                    <!-- State -->
                    <div class="form-floating">
                      <select
                        class="form-select regInputs"
                        name="rep_state"
                        data-preview="rep_state"
                        id="rep_state"
                        required
                      >
                        <option value="" disabled selected>Select State</option>
                        <!-- States will be populated via JavaScript -->
                      </select>
                      <label for="rep_state">State <span class="text-danger">*</span></label>
                    </div>

                    <!-- LGA -->
                    <div class="form-floating">
                      <select
                        class="form-select regInputs"
                        name="rep_lga"
                        data-preview="rep_lga"
                        id="rep_lga"
                        required
                      >
                        <option value="" disabled selected>Select LGA</option>
                        <!-- LGAs will be populated based on selected state -->
                      </select>
                      <label for="rep_lga">LGA <span class="text-danger">*</span></label>
                    </div>
                  </div>

                  <!-- Address -->
                  <div class="form-floating mb-2">
                    <textarea
                      class="form-control regInputs"
                      name="address"
                      id="rep_address"
                      data-preview="Address"
                      required
                    ></textarea>
                    <label for="rep_address">Address <span class="text-danger">*</span></label>
                  </div>

                  <!-- Submit Button -->
                  <button
                    type="button"
                    class="w-full bg-green-600 disabled:bg-slate-300 text-white py-3 rounded-lg hover:bg-green-500 transition"
                    onclick="validateAndProceed('repDetailsForm', () => {nextPrev(1)})"
                  >
                    Confirm & Continue
                  </button>
                </form>
              </div>
            </div>
`;

$(document).ready(function () {
  $(".idVerify").hide();
  $('input[name="slector_categs"]').on("change", function () {
    // $("#decideTab").html(``);
    if ($(this).val() == "Individual") {
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
      $(".bizCat").text("Personal");
      $(".idVerify").show();
      $('select[name="id_type"]').prop("required", true);
      $("#decideTab").html(businessFormTab);
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
      // $(".idNumberCont").hide();

      idTypeOption.on("change", function () {
        if ($(this).val() === "") {
          // No
          $(".idNumberCont").html("");
        } else if ($(this).val() === "BVN") {
          $(".idNumberCont").html(`
        <div class="form-floating mb-4">
                  <input
                    type="text"
                    class="form-control regInputs"
                    onblur="validateDigits()"
                    name="bvn" placeholder="Input BVN Number"
                  />
                  <label for="idNumber">Input BVN Number <span class="text-danger">*</span></label>
                  <div id="digitResponse" class="text-danger mt-2" style="display: none"></div>
                </div>
      `);
        } else if ($(this).val() === "National ID") {
          $(".idNumberCont").html(`
         <div class="form-floating mb-4">
                  <input
                    type="text"
                    class="form-control regInputs"
                    onblur="validateDigits()"
                    name="nin" placeholder="Input NIN Number"
                  />
                  <label for="idNumber">Input NIN Number <span class="text-danger">*</span></label>
                  <div id="digitResponse" class="text-danger mt-2" style="display: none"></div>
                </div>
      `);
        }
      });
    } else {
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

            <div class="form-floating mb-2">
        <select name="industry" class="form-select regInputs" required>
            <option value="" selected>-Select industry-</option>
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
        <label for="industry">Industry <span class="text-danger">*</span></label>
    </div>

      `);
      $(".bizCat").text("Organization");
      $(".idVerify").hide();
      $('select[name="id_type"]').prop("required", false);
      $("#decideTab").html(repFormTab);

      $('#rep_position').on('change', function () {
        let valueO = $(this).val()
        console.log(valueO)
        if (valueO === "5") {
          $('#rep_position_cont').html(`
            <div class="form-floating mb-2">
              <input
                type="text"
                class="form-control regInputs"
                name="rep_position"
                id="specify"
                required
              />
              <label for="specify"></label>
            </div>
          `)
        } else {
          $('#rep_position_cont').html(``)
        }
      })

      // Populate states dropdown
      const selectedRepresentState = document.querySelector("#rep_state");
      if (selectedRepresentState) {
        // Assuming `STATES` is an array of state names
        selectedRepresentState.innerHTML = STATES;
        let selectedState = selectedRepState.value;
        const jigawaLGAs = getStateLGAs("Jigawa");

        // Add event listener for state change
        selectedRepresentState.addEventListener("change", function () {
          const selectedState = this.value; // Get the selected state
          populateLGAs(selectedState); // Populate LGAs for the selected state
        });
      }
      populateLGAs("Jigawa");
      const idTypeOption = $('select[name="id_type"]');
      // $(".idNumberCont").hide();

      idTypeOption.on("change", function () {
        if ($(this).val() === "") {
          // No
          $(".idNumberCont").html("");
        } else if ($(this).val() === "BVN") {
          $(".idNumberCont").html(`
        <div class="form-floating mb-4">
                  <input
                    type="text"
                    class="form-control regInputs"
                    name="bvn" placeholder="Input BVN Number"
                    onblur="validateDigits()"
                  />
                  <label for="idNumber">Input BVN Number <span class="text-danger">*</span></label>
                  <div id="digitResponse" class="text-danger mt-2" style="display: none"></div>
                </div>
      `);
        } else if ($(this).val() === "National ID") {
          $(".idNumberCont").html(`
         <div class="form-floating mb-4">
                  <input
                    type="text"
                    class="form-control regInputs"
                    name="nin" placeholder="Input NIN Number"
                    onblur="validateDigits()"
                  />
                  <label for="idNumber">Input NIN Number <span class="text-danger">*</span></label>
                  <div id="digitResponse" class="text-danger mt-2" style="display: none"></div>
                </div>
      `);
        }
      });
    }
  });

  let businessSection = `
  <div class="form-floating mb-2">
                  <input
                    type="text"
                    class="form-control regInputs"
                    name="business_name"
                    placeholder="Business Name*"
                    required
                  />
                  <label for="phone">Business Name <span class="text-danger">*</span></label>
                </div>

                <div class="form-floating mb-2">
                  <select
                    name="business_type"
                    class="form-select regInputs"
                    required
                  >
                    <option value="" selected>
                      -Select the type of the business-
                    </option>
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
                  <select
                    class="form-select regInputs"
                    name="number_of_staff"
                    required
                  >
                    <option value=""></option>
                    <option value="1-9">1-9</option>
                    <option value="10-29">10-29</option>
                    <option value="30-50">30-50</option>
                  </select>
                  <label for="number_of_staff">No of Employees <span class="text-danger">*</span></label>
                </div>

                <div class="form-floating mb-2">
                  <select
                    name="annual_revenue"
                    class="form-select regInputs"
                    required
                  >
                    <option value=""></option>
                    <option value="1-100,000">1-100,000</option>
                    <option value="100,001 - 499,999">100,001 - 499,999</option>
                    <option value="500,000 and above">500,000 and above</option>
                  </select>
                  <label for="annual_revenue"
                    >Annual Revenue Return In Naira <span class="text-danger">*</span></label
                  >
                </div>

                <div class="form-floating mb-2">
                  <select
                    class="form-select regInputs"
                    name="value_business"
                    required
                  >
                    <option value=""></option>
                    <option value="1 - 500,000">1 - 500,000</option>
                    <option value="500,001 - 999,999">500,001 - 999,999</option>
                    <option value="1,000,000 and above">
                      1,000,000 and above
                    </option>
                  </select>
                  <label for="value_business"
                    >Value of business/assets In naira <span class="text-danger">*</span></label
                  >
                </div>
  `;
});

// Function to handle ID type change
function changeIdType() {
  const selectedIdType = $('input[name="id_type"]:checked').val();

  if (selectedIdType === "BVN") {
    $(".idNumberCont").html(`
      <div class="form-floating mb-4">
        <input
          type="text"
          class="form-control regInputs"
          onblur="validateDigits()"
          name="bvn"
          placeholder="Input BVN Number"
          required
        />
        <label for="idNumber">Input BVN Number <span class="text-danger">*</span></label>
        <div id="digitResponse" class="text-danger mt-2" style="display: none"></div>
      </div>
    `);
  } else if (selectedIdType === "National ID") {
    $(".idNumberCont").html(`
      <div class="form-floating mb-4">
        <input
          type="text"
          class="form-control regInputs"
          onblur="validateDigits()"
          name="nin"
          placeholder="Input NIN Number"
          required
        />
        <label for="idNumber">Input NIN Number <span class="text-danger">*</span></label>
        <div id="digitResponse" class="text-danger mt-2" style="display: none"></div>
      </div>
    `);
  } else {
    // Clear the container if no ID type is selected
    $(".idNumberCont").html("");
  }
}

async function registerUser() {
  try {
    $("#registerUserBtn")
      .prop("disabled", true)
      .html('<span class="custom-spinner"></span> Registering...');
    $("#msg_box").html(loaderHTML);

    const allInputs = document.querySelectorAll(".regInputs");

    let selected_category = $('input[name="slector_categs"]:checked').val();

    // Check for selected ID type (can be multiple, so check index 1 if index 0 is null)
    const selectedIdType =
      $('select[name="id_type"]').eq(0).val() ||
      $('select[name="id_type"]').eq(1).val();

    let idNumber = "";

    if (selectedIdType === "BVN") {
      // Get the value of the first non-empty BVN input
      idNumber = $('input[name="bvn"]')
        .filter((index, input) => $(input).val().trim() !== "")
        .eq(0)
        .val();
    } else if (selectedIdType === "National ID") {
      // Get the value of the first non-empty NIN input
      idNumber = $('input[name="nin"]')
        .filter((index, input) => $(input).val().trim() !== "")
        .eq(0)
        .val();
    }

    console.log("Selected ID Type:", selectedIdType);
    console.log("ID Number:", idNumber);

    let obj = {
      verification_status: 1,
      tin_status: 1,
      surname: "",
      category: selected_category,
      created_by: createdby ? createdby : "self",
      created_by_id: created_by_id ? created_by_id : null,
      tax_category:
        selected_category === "Individual" ? "formal" : "presumptive",
      id_number: idNumber,
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

          let emailentered = $(".emailentered").val();
          let phonenumber = $(".phoneentered").val();

          $("#verifyNowBtn").attr(
            "href",
            `./verification.html?email=${emailentered}&phone=${phonenumber}&tax_id=${data.tax_number}`
          );

          if (createdby === "admin") {
            $("#verifyBtns").html(
              `<a href="../admin/taxpayer.html" 
                  id="verifyNowBtn"
                  class="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-500 transition text-center"
                  >Go To Taxpayer</a
                >`
            );
          } else if (createdby === "enumerator") {
            $("#verifyBtns").html(
              `<a href="../enumerator/taxpayer.html" 
                  id="verifyNowBtn"
                  class="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-500 transition text-center"
                  >Go To Taxpayer</a>`
            );
          } else {
            $("#verifyBtns").html(`     
              <a
                  href="../index.html"
                  class="w-full bg-slate-600 text-white py-3 rounded-lg hover:bg-slate-500 transition text-center"
                  >Verify Later</a
                >
                <a
                  href="verification.html?email=${emailentered}&phone=${phonenumber}&tax_id=${data.tax_number}"
                  id="verifyNowBtn"
                  class="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-500 transition text-center"
                  >Verify Now</a
                >
            `);
          }
          nextPrev(1);
          $("#theNextAfterClick").click();
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

// Function to get LGAs for a selected state
function getStateLGAs(state) {
  return lgaList[state] || []; // Return LGAs for the state or an empty array if not found
}

// Function to populate the LGA dropdown based on the selected state
function populateLGAs(selectedState) {
  const selectedRepresentLGA = document.querySelector("#rep_lga");
  if (selectedRepresentLGA) {
    const lgas = getStateLGAs(selectedState); // Get LGAs for the selected state
    selectedRepresentLGA.innerHTML =
      '<option value="" disabled selected>Select LGA</option>'; // Reset LGA dropdown

    // Populate LGAs
    lgas.forEach((lga) => {
      selectedRepresentLGA.innerHTML += `
        <option value="${lga}">${lga}</option>
      `;
    });
  }
}
