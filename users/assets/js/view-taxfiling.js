const filingId = getParameterByName("id");
function populateFilingDetails(filingData) {
  // Header Section
  $("#filingNumber").text(filingData.filing_number);
  $("#filingStatus").text(filingData.status);
  $(".status-badge")
    .removeClass()
    .addClass(`status-badge status-${filingData.status.toLowerCase()}`);
  $(".status-badge i").text(filingData.status);

  if (filingData.status === "approved") {
    $("#actionButton").html(`
        <button disabled
            class="btn btn-success action-button"
            >
            <i class="fas fa-check me-2"></i>Tax File Is Approved
            </button>
    `);
  }

  if (filingData.status === "flagged") {
    $("#actionButton").html(`
        <button disabled
            class="btn btn-danger action-button"
            >
            <i class="fas fa-times me-2"></i>Tax File Is Flagged
            </button>
    `);
  }

  // Filing Information Grid
  $("#filingDate").text(new Date(filingData.filing_date).toLocaleDateString());
  $("#createdAt").text(new Date(filingData.created_at).toLocaleString());
  $("#updatedAt").text(new Date(filingData.updated_at).toLocaleString());

  // Tax Types Section
  const taxTypesSection = $("#taxTypesSection");
  taxTypesSection.empty(); // Clear existing content

  filingData.tax_types.forEach((taxType) => {
    const taxTypeHtml = `
      <div class="col-md-4">
        <div class="tax-type-card p-4">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h3 class="h5 mb-0">${taxType.tax_type.toUpperCase()}</h3>
            <span class="status-badge status-${taxType.status.toLowerCase()}">
              ${taxType.status}
            </span>
          </div>
          <div class="mb-3">
            <div class="info-label">Amount Paid</div>
            <div class="amount-text">₦${parseFloat(
              taxType.amount_paid
            ).toLocaleString()}</div>
          </div>
          ${
            taxType.annual_income
              ? `
            <div class="mb-3">
              <div class="info-label">Annual Income</div>
              <div class="amount-text">₦${parseFloat(
                taxType.annual_income
              ).toLocaleString()}</div>
            </div>
          `
              : ""
          }
          ${
            taxType.profession
              ? `
            <div class="mb-3">
              <div class="info-label">Profession</div>
              <div class="info-value">${taxType.profession}</div>
            </div>
          `
              : ""
          }
          ${
            taxType.tax_assessment_type
              ? `
            <div class="mb-3">
              <div class="info-label">Tax Assessment Type</div>
              <div class="info-value">${taxType.tax_assessment_type}</div>
            </div>
          `
              : ""
          }
          ${
            taxType.taxpayer_category
              ? `
            <div class="mb-3">
              <div class="info-label">Taxpayer Category</div>
              <div class="info-value">${taxType.taxpayer_category}</div>
            </div>
          `
              : ""
          }
          <div class="mt-4">
            <h6 class="mb-3">Documents</h6>
            ${taxType.documents
              .map(
                (doc) => `
              <a href="${doc.file_path}" class="document-link" target="_blank">
                <i class="fas fa-file-pdf"></i>
                ${doc.document_type}
              </a>
            `
              )
              .join("")}
          </div>
        </div>
      </div>
    `;
    taxTypesSection.append(taxTypeHtml);
  });

  // History Section
  const historySection = $("#historySection");
  historySection.empty(); // Clear existing content

  if (filingData.history.length > 0) {
    filingData.history.forEach((historyItem) => {
      const historyHtml = `
        <div class="timeline-item">
          <p class="mb-1">${historyItem.status}</p>
          <small class="text-secondary">${
            historyItem.admin_remarks
          }</small><br/>
          <small class="text-secondary">${new Date(
            historyItem.created_at
          ).toLocaleString()}</small>
        </div>
      `;
      historySection.append(historyHtml);
    });
  } else {
    historySection.html(
      '<div class="text-secondary">No history available.</div>'
    );
  }
}

// Function to update the status of a specific tax type
function updateTaxTypeStatus(taxTypeId, status, remarks) {
  // Disable the buttons and show loading state
  const approveButton = document.querySelector(
    `button[onclick="openTaxTypeModal(${taxTypeId}, 'approved')"]`
  );
  const flagButton = document.querySelector(
    `button[onclick="openTaxTypeModal(${taxTypeId}, 'flagged')"]`
  );

  if (approveButton) {
    approveButton.disabled = true;
    approveButton.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Processing...`;
  }
  if (flagButton) {
    flagButton.disabled = true;
    flagButton.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Processing...`;
  }

  const payload = {
    filing_id: filingId,
    tax_type_id: taxTypeId,
    status: status,
    remarks: remarks,
  };

  fetch(`${HOST}/approve-tax-type`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        showNotification(`Tax type status updated to ${status}`, "success");
        fetchTaxFilingDetails(filingId); // Refresh the page
      } else {
        showNotification("Failed to update tax type status", "error");
      }
    })
    .catch((error) => {
      showNotification("An error occurred", "error");
      console.error(error);
    })
    .finally(() => {
      // Re-enable the buttons and reset their text
      if (approveButton) {
        approveButton.disabled = false;
        approveButton.innerHTML = `<i class="fas fa-check me-2"></i>Approve`;
      }
      if (flagButton) {
        flagButton.disabled = false;
        flagButton.innerHTML = `<i class="fas fa-flag me-2"></i>Flag`;
      }
    });
}

// Function to update the status of the entire tax filing
function updateFilingStatus(status) {
  const payload = {
    filing_id: filingId,
    status: status,
    admin_remarks: "Status updated by admin", // Add remarks if needed
  };

  fetch(`${HOST}/update-tax-filing`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        showNotification(`Tax filing status updated to ${status}`, "success");
        fetchTaxFilingDetails(filingId); // Refresh the page
      } else {
        showNotification("Failed to update tax filing status", "error");
      }
    })
    .catch((error) => {
      showNotification("An error occurred", "error");
      console.error(error);
    });
}

// Fetch and populate tax filing details
function fetchTaxFilingDetails(filingId) {
  $.ajax({
    url: `${HOST}/get-all-tax-filings?tax_filing_id=${filingId}`,
    method: "GET",
    success: function (response) {
      if (response.status === "success" && response.data.length > 0) {
        populateFilingDetails(response.data[0]);
      } else {
        showNotification("No tax filing details found", "warning");
      }
    },
    error: function (xhr) {
      showNotification("Failed to fetch tax filing details", "error");
    },
  });
}

// Call this when the page loads or when you want to populate the card
$(document).ready(function () {
  if (filingId) {
    fetchTaxFilingDetails(filingId);
  }
});
