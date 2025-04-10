// JavaScript
const revenueHeadItems = [];
let userItem = null;

const $categorySection = $('select[name="category"]');

$categorySection.on("change", function () {
  if ($(this).val() == "Individual") {
    // No
    $("#categ_container").html(`
        <div class="form-floating mb-2">
          <input type="text" class="form-control invInput" name="first_name" id="firstName"
            data-preview="First Name" required />
          <label for="firstName">First Name <span class="text-danger">*</span></label>
          <small class="text-danger d-none">This field is required.</small>
        </div>

        <!-- Surname -->
        <div class="form-floating mb-2">
          <input type="text" class="form-control invInput" name="surname" id="surname" data-preview="Surname"
            required />
          <label for="surname">Surname <span class="text-danger">*</span></label>
          <small class="text-danger d-none">This field is required.</small>
        </div>
      `);
  } else {
    // Yes
    $("#categ_container").html(`
        <div class="form-floating mb-2">
          <input type="text" class="form-control invInput" name="first_name" id="firstName"
            data-preview="First Name" required />
          <label for="firstName">Organization Name <span class="text-danger">*</span></label>
          <small class="text-danger d-none">This field is required.</small>
        </div>

        <!-- Surname -->
        <div class="form-floating mb-2 d-none">
          <input type="text" class="form-control invInput" name="surname" id="surname" data-preview="Surname" />
          <label for="surname">Surname <span class="text-danger">*</span></label>
        </div>
 
      `);
  }
});

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

// Fetch MDA Data
function fetchMdaData(selector = ".mdas_item") {
  $.ajax({
    url: `${HOST}/noauth-get-mdas`,
    type: "GET",
    success: function (response) {
      if (response.status === "success") {
        const mdaItems = response.data.mdas;

        // Populate MDA dropdowns
        $(selector).each(function () {
          const selectElement = $(this);
          if (selectElement.find("option").length <= 1) {
            // Only populate if the dropdown is empty (except for the default option)
            selectElement.empty();
            selectElement.append(
              '<option value="" disabled selected>Select mda</option>'
            );
            mdaItems.forEach((item) => {
              selectElement.append(
                `<option value="${item.id}">${item.fullname}</option>`
              );
            });
          }
        });

        // Add event listener for MDA change (for all MDA dropdowns, including the initial one)
        $(selector).on("change", function () {
          const mdaId = $(this).val();
          const revenueItemElement = $(this)
            .closest(".revItems")
            .find(".revenue_item");
          fetchRevenueHeadData(mdaId, revenueItemElement);
        });
      } else {
        alert("Failed to fetch MDAs.");
      }
    },
    error: function (xhr, status, error) {
      console.error("An error occurred: ", error);
      alert("Could not load MDA items.");
    },
  });
}

// Fetch Revenue Head Data
function fetchRevenueHeadData(mdaId, revenueItemElement) {
  $.ajax({
    url: `${HOST}/noauth-get-revenue-head?mda_id=${mdaId}`,
    type: "GET",
    success: function (response) {
      if (response.status === "success") {
        const revenueItems = response.data;

        // Clear existing options
        revenueItemElement.empty();
        revenueItemElement.append(
          '<option value="" disabled selected>Select tax</option>'
        );

        // Populate Revenue Head dropdown
        revenueItems.forEach((item) => {
          revenueItemElement.append(
            `<option data-mdaid="${item.mda_id}" value="${item.id}">${item.item_name} - (${item.category})</option>`
          );
        });
      } else {
        alert("Failed to fetch revenue items.");
      }
    },
    error: function (xhr, status, error) {
      console.error("An error occurred: ", error);
      alert("Could not load revenue items.");
    },
  });
}

