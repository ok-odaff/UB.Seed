SELECT *
FROM company_contact
WHERE
	detail_id = {{state.login_information.detail_id}};