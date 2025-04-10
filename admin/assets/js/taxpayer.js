const currentPage = 1;
const limit = 50;

let dataToExport;


async function fetchTaxpayers() {
  if ($.fn.DataTable.isDataTable('#datatable')) {
    $('#datatable').DataTable().clear().destroy();
  }
  table = $("#datatable").DataTable({
    serverSide: true,
    paging: true,
    searching: false,
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
        tax_number: $("#filterInvoiceModal #tax_number").val(),
        category: $("#filterInvoiceModal #category").val(),
        type: $("#filterInvoiceModal #type").val(),
      };
      // Call your API with the calculated page number
      $.ajax({
        url: `${HOST}/get-taxpayers`,
        type: "GET",
        data: filters,
        dataType: "json",
        headers: {
          Authorization: "Bearer " + authToken,
        },
        beforeSend: function () {
          // Optional: Add a loading indicator
          $("#datatable tbody").html(`
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
          if (!hasPermission(20)) { // View Tax Payer List
            $("#datatable tbody").html(`
              <tr class="loader-row">
                <td colspan="11" class="text-center">
                    <p>You don't have access to view this data.</p>
                </td>
              </tr>
            `);
          } else {
            dataToExport = response.data;
            // Map the API response to DataTables expected format
            callback({
              draw: data.draw, // Pass through draw counter
              recordsTotal: response.pagination.total_records, // Total records in your database
              recordsFiltered: response.pagination.total_records, // Filtered records count
              data: response.data, // The actual data array from your API
            });
          }

        },
        error: function () {
          alert("Failed to fetch data.");
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

      {
        data: "tax_number",
        render: function (data) {
          return `
            <a class="text-primary" href="./taxpayer-list.html?tax_number=${data}">${data}</a>
          `;
        },
      },
      {
        data: null,
        render: function (data, type, row) {
          return `${row.first_name} ${row.surname}`;
        },
      },
      { data: "category" },
      { data: "tax_number" },
      { data: "email" },
      {
        data: "tin_status",
        render: function (data) {
          return `
            <span class="badge ${data === "issued" ? "badge-success" : "badge-danger"
            }">
              ${data === "issued" ? "Issued" : "Pending"}
            </span>`;
        },
      },
      {
        data: "created_time",
        render: function (data) {
          return new Date(data).toLocaleDateString();
        },
      },
      {
        data: "tax_number",
        render: function (data, type, row) {
          return `
            ${!hasPermission(21) ? '' : `
              <button 
                data-bs-toggle="modal" 
                data-bs-target="#editTaxpayerModel" 
                class="btn btn-secondary btn-sm editTaxpayer"
                data-taxpayer-id="${row.id}" data-taxpayer-taxnumber="${data}">
                Edit
              </button>
            `}
            
            <a href="./taxpayer-list.html?tax_number=${data}" class="btn btn-primary btn-sm">
              View
            </a>
          `;
        },
      },
    ],
  });
}

$(document).ready(function () {
  fetchTaxpayers()

  $("#filterInvoiceModal #applyFilter").on("click", function () {
    fetchTaxpayers() // Redraw the table with new filters
    $("#filterInvoiceModal").modal("hide");
  });

  // Optional: Clear filters
  $("#filterInvoiceModal #clearFilter").on("click", function () {
    // Reset all filter fields
    $("#filterInvoiceModal select, #filterInvoiceModal input").val("");
    fetchTaxpayers()
    $("#filterInvoiceModal").modal("hide");
  });
});



// Helper functions
function getTinStatusClass(taxpayer) {
  switch (taxpayer.tin_status) {
    case "issued":
      return "badge-success";
    case "pending":
      return "badge-danger";
    default:
      return "badge-danger";
  }
}

function getTinStatus(taxpayer) {
  // Add logic to determine TIN status
  return taxpayer.tin_status ? taxpayer.tin_status : "Pending";
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

// Event listeners for filtering
// Fetch taxpayers on page load
// fetchTaxpayers();

// Filter by created_by
$("#createdByFilter").on("change", function () {
  const createdBy = $(this).val();
  fetchTaxpayers({ created_by: createdBy });
});

// Filter by category
$("#categoryFilter").on("change", function () {
  const category = $(this).val();
  fetchTaxpayers({ category: category });
});

// Date range filter
$("#dateRangeFilter").on("apply.daterangepicker", function (ev, picker) {
  fetchTaxpayers({
    date_created_start: picker.startDate.format("YYYY-MM-DD"),
    date_created_end: picker.endDate.format("YYYY-MM-DD"),
  });
});

// Event listener for edit button
$(document).on("click", ".editTaxpayer", function () {
  const taxpayerId = $(this).data("taxpayer-taxnumber");
  $("#editTaxpayerModel #taxpayerId").val(taxpayerId);
});

// Event listener for save changes button
$("#editTaxpayerModel #editTaxpayerSubmitBtn").on("click", function () {
  const taxpayerId = $("#editTaxpayerModel #taxpayerId").val();
  const tinStatus = $("#editTaxpayerModel #tinStatus").val();

  // Disable submit button and show loading state
  $(this)
    .prop("disabled", true)
    .html(
      '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Updating...'
    );

  const updatedData = {
    tax_number: taxpayerId,
    tin_status: tinStatus,
  };

  // Send update request
  $.ajax({
    type: "POST",
    url: `${HOST}/update-tin-status`,
    data: JSON.stringify(updatedData),
    headers: {
      Authorization: "Bearer " + authToken,
      "Content-Type": "application/json",
    },
    success: function (response) {
      if (response.status === "success") {
        Swal.fire("Approved!", "TIN status has been approved.", "success");
        $("#editTaxpayerModel").modal("hide");

        $("#datatable").DataTable().draw();
        // Refresh taxpayer list
        // fetchTaxpayers();
      } else {
        Swal.fire("Try Again!", "Failed to update taxpayer!", "error");
      }
    },
    error: function (err) {
      console.error("Error updating taxpayer:", err);
      Swal.fire("Error!", "An error occurred while approving.", "error");
    },
    complete: function () {
      // Restore submit button
      $("#editTaxpayerModel #editTaxpayerSubmitBtn")
        .prop("disabled", false)
        .html("Save Changes");
    },
  });
});

function fetchTaxpayerStatistics() {
  $.ajax({
    type: "GET",
    url: `${HOST}/get-taxpayer-statistics`,
    dataType: "json",
    headers: {
      Authorization: "Bearer " + authToken,
      "Content-Type": "application/json",
    },
    success: function (response) {
      if (response.status === "success") {
        const stats = response.data;

        // Update Registered Taxpayers
        $("#registeredTaxpayersCount").text(
          stats.total_registered_taxpayers.toLocaleString()
        );

        // Update Self Registered
        $("#selfRegisteredCount").text(
          stats.total_self_registered_taxpayers.toLocaleString()
        );

        // Update Enumerated
        $("#enumeratedCount").text(
          stats.total_admin_registered_taxpayers.toLocaleString()
        );
        $("#inactiveUsersCount").text(
          stats.total_admin_inactive_taxpayer.toLocaleString()
        );
        $("#activeUsersCount").text(
          stats.total_admin_active_taxpayer.toLocaleString()
        );
      } else {
        console.error("Failed to fetch taxpayer statistics");
        //   resetStatisticCards();
      }
    },
    error: function (xhr, status, error) {
      console.error("Error fetching taxpayer statistics:", error);
      //   resetStatisticCards();
    },
  });
}

if (hasPermission(20)) { // View Tax Payer List
  fetchTaxpayerStatistics();
}

function exportData() {
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
  a.download = "taxpayers.csv";
  a.click();
}