// Add Revenue Item
function addRevenueItem() {
  const randomString = Math.random().toString(36).substring(7);

  $("#moreRevItems").append(`
    <div class="revItems mb-4">
      <div class="flex justify-between items-center mb-2">
        <p class="mb-2 assItem">Assessment Item <span class='numbering'></span></p>
        <button class="btn-sm bg-red-100 p-2 rounded-lg" onclick="removeItem(this)">
          <span class="text-red-600 text-sm">Remove Item</span>
        </button>
      </div>

      <!-- MDA Dropdown -->
      <div class="form-floating mb-4">
        <select class="form-select mdas_item mdas_item_${randomString}" required>
          <option value="" disabled selected>Select mda</option>
        </select>
        <label for="mdas">Select Mda <span class="text-danger">*</span></label>
      </div>

      <!-- Revenue Head Dropdown -->
      <div class="form-floating mb-4">
        <select class="form-select revenue_item revenue_item_${randomString}" required>
          <option value="" disabled selected>Select tax</option>
        </select>
        <label for="assessment">Assessment Item <span class="text-danger">*</span></label>
      </div>

      <!-- Amount Input -->
      <div class="form-floating mb-4">
        <input type="number" class="form-control amount" required />
        <label for="amount">Amount To Be Paid <span class="text-danger">*</span></label>
      </div>
    </div>
  `);

  // Fetch and populate MDA data for the new item only
  fetchMdaData(`.mdas_item_${randomString}`);

  // Add event listener for MDA change
  $(`.mdas_item_${randomString}`).on("change", function () {
    const mdaId = $(this).val();
    const revenueItemElement = $(this)
      .closest(".revItems")
      .find(`.revenue_item_${randomString}`);
    fetchRevenueHeadData(mdaId, revenueItemElement);
  });

  // Update assessment item numbering
  getassessmentCount();
}

// Remove Revenue Item
function removeItem(e) {
  $(e).closest(".revItems").remove();
  getassessmentCount();
}

// Update Assessment Item Numbering
function getassessmentCount() {
  $(".revItems").each(function (index) {
    $(this)
      .find(".numbering")
      .text(index + 1);
  });
}

// Initial Fetch of MDA Data
fetchMdaData();

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
  const phonePattern = /^\d+$/;
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

function fillManually(num) {
  let payInputs = document.querySelectorAll(".invInput");
  payInputs.forEach((inputt, i) => {
    inputt.value = "";
  });
  nextPrev(num);
}

function confirmContinue() {
  const inputs = document.querySelectorAll(".invInput");
  let isValid = true;

  inputs.forEach((input) => {
    const errorMessage = input.nextElementSibling;

    if (input.required && input.value.trim() === "") {
      isValid = false;

      input.style.border = "1px solid red";
      // if (errorMessage && errorMessage.tagName === 'SMALL') {
      //   errorMessage.classList.remove('d-none');
      //   errorMessage.textContent = "This field is required.";
      // }

      if (isValid) input.focus();
    } else {
      input.style.border = "";
      // if (errorMessage && errorMessage.tagName === 'SMALL') {
      //   errorMessage.classList.add('d-none');
      // }
    }
  });

  if (isValid) {
    nextPrev(1);
  }
}
function previewInfo() {
  const $categorySection = $('select[name="category"]').val();

  if ($categorySection == "Individual") {
    // No
    $("#categ_container2").html(`
        <div class="wizard-form-input">
          <label>First Name</label>
          <input type="text" name="first_name" class="invInput2" readonly />
        </div>
        <div class="wizard-form-input">
          <label>Surname</label>
          <input type="text" name="surname" class="invInput2" readonly />
        </div>
      `);
  } else {
    // Yes
    $("#categ_container2").html(`
        <div class="wizard-form-input">
          <label>Organization Name</label>
          <input type="text" name="first_name" class="invInput2" readonly />
        </div>
        <div class="wizard-form-input d-none">
          <label>Surname</label>
          <input type="text" name="surname" class="invInput2" readonly />
        </div>
      `);
  }

  let payInputs = document.querySelectorAll(".invInput");

  payInputs.forEach((inputt, i) => {
    let theInputt = document.querySelector(`.invInput2[name='${inputt.name}']`);
    if (theInputt) {
      theInputt.value = inputt.value;
    }
  });
  $("#nextPreview").click();
}

// function addRevenueItem() {
//   const randomString = Math.random().toString(36).substring(7);

//   $("#moreRevItems").append(`
//     <div class="revItems mb-4">
//       <div class="flex justify-between items-center mb-2">
//         <p class="mb-2 assItem">Assessment Item <span class='numbering'></span></p>
//         <button class="btn-sm bg-red-100 p-2 rounded-lg" onclick="removeItem(this)">
//           <span class="text-red-600 text-sm">Remove Item</span>
//         </button>
//       </div>

//       <div class="form-floating mb-4">
//         <select class="form-select mdas_item ${randomString}" id="mdas" required>
//           <option value="" disabled selected>Select mda</option>
//         </select>
//         <label for="mdas">Select Mda</label>
//       </div>
//       <div class="form-floating mb-4">
//         <select class="form-select revenue_item ${randomString}" id="revenue_items" required>
//           <option value="" disabled selected>Select tax</option>
//         </select>
//         <label for="assessment">Assessment Item</label>
//       </div>

//       <div class="form-floating mb-4">
//         <input type="number" class="form-control amount" id="amount" name="amount" required />
//         <label for="amount">Amount To Be Paid*</label>
//       </div>

