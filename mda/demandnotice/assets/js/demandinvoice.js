const urlParams = new URLSearchParams(window.location.search);
const invoice_number = urlParams.get("invoice_number");

$("#makePayment").attr(
  "href",
  `./payment.html?invoice_number=${invoice_number}`
);

function formatMoney(amount) {
  return parseFloat(amount).toLocaleString("en-US", {
    style: "currency",
    currency: "NGN", // Change this to your desired currency code
    minimumFractionDigits: 2,
  });
}

function sumArray(numbers) {
  return numbers.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );
}

function convertTimestampToReadableDate(timestamp) {
  // Split the timestamp to get the date part
  const datePart = timestamp.split(" ")[0];

  // Extract the year, month, and day
  const [year, month, day] = datePart.split("-");

  // Create a Date object
  const date = new Date(year, month - 1, day); // Month is 0-indexed

  // Format the date using Intl.DateTimeFormat
  const readableDate = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);

  return readableDate;
}

function addOneMonthAndFormat(timestamp) {
  // Split the timestamp to get the date part
  const datePart = timestamp.split(" ")[0];

  // Extract the year, month, and day
  const [year, month, day] = datePart.split("-").map(Number);

  // Create a Date object
  const date = new Date(year, month - 1, day); // Month is 0-indexed

  // Add one month
  date.setMonth(date.getMonth() + 1);

  // Format the updated date using Intl.DateTimeFormat
  const updatedDate = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);

  return updatedDate;
}

