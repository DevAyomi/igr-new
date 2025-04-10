$(document).ready(function () {
  table = $("#datatable1").DataTable({
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
        url: `${HOST}/get-enumerator-admins`,
        type: "GET",
        data: filters,
        dataType: "json",
        headers: {
          Authorization: "Bearer " + authToken,
        },
        beforeSend: function () {
          // Optional: Add a loading indicator
          $("#datatable1 tbody").html(`
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

          if (!hasPermission(26)) { // View General Enumeration List
            $("#datatable1 tbody").html(`
              <tr class="loader-row">
                <td colspan="11" class="text-center">
                  <p>You don't have access to view this data.</p>
                </td>
              </tr>
            `);
          } else {
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
      { data: "fullname" },
      { data: "email" },
      { data: "phone" },
      { data: "tax_payer_count" },
      {
        data: "agent_id",
        render: function (data) {
          return `
            <a href="viewagent.html?agent_id=${data}" class="btn btn-primary btn-sm">View</a>
          `;
        },
      },
    ],
  });
});

$("#createUserBtn").on("click", function () {
  $(".form-group .error-message").remove();

  // Collect form values
  const agentData = {
    agent_id: userId,
    fullname: $("#agentName").val().trim(),
    email: $("#agentEmail").val().trim(),
    password: $("#userPassword").val(),
    phone: $("#phone").val().trim(),
    state: $("#repSelectState").val(),
    lga: $("#repSelectLGA").val(),
    address: $("#address").val().trim(),
    status: 1,
  };

  // Validation errors object
  const validationErrors = {};

  // Validate required fields
  if (!agentData.fullname) validationErrors.agentName = "Name is required.";
  if (!agentData.email) {
    validationErrors.agentEmail = "Email address is required.";
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(agentData.email)) {
      validationErrors.agentEmail = "Please enter a valid email address.";
    }
  }
  if (!agentData.phone) validationErrors.phone = "Phone number is required.";
  if (!agentData.state) validationErrors.states = "State is required.";
  if (!agentData.lga) validationErrors.lga = "LGA is required.";
  if (!agentData.address) validationErrors.address = "Address is required.";

  // Show error messages under each field
  for (const fieldId in validationErrors) {
    const errorMessage = `<small class="text-danger error-message">${validationErrors[fieldId]}</small>`;
    $(`#${fieldId}`).closest(".form-group").append(errorMessage);
  }

  // If validation errors exist, stop form submission
  if (Object.keys(validationErrors).length > 0) {
    return;
  }
  $("#createUserBtn")
    .prop("disabled", true)
    .html(
      '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Creating...'
    );
  // AJAX request
  $.ajax({
    type: "POST",
    url: `${HOST}/register-enumerators`, // Ensure HOST is defined
    data: JSON.stringify(agentData),
    dataType: "json",
    headers: {
      Authorization: "Bearer " + SessionManager.getSessionData().token,
    },
    success: function (response) {
      if (response.status === "success") {
        // Show success message
        Swal.fire({
          icon: "success",
          title: "Enumerator Created",
          text: "The Enumerator has been successfully created.",
          confirmButtonText: "OK",
        }).then(() => {
          // Close modal
          $("#createNewFieldAgentModal").modal("hide");
          // Optionally refresh MDA list or perform other actions
        });
      } else {
        // Show error message
        Swal.fire({
          icon: "error",
          title: "Creation Failed",
          text: response.message || "Failed to create Enumerator",
          confirmButtonText: "Try Again",
        });
      }
    },
    error: function (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          err.responseJSON.message || "Something went wrong. Please try again.",
        confirmButtonText: "OK",
      });
      console.error(err.responseJSON.message);
    },
    complete: function () {
      $("#createUserBtn").prop("disabled", false).html("Create User");
    },
  });
});

function fetchEnumeratorStatistics() {
  $.ajax({
    type: "GET",
    url: `${HOST}/get-enumtaxpayer-statistics`,
    dataType: "json",
    headers: {
      Authorization: "Bearer " + authToken,
      "Content-Type": "application/json",
    },
    success: function (response) {
      if (response.status === "success") {
        const stats = response.data;

        $("#totalTaxpayerEnum").text(stats.total_enumerator_tax_payers);
        $("#totalFieldAgent").text(stats.total_enumerator_agent);
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

fetchEnumeratorStatistics();
