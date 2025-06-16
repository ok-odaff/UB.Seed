const applicant_info = {{state.applicant_info}};

const COMPANY_DETAIL_UPDATE_SQL = ` 
  DECLARE @outputTable TABLE (company_id INT, detail_id INT, payment_id INT, seed_id INT, address_id INT, contact_id INT);
  DECLARE @output_company_id INT;
  DECLARE @output_detail_id INT;
  DECLARE @output_payment_id INT;
  DECLARE @output_seed_id INT;
  DECLARE @output_address_id INT;
  DECLARE @output_contact_id INT;


	INSERT INTO company (name, headquarter_id, created_date)
	OUTPUT INSERTED.company_id INTO @outputTable(company_id)
	VALUES ('${applicant_info.company_name}', ${applicant_info.headquarters}, '${applicant_info.current_date}');

  SELECT @output_company_id = company_id
  FROM @outputTable;

	DELETE FROM @outputTable;


  INSERT INTO company_detail(company_id, program_id, needs_review, license_payment_made, created_by, created_date)
  OUTPUT INSERTED.detail_id INTO @outputTable(detail_id)
  VALUES(@output_company_id, ${PROGRAM}, 1, 1, '${user.email}', '${applicant_info.current_date}');

  SELECT @output_detail_id = detail_id 
  FROM @outputTable; 

	DELETE FROM @outputTable;

  INSERT INTO seed (detail_id, is_retail, is_wholesale, is_medical_marijuana)
  OUTPUT INSERTED.seed_id INTO @outputTable(seed_id)
  VALUES (@output_detail_id, ${applicant_info.license_type[0]}, ${applicant_info.license_type[1]}, ${applicant_info.license_type[2]});

  SELECT @output_seed_id = seed_id
  FROM @outputTable;

  DELETE FROM @outputTable;
`;

const ADDRESS_UPDATE_SQL = `INSERT INTO company_address (detail_id, address_type_id, address, city, state, zip_code, county_id, created_date, created_by)
OUTPUT INSERTED.address_id INTO @outputTable(address_id)
VALUES 
(@output_detail_id, @primary_address_type, @primary_address, @primary_city, @primary_state, @primary_zip, @primary_county_id, '${applicant_info.current_date}', '${user.email}'),
(@output_detail_id, @mailing_address_type, @mailing_address, @mailing_city, @mailing_state, @mailing_zip, @mailing_county_id, '${applicant_info.current_date}', '${user.email}');

SELECT @output_address_id = address_id
FROM @outputTable;

DELETE FROM @outputTable;`

const CONTACT_UPDATE_SQL = `INSERT INTO company_contact (detail_id, contact_type_id, contact_name, phone, email, prefers_paper, is_primary, can_login, receives_email, created_date)
OUTPUT INSERTED.contact_id INTO @outputTable(contact_id)
VALUES (@output_detail_id, 1, '${applicant_info.contact_name}', '${applicant_info.contact_phone}', '${applicant_info.contact_email}', ${Number(applicant_info.prefers_paper)}, 1, 1, 1, '${applicant_info.current_date}');

SELECT @output_contact_id = contact_id
FROM @outputTable;

DELETE FROM @outputTable;`

const PAYMENT_HISTORY_SQL = `
  INSERT INTO payment_history(detail_id, payment_type_id, braintree_id, receipt_id, speedtype_id, fee, late_fee, processing_fee, payment_date, created_date)
  OUTPUT INSERTED.payment_id INTO @outputTable(payment_id)
  VALUES(@output_detail_id, @payment_type_id, @braintree_id, @receipt_id, @speedtype_id, @fee, @late_fee, @processing_fee, @created_date, @created_date);
`

