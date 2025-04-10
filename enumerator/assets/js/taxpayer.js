const currentPage = 1;
const limit = 50;

let dataToExport;

$('#regBtn').on('click', function () {
  window.location.href = `../register/index.html?createdby=enumerator&created_by_id=${enumUser.user_id}`
})

$(document).ready(function () {
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
        enumerator_id: enumUser.user_id
      };
      // Call your API with the calculated page number
      $.ajax({
        url: `${HOST}/get-enumerator-tax-payers`,
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
          dataToExport = response.data;
          // Map the API response to DataTables expected format
          callback({
            draw: data.draw, // Pass through draw counter
            recordsTotal: response.pagination.total_records, // Total records in your database
            recordsFiltered: response.pagination.total_records, // Filtered records count
            data: response.data, // The actual data array from your API
          });
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
          return `${row.first_name} ${row.last_name}`;
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
        data: "timeIn",
        render: function (data) {
          return new Date(data).toLocaleDateString();
        },
      },
      {
        data: "tax_number",
        render: function (data, type, row) {
          return `
                
                <a href="./taxpayer-list.html?tax_number=${data}" class="btn btn-primary btn-sm">
                  View
                </a>
          `;
        },
      },
    ],
  });
});

function fetchTaxpayerStatistics() {
  $.ajax({
    type: "GET",
    url: `${HOST}/get-enumtaxpayer-statistics?enumerator_id=${enumUser.user_id}`,
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
          stats.total_enumerator_tax_payers.toLocaleString()
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

fetchTaxpayerStatistics();


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
