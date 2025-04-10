const urlParams = new URLSearchParams(window.location.search);
const invoice_number = urlParams.get("invoice_number");

function formatMoney(amount) {
  return parseFloat(amount).toLocaleString("en-US", {
    style: "currency",
    currency: "NGN", // Change this to your desired currency code
    minimumFractionDigits: 2,
  });
}

$("#makePayment").attr(
  "href",
  `./payment.html?invoice_number=${invoice_number}`
);

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
      `${HOST}/noauth-get-invoices?invoice_number=${invoice_number}`
    );
    const userinvoice = await response.json();

    if (userinvoice.data.invoices.length > 0) {
      let invoiceInfo = userinvoice.data.invoices[0];

      let amount_due = 0;

      invoiceInfo.revenue_heads.forEach((rev_head) => {
        amount_due += parseFloat(rev_head.amount);
      });
      let invoiceContainer = "";

      invoiceContainer += `
        <!-- Header -->
        <div class="flex justify-between items-center mb-8">
          <div class="flex items-center gap-4">
            <div class="logo"><img src="../assets/img/img/kano.png" /></div>
            <h1 class="text-2xl font-bold">Invoice</h1>
          </div>
          <div class="flex items-start gap-2">
            <div class="text-right">
              <p class="text-gray-500 text-sm">Invoice number</p>
              <h1 class="text-gray-800 font-bold text-lg">${
                invoiceInfo.invoice_number
              }</h1>
            </div>
          </div>
        </div>

        <!-- Billing Information -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 bg-white p-3 shadow-sm rounded-2xl">
          <!-- Bill From -->
          <div class="flex flex-col">
            <div class="flex items-center gap-1 mb-2">
              <i class="fa fa-check-circle text-xs primary"></i>
              <p class="font-semibold text-xs text-gray-400">BILL FROM:</p>
            </div>

            <div class="h-full text-break text-gray-600 bg-gray-50 p-3 rounded-lg space-y-2 border border-gray-100">
              <p class="font-semibold text-dark">Paykano</p>
              <p class="text-sm">(234) 456 - 7894</p>
              <p class="text-sm">No. 123 Dutse, kano.</p>
              <p class="text-sm">info@jsirs.gov.ng</p>
            </div>
          </div>

          <!-- Bill To -->
          <div class="flex flex-col">
            <div class="flex items-center gap-1 mb-2">
              <i class="fa fa-check-circle text-xs primary"></i>
              <p class="font-semibold text-xs text-gray-400">BILL TO:</p>
            </div>

            <div class="h-full text-break text-gray-600 bg-gray-50 p-3 rounded-lg space-y-2 border border-gray-100">
              <div class="flex items-center gap-1 mb-2">
                <i class="fa fa-user text-sm primary"></i>
                <p class="font-semibold text-dark">${
                  invoiceInfo.tax_first_name
                } ${
        invoiceInfo.tax_last_name === "" ? "" : invoiceInfo.tax_last_name
      }</p>
              </div>

              <p class="text-sm">${invoiceInfo.tax_phone}</p>
              <p class="text-sm">${invoiceInfo.tax_email}</p>
              <p class="text-sm"></p>
            </div>
          </div>

          <!-- Amount Due -->
          <div class="flex flex-col">
            <div class="flex items-center gap-1 mb-2">
              <i class="fa fa-check-circle text-xs primary"></i>
              <p class="font-semibold text-xs text-gray-400">AMOUNT DUE</p>
            </div>

            <div class="amount-box h-full text-break">
              <div class="text-2xl font-bold mb-2">${formatMoney(
                amount_due
              )}</div>
              
            </div>
          </div>
        </div>

        <!-- Payment Details -->
        <div class="mb-3">
          <div class="grid sm:grid-cols-3 lg:grid-cols-4 gap-2 lg:gap-4">
            <div>
              <p class="text-gray-600">Payer Number</p>
              <p class="font-semibold">${invoiceInfo.tax_number}</p>
            </div>
            <div>
              <p class="text-gray-600">Issued Date</p>
              <p class="font-semibold">${convertTimestampToReadableDate(
                invoiceInfo.date_created
              )}</p>
            </div>
            <div>
              <p class="text-gray-600">Expiry Date</p>
              <p class="font-semibold">${addOneMonthAndFormat(
                invoiceInfo.date_created
              )}</p>
            </div>
          </div>
        </div>

        <div class="bg-white p-3 rounded-2xl shadow-sm">
          <!-- Invoice Items -->
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="text-sm text-gray-400">
                <th class="py-2">DESCRIPTION</th>
                <th class="py-2 text-center">QTY</th>
                <th class="py-2 text-left">Price</th>
                <th class="py-2 text-left">Total</th>
              </tr>
            </thead>
            <tbody class="">
              <tr class="h-4"></tr>
              `;
      invoiceInfo.revenue_heads.forEach((revenue) => {
        invoiceContainer += `
          <tr
            class="text-sm text-gray-600 font-semibold rounded-full outline outline-offset-2 outline-slate-200 outline-1">
            <td class="py-3 px-4 rounded-full">${revenue.item_name}</td>
            <td class="py-3 px-4 text-center text-gray-400">1</td>
            <td class="text-left text-gray-400">${formatMoney(
              revenue.amount
            )}</td>
            <td class="text-left rounded-r-lg">${formatMoney(
              revenue.amount
            )}</td>
          </tr>
          <tr class="h-4"></tr>
        `;
      });

      invoiceContainer += `     
            </tbody>
          </table>

          <!-- Totals -->
          <div class="flex justify-end font-semibold text-gray-500 border p-3 mt-3 rounded-2xl">
            <div class="w-full">
              <div class="flex justify-between py-2">
                <span class="text-gray-500">Sub Total</span>
                <span>${formatMoney(amount_due)}</span>
              </div>
              <div class="flex justify-between py-2">
                <span class="text-gray-500">Discount</span>
                <span>₦0.00</span>
              </div>
              <div class="flex justify-between py-2 font-bold">
                <span>Grand Total</span>
                <span>${formatMoney(amount_due)}</span>
              </div>
            </div>
          </div>

          <!-- Amount in Words -->
          <div class="mt-8 mb-6 flex items-start justify-between">
            <div class="w-full">
              <h3 class="font-bold mb-1 text-lg">Amount in words</h3>
              <p class="text-gray-400 text-sm">
                ${numberToWordsWithNairaKobo(amount_due)}
              </p>
              <div class="w-32 mt-4">
                <div id="qrContainer"></div>
              </div>
            </div>
            <div class="w-full text-right mr-2">
              <p class="text-gray-400 text-sm">${
                invoiceInfo.payment_status === "paid" ? "PAID" : "PAYING"
              }</p>
              <h3 class="font-bold mb-1 text-lg">${formatMoney(amount_due)}</h3>
            </div>
          </div>
        </div>
      `;

      $("#invoiceContainer").html(invoiceContainer);

      const qrCodeContainer = document.getElementById("qrContainer");

      const qrCode = new QRCode(qrCodeContainer, {
        text: `https://paykano.com/invoiceGeneration/invoice.html?invoice_number=${invoice_number}`,
        colorDark: "#000000",
        colorLight: "#ffffff",
        version: 10,
      });

      if (invoiceInfo.payment_status === "paid") {
        $("#makePayment").remove();
      }
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
    pdf.save("invoice.pdf");
  });
}
