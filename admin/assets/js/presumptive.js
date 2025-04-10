$(document).ready(function () {
  table = $("#datatable").DataTable({
    serverSide: true,
    paging: true,
    ordering: false,
    pageLength: 50,
    responsive: true,
    searchDelay: 500,
    pagingType: "simple_numbers",
    searching: false,
    ajax: function (data, callback, settings) {
      // Convert DataTables page number to your API page number
      const pageNumber = Math.ceil(data.start / data.length) + 1;

      const filters = {
        page: pageNumber,
        limit: data.length,
        // search: data.search.value,
        revenue_head_id: $("#revenue_head").val(),
        invoice_type: "presumptive",
        mda_id: $("#mda").val(),
        tax_number: $("#taxNumber").val(),
        status: $("#status").val(),
        start_date: $("#start_date").val(),
        end_date: $("#end_date").val(),
      };

      // Call your API with the calculated page number
      $.ajax({
        url: `${HOST}/get-invoices`,
        type: "GET",
        data: filters,
        dataType: "json",
        headers: {
          Authorization: "Bearer " + authToken,
        },
        beforeSend: function () {
          // Optional: Add a loading indicator
          $("#datatable tbody").html(`
          <tr class="loader-row">
            <td colspan="11" class="text-center">
                <div class="loader">
                    <div class="rotating-dots">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                </div>
                <span>Loading...</span>
            </td>
          </tr>
        `);
        },
        success: function (response) {
          // Map the API response to DataTables expected format
          callback({
            draw: data.draw, // Pass through draw counter
            recordsTotal: response.data.total_invoices, // Total records in your database
            recordsFiltered: response.data.total_invoices, // Filtered records count
            data: response.data.invoices, // The actual data array from your API
          });
        },
        error: function () {
          alert("Failed to fetch data.");
        },
      });
    },
    columns: [
      {
        data: null,
        render: function (data, type, row, meta) {
          return meta.row + 1; // Serial number
        },
      },
      { data: "tax_number" },
      {
        data: "revenue_heads",
        render: function (data) {
          return data.map((head) => head.mda_name).join("<br>");
        },
      },
      {
        data: "revenue_heads",
        render: function (data) {
          return data.map((head) => head.item_name).join("<br>");
        },
      },
      {
        data: null,
        render: function (data, type, row) {
          return `${row.tax_first_name} ${row.tax_last_name}`;
        },
      },
      { data: "invoice_number" },
      {
        data: "amount_paid",
        render: function (data) {
          return `₦ ${parseFloat(data).toLocaleString()}`;
        },
      },
      {
        data: "date_created",
        render: function (data) {
          return new Date(data).toLocaleDateString();
        },
      },
      {
        data: "due_date",
        render: function (data) {
          return new Date(data).toLocaleDateString();
        },
      },
      {
        data: "payment_status",
        render: function (data) {
          const statusClass =
            data === "paid" ? "badge-success" : "badge-danger";
          return `<span class="badge ${statusClass}">${data}</span>`;
        },
      },
      {
        data: "invoice_number",
        render: function (data, type, row) {
          return `
            <a href="../invoiceGeneration/invoice.html?invoice_number=${data}" 
               class="btn btn-primary btn-sm" target="_blank">
                View Invoice
            </a>
          `;
        },
      },
    ],
  });
});

function validateAndProceed(formId, callback) {
  const form = document.getElementById(formId);

  // Check if the form is valid
  if (form.checkValidity()) {
    // If valid, execute the callback function
    if (callback && typeof callback === "function") {
      callback(); // Execute the callback function
    }
  } else {
    // If not valid, show validation messages
    form.reportValidity(); // This will show the default validation messages
  }
}

function listenForSelection() {
  const radioButtons = document.querySelectorAll(
    '.firstInpts[name="identificationMethod"]'
  );

  radioButtons.forEach((radio) => {
    radio.addEventListener("change", () => {
      if (radio.checked) {
        $("#identiMethod").html(radio.id);
      }
    });
  });
}

// Call the function to start listening
listenForSelection();

$.ajax({
  url: `${HOST}/get-presumptive-taxes`,
  type: "GET",
  headers: {
    Authorization: "Bearer " + authToken,
    "Content-Type": "application/json",
  },
  success: function (response) {
    if (response.status === "success") {
      // Get the revenue items data
      const revenueItems = response.data;

      // Reference to the select element
      const selectElement = $("#business_type");

      // Populate the select options
      revenueItems.forEach((item) => {
        const option = `<option value="${item.business_type}">${item.business_type}</option>`;
        selectElement.append(option);
      });

      const businessSelectize = selectElement.selectize({
        placeholder: "Select a business type...",
      });
    } else {
      alert("Failed to fetch business type.");
    }
  },
  error: function (xhr, status, error) {
    console.error("An error occurred: ", error);
    alert("Could not load business type.");
  },
});

