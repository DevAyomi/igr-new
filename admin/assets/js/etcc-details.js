let dataToExport;
const tccId = getParameterByName("id");
const tid = getParameterByName("tccId");
const taxpayerId = getParameterByName("taxpayerId");
const currentStage = getParameterByName("stage");

function fetchPayments() {
  const $tbody = $("#paymentTable tbody");
  const loaderRow = `
        <tr class="loader-row">
          <td colspan="16" class="text-center">
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
    url: `${HOST}/get-payment?tax_number=${taxpayerId}&invoice_type=tcc`,
    dataType: "json",
    headers: {
      Authorization: "Bearer " + authToken,
      "Content-Type": "application/json",
    },
    crossDomain: true,
    success: function (response) {
      if (response.status === "success" && response.data.length > 0) {
        const payments = response.data;

        dataToExport = payments;
        $tbody.empty(); // Clear the loader and existing rows

        payments.forEach((payment, index) => {
          const revenueHeads = payment.associated_revenue_heads
            .map((head) => `${head.item_name} (${head.mda_name})`)
            .join(", ");

          const paymentStatus = payment.amount_paid > 0 ? "success" : "pending";
          const paymentStatusClass =
            paymentStatus === "success" ? "badge-success" : "badge-danger";

          const row = `
                <tr>
                  <td>${index + 1}</td>
                  <td>${payment.user_id || "N/A"}</td>
                  <td>${payment.payment_reference_number}</td>
                  <td>${revenueHeads}</td>
                  <td style="width: 40px; word-wrap: break-word">${
                    payment.associated_revenue_heads[0]?.category || "N/A"
                  }</td>
                  <td>₦ ${parseFloat(payment.amount_paid).toLocaleString()}</td>
                  <td>${payment.payment_method || "N/A"}</td>
                  <td>${new Date(
                    payment.date_payment_created
                  ).toLocaleDateString()}</td>
                  
                  
                  <td class="text-sm">
                    <span class="badge ${paymentStatusClass}">${paymentStatus}</span>
                    </td>
                <td>
                    <div>
                      <a href="../invoiceGeneration/payment-receipt.html?invoice_number=${
                        payment.invoice_number
                      }" class="btn btn-primary btn-sm" target="_blank">
                        Download
                      </a>
                    </div>
                  </td>
                </tr>
              `;
          $tbody.append(row);
        });
      } else {
        $tbody.html(
          '<tr><td colspan="16" class="text-center">No payments found.</td></tr>'
        );
      }
    },
    error: function (err) {
      console.error("Error fetching payments:", err);
      $tbody.html(
        '<tr><td colspan="16" class="text-center text-danger">An error occurred while fetching payments.</td></tr>'
      );
    },
  });
}

fetchPayments();

function populateTCCDetailsCard(tccData) {
  // Primary Details
  $("#applicantName").text(
    `${tccData.taxpayer_first_name} ${tccData.taxpayer_surname}`
  );
  $("#applicantTIN").text(tccData.applicant_tin);
  $("#orgTIN").text(tccData.taxpayer_id);
  $(".etccType").text(`ETCC Details - ${tccId}`);

  // Organization Details
  $("#orgName").text("-"); // Not available in the response
  $("#officeAddress").text("-"); // Not available in the response
  $("#employmentDate").text(tccData.date_employed);

  // Additional Details
  $("#reasonTCC").text(tccData.reason);
  $("#sectorType").text(tccData.category);
  $("#occupation").text(tccData.occupation);

  // Tax Payment Evidence
  if (tccData.secondary_info && tccData.secondary_info.length > 0) {
    const secondaryInfo = tccData.secondary_info[0];

    // Year 1
    $("#year1").text(secondaryInfo.first_year_date);
    $("#income1").text(
      parseFloat(secondaryInfo.first_year_income).toLocaleString()
    );
    $("#taxPaid1").text(
      parseFloat(secondaryInfo.first_year_tax_amount).toLocaleString()
    );

    // Year 2
    $("#year2").text(secondaryInfo.second_year_date);
    $("#income2").text(
      parseFloat(secondaryInfo.second_year_income).toLocaleString()
    );
    $("#taxPaid2").text(
      parseFloat(secondaryInfo.second_year_tax_amount).toLocaleString()
    );

    // Year 3
    $("#year3").text(secondaryInfo.third_year_date);
    $("#income3").text(
      parseFloat(secondaryInfo.third_year_income).toLocaleString()
    );
    $("#taxPaid3").text(
      parseFloat(secondaryInfo.third_year_tax_amount).toLocaleString()
    );

    // Additional Tax Information
    $("#taxTitle").text(secondaryInfo.tax_title || "-");
    $("#amountOwed").text(
      parseFloat(secondaryInfo.amount_owed).toLocaleString() || "-"
    );
    $("#exemptionType").text(secondaryInfo.exemption_type || "-");
    $("#husbandName").text(secondaryInfo.husband_name || "-");
    $("#husbandAddress").text(secondaryInfo.husband_address || "-");
  }

  // Additional Information
  $("#institutionName").text(
    tccData.secondary_info?.[0]?.institution_name || "-"
  );

  // Supporting Documents
  if (tccData.tcc_supporting_documents) {
    // Additional Documents
    const otherDocs = tccData.tcc_supporting_documents;
    otherDocs.forEach((doc, index) => {
      const docHtml = `
        <tr>
          <td>${index + 1}</td>
          <td>${doc.document_name}</td>
          <td><span class="badge badge-success">Available</span></td>
          <td><button class="btn btn-primary btn-sm ms-2" onclick="viewDocument('${
            doc.document_url
          }', '${doc.document_name}')">View</button></td>
        </tr>
      `;
      $("#additionalDocuments tbody").append(docHtml);
    });

    // Setup document view buttons
    setupDocumentViewButtons(tccData.tcc_supporting_documents);
  }

  // Declaration and Recommendation
  $("#declarationName").text(tccData.declaration_name || "-");
  $("#recommendation").text(tccData.recommendation || "-");
  if (tccData.status === "approved") {
    $("#actionBtn")
      .html(`<a href="../etcc/etcc-certificate.html?tcc_number=${tccId}" target="_blank" class="btn btn-success">
                          <i class="fas fa-file me-2"></i>View TCC Certificate
                        </a>`);
  }
}

function setupDocumentViewButtons(documents) {
  const $documentButtons = $(".btn-primary.btn-sm");

  $documentButtons.each(function (index) {
    const doc = documents[index];

    if (doc) {
      $(this).on("click", function () {
        viewDocument(doc.document_url, doc.document_name);
      });
    } else {
      $(this).prop("disabled", true);
    }
  });
}

function viewDocument(url, name) {
  // Open document in a new tab or modal
  window.open(url, "_blank");
}

// function showNotification(message, type = "info") {
//   // Create a toast notification
//   const toastHtml = `
//         <div class="toast align-items-center text-white bg-${type} border-0" role="alert" aria-live="assertive" aria-atomic="true">
//             <div class="d-flex">
//                 <div class="toast-body">
//                     ${message}
//                 </div>
//                 <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
//             </div>
//         </div>
//     `;

