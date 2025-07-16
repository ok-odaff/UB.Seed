let address_differences;
let address_updates = [],
  address_changes = [];
let address_changes_object = {};

let ADDRESS_UPDATE_SQL;

if ({{state.company_address_mailing}}) {
  address_differences = findObjectDifferences({{state.company_address_mailing}}, {{state.new_mailing_address}});

  for (const [key, value] of Object.entries(address_differences)) {
    address_changes_object[key] = value.to;
    address_changes_object['previous_' + key] = value.from;
    address_updates.push(`${key} = @${key}`);
    address_changes.push(`(@company_id, @program_id, @detail_id, 'UPDATE', @address_id, 'company_address', '${key}', @previous_${key}, @${key}, @created_by, @created_date, 1, 'AUTO')`);

    ADDRESS_UPDATE_SQL = `
	UPDATE company_address SET ${address_updates.join(', ')} WHERE address_id = @address_id;

  INSERT INTO change_history(company_id, program_id, detail_id, action_type, associated_table_id, modified_table, modified_column, previous_value, new_value, modified_by, modified_date, accepted, reviewed_by) VALUES${address_changes.join(
    ', '
  )};
`;
  }
} else {
  address_changes_object = {{state.new_mailing_address}};  
    ADDRESS_UPDATE_SQL = `
    DECLARE @outputTable TABLE (address_id INT);
    DECLARE @output_address_id INT;
    
	INSERT INTO company_address (detail_id, address_type_id, address, address_line_2, city, state, zip_code, county_id, created_by)
  OUTPUT INSERTED.address_id INTO @outputTable(address_id)
  values(@detail_id, 2, @address, @address_line_2, @city, @state, @zip_code, @county_id, @created_by);
  
  SELECT @output_address_id = address_id
  FPOM @outputTable

  INSERT INTO change_history(company_id, program_id, detail_id, action_type, associated_table_id, modified_table, modified_by, modified_date) VALUES(@company_id, @program_id, @detail_id, 'CREATE', @output_address_id, 'company_address', @created_by, @created_date)};
`;
  }

let contact_differences = findObjectDifferences({{state.primary_contact}}, {{state.new_primary_contact}});
let contact_updates = [],
  contact_changes = [];
let contact_changes_object = {};

let branches = {{state.branches}}.filter(licenses => licenses.paid_by_headquarter_license == true && licenses.license_payment_made == false);
let branches_updates = [];
if ({{state.company.exempt_from_license}} != 1) {
branches_updates.push({{state.login_information.detail_id}})
}
for (let branch of branches) {
  branches_updates.push(branch.detail_id)
}

const COMPANY_DETAIL_UPDATE_SQL = `
	UPDATE company_detail SET needs_review = @needs_review, license_payment_made = 1 WHERE detail_id in (${branches_updates.join(', ')}); 
`;

for (const [key, value] of Object.entries(contact_differences)) {
  contact_changes_object[key] = value.to;
  contact_changes_object['previous_' + key] = value.from;
  contact_updates.push(`${key} = @${key}`);
  contact_changes.push(`(@company_id, @program_id, @detail_id, 'UPDATE', @contact_id, 'company_contact', '${key}', @previous_${key}, @${key}, @created_by, @created_date, 1, 'AUTO')`);
}

const CONTACT_UPDATE_SQL = `
	UPDATE company_contact SET ${contact_updates.join(', ')} WHERE contact_id = @contact_id;

  INSERT INTO change_history(company_id, program_id, detail_id, action_type, associated_table_id, modified_table, modified_column, previous_value, new_value, modified_by, modified_date, accepted, reviewed_by) VALUES${contact_changes.join(
    ', '
  )};
`;

let payment_inserts = []
let payment_changes = []

