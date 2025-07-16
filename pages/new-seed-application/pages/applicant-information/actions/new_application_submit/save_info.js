let hq_info = {{actions.get_companies.data}}.find(v => v.company_id == {{ui.AI_Headquarters.value}});
let company_type = {{ui.AI_LicenseType.value}} == 'is_retail'? 'Retail' : 'is_wholesale' ? 'Wholesale' : 'is_medical_marijuana' ? 'medical_marijuana' : '';

let applicantInfo = {
company_name: ui.AI_CompanyName.value,
headquarters: ui.AI_Headquarters.value != 0 ? ui.AI_Headquarters.value : null,
headquarter_detail_id: ui.AI_Headquarters.value != 0 ? hq_info.detail_id : null,
paid_by_headquarter_license: {{ui.AI_HQ_pays_license.value}},
paid_by_headquarter_tonnage: {{ui.AI_HQ_pays_poundage.value}},
program_id: {{PROGRAM}},
license_type: {{state.license_type}},
company_type: company_type,
license_number: '',
physical_address: {{state.company_address_physical}},
mailing_address: {{state.company_address_mailing}},
contact_name: ui.AI_ContactName.value,
contact_phone: ui.AI_ContactPhone.value.toString(),
contact_email: ui.AI_ContactEmail.value,
prefers_paper: ui.AI_PrefersPaper.value,
current_date: moment().toISOString()
};

return applicantInfo