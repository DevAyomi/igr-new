const mdaId = getParameterByName("id");
const $tableBody = $("#datatable tbody");
const $pagination = $("#pagination");
const $loader = $(".loader"); // Select the loader
let currentPage = 1;
const limit = 50;
let fetchedData;

// Function to fetch and render MDA data

function fetchMdaData() {
  showLoader(true); // Show the loader
  $.ajax({
    type: "GET",
    url: `${HOST}/get-mda?id=${mdaId}`,
    dataType: "json",
    headers: {
      Authorization: "Bearer " + authToken,
      "Content-Type": "application/json",
    },
    crossDomain: true,
    success: function (response) {
      if (response.status === "success" && response.data.length > 0) {
        const mda = response.data[0];
        $(".mdaname").text(mda.fullname);
        $("#mdaemail").text(mda.email);
        $("#mdaindustry").text(mda.industry);
        $("#mdaphone").text(mda.phone);
        $("#mdastate").text(mda.state);
        $("#mdalga").text(mda.lga);
        $("#mdaaddress").text(mda.address);
        $(".revenueHeadCount").text(mda.total_revenue_heads);
        $("#mdatime").text(new Date(mda.time_in).toLocaleDateString());
        $("#allowPayment").prop("checked", mda.allow_payment === "yes");
        $("#allowOffices").prop("checked", mda.allow_office_creation === "yes");
      } else {
        alert("No data found for this MDA.");
      }
    },
    error: function (err) {
      console.error("Error fetching data:", err);
      alert("An error occurred while fetching the data.");
    },
  });
}

// Fetch initial data
fetchMdaData();

function fetchMdaUsers() {
  const $tbody = $("#mdauser-table tbody");
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
    url: `${HOST}/get-mda-users?mda_id=${mdaId}`,
    dataType: "json",
    headers: {
      Authorization: "Bearer " + authToken,
      "Content-Type": "application/json",
    },
    crossDomain: true,
    success: function (response) {
      if (response.status === "success" && response.data.length > 0) {
        const users = response.data;
        $tbody.empty(); // Clear the loader and existing rows

        users.forEach((user, index) => {
          const row = `
                <tr>
                  <td>${index + 1}</td>

                  <td>${user.name || "N/A"}</td>
            <td>${user.email}</td>
            <td>${user.phone}</td>
            <td>${user.office_name}</td>
                  <td>${new Date(user.created_at).toLocaleDateString()}</td>
                  
                </tr>
              `;
          $tbody.append(row);
        });
      } else {
        $tbody.html(
          '<tr><td colspan="16" class="text-center">No users found.</td></tr>'
        );
      }
    },
    error: function (err) {
      console.error("Error fetching payments:", err);
      $tbody.html(
        '<tr><td colspan="16" class="text-center text-danger">An error occurred while fetching mda users.</td></tr>'
      );
    },
  });
}

fetchMdaUsers();

// Function to fetch and render approved revenue head data
function fetchApprovedRevenueHeads() {
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
  const $tbody = $("#datatable2 tbody");
  // Show loader
  $tbody.html(loaderRow);
  $.ajax({
    type: "GET",
    url: `${HOST}/get-revenue-head?mda_id=${mdaId}&status=1`,
    dataType: "json",
    headers: {
      Authorization: "Bearer " + authToken,
      "Content-Type": "application/json",
    },
    crossDomain: true,
    success: function (response) {
      if (response.status === "success" && response.data.length > 0) {
        const data = response.data;
        fetchedData = response.data;

        $tbody.empty(); // Clear existing rows

        data.forEach((item, index) => {
          const row = `
              <tr>
                <td>${index + 1}</td>
                <td>${item.item_name}</td>
                <td>${item.category}</td>
                <td>${item.item_code}</td>
                <td>${item.frequency}</td>
                <td>₦ ${parseFloat(item.amount).toLocaleString()}</td>
                <td>₦ ${parseFloat(
            item.total_revenue_generated
          ).toLocaleString()}</td>
                <td>
                ${!hasPermission(11) ? '' : `
                  <button class="btn btn-secondary applicableTaxBtn" data-bs-toggle="modal"
                    data-bs-target="#applicableTaxModal" data-revid="${item.id
              }">
                    <i class="fas fa-link"></i>
                  </button>
                  <button
                    data-bs-toggle="modal"
                    data-bs-target="#editRevenueHeadModal"
                    class="btn btn-primary editRevenueHead"
                    data-revid="${item.id}"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <button
                    onclick="deleteRevenueHead(this)"
                    data-revid="${item.id}"
                    class="btn btn-danger"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                `}
                  
                </td>
              </tr>
            `;
          $tbody.append(row);
        });
      } else {
        $tbody.html(
          '<tr><td colspan="11" class="text-center">No revenue head data found for this MDA.</td></tr>'
        );
      }
    },
    error: function (err) {
      $tbody.html(
        '<tr><td colspan="11" class="text-center">No revenue head data found for this MDA.</td></tr>'
      );
      console.error("Error fetching revenue head data:", err);
      // alert("An error occurred while fetching the revenue head data.");
    },
  });
}

