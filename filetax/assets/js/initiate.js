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

const userInputs = {
  taxType: {
    taxType: document.getElementById("taxTypeSelect").value,
    whtAmount: document.getElementById("whtAmount")?.value,
    transactionType: document.getElementById("transaction_type")?.value,
    recipientType: document.getElementById("recipient_type")?.value,
    payeMonthlyIncome: document.getElementById("payeMonthlyIncome")?.value,
  },
  supportingDocuments: [],
};

const documentItems = document.querySelectorAll(".documentItems");
userInputs.supportingDocuments = Array.from(documentItems).map((item) => ({
  documentName: item.querySelector(".documentName").value,
  documentFile:
    item.querySelector(".documentFile").files[0]?.name || "No file uploaded",
}));

function generatePreview() {
  const previewSection = document.getElementById("previewSection");

  const userInputs = {
    taxType: {
      taxType: document.getElementById("taxTypeSelect").value,
      whtAmount: document.getElementById("whtAmount")?.value,
      transactionType: document.getElementById("transaction_type")?.value,
      recipientType: document.getElementById("recipient_type")?.value,
      payeMonthlyIncome: document.getElementById("payeMonthlyIncome")?.value,
    },
    supportingDocuments: [],
  };

  const documentItems = document.querySelectorAll(".documentItems");
  userInputs.supportingDocuments = Array.from(documentItems).map((item) => ({
    documentName: item.querySelector(".documentName").value,
    documentFile:
      item.querySelector(".documentFile").files[0]?.name || "No file uploaded",
  }));

  // Clear previous content
  previewSection.innerHTML = "";

  // Tax Type Preview
  previewSection.innerHTML += `
    <div class="bg-gray-50 p-4 rounded-lg">
      <h3 class="font-semibold text-lg mb-2">Tax Type</h3>
      <p><strong>Selected Tax Type:</strong> ${userInputs.taxType.taxType}</p>
      ${
        userInputs.taxType.whtAmount
          ? `<p><strong>Transaction Amount:</strong> ${userInputs.taxType.whtAmount}</p>`
          : ""
      }
      ${
        userInputs.taxType.transactionType
          ? `<p><strong>Transaction Type:</strong> ${userInputs.taxType.transactionType}</p>`
          : ""
      }
      ${
        userInputs.taxType.recipientType
          ? `<p><strong>Recipient Type:</strong> ${userInputs.taxType.recipientType}</p>`
          : ""
      }
      ${
        userInputs.taxType.payeMonthlyIncome
          ? `<p><strong>Annual Gross Income:</strong> ${userInputs.taxType.payeMonthlyIncome}</p>`
          : ""
      }
    </div>
  `;

  // Supporting Documents Preview
  if (userInputs.supportingDocuments.length > 0) {
    previewSection.innerHTML += `
      <div class="bg-gray-50 p-4 rounded-lg">
        <h3 class="font-semibold text-lg mb-2">Supporting Documents</h3>
        ${userInputs.supportingDocuments
          .map(
            (doc, index) => `
              <div class="mb-2">
                <p><strong>Document ${index + 1}:</strong> ${
              doc.documentName
            }</p>
                <p><strong>File:</strong> ${doc.documentFile}</p>
              </div>
            `
          )
          .join("")}
      </div>
    `;
  }
}

// Call generatePreview when the Review & Submission tab is displayed
document.addEventListener("DOMContentLoaded", function () {
  const reviewTab = document.querySelector(
    ".previewSection[style='display: none']"
  );
  if (reviewTab) {
    reviewTab.addEventListener("click", generatePreview);
  }
});

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
  const activeTab = document.querySelector(".tab-pane.fade.show.active").id;

  let containerId;
  if (activeTab === "home-tab-pane") {
    containerId = "payeMoreDocumentItems";
  } else if (activeTab === "profile-tab-pane") {
    containerId = "whtMoreDocumentItems";
  } else if (activeTab === "contact-tab-pane") {
    containerId = "directAssessmentMoreDocumentItems";
  }

  const container = document.getElementById(containerId);
  if (container) {
    container.insertAdjacentHTML(
      "beforeend",
      `
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
    `
    );
  }

  getDocumentCount();
}

function removeDocumentItem(e) {
  e.parentElement.parentElement.remove();
  getDocumentCount();
}

