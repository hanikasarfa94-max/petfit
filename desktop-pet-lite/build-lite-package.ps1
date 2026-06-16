$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$petRoot = Join-Path $root 'desktop-pet-lite'
$artifactRoot = Join-Path $root 'artifacts'
$zipPath = Join-Path $artifactRoot 'PetFit-Buding-lite-desktop.zip'

if (-not (Test-Path $artifactRoot)) {
  New-Item -ItemType Directory -Path $artifactRoot | Out-Null
}

powershell -NoProfile -ExecutionPolicy Bypass -File (Join-Path $petRoot 'PetFitBudingPet.ps1') -SelfTest

if (Test-Path $zipPath) {
  Remove-Item -LiteralPath $zipPath -Force
}

Compress-Archive -Path (Join-Path $petRoot '*') -DestinationPath $zipPath -Force

$size = [Math]::Round((Get-Item $zipPath).Length / 1MB, 2)
Write-Host "Created $zipPath ($size MB)"
