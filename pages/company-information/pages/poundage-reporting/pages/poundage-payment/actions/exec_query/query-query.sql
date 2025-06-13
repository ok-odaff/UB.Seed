DECLARE @sql NVARCHAR(MAX);
DECLARE @local_vars NVARCHAR(MAX);

BEGIN TRANSACTION;
BEGIN TRY
	SET @sql = {{data.query}};
  SET @local_vars = N'' + {{data.local_vars}};
  
  EXEC sp_executesql @sql,
  @local_vars,
  {{data.detail_id}}, {{data.payment_type_id}}, {{data.created_date}}, {{data.braintree_id}}, {{data.receipt_id}}, {{data.speedtype_id}}, {{data.fee}}, {{data.late_fee}}, {{data.processing_fee}}, {{data.needs_review}}, {{data.payment_date}}, {{data.created_by}}, {{data.reviewed_by}},  {{data.program_id}}, {{data.company_id}};

COMMIT TRANSACTION;
END TRY
BEGIN CATCH
	THROW
  	ROLLBACK TRANSACTION;
END CATCH;