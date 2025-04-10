var paystack_script = document.createElement("script");
paystack_script.setAttribute("src", "https://js.paystack.co/v1/inline.js");
document.head.appendChild(paystack_script);

const urlParams = new URLSearchParams(window.location.search);
const invoice_number = urlParams.get("invoice_number");

const paymentMethods = [
  { id: "paystack", name: "Paystack", image: "./img/paystack.png" },
  {
    id: "interswitch",
    name: "Interswitch",
    image: "./img/interswitch.png",
  },
  { id: "credo", name: "Credo", image: "./img/credo.png" },
  {
    id: "flutterwave",
    name: "Flutterwave",
    image: "./img/flutterwave.png",
  },
  { id: "remita", name: "Remita", image: "./img/remita.png" },
  { id: "bank", name: "Bank branch", image: "./img/bankbranch.png" },
];

const paymentContainer = document.querySelector(".payment-container");

paymentMethods.forEach((method) => {
  const paymentCard = `
  
  <label class="form-check-label bg-gray-100 text-center flex flex-col rounded-xl p-2" for="${method.id}">
    <input
    class="form-check-input paymnt-radio"
    type="radio"
    name="paymentMethod"
    value="${method.name}"
    id="${method.id}"
  />
    <div class="h-20 w-auto">
      <img src="${method.image}" alt="${method.name}" class="w-full h-full object-contain" />
    </div>
  
    <p class="mt-2 font-medium">${method.name}</p>
  </label>
`;
  paymentContainer.insertAdjacentHTML("beforeend", paymentCard);
});

function payNow() {
  let selectedValue = $('.paymnt-radio[name="paymentMethod"]:checked').val();
  console.log(selectedValue);
  if (selectedValue) {
    if (selectedValue === "Paystack") {
      payStackPayment();
    }
  } else {
    alert("Please Select a Payment Option");
  }
}

async function payStackPayment() {
  try {
    $("#paynowBtn")
      .prop("disabled", true)
      .html('<i class="custom-spinner"></i> Loading ...');

    let responseUrl = ""
    let checker = ""
    if (invoice_number.includes("CDN")) {
      responseUrl = `noauth-get-demand-notice-invoices?invoice_number=${invoice_number}`
      checker = "demand_notices"
    } else {
      responseUrl = `noauth-get-invoices?invoice_number=${invoice_number}`
      checker = "invoices"
    }

    let objectoFill = {
      demand_notices: "demand_notices",
      invoices: "invoices"
    }

    const response = await fetch(`${HOST}/${responseUrl}`);
    const result = await response.json();

    $("#paynowBtn")
      .prop("disabled", false)
      .html(`Pay Now <i class="fa fa-arrow-right">`);

    if (result.status === "success") {
      if (result.data[objectoFill[checker]].length > 0) {
        let invoice_info = result.data[objectoFill[checker]][0];

        if (invoice_info.payment_status === "paid") {
          alert("This Invoice has already been paid.");
          return;
        }

        // console.log(invoice_info)
        let totalAmount = 0;

        if (invoice_number.includes("CDN")) {
          invoice_info.revenue_heads.forEach((rev_head) => {
            totalAmount += parseFloat(rev_head.previous_year_amount);
            totalAmount += parseFloat(rev_head.current_year_amount);
          });
        } else {
          invoice_info.revenue_heads.forEach((rev_head) => {
            totalAmount += parseFloat(rev_head.amount);
          });
        }

        var handler = PaystackPop.setup({
          key: "pk_test_a00bd73aad869339803b75183303647b5dcd8305",
          email: invoice_info.tax_email,
          amount: totalAmount * 100,
          currency: "NGN",
          metadata: {
            custom_fields: [
              {
                display_name: "Invoice Number",
                variable_name: "invoice_number",
                value: invoice_number,
              },
            ],
          },
          callback: function (response) {
            //this happens after the payment is completed successfully
            var reference = response.reference;

            $("#paynowBtn")
              .prop("disabled", true)
              .html('<i class="custom-spinner"></i> Verifying Payment ...');
            setTimeout(() => {
              pushDataToDb();
            }, 5000);


            // alert('Payment complete! Reference: ' + reference);
          },
          onClose: function () {
            alert("Transaction was not completed, window closed.");
          },
        });
        handler.openIframe();
      } else {
        $("#msg_box").html(
          `<p class="text-warning text-center mt-4 text-lg">Invoice Not Found</p>`
        );
      }
    } else {
      $("#msg_box").html(
        `<p class="text-warning text-center mt-4 text-lg">Invoice Not Found</p>`
      );
    }
  } catch (error) {
    $("#paynowBtn")
      .prop("disabled", false)
      .html(`Pay Now <i class="fa fa-arrow-right">`);
    console.log(error);
    $("#msg_box").html(
      `<p class="text-warning text-center mt-4 text-lg">Payment Gateway Failed</p>`
    );
  }
}

async function pushDataToDb() {

  let checker = ""
  let responseUrl = ""
  if (invoice_number.includes("CDN")) {
    responseUrl = `get-demand-notice-invoices?invoice_number=${invoice_number}`
    checker = "demand_notices"
  } else {
    responseUrl = `get-invoices?invoice_number=${invoice_number}`
    checker = "invoices"
  }

  let objectoFill = {
    demand_notices: "demand_notices",
    invoices: "invoices"
  }

  $.ajax({
    type: "GET",
    url: `${HOST}/${responseUrl}`,
    dataType: "json",
    success: function (data) {

      $("#paynowBtn")
        .prop("disabled", false)
        .html('Pay Now <i class="fa fa-arrow-right"></i>');

      if (data.status === "success" && data.data[objectoFill[checker]].length > 0 && data.data[objectoFill[checker]][0].payment_status === "paid") {
        $("#msg_box").html(
          `<p class="text-success text-center mt-4 text-lg">Payment Verified.</p>`
        );
        window.location.href = `./payment-receipt.html?invoice_number=${invoice_number}`;


      } else {
        $("#msg_box").html(
          `<p class="text-danger text-center mt-4 text-lg">Payment Not Verified, Contact Support.</p>`
        );
      }
    },
    error: function (request, error) {
      console.log(request.responseJSON);
      $("#paynowBtn")
        .prop("disabled", false)
        .html('Pay Now <i class="fa fa-arrow-right"></i>');

      $("#msg_box").html(
        `<p class="text-danger text-center mt-4 text-lg">Payment Not Verified, Contact Support.</p>`
      );
    },
  });
}
