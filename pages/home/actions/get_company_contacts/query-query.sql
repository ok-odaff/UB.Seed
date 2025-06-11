SELECT *
FROM company_contact
WHERE
	detail_id = {{state.passed_params.detail_id}};