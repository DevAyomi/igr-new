const special_user_id = getParameterByName("id");
const payeId = getParameterByName("payerId");

const mdaSelectize = $("#tax_number").selectize({
  placeholder: "Select a taxpayer...",
});

function fetchTaxPayer() {
  $.ajax({
    type: "GET",
    url: `${HOST}/get-taxpayers?limit=1000000000`,
    dataType: "json",
    headers: {
      Authorization: "Bearer " + authToken,
      "Content-Type": "application/json",
    },
    crossDomain: true,
    success: function (response) {
      if (response.status === "success" && response.data.length > 0) {
        const taxpayers = response.data;
        const mdaSelectizeInstance = mdaSelectize[0].selectize;

        // Clear existing options
        mdaSelectizeInstance.clearOptions();

        // Add a default placeholder option
        mdaSelectizeInstance.addOption({
          value: "",
          text: "Select a taxpayer...",
        });

        // Populate MDA options
        taxpayers.forEach((taxpayer) => {
          mdaSelectizeInstance.addOption({
            value: taxpayer.tax_number,
            text:
              taxpayer.first_name +
              " " +
              taxpayer.surname +
              " (" +
              taxpayer.tax_number +
              ")",
          });
        });

        // Refresh Selectize options
        mdaSelectizeInstance.refreshOptions(false);
      } else {
        // alert("No MDA data available.");
        console.error("No MDA data available.");
      }
    },
    error: function (err) {
      console.error("Error fetching MDA data:", err);
      //   alert("An error occurred while fetching the MDA data.");
    },
  });
}

$(document).ready(async function () {
  fetchTaxPayer();
});

$("#createStaffBtn").on("click", async function () {
  const employee_taxnumber = $("#tax_number").val();
  const basic_salary = $("input[name='basic_salary']").val();
  const housing = $("input[name='housing']").val();
  const transport = $("input[name='transport']").val();
  const utility = $("input[name='utility']").val();
  const medical = $("input[name='medical']").val();
  const entertainment = $("input[name='entertainment']").val();
  const leaves = $("input[name='leaves']").val();
  const date_employed = $("input[name='date_employed']").val();

  if (
    !employee_taxnumber ||
    !basic_salary ||
    !housing ||
    !transport ||
    !utility ||
    !medical ||
    !entertainment ||
    !leaves ||
    !date_employed
  ) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Please fill in all required fields.",
    });
    return;
  }

  const payload = {
    tax_number: employee_taxnumber,
    basic_salary,
    housing,
    transport,
    utility,
    medical,
    entertainment,
    leaves,
    date_employed, // New field
  };

  $("#createStaffBtn")
    .prop("disabled", true)
    .html(
      '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Creating...'
    );

  try {
    const response = await fetch(`${HOST}/register-direct-assessment`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + authToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (result.status === "success") {
      Swal.fire({
        icon: "success",
        title: "Success",
        text: result.message || "Staff added successfully.",
      }).then(() => {
        window.location.href = `direct-assessment.html`;
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: result.message,
      });
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Something went wrong",
      text: "Failed to add staff. Please try again.",
    });
    console.error(error);
  } finally {
    $("#createStaffBtn").prop("disabled", false).html("Submit");
  }
});
