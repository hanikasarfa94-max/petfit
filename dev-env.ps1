$RuntimeRoot = "$env:USERPROFILE\.cache\codex-runtimes\codex-primary-runtime\dependencies"
$NodeBin = Join-Path $RuntimeRoot "node\bin"
$PythonBin = Join-Path $RuntimeRoot "python"
$NativeBin = Join-Path $RuntimeRoot "bin"
$PortableGit = Join-Path $PSScriptRoot "tools\mingit\cmd"
$env:JAVA_HOME = Join-Path $PSScriptRoot "tools\jdk21\jdk-21.0.11+10"
$env:ANDROID_HOME = Join-Path $PSScriptRoot "tools\android-sdk"
$env:ANDROID_SDK_ROOT = $env:ANDROID_HOME

$AndroidTools = Join-Path $env:ANDROID_HOME "cmdline-tools\latest\bin"
$AndroidPlatformTools = Join-Path $env:ANDROID_HOME "platform-tools"
$env:PATH = "$env:JAVA_HOME\bin;$AndroidTools;$AndroidPlatformTools;$PortableGit;$NodeBin;$PythonBin;$NativeBin;$env:PATH"
$env:NODE_PATH = Join-Path $RuntimeRoot "node\node_modules"

Write-Host "Development environment loaded."
Write-Host "node:   $(& node --version)"
Write-Host "python: $(& python --version)"
Write-Host "pnpm:   $(& pnpm --version)"
if (Get-Command git -ErrorAction SilentlyContinue) {
    Write-Host "git:    $(& git --version)"
}
if (Get-Command java -ErrorAction SilentlyContinue) {
    Write-Host "java:   $(& java -version 2>&1 | Select-Object -First 1)"
}