if ({{state.company.exempt_from_license}} != true) {
payment_inserts.push(`(@detail_id, @payment_type_id, @braintree_id, @receipt_id, @speedtype_id, @fee, @late_fee, @processing_fee, null, @created_date, @created_date)`)
payment_changes.push(`(@company_id, @program_id, @detail_id, 'CREATE', @payment_id, 'payment_history', @created_by, @created_date, 1, 'AUTO')`)
}
for (let branch of branches) {
payment_inserts.push(`(${branch.detail_id}, @payment_type_id, @braintree_id, @receipt_id, @speedtype_id, @fee, @late_fee, @processing_fee, ${state.company.detail_id}, @created_date, @created_date)`)
payment_changes.push(`(${branch.company_id}, @program_id, ${branch.detail_id}, 'CREATE', @payment_id, 'payment_history', @created_by, @created_date, 1, 'AUTO')`)
}
const PAYMENT_HISTORY_SQL = `
   DECLARE @outputTable TABLE (payment_id INT);
    DECLARE @output_payment_id INT;

  INSERT INTO payment_history(detail_id, payment_type_id, braintree_id, receipt_id, speedtype_id, fee, late_fee, processing_fee, paid_by_detail_id, payment_date, created_date)
 VALUES ${payment_inserts.join(', ')} ;
 
INSERT INTO change_history(company_id, program_id, detail_id, action_type, associated_table_id, accepted)
SELECT
    cd.company_id,
    cd.program_id,
    cd.detail_id,
    'CREATE',
    o.payment_id,
    1
FROM @outputTable o
JOIN payment_history ph on o.payment_id = ph.payment_id
JOIN company_detail cd on ph.detail_id = cd.detail_id
 
`;   

actions.exec_query.trigger({
  query: `
    	${PAYMENT_HISTORY_SQL}
      ${COMPANY_DETAIL_UPDATE_SQL}
    	${address_updates.length > 0 ? ADDRESS_UPDATE_SQL : ''}
      ${contact_updates.length > 0 ? CONTACT_UPDATE_SQL : ''}
    `,
  local_vars: `
			@company_id int, @program_id int, @detail_id int, @address_id int, @address nvarchar(250), @address_line_2 nvarchar(250), @city nvarchar(100), @state nvarchar(2), @zip_code nvarchar(10), @zip_code_extended nvarchar(4), @county_id int, @created_by nvarchar(150),
      @previous_address nvarchar(250), @previous_address_line_2 nvarchar(250), @previous_city nvarchar(100), @previous_state nvarchar(2), @previous_zip_code nvarchar(10), @previous_zip_code_extended nvarchar(4), @previous_county_id int, @contact_id int, @contact_name nvarchar(150), @phone nvarchar(100), @email nvarchar(150), @previous_contact_name nvarchar(150), @previous_phone nvarchar(100), @previous_email nvarchar(150), @needs_review bit, @created_date datetime, @payment_type_id int, @braintree_id nvarchar(20), @receipt_id nvarchar(20), @speedtype_id int, @fee decimal(10,2), @late_fee decimal(10,2), @processing_fee decimal(10,2), @payment_date datetime, @approved bit, @reviewed_by nvarchar(150)
    `,
  company_id: {{state.company.company_id}},
  program_id: {{PROGRAM}},
  detail_id: {{state.company.detail_id}},
address_id: {{state.new_mailing_address.address_id}} ?? null,
  contact_id: {{state.new_primary_contact.contact_id}},
  needs_review: 0, //address_updates.length > 0 || contact_updates.length > 0 ? 1 : 0,
  created_date: moment(),
  created_by: {{state.login_information.email}} || {{user.email}} || 'error fetching email',
  payment_type_id: {{PAYMENT_TYPES['LICENSE_RENEWAL']}},
  braintree_id: {{data.braintree_id}},
  receipt_id: {{data.receipt_id}},
  speedtype_id: {{data.speedtype_id}},
  fee: {{data.license_fee}},
  late_fee: {{data.license_late_fee}},
  processing_fee: {{data.processing_fee}},
  ...address_changes_object,
  ...contact_changes_object,
});