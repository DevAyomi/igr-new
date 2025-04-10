$(document).ready(function () {
  if ($.fn.DataTable.isDataTable("#all-taxes")) {
    $("#all-taxes").DataTable().clear().destroy();
  }

  const table3 = $("#all-taxes").DataTable({
    serverSide: true,
    paging: true,
    ordering: false,
    pageLength: 50,
    responsive: true,
    searchDelay: 500,
    pagingType: "simple_numbers",
    ajax: function (data, callback) {
      const pageNumber = Math.ceil(data.start / data.length) + 1;

      const filters = {
        page: pageNumber,
        limit: data.length,
      };

      $.ajax({
        url: `${HOST}/get-revenue-head`,
        type: "GET",
        data: filters,
        headers: {
          Authorization: "Bearer " + authToken,
          "Content-Type": "application/json",
        },
        dataType: "json",
        beforeSend: function () {
          $("#all-taxes tbody").html(`
            <tr class="loader-row">
              <td colspan="7" class="text-center">
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
          `);
        },
        success: function (response) {
          if (response.status === "success" && response.data.length > 0) {
            callback({
              draw: data.draw,
              recordsTotal: response.data.length,
              recordsFiltered: response.data.length,
              data: response.data,
            });
          } else {
            $("#all-taxes tbody").html(`
              <tr>
                <td colspan="7" class="text-center text-muted">
                  No revenue head data found.
                </td>
              </tr>
            `);
            callback({
              draw: data.draw,
              recordsTotal: 0,
              recordsFiltered: 0,
              data: [],
            });
          }
        },
        error: function (err) {
          console.error("Error fetching revenue head data:", err);
          $("#all-taxes tbody").html(`
            <tr>
              <td colspan="7" class="text-center text-danger">
                Error loading revenue heads. Please try again.
              </td>
            </tr>
          `);
          showErrorNotification(
            "Failed to load revenue heads. Please refresh the page."
          );
          callback({
            draw: data.draw,
            recordsTotal: 0,
            recordsFiltered: 0,
            data: [],
          });
        },
      });
    },
    columns: [
      {
        data: null,
        render: function (data, type, row, meta) {
          return `
            <div class="form-check">
              <input 
                class="form-check-input revenue-head-checkbox" 
                type="checkbox" 
                value="${row.id}" 
                id="revenueHead-${row.id}"
                data-mdaid="${row.mda_id}"
                data-mdaname="${row.mda_name}"
                data-itemname="${row.item_name}"
                data-amount="${row.amount}"
              >
              <label class="form-check-label" for="revenueHead-${row.id}">
                ${meta.row + 1}
              </label>
            </div>`;
        },
      },
      { data: "mda_name", defaultContent: "N/A" },
      { data: "item_name", defaultContent: "N/A" },
      { data: "category", defaultContent: "N/A" },
      { data: "frequency", defaultContent: "N/A" },
      {
        data: "amount",
        render: function (data) {
          return `₦ ${parseFloat(data || 0).toLocaleString()}`;
        },
      },
    ],
    drawCallback: function () {
      // Re-initialize any interactive elements like select-all after each draw
      setupSelectAllCheckbox();
    },
  });
});

