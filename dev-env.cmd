@echo off
set "RUNTIME_ROOT=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies"
set "PROJECT_ROOT=%~dp0"
set "PORTABLE_GIT=%PROJECT_ROOT%tools\mingit\cmd"
set "JAVA_HOME=%PROJECT_ROOT%tools\jdk21\jdk-21.0.11+10"
set "ANDROID_HOME=%PROJECT_ROOT%tools\android-sdk"
set "ANDROID_SDK_ROOT=%ANDROID_HOME%"
set "PATH=%JAVA_HOME%\bin;%ANDROID_HOME%\cmdline-tools\latest\bin;%ANDROID_HOME%\platform-tools;%PORTABLE_GIT%;%RUNTIME_ROOT%\node\bin;%RUNTIME_ROOT%\python;%RUNTIME_ROOT%\bin;%PATH%"
set "NODE_PATH=%RUNTIME_ROOT%\node\node_modules"

echo Development environment loaded.
node --version
python --version
pnpm --version
git --version 2>nul
java -version 2>nul
