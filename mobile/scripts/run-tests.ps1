param(
  [string]$Tag = "",
  [string]$Flow = "",
  [ValidateSet("junit", "html", "all")]
  [string]$Report = "all"
)

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$mobileRoot = Split-Path -Parent $scriptDir
$envFiles = @(
  (Join-Path $mobileRoot "constants\variables.env"),
  (Join-Path $mobileRoot ".env")
)

$maestroArgs = @()

foreach ($file in $envFiles) {
  if (-not (Test-Path $file)) { continue }

  Get-Content $file | ForEach-Object {
    $line = $_.Trim()
    if ($line -eq "" -or $line.StartsWith("#")) { return }

    $parts = $line -split "=", 2
    if ($parts.Count -ne 2) { return }

    $key = $parts[0].Trim()
    $value = $parts[1].Trim()
    $maestroArgs += "-e"
    $maestroArgs += "${key}=${value}"
  }
}

$maestro = Get-Command maestro -ErrorAction SilentlyContinue
if (-not $maestro) {
  $localMaestro = Join-Path $env:USERPROFILE ".maestro\maestro\bin\maestro.bat"
  if (Test-Path $localMaestro) {
    $maestro = $localMaestro
  } else {
    throw "Maestro CLI não encontrado. Instale com: irm https://get.maestro.mobile.dev | iex"
  }
}

$reportsDir = Join-Path $mobileRoot "reports"
New-Item -ItemType Directory -Force -Path $reportsDir | Out-Null

function Invoke-MaestroTest {
  param(
    [string]$Format,
    [string]$OutputFile
  )

  $commandArgs = @("test", "--format", $Format, "--output", $OutputFile) + $maestroArgs

  if ($Tag -ne "") {
    $commandArgs += "--include-tags=$Tag"
  }

  if ($Flow -ne "") {
    $commandArgs += (Join-Path $mobileRoot "flows\$Flow")
  } else {
    $commandArgs += (Join-Path $mobileRoot "flows")
  }

  if ($maestro -is [System.Management.Automation.ApplicationInfo]) {
    & maestro @commandArgs
  } else {
    & $maestro @commandArgs
  }

  return $LASTEXITCODE
}

$exitCode = 0

if ($Report -eq "all" -or $Report -eq "junit") {
  Write-Host "Gerando relatório JUnit..."
  $code = Invoke-MaestroTest -Format "junit" -OutputFile (Join-Path $reportsDir "junit.xml")
  if ($code -ne 0) { $exitCode = $code }
}

if ($Report -eq "all" -or $Report -eq "html") {
  Write-Host "Gerando relatório HTML..."
  $code = Invoke-MaestroTest -Format "html-detailed" -OutputFile (Join-Path $reportsDir "report.html")
  if ($code -ne 0) { $exitCode = $code }
}

if ($Report -eq "all" -or $Report -eq "html") {
  Write-Host "Relatório HTML: $(Join-Path $reportsDir 'report.html')"
}

exit $exitCode
