@echo off
echo Atualizando repositorio...
git pull
echo Instalando dependencias...
call npm install
echo Iniciando aplicacao...
cls
call runner.bat
```