// Fetch the approved revenue head data on page load
fetchApprovedRevenueHeads();

// Function to fetch and render approved revenue head data
function fetchApprovalRequestRevenueHeads() {
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
  const $tbody = $("#datatable1 tbody");
  // Show loader
  $tbody.html(loaderRow);
  $.ajax({
    type: "GET",
    url: `${HOST}/get-revenue-head?mda_id=${mdaId}&status=2`,
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
                <td>${index + 1}</td>
                <td>${item.item_name}</td>
                <td>${item.category}</td>
                <td>${item.item_code}</td>
                <td>${item.frequency}</td>
                <td>₦ ${parseFloat(item.amount).toLocaleString()}</td>
                <td>₦ ${parseFloat(
            item.total_revenue_generated
          ).toLocaleString()}</td>
                <td>
                  ${!hasPermission(12) ? '' : `
                    <button class="btn-primary btn-sm btn approve-btn" data-rev-id="${item.id}">
                      Approve
                    </button>
                  `}
                </td>
              </tr>
            `;
          $tbody.append(row);
        });

        // Attach event listener after appending rows
        $tbody.on("click", ".approve-btn", async function () {
          const revenueHeadId = $(this).data("rev-id");
          approveRevenueHead(revenueHeadId);
          fetchApprovalRequestData(currentPage);
        });
      } else {
        $tbody.html(
          '<tr><td colspan="11" class="text-center">No revenue head data found for this MDA.</td></tr>'
        );
      }
    },
    error: function (err) {
      $tbody.html(
        '<tr><td colspan="11" class="text-center">No approval request found for this MDA.</td></tr>'
      );
      console.error("Error fetching approval request revenue head data:", err);
      // alert("An error occurred while fetching approval request the revenue head data.");
    },
  });
}

function approveRevenueHead(revenueHeadId) {
  // Confirmation dialog using Swal
  Swal.fire({
    title: "Revenue Approval Request",
    text: "Do you want to approve this request?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#02a75a",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, approve it!",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: "Approving...",
        text: "Please wait while the request is processed",
        didOpen: () => {
          Swal.showLoading();
        },
        allowOutsideClick: () => !Swal.isLoading(),
      });

      // AJAX request to approve revenue head
      const approveData = {
        id: revenueHeadId,
      };
      $.ajax({
        type: "PUT",
        url: `${HOST}/approve-revenue-head?id=${revenueHeadId}`,
        dataType: "json",
        headers: {
          Authorization: "Bearer " + authToken,
          "Content-Type": "application/json",
        },
        data: JSON.stringify(approveData),
        success: function (response) {
          if (response.status === "success") {
            // Show success message
            Swal.fire({
              title: "Approved!",
              text: "Revenue Head has been approved successfully.",
              icon: "success",
              timer: 2000,
              showConfirmButton: false,
            });

            // Reload the table after approval
            setTimeout(() => {
              fetchApprovalRequestData(currentPage);
            }, 1000);
          } else {
            // Show error message for failure
            Swal.fire({
              title: "Approval Failed",
              text: response.message || "Something went wrong, try again!",
              icon: "error",
            });
          }
        },
        error: function (xhr, status, error) {
          // Handle specific error scenarios
          let errorMessage = "An error occurred while approving.";
          let errorTitle = "Error!";

          // Check for specific error response
          if (xhr.responseJSON) {
            const response = xhr.responseJSON;

            // Handle 400 status specifically
            if (xhr.status === 400) {
              errorTitle = "Approval Not Possible";
              errorMessage =
                response.message ||
                "The revenue head cannot be approved at this time.";
            } else if (response.message) {
              errorMessage = response.message;
            }
          }

          // Display error with more detailed information
          Swal.fire({
            title: errorTitle,
            html: `
              <div>${errorMessage}</div>
              ${xhr.status
                ? `<small class="text-muted">Status Code: ${xhr.status}</small>`
                : ""
              }
            `,
            icon: "error",
            footer:
              '<a href="javascript:void(0)" class="text-primary">Contact support if the issue persists</a>',
          });

          // Log the full error for debugging
          console.error("Approval error:", {
            status: xhr.status,
            responseText: xhr.responseText,
            errorThrown: error,
          });
        },
      });
    }
  });
}

// Fetch the approved revenue head data on page load
fetchApprovalRequestRevenueHeads();

// Function to toggle loader visibility
function showLoader(visible) {
  if (visible) {
    $loader.show(); // Show the loader
  } else {
    $loader.hide(); // Hide the loader
  }
}

$("#createRevBtn").on("click", function () {
  $(".form-group .error-message").remove();

  const revenueHeadData = {
    mda_id: mdaId,
    item_name: $("#createRevenueHeadModal #revHeadName").val().trim(),
    item_code: $("#createRevenueHeadModal #code").val().trim(),
    amount: $("#createRevenueHeadModal #amount").val().trim(),
    category: $("#createRevenueHeadModal #category").val(), // Corrected selector
    frequency: $("#createRevenueHeadModal #frequency").val(), // Corrected selector
    status: $("#createRevenueHeadModal #status").val() === "1" ? 1 : 2,
  };

  // Validation errors object
  const validationErrors = {};

  // Validate required fields
  if (!revenueHeadData.item_name)
    validationErrors.revHeadName = "Name is required.";

  if (!revenueHeadData.item_code)
    validationErrors.code = "Revenue code is required.";
  if (!revenueHeadData.amount) validationErrors.amount = "Amount is required.";
  if (!revenueHeadData.frequency)
    validationErrors.frequency = "Frequency is required.";
  if (!revenueHeadData.category)
    validationErrors.category = "Category is required.";

  // Show error messages under each field
  for (const fieldId in validationErrors) {
    const errorMessage = `<small class="text-danger error-message">${validationErrors[fieldId]}</small>`;
    $(`#${fieldId}`).closest(".form-group").append(errorMessage);
  }

  // If validation errors exist, stop form submission
  if (Object.keys(validationErrors).length > 0) {
    return;
  }
  $("#createRevBtn").prop("disabled", true).text("Creating...");
  // AJAX request
  $.ajax({
    type: "POST",
    url: `${HOST}/create-revenue-head`, // Replace with your actual API endpoint
    headers: {
      Authorization: "Bearer " + authToken,
      "Content-Type": "application/json",
    },
    data: JSON.stringify(revenueHeadData),
    success: function (response) {
      if (response.status === "success") {
        // Show success message
        Swal.fire({
          icon: "success",
          title: "Revenue Head Created",
          text: "The Revenue Head has been successfully created.",
          confirmButtonText: "OK",
        }).then(() => {
          // Close modal
          $("#createRevenueHeadModal").modal("hide");
          fetchApprovedRevenueHeads();
          fetchApprovalRequestRevenueHeads();
          // Optionally refresh Revenue Head list or perform other actions
        });
      } else {
        // Show error message
        Swal.fire({
          icon: "error",
          title: "Creation Failed",
          text: response.message || "Failed to create Revenue Head",
          confirmButtonText: "Try Again",
        });
      }
    },
    error: function (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.responseJSON.message ||
          "Something went wrong. Please try again.",
        confirmButtonText: "OK",
      });
    },
    complete: function () {
      // Reset submit button
      $("#createRevBtn").prop("disabled", false).text("Create Revenue Head");
    },
  });
});

