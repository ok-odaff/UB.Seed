select 
c.company_id, c.name, c.headquarter_id,
cd.detail_id, cd.program_id,  cd.license_number, cd.paid_by_headquarter_license, cd.paid_by_headquarter_tonnage, cd.license_payment_made, cd.tonnage_payment_made, 
s.should_report_poundage
from company c
left join company_detail cd
on c.company_id = cd.company_id
left join seed s
on s.detail_id = cd.detail_id
where c.headquarter_id = ?
or c.company_id = ?
and program_id = ?