SELECT
	a.*,
	c.name AS county
FROM company_address a
LEFT JOIN county c
	ON c.county_id = a.county_id
WHERE a.detail_id = ?;