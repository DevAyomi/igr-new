function formatMoney(amount) {
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "₦", // Change this to your desired currency code
    minimumFractionDigits: 2,
  });
}
// console.log(formatMoney(10000))

function sumArray(numbers) {
  // console.log(numbers)
  return numbers.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );
}
// function editoo() {
//   let theBal = $(".theBal").text();
//   let actualPrice = $("#actualPrice").text()

//   $(".showEorAp").html(`
//     <button class="textPrimary gap-2 flex items-center" id="applyBtn">
//       <i class="fas fa-check"></i>
//       <span>Apply</span>
//     </button>
//   `);

//   $("#showBal").html(`
//       <input type="number" id="inpBal" class="p-[5px] outline-none w-[100px] rounded-lg border border-gray-500" value="${theBal}" />
//     `);

//   $("#applyBtn").on("click", function () {
//     $(".showEorAp").html(`
//         <button class="textPrimary gap-2 flex items-center" id="editBtn">
//           <i class="fas fa-pen"></i>
//           <span>Edit</span>
//         </button>
//       `);
//     $("#editBtn").on("click", function () {
//       editoo();
//     });
//     let theFBal = $("#inpBal").val();

//     $("#showBal").html(`
//         <p>&#8358; <span class="theBal"> ${theFBal}</span></p>
//       `);
//     $("#amword").html(convertNumberToWords(theFBal))
//     // console.log(actualPrice)
//     $("#balancing").html("N" + (parseFloat(actualPrice) + parseFloat(theFBal)))
//     $("#balancing").removeClass("hidden")
//     $("#balancingBB").removeClass("hidden")
//   });
// }

let invoicenum2 = "";

