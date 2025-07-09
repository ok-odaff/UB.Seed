// Get page
const page = activeRoute.name;

// License fees & dates
const LICENSE_FEE_RETAIL = Number({{state.program_variables.find(p => p.name == 'LICENSE_FEE_RETAIL')?.value}});
const LICENSE_LATE_FEE_RETAIL = Number({{state.program_variables.find(p => p.name == 'LICENSE_LATE_FEE_RETAIL')?.value}});
const LICENSE_FEE_WHOLESALE_AND_MEDICAL_MARIJUANA = Number({{state.program_variables.find(p => p.name == 'LICENSE_FEE_WHOLESALE_AND_MEDICAL_MARIJUANA')?.value}});
const LICENSE_LATE_FEE_WHOLESALE_AND_MEDICAL_MARIJUANA = Number({{state.program_variables.find(p => p.name == 'LICENSE_LATE_FEE_WHOLESALE_AND_MEDICAL_MARIJUANA')?.value}});
let LICENSE_FEE;
let LICENSE_LATE_FEE;

if ({{state.company.isRetail}}) {
  LICENSE_FEE = LICENSE_FEE_RETAIL
} else {
  LICENSE_FEE = LICENSE_FEE_WHOLESALE_AND_MEDICAL_MARIJUANA
}

if ({{state.company.isRetail}}) {
  LICENSE_LATE_FEE = LICENSE_LATE_FEE_RETAIL
} else {
  LICENSE_LATE_FEE = LICENSE_LATE_FEE_WHOLESALE_AND_MEDICAL_MARIJUANA
}

const LICENSE_LATE_FEE_DATE = {{state.program_variables.find(p => p.name == 'LICENSE_LATE_FEE_DATE')?.value}};
const LICENSE_FIRST_NOTICE_DATE = {{state.program_variables.find(p => p.name == 'LICENSE_FIRST_NOTICE_DATE')?.value}};

// Tonnage fees & dates
const MINIMUM_POUNDAGE_FEE = Number({{state.program_variables.find(p => p.name == 'MINIMUM_POUNDAGE_FEE')?.value}});
const HIGH_POUNDAGE_FEE = Number({{state.program_variables.find(p => p.name == 'HIGH_POUNDAGE_FEE')?.value}});
const POUNDAGE_LATE_FEE = Number({{state.program_variables.find(p => p.name == 'POUNDAGE_LATE_FEE')?.value}});
const HIGH_POUNDAGE_LATE_FEE = Number({{state.program_variables.find(p => p.name == 'HIGH_POUNDAGE_LATE_FEE')?.value}});
const POUNDAGE_FIRST_LATE_FEE_DATE = {{state.program_variables.find(p => p.name == 'POUNDAGE_FIRST_LATE_FEE_DATE')?.value}};
const POUNDAGE_SECOND_LATE_FEE_DATE = {{state.program_variables.find(p => p.name == 'POUNDAGE_SECOND_LATE_FEE_DATE')?.value}};

// Licensee dates
const now = new Date();
let license_expiration_date;
let waive_tonnage_late_fee;
let waive_license_late_fee;
let license_late_date;
if (state.company) {
	license_expiration_date = new Date({{state.company_details.license_expiration_date}});
  waive_tonnage_late_fee = {{state.company_details?.waive_tonnage_late_fee}} ?? 0;
  waive_license_late_fee = {{state.company_details.waive_license_late_fee}} ?? 0;
  license_late_date = new Date(`${license_expiration_date.getFullYear()}-${LICENSE_LATE_FEE_DATE}`);
}

const fees = [];
if (page == 'Poundage Reporting') {
  // Build fees for tonnage
  
  for (let report of {{state.seed_poundage}}) {
    let fee = MINIMUM_POUNDAGE_FEE;
    let lateFee = POUNDAGE_LATE_FEE;
    let pounds = 0;
    const yyyy = report.fiscal_year;
    const poundage_first_late_date = new Date(`${yyyy}-${POUNDAGE_FIRST_LATE_FEE_DATE}`);
    const poundage_second_late_date = new Date(`${yyyy}-${POUNDAGE_SECOND_LATE_FEE_DATE}`);
    const license_first_notice_date = new Date(`${yyyy}-${LICENSE_FIRST_NOTICE_DATE}`);

    // Sum tons
    report.seed_types.forEach(r => pounds += r.pounds);
    
    if (pounds >= 12500) fee = Math.round(pounds) * HIGH_POUNDAGE_FEE / 100;
    
  	fees.push({
      description: `${report.report_period} Poundage Fee`,
      type: 'tonnage_fee',
      amount: Number(fee.toFixed(2))
    })
    
    if (pounds >= 125000) lateFee = fee * HIGH_POUNDAGE_LATE_FEE;
   
   if (waive_tonnage_late_fee == false) {
    if (now >= poundage_first_late_date) {
      // If the time has passed the second late fee date for the reporting year and maybe even beyond
      fees.push({
       	description: `${report.report_period} Poundage Late Fee`,
        type: 'tonnage_late_fee',
        amount: lateFee
      });
    } else if (now >= poundage_second_late_date && now < license_first_notice_date) {
      // If the time has passed the first late fee date but not entered into the second reporting period of the reporting year
    	fees.push({
       	description: `${report.report_period} Poundage Late Fee`,
        type: 'poundage_late_fee',
        amount: lateFee
      });
    }
  }
  }

} else {
  // Build fees for license renewal or new applications
  
	fees.push({
    description: 'License Fee',
    type: 'license_fee',
    amount: LICENSE_FEE
  });

  if (now > license_late_date) {
    fees.push({
      description: 'License Late Fee',
      type: 'license_late_fee',
      amount: LICENSE_LATE_FEE
    });
  }
}

return fees;