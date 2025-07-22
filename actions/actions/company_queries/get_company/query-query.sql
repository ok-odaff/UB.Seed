select DISTINCT
c.name, c.headquarter_id, c.company_id,
cd.company_type, cd.license_number, cd.license_expiration_date, cd.license_payment_made, cd.tonnage_payment_made, cd.detail_id, cd.waive_license_late_fee, cd.waive_tonnage_late_fee, cd.deactivated_date,
s.exempt_from_license, s.should_report_poundage

from company c 
left join company_detail cd
on c.company_id = cd.company_id
left join company_contact cc
on cd.detail_id = cc.detail_id
left join seed s
on s.detail_id = cd.detail_id

where cd.detail_id = {{state.login_information.detail_id}}