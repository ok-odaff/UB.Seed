

let applicantInfo = {
company_name: ui.AI_CompanyName.value,
headquarters: ui.AI_Headquarters.value,
program_id: {{PROGRAM}},
business_type: state.license_type,
license_number: '',
addresses: state.addresses,
contact_name: ui.AI_ContactName.value,
contact_phone: ui.AI_ContactPhone.value,
contact_email: ui.AI_ContactEmail.value,
prefers_paper: ui.AI_PrefersPaper.value,
current_date: moment().toISOString()
};

return applicantInfo