function populateEditRevenueHeadModal(revenueHead) {
  $("#editRevenueHeadModal #revHeadName").val(revenueHead.item_name);
  $("#editRevenueHeadModal #category").val(revenueHead.category);
  $("#editRevenueHeadModal #code").val(revenueHead.item_code);
  $("#editRevenueHeadModal #amount").val(revenueHead.amount);
  $("#editRevenueHeadModal #frequency").val(revenueHead.frequency);
  $("#editRevenueHeadModal #status").val(
    revenueHead.status === "active" ? 1 : 2
  );
}

// Event listener for Edit button
$(document).on("click", ".editRevenueHead", function () {
  const revId = $(this).data("revid"); // Retrieve the revenue head ID from the button
  const revenueHead = fetchedData.find((item) => item.id === revId); // Find matching data
  if (revenueHead) {
    $("#editRevenueHeadModal #revHeadId").val(revId); // Hidden input for ID
    populateEditRevenueHeadModal(revenueHead);
  }
});

$("#editRevenueHeadModal #editRevenueHeadSubmitBtn").on("click", function () {
  const updatedData = {
    revenue_head_id: $("#editRevenueHeadModal #revHeadId").val(), // Hidden field for ID
    item_name: $("#editRevenueHeadModal #revHeadName").val(),
    category: $("#editRevenueHeadModal #category").val(),
    item_code: $("#editRevenueHeadModal #code").val(),
    amount: $("#editRevenueHeadModal #amount").val(),
    frequency: $("#editRevenueHeadModal #frequency").val(),
    status: $("#editRevenueHeadModal #status").val(),
  };

  // UI feedback: Disable button and show loading spinner
  $("#editRevenueHeadSubmitBtn")
    .prop("disabled", true)
    .html(
      '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Updating...'
    );

  $.ajax({
    type: "POST",
    url: `${HOST}/update-revenue-head`,
    data: JSON.stringify(updatedData),
    headers: {
      Authorization: "Bearer " + authToken,
      "Content-Type": "application/json",
    },
    success: function (response) {
      if (response.status === "success") {
        // Show success message
        Swal.fire({
          icon: "success",
          title: "Revenue Head Updated",
          text: "The Revenue Head has been successfully updated.",
          confirmButtonText: "OK",
        }).then(() => {
          // Close modal
          $("#editRevenueHeadModal").modal("hide");
          fetchApprovedRevenueHeads(); // Refresh table data
          // Optionally refresh Revenue Head list or perform other actions
        });
      } else {
        // Show error message
        Swal.fire({
          icon: "error",
          title: "Updation Failed",
          text: response.message || "Failed to update Revenue Head",
          confirmButtonText: "Try Again",
        });
      }
    },
    error: function (err) {
      Swal.fire({
        icon: "error",
        title: "Updation Failed",
        text: response.message || "Failed to update Revenue Head",
        confirmButtonText: "Try Again",
      });
      console.error("Error updating revenue head:", err);
      // alert("An error occurred while updating the revenue head.");
    },
    complete: function () {
      $("#editRevenueHeadSubmitBtn")
        .prop("disabled", false)
        .html("Save Changes"); // Restore button
    },
  });
});

