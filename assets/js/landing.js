$(".landing_cards").on("mouseover", function () {
  $(".landing_cards").each(function (index) {
    $(this).removeClass("activo");
  });
  $(this).addClass("activo");
});

// $("#verifyBtn").on("click", function () {
//   let invoiceNumber = document.querySelector("#invoiceNumber").value;
//   if (invoiceNumber === "") {
//     Swal.fire({
//       icon: "error",
//       title: "Oops...",
//       text: "Please insert your Invoice Number",
//     });
//   } else {
//     fetch(`${HOST}/index.php?verifyInvoice&invoice_number=${invoiceNumber}`)
//       .then((response) => response.json())
//       .then((data) => {
//         if (data.status === 1) {
//           if (data.message.payment_status == "unpaid") {
//             Swal.fire({
//               icon: "info",
//               title: "Invoice Unpaid",
//               text: "The invoice is unpaid. Proceed to payment.",
//               confirmButtonText: "Proceed to Pay",
//             }).then((result) => {
//               if (result.isConfirmed) {
//                 window.location.href = `invoice.html?invnum=${invoiceNumber}`;
//               }
//             });
//           } else if (data.message.payment_status == "paid") {
//             Swal.fire({
//               icon: "success",
//               title: "Invoice Paid",
//               text: "The invoice has been paid.",
//             });
//           }
//         } else if (data.status === 0) {
//           Swal.fire({
//             icon: "error",
//             title: "Wrong Invoice Number",
//             text: "The invoice number is incorrect. Please try again.",
//           });
//         }
//       });
//   }
// });
$("#verifyBtn").on("click", async () => {
  await verifyInvoice();
});
async function verifyInvoice() {
  let invoice_number = document.querySelector("#invoiceNumber").value;
  if (invoice_number === "") {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Please insert your Invoice Number",
    });

    return;
  }

  $("#verifyBtn").prop("disabled", true).html("Verifying ...");

  let responseUrl = "";
  let checker = "";
  if (invoice_number.includes("CDN")) {
    responseUrl = `noauth-get-demand-notice-invoices?invoice_number=${invoice_number}`;
    checker = "demand_notices";
  } else {
    responseUrl = `noauth-get-invoices?invoice_number=${invoice_number}`;
    checker = "invoices";
  }

  let objectoFill = {
    demand_notices: "demand_notices",
    invoices: "invoices",
  };

  try {
    const response = await fetch(`${HOST}/${responseUrl}`);
    const result = await response.json();
    const data = result.data.invoices[0];
    console.log(data);

    $("#verifyBtn").prop("disabled", false).html("Verify");

    if (result.status === "success" && result.data.invoices.length > 0) {
      if (data.payment_status == "unpaid") {
        Swal.fire({
          icon: "info",
          title: "Invoice Unpaid",
          text: "The invoice is unpaid. Proceed to payment.",
          confirmButtonText: "Proceed to Pay",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = `./invoiceGeneration/invoice.html?invoice_number=${data.invoice_number}`;
          }
        });
      } else if (data.payment_status == "paid") {
        Swal.fire({
          icon: "success",
          title: "Invoice Paid",
          text: "The invoice has been paid.",
          confirmButtonText: "View Receipt",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = `./invoiceGeneration/payment-receipt.html?invoice_number=${data.invoice_number}`;
          }
        });
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Wrong Invoice Number",
        text: "The invoice number is incorrect. Please try again.",
      });
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Something went wrong",
      text: "Failed to verify the invoice. Please try again.",
    });
    console.log(error);
  } finally {
    $("#verifyBtn").prop("disabled", false).html("Verify");
  }
}
