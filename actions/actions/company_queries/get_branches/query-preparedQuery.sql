select 
c.company_id, c.name,
cd.detail_id, cd.license_number, cd.paid_by_headquarter_license, cd.paid_by_headquarter_tonnage, cd.license_payment_made
from company c
left join company_detail cd
on c.company_id = cd.company_id
where c.headquarter_id = ?
or c.company_id = ?