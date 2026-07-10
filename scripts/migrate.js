import sql from 'mssql'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const { AZURE_SQL_SERVER, AZURE_DATABASE, AZURE_SQL_USER, AZURE_SQL_PASSWORD } = process.env

if (!AZURE_SQL_SERVER || !AZURE_DATABASE || !AZURE_SQL_USER || !AZURE_SQL_PASSWORD) {
  console.error('Missing required environment variables: AZURE_SQL_SERVER, AZURE_DATABASE, AZURE_SQL_USER, AZURE_SQL_PASSWORD')
  process.exit(1)
}

const config = {
  server: AZURE_SQL_SERVER,
  database: AZURE_DATABASE,
  user: AZURE_SQL_USER,
  password: AZURE_SQL_PASSWORD,
  options: {
    encrypt: true,
    trustServerCertificate: false,
  },
}

const scriptPath = path.join(__dirname, 'data-collection-pro-script.sql')
const sqlScript = readFileSync(scriptPath, 'utf8')

// Split on GO statements (SQL Server batch separator)
const batches = sqlScript
  .split(/^\s*GO\s*$/im)
  .map(b => b.trim())
  .filter(b => b.length > 0)

console.log(`Connecting to ${AZURE_SQL_SERVER}/${AZURE_DATABASE}...`)

let pool
try {
  pool = await sql.connect(config)
  console.log('Connected. Running migration script...')

  for (let i = 0; i < batches.length; i++) {
    await pool.request().query(batches[i])
  }

  console.log(`Migration complete. ${batches.length} batches executed.`)
} catch (err) {
  console.error('Migration failed:', err.message)
  process.exit(1)
} finally {
  if (pool) await pool.close()
}
