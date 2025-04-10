const publitio = new PublitioAPI(
  "b119y7fvv7B1SuXMlLqz",
  "f751fMs9Tr5f5vNm25gp6cAX9o23PleA"
); // Replace with your Publit.io credentials

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

// JavaScript
const revenueHeadItems = [];

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

  $.ajax({
    url: `${HOST}/noauth-get-revenue-head`,
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
          const option = `<option data-mdaid="${item.mda_id}" value="${item.id}">${item.item_name} - (${item.category})</option>`;
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
      console.log(input);
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

function addDocumentItem() {
  const randomString = Math.random().toString(36).substring(7);

  $("#moreDocumentItems").append(`
    <div class="documentItems">
      <div class="flex justify-between items-center mb-2">
        <p class="mb-2 assItem">Document <span class='numbering'></span></p>
        <button class="btn btn-sm bg-red-100 rounded-lg" onclick="removeDocumentItem(this)">
          <span class="text-red-600 text-sm">Remove Item</span>
        </button>
      </div>
      <div class="form-floating mb-3">
        <input type="text" class="form-control documentName" id="documentName" placeholder="Document Name" required />
        <label for="documentName">Document Name <span class="text-danger">*</span></label>
      </div>
      <div class="form-floating">
        <input type="file" class="form-control documentFile ${randomString}" id="documentFile" accept=".png, .pdf, .docx, .doc, .jpeg, .jpg" />
        <label for="documentFile">Document</label>
      </div>
      <p class="text-xs text-gray-600 mb-3">
        Allowed formats: (png, pdf, docx, doc, jpeg, jpg)Max size:
        10mb
      </p>
    </div> 
  `);

  getDocumentCount();
}

function removeDocumentItem(e) {
  e.parentElement.parentElement.remove();
  getDocumentCount();
}

function getDocumentCount() {
  let assessmentItems = document.querySelectorAll(".documentItems");
  assessmentItems.forEach((item, i) => {
    item.querySelector(".numbering").textContent = i + 1;
  });
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
          <option value="" disabled selected>Select tax <span class="text-danger">*</span></option>
        </select>
        <label for="assessment">Assessment Item</label>
      </div>

      <div class="form-floating mb-4">
        <input type="number" class="form-control amount" id="amount" name="amount" required />
        <label for="amount">Amount To Be Paid <span class="text-danger">*</span></label>
      </div>

    </div>  
  `);

  getassessmentCount();

  revenueHeadItems.forEach((item) => {
    $(`.${randomString}`).append(
      `<option data-mdaid="${item.mda_id}" value="${item.id}">${item.item_name} - (${item.category})</option>`
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

  const taxnumber = $("#taxNumber").val();

  generateTheInvoice(taxnumber);
}

async function generateTheInvoice(tax_numbber) {
  let dataToSend = {
    tax_number: tax_numbber,
    invoice_type: "tcc",
    tax_office: "Lagos Tax Office",
    lga: "Ikeja",
    description: `Annual Tax Payment`,
    revenue_heads: [],
  };

  let assessmentItems = document.querySelectorAll(".revItems");
  assessmentItems.forEach((item, i) => {
    let revenue_head_id = item.querySelector(".revenue_item").value;
    const selectedOption =
      item.querySelector(".revenue_item").options[
        item.querySelector(".revenue_item").selectedIndex
      ];
    let mda_id = selectedOption.getAttribute("data-mdaid");
    let amount = item.querySelector(".amount").value;

    dataToSend.revenue_heads.push({
      revenue_head_id,
      mda_id,
      amount,
    });
  });

  // console.log(dataToSend)

  $.ajax({
    type: "POST",
    url: `${HOST}/noauth-create-invoice`,
    data: JSON.stringify(dataToSend),
    dataType: "json",
    success: function (data) {
      $("#genInvoice").prop("disabled", false).html(`Generate Invoice`);
      if (data.status === "success") {
        submitTCCRegistration(data.invoice_number, tax_numbber);
        $("#previewInvoice").attr(
          "href",
          `../invoiceGeneration/invoice.html?invoice_number=${data.invoice_number}`
        );
      } else {
        $("#msg_box").html(
          `<p class="text-warning text-center mt-4 text-lg">${data.message}</p>`
        );
      }
    },
    error: function (request, error) {
      $("#genInvoice").prop("disabled", false).html(`Generate Invoice`);
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

    if (result.status === "success" && result.data.length > 0) {
      let payInputs = document.querySelectorAll(".invInput");
      console.log(result.data[0].tax_number);
      $("#taxNumber").val(result.data[0].tax_number);
      nextPrev(1);
    } else {
      Swal.fire({
        title: "User Not Found",
        text: "No Information found with the provided data, please fill manually.",
        icon: "warning",
        confirmButtonColor: "#02A75A",
        confirmButtonText: "Register",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "../register/index.html?redirect=etcc";
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
    });
  }
}

function submitTCCRegistration(invoice_number, tax_number) {
  $("#genInvoice")
    .prop("disabled", true)
    .html('<i class="custom-spinner"></i> Generating TCC...');
  $("#refNumber").html('<i class="custom-spinner"></i>');

  const payload = {
    taxpayer_id: tax_number,
    current_stage: "first_reviewer_approval",
    total_tax_paid: parseFloat(document.getElementById("taxPaid1").value),
    applicant_tin: document.getElementById("staffTIN").value,
    date_employed: document.getElementById("dateEmployed").value,
    invoice_number,
    occupation: document.getElementById("occupation").value,
    declaration_name: document.getElementById("declarationName")?.value || "",
    recommendation: document.getElementById("recommendation")?.value || "",
    category:
      document.getElementById("organizationType").value === "1"
        ? "private"
        : "public",
    reason: document.getElementById("reasonForTCC").value,
    secondary_information: [
      {
        tax_title: document.getElementById("fileNumber")?.value || "",
        amount_owed: parseFloat(document.getElementById("taxPaid1").value),
        exemption_type: getExemptionType(),
        husband_name: document.getElementById("husbandName")?.value || "",
        husband_address: document.getElementById("husbandAddress")?.value || "",
        institution_name:
          document.getElementById("institutionName")?.value || "",
        first_year_date: document.getElementById("year1").value,
        first_year_income: parseFloat(document.getElementById("income1").value),
        first_year_tax_amount: parseFloat(
          document.getElementById("taxPaid1").value
        ),
        second_year_date: document.getElementById("year2")?.value || "",
        second_year_income:
          parseFloat(document.getElementById("income2")?.value) || 0,
        second_year_tax_amount:
          parseFloat(document.getElementById("taxPaid2")?.value) || 0,
        third_year_date: document.getElementById("year3")?.value || "",
        third_year_income:
          parseFloat(document.getElementById("income3")?.value) || 0,
        third_year_tax_amount:
          parseFloat(document.getElementById("taxPaid3")?.value) || 0,
      },
    ],
    supporting_documents: [], // Will be filled after file upload
  };

  function getExemptionType() {
    if (document.getElementById("exemptYes").checked) {
      if (document.getElementById("housewifeYes").checked) return "housewife";
      if (document.getElementById("studentYes").checked) return "student";
    }
    return "None";
  }

  // Upload files to Publit.io
  async function uploadFiles() {
    const fileInputs = document.querySelectorAll('input[type="file"]');
    const uploadPromises = Array.from(fileInputs).map((input) => {
      if (input.files.length > 0) {
        const file = input.files[0];
        return publitio.uploadFile(file, "file").then((response) => {
          const documentNameElement = input
            .closest(".documentItems")
            ?.querySelector(".documentName");
          const documentName = documentNameElement
            ? documentNameElement.value
            : "Uploaded Document";
          return {
            document_name: documentName,
            document_url: response.url_preview, // Publit.io file URL
          };
        });
      }
      return null;
    });
    return Promise.all(uploadPromises.filter(Boolean));
  }

  uploadFiles()
    .then((uploadedDocuments) => {
      payload.supporting_documents = uploadedDocuments;

      // Save payload to localStorage
      // localStorage.setItem("tccRegistrationPayload", JSON.stringify(payload));

      console.log("Payload saved to localStorage:", payload);

      // Optionally send the request here
      $.ajax({
        url: `${HOST}/noauth-register-tcc`,
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(payload),
        success: function (data) {
          $("#genInvoice").prop("disabled", false).html(`Generate Invoice`);
          console.log("Success:", data);
          $("#refNumber").text(data.tcc_number);
          $("#previewInvoice").attr(
            "href",
            `../invoiceGeneration/invoice.html?invoice_number=${invoice_number}&ref_number=${data.tcc_number}`
          );
          nextPrev(1);
        },
        error: function (error) {
          console.error("Error:", error);
        },
      });
    })
    .catch((error) => {
      console.error("File upload error:", error);
    });
}