async function fetchUserDetails() {
  let paramUrl = "";

  let $selected_verification = $('input[name="identificationMethod"]:checked');

  if ($selected_verification.val() === "TaxRegID") {
    let taxID = $("#identificationInput").val();
    paramUrl = `tax_number=${taxID}`;
  } else if ($selected_verification.val() === "TIN") {
    let taxID = $("#identificationInput").val();
    paramUrl = `tin=${taxID}`;
  } else if ($selected_verification.val() === "Email") {
    let taxID = $("#identificationInput").val();
    paramUrl = `email=${taxID}`;
  } else if ($selected_verification.val() === "Phone") {
    let taxID = $("#identificationInput").val();
    paramUrl = `phone=${taxID}`;
  }

  if ($("#identificationInput").val() === "") {
    alert("Field cannot be empty");
    return;
  }

  // console.log(paramUrl);

  $("#submitFetch")
    .prop("disabled", true)
    .html('<i class="custom-spinner"></i> Checking ...');

  try {
    const response = await fetch(`${HOST}/get-taxpayers?${paramUrl}`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + authToken,
        "Content-Type": "application/json",
      },
    });
    const result = await response.json();
    $("#submitFetch").prop("disabled", false).html("Check");
    console.log(result);

    if (result.status === "success" && result.data.length > 0) {
      $("#bizSec").removeClass("d-none");
      $("#submitCalc").removeClass("d-none");
      $("#number_of_staff").val(result.data[0].number_of_staff);
      $("#taxnumber").val(result.data[0].tax_number);
    } else {
      Swal.fire({
        title: "User Not Found",
        text: "No Information found with the provided data",
        icon: "warning",
      });
    }
  } catch (error) {
    console.log(error);
    $("#submitFetch").prop("disabled", false).html("Check");

    Swal.fire({
      // title: "Us",
      text: "Failed to Fetch User Information",
      icon: "error",
    });
  }
}

async function calculateTax() {
  const identificationInput = $("#identificationInput").val();
  const taxnumber = $("#taxnumber").val();
  const businessType = $("#business_type").val();
  const numberOfStaff = $("#number_of_staff").val();

  if (!identificationInput) {
    alert("Identification input cannot be empty");
    return;
  }

  if (!businessType) {
    alert("Please select a business type");
    return;
  }

  if (!numberOfStaff) {
    alert("Please select the number of staff");
    return;
  }

  $("#submitCalc")
    .prop("disabled", true)
    .html('<i class="custom-spinner"></i> Calculating ...');

  const postData = {
    tax_number: taxnumber,
    number_of_staff: numberOfStaff,
    business_type: businessType,
  };

  try {
    const response = await fetch(`${HOST}/calculate-presumptive-tax`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + authToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    });
    const result = await response.json();
    $("#submitCalc").prop("disabled", false).html("Calculate Tax");
    console.log(result);

    if (result.status === "success") {
      // Integrate response into HTML
      const responseData = result.data;

      $(".taxNum").text(responseData.identifier);
      $(".btype").text(responseData.business_type);
      $(".noOfStaff").text(responseData.number_of_staff + " employees");
      $(".taxCat").text(
        responseData.tax_category.charAt(0).toUpperCase() +
        responseData.tax_category.slice(1)
      );
      $(".freq").text(responseData.payment_frequency);
      $(".amountPay").text(responseData.payable_amount);
      $("#revenue_head_id").val(responseData.revenue_head_id);
      mda_id;
      $("#mda_id").val(responseData.mda_id);
      $("#amount").val(responseData.payable_amount);

      nextPrev(1);
    }
  } catch (error) {
    console.log(error);

    Swal.fire({
      // title: "Us",
      text: "Failed to Calculate Presumptive Tax",
      icon: "error",
    });
  } finally {
    $("#submitCalc").prop("disabled", false).html("Calculate Tax");
  }
}

async function generateInvoice() {
  $("#genInvoice")
    .prop("disabled", true)
    .html('<i class="custom-spinner"></i> Generating...');

  const taxnumber = $("#taxnumber").val();

  generateTheInvoice(taxnumber);
}

