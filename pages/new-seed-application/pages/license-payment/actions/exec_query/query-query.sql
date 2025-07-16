DECLARE @sql NVARCHAR(MAX);
DECLARE @local_vars NVARCHAR(MAX);

BEGIN TRANSACTION;
BEGIN TRY
	SET @sql = {{data.query}};
  SET @local_vars = N'' + {{data.local_vars}};
  
  EXEC sp_executesql @sql,
  @local_vars,
  {{data.braintree_id}},
  {{data.can_login}},
  {{data.company_type}},
  {{data.contact_email}},
  {{data.contact_name}},
  {{data.contact_phone}},
  {{data.created_by}},
  {{data.created_date}},
  {{data.current_date}},
  {{data.fee}},
  {{data.headquarter_id}},
  {{data.is_medical_marijuana}},
  {{data.is_primary}},
  {{data.is_retail}},
  {{data.is_wholesale}},
  {{data.late_fee}},
  {{data.license_payment_made}},
  {{data.mailing_address}},
  {{data.mailing_address_type}},
  {{data.mailing_city}},
  {{data.mailing_county_id}},
  {{data.mailing_state}},
  {{data.mailing_zip}},
  {{data.name}},
  {{data.needs_review}},
  {{data.paid_by_detail_id}},
  {{data.paid_by_headquarter_license}},
  {{data.paid_by_headquarter_tonnage}},
  {{data.payment_date}},
  {{data.payment_type_id}},
  {{data.prefers_paper}},
  {{data.primary_address}},
  {{data.primary_address_type}},
  {{data.primary_city}},
  {{data.primary_county_id}},
  {{data.primary_state}},
  {{data.primary_zip}},
  {{data.processing_fee}},
  {{data.program_id}},
  {{data.receipt_id}},
  {{data.receives_email}},
  {{data.speedtype_id}}

COMMIT TRANSACTION;
END TRY
BEGIN CATCH
	THROW
	ROLLBACK TRANSACTION;
END CATCH;