//     </div>
//   `);

//   getassessmentCount();

//   revenueHeadItems.forEach((item) => {
//     $(`.${randomString}`).append(
//       `<option data-mdaid="${item.mda_id}" value="${item.id}">${item.item_name} - (${item.category})</option>`
//     );
//   });
// }

// function removeItem(e) {
//   e.parentElement.parentElement.remove();
//   getassessmentCount();
// }

// function getassessmentCount() {
//   let assessmentItems = document.querySelectorAll(".revItems");
//   assessmentItems.forEach((item, i) => {
//     item.querySelector(".numbering").textContent = i + 1;
//   });
// }

function checkAmountFirst() {
  let theWholeAmount = 0
  let assessmentItems = document.querySelectorAll(".revItems");

  assessmentItems.forEach((item) => {
    const amountInput = item.querySelector(".amount");

    // Ensure the revenue item and amount are selected/entered
    if (amountInput.value) {
      theWholeAmount += parseFloat(amountInput.value)
    }
  });

  if (theWholeAmount >= 100000000) {
    Swal.fire({
      html: `
        <div class="bg-gray-50 rounded-lg py-3 px-4 border-l-4 border-amber-500 mb-2">
          <p class="text-gray-700 font-medium">Amount:</p>
          <p class="text-2xl font-bold text-gray-800">₦ ${theWholeAmount.toLocaleString()}</p>
        </div>
        
        <!-- Amount in Words -->
        <div class="bg-gray-50 rounded-lg py-3 px-4 border-l-4 border-blue-500">
          <p class="text-gray-700 font-medium">Amount in words:</p>
          <p class="text-sm font-base text-gray-700 italic">
          ${numberToWordsWithNairaKobo(theWholeAmount)} Only
          </p>
        </div>
        
        <!-- Confirmation Question -->
        <div class="mt-4 pt-3 border-t border-gray-200">
          <p class="text-base">You are about to generate an invoice with a large amount.</p>
          <p class="text-md font-semibold text-gray-700">
            Are you sure you want to proceed?
          </p>
        </div>
      `,

      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#17A349",
      cancelButtonColor: "#F49E0B",
      cancelButtonText: "Review Amount",
      confirmButtonText: "Proceed",
    }).then((result) => {
      if (result.isConfirmed) {
        generateInvoice()
      }
    });
  } else {
    generateInvoice()
  }
}

async function generateInvoice() {
  $("#genInvoice")
    .prop("disabled", true)
    .html('<i class="custom-spinner"></i> Generating...');

  if (userItem) {
    generateTheInvoice(userItem?.tax_number);
  } else {
    const allInputs = document.querySelectorAll(".invInput");

    let $selected_category = $('select[name="category"]').val();

    let obj = {
      verification_status: 1,
      tin_status: 1,
      surname: "",
      category: $selected_category,
      password: "password",
      created_by: "self",
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
        // console.log(data)

        if (data.status === "success") {
          // console.log("Registration successful:", data)

          generateTheInvoice(data.tax_number);
        } else {
          $("#msg_box").html(
            `<p class="text-warning text-center mt-4 text-lg">${data.message}</p>`
          );
        }
      },
      error: function (request, error) {
        if (
          request.responseJSON.message ===
          "Taxpayer with this email or phone number already exists"
        ) {
          $.ajax({
            type: "GET",
            url: `${HOST}/noauth-get-taxpayers?email=${$(
              '.invInput[name="email"]'
            ).val()}`,
            // data: JSON.stringify(dataToSend),
            dataType: "json",
            success: function (data) {
              generateTheInvoice(data.data[0].tax_number);
            },
            error: function (request, error) {
              $("#genInvoice")
                .prop("disabled", false)
                .html(`Generate Invoice <i class="fa fa-arrow-right">`);

              $("#msg_box").html(
                `<p class="text-danger text-center mt-4 text-lg">Invoice Generation Failed</p>`
              );
              console.log(request);
            },
          });
        } else {
          $("#genInvoice")
            .prop("disabled", false)
            .html(`Generate Invoice <i class="fa fa-arrow-right">`);
          $("#msg_box").html(
            `<p class="text-danger text-center mt-4 text-lg">${request.responseJSON.message
              ? request.responseJSON.message
              : "Invoice Generation Failed"
            }</p>`
          );
        }
      },
    });
  }
}

