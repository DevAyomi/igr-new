const urlParams = new URLSearchParams(window.location.search);
const invoice_number = urlParams.get("tcc_number");

function formatMoney(amount) {
  return parseFloat(amount).toLocaleString("en-US", {
    style: "currency",
    currency: "NGN", // Change this to your desired currency code
    minimumFractionDigits: 2,
  });
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
      `${HOST}/noauth-get-tcc?tcc_number=${invoice_number}`
    );
    const userinvoice = await response.json();

    if (userinvoice.data.length > 0) {
      let tax_certificate = userinvoice.data[0];

      let invoiceContainer = "";

      invoiceContainer += `
       <div class="invoicetop"></div>

        <div class="flex justify-center mt-4">
          <div class="flex items-center">
            <img src="./img/jsirs.png" alt="" width="70">
            <h1 class="text-xl font-bold ms-2">PayJigawa</h1>
          </div>
        </div>

        <section class="px-3 mt-4 text-sm">
          <p class="text-lg text-center font-bold mb-4">TAX CLEARANCE CERTIFICATE</p>
          
          <div class="flex justify-between items-center">

            <table class="table-sm table-borderless">
              <tr>
                <th>Name of Individual:</th>
                <td>${tax_certificate.taxpayer_first_name}, ${
        tax_certificate.taxpayer_surname
      }</td>
              </tr>
              ${
                tax_certificate.taxpayer_category == "individual"
                  ? `
                <tr>
                  <th>RC No.:</th>
                  <td>${tax_certificate.taxpayer_id}</td>
                </tr>
              `
                  : ``
              }
              <tr>
                <th>TIN:</th>
                <td>${tax_certificate.applicant_tin}</td>
              </tr>
              <tr>
                <th>Email:</th>
                <td>${tax_certificate.taxpayer_email}</td>
              </tr>
              <tr>
                <th>Business address:</th>
                <td>${tax_certificate.taxpayer_address}</td>
              </tr>
              <tr>
                <th>Business Category:</th>
                <td>${tax_certificate.category}</td>
              </tr>
            </table>

            <div>
              <div class="h-full">
                <div id="qrContainer" class="w-28 h-28"></div>
              </div>
              <table class="table-sm table-borderless">
                <tr>
                  <th>TCC No.:</th>
                  <td>${tax_certificate.tcc_number}</td>
                </tr>
                <tr>
                  <th>Date:</th>
                  <td>${convertTimestampToReadableDate(
                    tax_certificate.issued_date
                  )}</td>
                </tr>
              </table>
            </div>


          </div>


          <p class="text-sm text-gray-600 mt-4"> This is to certify that the above-named Taxpayer has settled his/her tax
assessment in accordance with the relevant tax laws for all years including the past three years as detailed hereunder </p>


          <table class="mt-4 table table-borderless">
            <thead class="bgPrimary text-center text-white">
              <th></th>
              <th>Assessment Year ${
                tax_certificate?.secondary_info[0]?.first_year_date
              }</th>
              <th>Assessment Year ${
                tax_certificate?.secondary_info[0]?.second_year_date
              }</th>
              <th>Assessment Year ${
                tax_certificate?.secondary_info[0]?.third_year_date
              }</th>
            </thead>
            <tbody class="text-sm">
              <tr>
                <th>Taxable Income</th>
                <td>${
                  tax_certificate?.secondary_info[0]?.first_year_income
                }</td>
                <td>${
                  tax_certificate?.secondary_info[0]?.second_year_income
                }</td>
                <td>${
                  tax_certificate?.secondary_info[0]?.third_year_income
                }</td>
              </tr>
              <tr>
                <th>Tax Paid</th>
                <td>${
                  tax_certificate?.secondary_info[0]?.first_year_tax_amount
                }</td>
                <td>${
                  tax_certificate?.secondary_info[0]?.second_year_tax_amount
                }</td>
                <td>${
                  tax_certificate?.secondary_info[0]?.third_year_tax_amount
                }</td>
              </tr>
            </tbody>
          </table>

          <table>
            <tr>
              <th class="text-sm">Source of Income</th>
              <td class="text-gray-500 pl-4 text-sm">Other Personal Services</td>
            </tr>

            <tr>
              <th class="text-sm">The certificate expires on:</th>
              <td class="text-gray-500 pl-4 text-sm">31st December ${new Date(
                tax_certificate.tax_period_start
              ).getFullYear()}</td>
            </tr>
          </table>



          <div class="flex justify-between items-end">
            <div>
              <p>&nbsp; <br> &nbsp;</p>
              <img src="./img/jigawa.png" width="100" class="z-10 grayscale opacity-50" alt="">
              <hr>
              <p>Official stamp Impression</p>
            </div>

            <div>
              <p class="text-center text-sm text-gray-600">${
                tax_certificate.director_approval_name || "Ahmad Muktar"
              }<br>
                Executive Chairman, JIRS</p>
              <hr>
              <p>Name & Rank of Approving officer</p>
            </div>
          </div>
        </section>

        <hr class="my-4 md:mx-10 mx-4">
          <p class="text-danger md:mx-10 mx-4 text-sm">Please Note: Any alteration made on this document renders it invalid</p>
        <div class="pb-6">
          <div class="flex items-center">
            <img src="./img/jigawa.png" class="w-[100px]" alt="">
            <div>
              <p class="text-xl fontBold pb-0">PayJigawa Portal</p>
              <div class="flex items-center gap-x-3 flex-wrap">
                <p class="text-sm text-[#6F6F84]">www.payjigawa.com</p>
                <p class="text-sm text-[#6F6F84]">Info@payjigawa.com</p>
                <p class="text-sm text-[#6F6F84]">07056990777, 08031230301</p>
                <img src="../assets/img/logo1.png" class="h-[30px] w-[50px]" alt="">
              </div>
            </div>
          </div>

        </div>
      `;

      $("#invoiceContainer").html(invoiceContainer);
      const qrCodeContainer = document.getElementById("qrContainer");

      const qrCode = new QRCode(qrCodeContainer, {
        text: `https://payjigawa.com/etcc/etcc-certificate.html?tcc_number==${invoice_number}`,
        colorDark: "#000000",
        colorLight: "#ffffff",
        version: 10,
      });
    } else {
      $("#invoiceContainer").html(`
        <div class='d-flex justify-content-center'>
          <img src='./img/not-found.png' alt='' />
        </div>
        <p class="mt-3 text-danger text-center">Invalid TCC Number</p>
        
      `);
    }
  } catch (error) {
    console.log(error);
    $("#invoiceContainer").html(`
      <div class='d-flex justify-content-center'>
        <img src='./img/not-found.png' alt='' />
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
    pdf.save("etcc_certificate.pdf");
  });
}