function deleteRevenueHead(button) {
  const revenueHeadId = $(button).data("revid");

  const deleteData = {
    id: revenueHeadId,
  };

  // Confirmation dialog using Swal
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: "Deleting..",
        text: "Wait while we delete the revenue head!",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      // AJAX request to delete revenue head
      $.ajax({
        type: "PUT",
        url: `${HOST}/delete-revenue-head?id=${revenueHeadId}`,
        headers: {
          Authorization: "Bearer " + authToken,
          "Content-Type": "application/json",
        },
        data: JSON.stringify(deleteData),
        success: function (response) {
          if (response.status === "success") {
            // Show success message
            Swal.fire("Deleted!", "Revenue Head has been deleted.", "success");

            // Reload the table after deletion
            fetchApprovedRevenueHeads();
            fetchMdaData();
          } else {
            // Show error message for failure
            Swal.fire(
              "Failed!",
              response.message || "Something went wrong, try again!",
              "error"
            );
          }
        },
        error: function (xhr, status, error) {
          // Handle specific error scenarios
          let errorMessage = "An error occurred while deleting.";
          let errorTitle = "Error!";

          // Check for specific error response
          if (xhr.responseJSON) {
            const response = xhr.responseJSON;

            // Handle 400 status specifically
            if (xhr.status === 400) {
              errorTitle = "Deletion Not Possible";
              errorMessage =
                response.message ||
                "The revenue head cannot be deleted at this time.";
            } else if (response.message) {
              errorMessage = response.message;
            }
          }

          // Display error with more detailed information
          Swal.fire({
            title: errorTitle,
            html: `
              <div>${errorMessage}</div>
              ${xhr.status
                ? `<small class="text-muted">Status Code: ${xhr.status}</small>`
                : ""
              }
            `,
            icon: "error",
            footer:
              '<a href="javascript:void(0)" class="text-primary">Contact support if the issue persists</a>',
          });

          // Log the full error for debugging
          console.error("Deletion error:", {
            status: xhr.status,
            responseText: xhr.responseText,
            errorThrown: error,
          });
        },
      });
    }
  });
}

