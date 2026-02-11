# PerformaceFit+ - Script de Instalação Automática (PowerShell)
# Execute este script para instalar e rodar o projeto automaticamente

Write-Host "================================" -ForegroundColor Cyan
Write-Host "PerformaceFit+ - Setup Automático" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se Node.js está instalado
Write-Host "✓ Verificando Node.js..." -ForegroundColor Yellow
$nodeVersion = node --version 2>$null
if ($null -eq $nodeVersion) {
    Write-Host "✗ Node.js não está instalado!" -ForegroundColor Red
    Write-Host "  Baixe em: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}
Write-Host "  Versão: $nodeVersion" -ForegroundColor Green

# Instalar pnpm globalmente
Write-Host ""
Write-Host "✓ Instalando pnpm..." -ForegroundColor Yellow
npm install -g pnpm 2>$null
$pnpmVersion = pnpm --version 2>$null
Write-Host "  Versão: $pnpmVersion" -ForegroundColor Green

# Instalar dependências
Write-Host ""
Write-Host "✓ Instalando dependências do projeto..." -ForegroundColor Yellow
Write-Host "  (Isso pode levar alguns minutos...)" -ForegroundColor Gray
pnpm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Erro ao instalar dependências!" -ForegroundColor Red
    exit 1
}
Write-Host "  ✓ Dependências instaladas com sucesso!" -ForegroundColor Green

# Configurar banco de dados
Write-Host ""
Write-Host "✓ Configurando banco de dados..." -ForegroundColor Yellow
pnpm db:push

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠ Aviso: Banco de dados pode não estar totalmente configurado" -ForegroundColor Yellow
}

# Resumo final
Write-Host ""
Write-Host "================================" -ForegroundColor Green
Write-Host "✓ Setup Concluído com Sucesso!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""
Write-Host "Próximos passos:" -ForegroundColor Cyan
Write-Host "  1. Execute: pnpm dev" -ForegroundColor White
Write-Host "  2. Abra: http://localhost:3000" -ForegroundColor White
Write-Host "  3. Painel Admin: http://localhost:3000/admin/login" -ForegroundColor White
Write-Host "  4. Credenciais: matheus / 1926" -ForegroundColor White
Write-Host ""
Write-Host "Quer iniciar o servidor agora? (S/N)" -ForegroundColor Yellow
$response = Read-Host

if ($response -eq "S" -or $response -eq "s") {
    Write-Host ""
    Write-Host "🚀 Iniciando servidor..." -ForegroundColor Green
    Write-Host "   Acesse: http://localhost:3000" -ForegroundColor Cyan
    Write-Host ""
    pnpm dev
} else {
    Write-Host ""
    Write-Host "Para iniciar depois, execute: pnpm dev" -ForegroundColor Yellow
}
