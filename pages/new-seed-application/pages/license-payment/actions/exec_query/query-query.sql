DECLARE @sql NVARCHAR(MAX);
DECLARE @local_vars NVARCHAR(MAX);

BEGIN TRANSACTION;
BEGIN TRY
	SET @sql = {{data.query}};
  SET @local_vars = N'' + {{data.local_vars}};
  
  EXEC sp_executesql @sql,
  @local_vars,
 {{data.company_name}}, {{data.headquarter_id}},{{data.current_date}}, {{data.created_date}}, {{data.program_id}}, {{data.created_by}}, {{data.is_retail}}, {{data.is_wholesale}}, {{data.is_medical_marijuana}}, {{data.contact_name}}, {{data.contact_phone}}, {{data.contact_email}}, {{data.prefers_paper}}, {{data.is_primary}}, {{data.can_login}}, {{data.receives_email}}, {{data.payment_type_id}}, {{data.braintree_id}}, {{data.receipt_id}}, {{data.speedtype_id}},{{data.fee}}, {{data.late_fee}}, {{data.processing_fee}}, {{data.payment_date}},
 {{data.primary_address}}, {{data.primary_city}}, {{data.primary_state}}, {{data.primary_county_id}}, {{data.primary_zip}}, {{data.primary_address_type}}, {{data.mailing_address}}, {{data.mailing_city}}, {{data.mailing_state}}, {{data.mailing_county_id}}, {{data.mailing_zip}}, {{data.mailing_address_type}}, {{data.paid_by_headquarter_license}}, {{data.paid_by_headquarter_tonnage}}, {{data.license_payment_made}}, {{data.needs_review}};

COMMIT TRANSACTION;
END TRY
BEGIN CATCH
	THROW
	ROLLBACK TRANSACTION;
END CATCH;