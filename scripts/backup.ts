import { exec } from 'child_process'
import { promisify } from 'util'
import path from 'path'
import fs from 'fs/promises'
import dotenv from 'dotenv'

const execAsync = promisify(exec)
dotenv.config()

async function backupDatabase(): Promise<void> {
  try {
    const backupDirectory = path.join(__dirname, '../backups')
    await fs.mkdir(backupDirectory, { recursive: true })

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const backupFile = path.join(backupDirectory, `backup-${timestamp}.sql`)

    const { DB_DATABASE, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT } = process.env

    if (!DB_DATABASE || !DB_USER || !DB_PASSWORD || !DB_HOST || !DB_PORT) {
      throw new Error('Missing required database environment variables')
    }

    const isWindows = process.platform === 'win32'
    const pgDumpCommand = isWindows
      ? `$env:PGPASSWORD="${DB_PASSWORD}"; pg_dump -U ${DB_USER} -h ${DB_HOST} -p ${DB_PORT} -d ${DB_DATABASE} -F p`
      : `PGPASSWORD="${DB_PASSWORD}" pg_dump -U ${DB_USER} -h ${DB_HOST} -p ${DB_PORT} -d ${DB_DATABASE} -F p`

    console.log('Starting database backup...')

    const { stdout } = await execAsync(pgDumpCommand)
    await fs.writeFile(backupFile, stdout)

    console.log(`✅ Backup completed: ${backupFile}`)
  } catch (error) {
    console.error('❌ Backup failed:', error)
    process.exit(1)
  }
}

backupDatabase()
