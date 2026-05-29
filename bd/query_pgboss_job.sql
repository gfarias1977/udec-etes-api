  -- Ver qué tienen los jobs viejos
  SELECT id, name, state, data, output
  FROM pgboss.job
  WHERE name = 'gap-calculation'
  ORDER BY created_on DESC;

  -- Eliminar los jobs en estado failed/created con data nula (los viejos corruptos)
  DELETE FROM pgboss.job
  WHERE name = 'gap-calculation'
    AND state IN ('failed', 'created')
    AND data IS NULL;