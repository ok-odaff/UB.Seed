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


  INSERT INTO company_detail(company_id, program_id, company_type, paid_by_headquarter_license, paid_by_headquarter_tonnage, needs_review, license_payment_made, created_by, created_date)
  OUTPUT INSERTED.detail_id INTO @outputTable(detail_id)
  VALUES(@output_company_id, ${PROGRAM}, @company_type, @paid_by_headquarter_license, @paid_by_headquarter_tonnage, @needs_review, @license_payment_made, @created_by, @created_date);

  SELECT @output_detail_id = detail_id 
  FROM @outputTable; 

	DELETE FROM @outputTable;

  INSERT INTO seed (detail_id, is_retail, is_wholesale, is_medical_marijuana)
  OUTPUT INSERTED.seed_id INTO @outputTable(seed_id)
  VALUES (@output_detail_id, @is_retail, @is_wholesale, @is_medical_marijuana);

  SELECT @output_seed_id = seed_id
  FROM @outputTable;

  DELETE FROM @outputTable;
`;

const ADDRESS_UPDATE_SQL = `INSERT INTO company_address (detail_id, address_type_id, address, city, state, zip_code, county_id, created_date, created_by)
OUTPUT INSERTED.address_id INTO @outputTable(address_id)
VALUES 
(@output_detail_id, @primary_address_type, @primary_address, @primary_city, @primary_state, @primary_zip, @primary_county_id, @created_date, @created_by),
(@output_detail_id, @mailing_address_type, @mailing_address, @mailing_city, @mailing_state, @mailing_zip, @mailing_county_id, @created_date, @created_by);

SELECT @output_address_id = address_id
FROM @outputTable;

DELETE FROM @outputTable;`

const CONTACT_UPDATE_SQL = `INSERT INTO company_contact (detail_id, contact_type_id, contact_name, phone, email, prefers_paper, is_primary, can_login, receives_email, created_date)
OUTPUT INSERTED.contact_id INTO @outputTable(contact_id)
VALUES (@output_detail_id, 1, @contact_name, @contact_phone, @contact_email, @prefers_paper, 1, 1, 1, @created_date);

SELECT @output_contact_id = contact_id
FROM @outputTable;

DELETE FROM @outputTable;`

const PAYMENT_HISTORY_SQL = `
  INSERT INTO payment_history(detail_id, payment_type_id, braintree_id, receipt_id, speedtype_id, fee, late_fee, processing_fee, paid_by_detail_id, payment_date, created_date)
  OUTPUT INSERTED.payment_id INTO @outputTable(payment_id)
  VALUES(@output_detail_id, @payment_type_id, @braintree_id, @receipt_id, @speedtype_id, @fee, @late_fee, @processing_fee, @paid_by_detail_id, @created_date, @created_date);
