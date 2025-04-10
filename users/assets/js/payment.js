var flutter_script = document.createElement("script");
flutter_script.setAttribute("src", "https://checkout.flutterwave.com/v3.js");
document.head.appendChild(flutter_script);

var remita_script = document.createElement("script");
remita_script.setAttribute(
  "src",
  "https://remitademo.net/payment/v1/remita-pay-inline.bundle.js"
);
document.head.appendChild(remita_script);

var flutter_script = document.createElement("script");
flutter_script.setAttribute("src", "https://js.paystack.co/v1/inline.js");
document.head.appendChild(flutter_script);

var qr_codeScript = document.createElement("script");
qr_codeScript.setAttribute(
  "src",
  "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"
);
document.head.appendChild(qr_codeScript);

// var html2pdff = document.createElement('script')
// html2pdff.setAttribute('src', 'https://raw.githack.com/eKoopmans/html2pdf/master/dist/html2pdf.bundle.js')
// document.head.appendChild(html2pdff)

$("#makePayment").html(`
<p class="text-2xl fontBold text-center">Make Payment</p>
<p class="text-center">Select your preferred method</p>

<div class="flex items-center flex-wrap justify-center mt-4 gap-3 lg:px-5">

    <div class="payCards active">
        <div class="flex justify-center">
          <iconify-icon icon="ph:bank-fill" class="textPrimary"></iconify-icon>
        </div>
        <p class="text-center">Bank Branch</p>
    </div>
        
    <div class="payCards">
        <div class="flex justify-center">
          <img src="./assets/img/credo.png" alt="etransact" width="30" />
        </div>
        <p class="text-center">eTransanct</p>
    </div>
    
    <div class="payCards">
        <div class="flex justify-center">
          <img src="./assets/img/interswitch.png" alt="paystack" width="30" />
        </div>
        <p class="text-center">Interswitch</p>
    </div>
  
    <div class="payCards">
        <div class="flex justify-center">
          <img src="./assets/img/paystack.svg" alt="paystack" width="30" />
        </div>
        <p class="text-center">PayStack </p>
    </div>


    <div class="payCards">
        <div class="flex justify-center">
          <iconify-icon icon="mdi:naira" class="textPrimary"></iconify-icon>
        </div>
        <p class="text-center">e-Naira</p>
    </div>

</div>

<div id="tabcontainer" class="mt-8 mb-8">

     <div class="lg:px-20 tab_steps active">
        <p class="fontBold text-center text-lg">Follow the steps below to make Bank Branch payments</p>
        <div class="flex justify-center mt-2">
          <img src="./assets/img/linebig.png" alt="">
        </div>
    
        <div class="mt-2">
          <div class="mb-2">
            <h1 class="text-lg fontBold">Step 1</h1>
            <p class="mt-1">Choose 'Bank Branch' as your preferred method.</p>
          </div>
          
          <div class="mb-2">
            <h1 class="text-lg fontBold">Step 2</h1>
            <p class="mt-1">Visit the designated bank branch.</p>
          </div>
          
          <div class="mb-2">
            <h1 class="text-lg fontBold">Step 3</h1>
            <p class="mt-1">Go to your bank branch and present your invoice number or invoice.</p>
          </div>
          
          <div class="mb-2">
            <h1 class="text-lg fontBold">Step 4</h1>
            <p class="mt-1">Make the payment in person using the invoice number on the invoice.</p>
          </div>
          
          <div class="mb-2">
            <h1 class="text-lg fontBold">Step 5</h1>
            <p class="mt-1">Retain the receipt as proof of payment.</p>
          </div>
          
        </div>
      </div>
      
      <div class="lg:px-20 tab_steps">
        <p class="fontBold text-center text-lg">Follow the steps below to make payments using eTransact.</p>
        <div class="flex justify-center mt-2">
          <img src="./assets/img/linebig.png" alt="">
        </div>
    
        <div class="mt-2">

          <div class="mb-2">
            <h1 class="text-lg fontBold">Step 1</h1>
            <p>When you click on proceed, you'll be redirected to a secure payment gateway.</p>
          </div>
          
          <div class="mb-2">
            <h1 class="text-lg fontBold">Step 2</h1>
            <p>Select your preferred payment method from the options provided.</p>
          </div>
          
          <div class="mb-2">
            <h1 class="text-lg fontBold">Step 3</h1>
            <p>Follow the prompt and provide all necessary details as it relates to the payment method chosen.</p>
          </div>
          
          <div class="mb-2">
            <h1 class="text-lg fontBold">Step 4</h1>
            <p>Confirm the payment amount.</p>
          </div>
          
          <div class="mb-2">
            <h1 class="text-lg fontBold">Step 5</h1>
            <p>Once the payment is processed successfully, you will receive a confirmation and and a receipt is generated.</p>
          </div>
        
          <div class="flex justify-center">
            <button class="button w-[60%] mt-3" id="makePBtn" onclick="makePaymentRemita2()">Proceed</button>
          </div>
          
          <div id='msg_boxx'></div>
          
        </div>
      </div>
      
      <div class="lg:px-20 tab_steps">
        <p class="fontBold text-center text-lg">Follow the steps below to make payment using Interswitch</p>
        <div class="flex justify-center mt-2">
          <img src="./assets/img/linebig.png" alt="">
        </div>
    
        <div class="mt-2">
            <div class="mb-2">
                <h1 class="text-lg fontBold">Step 1</h1>
                <p>When you click on proceed, you'll be redirected to a secure payment gateway.</p>
              </div>
              
              <div class="mb-2">
                <h1 class="text-lg fontBold">Step 2</h1>
                <p>Select your preferred payment method from the options provided.</p>
              </div>
              
              <div class="mb-2">
                <h1 class="text-lg fontBold">Step 3</h1>
                <p>Follow the prompt and provide all necessary details as it relates to the payment method chosen.</p>
              </div>
              
              <div class="mb-2">
                <h1 class="text-lg fontBold">Step 4</h1>
                <p>Confirm the payment amount.</p>
              </div>
              
              <div class="mb-2">
                <h1 class="text-lg fontBold">Step 5</h1>
                <p>Once the payment is processed successfully, you will receive a confirmation and and a receipt is generated.</p>
              </div>
              
              
              
        </div>
      </div>

    <div class="lg:px-20 tab_steps">
        <p class="fontBold text-center text-lg">Follow the steps below to make online payments with PayStack</p>
        <div class="flex justify-center mt-2">
          <img src="./assets/img/linebig.png" alt="">
        </div>
    
        <div class="mt-2">
            <div class="mb-2">
                <h1 class="text-lg fontBold">Step 1</h1>
                <p>When you click on proceed, you'll be redirected to a secure payment gateway.</p>
              </div>
              
              <div class="mb-2">
                <h1 class="text-lg fontBold">Step 2</h1>
                <p>Select your preferred payment method from the options provided.</p>
              </div>
              
              <div class="mb-2">
                <h1 class="text-lg fontBold">Step 3</h1>
                <p>Follow the prompt and provide all necessary details as it relates to the payment method chosen.</p>
              </div>
              
              <div class="mb-2">
                <h1 class="text-lg fontBold">Step 4</h1>
                <p>Confirm the payment amount.</p>
              </div>
              
              <div class="mb-2">
                <h1 class="text-lg fontBold">Step 5</h1>
                <p>Once the payment is processed successfully, you will receive a confirmation and and a receipt is generated.</p>
              </div>
              
              
              <div class="flex justify-center">
              <button class="button w-[60%] mt-3" onclick="makePayment()">Proceed</button>
            </div>
        </div>
    
        

    </div>
  
    



  <div class="lg:px-20 tab_steps">
    <p class="fontBold text-center text-lg">Follow the steps below to make e-Naira payments</p>
    <div class="flex justify-center mt-2">
      <img src="./assets/img/linebig.png" alt="">
    </div>

    <div class="mt-10">
      <p>Details coming soon</p>
    </div>
  </div>

</div>
`);

