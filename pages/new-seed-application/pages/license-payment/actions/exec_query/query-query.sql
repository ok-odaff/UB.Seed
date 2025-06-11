DECLARE @sql NVARCHAR(MAX);
DECLARE @local_vars NVARCHAR(MAX);

BEGIN TRANSACTION;
BEGIN TRY
	SET @sql = {{data.query}};
  SET @local_vars = N'' + {{data.local_vars}};
  
  EXEC sp_executesql @sql,
  @local_vars,
  {{data.company_id}}, {{data.program_id}}, {{data.detail_id}}, {{data.address_id}}, {{data.address}}, {{data.address_line_2}}, {{data.city}}, {{data.state}}, {{data.zip_code}}, {{data.zip_code_extended}}, {{data.county_id}}, {{data.created_by}}, {{data.previous_address}}, {{data.previous_address_line_2}}, {{data.previous_city}}, {{data.previous_state}}, {{data.previous_zip_code}}, {{data.previous_zip_code_extended}}, {{data.previous_county_id}}, {{data.contact_id}}, {{data.contact_name}}, {{data.phone}}, {{data.email}}, {{data.previous_contact_name}}, {{data.previous_phone}}, {{data.previous_email}}, {{data.needs_review}}, {{data.created_date}}, {{data.payment_type_id}}, {{data.braintree_id}}, {{data.receipt_id}}, {{data.speedtype_id}}, {{data.fee}}, {{data.late_fee}}, {{data.processing_fee}}, {{data.payment_date}}, {{data.approved}}, {{data.reviewed_by}}, {{data.payment_made}};

COMMIT TRANSACTION;
END TRY
BEGIN CATCH