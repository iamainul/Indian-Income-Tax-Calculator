/* =====================
   Indian Tax Calculator
   Created by: Ainul Usmani
   ===================== */

// Tab switching function
function switchTab(tabId) {
  document.querySelectorAll('.tab').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

  document.querySelector(`[onclick="switchTab('${tabId}')"]`).classList.add('active');
  document.getElementById(tabId).classList.add('active');
}

// Tax calculation function
function calculateTax() {
  const salary = parseFloat(document.getElementById('salary').value) || 0;
  const regime = document.querySelector('input[name="regime"]:checked').value;

  let taxableIncome = salary;
  let deductions = 0;
  let tax = 0;

  // Old Regime deductions
  if (regime === "old") {
    const sec80c = Math.min(parseFloat(document.getElementById('sec80c').value) || 0, 150000);
    const sec80d = Math.min(parseFloat(document.getElementById('sec80d').value) || 0, 25000);
    const hra = parseFloat(document.getElementById('hra').value) || 0;
    const other = parseFloat(document.getElementById('other').value) || 0;

    deductions = sec80c + sec80d + hra + other;
    taxableIncome = Math.max(0, salary - deductions);
  }

  // Tax slabs FY 2024-25
  if (regime === "old") {
    if (taxableIncome <= 250000) tax = 0;
    else if (taxableIncome <= 500000) tax = (taxableIncome - 250000) * 0.05;
    else if (taxableIncome <= 1000000) tax = 12500 + (taxableIncome - 500000) * 0.20;
    else tax = 112500 + (taxableIncome - 1000000) * 0.30;
  } else {
    if (taxableIncome <= 300000) tax = 0;
    else if (taxableIncome <= 600000) tax = (taxableIncome - 300000) * 0.05;
    else if (taxableIncome <= 900000) tax = 15000 + (taxableIncome - 600000) * 0.10;
    else if (taxableIncome <= 1200000) tax = 45000 + (taxableIncome - 900000) * 0.15;
    else if (taxableIncome <= 1500000) tax = 90000 + (taxableIncome - 1200000) * 0.20;
    else tax = 150000 + (taxableIncome - 1500000) * 0.30;
  }

  // Rebate u/s 87A
  if ((regime === "old" && taxableIncome <= 500000) || (regime === "new" && taxableIncome <= 700000)) {
    tax = 0;
  }

  // Add 4% cess
  const cess = tax * 0.04;
  const totalTax = tax + cess;

  // Show summary
  document.getElementById('summary-content').innerHTML = `
    <p><strong>Gross Salary:</strong> ₹${salary.toLocaleString()}</p>
    <p><strong>Deductions:</strong> ₹${deductions.toLocaleString()}</p>
    <p><strong>Taxable Income:</strong> ₹${taxableIncome.toLocaleString()}</p>
    <p><strong>Tax Before Cess:</strong> ₹${tax.toLocaleString()}</p>
    <p><strong>Health & Education Cess (4%):</strong> ₹${cess.toLocaleString()}</p>
    <h3>Total Tax Payable: ₹${totalTax.toLocaleString()}</h3>
  `;

  // Add to history
  const historyList = document.getElementById('history-list');
  const li = document.createElement('li');
  li.textContent = `Salary: ₹${salary.toLocaleString()} | Regime: ${regime.toUpperCase()} | Tax: ₹${totalTax.toLocaleString()}`;
  historyList.appendChild(li);

  // Switch to summary tab
  switchTab('summary');
}