let payCards = document.querySelectorAll(".payCards");
let tab_steps = document.querySelectorAll(".tab_steps");
let invoiceDetails;
if (payCards) {
  payCards.forEach((payCard, i) => {
    payCard.addEventListener("click", function () {
      payCards.forEach((dd) => dd.classList.remove("active"));
      tab_steps.forEach((ff) => ff.classList.remove("active"));
      payCard.classList.add("active");
      tab_steps[i].classList.add("active");
    });
  });
}

function makePaymentRemita() {
  let thePay = document.querySelector("#theBal").textContent;
  console.log(thePay);

  async function openInvoice(invoicenum) {
    const response = await fetch(
      // `${HOST}/php/index.php?getSingleInvoice&invoiceNumber=${invoicenum}`
      `${HOST}/php/index.php?getSingleInvoice&invoiceNumber=${invoicenum}`
    );
    const userInvoices = await response.json();
    console.log(userInvoices);

    if (userInvoices.status === 1) {
      if (userInvoices.message[0].payment_status === "paid") {
        alert("This Invoice has already been paid");
      } else {
        let invoiceDetails = userInvoices.message[0];

        var paymentEngine = RmPaymentEngine.init({
          key: "QzAwMDAyNzEyNTl8MTEwNjE4NjF8OWZjOWYwNmMyZDk3MDRhYWM3YThiOThlNTNjZTE3ZjYxOTY5NDdmZWE1YzU3NDc0ZjE2ZDZjNTg1YWYxNWY3NWM4ZjMzNzZhNjNhZWZlOWQwNmJhNTFkMjIxYTRiMjYzZDkzNGQ3NTUxNDIxYWNlOGY4ZWEyODY3ZjlhNGUwYTY=",
          transactionId: Math.floor(Math.random() * 1101233), // Replace with a reference you generated or remove the entire field for us to auto-generate a reference for you. Note that you will be able to check the status of this transaction using this transaction Id
          customerId: invoiceDetails.email,
          firstName: invoiceDetails.first_name,
          lastName: invoiceDetails.surname,
          email: invoiceDetails.email,
          amount: parseFloat(invoiceDetails.amount_paid),
          narration: invoiceDetails.COL_4,
          onSuccess: function (response) {
            console.log("callback Successful Response", response);

            alert("payment success");
            nextPrev(1);
            openReceipt(invoicenum);

            // let dataToPush = {
            //   "endpoint": "createInvidualPayment",
            //   "data": {
            //     "invoice_number": invoicenum,
            //     "payment_channel": "paystack",
            //     "payment_reference_number": reference,
            //     "receipt_number": reference,
            //     "amount_paid": invoiceDetails.amount_paid
            //   }
            // }
            // $.ajax({
            //   type: "POST",
            //   url: HOST,
            //   dataType: 'json',
            //   data: JSON.stringify(dataToPush),
            //   success: function (data) {
            //     console.log(data)
            //     alert("payment success")
            //     nextPrev(1)
            //     openReceipt(invoicenum)
            //   },
            //   error: function (request, error) {
            //     console.log(error)
            //   }
            // });
          },
          onError: function (response) {
            console.log("callback Error Response", response);
          },
          onClose: function () {
            console.log("closed");
          },
        });
        paymentEngine.showPaymentWidget();
      }
    } else {
      alert("Wrong Invoice");
    }
  }
  let invoicenn = sessionStorage.getItem("invoice_number");
  openInvoice(invoicenn);
}

