var config = {
  minDownpaymentPercent: 5,
  salaryMultiplier: 6,
  fixedFiveYears: 2.5,
  variable: 1.5,
  fixedThreeYears: 2,
  fixedTenYears: 3,
}

var templateRoot = document.querySelector('.templateRoot')

init()

function calculateMortagage() {
  var totalIncomeDiv = document.querySelector('.form-control-first')
  var downPaymentDiv = document.querySelector('.form-control-second')
  var monthlyCreditExpensesDiv = document.querySelector('.form-control-third')
  var otherExpensesMonthlyDiv = document.querySelector('.form-control-fourth')
  if (
    totalIncomeDiv.value == '' ||
    downPaymentDiv.value == '' ||
    monthlyCreditExpensesDiv.value == '' ||
    otherExpensesMonthlyDiv.value == ''
  ) {
    return
  }

  var sumExpenses =
    (parseInt(monthlyCreditExpensesDiv.value) +
      parseInt(otherExpensesMonthlyDiv.value)) *
    12
  var maxSalaryMortagage =
    parseInt(totalIncomeDiv.value) * config.salaryMultiplier

  var maxDownpaymentMortagage =
    (parseInt(downPaymentDiv.value) * 100) / config.minDownpaymentPercent -
    sumExpenses

  var result = 0
  if (maxSalaryMortagage > maxDownpaymentMortagage) {
    result = maxDownpaymentMortagage
  } else {
    result = maxSalaryMortagage
  }

  processingTemplateMortagagePreview(templateRoot, result)
}

function init() {
  var client = new XMLHttpRequest()
  client.open('GET', 'config.json')
  client.onreadystatechange = function () {
    if (client.readyState === 4) {
      if (client.status === 200 || client.status == 0) {
        config = JSON.parse(client.responseText)
      }
    }
  }
  client.send()
}

function processingTemplateMortagagePreview(templateRoot, availableMortagage) {
  var temp = document.querySelector('#mortagagePreview')
  while (templateRoot.lastElementChild) {
    templateRoot.removeChild(templateRoot.lastElementChild)
  }
  var clon = temp.content.cloneNode(true)

  var resultDiv = clon.querySelector('.input-group-result')
  if (availableMortagage <= 0) {
    resultDiv.innerHTML = 'Mortagage is not available'
  } else {
    resultDiv.innerHTML = 'Your mortgage limit is ' + availableMortagage
  }

  clon.querySelector('#fixedProcentFiveYears').innerHTML =
    config.fixedFiveYears + '% fixed for 5 years'

  clon.querySelector('#fixedProcentResultFiveYears').innerHTML =
    calculateMonthlyProcent(availableMortagage, config.fixedFiveYears)

  clon.querySelector('#variableProcent').innerHTML =
    config.variable + '% variable'
  clon.querySelector('#variableProcentResult').innerHTML =
    calculateMonthlyProcent(availableMortagage, config.variable)

  clon.querySelector('#fixedProcentThreeYears').innerHTML =
    config.fixedThreeYears + '% fixed for 3 years'
  clon.querySelector('#fixedProcentResultThreeYears').innerHTML =
    calculateMonthlyProcent(availableMortagage, config.fixedThreeYears)

  clon.querySelector('#fixedProcentTenYears').innerHTML =
    config.fixedTenYears + '% fixed for 10 years'
  clon.querySelector('#fixedProcentResultTenYears').innerHTML =
    calculateMonthlyProcent(availableMortagage, config.fixedTenYears)

  templateRoot.appendChild(clon)
}

function calculateMonthlyProcent(result, percent) {
  var intermediateMortagage = result / (30 * 12)
  var interResult = (result * percent) / 100 / 12
  var interMainresult = intermediateMortagage + interResult
  if (interMainresult <= 0) {
    return 'N/A'
  }
  return '$' + Math.round(interMainresult)
}
