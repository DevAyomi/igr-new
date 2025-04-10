$("#loginBtn").on("click", function () {
  let passwordInput = document.querySelector("#password").value;
  let confirmpassword = document.querySelector("#confirmpassword").value;

  if (passwordInput === "" || confirmpassword === "") {
    Swal.fire({
      title: "Empty Field",
      text: "Please Enter your Password",
      icon: "error",
    });
    return;
  }

  if (passwordInput !== confirmpassword) {
    Swal.fire({
      title: "No Match",
      text: "Confirm Password must match with Password",
      icon: "error",
    });
    return;
  }

  $("#loginBtn")
    .prop("disabled", true)
    .html(
      '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Saving...'
    );

  let urlParamsreset = new URLSearchParams(window.location.search);
  const resetToken = urlParamsreset.get("resetToken");

  let dataToSend = {
    reset_token: resetToken,
    new_password: passwordInput,
  };

  $.ajax({
    type: "POST",
    url: `${HOST}/mda-reset-password`,
    data: JSON.stringify(dataToSend),
    dataType: "json",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + authToken
    },
    crossDomain: true,
    success: function (response) {
      $("#loginBtn").prop("disabled", false).html("Save Password");
      if (response.status === "success") {
        $("#loginBtn").prop("disabled", true).html("Login In");

        Swal.fire({
          title: "Success",
          icon: "success",
          html: `
              <p>Your Password has been updated successfully.</p>
              <p>You can login to your account with your new password.</p>
            `,
        }).then((resulto) => {
          if (resulto.isConfirmed) {
            window.location.href = "./index.html";
          }
        });
      } else {
        $("#msg_box").html(`
            <div class="alert alert-danger text-center" role="alert">An Error occurred while resetting your password</div>
          `);
      }
    },
    error: function (err) {
      console.error(err);
      $("#loginBtn").prop("disabled", false).html("Save Password");
      $("#msg_box").html(`
            <div class="alert alert-danger text-center" role="alert">An Error occurred while resetting your password
            </div>
          `);
    },
  });
});
