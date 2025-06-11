DECLARE @sql NVARCHAR(MAX);
DECLARE @local_vars NVARCHAR(MAX);

BEGIN TRANSACTION;
BEGIN TRY
	SET @sql = {{data.query}};
  SET @local_vars = {{data.local_vars}};
  
EXEC sp_executesql @sql;

COMMIT TRANSACTION;
END TRY
BEGIN CATCH
	THROW
  ROLLBACK TRANSACTION;
END CATCH;