async function generateTheInvoice(tax_numbber) {
  let dataToSend = {
    tax_number: tax_numbber,
    invoice_type: "direct",
    tax_office: "Lagos Tax Office",
    lga: "Ikeja",
    description: $(".description").val(),
    revenue_heads: [],
  };

  // Collect data from each revenue item
  let assessmentItems = document.querySelectorAll(".revItems");
  assessmentItems.forEach((item) => {
    const revenueItemSelect = item.querySelector(".revenue_item");
    const amountInput = item.querySelector(".amount");

    // Ensure the revenue item and amount are selected/entered
    if (revenueItemSelect.value && amountInput.value) {
      const selectedOption =
        revenueItemSelect.options[revenueItemSelect.selectedIndex];
      const mda_id = selectedOption.getAttribute("data-mdaid");
      const revenue_head_id = revenueItemSelect.value;
      const amount = amountInput.value;

      // Add the revenue head data to the payload
      dataToSend.revenue_heads.push({
        revenue_head_id,
        mda_id,
        amount,
      });
    }
  });
  console.log(dataToSend);

  $.ajax({
    type: "POST",
    url: `${HOST}/noauth-create-invoice`,
    data: JSON.stringify(dataToSend),
    dataType: "json",
    success: function (data) {
      $("#genInvoice")
        .prop("disabled", false)
        .html(`Generate Invoice <i class="fa fa-arrow-right">`);
      if (data.status === "success") {
        $("#previewInvoice").attr(
          "href",
          `./invoice.html?invoice_number=${data.invoice_number}`
        );
        nextPrev(4);
      } else {
        $("#msg_box").html(
          `<p class="text-warning text-center mt-4 text-lg">${data.message}</p>`
        );
      }
    },
    error: function (request, error) {
      $("#genInvoice")
        .prop("disabled", false)
        .html(`Generate Invoice <i class="fa fa-arrow-right">`);
      $("#msg_box").html(
        `<p class="text-danger text-center mt-4 text-lg">${request.responseJSON.message
          ? request.responseJSON.message
          : "Invoice Generation Failed"
        }</p>`
      );
      console.log(request.responseJSON);
    },
  });
}

function appendAndSelectOption(selectId, value, text) {
  const selectElement = $(`#${selectId}`);

  // Check if the option already exists
  if (selectElement.find(`option[value="${value}"]`).length === 0) {
    // Append the new option
    selectElement.append(new Option(text, value));
  }

  // Select the option
  selectElement.val(value).trigger("change"); // Trigger change event if needed
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

      if (result.data[0].category == "Individual") {
        $(`#categ_container`).html(`
          <div class="form-floating mb-2">
            <input type="text" class="form-control invInput" name="first_name" data-preview="First Name" id="firstName" required />
            <label for="firstName">First Name <span class="text-danger">*</span></label>
          </div>

          <!-- Surname -->
          <div class="form-floating mb-2">
            <input type="text" class="form-control invInput" name="surname" data-preview="Surname" id="surname" required />
            <label for="surname">Surname <span class="text-danger">*</span></label>
          </div>
        `);
      } else {
        $(`#categ_container`).html(`
          <div class="form-floating mb-2">
            <input type="text" class="form-control invInput" name="first_name" data-preview="Organization Name" id="firstName" required />
            <label for="firstName">Organization Name <span class="text-danger">*</span></label>
          </div>

          <!-- Surname -->
          <div class="form-floating mb-2 d-none">
            <input type="text" class="form-control invInput" name="surname" data-preview="Surname" id="surname" />
            <label for="surname">Surname <span class="text-danger">*</span></label>
          </div>

        `);
      }
      $("#userPreview").html("");
      payInputs.forEach((inputt, i) => {
        let theValuee = result.data[0][inputt.name];
        let theInputt = document.querySelector(
          `.invInput[name='${inputt.name}']`
        );
        if (theInputt && theValuee) {
          $("#userPreview").append(`
            <div class="preview-item flex justify-between items-center">
                <span class="preview-label text-gray-500 capitalize">${inputt.dataset.preview}:</span>
                <span class="preview-value font-medium">${theValuee}</span>
            </div>
          `);

          if (inputt.name === "lga") {
            appendAndSelectOption(
              "repSelectLGA",
              result.data[0]["lga"],
              result.data[0]["lga"]
            );
          } else {
            theInputt.value = theValuee;
          }
        }
      });
      nextPrev(1);
    } else {
      userItem = null;
      Swal.fire({
        title: "User Not Found",
        text: "No Information found with the provided data, please fill manually.",
        icon: "warning",
        confirmButtonColor: "#02A75A",
        confirmButtonText: "Fill Manually",
      }).then((result) => {
        fillManually(2);
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
      confirmButtonText: "Fill Manually",
    }).then((result) => {
      fillManually(2);
    });
  }
}
