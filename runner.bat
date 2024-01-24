@echo off

echo Escolha uma opcao:
echo 1. Executar JotapeTools-CNPJ
echo.

set /p choice=

if /i "%choice%"=="1" (
    echo.
    echo Executando JotapeTools-CNPJ
    call npm run start:cnpj
) else (
    echo Opção inválida!
)

pause
```
