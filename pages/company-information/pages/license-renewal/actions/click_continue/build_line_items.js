let total_license_fee = 0;
let total_license_late_fee = 0;

const LICENSE_FEE_RETAIL = Number({{state.program_variables.find(p => p.name == 'LICENSE_FEE_RETAIL').value}});
const LICENSE_FEE_WHOLESALE_AND_MEDICAL_MARIJUANA = Number({{state.program_variables.find(p => p.name == 'LICENSE_FEE_WHOLESALE_AND_MEDICAL_MARIJUANA').value}});
const LICENSE_LATE_FEE_RETAIL = Number({{state.program_variables.find(p => p.name == 'LICENSE_LATE_FEE_RETAIL').value}});
const LICENSE_LATE_FEE_WHOLESALE_AND_MEDICAL_MARIJUANA = Number({{state.program_variables.find(p => p.name == 'LICENSE_LATE_FEE_WHOLESALE_AND_MEDICAL_MARIJUANA').value}});

const date = new Date();


if ({{state.branches.length > 1}}) {
let licenses = {{state.branches}}.filter(licenses => licenses.paid_by_headquarter_license == true && licenses.license_payment_made == false);
  for (let license of licenses) {
  if (license.company_type.toLowerCase() == 'retail') {
  total_license_fee += LICENSE_FEE_RETAIL
  } else if (license.company_type.toLowerCase == 'wholesale' || license.company_type.toLowerCase() == 'marijuana') {
  total_license_fee += LICENSE_FEE_WHOLESALE_AND_MEDICAL_MARIJUANA 
  }
  }
}

if ({{state.company.exempt_from_license}} != true) {
 if (state.company.company_type.toLowerCase() == 'retail') {
  total_license_fee += LICENSE_FEE_RETAIL
  } else if (state.company.company_type.toLowerCase() == 'wholesale' || state.company.company_type.toLowerCase() == 'marijuana') {
  total_license_fee += LICENSE_FEE_WHOLESALE_AND_MEDICAL_MARIJUANA 
  }
}
console.log(total_license_fee)
// const LICENSE_LATE_FEE_DATE = {{state.program_variables.find(p => p.name == 'LICENSE_LATE_FEE_DATE').value}};
// const FULL_LATE_FEE_DATE = new Date(LICENSE_LATE_FEE_DATE + '-' + date.getFullYear());
// if (date > FULL_LATE_FEE_DATE || date > new Date(state.company_details.license_expiration_date)) {
//   if ({{state.branches.length > 1}}) {
// let licenses = {{state.branches}}.filter(licenses => licenses.paid_by_headquarter_license == true && licenses.license_payment_made == false);
//   for (let license of licenses) {
//   if (license.company_type == 'Retail') {
//   total_license_late_fee += LICENSE_LATE_FEE_RETAIL
//   } else if (license.company_type == 'Wholesale' || license.company_type == 'Medical Marijuana') {
//   total_license_late_fee += LICENSE_LATE_FEE_WHOLESALE_AND_MEDICAL_MARIJUANA 
//   }
//   }
// }
// }

// if ({{state.company.exempt_from_license}} != true) {
//  if (state.company.company_type == 'Retail') {
//   total_license_late_fee += LICENSE_LATE_FEE_RETAIL
//   } else if (state.company.company_type == 'Wholesale' || license.company_type == 'Medical Marijuana') {
//   total_license_late_fee += LICENSE_LATE_FEE_WHOLESALE_AND_MEDICAL_MARIJUANA 
//   }
// }


let fees = [];

// Base license fee
fees.push({
  'description': 'License Fee',
	'type': 'license_fee',
  'amount': Number(total_license_fee.toFixed(2))
});
  
  console.log(fees)
           
// Add late fee if past date

//   fees.push({
//     'description': 'Late Fee',
// 		'type': 'license_late_fee',
//     'amount': total_license_late_fee
//   });

return {{state.fees}} = fees;