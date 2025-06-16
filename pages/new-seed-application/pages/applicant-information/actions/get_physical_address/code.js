let primary_address = {

primary_address: {{ui.AI_PrimaryStreet.value}},
primary_city: {{ui.AI_PrimaryCity.value}},
primary_state: {{ui.AI_PrimaryState.value}},
primary_zip: {{ui.AI_PrimaryZip.value.toString()}},
primary_county_id: {{ui.AI_PrimaryCounty?.value}} || null,
primary_created_by: {{user.email}},
primary_address_type: 1
}
  return primary_address