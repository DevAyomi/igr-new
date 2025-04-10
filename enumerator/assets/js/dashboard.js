function fetchTaxpayerStatistics() {
  $.ajax({
    type: "GET",
    url: `${HOST}/get-enumtaxpayer-statistics?enumerator_id=${enumUser.user_id}`,
    dataType: "json",
    headers: {
      Authorization: "Bearer " + authToken,
      "Content-Type": "application/json",
    },
    success: function (response) {
      if (response.status === "success") {
        const stats = response.data;

        // Update Registered Taxpayers
        $("#registeredTaxpayersCount").text(stats.total_enumerator_tax_payers.toLocaleString());

      } else {
        console.error("Failed to fetch taxpayer statistics");
        //   resetStatisticCards();
      }
    },
    error: function (xhr, status, error) {
      console.error("Error fetching taxpayer statistics:", error);
      //   resetStatisticCards();
    },
  });
}

fetchTaxpayerStatistics();

async function getMonthlyStats(month, year) {
  const filter = {
    enumerator_id: enumUser.user_id,
    month,
    year
  }
  $.ajax({
    url: `${HOST}/get-enumtaxpayer-statistics`,
    type: 'GET',
    data: filter,
    dataType: 'json',
    headers: {
      Authorization: "Bearer " + authToken,
      "Content-Type": "application/json",
    },
    success: function (response) {
      if (response.status === "success") {
        const data = response.data;
        $('#monthlyRegNum').html(data.total_monthly_enumerator_tax_payers.toLocaleString());
      } else {
        // console.log('No data found for today');
        $('#monthlyRegNum').html(0);
      }
    },
    error: function (xhr, status, error) {
      console.error('AJAX Error:', status, error);
      $('#monthlyRegNum').html(0);
    }
  });

}
const currentDate = new Date();
const currentYearD = currentDate.getFullYear();
const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0');

$("#dateFilter").val(`${currentYearD}-${currentMonth}`)

$('#dateFilter').on('change', function () {
  $('#monthlyRegNum').html(`<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`);
  getMonthlyStats($(this).val());
});

getMonthlyStats(currentMonth, currentYearD)

function fetchTaxpayers() {
  const $enumeratedTbody = $("#enumTbody tbody");

  const loaderRow = `
    <tr class="loader-row">
      <td colspan="9" class="text-center">
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
  `;

  // Show loader in both tables
  $enumeratedTbody.html(loaderRow);

  $.ajax({
    type: "GET",
    url: `${HOST}/get-enumerator-tax-payers?enumerator_id=${enumUser.user_id}`,
    dataType: "json",
    headers: {
      Authorization: "Bearer " + authToken,
      "Content-Type": "application/json",
    },
    crossDomain: true,
    success: function (response) {
      if (response.status === "success" && response.data.length > 0) {
        const taxpayers = response.data;

        $enumeratedTbody.empty();

        // Populate Enumerated Taxpayers
        taxpayers.forEach((taxpayer, index) => {
          const row = `
            <tr>
              <td>${index + 1}</td>
              <td>${taxpayer.tax_number}</td>
              <td>${taxpayer.first_name} ${taxpayer.last_name}</td>
              <td>${taxpayer.email}</td>
              <td>${taxpayer.category}</td>
            </tr>
          `;
          $enumeratedTbody.append(row);
        });


      } else {

        $enumeratedTbody.html(
          '<tr><td colspan="4" class="text-center">No enumerated taxpayers found.</td></tr>'
        );
      }
    },
    error: function (err) {
      console.error("Error fetching taxpayers:", err);
      $enumeratedTbody.html(
        '<tr><td colspan="4" class="text-center text-danger">An error occurred while fetching taxpayers.</td></tr>'
      );
    },
  });
}

fetchTaxpayers()

async function fetchTaxPayersData() {
  $.ajax({
    type: "GET",
    url: `${HOST}/get-enumerator-tax-payers?enumerator_id=${enumUser.user_id}&limit=1000&page=1`,
    dataType: "json",
    headers: {
      Authorization: "Bearer " + authToken,
      "Content-Type": "application/json",
    },
    crossDomain: true,
    success: function (response) {
      if (response.status === "success" && response.data.length > 0) {
        const taxpayers = response.data;
        const categoryCounts = {
          Individual: 0,
          Corporate: 0,
          'State. Agency': 0,
          'Federal Agency': 0
        };

        taxpayers.forEach(item => {
          const category = item.category.toLowerCase();
          if (category === 'individual') categoryCounts.Individual++;
          else if (category === 'corporate') categoryCounts.Corporate++;
          else if (category === 'state agency') categoryCounts['State. Agency']++;
          else if (category === 'federal agency') categoryCounts['Federal Agency']++;
        });

        renderPieChart(Object.values(categoryCounts));


      } else {
        const categoryCounts = {
          Individual: 0,
          Corporate: 0,
          'State. Agency': 0,
          'Federal Agency': 0
        };

        renderPieChart(Object.values(categoryCounts));
      }
    },
    error: function (err) {
      console.error('Error fetching data:', error);
    },
  });

}

function renderPieChart(dataa) {
  const ctx4 = document.getElementById('pie-chart').getContext('2d');

  new Chart(ctx4, {
    type: 'pie',
    data: {
      labels: ['Individual', 'Corporate', 'State. Agency', 'Federal Agency'],
      datasets: [{
        label: 'Tax Payers Categories',
        weight: 9,
        cutout: 0,
        tension: 0.9,
        pointRadius: 2,
        borderWidth: 2,
        backgroundColor: ['#17c1e8', '#5e72e4', '#3A416F', '#a8b8d8'],
        data: dataa,
        fill: false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true
        }
      },
      interaction: {
        intersect: false,
        mode: 'index'
      }
    }
  });
}

fetchTaxPayersData();