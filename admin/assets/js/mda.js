const $tableBody = $("#datatable tbody");
const $tableBody2 = $("#datatable1 tbody");
const $pagination = $("#pagination");
const $loader = $(".loader"); // Select the loader
let currentPage = 1;
const limit = 50;
let fetchedData;

let dataToExport;

// Modify the fetchMdaData function to accept filters
function fetchMdaData(page, filters = {}) {
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
  $tableBody.html(loaderRow);

  // Construct the query parameters
  const queryParams = new URLSearchParams({
    page,
    limit,
    ...filters, // Spread the filters into the query parameters
  }).toString();

  $.ajax({
    type: "GET",
    url: `${HOST}/get-mda?${queryParams}`,
    dataType: "json",
    headers: {
      Authorization: "Bearer " + authToken,
      "Content-Type": "application/json",
    },
    crossDomain: true,
    success: function (response) {
      $tableBody.empty();
      if (!hasPermission(7)) { // View MDA List
        $tableBody.html(`
          <tr>
            <td colspan="11" class="text-center text-warning font-bold">You don't have access to view mda list.</td>
          </tr>
        `);
      } else {
        $('#mda-actions').removeClass('d-none')
        if (response.status === "success") {
          dataToExport = response.data;
          renderTable(response.data);
          fetchedData = response.data;
          // renderPagination(response.data);
        } else {
          alert(response.message || "Failed to fetch data.");
        }
      }

    },
    error: function (err) {
      showLoader(false); // Hide the loader
      console.error("Error fetching data:", err);
      $tableBody.html(`
        <tr>
          <td colspan="11" class="text-center text-danger">Failed to load mdas</td>
        </tr>
      `);
    },
  });
}

// Event listener for the "Apply" button
$("#filterInvoiceModal #applyFilter").on("click", function () {
  const filters = {
    fullname: $("#filterInvoiceModal #fullname").val(),
    // mda_code: $("#filterInvoiceModal #mda_code").val(),
    email: $("#filterInvoiceModal #email").val(),
    allow_payment: $("#filterInvoiceModal #allow_payment").val(),
    status: $("#filterInvoiceModal #status").val(),
  };

  console.log(filters);

  // Call fetchMdaData with filters
  fetchMdaData(currentPage, filters);

  $("#filterInvoiceModal").modal("hide");
});

$("#filterInvoiceModal #clearFilter").on("click", function () {
  // Reset all filter fields
  $("#filterInvoiceModal select, #filterInvoiceModal input").val("");

  // Refresh payment list without filters
  fetchMdaData(currentPage);
  $("#filterInvoiceModal").modal("hide");
});

// Fetch initial data
fetchMdaData(currentPage);

// Function to render table rows
function renderTable(data) {
  $tableBody.empty(); // Clear existing rows
  data.forEach((mda, index) => {
    const tableRow = `
      <tr>
        <td>${(currentPage - 1) * limit + index + 1}</td>
        <td>
          <a class="text-primary" href="./mda-details.html?id=${mda.id}">
            ${mda.fullname}
          </a>
        </td>
        <td>${mda.industry || "N/A"}</td>
        <td>${mda.email || "N/A"}</td>
        <td>${mda.phone || "N/A"}</td>
        <td>${mda.total_revenue_heads || "0"}</td>
        <td>₦${parseFloat(mda.total_remittance || 0).toLocaleString()}</td>
        <td>${formatDate(mda.time_in)}</td>
        <td class="text-sm">
          <span class="badge badge-md badge-${mda.status === "active" ? "success" : "danger"
      }">
            ${mda.status}
          </span>
        </td>
        <td>
          <a href="./mda-details.html?id=${mda.id}" class="btn btn-primary btn-sm">View</a>
          ${!hasPermission(9) ? '' : ` 
            <button class="btn btn-secondary editMda btn-sm" data-id="${mda.id}" data-bs-toggle="modal" data-bs-target="#editMdaModal">
              Edit
            </button>
            <button class="btn btn-danger btn-sm" onclick="deleteMda(${mda.id})">
              Delete
            </button>
          `}
        </td>
      </tr>`;
    $tableBody.append(tableRow);
  });
}

