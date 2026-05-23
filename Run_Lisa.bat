@echo off
title Lisa Dashboard Server
cd /d "%~dp0lisa"
echo Starting Lisa Dashboard...
echo Opening browser at http://localhost:3000 ...
start http://localhost:3000
npm run dev
pause
