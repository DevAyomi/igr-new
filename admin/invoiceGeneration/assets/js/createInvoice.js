// JavaScript
const revenueHeadItems = [];

$(document).ready(function () {
  const $categorySection = $('select[name="category"]');

  $categorySection.on("change", function () {
    if ($(this).val() === "Individual") {
      // No
      $("#categ_container").html(`
        <div class="form-floating mb-2">
          <input type="text" class="form-control invInput" name="first_name" id="firstName"
            data-preview="First Name" required />
          <label for="firstName">First Name</label>
          <small class="text-danger d-none">This field is required.</small>
        </div>

        <!-- Surname -->
        <div class="form-floating mb-2">
          <input type="text" class="form-control invInput" name="surname" id="surname" data-preview="Surname"
            required />
          <label for="surname">Surname</label>
          <small class="text-danger d-none">This field is required.</small>
        </div>
      `);
    } else {
      // Yes
      $("#categ_container").html(`
        <div class="form-floating mb-2">
          <input type="text" class="form-control invInput" name="first_name" id="firstName"
            data-preview="First Name" required />
          <label for="firstName">Organization Name</label>
          <small class="text-danger d-none">This field is required.</small>
        </div>

        <!-- Surname -->
        <div class="form-floating mb-2 d-none">
          <input type="text" class="form-control invInput" name="surname" id="surname" data-preview="Surname" />
          <label for="surname">Surname</label>
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

  $.ajax({
    url: `${HOST}/get-revenue-head`,
    type: "GET",
    success: function (response) {
      if (response.status === "success") {
        // Get the revenue items data
        const revenueItems = response.data;

        revenueHeadItems.push(...revenueItems);

        // Reference to the select element
        const selectElement = $("#revenue_items");

        // Populate the select options
        revenueItems.forEach((item) => {
          const option = `<option value="${item.id}">${item.item_name} - (${item.category})</option>`;
          selectElement.append(option);
        });

        // Initialize or refresh the select2 plugin if needed
        $(".js-example-basic-multiple").select2();
      } else {
        alert("Failed to fetch revenue items.");
      }
    },
    error: function (xhr, status, error) {
      console.error("An error occurred: ", error);
      alert("Could not load revenue items.");
    },
  });
});

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

  if ($categorySection === "Individual") {
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

      <div class="form-floating mb-4">
        <select class="form-select revenue_item ${randomString}" id="revenue_items" required>
          <option value="" disabled selected>Select tax</option>
        </select>
        <label for="assessment">Assessment Item</label>
      </div>

      <div class="form-floating mb-4">
        <input type="number" class="form-control amount" id="amount" name="amount" required />
        <label for="amount">Amount To Be Paid*</label>
      </div>

    </div>  
  `);

  getassessmentCount();

  revenueHeadItems.forEach((item) => {
    $(`.${randomString}`).append(
      `<option value="${item.id}">${item.item_name} - (${item.category})</option>`
    );
  });
}

function removeItem(e) {
  e.parentElement.parentElement.remove();
  getassessmentCount();
}

function getassessmentCount() {
  let assessmentItems = document.querySelectorAll(".revItems");
  assessmentItems.forEach((item, i) => {
    item.querySelector(".numbering").textContent = i + 1;
  });
}

async function generateInvoice() {
  $("#genInvoice")
    .prop("disabled", true)
    .html('<i class="custom-spinner"></i> Generating...');

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
    url: `${HOST}/register-taxpayer`,
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
          url: `${HOST}/get-taxpayers?email=${$(
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
          `<p class="text-danger text-center mt-4 text-lg">${
            request.responseJSON.message
              ? request.responseJSON.message
              : "Invoice Generation Failed"
          }</p>`
        );
      }
    },
  });
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

  let assessmentItems = document.querySelectorAll(".revItems");
  assessmentItems.forEach((item, i) => {
    let revenue_head_id = item.querySelector(".revenue_item").value;
    let amount = item.querySelector(".amount").value;

    dataToSend.revenue_heads.push({
      revenue_head_id,
      amount,
    });
  });
  // console.log(dataToSend)

  $.ajax({
    type: "POST",
    url: `${HOST}/create-invoice`,
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
        `<p class="text-danger text-center mt-4 text-lg">${
          request.responseJSON.message
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
    paramUrl = `tin=${taxID}`;
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
    const response = await fetch(`${HOST}/get-taxpayers?${paramUrl}`);
    const result = await response.json();
    $("#submitFetch").prop("disabled", false).html("Continue");
    // console.log(result);

    if (result.status === "success" && result.data.length > 0) {
      let payInputs = document.querySelectorAll(".invInput");

      if (result.data[0].category === "Individual") {
        $(`#categ_container`).html(`
          <div class="form-floating mb-2">
            <input type="text" class="form-control invInput" name="first_name" data-preview="First Name" id="firstName" required />
            <label for="firstName">First Name</label>
          </div>

          <!-- Surname -->
          <div class="form-floating mb-2">
            <input type="text" class="form-control invInput" name="surname" data-preview="Surname" id="surname" required />
            <label for="surname">Surname</label>
          </div>
        `);
      } else {
        $(`#categ_container`).html(`
          <div class="form-floating mb-2">
            <input type="text" class="form-control invInput" name="first_name" data-preview="Organization Name" id="firstName" required />
            <label for="firstName">Organization Name</label>
          </div>

          <!-- Surname -->
          <div class="form-floating mb-2 d-none">
            <input type="text" class="form-control invInput" name="surname" data-preview="Surname" id="surname" />
            <label for="surname">Surname</label>
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
      Swal.fire({
        title: "User Not Found",
        text: "No Information found with the provided data",
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
