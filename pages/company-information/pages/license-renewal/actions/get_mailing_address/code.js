let mailingAddress;
for (let i = 0; i < {{state.company_addresses.length}}; I ++){
  if ({{state.company_addresses[i].address_type == 2}}) {
    mailingAddress = {{state.company_addresses[i]}}
  }
  }
    return mailingAddress