let mailing_address = {

mailing_address: {{ui.AI_MailStreet.value}},
mailing_city: {{ui.AI_MailCity.value}},
mailing_state: {{ui.AI_MailState.value}},
mailing_zip: {{ui.AI_MailZip.value.toString()}},
mailing_county_id: {{ui.AI_MailCounty?.value}} || null,
mailing_created_by: {{user.email}},
mailing_address_type: 2
}
  return mailing_address