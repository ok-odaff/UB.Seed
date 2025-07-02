{{state.company_address_mailing}} = {{state.company_addresses}}.find(a => a.address_type_id == 2);
let c = JSON.stringify({{state.company_address_mailing}});
{{state.new_mailing_address}} = JSON.parse(c);