function fetchApprovedRevenueHeads() {
  const loaderRow = `
    <tr class="loader-row">
      <td colspan="7" class="text-center">
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
  const $tbody = $("#all-taxes tbody");

  // Show loader
  $tbody.html(loaderRow);

  $.ajax({
    type: "GET",
    url: `${HOST}/get-revenue-head`,
    dataType: "json",
    headers: {
      Authorization: "Bearer " + authToken,
      "Content-Type": "application/json",
    },
    crossDomain: true,
    success: function (response) {
      if (response.status === "success" && response.data.length > 0) {
        const data = response.data;

        $tbody.empty(); // Clear existing rows

        data.forEach((item, index) => {
          const row = `
            <tr>
              <td>
                <div class="form-check">
                  <input 
                    class="form-check-input revenue-head-checkbox" 
                    type="checkbox" 
                    value="${item.id}" 
                    id="revenueHead-${item.id}"
                    data-mdaid="${item.mda_id}"
                    data-mdaname="${item.mda_name}"
                    data-itemname="${item.item_name}"
                    data-amount="${item.amount}"
                  >
                  <label class="form-check-label" for="revenueHead-${item.id}">
                    ${index + 1}
                  </label>
                </div>
              </td>
              <td>${item.mda_name || "N/A"}</td>
              <td>${item.item_name}</td>
              <td>${item.category}</td>
              <td>${item.frequency}</td>
              <td>₦ ${parseFloat(item.amount).toLocaleString()}</td>
            </tr>
          `;
          $tbody.append(row);
        });

        // Setup select all functionality
        setupSelectAllCheckbox();
      } else {
        $tbody.html(
          '<tr><td colspan="7" class="text-center">No revenue head data found for this MDA.</td></tr>'
        );
      }
    },
    error: function (err) {
      $tbody.html(
        '<tr><td colspan="7" class="text-center">Error loading revenue heads. Please try again.</td></tr>'
      );
      console.error("Error fetching revenue head data:", err);

      // Optional: Show error toast or notification
      showErrorNotification(
        "Failed to load revenue heads. Please refresh the page."
      );
    },
  });
}

function setupSelectAllCheckbox() {
  const $selectAllCheckbox = $("#select-all-revenue-heads");
  const $individualCheckboxes = $(".revenue-head-checkbox");
  const $selectedCountElement = $("#selectedRevHeadCount");
  const $totalAmountElement = $("#selectedRevenueAmount");

  // Function to update selected count and total amount
  function updateSelectedDetails() {
    const $checkedBoxes = $individualCheckboxes.filter(":checked");
    const selectedCount = $checkedBoxes.length;

    // Calculate total amount
    const totalAmount = $checkedBoxes.toArray().reduce((sum, checkbox) => {
      return sum + parseFloat($(checkbox).data("amount") || 0);
    }, 0);

    $selectedCountElement.text(selectedCount !== 0 ? `(${selectedCount})` : "");
    $totalAmountElement.text(`₦ ${totalAmount.toLocaleString()}`);
  }

  // Select all checkbox functionality
  $selectAllCheckbox.on("change", function () {
    const isChecked = $(this).prop("checked");
    $individualCheckboxes.prop("checked", isChecked);
    updateSelectedDetails();
  });

  // Individual checkbox functionality
  $individualCheckboxes.on("change", function () {
    // Update select all checkbox if all individual checkboxes are checked/unchecked
    const allChecked =
      $individualCheckboxes.length ===
      $individualCheckboxes.filter(":checked").length;
    $selectAllCheckbox.prop("checked", allChecked);

    // Update selected count and total amount
    updateSelectedDetails();
  });

  // Initial count (in case some are pre-checked)
  updateSelectedDetails();
}

// Function to get selected revenue heads with details
function getSelectedRevenueHeads() {
  const selectedHeads = [];
  $(".revenue-head-checkbox:checked").each(function () {
    const $checkbox = $(this);
    selectedHeads.push({
      revenue_head_id: $checkbox.val(),
      mda_id: $checkbox.data("mdaid"),
      mda_name: $checkbox.data("mdaname"),
      item_name: $checkbox.data("itemname"),
      amount: parseFloat($checkbox.data("amount")),
    });
  });
  return selectedHeads;
}

// async function generateInvoice() {
//   // Get selected revenue heads
//   const selectedRevenueHeads = getSelectedRevenueHeads();

//   // Validate selection
//   if (selectedRevenueHeads.length === 0) {
//     showErrorNotification("Please select at least one revenue head");
//     return;
//   }

//   // Populate modal with selected revenue heads
//   const $selectedRevenueHeadsList = $("#selectedRevenueHeadsList");
//   const $confirmationTotalAmount = $("#confirmationTotalAmount");

//   // Clear previous selections
//   $selectedRevenueHeadsList.empty();

//   // Calculate initial total amount
//   let totalAmount = selectedRevenueHeads.reduce(
//     (sum, head) => sum + head.amount,
//     0
//   );

//   let revIndex = 0;
//   selectedRevenueHeads.forEach((head) => {
//     revIndex++;
//     const revHeadValue = head.amount;
//     const listItem = `
//       <div class="list-group-item list-group-item-action" id="revhead-container-${revIndex}">
//         <div class="d-flex w-100 justify-content-between align-items-center">
//           <div>
//             <strong class="mb-1 text-sm text-dark">${head.item_name}</strong>
//             <p class="mb-1 text-xs text-muted">${head.mda_name}</p>
//           </div>
//           <div class="d-flex align-items-center">
//             <input
//               type="number"
//               id="revhead-${revIndex}"
//               class="form-control form-control-sm revhead-amount"
//               style="width: 120px;"
//               value="${revHeadValue}"
//               data-original-value="${revHeadValue}"
//               data-revenue-head-id="${head.revenue_head_id}"
//               data-mda-id="${head.mda_id}"
//               min="0"
//               step="0.01"
//             >
//           </div>
//         </div>
//       </div>
//     `;
//     $selectedRevenueHeadsList.append(listItem);
//   });

//   // Update total amount
//   $confirmationTotalAmount.text(`₦ ${totalAmount.toLocaleString()}`);

//   // Add event listener for amount changes
//   $selectedRevenueHeadsList.on("input", ".revhead-amount", function () {
//     // Recalculate total amount
//     totalAmount = calculateTotalAmount();
//     $confirmationTotalAmount.text(`₦ ${totalAmount.toLocaleString()}`);
//   });

//   // Reset description field
//   const $invoiceDescription = $("#invoiceDescription");
//   $invoiceDescription.val("").removeClass("is-invalid");

//   // Show confirmation modal
//   const invoiceConfirmationModal = new bootstrap.Modal(
//     document.getElementById("invoiceConfirmationModal")
//   );
//   invoiceConfirmationModal.show();
// }

// Utility function to calculate total amount
// function calculateTotalAmount() {
//   let total = 0;
//   $(".revhead-amount").each(function () {
//     const value = parseFloat($(this).val()) || 0;
//     total += value;
//   });
//   return total;
// }

// // Event listener for confirm generate button
// $("#confirmGenerateInvoice").on("click", async function () {
//   // Get description and validate
//   const $invoiceDescription = $("#invoiceDescription");
//   const description = $invoiceDescription.val().trim();

//   if (!description) {
//     $invoiceDescription.addClass("is-invalid");
//     return;
//   }

//   // Disable confirm button and show loading
//   const $confirmButton = $(this);
//   $confirmButton
//     .prop("disabled", true)
//     .html(
//       '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Generating...'
//     );

//   try {
//     // Prepare revenue heads with updated amounts
//     const updatedRevenueHeads = [];
//     $(".revhead-amount").each(function () {
//       const $input = $(this);
//       updatedRevenueHeads.push({
//         revenue_head_id: $input.data("revenue-head-id"),
//         mda_id: $input.data("mda-id"),
//         amount: parseFloat($input.val()) || 0,
//       });
//     });

//     // Prepare invoice data
//     const dataToSend = {
//       tax_number: userTaxNumber,
//       invoice_type: "direct",
//       tax_office: "Lagos Tax Office",
//       lga: "Ikeja",
//       description: description,
//       revenue_heads: updatedRevenueHeads,
//     };

//     // Send invoice generation request
//     const response = await $.ajax({
//       type: "POST",
//       url: `${HOST}/create-invoice`,
//       data: JSON.stringify(dataToSend),
//       contentType: "application/json",
//       dataType: "json",
//     });

//     // Handle response
//     if (response.status === "success") {
//       // Close modal
//       const invoiceConfirmationModal = bootstrap.Modal.getInstance(
//         document.getElementById("invoiceConfirmationModal")
//       );
//       invoiceConfirmationModal.hide();

//       Swal.fire({
//         title: "Invoice Generated Successfully",
//         text: "Your invoice has been generated successfully. You can now preview it or proceed to make payment.",
//         icon: "success",
//         showCancelButton: true,
//         confirmButtonColor: "#02a75a",
//         cancelButtonColor: "#dc3545",
//         confirmButtonText: "Preview Invoice!",
//       }).then((result) => {
//         if (result.isConfirmed) {
//           window.location.href = `../invoiceGeneration/invoice.html?invoice_number=${response.invoice_number}`;
//         }
//       });
//     } else {
//       // Show error message from server
//       throw new Error(response.message || "Invoice generation failed");
//     }
//   } catch (error) {
//     // Show error notification
//     showErrorNotification(error.message || "Failed to generate invoice");

//     // Log detailed error
//     console.error("Invoice generation error:", error);
//   } finally {
//     // Re-enable confirm button
//     $confirmButton.prop("disabled", false).html("Confirm Generate");
//   }
// });

// Optional: Add validation to prevent negative or excessive amounts
$("#selectedRevenueHeadsList").on("change", ".revhead-amount", function () {
  const $input = $(this);
  const originalValue = parseFloat($input.data("original-value"));
  const currentValue = parseFloat($input.val());

  // Prevent negative values
  if (currentValue < 0) {
    $input.val(originalValue);
    showErrorNotification("Amount cannot be negative");
    return;
  }

  // Optional: Limit increase to 20% of original value
  if (currentValue > originalValue * 1.2) {
    $input.val(originalValue * 1.2);
    showErrorNotification("Amount cannot exceed 120% of original");
  }

  // Recalculate total amount
  const totalAmount = calculateTotalAmount();
  $("#confirmationTotalAmount").text(`₦ ${totalAmount.toLocaleString()}`);
});

// Optional: Clear invalid state when typing in description
$("#invoiceDescription").on("input", function () {
  $(this).removeClass("is-invalid");
});

// Utility functions for notifications
function showSuccessNotification(message) {
  Swal.fire({
    icon: "success",
    title: "Success",
    text: message,
    showConfirmButton: false,
    timer: 3000,
  });
}

function showErrorNotification(message) {
  Swal.fire({
    icon: "error",
    title: "Error",
    text: message,
    showConfirmButton: false,
    timer: 3000,
  });
}

// Attach event listener for invoice generation
$("#genInvoice").on("click", generateInvoice);

// Fetch approved revenue heads on page load
// fetchApprovedRevenueHeads();

const currentPage = 1; // Change this if paginated
const limit = 100;

function fetchPresumptiveInvoices() {
  const $tbody = $("#presumptive-datatable tbody");
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
    url: `${HOST}/get-invoices?tax_number=${userData.tax_number}&invoice_type=presumptive`,
    dataType: "json",
    headers: {
      Authorization: "Bearer " + authToken,
      "Content-Type": "application/json",
    },
    crossDomain: true,
    success: function (response) {
      if (response.status === "success" && response.data.invoices.length > 0) {
        const invoices = response.data.invoices;
        $tbody.empty(); // Clear the loader and existing rows'

        invoices.forEach((invoice, index) => {
          const revenueHeads = invoice.revenue_heads
            .map((head) => `${head.item_name} (${head.mda_name})`)
            .join(", ");

          const paymentStatusClass =
            invoice.payment_status === "paid"
              ? "badge-success"
              : "badge-danger";

          const row = `
            <tr>
              <td>${index + 1}</td>
              <td>${invoice.invoice_number || "N/A"}</td>
              <td>Presumptive</td>
              <td>${invoice.description || "No description provided"}</td>
              <td>₦ ${parseFloat(invoice.amount_paid).toLocaleString()}</td>
              <td>${new Date(invoice.date_created).toLocaleDateString()}</td>
              <td>
                <span class="badge ${paymentStatusClass}">
                  ${invoice.payment_status}
                </span>
              </td>
              <td>
                <div>
                  <a href="../invoiceGeneration/invoice.html?invoice_number=${invoice.invoice_number
            }" class="btn btn-primary btn-sm" target="_blank">
                    View Invoice
                  </a>
                </div>
              </td>
            </tr>
          `;

          // Append to main table
          $tbody.append(row);
        });
      } else {
        const noDataRow =
          '<tr><td colspan="11" class="text-center">No presumptive found.</td></tr>';
        $tbody.html(noDataRow);
      }
    },
    error: function (err) {
      console.error("Error fetching presumptive:", err);
      const errorRow =
        '<tr><td colspan="11" class="text-center text-danger">An error occurred while fetching presumptive.</td></tr>';
      $tbody.html(errorRow);
    },
  });
}

