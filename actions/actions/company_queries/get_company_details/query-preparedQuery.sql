WITH contacts AS (
	SELECT contact_id, detail_id, contact_type_id, contact_name, title, phone, secondary_phone, email, is_primary, prefers_paper, receives_email, can_login, ROW_NUMBER() OVER (PARTITION BY detail_id ORDER BY detail_id ASC, is_primary DESC) AS contact_num
	FROM company_contact
	WHERE deactivated_date IS NULL
)

SELECT
	c.name,
	d.detail_id, d.company_type, d.license_number, d.license_start_date, d.license_created_date, d.license_expiration_date,
	cc.contact_id, cc.contact_name, cc.title, cc.contact_type_id, cc.phone, cc.secondary_phone, cc.email, cc.prefers_paper, cc.is_primary, cc.receives_email, cc.can_login,
	p.name as program
FROM company c
JOIN company_detail d
	ON c.company_id = d.company_id
JOIN program p
	ON d.program_id = p.program_id
LEFT JOIN (
	SELECT *
	FROM contacts
	WHERE contact_num = 1
) AS cc
	ON cc.detail_id = d.detail_id
WHERE
	d.detail_id = ?;