// Function to render pagination
function renderPagination(pagination) {
  const { current_page, total_pages } = pagination;
  $pagination.empty(); // Clear existing pagination

  // Previous button
  $pagination.append(
    `<li class="page-item ${current_page === 1 ? "disabled" : ""}">
        <a class="page-link" href="#" data-page="${current_page - 1
    }">Previous</a>
      </li>`
  );

  // Page numbers
  for (let i = 1; i <= total_pages; i++) {
    $pagination.append(
      `<li class="page-item ${i === current_page ? "active" : ""}">
          <a class="page-link" href="#" data-page="${i}">${i}</a>
        </li>`
    );
  }

  // Next button
  $pagination.append(
    `<li class="page-item ${current_page === total_pages ? "disabled" : ""}">
        <a class="page-link" href="#" data-page="${current_page + 1}">Next</a>
      </li>`
  );
}

// Event listener for pagination click
$pagination.on("click", ".page-link", function (e) {
  e.preventDefault();
  const page = $(this).data("page");
  if (page > 0 && page !== currentPage) {
    currentPage = page;
    fetchData(currentPage);
  }
});

// Function to toggle loader visibility
function showLoader(visible) {
  if (visible) {
    $loader.show(); // Show the loader
  } else {
    $loader.hide(); // Hide the loader
  }
}

// Fetch initial data
// fetchMdaData(currentPage);

function fetchApprovalRequestData(page) {
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
  $tableBody2.html(loaderRow);
  $.ajax({
    type: "GET",
    url: `${HOST}/get-revenue-head?status=2&page=${page}&limit=${limit}`,
    dataType: "json",
    headers: {
      Authorization: "Bearer " + SessionManager.getSessionData().token,
      "Content-Type": "application/json",
    },
    crossDomain: true,
    success: function (response) {
      showLoader(false); // Hide the loader
      if (!hasPermission(7)) { // View MDA List
        $tableBody.html(`
          <tr>
            <td colspan="11" class="text-center text-warning font-bold">You don't have access to view revenue list.</td>
          </tr>
        `);
      } else {
        if (response.status === "success") {
          renderApprovalRequestTable(response.data);
          // renderPagination(response.data);
        } else {
          console.log(response.message || "Failed to fetch data.");
        }
      }
    },
    error: function (err) {
      showLoader(false); // Hide the loader
      console.error("Error fetching data:", err);
      $tableBody2.html(`
        <tr>
          <td colspan="11" class="text-center text-danger">No data available.</td>
        </tr>
      `);
    },
  });
}