// Fetch invoices on page load
fetchPresumptiveInvoices();

function fetchApplicableTax() {
  const loaderRow = `
    <tr class="loader-row">
      <td colspan="7" class="text-center">
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
  const $tbody = $("#applicable-taxes tbody");

  // Show loader
  $tbody.html(loaderRow);

  $.ajax({
    type: "GET",
    url: `${HOST}/get-taxpayer-applicable-taxes?tax_number=${userTaxNumber}&limit=200`, // Updated endpoint
    dataType: "json",
    headers: {
      Authorization: "Bearer " + authToken,
      "Content-Type": "application/json",
    },
    crossDomain: true,
    success: function (response) {
      if (
        response.status === "success" &&
        response.data.applicable_taxes.length > 0
      ) {
        const data = response.data.applicable_taxes;

        $tbody.empty(); // Clear existing rows

        data.forEach((item, index) => {
          const row = `
            <tr>
              <td>
                <div class="form-check">
                  <input 
                    class="form-check-input applicable-tax-checkbox" 
                    type="checkbox" 
                    value="${item.id}" 
                    id="applicableTax-${item.id}"
                    data-revenue-head-id="${item.revenue_head_id}"
                    data-tax-number="${item.tax_number}"
                    data-mdaid="${item.mda_id}"
                    data-mda-name="${item.mda_name}"
                    data-revenue-head-name="${item.revenue_head_name}"
                    data-amount="${parseFloat(item.amount)}"
                  >
                  <label class="form-check-label" for="applicableTax-${item.id
            }">
                    ${index + 1}
                  </label>
                </div>
              </td>
              <td>${item.mda_name || "N/A"}</td>
              <td>${item.revenue_head_name}</td>
              <td>${item.revenue_head_code}</td>
              <td>₦ ${parseFloat(item.amount).toLocaleString()}</td>
            </tr>
          `;
          $tbody.append(row);
        });

        // Setup select all functionality
        setupApplicableTaxCheckbox();
      } else {
        $tbody.html(
          '<tr><td colspan="7" class="text-center">No applicable taxes found.</td></tr>'
        );
      }
    },
    error: function (err) {
      $tbody.html(
        '<tr><td colspan="7" class="text-center">Error loading applicable taxes. Please try again.</td></tr>'
      );
      console.error("Error fetching applicable taxes:", err);

      // Optional: Show error toast or notification
      showErrorNotification(
        "Failed to load applicable taxes. Please refresh the page."
      );
    },
  });
}

// Utility function to format date
function formatDate(dateString) {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Select all checkbox functionality
function setupApplicableTaxCheckbox() {
  const $selectAllCheckbox = $("#select-all-applicable-taxes");
  const $individualCheckboxes = $(".applicable-tax-checkbox");
  const $selectedCountElement = $("#selectedApplicableTaxCount");

  // Function to update selected count
  function updateSelectedCount() {
    const $checkedBoxes = $individualCheckboxes.filter(":checked");
    const selectedCount = $checkedBoxes.length;

    $selectedCountElement.text(selectedCount !== 0 ? `(${selectedCount})` : "");
  }

  // Select all checkbox functionality
  $selectAllCheckbox.on("change", function () {
    const isChecked = $(this).prop("checked");
    $individualCheckboxes.prop("checked", isChecked);
    updateSelectedCount();
  });

  // Individual checkbox functionality
  $individualCheckboxes.on("change", function () {
    // Update select all checkbox if all individual checkboxes are checked/unchecked
    const allChecked =
      $individualCheckboxes.length ===
      $individualCheckboxes.filter(":checked").length;
    $selectAllCheckbox.prop("checked", allChecked);

    // Update selected count
    updateSelectedCount();
  });

  // Initial count (in case some are pre-checked)
  updateSelectedCount();
}

// Function to get selected applicable taxes
function getSelectedApplicableTaxes() {
  const selectedTaxes = [];
  $(".applicable-tax-checkbox:checked").each(function () {
    const $checkbox = $(this);
    selectedTaxes.push({
      id: $checkbox.val(),
      revenue_head_id: $checkbox.data("revenue-head-id"),
      tax_number: $checkbox.data("tax-number"),
      mda_name: $checkbox.data("mda-name"),
      mda_id: $checkbox.data("mdaid"),
      revenue_head_name: $checkbox.data("revenue-head-name"),
      amount: $checkbox.data("amount"),
    });
  });
  return selectedTaxes;
}

// Initial load
fetchApplicableTax();

async function validateSelection(selectedItems, type) {
  // Validate selection
  if (selectedItems.length === 0) {
    console.log(selectedItems);
    showErrorNotification(
      `Please select at least one ${type === "direct" ? "revenue head" : "applicable tax"
      }`
    );
    return false;
  } else {
    return true;
  }
}

// Universal Invoice Generation Function
async function generateInvoice(type = "direct") {
  let selectedItems = [];
  let $selectedItemsList, $confirmationTotalAmount;

  // Determine selection based on type
  if (type === "direct") {
    selectedItems = getSelectedRevenueHeads();
    $selectedItemsList = $("#selectedRevenueHeadsList");
    let isValid = await validateSelection(selectedItems, type);
    if (isValid) $confirmationTotalAmount = $("#confirmationTotalAmount");
  } else if (type === "applicable") {
    selectedItems = getSelectedApplicableTaxes();
    $selectedItemsList = $("#selectedRevenueHeadsList");
    let isValid = await validateSelection(selectedItems, type);
    if (isValid) $confirmationTotalAmount = $("#confirmationTotalAmount");
  } else if (type === "upcoming") {
    selectedItems = getSelectedUpcomingTaxes();
    console.log(selectedItems);
    $selectedItemsList = $("#selectedRevenueHeadsList");
    let isValid = await validateSelection(selectedItems, type);
    if (isValid) $confirmationTotalAmount = $("#confirmationTotalAmount");
  }

  // Clear previous selections
  $selectedItemsList.empty();

  // Calculate initial total amount
  let totalAmount = selectedItems.reduce(
    (sum, item) => sum + (item.amount || 0),
    0
  );

  // Populate modal with selected items
  selectedItems.forEach((item, index) => {
    const itemName = item.item_name || item.revenue_head_name;
    const mdaName = item.mda_name;
    const itemValue = item.amount || 0;
    const itemId = item.revenue_head_id || item.id;
    const mdaId = item.mda_id;

    const listItem = `
      <div class="list-group-item list-group-item-action" id="item-container-${index}">
        <div class="d-flex w-100 justify-content-between align-items-center">
          <div>
            <strong class="mb-1 text-sm text-dark">${itemName}</strong>
            <p class="mb-1 text-xs text-muted">${mdaName}</p>
          </div>
          <div class="d-flex align-items-center">
            <input 
              type="number" 
              id="item-${index}" 
              class="form-control form-control-sm invoice-item-amount" 
              style="width: 120px;" 
              value="${itemValue}"
              data-original-value="${itemValue}"
              data-item-id="${itemId}"
              data-mda-id="${mdaId}"
              min="0"
              step="0.01"
            >
          </div>
        </div>
      </div>
    `;
    $selectedItemsList.append(listItem);
  });

  // Update total amount
  $confirmationTotalAmount.text(`₦ ${parseInt(totalAmount).toLocaleString()}`);

  // Add event listener for amount changes
  $selectedItemsList.on("input", ".invoice-item-amount", function () {
    // Recalculate total amount
    totalAmount = calculateTotalAmount(".invoice-item-amount");
    $confirmationTotalAmount.text(`₦ ${totalAmount.toLocaleString()}`);
  });

  // Reset description field
  const $invoiceDescription = $("#invoiceDescription");
  $invoiceDescription.val("").removeClass("is-invalid");

  // Show confirmation modal
  const invoiceConfirmationModal = new bootstrap.Modal(
    document.getElementById("invoiceConfirmationModal")
  );
  invoiceConfirmationModal.show();
}

// Universal Confirm Generation Function
$("#confirmGenerateInvoice").on("click", async function () {
  // Get description and validate
  const $invoiceDescription = $("#invoiceDescription");
  const description = $invoiceDescription.val().trim();

  if (!description) {
    $invoiceDescription.addClass("is-invalid");
    return;
  }

  // Disable confirm button and show loading
  const $confirmButton = $(this);
  $confirmButton
    .prop("disabled", true)
    .html(
      '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Generating...'
    );

  try {
    // Prepare items with updated amounts
    const updatedItems = [];
    $(".invoice-item-amount").each(function () {
      const $input = $(this);
      updatedItems.push({
        revenue_head_id: $input.data("item-id"),
        mda_id: $input.data("mda-id"),
        amount: parseFloat($input.val()) || 0,
      });
    });

    // Prepare invoice data
    const dataToSend = {
      tax_number: userTaxNumber,
      invoice_type: "direct",
      tax_office: "Lagos Tax Office",
      lga: "Ikeja",
      description: description,
      revenue_heads: updatedItems,
    };

    // Send invoice generation request
    const response = await $.ajax({
      type: "POST",
      url: `${HOST}/create-invoice`,
      data: JSON.stringify(dataToSend),
      contentType: "application/json",
      dataType: "json",
      headers: {
        Authorization: "Bearer " + authToken,
        "Content-Type": "application/json",
      },
    });

    // Handle response
    if (response.status === "success") {
      // Close modal
      const invoiceConfirmationModal = bootstrap.Modal.getInstance(
        document.getElementById("invoiceConfirmationModal")
      );
      invoiceConfirmationModal.hide();

      Swal.fire({
        title: "Invoice Generated Successfully",
        text: "Your invoice has been generated successfully. You can now preview it or proceed to make payment.",
        icon: "success",
        showCancelButton: true,
        confirmButtonColor: "#02a75a",
        cancelButtonColor: "#dc3545",
        confirmButtonText: "Preview Invoice!",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = `../invoiceGeneration/invoice.html?invoice_number=${response.invoice_number}`;
        }
      });
    } else {
      // Show error message from server
      throw new Error(response.message || "Invoice generation failed");
    }
  } catch (error) {
    // Show error notification
    showErrorNotification(error.message || "Failed to generate invoice");

    // Log detailed error
    console.error("Invoice generation error:", error);
  } finally {
    // Re-enable confirm button
    $confirmButton.prop("disabled", false).html("Confirm Generate");
  }
});

// Utility function to calculate total amount
function calculateTotalAmount(selector) {
  let total = 0;
  $(selector).each(function () {
    const value = parseFloat($(this).val()) || 0;
    total += value;
  });
  return total;
}

// Event Listeners
$("#genInvoice").on("click", () => generateInvoice("direct"));
$("#genApplicableInvoice").on("click", () => generateInvoice("applicable"));
$("#genUpcomingInvoice").on("click", () => generateInvoice("upcoming"));

$(document).ready(function () {
  // Initialize DataTable for Upcoming Taxes
  if ($.fn.DataTable.isDataTable("#upcoming-taxes")) {
    $("#upcoming-taxes").DataTable().clear().destroy();
  }

  const upcomingTable = $("#upcoming-taxes").DataTable({
    serverSide: true,
    paging: true,
    ordering: false,
    pageLength: 50,
    responsive: true,
    searchDelay: 500,
    pagingType: "simple_numbers",
    ajax: function (data, callback) {
      const pageNumber = Math.ceil(data.start / data.length) + 1;

      const filters = {
        page: pageNumber,
        limit: data.length,
        tax_number: userTaxNumber,
      };

      $.ajax({
        url: `${HOST}/get-upcoming-taxes`,
        type: "GET",
        data: filters,
        headers: {
          Authorization: "Bearer " + authToken,
          "Content-Type": "application/json",
        },
        dataType: "json",
        beforeSend: function () {
          $("#upcoming-taxes tbody").html(`
                      <tr class="loader-row">
                          <td colspan="6" class="text-center">
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
                  `);
        },
        success: function (response) {
          if (response.length > 0) {
            callback({
              draw: data.draw,
              recordsTotal: response.length,
              recordsFiltered: response.length,
              data: response,
            });
          } else {
            $("#upcoming-taxes tbody").html(`
                          <tr>
                              <td colspan="6" class="text-center text-muted">
                                  No upcoming tax data found.
                              </td>
                          </tr>
                      `);
            callback({
              draw: data.draw,
              recordsTotal: 0,
              recordsFiltered: 0,
              data: [],
            });
          }
        },
        error: function (err) {
          console.error("Error fetching upcoming tax data:", err);
          $("#upcoming-taxes tbody").html(`
                      <tr>
                          <td colspan="6" class="text-center text-danger">
                              Error loading upcoming taxes. Please try again.
                          </td>
                      </tr>
                  `);
          callback({
            draw: data.draw,
            recordsTotal: 0,
            recordsFiltered: 0,
            data: [],
          });
        },
      });
    },
    columns: [
      {
        data: null,
        render: function (data, type, row, meta) {
          return `
                      <div class="form-check">
                          <input 
                              class="form-check-input upcoming-tax-checkbox" 
                              type="checkbox" 
                              value="${row.id}" 
                              id="upcomingTax-${row.id}"
                              data-mdaid="${row.mda_id}"
                              data-mdaname="${row.mda_name}"
                              data-itemname="${row.item_name}"
                              data-revenue_head_id="${row.revenue_head_id}"
                              data-amount="${row.amount}"
                              data-next_due_date="${row.next_due_date}"
                              data-next_payment_date="${row.next_payment_date}"
                          >
                          <label class="form-check-label" for="upcomingTax-${row.id
            }">
                              ${meta.row + 1}
                          </label>
                      </div>`;
        },
      },
      { data: "mda_name", defaultContent: "N/A" },
      { data: "item_name", defaultContent: "N/A" },
      { data: "category", defaultContent: "N/A" },
      { data: "frequency", defaultContent: "N/A" },
      {
        data: "amount",
        render: function (data) {
          return `₦ ${parseFloat(data || 0).toLocaleString()}`;
        },
      },
    ],
    drawCallback: function () {
      // Re-initialize any interactive elements like select-all after each draw
      setupUpcomingTaxCheckbox();
    },
  });
});

function setupUpcomingTaxCheckbox() {
  const $selectAllCheckbox = $("#select-all-applicable-taxes");
  const $individualCheckboxes = $(".upcoming-tax-checkbox");
  const $selectedCountElement = $("#selectedUpcomingTaxCount");

  // Function to update selected count
  function updateSelectedCount() {
    const $checkedBoxes = $individualCheckboxes.filter(":checked");
    const selectedCount = $checkedBoxes.length;

    $selectedCountElement.text(selectedCount !== 0 ? `(${selectedCount})` : "");
  }

  // Select all checkbox functionality
  $selectAllCheckbox.on("change", function () {
    const isChecked = $(this).prop("checked");
    $individualCheckboxes.prop("checked", isChecked);
    updateSelectedCount();
  });

  // Individual checkbox functionality
  $individualCheckboxes.on("change", function () {
    const selectedCheckbox = $(this);
    const nextPaymentDate = new Date(
      selectedCheckbox.data("next_payment_date")
    );
    const currentDate = new Date();

    // Check if the selected checkbox is checked
    if (selectedCheckbox.is(":checked")) {
      // Compare current date with next payment date
      if (currentDate < nextPaymentDate) {
        // Show SweetAlert notification
        Swal.fire({
          icon: "error",
          title: "Selection Error",
          text: `You cannot select this tax before the next payment date: ${formatDate(
            nextPaymentDate
          )}`,
          confirmButtonText: "OK",
        });

        // Uncheck the checkbox if the date condition is not met
        selectedCheckbox.prop("checked", false);
      }
    }

    // Update select all checkbox if all individual checkboxes are checked/unchecked
    const allChecked =
      $individualCheckboxes.length ===
      $individualCheckboxes.filter(":checked").length;
    $selectAllCheckbox.prop("checked", allChecked);

    // Update selected count
    updateSelectedCount();
  });

  // Initial count (in case some are pre-checked)
  updateSelectedCount();
}

function getSelectedUpcomingTaxes() {
  const selectedTaxes = [];
  $(".upcoming-tax-checkbox:checked").each(function () {
    const $checkbox = $(this);
    selectedTaxes.push({
      id: $checkbox.val(),
      revenue_head_id: $checkbox.data("revenue_head_id"),
      mda_name: $checkbox.data("mdaname"),
      mda_id: $checkbox.data("mdaid"),
      revenue_head_name: $checkbox.data("itemname"),
      amount: $checkbox.data("amount"),
      nextDue: $checkbox.data("next_due_date"),
      nextPayment: $checkbox.data("next_payment_date"),
    });
  });
  return selectedTaxes;
}
