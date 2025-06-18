let currentDate = new Date();
let currentYear = currentDate.getFullYear()
let tableLabels = []

function subtractDay(dt) {
return moment(dt).add('day', -1).add('year', 1);
}

//set begin and end of periods
let period1begin = new Date(`${state.program_variables.find(v => v.name == 'LICENSE_FIRST_NOTICE_DATE')?.value}-${currentYear - 1}`)
let period2begin = new Date(`${state.program_variables.find(v => v.name == 'POUNDAGE_FIRST_NOTICE_DATE')?.value}-${currentYear}`)
let period1end = subtractDay(period2begin).toDate()
let period2end = new Date(`${state.program_variables.find(v => v.name == 'LICENSE_EXPIRATION_DATE')?.value}-${currentYear}`)

//compare dates to find period
if (currentDate < period1end && currentDate > period1begin) {
tableLabels.push(`${period2begin.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })} - ${period2end.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })}`);
  {{state.report_periods}} = {
    report_period: `${period2begin.toLocaleString('en-US', {month: 'short', year: '2-digit'})} - ${period2end.toLocaleString('en-US', {month: 'short', year: '2-digit'})}`,
  	fiscal_year: currentYear, 
  fiscal_quarter: 3
  }
} else if (currentDate < period2end && currentDate > period2begin) {

  tableLabels.push(`${period1begin.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })} - ${period1end.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })}`);
  
{{state.report_periods}} = {
    report_period: `${period1begin.toLocaleString('en-US', {month: 'short', year: '2-digit'})} - ${period1end.toLocaleString('en-US', {month: 'short', year: '2-digit'})}`,
  	fiscal_year: currentYear, 
  fiscal_quarter: 1
  }
}

ui.reportPeriod.setValue(tableLabels[0]);
return tableLabels