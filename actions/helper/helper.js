//PROGRAM ID
const PROGRAM = 115;
//SPEEDTYPE, NOT ID
const LICENSE_SPEEDTYPE = '413';
const POUNDAGE_SPEEDTYPE = '421';
//Merchant Account, for Braintree, the payment will get put in.
const MERCHANT_ACCOUNT = 'oklahomadepartmentofagriculture_ODAFF_410_instant_USD';

//PROGRAM VARIABLES REQUIRED FOR THE FORM TO WORK OR DISPLAY CORRECTLY
const REQUIRED_VARIABLES = ['LICENSE_FEE', 'LICENSE_LATE_FEE', 'POUNDAGE_FEE', 'POUNDAGE_LATE_FEE', 'LICENSE_SECOND_NOTICE_DATE', 'POUNDAGE_SECOND_NOTICE_DATE', 'ADMIN_EMAIL', 'ADMIN_PHONE', 'ADMIN_NAME', 'SEED_TYPES'];

//Fiscal year/quarter calculators
const FISCAL_YEAR_START_MONTH = 6; //JULY
function getFiscalQuarter(date) {
  let adjustedMonth = 0;
  date = (date == undefined)? new Date(): date;
  adjustedMonth = ((date.getMonth() - FISCAL_YEAR_START_MONTH) + 12) % 12;
  return Math.floor(adjustedMonth / 3) + 1;
}

function getFiscalYear(date) {
  let yearOffset = 0;
  date = (date == undefined)? new Date(): date;
  yearOffset = Math.floor((date.getMonth() - FISCAL_YEAR_START_MONTH) / 12); // deleted the +1 from the end of this equation
  return yearOffset + date.getFullYear();
}