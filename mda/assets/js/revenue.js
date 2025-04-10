const $tableBody = $("#datatable tbody");
const $pagination = $("#pagination");
const $loader = $(".loader"); // Select the loader
let currentPage = 1;
const limit = 10;
let fetchedData;

// Function to fetch and render approved revenue head data

$(document).ready(function () {
  if ($.fn.DataTable.isDataTable('#revenue-table')) {
    $('#revenue-table').DataTable().clear().destroy();
  }

  table = $("#revenue-table").DataTable({
    // processing: true,
    serverSide: true,
    paging: true,
    ordering: false,
    pageLength: 50,
    responsive: true,
    searchDelay: 500,
    pagingType: "simple_numbers",
    ajax: function (data, callback, settings) {
      // Convert DataTables page number to your API page number
      const pageNumber = Math.ceil(data.start / data.length) + 1;

      const filters = {
        page: pageNumber,
        limit: data.length,
        status: $("#status").val(),
        mda_id: mdaId
        // search: data.search.value,
        // Add any additional filters

      };

      // Call your API with the calculated page number
      $.ajax({
        url: `${HOST}/get-revenue-head`,
        type: 'GET',
        data: filters,
        headers: {
          Authorization: "Bearer " + authToken,
        },
        dataType: "json",
        beforeSend: function () {
          // Optional: Add a loading indicator
          $("#revenue-table tbody").html(`
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
        `);
        },
        success: function (response) {
          // Map the API response to DataTables expected format
          callback({
            draw: data.draw, // Pass through draw counter
            recordsTotal: response.data.length, // Total records in your database
            recordsFiltered: response.data.length, // Filtered records count
            data: response.data, // The actual data array from your API
          });

        },
        error: function (error) {
          console.log('Failed to fetch data.', error);
          $("#revenue-table tbody").html(`
            <tr>
              <td colspan="8" class="text-center">
                No data available
              </td>
            </tr>
          `);
        },
      });
    },
    columns: [
      {
        data: null,
        render: function (data, type, row, meta) {
          return meta.row + 1; // Serial number
        },
      },
      { data: "item_name" },
      { data: "category" },

      {
        data: "amount", render: function (data) {
          return `₦ ${parseFloat(data).toLocaleString()}`;
        }
      },
      {
        data: "total_revenue_generated", render: function (data) {
          return `₦ ${parseFloat(data).toLocaleString()}`;
        }
      },
      { data: "frequency" },
      {
        data: "status", render: function (data) {
          return `<span class="badge ${data === "active" ? "badge-success" : "badge-danger"}">${data}</span>`;
        }
      },
      {
        data: "id", render: function (data) {
          return `
          <button
            data-bs-toggle="modal"
            data-bs-target="#editRevenueHeadModal"
            class="btn btn-primary btn-sm editRevenueHead"
            data-revid="${data}"
          >
            Edit
          </button>
          <button
            onclick="deleteRevenueHead(this)"
            data-revid="${data}"
            class="btn btn-danger btn-sm"
          >
            Delete
          </button>`;
        }
      }
    ],
  });

  $("#filterBtn").on("click", function () {
    $("#revenue-table").DataTable().draw(); // Redraw the table with new filters
  });


});

function fetchRevenueHead(status) {
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
  const $tbody = $("#revenue-table tbody");
  // Show loader
  $tbody.html(loaderRow);
  $.ajax({
    type: "GET",
    url: `${HOST}/get-revenue-head?mda_id=${mdaId}&status=${status}`,
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
                <td>₦ ${parseFloat(item.amount).toLocaleString()}</td>
                <td>${item.frequency}</td>
                <td>
                  <span class="badge ${getTinStatusClass(item)}">
                    ${item.status}
                  </span>
                </td>
                <td>
                  <button
                    data-bs-toggle="modal"
                    data-bs-target="#editRevenueHeadModal"
                    class="btn btn-primary btn-sm editRevenueHead"
                    data-revid="${item.id}"
                  >
                    Edit
                  </button>
                  <button
                    onclick="deleteRevenueHead(this)"
                    data-revid="${item.id}"
                    class="btn btn-danger btn-sm"
                  >
                    Delete
                  </button>
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
// fetchRevenueHead();

function getTinStatusClass(rev) {
  switch (rev.status) {
    case "active":
      return "badge-success";
    case "inactive":
      return "badge-danger";
    default:
      return "pending";
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
    url: `${HOST}/create-revenue-head`, 
    headers: {
      Authorization: `Bearer ${authToken}`,
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
        });
        $("#editRevenueHeadModal").modal("hide");
        fetchRevenueHead(); // Refresh table data
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

function fetchRevenueHeadStatistics() {
  $.ajax({
    type: "GET",
    url: `${HOST}/revenue-heads-summary-by-mda?mda_id=${mdaId}`,
    dataType: "json",
    headers: {
      Authorization: "Bearer " + authToken,
      "Content-Type": "application/json",
    },
    success: function (response) {
      if (response.status === "success") {
        const stats = response.data;

        $("#activeRev").text(stats.active_revenue_heads);
        $("#inactiveRev").text(stats.inactive_revenue_heads);
        $("#totalRev").text(stats.total_revenue_heads);
      } else {
        console.error("Failed to fetch revenue head statistics");
        //   resetStatisticCards();
      }
    },
    error: function (xhr, status, error) {
      console.error("Error fetching revenue head statistics:", error);
      //   resetStatisticCards();
    },
  });
}

fetchRevenueHeadStatistics();
