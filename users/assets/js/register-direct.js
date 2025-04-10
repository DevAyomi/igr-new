$("#createStaffBtn").on("click", async function () {
  const basic_salary = $("input[name='basic_salary']").val();
  const housing = $("input[name='housing']").val();
  const transport = $("input[name='transport']").val();
  const utility = $("input[name='utility']").val();
  const medical = $("input[name='medical']").val();
  const entertainment = $("input[name='entertainment']").val();
  const leaves = $("input[name='leaves']").val();
  const date_employed = $("input[name='date_employed']").val();

  if (
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
    tax_number: userData.tax_number,
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
