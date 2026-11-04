# Backup dataset Sanity "production" ke folder DI LUAR repo ini.
#
# Repo ini publik, jadi file backup TIDAK boleh ikut di-commit -- hanya skrip ini
# yang di-commit. Output default menulis ke folder induk proyek.
#
# Pakai:
#   powershell -ExecutionPolicy Bypass -File scripts\backup-dataset.ps1
#   powershell -ExecutionPolicy Bypass -File scripts\backup-dataset.ps1 -Keep 30
#   powershell -ExecutionPolicy Bypass -File scripts\backup-dataset.ps1 -PurgeBefore "2026-10-19"
#
# -PurgeBefore menghapus arsip yang lebih lama dari tanggal tersebut. Pakai hanya
# setelah memastikan arsip itu tidak diperlukan (mis. arsip sebelum insiden data).

param(
  [string]$OutDir = "D:\Project Website Samsara Group\backups\sanity",
  [int]$Keep = 14,
  [string]$Dataset = "production",
  [string]$PurgeBefore = ""
)

$ErrorActionPreference = "Stop"

if ([string]::IsNullOrWhiteSpace($OutDir)) { throw "OutDir wajib diisi." }
if ($Keep -lt 1) { throw "Keep minimal 1." }
if ($Dataset -notmatch '^[a-z0-9][a-z0-9_-]*$') { throw "Nama dataset tidak valid: $Dataset" }

$cutoff = $null
if ($PurgeBefore) {
  try { $cutoff = [datetime]::Parse($PurgeBefore, [Globalization.CultureInfo]::InvariantCulture) }
  catch { throw "PurgeBefore harus tanggal yang valid, contoh: 2026-10-19" }
}

# $PSScriptRoot = <repo studio>\scripts, jadi induknya = root repo studio.
$studioRoot = Split-Path -Parent $PSScriptRoot
New-Item -ItemType Directory -Force -Path $OutDir | Out-Null

# Detik ikut supaya dua backup dalam satu menit tidak saling menimpa.
$stamp = Get-Date -Format "yyyy-MM-dd_HHmmss"
$dest = Join-Path $OutDir "$Dataset-$stamp.tar.gz"
$partial = "$dest.partial"
$log = Join-Path $OutDir "backup.log"

if (Test-Path -LiteralPath $partial) { Remove-Item -LiteralPath $partial -Force }

Push-Location $studioRoot
$exportExit = 1
try {
  & npx sanity datasets export $Dataset $partial --overwrite
  $exportExit = $LASTEXITCODE
}
finally {
  Pop-Location
}

if ($exportExit -ne 0 -or -not (Test-Path -LiteralPath $partial)) {
  if (Test-Path -LiteralPath $partial) { Remove-Item -LiteralPath $partial -Force }
  Add-Content -Path $log -Value "$(Get-Date -Format 'yyyy-MM-dd HH:mm')  GAGAL  $Dataset-$stamp.tar.gz tidak dibuat (exit $exportExit)"
  throw "Export gagal: $dest tidak dibuat (exit $exportExit)"
}

$hash = (Get-FileHash -LiteralPath $partial -Algorithm SHA256).Hash.ToLowerInvariant()
Move-Item -LiteralPath $partial -Destination $dest -Force

$size = [math]::Round((Get-Item -LiteralPath $dest).Length / 1MB, 2)
$line = "$(Get-Date -Format 'yyyy-MM-dd HH:mm')  OK     $Dataset-$stamp.tar.gz  $size MB  sha256=$hash"
Add-Content -Path $log -Value $line
Write-Host $line

# Tanggal di nama arsip adalah tanggal ekspor. LastWriteTime berubah kalau berkas
# pernah disalin atau dipulihkan, jadi purge harus membaca tanggal dari namanya.
function Get-ArchiveDate([string]$Name) {
  # Older archives used HHmm, newer ones use HHmmss, so accept both.
  if ($Name -match "^$([regex]::Escape($Dataset))-(\d{4}-\d{2}-\d{2})_\d{4,6}\.tar\.gz$") {
    return [datetime]::ParseExact($Matches[1], "yyyy-MM-dd", [Globalization.CultureInfo]::InvariantCulture)
  }
  return $null
}

if ($cutoff) {
  Get-ChildItem $OutDir -Filter "$Dataset-*.tar.gz" |
    ForEach-Object {
      $archiveDate = Get-ArchiveDate $_.Name
      if ($null -eq $archiveDate) {
        Write-Host "  lewati, nama tidak dikenali: $($_.Name)"
        return
      }
      if ($archiveDate -lt $cutoff) {
        Remove-Item -LiteralPath $_.FullName -Force
        Write-Host "  hapus arsip sebelum $($cutoff.ToString('yyyy-MM-dd')): $($_.Name)"
      }
    }
}

# Simpan hanya $Keep backup terbaru.
$old = Get-ChildItem $OutDir -Filter "$Dataset-*.tar.gz" |
  Sort-Object LastWriteTime -Descending |
  Select-Object -Skip $Keep

foreach ($f in $old) {
  Remove-Item -LiteralPath $f.FullName -Force
  Write-Host "  hapus backup lama: $($f.Name)"
}