async function fetchInvoice() {
  try {
    const response = await fetch(
      `${HOST}/get-demand-notice-invoices?invoice_number=${invoice_number}`
    );
    const userinvoice = await response.json();

    if (userinvoice.data.demand_notices.length > 0) {
      let demandInvoiceInfo = userinvoice.data.demand_notices[0];

      let amount_due = 0;

      demandInvoiceInfo.revenue_heads.forEach((rev_head) => {
        amount_due += parseFloat(rev_head.amount);
      });
      let invoiceContainer = "";

      invoiceContainer += `
      <!--header-->
        <div class="flex justify-between mb-2">
          <div class="flex gap-3 w-7/12">
            <div>
              <img src="../assets/img/jsirs.png" class='w-[80px] object-cover' alt="" />
              <h1 class="text-3xl text-center">TO</h1>
            </div>
            <div class="h-full border border-2" style="border-color: #000 !important"></div>
            <div class='w-[50%]'>
              <h1 class="fontBold text-base headingdeman">kano STATE<br /> INTERNAL REVENUE<br /> SERVICE (JIRS)</h1>
              <div class="border border-2 p-2 w-full" style="border-color: #000 !important;">
                <p class=" text-sm"><strong class='fontBold'>BUSINESS TYPE:</strong> <span
                    class="text-xs">${
                      demandInvoiceInfo.tax_business_type
                    }</span></p>
                <p class="text-sm"><strong class='fontBold'>NAME:</strong> <span
                    class="text-xs">${demandInvoiceInfo.tax_first_name} ${
        demandInvoiceInfo.tax_last_name
      }</span></p>
                <p class="text-sm"><strong class='fontBold'>PHONE:</strong> <span
                    class="text-xss">${demandInvoiceInfo.tax_phone}</span></p>
                <p class="text-sm"><strong class='fontBold'>ADDRESS:</strong> <span
                    class="text-xss">${demandInvoiceInfo.address}</span></p>
              </div>
            </div>
          </div>

          <div class="w-5/12" style="margin-right: 10px !important">
            <div class="flex justify-center">
              <img src="./img/coa.png" alt="" />
            </div>
            <h1 class="fontBold text-base text-center headingdeman">CONSOLIDATED <br /> DEMAND NOTICE</h1>
            <div class="border border-2 p-2 md:pr-[80px] pr-[40px]" style="border-color: #000 !important;">
              <p class="text-sm"><strong class='fontBold'>TIN NO:</strong> <span
                  class="text-xs">${demandInvoiceInfo.tax_number}</span></p>
              <p class="text-sm"><strong class='fontBold'>FILE NO:</strong> <span
                  class="text-xs">${demandInvoiceInfo.file_number}</span></p>
              <p class="text-sm"><strong class='fontBold'>DEMAND NOTICE NO:</strong> <span
                  class="text-xs">${demandInvoiceInfo.invoice_number}</span></p>
              <p class="text-sm"><strong class='fontBold'>DATE:</strong> <span
                  class="text-xs">${
                    demandInvoiceInfo.date_created.split(" ")[0]
                  }</span></p>

            </div>
          </div>
        </div>

        <p class='p-1 bg-[#02A75A] text-white w-fit text-xs fontBold'>IN ACCORDANCE WITH THE PROVISIONS OF RELEVANT LAWS
        </p>
        <div class="mt-3">
          <p class="text-sm mb-2">Section 88(1a) and 11(f) of Personal Income Tax Act (PITA) 2011 and Section 142 & 143f
            State Consolidated Revenue Law 2020, as amended First, Second, Third and Fourth Schedule Approved list of
            collections.</p>

        </div>

        <!--body-->


        <table class="table table-bordered mt-3 invTable">
          <thead>
            <tr>
              <th class='text-xs'>S/N</th>
              <th class='text-xs'>AGENCY</th>
              <th class='text-xs'>REVENUE ITEM</th>
              <th class='text-xs'>CURRENT YEAR (${
                demandInvoiceInfo.revenue_heads[0].current_year_date
              })</th>
              <th class='text-xs'>OUTSTANDING YEAR (${
                demandInvoiceInfo.revenue_heads[0].previous_year_date
              })</th>
              <th class='text-xs'>AGENCY CODE</th>
              <th class='text-xs'>REVENUE CODE</th>
            </tr>
          </thead>
          <tbody>
      `;
      TheDemandTotal = [];
      demandInvoiceInfo.revenue_heads.forEach((demandnot, i) => {
        invoiceContainer += `
          <tr>
            <td class='text-xs'>${i + 1}</td>
            <td class='text-xs'>${demandnot.mda_name}</td>
            <td class='text-xs'>${demandnot.item_name}</td>
            <td class='text-xs'>${formatMoney(
              parseFloat(demandnot.current_year_amount)
            )}</td>
            <td class='text-xs'>${parseFloat(
              demandnot.previous_year_amount
            ).toLocaleString()}</td>
            <td class='text-xs'>${demandnot.mda_code}</td>
            <td class='text-xs'>${demandnot.item_code}</td>
          </tr>
        `;

        TheDemandTotal.push(parseFloat(demandnot.current_year_amount));
        TheDemandTotal.push(parseFloat(demandnot.previous_year_amount));
      });

      invoiceContainer += `
            <tr>
              <td colspan="8">
                <div class="flex justify-center">
                  <p class=" text-center p-1 bg-[#02A75A] text-white w-[80%] text-xs fontBold">IMPORTANT NOTICE</p>
                </div>

                <ol style='font-size:12px; list-style-type: decimal; padding-left: 20px'>
                  <li> Unless the debt mentioned above is paid within one month from the date hereof, or proof of
                    earlier payment of the said amount is produced as requested , an action will be commenced against
                    you in a court of competent Jurisdiction.</li>
                  <li>You are required to present this Notice at any IGR collecting bank for payment or pay online via
                    the Paykano portal. </li>
                  <li>You are required to obtain a teller from the bank, an E-receipt from the Paykano portal or any
                    JIRS Tax Station close to you.</li>
                </ol>
              </td>
            </tr>
          </tbody>
        </table>

        <p class="text-danger text-center fontBold -mt-2">IT IS AN OFFENSE TO PAY CASH TO ANYBODY</p>

        <table class="table table-bordered invTable">
          <tbody>
            <tr>
              <td rowspan="2">
                <p class=" text-center p-1 bg-[#02A75A] text-white text-xs fontBold">MAKING PAYMENT VIA BANK BRANCH
                  TRANSACTIONS</p>

                <ol style='font-size:12px; list-style-type: decimal; padding-left: 20px'>
                  <li>Visit any Bank Branch near you with the Consolidated Demand Notice.</li>
                  <li>Present the consolidated demand notice number to the teller.</li>
                  <li>The teller will enter the demand notice number to validate and load your details.</li>
                  <li>Confirm your details in the preview page.</li>
                  <li>Make your payments via cash or cheque, and ensure it is processed through any of the following
                    gateways: PayDirect, Etransact and Remita.</li>
                  <li>Ensure you obtain a receipt from the bank teller upon completing payment.</li>
                  <li>Bring the receipt to the JIRS head office or any of our Tax stations to obtain your official JIRS
                    hardcopy receipt. You can also retrieve your E-receipt on the Paykano portal.</li>
                </ol>
              </td>
              <td>

                <h1 class="text-xl fontBold" id="theBal" data-money="${parseFloat(
                  sumArray(TheDemandTotal)
                )}">TOTAL
                  ${formatMoney(parseFloat(sumArray(TheDemandTotal)))}</h1>
              </td>
            </tr>
            <tr>
              <td>
                <p class=" text-center p-1 bg-[#02A75A] text-white text-xs fontBold">HOW TO PAY ONLINE</p>
                <ol style='font-size:12px; list-style-type: decimal; padding-left: 20px'>
                  <li>Visit <span class="underline text-[blue]">www.paykano.com</span> from your mobile or Computer.
                  </li>
                  <li>Click on “Pay Now” on the homepage.</li>
                  <li>Enter your Demand Notice Number and click on proceed.</li>
                  <li>Preview the Your CDN and proceed to pay.</li>
                  <li>Select your preferred method and make payment.</li>
                  <li>Your e-receipt is now available.</li>
                </ol>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="flex justify-between items-center">
          <div>
            <div class='flex justify-center'>
              <img src='./assets/img/rakiya_signature.png' class='w-[200px]' alt='' />
            </div>
            <div class="border border-2 w-[200px]" style="border-color: #000 !important"></div>
            <p class="fontBold text-sm text-center">Nasiru Sabo Idris</p>
            <p class="fontBold text-sm text-center">Executive Chairman</p>
          </div>

          <div class="border border-1 p-2  lg:pr-[100px] pr-[30px]" style="border-color: #000 !important;">
            <p class="text-xs fontBold text-center">HAVING ISSUES WITH YOUR PAYMENT,</p>
            <p class="text-xs fontBold text-center">EMAIL OR CALL </p>
            <p class="text-xs fontBold text-center">ict@irs.kano.gov.ng</p>
            <p class="text-xs fontBold text-center">+2347060403146, +2349033509195</p>
          </div>
        </div>
      `;

      $("#invoiceContainer").html(invoiceContainer);

      // const qrCodeContainer = document.getElementById("qrContainer")

      // const qrCode = new QRCode(qrCodeContainer, {
      //   text: `https://paykano.com/invoiceGeneration/invoice.html?invoice_number=${invoice_number}`,
      //   colorDark: '#000000',
      //   colorLight: '#ffffff',
      //   version: 10,
      // });
    } else {
      $("#invoiceContainer").html(`
        <div class='d-flex justify-content-center'>
          <img src='../assets/img/not-found.png' alt='' />
        </div>
        <p class="mt-3 text-danger text-center">Invalid or Expired Invoice</p>
        
      `);
    }
  } catch (error) {
    console.log(error);
    $("#invoiceContainer").html(`
      <div class='d-flex justify-content-center'>
        <img src='../assets/img/not-found.png' alt='' />
      </div>
      <p class="mt-3 text-danger text-center">Failed to Fetch</p>
    `);
  }
}
fetchInvoice();

function printInvoice(thecard) {
  var originalContent = document.body.innerHTML;
  var printContent = document.getElementById(thecard).innerHTML;

  document.body.innerHTML = printContent;
  window.print();
  document.body.innerHTML = originalContent;
}

function downloadInvoice(thecard) {
  var HTML_Width = $(`#${thecard}`).width();
  var HTML_Height = $(`#${thecard}`).height();

  var top_left_margin = 15;
  var PDF_Width = HTML_Width + top_left_margin * 2;
  var PDF_Height = PDF_Width * 1.5 + top_left_margin * 2;
  var canvas_image_width = HTML_Width;
  var canvas_image_height = HTML_Height;

  var totalPDFPages = Math.ceil(HTML_Height / PDF_Height) - 1;

  html2canvas($(`#${thecard}`)[0]).then(function (canvas) {
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
    pdf.save("demand_notice.pdf");
  });
}