// Event listener for Applicable button
$(document).on("click", ".applicableTaxBtn", function () {
  const revId = $(this).data("revid"); // Retrieve the revenue head ID from the button
  const revenueHead = fetchedData.find((item) => item.id === revId); // Find matching data
  fetchRevenueHeadData(revId);
  fetchTaxDependencies(revId);
  $("#applicableTaxModal").show();
  $("#applicableTaxModal #revHeadId").val(revId);
});

const revenueHeadSelectize = $("#revenueHead").selectize({
  placeholder: "Select a revenue head...",
});
async function fetchRevenueHeadData(revId) {
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
      const revenueHeadSelectizeInstance = revenueHeadSelectize[0].selectize;

      // Clear existing options
      revenueHeadSelectizeInstance.clearOptions();

      if (response.status === "success" && response.data.length > 0) {
        const revenueHeads = response.data;

        // Add default placeholder option
        revenueHeadSelectizeInstance.addOption({
          value: "",
          text: "Select a revenue head...",
        });

        // Populate Revenue Head options
        revenueHeads.forEach((revenueHead) => {
          revenueHeadSelectizeInstance.addOption({
            value: revenueHead.id,
            text: revenueHead.item_name,
          });
        });

        // Refresh Selectize options
        revenueHeadSelectizeInstance.refreshOptions(false);
      } else {
        revenueHeadSelectizeInstance.addOption({
          value: "",
          text: "No revenue heads available.",
        });
        revenueHeadSelectizeInstance.refreshOptions(false);
      }
    },
    error: function (err) {
      console.error("Error fetching Revenue Heads:", err);
      alert("An error occurred while fetching the Revenue Heads.");
    },
  });
}

async function fetchTaxDependencies(revId) {
  console.log(revId);
  const $selectedTaxDependenciesList = $("#selectedTaxDependenciesList");
  $.ajax({
    type: "GET",
    url: `${HOST}/get-tax-dependencies?primary_tax_id=${revId}`,
    dataType: "json",
    headers: {
      Authorization: "Bearer " + authToken,
      "Content-Type": "application/json",
    },
    crossDomain: true,
    success: function (response) {
      $selectedTaxDependenciesList.empty();

      const data = response.data;
      const dependencies = data.dependencies;

      if (dependencies.length === 0) {
        $selectedTaxDependenciesList.html(`
          <div class="text-center text-muted py-3">
            No tax dependencies found
          </div>
        `);
        return;
      }

      let depIndex = 0;
      dependencies.forEach((dep) => {
        depIndex++;
        const listItem = `
          <div class="list-group-item list-group-item-action" id="revhead-container-${depIndex}">
            <div class="d-flex w-100 justify-content-between align-items-center">
              <div>
                <strong class="mb-1 text-sm text-dark">${dep.dependent_tax_name
          }</strong>
                <p class="mb-1 text-xs text-muted">
                  ${dep.primary_tax_name} 
                  <span class="badge ${dep.mandatory === "yes" ? "bg-success" : "bg-secondary"
          } ms-2">
                    ${dep.mandatory === "yes" ? "Mandatory" : "Optional"}
                  </span>
                </p>
              </div>
              <div class="d-flex align-items-center">
                <button type="button" 
                  id="depTax-${depIndex}" 
                  class="btn btn-danger btn-sm deleteBtn" 
                  data-primary-tax-id="${dep.primary_tax_id}"
                  data-dep-id="${dep.id}"
                  data-dependent-tax-id="${dep.dependent_tax_id}"
                ><i class="fa fa-trash"></i></button>
              </div>
            </div>
          </div>
        `;
        $selectedTaxDependenciesList.append(listItem);
      });
    },
    error: function (err) {
      console.error("Error fetching Revenue Heads:", err);
      alert("An error occurred while fetching the Revenue Heads.");
    },
  });
}

