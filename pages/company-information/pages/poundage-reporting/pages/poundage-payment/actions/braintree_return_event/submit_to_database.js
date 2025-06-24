const reportInserts = [];
const changeInserts = [];

const company_type = {{state.company.company_type}};


// Payment history
const PAYMENT_HISTORY_SQL = `
	DECLARE @outputTable TABLE (payment_id INT);
  DECLARE @INSERTED_ID INT;
  
  INSERT INTO payment_history(detail_id, payment_type_id, braintree_id, receipt_id, speedtype_id, fee, late_fee, processing_fee, payment_date, created_date)
  OUTPUT INSERTED.payment_id INTO @outputTable(payment_id)
  VALUES(@detail_id, @payment_type_id, @braintree_id, @receipt_id, @speedtype_id, @fee, @late_fee, @processing_fee, @payment_date, @created_date);
`;

// Detail sql
const DETAIL_SQL = `
	UPDATE company_detail
  SET tonnage_payment_made = 1
  WHERE detail_id = @detail_id;
`;

// Tonnage reports
const poundageReports = {{state.seed_poundage}};
for (let report of poundageReports) {
   let fiscal_year = report.fiscal_year;
    let fiscal_quarter = report.fiscal_quarter;
	if (report.seed_types.length > 0) {
    for (let seed_type of report.seed_types) {
    	reportInserts.push(`(@detail_id, '${company_type}', '${seed_type.category}', ${seed_type.pounds}, ${fiscal_year}, ${fiscal_quarter},  @INSERTED_ID, @created_date, @created_by)`);
    }
    }
  }
  

const SEED_POUNDAGE_SQL = `
	SELECT @INSERTED_ID = payment_id
  FROM @outputTable;

	INSERT INTO seed_poundage(detail_id, company_type, category, pounds, fiscal_year, fiscal_quarter, payment_id, created_date, created_by)
  VALUES
  	${reportInserts.join(',')}
`;

// Change history
const CHANGES_SQL = `
	INSERT INTO change_history(company_id, program_id, detail_id, action_type, associated_table_id, modified_table, modified_by, modified_date)
  VALUES
  	(@company_id, @program_id, @detail_id, 'CREATE', @output_payment_id, 'payment_history', '${user.email}', @created_date);
`;

// Execute query
  {{actions.exec_query}}.trigger({
  query: `
    	${PAYMENT_HISTORY_SQL}
      ${reportInserts.length > 0 ? SEED_POUNDAGE_SQL : ''}
      ${DETAIL_SQL}
     	${changeInserts.length > 0 ? CHANGES_SQL : ''}`,
  local_vars: `
  	@detail_id INT, @payment_type_id INT, @created_date DATETIME, @braintree_id NVARCHAR(20), @receipt_id NVARCHAR(20), @speedtype_id INT, @fee DECIMAL(10,2), @late_fee DECIMAL(10,2), @processing_fee DECIMAL(10,2), @needs_review BIT, @payment_date DATETIME, @created_by NVARCHAR(150), @reviewed_by NVARCHAR(150), @program_id INT, @company_id INT`,
    
  braintree_id: data.braintree_id,
  program_id: {{PROGRAM}},
  created_by: state.login_information.email || user.email || 'error fetching email',
  created_date: moment(),
  detail_id: state.company.detail_id,
  company_id: state.company.company_id,
  fee: Number(data.poundage_fee),
  late_fee: Number(data.poundage_late_fee),
  needs_review: 1,
  payment_date: moment(),
  payment_type_id: PAYMENT_TYPES.TONNAGE,
  processing_fee: Number(data.processing_fee),
  receipt_id: data.receipt_id,
  reviewed_by: null,
  speedtype_id: data.speedtype_id
});