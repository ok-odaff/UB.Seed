const address = {{data}}.find(a => a.address_type_id == 1);
const displayAddress = `${address.address}, ${address.city}, ${address.state} ${address.zip_code}${address.zip_code_extended ? '-' + address.zip_code_extended : ''}`;

return displayAddress