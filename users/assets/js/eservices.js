const currentPage = 1; // Change this if paginated
const limit = 50;

function fetchEtcc() {
  const $tbody = $("#eservice-table tbody");

  const table = $("#eservice-table").DataTable({
    serverSide: true,
    paging: true,
    ordering: false,
    pageLength: 50,
    responsive: true,
    searchDelay: 500,
    pagingType: "simple_numbers",
    ajax: function (data, callback, settings) {
      const pageNumber = Math.ceil(data.start / data.length) + 1;

      const filter = {
        taxpayer_id: userData.tax_number,
        page: pageNumber,
        limit: data.length,
      };

      $.ajax({
        type: "GET",
        url: `${HOST}/get-tcc`,
        data: filter,
        dataType: "json",
        headers: {
          Authorization: "Bearer " + authToken,
          "Content-Type": "application/json",
        },
        beforeSend: function () {
          $tbody.html(`
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
          console.log(response);
          if (response.status === "success" && response.data.length > 0) {
            callback({
              draw: data.draw,
              recordsTotal: response.data.length,
              recordsFiltered: response.data.length,
              data: response.data,
            });
          } else {
            const noDataRow =
              '<tr><td colspan="7" class="text-center text-muted">No TCC Requests found.</td></tr>';
            $tbody.html(noDataRow);
            callback({
              draw: data.draw,
              recordsTotal: 0,
              recordsFiltered: 0,
              data: [],
            });
          }
        },
        error: function (err) {
          console.error("Error fetching invoices:", err);
          const errorRow =
            '<tr><td colspan="7" class="text-center text-danger">An error occurred while fetching TCC.</td></tr>';
          $tbody.html(errorRow);
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
      { data: null, render: (data, type, row, meta) => meta.row + 1 },
      {
        data: "created_at",
        render: (data) => new Date(data).toLocaleDateString(),
      },
      {
        data: "expiry_date",
        render: (data) => new Date(data).toLocaleDateString(),
      },
      {
        data: null,
        render: (data) =>
          `${data.taxpayer_first_name} ${data.taxpayer_surname}`,
      },
      { data: "tcc_number" },
      {
        data: "status",
        render: (data) =>
          `<span class="badge ${data === "approved" ? "badge-success" : "badge-warning"
          }">${data}</span>`,
      },
      {
        data: null,
        render: (data) =>
          data.status === "approved"
            ? `<a href="../etcc/etcc-certificate.html?tcc_number=${data.tcc_number}" class="btn btn-primary btn-sm" target="_blank">View Certificate</a>`
            : "",
      },
    ],
  });
}

function fetchTaxFiling() {
  const $tbody = $("#taxfiling-table tbody");

  const table = $("#taxfiling-table").DataTable({
    serverSide: true,
    paging: true,
    ordering: false,
    pageLength: 50,
    responsive: true,
    searchDelay: 500,
    pagingType: "simple_numbers",
    ajax: function (data, callback, settings) {
      const pageNumber = Math.ceil(data.start / data.length) + 1;

      const filter = {
        taxpayer_id: userData.tax_number,
        page: pageNumber,
        limit: data.length,
      };

      $.ajax({
        type: "GET",
        url: `${HOST}/get-all-tax-filings`,
        data: filter,
        dataType: "json",
        headers: {
          Authorization: "Bearer " + authToken,
          "Content-Type": "application/json",
        },
        beforeSend: function () {
          $tbody.html(`
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
          console.log(response);
          if (response.status === "success" && response.data.length > 0) {
            callback({
              draw: data.draw,
              recordsTotal: response.data.length,
              recordsFiltered: response.data.length,
              data: response.data,
            });
          } else {
            const noDataRow =
              '<tr><td colspan="7" class="text-center text-muted">No Tax Filings found.</td></tr>';
            $tbody.html(noDataRow);
            callback({
              draw: data.draw,
              recordsTotal: 0,
              recordsFiltered: 0,
              data: [],
            });
          }
        },
        error: function (err) {
          console.error("Error fetching tax filings:", err);
          const errorRow =
            '<tr><td colspan="7" class="text-center text-danger">An error occurred while fetching tax filings.</td></tr>';
          $tbody.html(errorRow);
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
      { data: null, render: (data, type, row, meta) => meta.row + 1 },
      {
        data: "filing_date",
        render: (data) => new Date(data).toLocaleDateString(),
      },
      {
        data: "status",
        render: (data) =>
          `<span class="badge ${data === "approved" ? "badge-success" : "badge-warning"
          }">${data}</span>`,
      },
      { data: "filing_number" },
      {
        data: null,
        render: (data) =>
          `<a href="./view-taxfiling.html?id=${data.id}&filing_number=${data.filing_number}" class="btn btn-primary btn-sm">View</a>`,
      },
    ],
  });
}

// Fetch invoices on page load'
$(document).ready(() => {
  fetchEtcc();
  fetchTaxFiling();
});

$("#checkStatus").on("click", function () {
  let tccNumInput = document.querySelector("#tccNumInput").value;

  if (tccNumInput === "") {
    Swal.fire({
      title: "Empty Field",
      text: "Please Enter your TCC Number",
      icon: "error",
    });

    return;
  }
  $("#checkStatus")
    .prop("disabled", true)
    .html('<span class="custom-spinner"></span> Checking status...');

  $.ajax({
    type: "GET",
    url: `${HOST}/get-tcc?tcc_number=${tccNumInput}`,
    dataType: "json",
    headers: {
      Authorization: "Bearer " + authToken,
      "Content-Type": "application/json",
    },
    crossDomain: true,
    success: function (response) {
      $("#checkStatus").prop("disabled", false).html("Check Status");
      if (response.status === "success" && response.data.length > 0) {
        const invoices = response.data[0];

        if (invoices.status === "approved") {
          Swal.fire({
            title: "Approved",
            icon: "success",
            html: `
              <b>${tccNumInput}</b>,
              <p>Great, Your TCC Request has been Approved.</p>
            `,
            showCloseButton: true,
            showCancelButton: true,
            focusConfirm: false,
            confirmButtonColor: "#02A75A",
            confirmButtonText: `
              <i class="fas fa-certificate"></i> View Certificate!
            `,
            cancelButtonText: "Close",
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.href = `../etcc/etcc-certificate.html?tcc_number=${tccNumInput}`;
            }
          });
        } else {
          Swal.fire({
            title: invoices.status,
            icon: "info",
            html: `
              <b>${tccNumInput}</b>,
              <p>Your TCC is under review.</p>
            `,
          });
        }
      } else {
        Swal.fire({
          title: "NOT Found",
          text: `The TCC Number ${tccNumInput} is not Not Found.`,
          icon: "error",
        });
      }
    },
    error: function (err) {
      console.error("Error fetching TCC:", err);
      $("#checkStatus").prop("disabled", false).html("Check Status");
      Swal.fire({
        title: "NOT Found",
        text: `The TCC Number ${tccNumInput} is not Not Found.`,
        icon: "error",
      });
    },
  });
});
