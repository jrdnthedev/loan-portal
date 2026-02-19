# Quick Setup Script for Backend
# Run this to automatically set up the backend

Write-Host "🚀 Loan Portal Backend Setup" -ForegroundColor Cyan
Write-Host "============================`n" -ForegroundColor Cyan

# Check if in backend directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Please run this script from the backend directory" -ForegroundColor Red
    Write-Host "   cd backend" -ForegroundColor Yellow
    Write-Host "   .\setup.ps1" -ForegroundColor Yellow
    exit 1
}

Write-Host "Choose your database option:`n" -ForegroundColor Yellow
Write-Host "1. PostgreSQL (Recommended for production)" -ForegroundColor White
Write-Host "   - Requires PostgreSQL installation or Docker" -ForegroundColor Gray
Write-Host ""
Write-Host "2. SQLite (Quick start - Development only)" -ForegroundColor White
Write-Host "   - No installation required" -ForegroundColor Gray
Write-Host "   - Perfect for testing" -ForegroundColor Gray
Write-Host ""

$choice = Read-Host "Enter your choice (1 or 2)"

if ($choice -eq "2") {
    Write-Host "`n📦 Setting up SQLite..." -ForegroundColor Cyan
    
    # Backup original schema
    if (Test-Path "prisma\schema.prisma") {
        Copy-Item "prisma\schema.prisma" "prisma\schema.prisma.backup" -Force
        Write-Host "✅ Backed up original schema" -ForegroundColor Green
    }
    
    # Use SQLite schema
    Copy-Item "prisma\schema.sqlite.prisma" "prisma\schema.prisma" -Force
    Write-Host "✅ Configured SQLite" -ForegroundColor Green
    
} elseif ($choice -eq "1") {
    Write-Host "`n📦 PostgreSQL Setup..." -ForegroundColor Cyan
    
    # Check if PostgreSQL is accessible
    $pgInstalled = $false
    
    # Check for psql
    try {
        $null = Get-Command psql -ErrorAction Stop
        $pgInstalled = $true
    } catch {
        Write-Host "⚠️  psql not found in PATH" -ForegroundColor Yellow
    }
    
    # Check for Docker
    $dockerInstalled = $false
    try {
        $null = Get-Command docker -ErrorAction Stop
        $dockerInstalled = $true
    } catch {}
    
    if ($dockerInstalled) {
        Write-Host "`n🐳 Docker detected!" -ForegroundColor Green
        $useDocker = Read-Host "Use Docker for PostgreSQL? (y/n)"
        
        if ($useDocker -eq "y") {
            Write-Host "`nStarting PostgreSQL with Docker..." -ForegroundColor Cyan
            docker-compose up -d
            Start-Sleep -Seconds 3
            Write-Host "✅ PostgreSQL running in Docker" -ForegroundColor Green
        }
    } elseif (-not $pgInstalled) {
        Write-Host "`n⚠️  PostgreSQL not detected!" -ForegroundColor Yellow
        Write-Host "Please install PostgreSQL:" -ForegroundColor White
        Write-Host "  1. Download: https://www.postgresql.org/download/windows/" -ForegroundColor Gray
        Write-Host "  2. Or install Docker: https://www.docker.com/products/docker-desktop/" -ForegroundColor Gray
        Write-Host "`nOr re-run this script and choose SQLite (option 2)" -ForegroundColor Cyan
        exit 1
    }
    
    Write-Host "`n💡 Make sure you have:" -ForegroundColor Yellow
    Write-Host "  - Created database: loan_portal_db" -ForegroundColor White
    Write-Host "  - Updated .env with correct credentials" -ForegroundColor White
    Read-Host "`nPress Enter when ready to continue"
    
} else {
    Write-Host "❌ Invalid choice" -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host "`n📦 Installing dependencies..." -ForegroundColor Cyan
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ npm install failed" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Dependencies installed" -ForegroundColor Green

# Generate Prisma Client
Write-Host "`n🔨 Generating Prisma Client..." -ForegroundColor Cyan
npm run prisma:generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to generate Prisma Client" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Prisma Client generated" -ForegroundColor Green

# Run migrations
Write-Host "`n🗄️  Running database migrations..." -ForegroundColor Cyan
npm run prisma:migrate
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Migration failed" -ForegroundColor Red
    Write-Host "💡 Check your database connection in .env" -ForegroundColor Yellow
    exit 1
}
Write-Host "✅ Migrations completed" -ForegroundColor Green

# Seed database
Write-Host "`n🌱 Seeding database..." -ForegroundColor Cyan
npm run seed
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Seeding failed" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Database seeded with sample data" -ForegroundColor Green

Write-Host "`n✨ Setup Complete! ✨" -ForegroundColor Green
Write-Host "`nTo start the server:" -ForegroundColor Cyan
Write-Host "  npm run dev" -ForegroundColor White
Write-Host "`nTest credentials:" -ForegroundColor Cyan
Write-Host "  Email: john.doe@example.com" -ForegroundColor White
Write-Host "  Password: password123" -ForegroundColor White
Write-Host "`nAPI will be available at: http://localhost:3001" -ForegroundColor Cyan
Write-Host ""
