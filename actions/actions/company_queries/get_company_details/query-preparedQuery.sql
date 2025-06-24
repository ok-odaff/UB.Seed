select 
c.name, c.headquarter_id,
cd.company_type, cd.license_number, 
ca.address, ca.address_type_id, ca.address_line_2, ca.city, ca.state, ca.zip_code,
cc.contact_name, cc.phone, cc.email

from company c 
left join company_detail cd
on c.company_id = cd.company_id
left join company_address ca
on cd.detail_id = ca.detail_id
left join company_contact cc
on ca.detail_id = cc.detail_id
left join stop_sales ss
on cc.detail_id = ss.detail_id

where cd.detail_id = ?