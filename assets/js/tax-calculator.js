$("#addAllowance").on("click", function () {
  let annualGrossss = document.querySelector("#annualGross");
  if (annualGrossss.value === "") {
    alert("Annual Gross field cannot be empty");
  } else {
    nextPrev(1);
  }
});

function formatMoney(amount) {
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "NGN", // Change this to your desired currency code
    minimumFractionDigits: 2,
  });
}

function formatNumber(input) {
  // Remove non-numeric characters
  let value = input.value.replace(/\D/g, "");

  // Format the number with commas
  value = Number(value).toLocaleString("en-US");

  // Update the input value
  input.value = value;
}

$("#calculateTaxBtn").on("click", function () {
  // Annual gross income
  let incomeInput = document.querySelector("#annualGross");

  if (incomeInput.value === "") {
    alert("Annual Gross field cannot be empty");
  } else {
    const annualGrossIncome = Number(incomeInput.value.replace(/,/g, ""));

    // Deduction rates
    const nhfRate = 0.025; // 2.5%
    const pensionRate = 0.08; // 8%
    const nhisRate = 0.05; // 5%
    const lifeInsuranceRate = 0.0; // 0%
    const gratuitiesRate = 0.0; // 0%

    // Calculate deductions
    const nhfDeduction = annualGrossIncome * nhfRate;
    const pensionDeduction = annualGrossIncome * pensionRate;
    const nhisDeduction = annualGrossIncome * nhisRate;
    const lifeInsuranceDeduction = annualGrossIncome * lifeInsuranceRate;
    const gratuitiesDeduction = annualGrossIncome * gratuitiesRate;

    // Calculate total deductions
    const totalDeductions =
      nhfDeduction +
      pensionDeduction +
      nhisDeduction +
      lifeInsuranceDeduction +
      gratuitiesDeduction;

    // Calculate new gross income
    const newGrossIncome = annualGrossIncome - totalDeductions;

    // Calculate consolidated amount with a condition
    const consolidated =
      newGrossIncome * 0.2 + (newGrossIncome > 200000 ? 0 : 0);

    // Calculate total allowance
    const totalAllowance =
      consolidated +
      nhfDeduction +
      nhisDeduction +
      lifeInsuranceDeduction +
      gratuitiesDeduction;

    // Calculate chargeable income
    const chargeableIncome = annualGrossIncome - totalAllowance;

    // Calculate First Charge
    const firstCharge =
      chargeableIncome >= 300000 ? 300000 * 0.07 : 0.07 * chargeableIncome;

    // Calculate Second Charge
    const secondCharge =
      chargeableIncome - 300000 < 300000
        ? (chargeableIncome - 300000 < 0 ? 0 : chargeableIncome - 300000) * 0.11
        : 300000 * 0.11;

    // Calculate Third Charge
    const thirdCharge =
      chargeableIncome - 600000 < 500000
        ? (chargeableIncome - 600000 < 0 ? 0 : chargeableIncome - 600000) * 0.15
        : 500000 * 0.15;

    // Calculate Fourth Charge
    const fourthCharge =
      chargeableIncome - 1100000 < 500000
        ? chargeableIncome - 1100000 > 0
          ? (chargeableIncome - 1100000) * 0.19
          : 0
        : 500000 * 0.19;

    // Calculate Fifth Charge
    const fifthCharge =
      chargeableIncome - 1600000 < 1600000
        ? chargeableIncome - 1600000 > 0
          ? (chargeableIncome - 1600000) * 0.21
          : 0
        : 1600000 * 0.21;

    // Calculate Sixth Charge
    const sixthCharge =
      chargeableIncome > 3200000 ? (chargeableIncome - 3200000) * 0.24 : 0;

    // Calculate Annual Tax Due
    const annualTaxDue =
      firstCharge +
      secondCharge +
      thirdCharge +
      fourthCharge +
      fifthCharge +
      sixthCharge;

    // Calculate Monthly Tax Payable
    const monthlyTaxPayable = annualTaxDue / 12;

    // Display results
    // console.log("Annual Gross Income:", annualGrossIncome);
    // console.log("Total Deductions:", totalDeductions);
    // console.log("New Gross Income:", newGrossIncome);
    // console.log("Consolidated Amount:", consolidated);
    // console.log("Total Allowance:", totalAllowance);
    // console.log("Chargeable Income:", chargeableIncome);
    // console.log("First Charge:", firstCharge);
    // console.log("Second Charge:", secondCharge);
    // console.log("Third Charge:", thirdCharge);
    // console.log("Fourth Charge:", fourthCharge);
    // console.log("Fifth Charge:", fifthCharge);
    // console.log("Sixth Charge:", sixthCharge);
    // console.log("Annual Tax Due:", annualTaxDue);
    // console.log("Monthly Tax Payable:", monthlyTaxPayable);

    nextPrev(1);

    $("#monthAmount").html(formatMoney(monthlyTaxPayable));
    $("#annualAmount").html(formatMoney(annualTaxDue));

    $(".collapse2").html(`
      <table class="table table-borderless taxTablee">
        <tr>
          <th>Gross Income:</th>
          <td id="grossIncome2" class="text-right">${formatMoney(
      parseFloat(annualGrossIncome)
    )}</td>
        </tr>
        <tr>
          <th>Deduction:</th>
          <td id="deduction2" class="text-right">${formatMoney(
      totalDeductions
    )}</td>
        </tr>
        <tr>
          <th>Net Income:</th>
          <td id="netIncome" class="text-right">${formatMoney(
      newGrossIncome
    )}</td>
        </tr>
        <tr>
          <th>Consolidated Relief:</th>
          <td id="relief2" class="text-right">${formatMoney(consolidated)}</td>
        </tr>

        <tr>
          <th>Tax Due:</th>
          <th id="relief2" class="text-right">${formatMoney(annualTaxDue)}</th>
        </tr>
      </table>
    `);

    $(".collapse1").html(`
      <table class="table table-borderless taxTablee">
        <tr>
          <th>Gross Income:</th>
          <td id="grossIncome2" class="text-right">${formatMoney(
      parseFloat(annualGrossIncome)
    )}</td>
        </tr>
        <tr>
          <th>Deduction:</th>
          <td id="deduction2" class="text-right">${formatMoney(
      totalDeductions
    )}</td>
        </tr>
        <tr>
          <th>Net Income:</th>
          <td id="netIncome" class="text-right">${formatMoney(
      newGrossIncome
    )}</td>
        </tr>
        <tr>
          <th>Consolidated Relief:</th>
          <td id="relief2" class="text-right">${formatMoney(consolidated)}</td>
        </tr>

        <tr>
          <th>Tax Due:</th>
          <th id="relief2" class="text-right">${formatMoney(
      monthlyTaxPayable
    )}</th>
        </tr>
      </table>
    `);
  }
});