`

const CHANGE_HISTORY_SQL = `
INSERT INTO change_history(company_id, program_id, detail_id, action_type, associated_table_id, modified_table) 
VALUES(@output_company_id, @program_id, @output_detail_id, 'CREATE', @output_company_id, 'company'),
(@output_company_id, @program_id, @output_detail_id, 'CREATE', @output_detail_id, 'company_detail'),
(@output_company_id,@program_id, @output_detail_id, 'CREATE', @output_seed_id, 'seed'),
(@output_company_id, @program_id, @output_detail_id, 'CREATE', @output_address_id, 'company_address'),
(@output_company_id, @program_id, @output_detail_id, 'CREATE', @output_contact_id, 'company_contact'),
(@output_company_id, @program_id, @output_detail_id, 'CREATE', @output_payment_id, 'payment_history');`


await actions.exec_query.trigger({

  query: `
      ${COMPANY_DETAIL_UPDATE_SQL}
    	${ADDRESS_UPDATE_SQL}
      ${CONTACT_UPDATE_SQL}
    	${PAYMENT_HISTORY_SQL}
      ${CHANGE_HISTORY_SQL}
    `,
  
  local_vars: `
  	@braintree_id NVARCHAR(20),
    @can_login BIT,
    @company_type NVARCHAR(50),
    @contact_email NVARCHAR(150),
    @contact_name NVARCHAR(150),
    @contact_phone NVARCHAR(100),
    @created_by NVARCHAR(150),
    @created_date DATETIME,
    @current_date DATETIME,
    @fee DECIMAL(10,2),
    @headquarter_id INT,
    @is_medical_marijuana BIT,
    @is_primary BIT,
    @is_retail BIT,
    @is_wholesale BIT,
    @late_fee decimal(10,2),
    @license_payment_made BIT,
    @mailing_address NVARCHAR(250),
    @mailing_address_type INT,
    @mailing_city NVARCHAR(250),
    @mailing_county_id INT,
    @mailing_state NVARCHAR(2),
    @mailing_zip NVARCHAR(10),
    @name NVARCHAR(250),
    @needs_review BIT,
    @paid_by_detail_id INT,
    @paid_by_headquarter_license BIT,
    @paid_by_headquarter_tonnage BIT,
    @payment_date DATETIME,
    @payment_type_id INT,
    @prefers_paper BIT,
    @primary_address NVARCHAR(250),
    @primary_address_type INT,
    @primary_city NVARCHAR(250),
    @primary_county_id INT,
    @primary_state NVARCHAR(2),
    @primary_zip NVARCHAR(10),
    @processing_fee DECIMAL(10,2),
    @program_id INT,
    @receipt_id NVARCHAR(20),
    @receives_email BIT,
    @speedtype_id INT,
  `,
  braintree_id: {{data?.braintree_id}},
  can_login: 1,
  company_type: {{state.applicant_info.company_type}},
  contact_email: {{state.applicant_info.contact_email}},
  contact_name: {{state.applicant_info.contact_name}},
  contact_phone: {{state.applicant_info.contact_phone}},
  created_by: {{state.login_information.email}} || {{user.email}} || 'error fetching email',
  created_date: moment(),
  current_date: moment(),
  fee: {{state.fees.license_fee}},
  headquarter_id: {{state.applicant_info.headquarters}} != 0 ? {{state.applicant_info.headquarters}} : null,
  is_medical_marijuana: {{state.license_type[2]}},
  is_primary: 1,
  is_retail: {{state.license_type[0]}},
  is_wholesale: {{state.license_type[1]}},
  late_fee: {{state.fees.license_late_fee}},
  license_payment_made: 1,
  mailing_address: {{state.company_address_mailing.mailing_address}},
  mailing_address_type: {{state.company_address_mailing.mailing_address_type}},
  mailing_city: {{state.company_address_mailing.mailing_city}},
  mailing_county_id: {{state.company_address_mailing.mailing_county_id}},
  mailing_state: {{state.company_address_mailing.mailing_state}},
  mailing_zip: {{state.company_address_mailing.mailing_zip}},
  name: {{state.applicant_info.company_name}},
  needs_review: 1,
  paid_by_detail_id: {{state.applicant_info.headquarter_detail_id}} != null && {{state.applicant_info.paid_by_headquarter_license}} == true ? {{state.applicant_info.headquarter_detail_id}} : null,
  paid_by_headquarter_license: {{state.applicant_info.paid_by_headquarter_license}},
  paid_by_headquarter_tonnage: {{state.applicant_info.paid_by_headquarter_tonnage}},
  payment_date: moment(),
  payment_type_id: {{PAYMENT_TYPES['LICENSE_REGISTRATION']}},
  prefers_paper: {{state.applicant_info.prefers_paper}},
  primary_address: {{state.company_address_physical.primary_address}},
  primary_address_type: {{state.company_address_physical.primary_address_type}},
  primary_city: {{state.company_address_physical.primary_city}},
  primary_county_id: {{state.company_address_physical.primary_county_id}},
  primary_state: {{state.company_address_physical.primary_state}},
  primary_zip: {{state.company_address_physical.primary_zip}},
  processing_fee: 0,// Number({{data.processing_fee}}),
  program_id: {{PROGRAM}},
  receipt_id: {{data?.receipt_id}},
  recieves_email: 1,
  speedtype_id: {{LICENSE_SPEEDTYPE}}
});