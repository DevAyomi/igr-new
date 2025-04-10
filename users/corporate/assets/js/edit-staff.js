const staffId = getParameterByName("id");
const payerId = getParameterByName("payerId");
const special_user_id = userData.user_id;
const apayerId = getParameterByName("apayerId");
const businessName = getParameterByName("name");

$(document).ready(function () {
  $("#formContainer").hide();
  $("#loadingIndicator").show(); // Show loading indicator
  fetchStaffDetails(staffId).finally(() => {
    $("#loadingIndicator").hide(); // Hide loading indicator
    $("#formContainer").show();
  });

  $("#editStaffBtn").on("click", async function () {
    await updateStaffDetails();
  });
});

async function fetchStaffDetails(staffId) {
  try {
    const response = await fetch(
      `${HOST}/get-special-user-employees?special_user_id=${special_user_id}&payer_id=${payerId}&id=${staffId}`,
      {
        headers: {
          Authorization: "Bearer " + authToken,
        },
      }
    );
    const result = await response.json();

    if (result.status === "success") {
      const staff = result.data[0];
      $("input[name='fullname']").val(staff.fullname);
      $("input[name='email']").val(staff.email);
      $("input[name='phone']").val(staff.phone);
      $("input[name='date_employed']").val(staff.date_employed);
      $("input[name='payer_id']").val(payerId);
      $("input[name='employee_taxnumber']").val(staff.employee_taxnumber);
      $("input[name='basic_salary']").val(staff.basic_salary);
      $("input[name='housing']").val(staff.housing);
      $("input[name='transport']").val(staff.transport);
      $("input[name='utility']").val(staff.utility);
      $("input[name='medical']").val(staff.medical);
      $("input[name='entertainment']").val(staff.entertainment);
      $("input[name='leaves']").val(staff.leaves);
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch staff details.",
      });
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Something went wrong",
      text: "Failed to fetch staff details. Please try again.",
    });
    console.error(error);
  }
}

async function updateStaffDetails() {
  const fullname = $("input[name='fullname']").val();
  const email = $("input[name='email']").val();
  const phone = $("input[name='phone']").val();
  const payer_id = $("input[name='payer_id']").val();
  const employee_taxnumber = $("input[name='employee_taxnumber']").val();
  const basic_salary = $("input[name='basic_salary']").val();
  const housing = $("input[name='housing']").val();
  const transport = $("input[name='transport']").val();
  const utility = $("input[name='utility']").val();
  const medical = $("input[name='medical']").val();
  const entertainment = $("input[name='entertainment']").val();
  const leaves = $("input[name='leaves']").val();

  if (!fullname || !email || !phone || !basic_salary) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Please fill in all required fields.",
    });
    return;
  }

  $("#editStaffBtn")
    .prop("disabled", true)
    .html(
      '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Updating...'
    );

  const payload = {
    id: staffId,
    fullname,
    email,
    phone,
    payer_id,
    employee_taxnumber,
    basic_salary,
    housing,
    transport,
    utility,
    medical,
    entertainment,
    leaves,
  };

  try {
    const response = await fetch(
      `${HOST}/edit-special-user-employee?id=${staffId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + authToken,
        },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();

    if (result.status === "success") {
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Staff updated successfully.",
      }).then(() => {
        window.location.href = "./paye-manager.html";
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
      text: "Failed to update staff. Please try again.",
    });
    console.error(error);
  } finally {
    $("#editStaffBtn").prop("disabled", false).html("Submit");
  }
}
