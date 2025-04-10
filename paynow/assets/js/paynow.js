$("#verifyInvoice").on("click", async () => {
  await verifyInvoice();
});
async function verifyInvoice() {
  let invoice_number = document.querySelector("#invoice_number").value;
  if (invoice_number === "") {
    alert("Invoice number cannot be empty");
    return;
  }

  $("#verifyInvoice")
    .prop("disabled", true)
    .html('<i class="custom-spinner"></i> Verifying ...');

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

    $("#verifyInvoice")
      .prop("disabled", false)
      .html('SUBMIT <i class="fa fa-arrow-right"></i>');

    if (
      result.status === "success" &&
      result.data[objectoFill[checker]].length > 0
    ) {
      let invoice_info = "";
      if (invoice_number.includes("CDN")) {
        invoice_info = result.data.demand_notices[0];
      } else {
        invoice_info = result.data.invoices[0];
      }

      if (invoice_info.payment_status === "unpaid") {
        $("#imgPay").attr("src", "../assets/img/notPaid.svg");
        $("#errorIcon").removeClass("hidden");
        $("#successIcon").addClass("hidden");
        $("#textPay").html("This invoice has not been paid");

        if (invoice_number.includes("CDN")) {
          $("#urlPay").attr(
            "href",
            `../invoiceGeneration/demandinvoice.html?invoice_number=${invoice_number}`
          );
        } else {
          $("#urlPay").attr(
            "href",
            `../invoiceGeneration/invoice.html?invoice_number=${invoice_number}`
          );
        }

        $("#paynowText").html(`Pay Now`);
      } else {
        $("#imgPay").attr("src", "../assets/img/paid.png");
        $("#textPay").html("This invoice has been paid");
        $("#successIcon").removeClass("hidden");
        $("#errorIcon").addClass("hidden");

        $("#urlPay").attr(
          "href",
          `../invoiceGeneration/payment-receipt.html?invoice_number=${invoice_number}`
        );
        $("#paynowText").html(`View Receipt`);
      }

      nextPrev(1);
    } else {
      $("#msg_box").html(
        `<p class="text-danger text-center mt-4 text-lg">Invoice Not Found</p>`
      );
    }
  } catch (error) {
    $("#verifyInvoice").prop("disabled", false).html("Verify");
    $("#msg_box").html(
      `<p class="text-danger text-center mt-4 text-lg">Failed to Fetch</p>`
    );
    console.log(error);
  } finally {
    $("#verifyInvoice").prop("disabled", false).html("Verify");
  }
}