async function generateTheInvoice(tax_numbber) {
  const business_type = $(".btype").text();
  const number_of_staff = $(".noOfStaff").text();
  const tax_category = $(".taxCat").text();
  let dataToSend = {
    tax_number: tax_numbber,
    invoice_type: "presumptive",
    tax_office: "Lagos Tax Office",
    lga: "Ikeja",
    description: `Paying for: ${business_type}(${number_of_staff})<br />Category: ${tax_category}`,
    revenue_heads: [],
  };

  const revenue_head_id = $("#revenue_head_id").val();
  const mda_id = $("#mda_id").val();
  const amount = Number($("#amount").val().replace(/,/g, ""));

  dataToSend.revenue_heads.push({
    revenue_head_id,
    mda_id,
    amount,
  });

  console.log(dataToSend);

  $.ajax({
    type: "POST",
    url: `${HOST}/create-invoice`,
    data: JSON.stringify(dataToSend),
    dataType: "json",
    headers: {
      Authorization: "Bearer " + authToken,
      "Content-Type": "application/json",
    },
    success: function (data) {
      $("#genInvoice").prop("disabled", false).html(`Generate Invoice`);
      if (data.status === "success") {
        $("#previewInvoice").attr(
          "href",
          `../invoiceGeneration/invoice.html?invoice_number=${data.invoice_number}`
        );
        nextPrev(1);
      } else {
        $("#msg_box").html(
          `<p class="text-warning text-center mt-4 text-lg">${data.message}</p>`
        );
      }
    },
    error: function (request, error) {
      $("#genInvoice").prop("disabled", false).html(`Generate Invoice`);
      $("#msg_box").html(
        `<p class="text-danger text-center mt-4 text-lg">${request.responseJSON.message
          ? request.responseJSON.message
          : "Invoice Generation Failed"
        }</p>`
      );
      console.log(request.responseJSON);
    },
  });
}

const currentPage = 1; // Change this if paginated
const limit = 50;

let dataToExport;

// $(document).ready(function () {
//   $("#datatable").DataTable({
//     processing: true,
//     serverSide: true,
//     ordering: false,
//     ajax: {
//       url: `${HOST}/get-invoices`, // Your server endpoint
//       type: "GET",
//       data: function (d) {
//         // Map DataTables parameters to your backend's expected parameters
//         return {
//           page: d.start / d.length + 1, // Convert DataTables start to page number
//           limit: d.length,
//           search: d.search.value,
//           // Add any additional filters
//           revenue_head_id: $("#revenue_head").val(),
//           invoice_type: "presumptive",
//           mda_id: $("#mda").val(),
//           tax_number: $("#taxNumber").val(),
//           status: $("#status").val(),
//           start_date: $("#start_date").val(),
//           end_date: $("#end_date").val(),
//         };
//       },
//       headers: {
//         Authorization: "Bearer " + authToken,
//       },
//       dataType: "json",
//       beforeSend: function () {
//         // Optional: Add a loading indicator
//         $("#datatable tbody").html(`
//           <tr class="loader-row">
//             <td colspan="11" class="text-center">
//                 <div class="loader">
//                     <div class="rotating-dots">
//                         <div></div>
//                         <div></div>
//                         <div></div>
//                         <div></div>
//                     </div>
//                 </div>
//                 <span>Loading...</span>
//             </td>
//           </tr>
//         `);
//       },
//       // Transform the response to match DataTables expected format
//       dataSrc: function (json) {
//         // Parse revenue_head JSON for each invoice
//         json.data.invoices.forEach((invoice) => {
//           try {
//             invoice.parsed_revenue_heads = JSON.parse(invoice.revenue_head);
//           } catch (error) {
//             console.error("Error parsing revenue heads:", error);
//             invoice.parsed_revenue_heads = [];
//           }
//         });

//         return json.data.invoices;
//       },
//       error: function (xhr, error, thrown) {
//         console.error("DataTables Ajax error:", error);
//       },
//     },
//     // Manually specify the total records for pagination
//     drawCallback: function (settings) {
//       var api = this.api();
//       var json = api.ajax.json();
//       var pagination = json.data;

//       if (pagination) {
//         // Calculate current page info
//         var startRecord = (pagination.current_page - 1) * 10 + 1;
//         var endRecord = Math.min(
//           pagination.current_page * 10,
//           pagination.total_invoices
//         );

//         // Update records info display
//         $(settings.nTableWrapper)
//           .find(".dt-info")
//           .html(
//             `Showing ${startRecord} to ${endRecord} of ${pagination.total_invoices} entries`
//           );

//         // Handle pagination buttons
//         var $paginate = $(settings.nTableWrapper).find(".dt-paging");
//         $paginate.empty(); // Clear existing pagination

//         var $nav = $('<nav aria-label="pagination"></nav>');

//         // Add Previous button
//         var $prevButton = $(
//           `<button class="dt-paging-button ${pagination.current_page === 1 ? "disabled" : ""
//           }"
//             role="link" type="button" aria-controls="datatable"
//             aria-label="Previous" data-dt-idx="previous">‹</button>`
//         );

//         if (pagination.current_page > 1) {
//           $prevButton.on("click", function () {
//             api.page("previous").draw("page");
//           });
//         }

