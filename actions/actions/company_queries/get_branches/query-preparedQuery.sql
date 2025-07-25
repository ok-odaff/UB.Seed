select 
c.company_id, c.name, c.headquarter_id,
cd.detail_id, cd.program_id,  cd.license_number, cd.license_expiration_date, cd.paid_by_headquarter_license, cd.paid_by_headquarter_tonnage, cd.license_payment_made, cd.company_type, cd.tonnage_payment_made, 
s.should_report_poundage, s.exempt_from_license
from company c
left join company_detail cd
on c.company_id = cd.company_id
left join seed s
on s.detail_id = cd.detail_id
where cd.deactivated_date is null
and license_expiration_date < CURRENT_TIMESTAMP
and program_id = ?
and (c.headquarter_id = ?
or c.company_id = ?)