// Render Approval Request Table
function renderApprovalRequestTable(data) {
  $tableBody2.empty(); // Clear existing rows
  data.forEach((rev, index) => {
    const tableRow = `
      <tr>
        <td>${(currentPage - 1) * limit + index + 1}</td>
        <td>
          <a class="text-primary" href="./mda-details.html?id=${rev.mda_id}">
            ${rev.mda_name || "N/A"}
          </a>
        </td>
        <td>${rev.item_name}</td>
        <td>${rev.category}</td>
        <td>${rev.frequency}</td>
        <td>₦${parseFloat(rev.amount || 0).toLocaleString()}</td>
        <td>₦${parseFloat(
      rev.total_revenue_generated || 0
    ).toLocaleString()}</td>
        <td>
        ${!hasPermission(12) ? '' : `
          <button class="btn-primary btn-sm btn approve-btn" data-rev-id="${rev.id}">
            Approve
          </button>
        `}
          
        </td>
      </tr>
    `;
    $tableBody2.append(tableRow);
  });

  // Attach event listener after appending rows
  $tableBody2.on("click", ".approve-btn", function () {
    const revenueHeadId = $(this).data("rev-id");
    approveRevenueHead(revenueHeadId);
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

// Fetch Approval Request Data
fetchApprovalRequestData(currentPage);

// if (navigator.geolocation) {
//   navigator.geolocation.getCurrentPosition((position) => {
//     const lat = position.coords.latitude;
//     const lng = position.coords.longitude;
//     console.log(`Geolocation position ${lat}, longitude ${lng}`);
//   });
// }

$("#createMdaBtn").on("click", function () {
  $(".form-group .error-message").remove();

  // Collect form values
  const mdaData = {
    mda_code: $("#createMdaModal #mdacode").val().trim(),
    fullname: $("#createMdaModal #fullname").val().trim(),
    email: $("#createMdaModal #email").val().trim(),
    phone: $("#createMdaModal #phone").val().trim(),
    industry: $("#createMdaModal #industry").val(),
    allow_payment: $("#createMdaModal #allowPayment").is(":checked") ? 1 : 0,
    allow_office_creation: $("#createMdaModal #allowOfficeCreation").is(":checked") ? 1 : 0,
    status: $("#createMdaModal #status").val() === "1" ? 1 : 2,
    state: $("#createMdaModal #repSelectState").val(),
    lga: $("#createMdaModal #repSelectLGA").val(),
    address: $("#createMdaModal #address").val().trim(), // Add address input if needed
    geolocation: "0.0 0.0",
  };

  // // get geolocation of the current location
  // if (navigator.geolocation) {
  //   navigator.geolocation.getCurrentPosition((position) => {
  //     const lat = position.coords.latitude;
  //     const lng = position.coords.longitude;
  //     mdaData.geolocation = `${lat}, ${lng}`;
  //   });
  // }

  // Validation errors object
  const validationErrors = {};

  // Validate required fields
  if (!mdaData.fullname) validationErrors.fullname = "Name is required.";
  if (!mdaData.email) {
    validationErrors.email = "Email address is required.";
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(mdaData.email)) {
      validationErrors.email = "Please enter a valid email address.";
    }
  }
  if (!mdaData.phone) validationErrors.phone = "Phone number is required.";
  if (!mdaData.mda_code) validationErrors.mda_code = "MDA Code is required.";
  if (!mdaData.industry) validationErrors.industry = "Industry is required.";
  if (!mdaData.state) validationErrors.states = "State is required.";
  if (!mdaData.lga) validationErrors.lga = "LGA is required.";
  if (!mdaData.address) validationErrors.address = "Address is required.";

  // Show error messages under each field
  for (const fieldId in validationErrors) {
    const errorMessage = `<small class="text-danger error-message">${validationErrors[fieldId]}</small>`;
    $(`#${fieldId}`).closest(".form-group").append(errorMessage);
  }

  console.log(mdaData); // Debug data

  // If validation errors exist, stop form submission
  if (Object.keys(validationErrors).length > 0) {
    return;
  }

  $("#createMdaBtn")
    .prop("disabled", true)
    .html(
      '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Creating...'
    );
  // AJAX request
  $.ajax({
    type: "POST",
    url: `${HOST}/create-mda`, // Replace with your actual API endpoint
    data: JSON.stringify(mdaData),
    headers: {
      Authorization: "Bearer " + authToken,
      "Content-Type": "application/json",
    },
    success: function (response) {
      if (response.status === "success") {
        // Show success message
        Swal.fire({
          icon: "success",
          title: "MDA Created",
          text: "The MDA has been successfully created.",
          confirmButtonText: "OK",
        }).then(() => {
          // Close modal
          fetchMdaData();
          $("#createMdaModal").modal("hide");
          // Optionally refresh MDA list or perform other actions
        });
      } else {
        // Show error message
        Swal.fire({
          icon: "error",
          title: "Creation Failed",
          text: response.message || "Failed to create MDA",
          confirmButtonText: "Try Again",
        });
      }
    },
    error: function (xhr, status, error) {
      // Handle network or server errors
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong. Please try again.",
        confirmButtonText: "OK",
      });
    },
    complete: function () {
      // Reset submit button
      $("#createMdaBtn").prop("disabled", false).html("Create MDA");
    },
  });
});

function populateEditModal(mda) {
  $("#editMdaModal #fullname").val(mda.fullname);
  $("#editMdaModal #mdacode").val(mda.mda_code);
  $("#editMdaModal #industry").val(mda.industry);
  $("#editMdaModal #editSelectState").val(mda.state);
  $("#editMdaModal #editSelectLGA").val(mda.lga);
  $("#editMdaModal #email").val(mda.email);
  $("#editMdaModal #phone").val(mda.phone);
  $("#editMdaModal #address").val(mda.address);
  $("#editMdaModal #allowPayment").prop("checked", mda.allow_payment === "yes");
  $("#editMdaModal #allowOfficeCreation").prop("checked", mda.allow_office_creation === "yes");
  $("#editMdaModal #status").val(mda.status === "active" ? 1 : 2);
}

