$(document).ready(function () {
  const currentPage = 1; // Change this if paginated
  const limit = 50;

  let dataToExport;
  $(document).ready(function () {

    if ($.fn.DataTable.isDataTable('#datatable')) {
      $('#datatable').DataTable().clear().destroy();
    }

    table = $("#datatable").DataTable({
      // processing: true,
      serverSide: true,
      paging: true,
      ordering: false,
      pageLength: 50,
      responsive: true,
      searchDelay: 500,
      pagingType: "simple_numbers",
      ajax: function (data, callback, settings) {
        // Convert DataTables page number to your API page number
        const pageNumber = Math.ceil(data.start / data.length) + 1;

        const filters = {
          page: pageNumber,
          limit: data.length,
          // search: data.search.value,
          // Add any additional filters
          mda_id: mdaId,
          revenue_head: $("#revenue_head").val(),
          status: $("#status").val(),
          start_date: $("#start_date").val(),
          end_date: $("#end_date").val(),
        };

        // Call your API with the calculated page number
        $.ajax({
          url: `${HOST}/get-mda-invoices`,
          type: 'GET',
          data: filters,
          headers: {
            Authorization: "Bearer " + authToken,
          },
          dataType: "json",
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
              recordsTotal: response.pagination.total_records, // Total records in your database
              recordsFiltered: response.pagination.total_records, // Filtered records count
              data: response.data, // The actual data array from your API
            });

          },
          error: function () {
            $("#datatable tbody").html(`
              <tr>
                <td colspan="8" class="text-center">
                  Failed to Fetch Data
                </td>
              </tr>
            `);
          },
        });
      },
      columns: [
        {
          data: null,
          render: function (data, type, row, meta) {
            return meta.row + 1;
          },
        },
        {
          data: "associated_revenue_heads",
          render: function (data) {
            return data.map((head) => head.item_name).join(", ");
          },
        },
        { data: "tax_number" },
        { data: "invoice_number" },
        {
          data: "amount_paid",
          render: function (data) {
            return `₦ ${parseFloat(data).toLocaleString()}`;
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


    $("#applyFilter").on("click", function (e) {
      $("#datatable").DataTable().draw(); // Redraw the table with new filters
      $("#filterInvoiceModal").modal("hide")
    });

    // Optional: Clear filters
    $("#clear-filters").on("click", function () {
      $("#revenue_head, #status, #start_date, #end_date").val("");
      $("#datatable").DataTable().draw();
    });
  });

  const revenueHeadSelectize = $("#revenueHead").selectize({
    placeholder: "Select a revenue head...",
  });

  // Fetch Revenue Heads for selected MDA
  function fetchRevenueHeadData(mdaId) {
    $.ajax({
      type: "GET",
      url: `${HOST}/get-revenue-head?mda_id=${mdaId}`,
      dataType: "json",
      headers: {
        Authorization: "Bearer " + authToken,
        "Content-Type": "application/json",
      },
      crossDomain: true,
      success: function (response) {
        const revenueHeadSelectizeInstance = revenueHeadSelectize[0].selectize;

        // Clear existing options
        revenueHeadSelectizeInstance.clearOptions();

        if (response.status === "success" && response.data.length > 0) {
          const revenueHeads = response.data;

          // Add default placeholder option
          revenueHeadSelectizeInstance.addOption({
            value: "",
            text: "Select a revenue head...",
          });

          // Populate Revenue Head options
          revenueHeads.forEach((revenueHead) => {
            revenueHeadSelectizeInstance.addOption({
              value: revenueHead.id,
              text: revenueHead.item_name,
            });
          });

          // Refresh Selectize options
          revenueHeadSelectizeInstance.refreshOptions(false);
        } else {
          revenueHeadSelectizeInstance.addOption({
            value: "",
            text: "No revenue heads available.",
          });
          revenueHeadSelectizeInstance.refreshOptions(false);
        }
      },
      error: function (err) {
        console.error("Error fetching Revenue Heads:", err);
      },
    });
  }

  fetchRevenueHeadData(mdaId);

  // Event listener for "Apply" button in the filter modal
  // $("#filterInvoiceModal #applyFilter").on("click", function () {
  //   const filters = {
  //     revenue_head: $("#revenueHead").val(),
  //     status: $("#paymentStatus").val(),
  //     start_date: $("#fromInput").val(),
  //     end_date: $("#toInput").val(),
  //   };

  //   // Close modal after applying filter
  //   $("#filterInvoiceModal").modal("hide");

  //   // Fetch invoices with the applied filters
  //   fetchInvoices(filters);
  // });

  // // Event listener for "Clear filter" button
  // $("#filterInvoiceModal #clearFilter").on("click", function () {
  //   // Reset all filter fields
  //   $("#filterInvoiceModal select, #filterInvoiceModal input").val("");
  //   $("#filterInvoiceModal").modal("hide");
  //   // Refresh invoice list without filters
  //   fetchInvoices();
  // });

  function exportData() {
    // console.log(dataToExport)
    const csvRows = [];

    // Extract headers (keys) excluding 'id'
    const headers = Object.keys(dataToExport[0]).filter((key) => key !== "id");
    csvRows.push(headers.join(",")); // Join headers with commas

    // Loop through the data to create CSV rows
    for (const row of dataToExport) {
      const values = headers.map((header) => {
        const value = row[header];
        return `"${value}"`; // Escape values with quotes
      });
      csvRows.push(values.join(","));
    }

    // Combine all rows into a single string
    const csvString = csvRows.join("\n");

    // Export to a downloadable file
    const blob = new Blob([csvString], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "invoice.csv";
    a.click();
  }

  function fetchInvoiceStatistics() {
    $.ajax({
      type: "GET",
      url: `${HOST}/invoices-summary?mda_id=${mdaId}`,
      dataType: "json",
      headers: {
        Authorization: "Bearer " + authToken,
        "Content-Type": "application/json",
      },
      success: function (response) {
        if (response.status === "success") {
          const stats = response.data;

          $(".totalInvoices").text(stats.total_invoices);
          $(".totalInvoiced").text(
            `₦ ${stats.total_amount_invoiced.toLocaleString()}`
          );
          $(".totalPaidInvoice").text(
            `₦ ${stats.total_amount_paid.toLocaleString()}`
          );
        } else {
          console.error("Failed to fetch invoice statistics");
          //   resetStatisticCards();
        }
      },
      error: function (xhr, status, error) {
        console.error("Error fetching invoice statistics:", error);
        //   resetStatisticCards();
      },
    });
  }

  fetchInvoiceStatistics();
});