//   // Append toast to a container
//   const $toastContainer = $("#toast-container");
//   if ($toastContainer.length === 0) {
//     $("body").append(
//       '<div id="toast-container" class="position-fixed top-0 end-0 p-3" style="z-index: 1100"></div>'
//     );
//   }

//   const $toast = $(toastHtml);
//   $("#toast-container").append($toast);

//   // Show and auto-hide the toast
//   $toast.toast("show");
//   $toast.on("hidden.bs.toast", function () {
//     $(this).remove();
//   });
// }

// Fetch and populate TCC details
function fetchTCCDetails(tccId) {
  $.ajax({
    url: `${HOST}/get-tcc?tcc_number=${tccId}&taxpayer_id=${taxpayerId}`,
    method: "GET",
    headers: {
      Authorization: "Bearer " + authToken,
      "Content-Type": "application/json",
    },
    success: function (response) {
      if (response.status === "success" && response.data.length > 0) {
        populateTCCDetailsCard(response.data[0]);
      } else {
        showNotification("No TCC details found", "warning");
      }
    },
    error: function (xhr) {
      showNotification("Failed to fetch TCC details", "error");
    },
  });
}

// Call this when the page loads or when you want to populate the card
$(document).ready(function () {
  // Extract TCC ID from URL or pass it from previous page
  const tccId = getParameterByName("id"); // Implement this to get ID from URL
  if (tccId) {
    fetchTCCDetails(tccId);
  }
});