function makePaymentRemita2() {
  let thePay = document.querySelector("#theBal");
  let finalPay = thePay.dataset.money;

  console.log(finalPay);

  $("#makePBtn").addClass("hidden");
  $("#msg_boxx").html(`
    <div class="flex justify-center items-center mt-4">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
    </div>
  `);

  async function openInvoice(invoicenum) {
    try {
      const response = await fetch(
        `${HOST}/php/index.php?getSingleInvoice&invoiceNumber=${invoicenum}`
      );

      const userInvoices = await response.json();
      // console.log(userInvoices);

      if (userInvoices.status === 1) {
        if (userInvoices.message[0].payment_status === "paid") {
          alert("This Invoice has already been paid");
          $("#makePBtn").removeClass("hidden");
          $("#msg_boxx").html("");
        } else {
          let invoiceDetails = userInvoices.message[0];

          let PaymentData = {
            amount: parseFloat(finalPay) * 100,
            // "amount": 200.00,
            bearer: 1,
            callbackUrl: `https://plateauigr.com/receipt.html?invoice_num=${invoicenum}&amount=${parseFloat(
              finalPay
            )}`,
            channels: ["card", "bank"],
            currency: "₦",
            customerFirstName:
              invoiceDetails.first_name + invoiceDetails.surname,
            customerLastName: invoicenum,
            customerPhoneNumber: invoiceDetails.phone,
            email: invoiceDetails.email,
          };

          $.ajax({
            type: "POST",
            url: "https://api.credocentral.com/transaction/initialize",
            headers: {
              Authorization: "1PUB1136Y1BWMxynI6L3hrqu0H6F4Kfpdp2WME",
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            dataType: "json",
            data: JSON.stringify(PaymentData),
            success: function (data) {
              console.log(data);

              if (data.status === 200) {
                window.location.href = data.data.authorizationUrl;
              } else {
                $("#makePBtn").removeClass("hidden");
                $("#msg_boxx").html(
                  `<p class="text-warning text-center mt-4 text-lg">${data.message}</p>`
                );
              }
            },
            error: function (request, error) {
              console.log(error);
              $("#makePBtn").removeClass("hidden");
              $("#msg_boxx").html(
                `<p class="text-danger text-center mt-4 text-lg">Error while processing payment, try another payment gateway!</p>`
              );
            },
          });
        }
      } else {
        alert("Wrong Invoice");
      }
    } catch (error) {
      $("#makePBtn").removeClass("hidden");

      $("#msg_boxx").html(
        `<p class="text-danger text-center mt-4 text-lg">Network Error, Please Try Again!</p>`
      );
    }
  }

  let invoicenn = sessionStorage.getItem("invoice_number");
  openInvoice(invoicenn);
}

function makePayment() {
  let thePay = document.querySelector("#theBal");
  let finalPay = thePay.dataset.money;
  //   console.log(finalPay)
  async function openInvoice(invoicenum) {
    const response = await fetch(
      // `${HOST}/php/index.php?getSingleInvoice&invoiceNumber=${invoicenum}`
      `${HOST}/php/index.php?getSingleInvoice&invoiceNumber=${invoicenum}`
    );
    const userInvoices = await response.json();
    // console.log(userInvoices);

    if (userInvoices.status === 1) {
      if (userInvoices.message[0].payment_status === "paid") {
        alert("This Invoice has already been paid");
      } else {
        let invoiceDetails = userInvoices.message[0];

        var handler = PaystackPop.setup({
          //   key: 'pk_test_a00bd73aad869339803b75183303647b5dcd8305', // Replace with your public key
          key: "pk_live_6e4b6e158fb0047173174b9f6958d4e14556c790", // Replace with your public key
          subaccount: "ACCT_govno1idl9hxudv",
          email: invoiceDetails.email,
          amount: finalPay * 100,
          currency: "₦", // Use GHS for Ghana Cedis or USD for US Dollars
          metadata: {
            custom_fields: [
              {
                display_name: "Invoice Number",
                variable_name: "invoice_number",
                value: invoicenum,
              },
            ],
          },
          callback: function (response) {
            //this happens after the payment is completed successfully
            var reference = response.reference;
            alert("Payment complete! Reference: " + reference);
            // Make an AJAX call to your server with the reference to verify the transaction
            let dataToPush = {
              endpoint: "createInvidualPayment",
              data: {
                invoice_number: invoicenum,
                payment_channel: "paystack",
                payment_reference_number: reference,
                receipt_number: reference,
                amount_paid: finalPay,
              },
            };
            $.ajax({
              type: "POST",
              url: HOST,
              dataType: "json",
              data: JSON.stringify(dataToPush),
              success: function (data) {
                // console.log(data)
                alert("payment success");
                nextPrev(1);
                openReceipt(invoicenum);
              },
              error: function (request, error) {
                console.log(error);
              },
            });
          },
          onClose: function () {
            alert("Transaction was not completed, window closed.");
          },
        });
        handler.openIframe();

        // const modal = FlutterwaveCheckout({
        //   public_key: "FLWPUBK_TEST-b75c6102b14be3e6292bc9eca05a3497-X",
        //   tx_ref: "titanic" + Math.floor(Math.random() * 1101233),
        //   amount: parseFloat(invoiceDetails.amount_paid),
        //   currency: "₦",
        //   payment_options: "card, banktransfer, ussd",
        //   customer: {
        //     email: invoiceDetails.email,
        //     phone_number: invoiceDetails.phone,
        //     name: invoiceDetails.first_name + " " + invoiceDetails.surname,
        //   },
        //   customizations: {
        //     title: "PlateauIGR",
        //     description: "Payment of tax",
        //     logo: "https://plateaugr.useibs.com/assets/img/logo.png",
        //   },
        //   callback: function (payment) {
        //     let dataToPush = {
        //       "endpoint": "createInvidualPayment",
        //       "data": {
        //         "invoice_number": invoicenum,
        //         "payment_channel": "FlutterWave",
        //         "payment_reference_number": payment.tx_ref,
        //         "receipt_number": payment.tx_ref,
        //         "amount_paid" : invoiceDetails.amount_paid
        //       }
        //     }
        //     $.ajax({
        //       type: "POST",
        //       url: HOST,
        //       dataType: 'json',
        //       data: JSON.stringify(dataToPush),
        //       success: function (data) {
        //         console.log(data)
        //         alert("payment success")
        //         modal.close();
        //         nextPrev(1)
        //         openReceipt(invoicenum)
        //       },
        //       error: function (request, error) {
        //         console.log(error)
        //       }
        //     });

        //   },
        //   onclose: function (incomplete) {
        //     if (incomplete === true) {
        //       // Record event in analytics
        //       console.log("Not completed")
        //     }
        //   }
        // });

        // var handler = PaystackPop.setup({
        //   key: 'pk_test_f26de719a48fdedcf6788a6b8bba2d9bd2c3c0a4', // Replace with your public key
        //   email: invoiceDetails.email,
        //   amount: parseFloat(thePay) * 100,
        //   currency: '₦', // Use GHS for Ghana Cedis or USD for US Dollars

        //   callback: function (response) {
        //     //this happens after the payment is completed successfully
        //     var reference = response.reference;
        //     alert('Payment complete! Reference: ' + reference);
        //     // Make an AJAX call to your server with the reference to verify the transaction
        //     let dataToPush = {
        //       "endpoint": "createInvidualPayment",
        //       "data": {
        //         "invoice_number": invoicenum,
        //         "payment_channel": "paystack",
        //         "payment_reference_number": reference,
        //         "receipt_number": reference
        //       }
        //     }
        //     $.ajax({
        //       type: "POST",
        //       url: HOST,
        //       dataType: 'json',
        //       data: JSON.stringify(dataToPush),
        //       success: function (data) {
        //         console.log(data)
        //         alert("payment success")
        //         nextPrev(1)
        //         openReceipt(invoicenum)
        //       },
        //       error: function (request, error) {
        //         console.log(error)
        //       }
        //     });

        //   },
        //   onClose: function () {
        //     alert('Transaction was not completed, window closed.');
        //   },
        // });
        // handler.openIframe();
      }
    } else {
      alert("Wrong Invoice");
    }
  }
  let invoicenn = sessionStorage.getItem("invoice_number");
  openInvoice(invoicenn);
}

function formatMoney(amount) {
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "₦", // Change this to your desired currency code
    minimumFractionDigits: 2,
  });
}