function getDocumentCount() {
  const activeTab = document.querySelector(".tab-pane.fade.show.active").id;
  let containerId;
  if (activeTab === "home-tab-pane") {
    containerId = "payeMoreDocumentItems";
  } else if (activeTab === "profile-tab-pane") {
    containerId = "whtMoreDocumentItems";
  } else if (activeTab === "contact-tab-pane") {
    containerId = "directAssessmentMoreDocumentItems";
  }

  const container = document.getElementById(containerId);
  if (container) {
    const assessmentItems = container.querySelectorAll(".documentItems");
    assessmentItems.forEach((item, i) => {
      item.querySelector(".numbering").textContent = i + 1;
    });
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

    if (result.status === "success" && result.data.length > 0) {
      let payInputs = document.querySelectorAll(".invInput");
      console.log(result.data[0].tax_number);
      $("#taxNumber").val(result.data[0].tax_number);
      nextPrev(1);
    } else {
      Swal.fire({
        title: "User Not Found",
        text: "No Information found with the provided data",
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

function buildPayload() {
  const payload = {
    taxpayer_id: document.getElementById("taxNumber").value, // Static for now, can be dynamic
    filing_date: new Date().toISOString().split("T")[0], // Current date in YYYY-MM-DD format
    tax_types: [],
  };

  // PAYE Return Tab
  const payeForm = document.getElementById("payeForm");
  if (payeForm) {
    const payeData = {
      tax_type: "paye",
      amount_paid: parseFloat(
        document.getElementById("payeMonthlyIncome").value
      ),
      status: "pending", // Default status
      annual_income: parseFloat(
        document.getElementById("payeMonthlyIncome").value
      ),
      profession: null,
      tax_assessment_type: null,
      taxpayer_category: null,
      documents: [],
    };

    // Extract documents from PAYE tab
    const payeDocuments = payeForm.querySelectorAll(".documentItems");
    payeDocuments.forEach((doc) => {
      const documentName = doc.querySelector(".documentName").value;
      const documentFile = doc.querySelector(".documentFile").files[0];
      payeData.documents.push({
        document_type: documentName,
        file_path: `/documents/${
          documentFile ? documentFile.name : "default.pdf"
        }`, // Simulated file path
        uploaded_at: new Date().toISOString().split("T")[0], // Current date
      });
    });

    payload.tax_types.push(payeData);
  }

  // Withholding Tax Tab
  const whtForm = document.getElementById("whtForm");
  if (whtForm) {
    const whtData = {
      tax_type: "withholding_tax",
      amount_paid: parseFloat(document.getElementById("whtAmount").value),
      status: "pending", // Default status
      annual_income: null,
      profession: null,
      tax_assessment_type: document.getElementById("transaction_type").value,
      taxpayer_category: document.getElementById("recipient_type").value,
      documents: [],
    };

    // Extract documents from WHT tab
    const whtDocuments = whtForm.querySelectorAll(".documentItems");
    whtDocuments.forEach((doc) => {
      const documentName = doc.querySelector(".documentName").value;
      const documentFile = doc.querySelector(".documentFile").files[0];
      whtData.documents.push({
        document_type: documentName,
        file_path: `/documents/${
          documentFile ? documentFile.name : "default.pdf"
        }`, // Simulated file path
        uploaded_at: new Date().toISOString().split("T")[0], // Current date
      });
    });

    payload.tax_types.push(whtData);
  }

  // Direct Assessment Tab
  const directAssessmentForm = document.getElementById("directAssessmentForm");
  if (directAssessmentForm) {
    const directAssessmentData = {
      tax_type: "direct_assessment",
      amount_paid: parseFloat(
        document.getElementById("payeMonthlyIncome").value
      ),
      status: "pending", // Default status
      annual_income: parseFloat(
        document.getElementById("payeMonthlyIncome").value
      ),
      profession: document.getElementById("professionSelect").value,
      tax_assessment_type: null,
      taxpayer_category: null,
      documents: [],
    };

    // Extract documents from Direct Assessment tab
    const directAssessmentDocuments =
      directAssessmentForm.querySelectorAll(".documentItems");
    directAssessmentDocuments.forEach((doc) => {
      const documentName = doc.querySelector(".documentName").value;
      const documentFile = doc.querySelector(".documentFile").files[0];
      directAssessmentData.documents.push({
        document_type: documentName,
        file_path: `/documents/${
          documentFile ? documentFile.name : "default.pdf"
        }`, // Simulated file path
        uploaded_at: new Date().toISOString().split("T")[0], // Current date
      });
    });

    payload.tax_types.push(directAssessmentData);
  }

  return payload;
}

// Example usage
function submitForm() {
  const payloadData = buildPayload();
  console.log(JSON.stringify(payloadData, null, 2)); // Log the payload
  populatePreview(payloadData);
  nextPrev(1);
}

function populatePreview(payloadData) {
  const previewSection = document.getElementById("previewSection");
  previewSection.innerHTML = ""; // Clear previous content

  // Add taxpayer information
  previewSection.innerHTML += `
      <div class="bg-gray-50 p-4 rounded-lg">
          <h3 class="font-semibold text-lg mb-2">Taxpayer Information</h3>
          <p><strong>Taxpayer ID:</strong> ${payloadData.taxpayer_id}</p>
      </div>
  `;

  // Add tax types information
  payloadData.tax_types.forEach((tax) => {
    const taxTypeDiv = document.createElement("div");
    taxTypeDiv.innerHTML = `
          <div class="bg-gray-50 p-4 rounded-lg">
              <h4 class="font-semibold text-lg">${tax.tax_type}</h4>
              <p><strong>Amount Paid:</strong> ${tax.amount_paid}</p>
              <p><strong>Status:</strong> ${tax.status}</p>
              ${
                tax.annual_income
                  ? `<p><strong>Annual Income:</strong> ${tax.annual_income}</p>`
                  : ""
              }
              ${
                tax.profession
                  ? `<p><strong>Profession:</strong> ${tax.profession}</p>`
                  : ""
              }
              ${
                tax.tax_assessment_type
                  ? `<p><strong>Tax Assessment Type:</strong> ${tax.tax_assessment_type}</p>`
                  : ""
              }
              ${
                tax.taxpayer_category
                  ? `<p><strong>Taxpayer Category:</strong> ${tax.taxpayer_category}</p>`
                  : ""
              }
              <h5>Documents:</h5>
              <ul>
                  ${tax.documents
                    .map(
                      (doc) =>
                        `<li>${doc.document_type}: <a href="${doc.file_path}" target="_blank">View</a> (Uploaded on: ${doc.uploaded_at})</li>`
                    )
                    .join("")}
              </ul>
          </div>
      `;
    previewSection.appendChild(taxTypeDiv);
  });
}

async function submitTaxFile() {
  $("#submitTaxFileBtn")
    .prop("disabled", true)
    .html('<i class="custom-spinner"></i> Submitting...');

  const payload = buildPayload(); // Build the payload as before
  console.log("Initial Payload:", payload);

  try {
    // Upload files to Publit.io and update the payload
    const uploadedDocuments = await uploadFiles();

    // Group documents by tax type
    const documentsByTaxType = uploadedDocuments.reduce((acc, doc) => {
      if (!acc[doc.tax_type]) acc[doc.tax_type] = [];
      acc[doc.tax_type].push({
        document_type: doc.document_type,
        file_path: doc.file_path,
        uploaded_at: doc.uploaded_at,
      });
      return acc;
    }, {});

    // Add uploaded documents to the payload
    payload.tax_types.forEach((taxType) => {
      taxType.documents = documentsByTaxType[taxType.tax_type] || [];
    });

    console.log("Updated Payload with Uploaded Documents:", payload);

    // Send the payload to the API
    nextPrev(1);
    await sendPayloadToAPI(payload);
    alert("Payload submitted successfully!");
  } catch (error) {
    console.error("File upload or API submission failed:", error);
    $("#submitTaxFileBtn").prop("disabled", false).html(`Submit`);
  }
}

async function uploadFileWithRetry(file, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await publitio.uploadFile(file, "file");
      return response;
    } catch (error) {
      if (i === retries - 1) throw error; // Throw error if all retries fail
      await new Promise((resolve) => setTimeout(resolve, delay)); // Wait before retrying
    }
  }
}

// Function to upload files to Publit.io
async function uploadFiles() {
  const fileInputs = document.querySelectorAll('input[type="file"]');
  const uploadPromises = Array.from(fileInputs).map((input) => {
    if (input.files.length > 0) {
      const file = input.files[0];
      const documentNameElement = input
        .closest(".documentItems")
        ?.querySelector(".documentName");
      const documentName = documentNameElement
        ? documentNameElement.value
        : "Uploaded Document";

      // Determine the tax type based on the parent form
      const parentForm = input.closest(".tab-pane").id;
      let taxType = "";
      if (parentForm === "home-tab-pane") taxType = "paye";
      else if (parentForm === "profile-tab-pane") taxType = "withholding_tax";
      else if (parentForm === "contact-tab-pane") taxType = "direct_assessment";

      return uploadFileWithRetry(file)
        .then((response) => {
          return {
            tax_type: taxType, // Add tax type to the document
            document_type: documentName,
            file_path: response.url_preview, // Publit.io file URL
            uploaded_at: new Date().toISOString().split("T")[0], // Current date
          };
        })
        .catch((error) => {
          console.error(`Failed to upload file: ${file.name}`, error);
          throw error; // Propagate the error to stop the process
        });
    }
    return null;
  });

  return Promise.all(uploadPromises.filter(Boolean));
}

function sendPayloadToAPI(payload) {
  $("#refNumber").html('<i class="custom-spinner"></i>');
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `${HOST}/noauth-create-tax-filing`, // Replace with your API endpoint
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(payload),
      success: function (data) {
        console.log("API Response:", data);
        $("#submitTaxFileBtn").prop("disabled", false).html(`Submit`);
        $("#refNumber").text(data.data.filing_number);
        resolve(data);
      },
      error: function (error) {
        console.error("API Error:", error);
        $("#submitTaxFileBtn").prop("disabled", false).html(`Submit`);
        reject(error);
      },
    });
  });
}
