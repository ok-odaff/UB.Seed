let physicalAddress;
if ({{state.company_addresses.address_type_id == 1}}) {
  physicalAddress = {{state.company_addresses}}
}

{{ui.streetAddress.setValue(physicalAddress.address)}};
{{ui.addressLine2.setValue(physicalAddress.address_line_2)}};
{{ui.city.setValue(physicalAddress.city)}};
{{ui.state.setValue(physicalAddress.state)}};
{{ui.zip.setValue(physicalAddress.zip_code)}};