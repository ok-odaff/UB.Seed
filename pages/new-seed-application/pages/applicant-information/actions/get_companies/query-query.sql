SELECT c.company_id, c.name
FROM company c
GROUP BY
	c.company_id,
  c.name
ORDER BY
	c.name ASC;