# Backup dataset Samsara ke arsip lokal, lalu unggah arsip terbaru ke Google Drive.
#
# Dijalankan saat pemilik situs meminta ("push" atau "backup"), bukan terjadwal.
#
# Pakai:
#   powershell -ExecutionPolicy Bypass -File scripts\backup-and-upload.ps1
#   powershell -ExecutionPolicy Bypass -File scripts\backup-and-upload.ps1 -KeepOnDrive 7
#
# Yang dilakukan:
#   1. memanggil backup-dataset.ps1  -> arsip baru + simpan 14 terbaru secara lokal
#   2. mengunggah arsip TERBARU ke remote "samsara-drive"
#   3. memverifikasi ukuran + hash, lalu merapikan arsip lama di Drive
#
# Kalau Drive tidak bisa dihubungi, arsip lokal TETAP dibuat -- langkah unggah
# hanya dilaporkan gagal, tidak membatalkan backup lokal.

param(
  [string]$Remote = "samsara-drive",
  [int]$KeepOnDrive = 7
)

$ErrorActionPreference = "Stop"

if ($Remote -notmatch '^[A-Za-z0-9._-]+$') { throw "Nama remote tidak valid: $Remote" }
if ($KeepOnDrive -lt 1) { throw "KeepOnDrive minimal 1." }

$here = $PSScriptRoot
$localScript = Join-Path $here "backup-dataset.ps1"
$localDir = "D:\Project Website Samsara Group\backups\sanity"

# rclone bisa belum ada di PATH kalau baru dipasang (butuh shell baru). Jangan
# mengeksekusi file pertama yang ditemukan di folder user-writable; pakai PATH
# atau shim WinGet yang sudah ditentukan.
function Find-Rclone {
  $cmd = Get-Command rclone -ErrorAction SilentlyContinue
  if ($cmd) { return $cmd.Source }
  $link = Join-Path $env:LOCALAPPDATA "Microsoft\WinGet\Links\rclone.exe"
  if (Test-Path -LiteralPath $link) { return $link }
  return $null
}

Write-Host ""
Write-Host "=== 1. backup lokal ==="
& powershell -NoProfile -ExecutionPolicy Bypass -File $localScript
if ($LASTEXITCODE -ne 0) { throw "backup lokal gagal (exit $LASTEXITCODE)" }

$arsip = Get-ChildItem $localDir -File -Filter "production-*.tar.gz" |
  Sort-Object LastWriteTime -Descending | Select-Object -First 1
if (-not $arsip) { throw "tidak ada arsip di $localDir setelah backup lokal" }
Write-Host ("   arsip terbaru: {0}  ({1} MB)" -f $arsip.Name, [math]::Round($arsip.Length / 1MB, 2))

Write-Host ""
Write-Host "=== 2. unggah ke Google Drive ==="
$rclone = Find-Rclone
if (-not $rclone) {
  Write-Host "   rclone tidak ditemukan - langkah unggah dilewati (arsip lokal sudah dibuat)"
  exit 0
}

$tujuan = "${Remote}:"
# rclone menulis notifikasi ke stderr; dengan ErrorActionPreference "Stop" PowerShell
# menganggapnya error fatal, padahal belum tentu gagal. Jadi dari sini kegagalan
# diperiksa lewat $LASTEXITCODE, bukan lewat aliran error PowerShell.
$ErrorActionPreference = "Continue"
& $rclone copy $arsip.FullName $tujuan --log-level ERROR 2>&1 | ForEach-Object { "   $_" }
if ($LASTEXITCODE -ne 0) {
  Write-Host "   GAGAL mengunggah (arsip lokal tetap ada). Periksa otorisasi: rclone config reconnect ${Remote}:"
  exit 1
}

# Verifikasi ukuran.
$ukuranDrive = $null
foreach ($baris in (& $rclone lsf $tujuan --format "sp" --log-level ERROR 2>$null)) {
  if ($baris -match '^(\d+);(.+)$' -and $Matches[2] -eq $arsip.Name) {
    $ukuranDrive = [int64]$Matches[1]
  }
}

if ($null -eq $ukuranDrive) {
  Write-Host "   GAGAL: berkas tidak ditemukan di Drive setelah unggah"
  exit 1
}
if ($ukuranDrive -ne $arsip.Length) {
  Write-Host ("   GAGAL: ukuran berbeda -- lokal {0} byte, Drive {1} byte" -f $arsip.Length, $ukuranDrive)
  exit 1
}

# Verifikasi isi dengan hash. Google Drive mendukung MD5; kalau hash tidak
# tersedia, ukuran tetap menjadi batas minimum dan dicatat sebagai peringatan.
$localHash = (Get-FileHash -LiteralPath $arsip.FullName -Algorithm MD5).Hash.ToLowerInvariant()
$remoteHash = $null
foreach ($baris in (& $rclone hashsum MD5 $tujuan --include $arsip.Name --log-level ERROR 2>$null)) {
  if ($baris -match '^([0-9a-f]{32})\s+(.+)$' -and $Matches[2] -eq $arsip.Name) {
    $remoteHash = $Matches[1]
  }
}

if ($remoteHash) {
  if ($remoteHash -ne $localHash) {
    Write-Host "   GAGAL: hash Drive berbeda dari berkas lokal"
    exit 1
  }
  Write-Host ("   terverifikasi: MD5 {0}" -f $localHash)
} else {
  Write-Host ("   ukuran cocok ({0} byte); hash remote tidak tersedia" -f $ukuranDrive)
}

Write-Host ""
Write-Host "=== 3. rapikan arsip lama di Drive ==="
$daftar = & $rclone lsf $tujuan --files-only --log-level ERROR 2>$null |
  Where-Object { $_ -like "production-*.tar.gz" } |
  Sort-Object -Descending
Write-Host ("   ada {0} arsip di Drive" -f ($daftar | Measure-Object).Count)
$buang = $daftar | Select-Object -Skip $KeepOnDrive
$gagalHapus = $false
foreach ($f in $buang) {
  & $rclone deletefile "${tujuan}${f}" --log-level ERROR 2>&1 | Out-Null
  if ($LASTEXITCODE -ne 0) {
    Write-Host "   GAGAL hapus di Drive: $f"
    $gagalHapus = $true
  } else {
    Write-Host "   hapus di Drive: $f"
  }
}
if ($gagalHapus) { exit 1 }

Write-Host ""
Write-Host "=== selesai ==="
& $rclone lsf $tujuan --files-only --log-level ERROR 2>$null |
  Where-Object { $_ -like "production-*.tar.gz" } |
  Sort-Object -Descending |
  ForEach-Object { "   Drive: $_" }

exit 0
