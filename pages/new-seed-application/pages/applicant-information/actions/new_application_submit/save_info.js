

let applicantInfo = {
company_name: ui.AI_CompanyName.value,
headquarters: ui.AI_Headquarters.value != 0 ? ui.AI_Headquarters.value : null,
program_id: {{PROGRAM}},
license_type: state.license_type,
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