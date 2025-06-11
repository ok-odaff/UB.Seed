const isValid = ui.contactName.valid && ui.phone.valid && ui.email.valid;
if (!isValid) throw new Error('Missing contact information')
  
{{state.new_primary_contact.contact_name}} = {{ui.contactName.value}};
{{state.new_primary_contact.phone}} = {{ui.phone.value}};
{{state.new_primary_contact.email}} = {{ui.email.value}};