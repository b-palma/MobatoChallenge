$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$reportPath = Join-Path (Split-Path -Parent $scriptDir) "reports\report.html"

if (-not (Test-Path $reportPath)) {
  throw "Relatório não encontrado. Rode .\scripts\run-tests.ps1 primeiro."
}

Start-Process $reportPath
