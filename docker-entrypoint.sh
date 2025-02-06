#!/bin/sh

# Wait for the database to be ready
echo "Waiting for the database to be ready..."
until pg_isready -h db-container -p 5432 -U "${DB_USER}"; do
  sleep 2
done

# Push database schema
echo "Pushing Prisma schema to the database..."
npx prisma db push

# Apply migrations
echo "Applying migrations..."
npx prisma migrate dev

# Start the application
echo "Starting the application..."
pnpm dev