let currentAction = ""; // To store the current action (approve or decline)

// Function to set the action (approve or decline) and TCC ID
function setAction(action, tccId) {
  currentAction = action;
  let currentTccId = tccId;

  // Update modal title and button text based on the action
  const modalLabel = document.getElementById("tccConfirmationModalLabel");
  const confirmButton = document.getElementById("confirmAction");

  if (action === "approve") {
    modalLabel.textContent = "Approve TCC";
    confirmButton.textContent = "Approve";
    confirmButton.classList.remove("btn-danger");
    confirmButton.classList.add("btn-success");
  } else if (action === "decline") {
    modalLabel.textContent = "Decline TCC";
    confirmButton.textContent = "Decline";
    confirmButton.classList.remove("btn-success");
    confirmButton.classList.add("btn-danger");
  }
}

// Function to handle the confirmation (approve or decline)
function confirmAction() {
  const remark = document.getElementById("invoiceDescription").value.trim();

  // Validate the remark input
  if (!remark) {
    showNotification("Please provide a remark.", "error");
    return;
  }

  let endpoint = "";
  let payload = {};

  // Check if the current stage is valid
  const validCurrentStages = [
    "first_reviewer_approval",
    "second_reviewer_approval",
    "director_reviewer",
  ];
  const validNextStages = [
    "first_reviewer_approval",
    "second_reviewer_approval",
    "director_reviewer", // Added to match backend logic
    "director_approval",
  ];

  // Validate the current stage
  if (!validCurrentStages.includes(currentStage)) {
    showNotification("Invalid stage provided.", "error");
    return;
  }

  // Determine the next stage based on the current stage
  const currentStageIndex = validCurrentStages.indexOf(currentStage);
  const nextStage = validNextStages[currentStageIndex + 1]; // Get the corresponding next stage

  // Determine the action based on the current action
  if (currentAction === "approve") {
    endpoint = "/update-tcc-stage";
    payload = {
      tcc_id: tid, // Use tcc_id as per your JSON structure
      remarks: remark,
      current_stage: currentStage,
      next_stage: nextStage,
      approver_id: userId,
    };

    // Additional logic to handle approver_id based on next_stage
    if (
      nextStage === "second_review" ||
      nextStage === "second_reviewer_approval"
    ) {
      payload.approver_id = userId; // Set approver_id for first reviewer
    } else if (nextStage === "director_reviewer") {
      payload.approver_id = userId; // Set approver_id for director reviewer
    } else if (nextStage === "director_approval") {
      payload.approver_id = userId; // Set approver_id for director approval
    }
  } else if (currentAction === "decline") {
    endpoint = "/update-tcc-status"; // Corrected endpoint for decline
    payload = {
      id: tid, // Use tcc_id for consistency
      remark: remark,
      status: "rejected",
    };
  }

  // Proceed with the API call using the endpoint and payload
  // Disable the confirm button and show loading state
  const confirmButton = document.getElementById("confirmAction");
  confirmButton.disabled = true;
  confirmButton.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Processing...`;

  // Make the API call
  fetch(`${HOST}${endpoint}`, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + authToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        showNotification(
          `TCC ${
            currentAction === "approve" ? "Approved" : "Declined"
          } Successfully`,
          "success"
        );
        // Optionally refresh or redirect
        fetchTCCDetails(tccId);
        window.location.reload()
      } else {
        showNotification(`Failed to ${currentAction} TCC`, "error");
      }
    })
    .catch((error) => {
      showNotification("An error occurred", "error");
      console.error(error);
    })
    .finally(() => {
      // Close the modal and reset the button
      const modal = bootstrap.Modal.getInstance(
        document.getElementById("tccConfirmationModal")
      );
      modal.hide();
      confirmButton.disabled = false;
      confirmButton.textContent =
        currentAction === "approve" ? "Approve" : "Decline";
    });
}

// Attach the confirmAction function to the confirm button
document
  .getElementById("confirmAction")
  .addEventListener("click", confirmAction);

// Function to show notifications
function showNotification(message, type) {
  Swal.fire({
    icon: type === "success" ? "success" : "error",
    title: type === "success" ? "Success" : "Error",
    text: message,
    timer: 3000, // Automatically close after 3 seconds
    showConfirmButton: false, // Hide the "OK" button
  });
}
