let employeeData = [];
const revenueHeadItems = [];
let dataToExport;
let dataToExport2;
$.ajax({
  url: `${HOST}/get-revenue-head`,
  type: "GET",
  success: function (response) {
    if (response.status === "success") {
      // Get the revenue items data
      const revenueItems = response.data.filter(
        (item) => item.item_name === "PAYE"
      );
      revenueHeadItems.push(...revenueItems);
    } else {
      console.error("Failed to fetch revenue items.");
    }
  },
  error: function (xhr, status, error) {
    console.error("An error occurred: ", error);
    // alert("Could not load revenue items.");
  },
});

$(document).ready(function () {
  let table;

  // Function to reload DataTable with filters
  function reloadDataTable(filters = {}) {
    if ($.fn.DataTable.isDataTable("#datatable")) {
      table.destroy();
    }

    table = $("#datatable").DataTable({
      serverSide: true,
      paging: true,
      ordering: false,
      pageLength: parseInt(filters.limit) || 50,
      responsive: true,
      searchDelay: 500,
      pagingType: "simple_numbers",
      searching: false,
      ajax: function (data, callback, settings) {
        const pageNumber =
          filters.page || Math.ceil(data.start / data.length) + 1;

        const apiFilters = {
          page: pageNumber,
          limit: filters.limit || data.length,
          tax_number: filters.tax_number,
          date_employed_start: filters.date_employed_start,
          date_employed_end: filters.date_employed_end,
          basic_salary_min: filters.basic_salary_min,
          basic_salary_max: filters.basic_salary_max,
          monthly_tax_min: filters.monthly_tax_min,
          monthly_tax_max: filters.monthly_tax_max,
        };

        // Call your API with the filters
        $.ajax({
          url: `${HOST}/get-direct-assessments`,
          type: "GET",
          data: apiFilters,
          dataType: "json",
          headers: {
            Authorization: "Bearer " + authToken,
          },
          beforeSend: function () {
            $("#datatable tbody").html(`
              <tr class="loader-row">
                <td colspan="12" class="text-center">
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
            if (response.status === "success") {
              dataToExport = response.data.direct_assessments;
              callback({
                draw: data.draw,
                recordsTotal: response.data.total_records,
                recordsFiltered: response.data.total_records,
                data: response.data.direct_assessments,
              });
            } else {
              alert("Failed to fetch data.");
            }
          },
          error: function () {
            alert("Failed to fetch data.");
          },
        });
      },
      columns: [
        {
          data: "id",
          render: function (data, type, user, meta) {
            return `${meta.row + 1}`;
          },
        },
        { data: "tax_number" },
        {
          data: "basic_salary",
          render: $.fn.dataTable.render.number(",", ".", 2, "₦ "),
        },
        { data: "date_employed" },
        {
          data: "housing",
          render: $.fn.dataTable.render.number(",", ".", 2, "₦ "),
        },
        {
          data: "transport",
          render: $.fn.dataTable.render.number(",", ".", 2, "₦ "),
        },
        {
          data: "utility",
          render: $.fn.dataTable.render.number(",", ".", 2, "₦ "),
        },
        {
          data: "medical",
          render: $.fn.dataTable.render.number(",", ".", 2, "₦ "),
        },
        {
          data: "entertainment",
          render: $.fn.dataTable.render.number(",", ".", 2, "₦ "),
        },
        {
          data: "annual_gross_income",
          render: $.fn.dataTable.render.number(",", ".", 2, "₦ "),
        },
        {
          data: "monthly_tax_payable",
          render: $.fn.dataTable.render.number(",", ".", 2, "₦ "),
        },
        { data: "created_date" },
        {
          data: "id",
          render: function (data, type, row) {
            return `
              <div class="flex items-center gap-x-3">
                 <button class="btn btn-primary" onclick="generateInvoice(this)" data-id="${row.id}" data-taxNumber="${row.tax_number}" data-monthly_tax_payable="${row.monthly_tax_payable}" >
                  Generate Invoice
                </button>
              </div>
            `;
          },
        },
      ],
    });
  }

  // Initialize DataTable on page load
  reloadDataTable();

  // Handle "Apply Filters" button click
  $("#apply-direct-assessment-filters").on("click", function () {
    const filters = {
      tax_number: $("#tax_number_filter").val(),
      date_employed_start: $("#date_employed_start_filter").val(),
      date_employed_end: $("#date_employed_end_filter").val(),
      basic_salary_min: $("#basic_salary_min_filter").val(),
      basic_salary_max: $("#basic_salary_max_filter").val(),
      monthly_tax_min: $("#monthly_tax_min_filter").val(),
      monthly_tax_max: $("#monthly_tax_max_filter").val(),
    };
    reloadDataTable(filters);
    $("#filterDirectAssessmentModal").modal("hide"); // Close the modal
  });

  // Handle "Reset Filters" button click
  $("#reset-direct-assessment-filters").on("click", function () {
    $("#filter-direct-assessment-form")[0].reset();
    reloadDataTable();
    $("#filterDirectAssessmentModal").modal("hide"); // Close the modal
  });
});

$(document).ready(function () {
  let table2;

  // Function to reload DataTable with filters
  function reloadDataTable(filters = {}) {
    if ($.fn.DataTable.isDataTable("#invoice-datatable")) {
      table2.destroy();
    }

    table2 = $("#invoice-datatable").DataTable({
      serverSide: true,
      paging: true,
      ordering: false,
      pageLength: parseInt(filters.limit) || 50,
      responsive: true,
      searchDelay: 500,
      pagingType: "simple_numbers",
      searching: false,
      ajax: function (data, callback, settings) {
        const pageNumber =
          filters.page || Math.ceil(data.start / data.length) + 1;

        const apiFilters = {
          page: pageNumber,
          limit: filters.limit || data.length,
          tax_number: filters.tax_number,
          invoice_number: filters.invoice_number,
          status: filters.status,
          generated_date_start: filters.generated_date_start,
          generated_date_end: filters.generated_date_end,
        };

        // Call your API with the filters
        $.ajax({
          url: `${HOST}/get-direct-assessment-invoices`,
          type: "GET",
          data: apiFilters,
          dataType: "json",
          headers: {
            Authorization: "Bearer " + authToken,
          },
          beforeSend: function () {
            $("#invoice-datatable tbody").html(`
              <tr class="loader-row">
                <td colspan="13" class="text-center">
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
            if (response.status === "success") {
              dataToExport2 = response.data.invoices;
              callback({
                draw: data.draw,
                recordsTotal: response.data.total_records,
                recordsFiltered: response.data.total_records,
                data: response.data.invoices,
              });
            } else {
              alert("Failed to fetch invoice data.");
            }
          },
          error: function () {
            alert("Failed to fetch invoice data.");
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
        { data: "tax_number" },
        { data: "invoice_number" },
        { data: "generated_date" },
        {
          data: "taxpayer_first_name",
          render: function (data, type, row) {
            return `${row.taxpayer_first_name} ${row.taxpayer_last_name}`;
          },
        },
        { data: "taxpayer_email" },
        { data: "taxpayer_phone" },
        {
          data: "payment_status",
          render: function (data) {
            const statusClass =
              data === "paid" ? "badge-success" : "badge-danger";
            return `<span class="badge ${statusClass}">${data}</span>`;
          },
        },
        { data: "amount_paid" },
        { data: "invoice_due_date" },
        {
          data: "invoice_payment_status",
          render: function (data) {
            const statusClass =
              data === "paid" ? "badge-success" : "badge-danger";
            return `<span class="badge ${statusClass}">${data}</span>`;
          },
        },
        {
          data: "invoice_number",
          render: function (data, type, row) {
            return `
              <a href="../invoiceGeneration/invoice.html?invoice_number=${data}"
                 class="btn btn-primary btn-sm" target="_blank">
                  View Invoice
              </a>
            `;
          },
        },
      ],
    });
  }

  // Initialize DataTable on page load
  reloadDataTable();

  // Handle "Apply Filters" button click
  $("#apply-filters").on("click", function () {
    const filters = {
      tax_number: $("#tax_number").val(),
      invoice_number: $("#invoice_number").val(),
      status: $("#status").val(),
      generated_date_start: $("#generated_date_start").val(),
      generated_date_end: $("#generated_date_end").val(),
    };
    reloadDataTable(filters);
    $("#filterModal").modal("hide"); // Close the modal
  });

  // Handle "Reset Filters" button click
  $("#reset-filters").on("click", function () {
    $("#filter-form")[0].reset();
    reloadDataTable();
    $("#filterModal").modal("hide"); // Close the modal
  });
});

function checkAll(e) {
  let checkboxes = document.querySelectorAll(".checkboxer[type=checkbox]");

  if (e.checked) {
    checkboxes.forEach((checkbox) => {
      checkbox.checked = true;
    });
  } else {
    checkboxes.forEach((checkbox) => {
      checkbox.checked = false;
    });
  }
}

function generateInvoice(button) {
  const userId = button.getAttribute("data-id");
  const taxNumber = button.getAttribute("data-taxNumber");
  const monthlyTaxPayable = parseFloat(
    button.getAttribute("data-monthly_tax_payable")
  );

  let selectOptions = revenueHeadItems
    .map(
      (item) =>
        `<option data-mdaid="${item.mda_id}" value="${item.id}">${item.item_name} - (${item.category})</option>`
    )
    .join("");

  Swal.fire({
    title: "Generate Invoice",
    text: `Are you sure you want to generate invoice for this user?`,
    html: `
      <p>Total amount to be paid: ₦ ${monthlyTaxPayable.toLocaleString(
        "en-NG",
        {
          minimumFractionDigits: 2,
        }
      )}</p>
      <div class="form-group">
        <label for="revenueHead">Select Revenue Head:</label>
        <select id="revenueHead" class="form-select">
          <option selected disabled>-- Select from list --</option>
          ${selectOptions}
        </select>
      </div>
      <div class="form-group">
        <label for="revMonth">Select Month:</label>
        <input type="date" id="revMonth" name="month" class="form-control">
      </div>
    `,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#02A75A",
    confirmButtonText: "Generate Invoice",
    cancelButtonText: "Cancel",
    showLoaderOnConfirm: true,
    preConfirm: async () => {
      try {
        const selectedRevenueHead =
          document.getElementById("revenueHead").value;
        const selectedOption =
          document.getElementById("revenueHead").options[
            document.getElementById("revenueHead").selectedIndex
          ];
        const mda_id = selectedOption.getAttribute("data-mdaid");

        let dataToSend = {
          tax_number: taxNumber,
          invoice_type: "direct assessment",
          invoice_duration: $("#revMonth").val(),
          tax_office: "kano Tax Office",
          lga: "Auyo",
          description: `Direct Assessment Invoice for user ${taxNumber}`,
          revenue_heads: [
            {
              revenue_head_id: selectedRevenueHead,
              mda_id: mda_id,
              amount: monthlyTaxPayable,
            },
          ],
        };

        const response = await fetch(`${HOST}/create-invoice`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSend),
        });

        if (!response.ok) {
          return Swal.showValidationMessage(
            `Request failed: ${await response.text()}`
          );
        }
        return response.json();
      } catch (error) {
        Swal.showValidationMessage(`Request failed: ${error}`);
      }
    },
    allowOutsideClick: () => !Swal.isLoading(),
  }).then((resulto) => {
    if (resulto.isConfirmed) {
      const invoiceNumber = resulto.value.invoice_number;

      Swal.fire({
        title: "Generating...",
        text: "Please wait while the request is processed",
        didOpen: () => {
          Swal.showLoading();
        },
        allowOutsideClick: () => !Swal.isLoading(),
      });

      // Now, call the paye-invoice-staff endpoint
      const payeInvoiceStaffUrl = `${HOST}/create-direct-assessment-invoice`;
      const payeInvoiceStaffData = {
        invoice_number: invoiceNumber,
        tax_number: taxNumber, // Assuming this is a fixed value or fetched from somewhere
        direct_assessment_id: userId, // Include the staff_data array here
      };

      fetch(payeInvoiceStaffUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payeInvoiceStaffData),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "success") {
            Swal.fire({
              title: "Success",
              text: "Direct assessment invoice staff records created successfully!",
              icon: "success",
              showCancelButton: false,
              confirmButtonColor: "#02A75A",
              confirmButtonText: "Open Invoice",
            }).then((result) => {
              window.location.href = `../../invoiceGeneration/invoice.html?invoice_number=${invoiceNumber}`;
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Failed to associate staff with invoice.",
            });
          }
        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to associate staff with invoice.",
          });
        });
    }
  });
}

function exportData(tableId, filename) {
  const tableData = tableId === "datatable" ? dataToExport : dataToExport2;
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
