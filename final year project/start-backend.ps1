# Smart Research Assistant - Full Startup Script (Data-Persistent)
# ---------------------------------------------------------------
# This script starts Qdrant (vector DB) AND the Spring Boot backend.
# All data is saved to absolute paths so nothing is lost on restart.

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$MongoDataDir  = "$ScriptDir\mongo_data"
$UploadsDir    = "$ScriptDir\uploads"
$QdrantExe     = "$ScriptDir\qdrant\qdrant.exe"
$QdrantStorage = "$ScriptDir\qdrant\storage"

# Create directories if they don't exist
New-Item -ItemType Directory -Force -Path $MongoDataDir  | Out-Null
New-Item -ItemType Directory -Force -Path $UploadsDir    | Out-Null
New-Item -ItemType Directory -Force -Path $QdrantStorage | Out-Null

# ── 1. Start Qdrant vector database (background process) ──────────────
if (Test-Path $QdrantExe) {
    Write-Host "==> Starting Qdrant vector database..." -ForegroundColor Green
    $qdrantProc = Start-Process -FilePath $QdrantExe `
        -ArgumentList "--storage-path `"$QdrantStorage`"" `
        -WorkingDirectory "$ScriptDir\qdrant" `
        -PassThru -WindowStyle Hidden
    Write-Host "    Qdrant PID: $($qdrantProc.Id) | Storage: $QdrantStorage" -ForegroundColor DarkGreen
    Start-Sleep -Seconds 3
} else {
    Write-Host "WARNING: Qdrant not found at $QdrantExe" -ForegroundColor Yellow
    Write-Host "         Vector search will use in-memory fallback (data lost on restart)" -ForegroundColor Yellow
}

# ── 2. Start Spring Boot backend ───────────────────────────────────────
Write-Host "==> Starting Spring Boot backend..." -ForegroundColor Cyan
Write-Host "    MongoDB data : $MongoDataDir" -ForegroundColor DarkCyan
Write-Host "    Uploads dir  : $UploadsDir" -ForegroundColor DarkCyan

# Set env vars for Spring Boot to pick up via application.yml placeholders
$env:MONGO_DATA_DIR = $MongoDataDir
$env:UPLOAD_DIR     = $UploadsDir

# NOTE: Replace the values below with your own API keys before running.
# Get your Groq API key from: https://console.groq.com/
# Get your Gemini API key from: https://aistudio.google.com/
java `
    "-Dgroq.api-key=YOUR_GROQ_API_KEY_HERE" `
    "-Dgroq.model=openai/gpt-oss-120b" `
    "-Dgemini.api-key=YOUR_GEMINI_API_KEY_HERE" `
    "-Djwt.secret=YOUR_JWT_SECRET_HERE" `
    -jar "$ScriptDir\backend\target\assistant-backend-1.0.0.jar"