$("#applicableTaxModal #applicableSubmitBtn").on("click", function () {
  const updatedData = {
    primary_tax_id: $("#applicableTaxModal #revHeadId").val(), // Hidden field for ID
    dependent_tax_id: $("#applicableTaxModal #revenueHead").val(),
    mandatory: $("input[name='mandatory']:checked").val(), // Get selected radio value
  };

  // Validate input
  if (!updatedData.dependent_tax_id) {
    Swal.fire({
      icon: "warning",
      title: "Validation Error",
      text: "Please select a revenue head",
    });
    return;
  }

  // UI feedback: Disable button and show loading spinner
  $("#applicableSubmitBtn")
    .prop("disabled", true)
    .html(
      '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Saving...'
    );

  $.ajax({
    type: "POST",
    url: `${HOST}/tax-dependencies`,
    data: JSON.stringify(updatedData),
    headers: {
      Authorization: "Bearer " + authToken,
      "Content-Type": "application/json",
    },
    success: function (response) {
      if (response.status === "success") {
        // Show success message
        Swal.fire({
          icon: "success",
          title: "Dependency Added",
          text: "Tax dependency has been successfully added.",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
        });

        // Refresh dependencies list
        const revId = $("#applicableTaxModal #revHeadId").val();
        fetchTaxDependencies(revId);

        // Reset form
        $("#applicableTaxModal #revenueHead")[0].selectize.clear();
        $("#mandatoryNo").prop("checked", true); // Reset to 'No'
      } else {
        // Show error message
        Swal.fire({
          icon: "error",
          title: "Addition Failed",
          text: response.message || "Failed to add Revenue Head Dependency",
          confirmButtonText: "Try Again",
        });
      }
    },
    error: function (err) {
      console.error("Error adding revenue head dependency:", err);
      Swal.fire({
        icon: "error",
        title: "Addition Failed",
        text:
          err.responseJSON?.message || "Failed to add Revenue Head Dependency",
        confirmButtonText: "Try Again",
      });
    },
    complete: function () {
      $("#applicableSubmitBtn").prop("disabled", false).html("Save Changes");
    },
  });
});

$(document).on("click", ".deleteBtn", function () {
  const $button = $(this);
  const primaryTaxId = $button.data("primary-tax-id");
  const dependentTaxId = $button.data("dependent-tax-id");
  const depId = $button.data("dep-id");

  // Confirm deletion
  Swal.fire({
    title: "Are you sure?",
    text: "Do you want to remove this tax dependency?",
    icon: "warning",
    showCancelButton: true,
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, remove it!",
  }).then((result) => {
    if (result.isConfirmed) {
      $button
        .prop("disabled", true)
        .html('<span class="spinner-border spinner-border-sm"></span>');
      // Perform deletion
      $.ajax({
        type: "POST",
        url: `${HOST}/delete-tax-dependencies`,
        data: JSON.stringify({
          id: depId,
        }),
        headers: {
          Authorization: "Bearer " + authToken,
          "Content-Type": "application/json",
        },
        success: function (response) {
          if (response.status === "success") {
            // Remove the item from the list
            $button.closest(".list-group-item").remove();

            // Show success notification
            Swal.fire({
              icon: "success",
              title: "Dependency Removed",
              text: "Tax dependency has been successfully deleted.",
              toast: true,
              position: "top-end",
              showConfirmButton: false,
              timer: 3000,
            });

            // Refresh dependencies list
            const revId = $("#applicableTaxModal #revHeadId").val();
            fetchTaxDependencies(revId);
          } else {
            // Show error message
            Swal.fire({
              icon: "error",
              title: "Deletion Failed",
              text: response.message || "Failed to remove tax dependency",
            });
            $button.prop("disabled", false).html('<i class="fa fa-trash"></i>');
          }
        },
        error: function (err) {
          console.error("Error deleting tax dependency:", err);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "An error occurred while removing the tax dependency",
          });
          $button.prop("disabled", false).html('<i class="fa fa-trash"></i>');
        },
      });
    }
  });
});