$(document).on("click", ".editMda", function () {
  const mdaId = $(this).data("id"); // Set this `data-id` in the button element
  const mda = fetchedData.find((item) => item.id === mdaId);
  $("#editMdaModal #mdaId").val(mdaId), populateEditModal(mda);
});

$("#editMdaModal #editMdaSubmitBtn").on("click", function () {
  const updatedData = {
    mda_id: $("#editMdaModal #mdaId").val(),
    mda_code: $("#editMdaModal #mdacode").val().trim(),
    fullname: $("#editMdaModal #fullname").val(),
    industry: $("#editMdaModal #industry").val(),

    email: $("#editMdaModal #email").val(),
    phone: $("#editMdaModal #phone").val(),
    status: $("#editMdaModal #status").val(),
    allowPayment: $("#editMdaModal #allowPayment").is(":checked"),
    allow_office_creation: $("#editMdaModal #allowOfficeCreation").is(":checked"),
  };

  $("#editMdaSubmitBtn")
    .prop("disabled", true)
    .html(
      '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Updating...'
    );

  $.ajax({
    type: "POST",
    url: `${HOST}/update-mda`,
    data: JSON.stringify(updatedData),
    headers: {
      Authorization: "Bearer " + authToken,
      "Content-Type": "application/json",
    },
    success: function (response) {
      Swal.fire({
        icon: "success",
        title: "MDA Updated",
        text: "The MDA has been successfully updated.",
        confirmButtonText: "OK",
      }).then(() => {
        // Close modal
        $("#editMdaModal").modal("hide");
        fetchMdaData(currentPage); // Refresh data
      });
    },
    error: function (err) {
      console.error("Error updating MDA:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong. Please try again.",
        confirmButtonText: "OK",
      });
    },
    complete: function () {
      $("#editMdaSubmitBtn").prop("disabled", false).html("Save Changes");
    },
  });
});

let editState = STATES;
let editLgaList = lgaList;

function getEditStateLGAs(state) {
  return editLgaList[state];
}

const editSelectedRepState = document.querySelector("#editSelectState");
const editSelectedRepLGA = document.querySelector("#editSelectLGA");

if (editSelectedRepState) {
  editSelectedRepState.innerHTML = editState;
  let selectedState = editSelectedRepState.value;
  const jigawaLGAs = getEditStateLGAs("Jigawa");

  editSelectedRepLGA.innerHTML = "";

  jigawaLGAs.forEach((opt, ii) => {
    editSelectedRepLGA.innerHTML += `
      <option value="${opt}">${opt}</option>
    `;
  });

  editSelectedRepState.addEventListener("change", function () {
    let selectedState = $(this).val();
    const jigawaLGAs = getStateLGAs(selectedState);

    editSelectedRepLGA.innerHTML = "";

    jigawaLGAs.forEach((opt, ii) => {
      editSelectedRepLGA.innerHTML += `
      <option value="${opt}">${opt}</option>
    `;
    });
  });
}

function deleteMda(e) {
  const deleteData = {
    mda_id: e,
  };
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    cancelButtonColor: "#f5365c",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: "Deleting..",
        text: "Wait while we delete the mda!",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      $.ajax({
        type: "PUT",
        url: `${HOST}/delete-mda`,
        data: JSON.stringify(deleteData),
        headers: {
          Authorization: "Bearer " + authToken,
          "Content-Type": "application/json",
        },
        success: function (response) {
          Swal.fire({
            icon: "success",
            title: "Deleted",
            text: "The MDA has been successfully deleted.",
            confirmButtonText: "OK",
          }).then(() => {
            fetchMdaData(currentPage); // Refresh data
          });
        },
        error: function (err) {
          console.error("Error deleting MDA:", err);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Something went wrong. Please try again.",
            confirmButtonText: "OK",
          });
        },
      });
    }
  });
}

