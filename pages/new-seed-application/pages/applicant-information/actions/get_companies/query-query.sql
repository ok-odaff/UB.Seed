SELECT c.company_id, c.name, d.detail_id
FROM company c
left JOIN company_detail d
on c.company_id = d.company_id
GROUP BY
	c.company_id,
  c.name,
  d.detail_id
ORDER BY
	c.name ASC;