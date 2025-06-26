const date = new Date();
let licenses = {{state.branches}}.filter(licenses => licenses.paid_by_headquarter_license == true && licenses.license_payment_made == false);
let number_of_licenses = licenses.length;

if ({{state.company.exempt_from_license}} != true) {
number_of_licenses++
}

console.log(number_of_licenses)
const LICENSE_FEE_RETAIL = {{state.program_variables.find(p => p.name == 'LICENSE_FEE_RETAIL').value}};
const LICENSE_FEE_WHOLESALE_AND_MEDICAL_MARIJUANA = {{state.program_variables.find(p => p.name == 'LICENSE_FEE_WHOLESALE_AND_MEDICAL_MARIJUANA').value}};
let LICENSE_FEE;


if ({{state.company.company_type == "Retail"}}) {
  LICENSE_FEE = LICENSE_FEE_RETAIL
} else {
  LICENSE_FEE = LICENSE_FEE_WHOLESALE_AND_MEDICAL_MARIJUANA
}

const LICENSE_LATE_FEE_RETAIL = {{state.program_variables.find(p => p.name == 'LICENSE_LATE_FEE_RETAIL').value}};
const LICENSE_LATE_FEE_WHOLESALE_AND_MEDICAL_MARIJUANA = {{state.program_variables.find(p => p.name == 'LICENSE_LATE_FEE_WHOLESALE_AND_MEDICAL_MARIJUANA').value}};
let LICENSE_LATE_FEE;
if ({{state.company.company_type == "Retail"}}) {
  LICENSE_LATE_FEE = LICENSE_LATE_FEE_RETAIL 
} else {
  LICENSE_LATE_FEE = LICENSE_LATE_FEE_WHOLESALE_AND_MEDICAL_MARIJUANA
}

const LICENSE_LATE_FEE_DATE = {{state.program_variables.find(p => p.name == 'LICENSE_LATE_FEE_DATE').value}};

const FULL_LATE_FEE_DATE = new Date(LICENSE_LATE_FEE_DATE + '-' + date.getFullYear());
let fees = [];

// Base license fee
fees.push({
  'description': 'License Fee',
	'type': 'license_fee',
  'amount': Number(LICENSE_FEE * number_of_licenses)
});
           
// Add late fee if past date
if (date > FULL_LATE_FEE_DATE || date > new Date(state.company_details.license_expiration_date)) {
  fees.push({
    'description': 'Late Fee',
		'type': 'license_late_fee',
    'amount': Number(LICENSE_LATE_FEE * number_of_licenses)
  });
}

return {{state.fees}} = fees;