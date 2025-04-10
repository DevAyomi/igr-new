
$("#LoginNow").on('click', function () {
  let tccNumInput = document.querySelector("#emailAdd").value

  if (tccNumInput === "") {
    Swal.fire({ title: "Empty Field", text: "Please Enter your Email Address", icon: "error" });

    return;
  }
  $("#LoginNow").prop("disabled", true)
    .html('<span class="custom-spinner"></span> resetting...')

  let thedataToSend = {
    email: tccNumInput
  }
  $.ajax({
    type: "POST",
    url: `${HOST}/taxpayer-forgot-password`,
    dataType: "json",
    data: JSON.stringify(thedataToSend),
    crossDomain: true,
    success: function (response) {
      $("#LoginNow").prop("disabled", false)
        .html('Reset Password')
      if (response.status === "success") {
        $("#LoginNow").prop("disabled", true)
          .html('Check your mail')
        Swal.fire({
          title: "Success",
          icon: "success",
          html: `
              <p>An Email has been sent to your  Email Address.</p>
              <p>Follow the instruction in your Email to set up your new password.</p>
            `,
        })


      } else {
        $("#msg_box").html(`
          <div class="alert alert-warning text-center" role="alert">Your Email Address was not found in our database</div>
        `);
      }
    },
    error: function (err) {
      console.error("Error fetching TCC:", err);
      $("#LoginNow").prop("disabled", false)
        .html('Reset Password')
      $("#msg_box").html(`
          <div class="alert alert-danger text-center" role="alert">${err.responseJSON.message ? err.responseJSON.message : 'An Error occurred while resetting your password'}</div>
        `);
    },
  });
})