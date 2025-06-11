
const PAYMENT_HISTORY_SQL = `
  INSERT INTO payment_history(detail_id, payment_type_id, braintree_id, receipt_id, speedtype_id, fee, late_fee, processing_fee, payment_date, created_date)
  VALUES(@detail_id, @payment_type_id, @braintree_id, @receipt_id, @speedtype_id, @fee, @late_fee, @processing_fee, @created_date, @created_date);
`;

const COMPANY_DETAIL_UPDATE_SQL = ` 
DECLARE @outputTable TABLE (company_id INT, detail_id INT);
DECLARE @output_company_id INT;
DECLARE @output_detail_id INT;
DECLARE @created_by NVARCHAR(MAX);


INSERT INTO company (name, headquarter_id, created_date)

OUTPUT INSERTED.company_id INTO @outputTable(company_id)
VALUES ('${applicant_info.company_name}', ${applicant_info.headquarters == '' ? null : applicant_info.headquarters}, '${applicant_info.current_date}')

SELECT @output_company_id = company_id
FROM @outputTable;

DELETE FROM @outputTable;


INSERT INTO company_detail(company_id, program_id, needs_review, created_by, created_date)
OUTPUT INSERTED.detail_id INTO @outputTable(detail_id)
VALUES(@output_company_id, ${applicant_info.program_id}, 1, '${user.email}', '${applicant_info.current_date}')

SELECT @output_detail_id = detail_id 
FROM @outputTable; 

INSERT INTO seed (detail_id, is_retail, is_wholesale, is_medical_marijuana)
VALUES (@output_detail_id, ${applicant_info.business_type[0]}, ${applicant_info.business_type[1]}, ${applicant_info.business_type[2]})`

const ADDRESS_UPDATE_SQL = `INSERT INTO company_address (detail_id, address_type_id, address, city, state, zip_code, county_id, created_date, created_by)
VALUES 
(${applicant_info.addresses.primaryAddress}),
(${applicant_info.addresses.secondaryAddress})

INSERT INTO change_history(company_id, program_id, detail_id, action_type, associated_table_id, modified_table, modified_column, previous_value, new_value, modified_by, modified_date, accepted, reviewed_by) VALUES${applicant_info.addresses.primaryAddress},
  ${applicant_info.addresses.secondaryAddress}`

const CONTACT_UPDATE_SQL = `INSERT INTO company_contact (detail_id, contact_type_id, contact_name, phone, email, prefers_paper, is_primary, can_login, receives_email, created_date)
VALUES (@output_detail_id, 1, '${applicantInfo.contact_name}', '${applicantInfo.contact_phone}', '${applicantInfo.contact_email}', ${Number(applicant_info.prefers_paper)}, 1, 1, 1, '${applicant_info.current_date}')

  INSERT INTO change_history(company_id, program_id, detail_id, action_type, associated_table_id, modified_table, modified_column, previous_value, new_value, modified_by, modified_date, accepted, reviewed_by) VALUES${applicant_info.contact}`


actions.exec_query.trigger({
  query: `
    	${PAYMENT_HISTORY_SQL}
      ${COMPANY_DETAIL_UPDATE_SQL}
    	${ADDRESS_UPDATE_SQL}
      ${CONTACT_UPDATE_SQL}
    `,
  local_vars: `
			@company_id int, @program_id int, @detail_id int, @address_id int, @address nvarchar(250), @address_line_2 nvarchar(250), @city nvarchar(100), @state nvarchar(2), @zip_code nvarchar(10), @zip_code_extended nvarchar(4), @county_id int, @created_by nvarchar(150),
      @previous_address nvarchar(250), @previous_address_line_2 nvarchar(250), @previous_city nvarchar(100), @previous_state nvarchar(2), @previous_zip_code nvarchar(10), @previous_zip_code_extended nvarchar(4), @previous_county_id int, @contact_id int, @contact_name nvarchar(150), @phone nvarchar(100), @email nvarchar(150), @previous_contact_name nvarchar(150), @previous_phone nvarchar(100), @previous_email nvarchar(150), @needs_review bit, @created_date datetime, @payment_type_id int, @braintree_id nvarchar(20), @receipt_id nvarchar(20), @speedtype_id int, @fee decimal(10,2), @late_fee decimal(10,2), @processing_fee decimal(10,2), @payment_date datetime, @approved bit, @reviewed_by nvarchar(150)
    `,
  applicant_info: {{state.applicant_info}},
  program_id: {{PROGRAM}},
  needs_review: 0, //address_updates.length > 0 || contact_updates.length > 0 ? 1 : 0,
  created_date: moment(),
  created_by: {{state.login_information.email}} || {{user.email}} || 'error fetching email',
  payment_type_id: PAYMENT_TYPES['LICENSE_REGISTRATION'],
  braintree_id: {{data.braintree_id}},
  receipt_id: {{data.receipt_id}},
  speedtype_id: {{LICENSE_SPEEDTYPE}},
  fee: {{data.license_fee}},
  late_fee: {{data.license_late_fee}},
  processing_fee: {{data.processing_fee}},
  ...addresses, 
  ...contact_changes_object,
  approved: 1,
  reviewed_by: 'AUTO',
});