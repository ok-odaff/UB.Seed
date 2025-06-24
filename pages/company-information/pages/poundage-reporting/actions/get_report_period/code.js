//get stop sale date to fulfill year 
let stopSaleDates = [...{{data}}]           
let tableLabels = []
//set period 1 end as one day before period 2 begin
function subtractDay(dt) {
	return moment(dt).add('day', -1);
}

for (let i = 0; i < stopSaleDates.length; i++) {
	let stopSale = new Date(stopSaleDates[i])
  let year = stopSale.getFullYear()


  //set begin and end of periods
  let period1begin = new Date(`${state.program_variables.find(v => v.name == 'LICENSE_FIRST_NOTICE_DATE')?.value}-${year - 1}`)
  let period2begin = new Date(`${state.program_variables.find(v => v.name == 'POUNDAGE_FIRST_NOTICE_DATE')?.value}-${year}`)
  let period1end = subtractDay(period2begin).toDate()
  let period2end = new Date(`${state.program_variables.find(v => v.name == 'LICENSE_EXPIRATION_DATE')?.value}-${year}`)

  //compare dates to find period
  if (stopSale < period1end && stopSale > period1begin) {
    {{state.report_periods}} = {
      label: `${period2begin.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })} - ${period2end.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })}`, 
      report_period: `${period2begin.toLocaleString('en-US', {month: 'short', year: '2-digit'})} - ${period2end.toLocaleString('en-US', {month: 'short', year: '2-digit'})}`,
      fiscal_year: year, 
    	fiscal_quarter: 3
    }
  } else if (stopSale < period2end && stopSale > period2begin) { 
    {{state.report_periods}} = {
    	label: `${period1begin.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })} - ${period1end.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}`,
      report_period: `${period1begin.toLocaleString('en-US', {month: 'short', year: '2-digit'})} - ${period1end.toLocaleString('en-US', {month: 'short', year: '2-digit'})}`,
      fiscal_year: year, 
  	  fiscal_quarter: 1
    }
	}
}




//build string to use as label
return {{state.report_periods}}