function exportData() {
  // console.log(dataToExport)
  const csvRows = [];

  // Extract headers (keys) excluding 'id'
  const headers = Object.keys(dataToExport[0]).filter((key) => key !== "id");
  csvRows.push(headers.join(",")); // Join headers with commas

  // Loop through the data to create CSV rows
  for (const row of dataToExport) {
    const values = headers.map((header) => {
      const value = row[header];
      return `"${value}"`; // Escape values with quotes
    });
    csvRows.push(values.join(","));
  }

  // Combine all rows into a single string
  const csvString = csvRows.join("\n");

  // Export to a downloadable file
  const blob = new Blob([csvString], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "mda_list.csv";
  a.click();
}

$(document).ready(function () {
  $("#bulkCreateModal").on("click", "#submitBulkCreate", function () {
    $("#submitBulkCreate").prop("disabled", true).text("Uploading...");
    const fileInput = $("#csv-file")[0];

    // Check if a file is selected
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
      console.log("CSV Data:", csvData); // Debug: Log raw CSV data

      const revenueHeads = parseCSV(csvData);
      console.log("Parsed Revenue Heads:", revenueHeads); // Debug: Log parsed data

      // Prepare payload
      const payload = revenueHeads; // Send revenueHeads directly (it's already an array)

      // Send data to API
      $.ajax({
        url: `${HOST}/create-multiple-mda`, // Replace with your API endpoint
        type: "POST",
        data: JSON.stringify(payload),
        headers: {
          Authorization: "Bearer " + authToken,
          "Content-Type": "application/json",
        },
        beforeSend: function () {
          $("#submitBulkCreate").prop("disabled", true).text("Creating...");
        },
        success: function (response) {
          if (response.status === "success" && response.successful.length > 0) {
            Swal.fire({
              icon: "success",
              title: "MDA Updated",
              text: "The MDA has been successfully updated.",
              confirmButtonText: "OK",
            }).then(() => {
              // Close modal
              $("#bulkCreateModal").modal("hide");
              fetchApprovedRevenueHeads();
              fetchApprovalRequestRevenueHeads();
              fetchMdaData();
            });
            // Check for errors in the response
            if (response.unsuccessful && response.unsuccessful.length > 0) {
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

    reader.readAsText(file);
  });

  function parseCSV(data) {
    const lines = data.split("\n");
    const result = [];
    const headers = lines[0].split(",").map((header) => header.trim());

    for (let i = 1; i < lines.length; i++) {
      const obj = {};
      const currentLine = parseCSVLine(lines[i]); // Use a helper function to handle quoted fields

      if (currentLine.length === headers.length) {
        headers.forEach((header, index) => {
          obj[header] = currentLine[index].trim(); // Trim each value
        });

        // Convert allow_payment and status to integers
        obj.allow_payment = parseInt(obj.allow_payment);
        obj.status = parseInt(obj.status);

        // Convert contact_info fields
        obj.contact_info = {
          state: obj.state,
          geolocation: obj.geolocation,
          lga: obj.lga,
          address: obj.address,
        };

        // Remove contact_info fields from the main object
        delete obj.state;
        delete obj.geolocation;
        delete obj.lga;
        delete obj.address;

        result.push(obj);
      }
    }

    return result;
  }

  // Helper function to handle quoted fields in CSV
  function parseCSVLine(line) {
    const result = [];
    let inQuotes = false;
    let currentField = "";

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        inQuotes = !inQuotes; // Toggle inQuotes flag
      } else if (char === "," && !inQuotes) {
        result.push(currentField); // End of field
        currentField = "";
      } else {
        currentField += char; // Append character to current field
      }
    }

    // Push the last field
    result.push(currentField);
    return result;
  }

  function showErrorModal(response) {
    // Set the main error message
    $("#errorMessage").text(response.message || "An error occurred.");

    // Clear previous error list
    $("#errorList").empty();

    // Populate the error list
    if (response.unsuccessful && response.unsuccessful.length > 0) {
      response.unsuccessful.forEach((error) => {
        const listItem = `
          <div class="list-group-item list-group-item-action">
            <div>
              <p class="mb-1 text-xs text-danger">
              ${error.error}
              </p>
              <strong class="mb-1 text-sm text-dark">
              ${error.mda.mda_code} - ${error.mda.fullname}
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
});
