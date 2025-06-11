
let addresses = {
  primaryAddress: [],
	secondaryAddress: []
};

const date = moment().toISOString();


if (ui.AI_PrimaryStreet) {  
  addresses.primaryAddress = ['@output_detail_id','1', `'${ui.AI_PrimaryStreet.value}'`,`'${ui.AI_PrimaryCity.value}'`, `'${ui.AI_PrimaryState.value}'`, `'${ui.AI_PrimaryZip.value}'`, ui.AI_PrimaryCounty?.value || `''`, `'${date}'`, `'${user.email}'`];
}
if (ui.AI_MailStreet) {  
	addresses.secondaryAddress = ['@output_detail_id', '2', `'${ui.AI_MailStreet.value}'`, `'${ui.AI_MailCity.value}'`, `'${ui.AI_MailState.value}'`, `'${ui.AI_MailZip.value}'`, ui.AI_MailCounty?.value || `''`, `'${date}'`, `'${user.email}'`];
}

return addresses