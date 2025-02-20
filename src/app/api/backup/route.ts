import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs/promises';
import dotenv from 'dotenv';

dotenv.config();

export async function GET(req: NextRequest) {
  try {
    console.log('📢 Starting database backup...');
    const backupDirectory = path.join(process.cwd(), 'backups');
    await fs.mkdir(backupDirectory, { recursive: true });

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(backupDirectory, `CRIS_BACKUP_DATA-${timestamp}.sql`);

    const { PG_DATABASE, PG_USER, PG_PASSWORD, PG_HOST, PG_PORT } = process.env;

    if (!PG_DATABASE || !PG_USER || !PG_PASSWORD || !PG_HOST || !PG_PORT) {
      console.error('❌ Missing required environment variables!');
      return NextResponse.json({ error: 'Missing required database environment variables' }, { status: 500 });
    }

    console.log('🔹 Database:', PG_DATABASE);
    console.log('🔹 User:', PG_USER);
    console.log('🔹 Host:', PG_HOST);
    console.log('🔹 Port:', PG_PORT);
    console.log('🔹 Backup file path:', backupFile);

    const pgDumpCommand = 'pg_dump';
    const args = [
      '-U', PG_USER,
      '-h', PG_HOST,
      '-p', PG_PORT,
      '-d', PG_DATABASE,
      '-F', 'p',
    ];

    console.log('📢 Running command:', pgDumpCommand, args.join(' '));

    const backupProcess = spawn(pgDumpCommand, args, {
      env: { ...process.env, PGPASSWORD: PG_PASSWORD },
      shell: true,
    });

    let backupData = '';
    backupProcess.stdout.on('data', (chunk) => (backupData += chunk.toString()));
    backupProcess.stderr.on('data', (chunk) => console.error('⚠️ pg_dump stderr:', chunk.toString()));

    return new Promise((resolve) => {
      backupProcess.on('close', async (code) => {
        if (code === 0) {
          await fs.writeFile(backupFile, backupData);
          console.log(`✅ Backup created successfully at: ${backupFile}`);
          resolve(
            new NextResponse(backupData, {
              headers: {
                'Content-Type': 'application/octet-stream',
                'Content-Disposition': `attachment; filename=backup-${timestamp}.sql`,
              },
            })
          );
        } else {
          console.error('❌ Backup process failed with exit code:', code);
          resolve(NextResponse.json({ error: `Backup process failed with exit code ${code}` }, { status: 500 }));
        }
      });
    });
  } catch (error: any) {
    console.error('❌ Backup failed with error:', error.message || error);
    return NextResponse.json({ error: `Backup failed: ${error.message || error}` }, { status: 500 });
  }
}