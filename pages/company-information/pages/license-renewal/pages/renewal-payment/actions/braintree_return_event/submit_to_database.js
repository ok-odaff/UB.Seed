const current_mailing_address = {{state.company_addresses}}.map();
const mail_address_differences = findObjectDifferences(current_mailing_address, {{state.new_mailing_address}});

let address_inserts = []
const address_changes = [];
const address_changes_object = {};

const contact_differences = findObjectDifferences({{state.primary_contact}}, {{state.new_primary_contact}});
const contact_updates = []
const contact_changes = [];
const contact_changes_object = {};

const PAYMENT_HISTORY_SQL = `
  INSERT INTO payment_history(detail_id, payment_type_id, braintree_id, receipt_id, speedtype_id, fee, late_fee, processing_fee, payment_date, created_date)
  VALUES(@detail_id, @payment_type_id, @braintree_id, @receipt_id, @speedtype_id, @fee, @late_fee, @processing_fee, @created_date, @created_date);
`;

const COMPANY_DETAIL_INSERT_SQL = `
	INSERT INTO company_detail(company_id, program_id, needs_review, payment_made, created_by, created_date)
  VALUES(@company_id, @program_id, @needs_review, @payment_made, @created_by, @created_date);
`;

// Insert mailing address
for (const [key, value] of Object.entries(mail_address_differences)) {
  address_changes_object[key] = value.to;
  address_changes_object['previous_' + key] = value.from;
  address_changes.push(`(@company_id, @program_id, @detail_id, '${CRUD.create}', @address_id, 'company_address', '${key}', @previous_${key}, @${key}, @created_by, @created_date, 1, 'AUTO')`);
}

const ADDRESS_INSERT_SQL = `
	INSERT INTO company_address(detail_id, address_type_id, address, address_line_2, city, state, zip_code, county_id, country, created_date, created_by)
  VALUES(@detail_id, @address_type_id, @address, @address_line_2, @city, @state, @zip_code, @county_id, @country, @created_date, @created_by)

  INSERT INTO change_history(company_id, program_id, detail_id, action_type, associated_table_id, modified_table, modified_column, previous_value, new_value, modified_by, modified_date, accepted, reviewed_by)
  VALUES${address_changes.join(',')};
`;

// Insert tonnage address

// Insert physical address

for (const [key, value] of Object.entries(contact_differences)) {
  contact_changes_object[key] = value.to;
  contact_changes_object['previous_' + key] = value.from;
  contact_updates.push(`${key} = @${key}`);
  contact_changes.push(`(@company_id, @program_id, @detail_id, '${CRUD.create}', @contact_id, 'company_address', '${key}', @previous_${key}, @${key}, @created_by, @created_date, 1, 'AUTO')`);
}

const CONTACT_INSERT_SQL = `
	UPDATE company_contact SET ${contact_updates.join(', ')} WHERE contact_id = @contact_id;

  INSERT INTO change_history(company_id, program_id, detail_id, action_type, associated_table_id, modified_table, modified_column, previous_value, new_value, modified_by, modified_date, accepted, reviewed_by)
  VALUES${contact_changes.join(',')};
`;

actions.exec_query.trigger({
  query: `
    	${PAYMENT_HISTORY_SQL}
      ${COMPANY_DETAIL_INSERT_SQL}
    	${address_inserts.length > 0 ? ADDRESS_INSERT_SQL : ''}
      ${contact_updates.length > 0 ? CONTACT_INSERT_SQL : ''}
    `,
  local_vars: `
			@company_id int, @program_id int, @detail_id int, @address_id int, @address nvarchar(250), @address_line_2 nvarchar(250), @city nvarchar(100), @state nvarchar(2), @zip_code nvarchar(10), @zip_code_extended nvarchar(4), @county_id int, @created_by nvarchar(150),
      @previous_address nvarchar(250), @previous_address_line_2 nvarchar(250), @previous_city nvarchar(100), @previous_state nvarchar(2), @previous_zip_code nvarchar(10), @previous_zip_code_extended nvarchar(4), @previous_county_id int, @contact_id int, @contact_name nvarchar(150), @phone nvarchar(100), @email nvarchar(150), @previous_contact_name nvarchar(150), @previous_phone nvarchar(100), @previous_email nvarchar(150), @needs_review bit, @created_date datetime, @payment_type_id int, @braintree_id nvarchar(20), @receipt_id nvarchar(20), @speedtype_id int, @fee decimal(10,2), @late_fee decimal(10,2), @processing_fee decimal(10,2), @payment_date datetime, @approved bit, @reviewed_by nvarchar(150), @payment_made BIT
    `,
  company_id: state.company_details.company_id, // fix
  program_id: state.company_details.program_id,
  detail_id: state.company_details.detail_id,
  address_id: state.new_mailing_address.address_id,
  contact_id: state.new_primary_contact.contact_id,
  needs_review: 1,
  created_date: moment().format("YYYY-MM-DDTHH:mm:ssZ"),
  created_by: {{state.login_information.email}} || {{user.email}} || 'error fetching email',
  payment_type_id: PAYMENT_TYPES['LICENSE_RENEWAL'],
  braintree_id: {{data.braintree_id}},
  receipt_id: {{data.receipt_id}},
  speedtype_id: {{data.speedtype_id}},
  fee: {{data.license_fee}},
  late_fee: {{data.license_late_fee}},
  processing_fee: {{data.processing_fee}},
  ...address_changes_object,
  ...contact_changes_object,
  approved: 0,
  reviewed_by: 'AUTO',
  payment_made: 1
});