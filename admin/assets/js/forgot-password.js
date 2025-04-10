$("#loginBtn").on("click", function () {
  let emailInput = document.querySelector("#email").value;

  if (emailInput === "") {
    Swal.fire({
      title: "Empty Field",
      text: "Please Enter your Email Address",
      icon: "error",
    });

    return;
  }
  $("#loginBtn")
    .prop("disabled", true)
    .html(
      '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Resetting...'
    );

  let thedataToSend = {
    email: emailInput,
  };
  $.ajax({
    type: "POST",
    url: `${HOST}/admin-forgot-password`,
    dataType: "json",
    data: JSON.stringify(thedataToSend),
    
    crossDomain: true,
    success: function (response) {
      $("#loginBtn").prop("disabled", false).html("Reset Password");
      console.log(response.status);
      if (response.status === "success") {
        $("#loginBtn").prop("disabled", true).html("Check your mail");
        Swal.fire({
          title: "Success",
          icon: "success",
          html: `
                <p>An Email has been sent to your Email Address.</p>
                <p>Follow the instruction in your Email to set up your new password.</p>
              `,
        });
      } else {
        $("#msg_box").html(`
            <div class="alert alert-warning text-center" role="alert">Your Email Address was not found in our database</div>
          `);
      }
    },
    error: function (err) {
      console.error("Error Resetting Password:", err);
      $("#loginBtn").prop("disabled", false).html("Reset Password");
      //   $("#msg_box").html(`
      //         <div class="alert alert-danger text-center" role="alert">${
      //           err.responseJSON.message ||
      //           "An Error occurred while resetting your password"
      //         }</div>
      //       `);
      Swal.fire({
        title: "Error",
        text: "An Error occurred while resetting your password",
        icon: "error",
      });
    },
  });
});
