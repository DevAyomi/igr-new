let dataToExport;
const type = getParameterByName("type");

const capitalizedType = capitalizeWords(type);
$(".etccType").text(`ETCC Manager - ${capitalizedType}`);

// Initialize the three DataTables
$(document).ready(function () {
  // Helper function to initialize DataTable
  function createTccTable(selector, stage, status) {
    $(selector).DataTable({
      serverSide: true,
      paging: true,
      ordering: false,
      pageLength: 50,
      responsive: true,
      searchDelay: 500,
      pagingType: "simple_numbers",
      ajax: function (data, callback) {
        const pageNumber = Math.ceil(data.start / data.length) + 1;

        $.ajax({
          type: "GET",
          url: `${HOST}/get-tcc?category=${type}`,
          dataType: "json",
          headers: {
            Authorization: "Bearer " + authToken,
          },
          beforeSend: function () {
            $(`${selector} tbody`).html(`
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
            if (response.status === "success" && response.data.length > 0) {
              // Filter data based on current_stage
              const filteredData = response.data.filter((item) =>
                (stage === "" || item.current_stage === stage) && (status === "" || item.status === status)
              );


              callback({
                draw: data.draw,
                recordsTotal: filteredData.length,
                recordsFiltered: filteredData.length,
                data: filteredData,
              });
            } else {
              callback({
                draw: data.draw,
                recordsTotal: 0,
                recordsFiltered: 0,
                data: [],
              });
            }
          },
          error: function () {
            alert("Failed to fetch data.");
          },
        });
      },
      columns: [
        { data: null, render: (data, type, row, meta) => meta.row + 1 }, // Serial number
        { data: "created_at", render: (data) => formatDate(data) },
        { data: "tcc_number" },
        {
          data: "status",
          render: (data, type, row) => `
            <span class="badge ${getStatusBadgeClass(row.status)}">
              ${row.status}
            </span>
          `,
        },
        { data: "updated_at", render: (data) => formatDate(data) },
        {
          data: "id",
          render: function (data, type, row) {
            return `
              <a href="etcc-details.html?tccId=${row.id}&id=${row.tcc_number}&taxpayerId=${row.taxpayer_id}&stage=${row.current_stage}" class="btn btn-sm btn-secondary">
                View Details
              </a>
            `;
          },
        },
      ],
    });
  }

  // Initialize three tables
  createTccTable("#datatable1", "first_reviewer_approval", "");
  createTccTable("#datatable2", "second_reviewer_approval", "");
  createTccTable("#datatable3", "director_reviewer", "");
  createTccTable("#datatable4", "director_approval", "");
  createTccTable("#datatable5", "", "approved");
  createTccTable("#datatable6", "", "rejected");
});


function fetchStatistics() {
  $.ajax({
    type: "GET",
    url: `${HOST}/get-tcc-status-count?category=${type}`, // Replace with your actual endpoint
    dataType: "json",
    headers: {
      Authorization: "Bearer " + authToken,
      "Content-Type": "application/json",
    },
    success: function (response) {
      if (response.status === "success") {
        const stats = response.data;
        $("#totalSubmitted").text(stats.total_submitted);
        $("#totalRejected").text(stats.total_rejected);
        $("#totalApproved").text(stats.total_approved);
      } else {
        console.error("Failed to fetch statistics");
      }
    },
    error: function (err) {
      console.error("Error fetching statistics:", err);
    },
  });
}

fetchStatistics();

// Utility functions
function formatDate(dateString) {
  return dateString ? new Date(dateString).toLocaleDateString() : "N/A";
}

function getStatusBadgeClass(status) {
  switch (status.toLowerCase()) {
    case "pending":
      return "badge-warning";
    case "approved":
      return "badge-success";
    case "rejected":
      return "badge-danger";
    default:
      return "badge-secondary";
  }
}

function handleEmptyTables() {
  const tables = [
    { tbody: $("#datatable1 tbody"), message: "No first review requests" },
    { tbody: $("#datatable2 tbody"), message: "No reviewer approval requests" },
    { tbody: $("#datatable3 tbody"), message: "No direct approval requests" },
  ];

  tables.forEach((table) => {
    if (table.tbody.children().length === 0) {
      table.tbody.html(`
          <tr>
            <td colspan="7" class="text-center">${table.message}</td>
          </tr>
        `);
    }
  });
}

function attachDownloadReportHandler(data) {
  $(".download").on("click", function () {
    // Implement report download logic
    if (data && data.length > 0) {
      // Example: Convert to CSV
      const csv = convertToCSV(data);
      downloadCSV(csv, "tcc_report.csv");
    } else {
      alert("No data available to download.");
    }
  });
}

function convertToCSV(data) {
  const headers = [
    "TCC Number",
    "Date Sent",
    "Status",
    "Date Approved",
    "Applicant TIN",
    "Occupation",
    "Category",
  ];

  const csvRows = data.map((item) => [
    item.tcc_number,
    formatDate(item.created_at),
    item.status,
    formatDate(item.updated_at),
    item.applicant_tin,
    item.occupation,
    item.category,
  ]);

  return [headers.join(","), ...csvRows.map((row) => row.join(","))].join("\n");
}

function downloadCSV(csv, filename) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

function approveTCC(tccId, status) {
  const $button = $(`button[onclick="approveTCC(${tccId}, '${status}')"]`);
  const originalText = $button.text();
  $button
    .prop("disabled", true)
    .text(`${status === "approved" ? "Approving..." : "Rejecting..."}`);

  $.ajax({
    url: `${HOST}/update-tcc-status`,
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify({ id: tccId, status: status }),
    headers: {
      Authorization: "Bearer " + authToken,
      "Content-Type": "application/json",
    },
    success: function (response) {
      if (response.status === "success") {
        showNotification(`TCC Request ${status} Successfully`, "success");
        // Optionally refresh or redirect
        // fetchTCC();
        fetchStatistics();
      } else {
        showNotification(`Failed to ${status} TCC Request`, "error");
        $button.prop("disabled", false).text(originalText);
      }
    },
    error: function (xhr) {
      showNotification("An error occurred", "error");
      $button.prop("disabled", false).text(originalText);
    },
  });
}

function downloadTCC(tccNumber) {
  console.log("Download TCC:", tccNumber);
  // Implement download logic for TCC
}