//         // Add page numbers
//         var startPage = Math.max(1, pagination.current_page - 2);
//         var endPage = Math.min(pagination.total_pages, startPage + 4);

//         var buttons = [];
//         buttons.push($prevButton);

//         for (var i = startPage; i <= endPage; i++) {
//           var $pageButton = $(
//             `<button class="dt-paging-button ${i === pagination.current_page ? "current" : ""
//             }"
//               role="link" type="button" aria-controls="datatable"
//               data-dt-idx="${i - 1}">${i}</button>`
//           );

//           if (i !== pagination.current_page) {
//             $pageButton.on("click", function () {
//               var page = parseInt($(this).text());
//               api.page(page - 1).draw("page");
//             });
//           } else {
//             $pageButton.attr("aria-current", "page");
//           }

//           buttons.push($pageButton);
//         }

//         // Add ellipsis if needed
//         if (endPage < pagination.total_pages) {
//           buttons.push(
//             $('<span class="ellipsis" aria-controls="datatable">…</span>')
//           );
//         }

//         // Add Next button
//         var $nextButton = $(
//           `<button class="dt-paging-button ${pagination.current_page === pagination.total_pages ? "disabled" : ""
//           }"
//             role="link" type="button" aria-controls="datatable"
//             aria-label="Next" data-dt-idx="next">›</button>`
//         );

//         if (pagination.current_page < pagination.total_pages) {
//           $nextButton.on("click", function () {
//             api.page("next").draw("page");
//           });
//         }

//         buttons.push($nextButton);

//         // Append all buttons to navigation
//         buttons.forEach(function (button) {
//           $nav.append(button);
//         });

//         $paginate.append($nav);
//       }
//     },
//     columns: [
//       {
//         data: null,
//         render: function (data, type, row, meta) {
//           return meta.row + 1; // Serial number
//         },
//       },
//       { data: "tax_number" },
//       {
//         data: "revenue_heads",
//         render: function (data) {
//           return data.map((head) => head.mda_name).join("<br>");
//         },
//       },
//       {
//         data: "revenue_heads",
//         render: function (data) {
//           return data.map((head) => head.item_name).join("<br>");
//         },
//       },
//       {
//         data: null,
//         render: function (data, type, row) {
//           return `${row.tax_first_name} ${row.tax_last_name}`;
//         },
//       },
//       { data: "invoice_number" },
//       {
//         data: "amount_paid",
//         render: function (data) {
//           return `₦ ${parseFloat(data).toLocaleString()}`;
//         },
//       },
//       {
//         data: "date_created",
//         render: function (data) {
//           return new Date(data).toLocaleDateString();
//         },
//       },
//       {
//         data: "due_date",
//         render: function (data) {
//           return new Date(data).toLocaleDateString();
//         },
//       },
//       {
//         data: "payment_status",
//         render: function (data) {
//           const statusClass =
//             data === "paid" ? "badge-success" : "badge-danger";
//           return `<span class="badge ${statusClass}">${data}</span>`;
//         },
//       },
//       {
//         data: "invoice_number",
//         render: function (data, type, row) {
//           return `
//             <a href="../invoiceGeneration/invoice.html?invoice_number=${data}"
//                class="btn btn-primary btn-sm" target="_blank">
//                 View Invoice
//             </a>
//           `;
//         },
//       },
//     ],
//     // pageLength: 10, // Default number of rows per page
//     lengthMenu: [
//       [10, 25, 50, -1],
//       [10, 25, 50, "All"],
//     ], // Pagination options
//     order: [[0, "asc"]], // Default sorting
//     searching: true, // Enable search
//     responsive: true, // Optional: make table responsive
//     ordering: true,
//     pagingType: "custom",
//     // dom: '<"row"<"col-sm-12 col-md-6"l>>rt<"row"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>B',
//     buttons: [
//       {
//         extend: "colvis",
//         text: '<i class="fas fa-columns"></i> Columns',
//         className: "btn btn-primary dropdown-toggle",
//         columns: ":not(.noVis)",
//         exportOptions: {
//           columns: ":visible",
//         },
//         popoverTitle: "Column Visibility",
//         collectionLayout: "fixed two-column",
//         postfixButtons: ["colvisRestore"],
//         init: function (api, node, config) {
//           $(node).removeClass("dt-button");
//         },
//       },
//     ],
//   });

//   $("#filter-form").on("submit", function (e) {
//     e.preventDefault();
//     $("#datatable").DataTable().draw(); // Redraw the table with new filters
//   });

//   // Optional: Clear filters
//   $("#clear-filters").on("click", function () {
//     $("#revenue_head, #status, #start_date, #end_date").val("");
//     $("#datatable").DataTable().draw();
//   });
// });
