const date = new Date();
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
  'amount': Number(LICENSE_FEE)
});
           
// Add late fee if past date
if (date > FULL_LATE_FEE_DATE || date > new Date(state.company_details.license_expiration_date)) {
  fees.push({
    'description': 'Late Fee',
		'type': 'license_late_fee',
    'amount': Number(LICENSE_LATE_FEE)
  });
}

return {{state.fees}} = fees;