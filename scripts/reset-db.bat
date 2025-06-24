@echo off
echo Resetting F1-Penca Database...
echo.

REM Connect to default postgres database and drop/recreate f1penca
echo Dropping and recreating database...
psql -U postgres -c "DROP DATABASE IF EXISTS f1penca;"
psql -U postgres -c "CREATE DATABASE f1penca WITH OWNER postgres ENCODING 'UTF8';"

echo.
echo Database reset complete.
echo.
echo Now run: npx prisma migrate dev --name initial_schema