function sumArray(numbers) {
  console.log(numbers);
  return numbers.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );
}

function getFormattedDate(date) {
  date = new Date(date);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

async function openReceipt(invoicenum) {
  console.log(invoicenum);

  const response = await fetch(
    `${HOST}/php/index.php?getSinglePayment&invoiceNumber=${invoicenum}`
  );
  const userInvoices = await response.json();
  console.log(userInvoices);

  if (userInvoices.status === 1) {
    let invoice_info = userInvoices.message[0];
    let allReceipt = "";

    let hardCopyReceipt = "";
    let theTotal = [];

    allReceipt += `
        <div class="flex px-6 pt-3 items-center justify-between">
          <h1 class="fontBold text-2xl">${invoice_info.invoice_number}</h1>

          <div>
            <img src="./assets/img/logo.png" alt="" class="">
            
          </div>

          <div class="flex items-center gap-1">
            <p class="text-base">Date: ${formatDate(invoice_info.timeIn)}</p>
          </div>

        </div>

        <div class="flex items-center gap-x-3 flex-wrap justify-center mt-4">
          <p class="text-base flex items-center gap-1 text-[#000]"><iconify-icon icon="ic:outline-email"></iconify-icon> <span>Info@JSIRS.gov.ng</span></p>
          <p class="text-base flex items-center gap-1 text-[#000]"><iconify-icon icon="ic:round-phone"></iconify-icon> <span>08031230301, 07056990777</span></p>
          <p class="text-base flex items-center gap-1 text-[#000]"><iconify-icon icon="streamline:web"></iconify-icon> <span>www.plateauigr.com</span></p>
        </div>

        <p class="fontBold text-black text-2xl text-center mt-3">PLATEAU STATE GOVERNMENT</p>
        <p class="fontBold text-black text-lg text-center mt-1">INTERNAL REVENUE SERVICE</p>

        <div class="flex justify-center my-8">
          <button class="button" type="button">PAYMENT RECEIPT</button>
        </div>

        <div class="flex justify-end -mt-20" >
          <div class="w-[20%] pr-8" id="qrContainer"></div>

        </div>

        <div class="flex  justify-between px-6 mt-4 mb-2">
          <div class="w-full">
            <p class="text-[#555555]">This is from : <span class="fontBold text-black">${
              invoice_info.COL_3
            }</span></p>
          </div>

          <div class="w-full flex justify-end">
           <p class="text-[#555555]">This is to : <span class="fontBold text-black capitalize">${
             invoice_info.surname
           } ${invoice_info.first_name}</span></p>
          </div>
        </div>

        <div class="border-b border-[4px] border-gray-700 mx-6"></div>

        <div class="px-6 mt-4 mb-4">
          <table class="table table-borderless">
            <thead>
              <tr>
                <th scope="col">ITEM DESCRIPTION</th>
                <th scope="col">QTY</th>
                <th scope="col">PRICE</th>
                <th scope="col">AMOUNT</th>
              </tr>
            </thead>
            <tbody>
            `;
    userInvoices.message.forEach((userInfo) => {
      allReceipt += `
        <tr class="border-b border-b border-[#6F6F84]">
          <td class="text-sm">${userInfo.COL_4}</td>
          <td class="text-sm">1</td>
          <td class="text-sm">${parseFloat(
            userInfo.amount_paid
          ).toLocaleString()}</td>
          <td class="text-sm">${parseFloat(
            userInfo.amount_paid
          ).toLocaleString()}</td>
        </tr>
      `;

      theTotal.push(parseFloat(userInfo.amount_paid));
    });

    allReceipt += `
      <tr>
        <td class="text-[#555555] text-sm">Sub Total</td>
        <td></td>
        <td></td>
        <td class="text-[#000] text-sm">${formatMoney(sumArray(theTotal))}</td>
      </tr>
      <tr class="border-b border-b border-[#6F6F84]">
        <td class="text-[#555555] text-sm">Discount</td>
        <td></td>
        <td></td>
        <td class="text-[#000] text-sm">₦0.00</td>
      </tr>

      <tr>
        <td colspan="3" class="text-[#000]">Grand Total<span class="text-[#555555]"> (₦)</span></td>
          <td class="text-[#000] text-xl fontBold">${formatMoney(
            sumArray(theTotal)
          )}</td>
        </tr>

        <tr>
          <td colspan="4" class="text-sm text-[#000] pb-0">Amount in words</td>
        </tr>
        <tr>
          <td colspan="4" class="text-sm text-[#555555] pt-0 text-capitalize">${convertNumberToWords(
            sumArray(theTotal)
          )} Only</td>
        </tr>

      
       </tbody>  
       </table>

      </div>

        <div class="border-b border-[4px] border-gray-700 mx-6"></div>

           <div class="px-6 mt-4"> 

            <div class="flex justify-between">
              <div>
                <p class="mb-2 fontBold">Payer ID: ${
                  invoice_info.tax_number === true
                    ? invoice_info.tax_number
                    : invoice_info.payer_id
                }</p>
                <p class="mb-2 fontBold">TIN: ${invoice_info.tin}</p>
                <p class="mb-2">Due Date: ${getFormattedDate(
                  invoice_info.due_date
                )}</p>
              </div>
              <div>
                <p class="mb-2">Invoice Date: ${getFormattedDate(
                  invoice_info.timeIn
                )}</p>
                <p class="mb-2">Expiry Date: ${getFormattedDate(
                  invoice_info.due_date
                )}</p>
              </div>
            </div>

            <tr>
              <td><span class="fontBold">Description:</span> ${
                invoice_info.description ? invoice_info.description : "-"
              }</td>
            </tr>
          </div>

          <div class="flex justify-end px-6 mt-4">
            <div>
              <div class="border-b border-b border-[#6F6F84] mb-2">
                <img src="./assets/img/sign.png" alt="" class="pb-2">
              </div>
            
              
              <h4 class="fontBold">Executive Chairman JSIRS</h4>
            </div>
          </div>

          <div class="px-6 mb-6" id='logo11'>
            <img src="./assets/img/logo11.png" width="100" alt="" />
          </div>

          <div class="invoicetop" id='invtopp'></div>
        </div>
    `;

    $("#receiptCard").html(allReceipt);
    let theItems = [];
    let theAmount = 0;
    userInvoices.message.forEach((userInfo) => {
      theItems.push(userInfo.COL_4);
      theAmount += parseFloat(userInfo.amount_paid);
    });

    hardCopyReceipt += `
        <div class="hardReceiptCopy">
          <div class="h-[185px]">
          
          </div>

          <div class="flex justify-end mx-6">
            <h1 class="fontBold text-2xl">${invoice_info.invoice_number}</h1>
          </div>


          <table class="table table-borderless mx-6 mt-4">
            <tr>
              <td>MDA</td>
              <td>${invoice_info["COL_3"]}</td>
            </tr>
            <tr>
              <td>Status</td>
              <td>${invoice_info.payment_status.toUpperCase()}</td>
            </tr>
            <tr>
              <td>Tax Item</td>
              <td>${theItems.join(", ")}</td>
            </tr>
            <tr>
              <td>Amount</td>
              <td>${formatMoney(theAmount)}</td>
            </tr>
            <tr>
              <td>PAYER NAME</td>
              <td>${invoice_info.first_name} ${invoice_info.surname}</td>
            </tr>
            <tr>
              <td>Payer ID</td>
              <td>${invoice_info.tax_number}</td>
            </tr>
            <tr>
              <td>JTB TIN</td>
              <td>${invoice_info.tin ? invoice_info.tin : "-"}</td>
            </tr>
            <tr>
              <td>Description</td>
              <td>${invoice_info.description}</td>
            </tr>
            <tr>
              <td>Period</td>
              <td>${formatDateRange(invoice_info.timeIn)}</td>
            </tr>
            <tr>
              <td>Billing Ref</td>
              <td>${invoice_info.invoice_number}</td>
            </tr>
            <tr>
              <td>Created By</td>
              <td>${invoice_info.first_name} ${invoice_info.surname}</td>
            </tr>
            <tr>
              <td>Date Paid</td>
              <td>${formatDate(invoice_info.timeIn)}</td>
            </tr>

          </table>

          <div class='mx-6 flex justify-between mt-5'>
            <div>
              <div class="border-b border-b border-[#6F6F84] mb-2">
                <img src="./assets/img/sign.png" alt="" class="pb-2">
              </div>
            
              
              <h4 class="fontBold">Executive Chairman JSIRS</h4>
            </div>

            <div class="w-[18%] pr-8" id="qrContainer2"></div>
          </div>
        </div>
    `;

    $("#receiptHardCopy").html(hardCopyReceipt);

    const qrCodeContainer = document.getElementById("qrContainer");
    const qrCodeContainer2 = document.getElementById("qrContainer2");

    const qrCode = new QRCode(qrCodeContainer, {
      text: `https://plateauigr.com/viewreceipt.html?invnumber=${invoicenum}&load=true`,
      colorDark: "#000000",
      colorLight: "#ffffff",
      version: 10,
    });

    const qrCode2 = new QRCode(qrCodeContainer2, {
      text: `https://plateauigr.com/viewreceipt.html?invnumber=${invoicenum}&load=true`,
      colorDark: "#000000",
      colorLight: "#ffffff",
      version: 10,
    });

    qrCode.makeCode();
    qrCode2.makeCode();
  } else {
    $("#invoiceCard").html(`Invalid Invoice, or expired invoice`);
  }
}

let urlParams22 = new URLSearchParams(window.location.search);
const load2 = urlParams22.get("load");
const invoicenumber2 = urlParams22.get("invnumber");

if (load2) {
  openReceipt(invoicenumber2);
}

function downloadInvoice(thecard) {
  const element = document.getElementById(thecard);
  var originalContent = document.body.innerHTML;

  var HTML_Width = $("#" + thecard).width();
  var HTML_Height = $("#" + thecard).height();
  var top_left_margin = 15;
  var PDF_Width = HTML_Width + top_left_margin * 2;
  var PDF_Height = PDF_Width * 1.5 + top_left_margin * 2;
  var canvas_image_width = HTML_Width;
  var canvas_image_height = HTML_Height;

  var totalPDFPages = Math.ceil(HTML_Height / PDF_Height) - 1;

  html2canvas($("#" + thecard)[0]).then(function (canvas) {
    var imgData = canvas.toDataURL("image/jpeg", 1.0);
    var pdf = new jsPDF("p", "pt", [PDF_Width, PDF_Height]);
    pdf.addImage(
      imgData,
      "JPG",
      top_left_margin,
      top_left_margin,
      canvas_image_width,
      canvas_image_height
    );
    for (var i = 1; i <= totalPDFPages; i++) {
      pdf.addPage(PDF_Width, PDF_Height);
      pdf.addImage(
        imgData,
        "JPG",
        top_left_margin,
        -(PDF_Height * i) + top_left_margin * 4,
        canvas_image_width,
        canvas_image_height
      );
    }
    pdf.save(thecard + ".pdf");
    document.body.innerHTML = originalContent;
    // $("#" + thecard).hide();
  });
}

function printInvoice(thecard) {
  var originalContent = document.body.innerHTML;
  var printContent = document.getElementById(thecard).innerHTML;

  document.body.innerHTML = printContent;
  window.print();
  document.body.innerHTML = originalContent;
}

function printInvoiceHard(thecard) {
  var originalContent = document.body.innerHTML;

  document.querySelector("#receiptHardCopy").classList.remove("hidden");

  var printContent = document.getElementById(thecard).innerHTML;

  document.body.innerHTML = printContent;
  window.print();
  document.body.innerHTML = originalContent;
}

function generateRandomString() {
  const timestamp = new Date().getTime().toString(); // Get current timestamp as a string
  const randomNum = Math.random().toString(36).substr(2, 8); // Generate a random alphanumeric string
  const randomString = timestamp + randomNum; // Combine timestamp and random string
  return randomString;
}

function formatDateRange(originalDate) {
  // Convert string to date object
  let dateObj = new Date(originalDate);

  // Get the year, month, and day
  let year = dateObj.getFullYear();
  let month = dateObj.getMonth() + 1; // Adding 1 because getMonth() returns 0-indexed month
  let day = dateObj.getDate();

  // Create a new date object for the next year
  let nextYear = new Date(year + 1, month - 1, day); // Month is 0-indexed in Date constructor

  // Format the output
  let formattedDate = `${year}-${month.toString().padStart(2, "0")}-${day
    .toString()
    .padStart(2, "0")} - ${nextYear.getFullYear()}-${month
    .toString()
    .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
  return formattedDate;
}

function formatDate(inputDate) {
  // Parse the input date string
  const parsedDate = new Date(inputDate.replace(/-/g, "/"));

  // Extract the day, month, and year
  const dayWithSuffix = addSuffix(parsedDate.getDate());
  const month = parsedDate.toLocaleString("en-US", { month: "long" });
  const year = parsedDate.getFullYear();

  // Construct the final formatted date string in dd mm yyyy format
  const finalFormattedDate = `${dayWithSuffix} ${month} ${year}`;

  return finalFormattedDate;
}

// Function to add suffix to day
function addSuffix(day) {
  if (day >= 11 && day <= 13) {
    return `${day}th`;
  }
  switch (day % 10) {
    case 1:
      return `${day}st`;
    case 2:
      return `${day}nd`;
    case 3:
      return `${day}rd`;
    default:
      return `${day}th`;
  }
}