$(document).ready(function () {
  $("#bulkCreateRevenueHeadModal").on(
    "click",
    "#submitBulkCreate",
    function () {
      $("#submitBulkCreate").prop("disabled", true).text("Uploading...");
      const fileInput = $("#csv-file")[0];
      if (fileInput.files.length === 0) {
        Swal.fire({
          icon: "warning",
          title: "Oops",
          text: "Please select a CSV file to upload.",
          confirmButtonText: "Ok",
        });
        return;
      }

      const file = fileInput.files[0];
      const reader = new FileReader();

      reader.onload = function (event) {
        const csvData = event.target.result;
        const revenueHeads = parseCSV(csvData);

        // Prepare payload
        const payload = {
          revenue_heads: revenueHeads.map((head) => ({
            ...head,
            mda_id: mdaId, // Add mda_id to each revenue head
          })),
        };

        console.log(payload);

        // Send data to API
        $.ajax({
          url: `${HOST}/create-multiple-revenue-heads`, // Replace with your API endpoint
          type: "POST",
          contentType: "application/json",
          data: JSON.stringify(payload),
          headers: {
            Authorization: "Bearer " + authToken,
            "Content-Type": "application/json",
          },
          beforeSend: function () {
            $("#submitBulkCreate").prop("disabled", true).text("Creating...");
          },
          success: function (response) {
            if (response.status === "success") {
              Swal.fire({
                icon: "success",
                title: "Revenue Head Created",
                text: "The Revenue Head has been successfully created.",
                confirmButtonText: "OK",
              }).then(() => {
                // Close modal
                $("#bulkCreateRevenueHeadModal").modal("hide");
                fetchApprovedRevenueHeads();
                fetchApprovalRequestRevenueHeads();
                fetchMdaData();
                // Optionally refresh Revenue Head list or perform other actions
              });
              // Check for errors in the response
              if (response.errors && response.errors.length > 0) {
                showErrorModal(response);
              }
            } else {
              // Handle unexpected error response
              showErrorModal(response);
            }
          },
          error: function (error) {
            Swal.fire({
              icon: "error",
              title: "Error",
              text:
                error.responseJSON.message ||
                "Something went wrong. Please try again.",
              confirmButtonText: "OK",
            });
          },
          complete: function () {
            $("#submitBulkCreate").prop("disabled", false).text("Upload");
          },
        });
      };

      function showErrorModal(response) {
        // Set the main error message
        $("#errorMessage").text(response.message || "An error occurred.");

        // Clear previous error list
        $("#errorList").empty();

        // Populate the error list
        if (response.errors && response.errors.length > 0) {
          response.errors.forEach((error) => {
            const listItem = `
            <div class="list-group-item list-group-item-action">
              <div>
                <p class="mb-1 text-xs text-danger">
                ${error.message}
                </p>
                <strong class="mb-1 text-sm text-dark">
                ${error.revenue_head.item_code} - ${error.revenue_head.item_name}
                </strong>
              </div>
            </div>
            `;
            $("#errorList").append(listItem);
          });
        }

        // Add instruction for reuploading
        const instructionMessage = `
        <ul class="text-sm">
            <li>Please correct the errors listed above and reupload the affected items.</li>
            <li>Ensure that the item codes and names are unique and follow the required format.</li>
        </ul>
        `;
        $("#errorList").append(instructionMessage);

        // Show the error modal
        $("#errorModal").modal("show");
      }

      reader.readAsText(file);
    }
  );

  function parseCSV(data) {
    const lines = data.split("\n");
    const result = [];
    const headers = lines[0].split(",").map((header) => header.trim());

    for (let i = 1; i < lines.length; i++) {
      const obj = {};
      const currentLine = lines[i].split(",").map((value) => value.trim());

      if (currentLine.length === headers.length) {
        headers.forEach((header, index) => {
          obj[header] = currentLine[index];
        });

        // Convert categories to an array if it's a string
        if (obj.category) {
          obj.category = obj.category.split(",").map((cat) => cat.trim());
        }

        // Convert amount to a number
        if (obj.amount) {
          obj.amount = parseFloat(obj.amount);
        }

        // Set default status if not provided
        obj.status = obj.status ? parseInt(obj.status) : 1;

        result.push(obj);
      }
    }

    return result;
  }
});
