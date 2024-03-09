SELECT [name] FROM sys.objects WHERE type = 'U' AND is_ms_shipped = 0
GO

SELECT sc.name 'name', st.Name 'type', sc.max_length 'size', sc.precision, sc.scale, sc.is_nullable, sm.text 'default', ISNULL(si.is_primary_key, 0) 'is_pkey', ic.key_ordinal
FROM  sys.columns sc
INNER JOIN sys.types st ON st.user_type_id = sc.user_type_id
LEFT JOIN sys.syscomments sm ON sm.id = sc.default_object_id
LEFT OUTER JOIN sys.index_columns ic ON ic.object_id = sc.object_id AND ic.column_id = sc.column_id
LEFT OUTER JOIN sys.indexes si ON ic.object_id = si.object_id AND ic.index_id = si.index_id
WHERE sc.object_id = OBJECT_ID('foo_widgets')
GO
