@echo off
echo Atualizando repositorio...
git stash
git pull
echo Instalando dependencias...
call npm install
echo Iniciando aplicacao...
cls
call runner.bat
```
