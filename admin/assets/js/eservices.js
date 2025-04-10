const currentPage = 1; // Change this if paginated
const limit = 50;

let dataToExport = [];
let taxFilingDataToExport = [];
let table;
let taxFilledTable;

$(document).ready(function () {
  table = $("#tin-table").DataTable({
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
        // search: data.search.value,
      };

      // Call your API with the calculated page number
      $.ajax({
        url: `${HOST}/get-tin-request`,
        type: "GET",
        data: filters,
        dataType: "json",
        headers: {
          Authorization: "Bearer " + authToken,
        },
        beforeSend: function () {
          // Optional: Add a loading indicator
          $("#tin-table tbody").html(`
          <tr class="loader-row">
            <td colspan="9" class="text-center">
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
          if (!hasPermission(60)) { // View Tin Request
            $("#tin-table tbody").html(`
              <tr class="loader-row">
                <td colspan="9" class="text-center">
                  <p>You don't have access to view this data !</p>
                </td>
              </tr>
            `);
          } else {
            dataToExport = response.data;
            callback({
              draw: data.draw, // Pass through draw counter
              recordsTotal: response.data.length, // Total records in your database
              recordsFiltered: response.data.length, // Filtered records count
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
        data: null,
        render: function (data, type, row) {
          return `${row.first_name} ${row.surname}`;
        },
      },
      { data: "taxpayer_email" },
      { data: "tin" },
      { data: "created_at" },
      {
        data: null,
        render: function (data, type, row) {
          if (row.status === "approved") {
            return '<span class="badge badge-success">Approved</span>';
          } else if (row.status === "declined") {
            return '<span class="badge badge-danger">Declined</span>';
          } else {
            return '<span class="badge badge-warning">Pending</span>';
          }
        },
      },
      {
        data: null,
        render: function (data, type, row) {
          return `
            ${!hasPermission(61) ? '' : `
              <button onclick="viewTinRequest('${row.taxpayer_email}')" class="btn btn-primary btn-sm">
                View
              </button>
            `}
            
          `;
        },
      },
    ],
  });

  taxFilledTable = $("#taxfiling-table").DataTable({
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
        // search: data.search.value,
      };

      // Call your API with the calculated page number
      $.ajax({
        url: `${HOST}/get-all-tax-filings`,
        type: "GET",
        data: filters,
        dataType: "json",
        headers: {
          Authorization: "Bearer " + authToken,
        },
        beforeSend: function () {
          // Optional: Add a loading indicator
          $("#taxfiling-table tbody").html(`
          <tr class="loader-row">
            <td colspan="9" class="text-center">
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
          if (!hasPermission(59)) { // View Tax Filing
            $("#taxfiling-table tbody").html(`
              <tr class="loader-row">
                <td colspan="9" class="text-center">
                  <p>You don't have access to view this data !</p>
                </td>
              </tr>
            `);
          } else {
            taxFilingDataToExport = response.data;
            callback({
              draw: data.draw, // Pass through draw counter
              recordsTotal: response.data.length, // Total records in your database
              recordsFiltered: response.data.length, // Filtered records count
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
        data: "created_at",
        render: function (data, type, row) {
          return new Date(data).toLocaleDateString();
        },
      },
      { data: "filing_number" },
      {
        data: "status",
        render: function (data, type, row) {
          const paymentStatusClass =
            data === "approved" ? "badge-success" : "badge-warning";
          return `<span class="badge ${paymentStatusClass}">${data}</span>`;
        },
      },
      {
        data: null,
        render: function (data, type, row) {
          return `
            <a href="./view-taxfiling.html?id=${row.id}&filing_number=${row.filing_number}" class="btn btn-primary btn-sm">
              View
            </a>
          `;
        },
      },
    ],
  });
});

$(document).ready(function () {
  $.ajax({
    url: `${HOST}/tin-request-summary`,
    method: "GET",
    headers: {
      Authorization: "Bearer " + authToken,
      "Content-Type": "application/json",
    },
    success: function (data) {
      const totalRequests = data.total_tin_requests;
      const approvedRequests = data.status_count.approved;
      const declinedRequests = data.status_count.declined;

      // Update UI elements if needed
      if (hasPermission(60)) {// View Tin Request
        $("#totalTinRequest").text(totalRequests);
        $("#appprovedReq").text(approvedRequests);
        $("#declinedRequest").text(declinedRequests);
      }
    },
    error: function (error) {
      console.error("Error fetching TIN request summary:", error);
    },
  });
  if (hasPermission(59)) {// View Tax Filing
    fetchTaxFilingStats();
  }
});

function viewTinRequest(email) {
  $("#msg_box").html("");
  $("#footerForModal").html("");
  $("#viewTinRequestModal").modal("show");

  const url = `${HOST}/get-tin-request?email=${email}`;
  $.ajax({
    url,
    type: "GET",
    headers: {
      Authorization: "Bearer " + authToken,
      "Content-Type": "application/json",
    },
    beforeSend: function () {
      $("#tinViewer").html(`
        <div class="d-flex jusify-content-center align-items-center" style="flex-direction: column;">
          <div class="loader">
            <div class="rotating-dots">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
          <span>Loading...</span>
        </div>
      `);
    },
    success: function (response) {
      console.log(response);
      $("#tinViewer").html("");
      if (response.data.length > 0) {
        let thetinreq = response.data[0];
        $("#tinViewer").html(`
          <div class="mb-4">
              <div class="section-title">Request Information</div>
              <div class="row">
                <div class="col-md-6">
                  <div class="info-label">TIN Number</div>
                  <div class="info-value mono-text">${thetinreq.tin}</div>
                </div>
                <div class="col-md-6">
                  <div class="info-label">Taxpayer ID</div>
                  <div class="info-value">${thetinreq.taxpayer_id}</div>
                </div>
                <div class="col-md-6">
                  <div class="info-label">Current Status</div>
                  <div class="info-value">
                    <span class="badge bg-secondary text-capitalize">${thetinreq.status}</span>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="info-label">Email</div>
                  <div class="info-value text-break">${thetinreq.taxpayer_email}</div>
                </div>
              </div>
            </div>

            <!-- Personal Information -->
            <div class="mb-4">
              <div class="section-title">Personal Information</div>
              <div class="row">
                <div class="col-md-6">
                  <div class="info-label">Name</div>
                  <div class="info-value">${thetinreq.first_name} ${thetinreq.surname}</div>
                </div>
                <div class="col-md-6">
                  <div class="info-label">Phone</div>
                  <div class="info-value">${thetinreq.phone}</div>
                </div>
                <div class="col-12">
                  <div class="info-label">Location</div>
                  <div class="info-value">${thetinreq.address}</div>
                </div>
              </div>
            </div>

            <!-- Timeline -->
            <div>
              <div class="section-title">Timeline</div>
              <div class="timeline-item">
                <div class="timeline-icon">
                  <i class="bi bi-calendar"></i>
                </div>
                <div>
                  <div class="info-label">Created</div>
                  <div class="info-value text-muted">${thetinreq.created_at}</div>
                </div>
              </div>
              <div class="timeline-item">
                <div class="timeline-icon">
                  <i class="bi bi-calendar"></i>
                </div>
                <div>
                  <div class="info-label">Last Updated</div>
                  <div class="info-value text-muted">${thetinreq.updated_at}</div>
                </div>
              </div>
            </div>
        `);

        if (thetinreq.status === "approved") {
          $("#footerForModal").html(`
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-danger" onclick="approveReq(${thetinreq.id}, 'declined')" id="declineBtn">Decline</button>
          `);
        } else {
          $("#footerForModal").html(`
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-danger" onclick="approveReq(${thetinreq.id}, 'declined')" id="declineBtn">Decline</button>
            <button type="button" class="btn btn-primary" onclick="approveReq(${thetinreq.id}, 'approved')" id="approveBtn">Approve</button>
          `);
        }
      } else {
        console.log("Error fetching TIN request:");
      }
    },
  });
}

function approveReq(theid, status) {
  const $button = $(`button[onclick="approveReq(${theid}, '${status}')"]`);
  const originalText = $button.text();

  $button
    .prop("disabled", true)
    .html(
      `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> ${status === "approved" ? "Approving..." : "Declining..."
      }`
    );
  $("#msg_box").html("");

  let dataToPush = {
    id: theid,
    status: status,
  };

  $.ajax({
    url: `${HOST}/tin-request-status`,
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify(dataToPush),
    headers: {
      Authorization: "Bearer " + authToken,
      "Content-Type": "application/json",
    },
    success: function (response) {
      $button.prop("disabled", false).html(originalText);

      if (response.message === "TIN request status updated successfully") {
        $("#msg_box").html(`
          <div class="alert alert-success text-center alert-dismissible fade show" role="alert">
            <strong>Success!</strong> TIN Request approved successfully.
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>
        `);
        setTimeout(() => {
          $("#viewTinRequestModal").modal("hide");
        }, 1000);
        table.ajax.reload();
      } else {
        // showNotification(`Failed to approved TIN Request`, "error");
        $("#msg_box").html(`
          <div class="alert alert-danger text-center alert-dismissible fade show" role="alert">
            <strong>Failed!</strong> Failed to approved TIN Request.
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>
        `);
      }
    },
    error: function (xhr) {
      console.log(xhr);
      $button.prop("disabled", false).html(originalText);
      $("#msg_box").html(`
        <div class="alert alert-danger text-center alert-dismissible fade show" role="alert">
          <strong>Failed!</strong> Failed to approved TIN Request.
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      `);
    },
  });
}

function fetchTaxFilingStats() {
  $.ajax({
    url: `${HOST}/get-tax-filing-statistics`,
    method: "GET",
    headers: {
      Authorization: "Bearer " + authToken,
      "Content-Type": "application/json",
    },
    success: function (data) {
      if (data.status === "success") {
        const statusOverview = data.data.status_overview;
        const taxTypeBreakdown = data.data.tax_type_breakdown;
        const complianceRate = data.data.compliance_rate;

        // Update status overview
        statusOverview.forEach((status) => {
          $(`#${status.status}Filings`).text(status.total_filings);
        });

        // Update tax type breakdown
        taxTypeBreakdown.forEach((type) => {
          $(`#${type.tax_type}TaxTypes`).text(type.total_tax_types);
        });

        // Update compliance rate
        $("#complianceRate").text(complianceRate + "%");
      }
    },
    error: function (error) {
      console.error("Error fetching tax filing summary:", error);
    },
  });
}

function exportData(tableId, filename) {
  const tableData =
    tableId === "tin-table" ? dataToExport : taxFilingDataToExport;
  if (!tableData.length) {
    alert("No data available to export.");
    return;
  }

  const csvRows = [];

  // Extract headers (keys) excluding 'id'
  const headers = Object.keys(tableData[0]).filter((key) => key !== "id");
  csvRows.push(headers.join(",")); // Join headers with commas

  // Loop through the data to create CSV rows
  for (const row of tableData) {
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
  a.download = filename;
  a.click();
}
