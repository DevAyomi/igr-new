const special_user_id = getParameterByName("id");
const payeId = getParameterByName("payerId");

$("#createStaffBtn").on("click", async function () {
  const fullname = $("input[name='fullname']").val();
  const email = $("input[name='email']").val();
  const phone = $("input[name='phone']").val();
  const payer_id = payeId;
  const associated_special_user_id = special_user_id;
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

  $("#createStaffBtn")
    .prop("disabled", true)
    .html(
      '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Creating...'
    );

  const payload = {
    fullname,
    email,
    phone,
    payer_id,
    associated_special_user_id,
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
    const response = await fetch(`${HOST}/register-employee-with-salary`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (result.status === "success") {
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Staff added successfully.",
      }).then(() => {
        window.location.href = `payedetails.html?id=${special_user_id}&payerId=${payeId}`;
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
