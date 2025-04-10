let dataToExport;
$(document).ready(function () {
  let table;

  // Initialize DataTable
  table = $("#tax-office-datatable").DataTable({
    serverSide: true,
    paging: true,
    ordering: false,
    pageLength: 50,
    responsive: true,
    searchDelay: 500,
    pagingType: "simple_numbers",
    searching: false,
    ajax: function (data, callback, settings) {
      const pageNumber = Math.ceil(data.start / data.length) + 1;

      const apiFilters = {
        page: pageNumber,
        limit: data.length,
        office_name: $("#office_name_filter").val(),
        office_code: $("#office_code_filter").val(),
        region: $("#region_filter").val(),
      };

      // Call your API with the filters
      $.ajax({
        url: `${HOST}/tax-offices`,
        type: "GET",
        data: apiFilters,
        dataType: "json",
        headers: {
          Authorization: "Bearer " + authToken,
        },
        beforeSend: function () {
          $("#tax-office-datatable tbody").html(`
              <tr class="loader-row">
                <td colspan="8" class="text-center">
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
            dataToExport = response.data.tax_offices;
            callback({
              draw: data.draw,
              recordsTotal: response.data.total_records,
              recordsFiltered: response.data.total_records,
              data: response.data.tax_offices,
            });
          } else {
            console.error("Failed to fetch tax office data.");
          }
        },
        error: function () {
          console.error("Failed to fetch tax office data.");
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
      { data: "office_name" },
      { data: "office_code" },
      { data: "location" },
      { data: "contact_phone" },
      { data: "contact_email" },
      { data: "region" },
      {
        data: "status",
        render: function (data) {
          const statusClass =
            data === "active" ? "badge-success" : "badge-danger";
          return `<span class="badge ${statusClass}">${data}</span>`;
        },
      },
      {
        data: "id",
        render: function (data, type, row) {
          return `
              <button class="btn btn-secondary btn-sm editTaxOffice" data-id="${data}" data-bs-toggle="modal" data-bs-target="#editTaxOfficeModal">
                Edit
              </button>
              ${
                row.status === "active"
                  ? `<button class="btn btn-danger btn-sm" onclick="deleteTaxOffice(${data})">
                Deactivate
              </button>`
                  : `<button class="btn btn-primary btn-sm" onclick="deleteTaxOffice(${data})">
                Activate
              </button>`
              }
              
            `;
        },
      },
    ],
  });

  // Apply filters
  $("#filterTaxOfficeModal #applyFilter").on("click", function () {
    table.ajax.reload();
    $("#filterTaxOfficeModal").modal("hide");
  });

  // Reset filters
  $("#filterTaxOfficeModal #clearFilter").on("click", function () {
    $("#office_name_filter").val("");
    $("#office_code_filter").val("");
    $("#region_filter").val("");
    table.ajax.reload();
    $("#filterTaxOfficeModal").modal("hide");
  });
});

$("#createTaxOfficeBtn").on("click", function () {
  const taxOfficeData = {
    office_name: $("#office_name").val().trim(),
    office_code: $("#office_code").val().trim(),
    location: $("#location").val().trim(),
    contact_phone: $("#contact_phone").val().trim(),
    contact_email: $("#contact_email").val().trim(),
    region: $("#region").val(),
  };

  // Validation
  if (
    !taxOfficeData.office_name ||
    !taxOfficeData.office_code ||
    !taxOfficeData.location ||
    !taxOfficeData.contact_phone ||
    !taxOfficeData.contact_email ||
    !taxOfficeData.region
  ) {
    Swal.fire({
      icon: "error",
      title: "Validation Error",
      text: "All fields are required.",
    });
    return;
  }

  $("#createTaxOfficeBtn")
    .prop("disabled", true)
    .html(
      '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Creating...'
    );

  $.ajax({
    type: "POST",
    url: `${HOST}/tax-offices`,
    contentType: "application/json",
    data: JSON.stringify(taxOfficeData),
    headers: {
      Authorization: "Bearer " + authToken,
      "Content-Type": "application/json",
    },
    success: function (response) {
      if (response.status === "success") {
        Swal.fire({
          icon: "success",
          title: "Tax Office Created",
          text: "The tax office has been successfully created.",
        }).then(() => {
          $("#createTaxOfficeModal").modal("hide");
          $("#tax-office-datatable").DataTable().draw();
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Creation Failed",
          text: response.message || "Failed to create tax office.",
        });
      }
    },
    error: function (xhr) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: xhr.responseJSON?.message || "Something went wrong.",
      });
    },
    complete: function () {
      $("#createTaxOfficeBtn")
        .prop("disabled", false)
        .html("Create Tax Office");
    },
  });
});

$(document).on("click", ".editTaxOffice", function () {
  const taxOfficeId = $(this).data("id");

  // Fetch tax office details
  $.ajax({
    type: "GET",
    url: `${HOST}/tax-offices?id=${taxOfficeId}`,
    headers: {
      Authorization: "Bearer " + authToken,
    },
    success: function (response) {
      if (response.status === "success") {
        const taxOffice = response.data.tax_offices[0];
        $("#edit_office_id").val(taxOffice.id);
        $("#edit_office_name").val(taxOffice.office_name);
        $("#edit_office_code").val(taxOffice.office_code);
        $("#edit_location").val(taxOffice.location);
        $("#edit_contact_phone").val(taxOffice.contact_phone);
        $("#edit_contact_email").val(taxOffice.contact_email);
        $("#edit_region").val(taxOffice.region);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch tax office details.",
        });
      }
    },
    error: function () {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch tax office details.",
      });
    },
  });
});

$("#editTaxOfficeBtn").on("click", function () {
  const taxOfficeData = {
    id: $("#edit_office_id").val(),
    office_name: $("#edit_office_name").val().trim(),
    office_code: $("#edit_office_code").val().trim(),
    location: $("#edit_location").val().trim(),
    contact_phone: $("#edit_contact_phone").val().trim(),
    contact_email: $("#edit_contact_email").val().trim(),
    region: $("#edit_region").val(),
  };

  // Validation
  if (
    !taxOfficeData.office_name ||
    !taxOfficeData.office_code ||
    !taxOfficeData.location ||
    !taxOfficeData.contact_phone ||
    !taxOfficeData.contact_email ||
    !taxOfficeData.region
  ) {
    Swal.fire({
      icon: "error",
      title: "Validation Error",
      text: "All fields are required.",
    });
    return;
  }

  $("#editTaxOfficeBtn")
    .prop("disabled", true)
    .html(
      '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Saving...'
    );

  $.ajax({
    type: "POST",
    url: `${HOST}/update-tax-office`,
    contentType: "application/json",
    data: JSON.stringify(taxOfficeData),
    headers: {
      Authorization: "Bearer " + authToken,
      "Content-Type": "application/json",
    },
    success: function (response) {
      if (response.status === "success") {
        Swal.fire({
          icon: "success",
          title: "Tax Office Updated",
          text: "The tax office has been successfully updated.",
        }).then(() => {
          $("#editTaxOfficeModal").modal("hide");
          $("#tax-office-datatable").DataTable().draw();
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text: response.message || "Failed to update tax office.",
        });
      }
    },
    error: function (xhr) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: xhr.responseJSON?.message || "Something went wrong.",
      });
    },
    complete: function () {
      $("#editTaxOfficeBtn").prop("disabled", false).html("Save Changes");
    },
  });
});

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
  a.download = "taxoffice_list.csv";
  a.click();
}

function deleteTaxOffice(id) {
  Swal.fire({
    title: "Are you sure?",
    text: "Do you want to change the status of this tax office?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#02a75a",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, change it!",
  }).then((result) => {
    if (result.isConfirmed) {
      const deleteButton = $(`button[onclick="deleteTaxOffice(${id})"]`);
      deleteButton
        .prop("disabled", true)
        .html(
          '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Changing...'
        );

      $.ajax({
        type: "POST",
        url: `${HOST}/toggle-tax-office-status`,
        contentType: "application/json",
        data: JSON.stringify({ id }),
        headers: {
          Authorization: "Bearer " + authToken,
          "Content-Type": "application/json",
        },
        success: function (response) {
          if (response.status === "success") {
            Swal.fire({
              icon: "success",
              title: "Status Changed",
              text: "The status of the tax office has been successfully changed.",
            }).then(() => {
              $("#tax-office-datatable").DataTable().draw();
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Change Failed",
              text: response.message || "Failed to change status.",
            });
          }
        },
        error: function (xhr) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: xhr.responseJSON?.message || "Something went wrong.",
          });
        },
        complete: function () {
          deleteButton
            .prop("disabled", false)
            .html(
              deleteButton.hasClass("btn-danger") ? "Deactivate" : "Activate"
            );
        },
      });
    }
  });
}
