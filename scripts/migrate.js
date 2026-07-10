import sql from 'mssql'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export async function runMigration() {
  const { AZURE_SQL_SERVER, AZURE_SQL_DATABASE, AZURE_SQL_USER, AZURE_SQL_PASSWORD } = process.env

  if (!AZURE_SQL_SERVER || !AZURE_SQL_DATABASE || !AZURE_SQL_USER || !AZURE_SQL_PASSWORD) {
    console.warn('DB env vars not set — skipping migration')
    return
  }

  const config = {
    server: AZURE_SQL_SERVER,
    port: parseInt(process.env.AZURE_SQL_PORT ?? '1433'),
    database: AZURE_SQL_DATABASE,
    user: AZURE_SQL_USER,
    password: AZURE_SQL_PASSWORD,
    options: {
      encrypt: true,
      trustServerCertificate: false,
    },
  }

  const scriptPath = path.join(__dirname, 'data-collection-pro-script.sql')
  const sqlScript = readFileSync(scriptPath, 'utf8')

  const batches = sqlScript
    .split(/^\s*GO\s*$/im)
    .map(b => b.trim())
    .filter(b => b.length > 0)

  console.log(`Running migration against ${AZURE_SQL_SERVER}/${AZURE_SQL_DATABASE}...`)

  const pool = await sql.connect(config)
  try {
    for (const batch of batches) {
      await pool.request().query(batch)
    }
    console.log(`Migration complete. ${batches.length} batches executed.`)
  } finally {
    await pool.close()
  }
}
