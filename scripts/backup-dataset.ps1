# Backup dataset Sanity "production" ke folder DI LUAR repo ini.
#
# Repo ini publik, jadi file backup TIDAK boleh ikut di-commit -- hanya skrip ini
# yang di-commit. Output default menulis ke folder induk proyek.
#
# Pakai:
#   powershell -ExecutionPolicy Bypass -File scripts\backup-dataset.ps1
#   powershell -ExecutionPolicy Bypass -File scripts\backup-dataset.ps1 -Keep 30

param(
  [string]$OutDir = "D:\Project Website Samsara Group\backups\sanity",
  [int]$Keep = 14,
  [string]$Dataset = "production"
)

$ErrorActionPreference = "Stop"

# $PSScriptRoot = <repo studio>\scripts, jadi induknya = root repo studio.
$studioRoot = Split-Path -Parent $PSScriptRoot
New-Item -ItemType Directory -Force -Path $OutDir | Out-Null

$stamp = Get-Date -Format "yyyy-MM-dd_HHmm"
$dest = Join-Path $OutDir "$Dataset-$stamp.tar.gz"
$log = Join-Path $OutDir "backup.log"

Push-Location $studioRoot
try {
  npx sanity datasets export $Dataset $dest --overwrite
}
finally {
  Pop-Location
}

if (-not (Test-Path $dest)) {
  Add-Content -Path $log -Value "$(Get-Date -Format 'yyyy-MM-dd HH:mm')  GAGAL  $Dataset-$stamp.tar.gz tidak dibuat"
  throw "Export gagal: $dest tidak dibuat"
}

$size = [math]::Round((Get-Item $dest).Length / 1MB, 2)
$line = "$(Get-Date -Format 'yyyy-MM-dd HH:mm')  OK     $Dataset-$stamp.tar.gz  $size MB"
Add-Content -Path $log -Value $line
Write-Host $line

# Simpan hanya $Keep backup terbaru.
$old = Get-ChildItem $OutDir -Filter "$Dataset-*.tar.gz" |
  Sort-Object LastWriteTime -Descending |
  Select-Object -Skip $Keep

foreach ($f in $old) {
  Remove-Item $f.FullName -Force
  Write-Host "  hapus backup lama: $($f.Name)"
}