const CHANGE_HISTORY_SQL = `
INSERT INTO change_history(company_id, program_id, detail_id, action_type, associated_table_id, modified_table) 
VALUES(@output_company_id, ${PROGRAM}, @output_detail_id, 'CREATE', @output_company_id, 'company'),
(@output_company_id, ${PROGRAM}, @output_detail_id, 'CREATE', @output_detail_id, 'company_detail'),
(@output_company_id, ${PROGRAM}, @output_detail_id, 'CREATE', @output_seed_id, 'seed'),
(@output_company_id, ${PROGRAM}, @output_detail_id, 'CREATE', @output_address_id, 'company_address'),
(@output_company_id, ${PROGRAM}, @output_detail_id, 'CREATE', @output_contact_id, 'company_contact'),
(@output_company_id, ${PROGRAM}, @output_detail_id, 'CREATE', @output_payment_id, 'payment_history');`


await actions.exec_query.trigger({

  query: `
      ${COMPANY_DETAIL_UPDATE_SQL}
    	${ADDRESS_UPDATE_SQL}
      ${CONTACT_UPDATE_SQL}
    	${PAYMENT_HISTORY_SQL}
      ${CHANGE_HISTORY_SQL}
    `,
  
  local_vars: `
			 @name NVARCHAR(250), @headquarter_id INT, @current_date DATETIME, @created_date DATETIME, @program_id INT, @created_by NVARCHAR(150), @is_retail BIT, @is_wholesale BIT, @is_medical_marijuana BIT, @contact_name nvarchar(150), @phone nvarchar(100), @email nvarchar(150), @prefers_paper BIT, @payment_type_id INT, @braintree_id nvarchar(20), @receipt_id nvarchar(20), @speedtype_id int, @fee decimal(10,2), @late_fee decimal(10,2), @processing_fee decimal(10,2), @payment_date datetime, @primary_address nvarchar(250), @primary_city nvarchar(250), @primary_state nvarchar(2), @primary_county_id int, @primary_zip nvarchar(10), @primary_address_type int, @mailing_address nvarchar(250), @mailing_city nvarchar(250), @mailing_state nvarchar(2), @mailing_county_id int, @mailing_zip nvarchar(10), @mailing_address_type int
    `,
  company_name: {{state.applicant_info.company_name}},
  headquarters: {{state.applicant_info.headquarters}} != 0 ? {{state.applicant_info.headquarters}} : null,
  current_date: moment(),
  program_id: {{PROGRAM}},
  is_retail: {{state.license_type[0]}},
  is_wholesale: {{state.license_type[1]}},
  is_medical_marijuana: {{state.license_type[2]}},
  primary_address: {{state.company_address_physical.primary_address}},
  primary_city: {{state.company_address_physical.primary_city}},
  primary_state: {{state.company_address_physical.primary_state}},
  primary_county_id: {{state.company_address_physical.primary_county_id}},
  primary_zip: {{state.company_address_physical.primary_zip}},
  primary_address_type: {{state.company_address_physical.primary_address_type}},
  mailing_address: {{state.company_address_mailing.mailing_address}},
  mailing_city: {{state.company_address_mailing.mailing_city}},
  mailing_state: {{state.company_address_mailing.mailing_state}},
  mailing_county_id: {{state.company_address_mailing.mailing_county_id}},
  mailing_zip: {{state.company_address_mailing.mailing_zip}},
  mailing_address_type: {{state.company_address_mailing.mailing_address_type}},
  contact_name: {{state.applicant_info.contact_name}},
  contact_phone: {{state.applicant_info.contact_phone}},
  contact_email: {{state.applicant_info.contact_email}},
  prefers_paper: {{state.applicant_info.prefers_paper}},
  is_primary: 1,
  can_login: 1,
  recieves_email: 1,
  needs_review: 0, //address_updates.length > 0 || contact_updates.length > 0 ? 1 : 0,
  created_date: moment(),
  created_by: {{state.login_information.email}} || {{user.email}} || 'error fetching email',
  payment_type_id: PAYMENT_TYPES['LICENSE_REGISTRATION'],
  //testing//
    braintree_id: "jhdvmcc7",
  receipt_id: "BT00001634",
  speedtype_id: {{LICENSE_SPEEDTYPE}},
  fee: {{state.fees.license_fee}},
  late_fee: {{state.fees.license_late_fee}},
  processing_fee: 0,// Number({{data.processing_fee}}),
  reviewed_by: 'AUTO',
  license_payment_made: 1
});