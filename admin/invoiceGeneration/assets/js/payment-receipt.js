const urlParams = new URLSearchParams(window.location.search);
const invoice_number = urlParams.get("invoice_number");

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

function formatMoney(amount) {
  return parseFloat(amount).toLocaleString("en-US", {
    style: "currency",
    currency: "NGN", // Change this to your desired currency code
    minimumFractionDigits: 2,
  });
}

async function fetchInvoice() {
  try {
    const response = await fetch(
      `${HOST}/get-payment?invoice_number=${invoice_number}`
    );
    const userinvoice = await response.json();

    if (userinvoice.data.length > 0) {
      let invoiceInfo = userinvoice.data[0];

      let amount_due = 0;

      invoiceInfo.associated_revenue_heads.forEach((rev_head) => {
        amount_due += parseFloat(rev_head.amount);
      });
      let invoiceContainer = "";

      invoiceContainer += `
        <!-- Header -->
        <div class="flex justify-between items-center mb-8">
          <div class="flex items-center gap-4">
            <div class="logo"><img src="../assets/img/img/kano.png" /></div>
            <h1 class="text-2xl font-bold">Payment Receipt</h1>
          </div>
          <div class="flex items-start gap-2">
            <div class="text-right">
              <p class="text-gray-500 text-sm">Receipt number:</p>
              <h1 class="text-gray-800 font-bold text-lg">${
                invoiceInfo.invoice_number
              }</h1>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between my-3">
          <div class="flex gap-2 items-center">
            <i class="fa fa-envelope primary"></i>
            <p class="text-dark font-medium">info@jsirs.gov.ng</p>
          </div>
          <div class="flex gap-2 items-center">
            <iconify-icon
              class="text-lg primary"
              icon="ph:phone"
            ></iconify-icon>
            <p class="text-dark font-medium">(234) 567 879</p>
          </div>
          <div class="flex gap-2 items-center">
            <i class="fa fa-globe primary"></i>
            <p class="text-dark font-medium">www.jsirs.gov.ng</p>
          </div>
        </div>

        <!-- Billing Information -->
        <div
          class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 bg-white p-3 shadow-sm rounded-2xl"
        >
          <!-- Bill From -->
          <div class="flex flex-col">
            <div class="flex items-center gap-1 mb-2">
              <i class="fa fa-check-circle text-xs primary"></i>
              <p class="font-semibold text-xs text-gray-400">THIS IS FROM:</p>
            </div>

            <div
              class="h-full text-gray-600 bg-gray-50 p-3 rounded-lg space-y-2 border border-gray-100"
            >
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
              <p class="font-semibold text-xs text-gray-400">THIS IS TO:</p>
            </div>

            <div
              class="h-full text-gray-600 bg-gray-50 p-3 rounded-lg space-y-2 border border-gray-100"
            >
              <div class="flex items-center gap-1 mb-2">
                <i class="fa fa-user text-sm primary"></i>
                <p class="font-semibold text-dark">${
                  invoiceInfo.user_info.first_name
                } ${
        invoiceInfo.user_info.surname === ""
          ? ""
          : invoiceInfo.user_info.surname
      }</p>
              </div>

              <p class="text-sm">${invoiceInfo.user_info.phone}</p>
              <p class="text-sm">${invoiceInfo.user_info.email}</p>
            </div>
          </div>

          <!-- Amount Due -->
          <div class="flex flex-col">
            <div class="flex items-center gap-1 mb-2">
              <i class="fa fa-check-circle text-xs primary"></i>
              <p class="font-semibold text-xs text-gray-400">
                FOR VERIFICATION
              </p>
            </div>

            <div class="h-full">
              <div id="qrContainer"></div>
            </div>
          </div>
        </div>

        <!-- Payment Details -->
        <div class="mb-3">
          <div class="grid grid-cols-4 gap-2">
            <div>
              <p class="text-gray-600">Payer ID</p>
              <p class="font-semibold">${invoiceInfo.tax_number}</p>
            </div>
            <div>
              <p class="text-gray-600">Issued Date</p>
              <p class="font-semibold">${convertTimestampToReadableDate(
                invoiceInfo.timeIn
              )}</p>
            </div>
            <div>
              <p class="text-gray-600">Due Date</p>
              <p class="font-semibold">${addOneMonthAndFormat(
                invoiceInfo.timeIn
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
      invoiceInfo.associated_revenue_heads.forEach((revenue) => {
        invoiceContainer += `
          <tr class="text-sm text-gray-600 font-semibold rounded-full outline outline-offset-2 outline-slate-200 outline-1">
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
          <div
            class="flex justify-end font-semibold text-gray-500 border p-3 mt-3 rounded-2xl"
          >
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
          <div class="mt-8 mb-14 flex items-center justify-between">
            <div>
              <h3 class="font-bold mb-1 text-lg">Amount in words</h3>
              <p class="text-gray-400 text-sm">
                ${numberToWordsWithNairaKobo(amount_due)}
              </p>
            </div>
            <div class="text-right mr-2">
              <p class="text-gray-400 text-sm">PAID</p>
              <h3 class="font-bold mb-1 text-lg">${formatMoney(amount_due)}</h3>
            </div>
          </div>
        </div>

        <!-- Signature -->
        <div class="text-right mt-10 flex flex-col items-center justify-end">
          <div class="signature-line"></div>
          <p class="mt-2 font-semibold">Executive Chairman JSIRS</p>
        </div>
      `;

      $("#invoiceContainer").html(invoiceContainer);

      const qrCodeContainer = document.getElementById("qrContainer");

      const qrCode = new QRCode(qrCodeContainer, {
        text: `https://paykano.com/invoiceGeneration/payment-receipt.html?invoice_number=${invoice_number}`,
        colorDark: "#000000",
        colorLight: "#ffffff",
        version: 10,
      });
    } else {
      $("#invoiceContainer").html(`
          <div class='d-flex justify-content-center'>
            <img src='../assets/img/not-found.png' alt='' />
          </div>
          <p class="mt-3 text-danger text-center">Invalid or Expired Receipt</p>
          
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