async function openInvoice(invoicenum, price) {
  // console.log(price)
  invoicenum2 = invoicenum;

  const response = await fetch(
    `${HOST}?getSingleInvoice&invoiceNumber=${invoicenum}`
  );
  const userInvoices = await response.json();
  console.log(userInvoices);

  if (userInvoices.status === 1) {
    let invoice_info = userInvoices.message[0];
    let TotalInvoice = "";
    // console.log(invoice_info)
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    let specificDate = new Date(invoice_info.due_date);
    if (specificDate < currentDate) {
      // console.log(invoice_info)
      $("#invoiceCard").html(`
      <div class="invoicetop"></div>
      <div class="flex justify-center items-center h-[60vh]">
        <p class="fontBold text-xl">Invalid Invoice, or expired invoice</p>
      </div>
    `);

      let thePP = document.querySelector(".invoiceContainer");

      let thSiblings = thePP.nextElementSibling;
      let sesinID = JSON.parse(localStorage.getItem("userDataPrime"));
      if (sesinID) {
        thSiblings.innerHTML = `
        <a href="./dashboard/taxes.html" class="button flex gap-3 items-center px-10 mt-6">
          <span>Regenerate Invoice</span>
          <iconify-icon icon="eva:arrow-forward-outline" class="text-xl"></iconify-icon>
        </a>
      `;
      } else {
        thSiblings.innerHTML = `
        <a href="./generateinvoice.html" class="button flex gap-3 items-center px-10 mt-6">
          <span>Regenerate Invoice</span>
          <iconify-icon icon="eva:arrow-forward-outline" class="text-xl"></iconify-icon>
        </a>
      `;
      }
    } else {
      TotalInvoice += `
      <div class="invoicetop"></div>

      <div class="flex px-6 pt-3 items-center justify-between">

        <h1 class="fontBold text-2xl">Invoice</h1>

        <div class="flex items-center gap-1">
          <img src="./assets/img/vector.png" alt="">
          <p class="text-2xl fontBold">${invoice_info.invoice_number}</p>
        </div>

      </div>

      <div class="mt-2 px-4 gap-3">
        <img src="./assets/img/logo.png" alt="" class="w-[80px]">
      </div>
`;

      if (userInvoices.message.length > 1) {
        TotalInvoice += `
      <div class="flex  justify-between px-6 mt-4">
        <div class="w-full">
          <p class="text-[#555555]">FROM :</p>
          <p class="fontBold">${invoice_info.COL_3}</p>
        </div>

        <div class="w-full md:mr-[-10%]">
          <p class="text-[#555555]">TO :</p>
          <p class="fontBold text-left">${invoice_info.surname} ${invoice_info.first_name}</p>
          <p class="text-[#222234] text-sm md:w-[60%]">${invoice_info.address}</p>
        </div>

      </div>
`;
      } else {
        TotalInvoice += `
      <div class="flex  justify-between px-6 mt-4">
        <div class="w-full">
          <p class="text-[#555555]">FROM :</p>
          <p class="fontBold">${invoice_info.COL_3}</p>
          <p class="text-[#222234] w-[60%] text-sm">Plateau</p>
        </div>

        <div class="w-full md:mr-[-10%]">
          <p class="text-[#555555]">TO :</p>
          <p class="fontBold text-left">${invoice_info.surname} ${invoice_info.first_name}</p>
          <p class="text-[#222234] text-sm md:w-[60%]">${invoice_info.address}</p>
        </div>

      </div>
    `;
      }
      TotalInvoice += `
      <div class="px-6 mt-4">
        <p class="text-[#555555]">INFO :</p>

        <table class="table table-borderless invTa md:w-[70%] w-full">
          <tr>
            <td>
              <p class="fontBold">Payer ID: ${
                invoice_info.tax_number
                  ? invoice_info.tax_number
                  : invoice_info.payer_id
              }</p>
            </td>
            <td>Due Date: ${invoice_info.due_date}</td>
          </tr>
          <tr>
            <td>Invoice Date: ${invoice_info.date_created.split(" ")[0]}</td>
            <td>Expiry Date: ${invoice_info.due_date}</td>
          </tr>
          <tr>
            <td><span class="fontBold">Description:</span> ${
              invoice_info.description ? invoice_info.description : "-"
            }</td>
          </tr>
        </table>
      </div>
    `;

      if (userInvoices.message.length > 1) {
        let theTotal = [];
        // let totalAmount = parseFloat(userInvoices.message[0].amount_paid)
        TotalInvoice += `
        <div class="px-6">
          <table class="table table-borderless table-sm">
            <thead>
              <tr class="bg-[#CDA545]">
                <td class="text-[#fff] text-sm">ITEM DESCRIPTION</td>
                <td class="text-[#fff] text-sm">QTY</td>
                <td class="text-[#fff] text-sm">RATE</td>
                <td class="text-[#fff] text-sm">AMOUNT</td>
              </tr>
            </thead>
            <tbody>
          `;

        userInvoices.message.forEach((element) => {
          TotalInvoice += `
                <tr>
                  <td class="text-sm">${element.COL_4}</td>
                  <td class="text-sm">01</td>
                  <td class="text-sm">${parseFloat(
                    element.amount_paid
                  ).toLocaleString()}</td>
                  <td class="text-sm">${parseFloat(
                    element.amount_paid
                  ).toLocaleString()}</td>
                </tr>
              `;
          theTotal.push(parseFloat(element.amount_paid));
        });
        TotalInvoice += `
              <tr class="border-t border-[#6F6F84]">
                <td class="text-[#555555] text-sm">Sub Total</td>
                <td></td>
                <td></td>
                <td class="text-[#000] text-sm">₦ ${formatMoney(
                  sumArray(theTotal)
                )}</td>
              </tr>
              <tr>
                <td class="text-[#555555] text-sm">Discount</td>
                <td></td>
                <td></td>
                <td class="text-[#000] text-sm">₦0.00</td>
              </tr>
              <tr>
                <td colspan="3" class="text-[#000]">Grand Total<span class="text-[#555555]"> (₦)</span></td>
                <td class="text-[#000] text-xl fontBold">₦ ${formatMoney(
                  sumArray(theTotal)
                )}</td>
                <span class="d-none" id="theBal" data-money="${sumArray(
                  theTotal
                )}">${formatMoney(sumArray(theTotal))}</span>
              </tr>

            

              <tr>
                <td colspan="4" class="text-sm text-[#000] pb-0">Amount in words</td>
              </tr>
              <tr>
                <td colspan="4" class="text-sm text-gray-500 pt-0 text-capitalize"><span id="amword">${convertNumberToWords(
                  sumArray(theTotal)
                )}</span> Only</td>
              </tr>
            </tbody>
          </table>  
        </div>
        `;
      } else {
        TotalInvoice += `
        <div class="px-6">
          <table class="table table-borderless">
            <tr class="bg-[#CDA545]">
              <td class="text-[#fff] text-sm">ITEM DESCRIPTION</td>
              <td class="text-[#fff] text-sm">QTY</td>
              <td class="text-[#fff] text-sm">RATE</td>
              <td class="text-[#fff] text-sm">AMOUNT</td>
            </tr>
            <tr class="border-b border-b border-[#6F6F84]">
              <td class="text-sm">${invoice_info.COL_4}</td>
              <td class="text-sm">01</td>
              <td class="text-sm"></td>
              <td class="text-sm">${formatMoney(
                parseFloat(invoice_info.amount_paid)
              )}</td>
            </tr>
            <tr>
              <td class="text-[#555555] text-sm">Sub Total</td>
              <td></td>
              <td></td>
              <td class="text-[#000] text-sm">${formatMoney(
                parseFloat(invoice_info.amount_paid)
              )}</td>
            </tr>
            <tr class="border-b border-b border-[#6F6F84]">
              <td class="text-[#555555] text-sm">Discount</td>
              <td></td>
              <td></td>
              <td class="text-[#000] text-sm">₦0.00</td>
            </tr>

            <tr>
              <td colspan="3" class="text-[#000]">Grand Total<span class="text-[#555555]"> (₦)</span></td>
              <td class="text-[#000] text-xl fontBold"><span id="actualPrice">${formatMoney(
                parseFloat(invoice_info.amount_paid)
              )}</span></td>
              <span class="d-none" id="theBal" data-money="${parseFloat(
                invoice_info.amount_paid
              )}">${formatMoney(parseFloat(invoice_info.amount_paid))}</span>
            </tr>

            <tr>
              <td colspan="4" class="text-sm text-[#000] pb-0">Amount in words</td>
            </tr>
            <tr>
              <td colspan="4" class="text-sm text-[#555555] pt-0 text-capitalize"><span id="amword">${convertNumberToWords(
                invoice_info.amount_paid
              )}</span> Only</td>
            </tr>
            <tr 
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>
                <div class="border-b border-b border-[#6F6F84] mb-2">
                  <img src="./assets/img/sign.png" alt="" class="pb-2">
                </div>
                <h4 class="fontBold">Jim Pam Wayas</h4>
                <h4 class="fontBold">Executive Chairman JSIRS</h4>
              </td>
          </tr>
          </table>

          
        </div>
    `;
      }

      TotalInvoice += `
      <hr class="my-4 md:mx-10 mx-4">

      <div class="md:px-10 px-2 pb-6">
        <div class="flex items-center justify-center gap-2">
          <img src="./assets/img/logo.png" alt="">
          <div>
            <p class="text-xl fontBold pb-0">Plateau State Internal Revenue Service</p>
            <div class="flex items-center gap-x-3 flex-wrap">
              <p class="text-sm text-[#6F6F84]">www.plateauigr.com</p>
              <p class="text-sm text-[#6F6F84]">info@JSIRS.gov.ng</p>
              <p class="text-sm text-[#6F6F84]">07056990777, 08031230301</p>
              <img src="./assets/img/logo1.png" class="h-[30px] w-[70px]" alt="">
            </div>
          </div>
        </div>

      </div>
    `;

      $("#invoiceCard").html(TotalInvoice);

      $("#editBtn").on("click", function () {
        editoo();
      });
    }
  } else {
    $("#invoiceCard").html(`
      <div class="invoicetop"></div>
      <div class="flex justify-center items-center h-[60vh]">
        <p class="fontBold text-xl">Invalid Invoice, or expired invoice</p>
      </div>
    `);

    let thePP = document.querySelector(".invoiceContainer");

    let thSiblings = thePP.nextElementSibling;
    let sesinID = JSON.parse(localStorage.getItem("userDataPrime"));
    if (sesinID) {
      thSiblings.innerHTML = `
        <a href="./dashboard/taxes.html" class="button flex gap-3 items-center px-10 mt-6">
          <span>Regenerate Invoice</span>
          <iconify-icon icon="eva:arrow-forward-outline" class="text-xl"></iconify-icon>
        </a>
      `;
    } else {
      thSiblings.innerHTML = `
        <a href="./generateinvoice.html" class="button flex gap-3 items-center px-10 mt-6">
          <span>Regenerate Invoice</span>
          <iconify-icon icon="eva:arrow-forward-outline" class="text-xl"></iconify-icon>
        </a>
      `;
    }
  }
}

