const isValid = ui.streetAddress.valid && ui.city.valid && ui.state.valid && ui.zip.valid;
if (!isValid) throw new Error('Missing address information')

{{state.new_mailing_address.address}} = {{ui.streetAddress.value}};
{{state.new_mailing_address.address_line_2}} = {{ui.addressLine2.value}};
{{state.new_mailing_address.city}} = {{ui.city.value}};
{{state.new_mailing_address.state}} = {{ui.state.value}};
{{state.new_mailing_address.zip_code}} = {{ui.zip.value}};