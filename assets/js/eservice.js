$("#checkStatus").on('click', function () {
  let tccNumInput = document.querySelector("#tccNumInput").value

  if (tccNumInput === "") {
    Swal.fire({ title: "Empty Field", text: "Please Enter your TCC Number", icon: "error" });

    return;
  }
  $("#checkStatus").prop("disabled", true)
    .html('<span class="custom-spinner"></span> checking status...')

  $.ajax({
    type: "GET",
    url: `${HOST}/noauth-get-tcc?tcc_number=${tccNumInput}`,
    dataType: "json",
    crossDomain: true,
    success: function (response) {
      $("#checkStatus").prop("disabled", false)
        .html('Check Status')
      if (response.status === "success" && response.data.length > 0) {
        const invoices = response.data[0];

        if (invoices.status === "approved") {
          Swal.fire({
            title: "Approved",
            icon: "success",
            html: `
                <b>${tccNumInput}</b>,
                <p>Great, Your TCC Request has been Approved.</p>
              `,
            showCloseButton: true,
            showCancelButton: true,
            focusConfirm: false,
            confirmButtonColor: "#02A75A",
            confirmButtonText: `
                <i class="fas fa-certificate"></i> View Certificate!
              `,
            cancelButtonText: "Close",
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.href = `./etcc/etcc-certificate.html?tcc_number=${tccNumInput}`
            }
          });
        } else {
          Swal.fire({
            title: invoices.status,
            icon: "info",
            html: `
                <b>${tccNumInput}</b>,
                <p>Your TCC is under review.</p>
              `,
          })
        }


      } else {
        Swal.fire({ title: "NOT Found", text: `The TCC Number ${tccNumInput} is not Not Found.`, icon: "error" });
      }
    },
    error: function (err) {
      console.error("Error fetching TCC:", err);
      $("#checkStatus").prop("disabled", false)
        .html('Check Status')
      Swal.fire({ title: "NOT Found", text: `The TCC Number ${tccNumInput} is not Not Found.`, icon: "error" });
    },
  });
})