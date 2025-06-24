@echo off
echo 🏁 F1-Penca - Setting up development environment 🏁
echo.

echo 🔄 Syncing database schema...
call npx prisma db push

echo.
echo 📊 Loading test data...
call npx tsx ./scripts/setup-dev.js

echo.
echo 🎉 Development environment ready! 🎉
echo.