{
  /* <table class="table table-borderless bg-[#FFF3E9]">
                <tr>
                  <td colspan="3" class="text-[#6F6F84] pb-0">Payment Details</td>
                  <td class="text-right text-uppercase text-[#6F6F84] text-sm pb-0">Online payment </td>
                </tr>
                <tr>
                  <td colspan="3"></td>
                  <td class="text-right pt-0">Paystack </td>
                </tr>
              </table> */
}

let urlParams = new URLSearchParams(window.location.search);
const load = urlParams.get("load");
const invoicenumber = urlParams.get("invnumber");

if (load) {
  openInvoice(invoicenumber);
}
function goToPayment() {
  sessionStorage.setItem("invoice_number", invoicenumber);
  nextPrev(1);
}

function goToPayment2() {
  sessionStorage.setItem("invoice_number", invoicenum2);
  // Coming From multistep-form.js
  setActiveStep(1);
  setActivePanel(1);
  nextPrev(1);
}

const paying = urlParams.get("paying");
if (paying) {
  $("#thePay").html(`
    <a href="index.html" class="flex items-center gap-2 w-fit">
      <iconify-icon icon="eva:arrow-back-outline"></iconify-icon>
      <span>Go Home</span>
    </a>
  `);
} else {
  $("#thePay").html(`
    <a href="./dashboard/taxes.html" class="flex items-center gap-2 w-fit">
      <iconify-icon icon="eva:arrow-back-outline"></iconify-icon>
      <span>Go back</span>
    </a>
  `);
}
