@echo off
echo ========================================================
echo        Building KEMIX Android APK
echo ========================================================

echo [1/4] Building Vite Web Assets...
call npm run build:vite
if %ERRORLEVEL% neq 0 (
    echo Error: Vite build failed!
    exit /b %ERRORLEVEL%
)

echo [2/4] Syncing with Android project...
call npx cap sync android
if %ERRORLEVEL% neq 0 (
    echo Error: Capacitor sync failed!
    exit /b %ERRORLEVEL%
)

echo [3/4] Compiling APK using Gradle...
set "JAVA_HOME=C:\Program Files\Android\Android Studio\jbr"
set "PATH=%JAVA_HOME%\bin;%PATH%"

cd /d "%~dp0android"
call gradlew.bat assembleDebug
if %ERRORLEVEL% neq 0 (
    echo Error: Gradle build failed!
    exit /b %ERRORLEVEL%
)
cd /d "%~dp0"

echo [4/4] Copying APK to release folder...
if not exist "release" mkdir "release"
copy /y "android\app\build\outputs\apk\debug\app-debug.apk" "release\KEMIX-v1.0.0.apk"

echo ========================================================
echo  APK build finished successfully!
echo  Location: release\KEMIX-v1.0.0.apk
echo ========================================================
