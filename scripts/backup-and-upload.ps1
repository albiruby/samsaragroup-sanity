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
#   2. mengunggah arsip TERBARU ke remote "samsara-drive" (folder Drive yang dikunci)
#   3. menghapus arsip lama di Drive, simpan $KeepOnDrive terbaru
#
# Kalau Drive tidak bisa dihubungi, arsip lokal TETAP dibuat -- langkah unggah
# hanya dilaporkan gagal, tidak membatalkan backup lokal.

param(
  [string]$Remote = "samsara-drive",
  [int]$KeepOnDrive = 7
)

$ErrorActionPreference = "Stop"
$here = $PSScriptRoot
$localScript = Join-Path $here "backup-dataset.ps1"
$localDir = "D:\Project Website INFIA\Samsara Group Website\backups\sanity"

# rclone bisa belum ada di PATH kalau baru dipasang (butuh shell baru), jadi dicari manual.
function Find-Rclone {
  $cmd = Get-Command rclone -ErrorAction SilentlyContinue
  if ($cmd) { return $cmd.Source }
  $kandidat = Get-ChildItem "$env:LOCALAPPDATA\Microsoft\WinGet\Packages" -Recurse -Filter "rclone.exe" -ErrorAction SilentlyContinue |
    Select-Object -First 1
  if ($kandidat) { return $kandidat.FullName }
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
& $rclone copy $arsip.FullName $tujuan --drive-use-trash=false --log-level ERROR 2>&1 | ForEach-Object { "   $_" }
if ($LASTEXITCODE -ne 0) {
  Write-Host "   GAGAL mengunggah (arsip lokal tetap ada). Periksa otorisasi: rclone config reconnect ${Remote}:"
  exit 1
}

# Verifikasi mandiri: ukuran di Drive harus sama persis dengan berkas lokal.
# Tanpa ini, "tidak ada error" tidak membuktikan berkasnya benar-benar utuh --
# berkas kosong atau terpotong juga bisa selesai tanpa error.
$ukuranDrive = $null
foreach ($baris in (& $rclone lsf $tujuan --format "sp" --log-level ERROR 2>$null)) {
  if ($baris -match '^(\d+);(.+)$' -and $Matches[2] -eq $arsip.Name) {
    $ukuranDrive = [int64]$Matches[1]
  }
}

if ($null -eq $ukuranDrive) {
  Write-Host "   GAGAL: berkas tidak ditemukan di Drive setelah unggah"
  exit 1
} elseif ($ukuranDrive -ne $arsip.Length) {
  Write-Host ("   GAGAL: ukuran berbeda -- lokal {0} byte, Drive {1} byte" -f $arsip.Length, $ukuranDrive)
  exit 1
} else {
  Write-Host ("   terverifikasi: {0} byte, sama persis dengan berkas lokal" -f $ukuranDrive)
}

Write-Host ""
Write-Host "=== 3. rapikan arsip lama di Drive ==="
$daftar = & $rclone lsf $tujuan --files-only --log-level ERROR 2>$null |
  Where-Object { $_ -like "production-*.tar.gz" } |
  Sort-Object -Descending
Write-Host ("   ada {0} arsip di Drive" -f ($daftar | Measure-Object).Count)
$buang = $daftar | Select-Object -Skip $KeepOnDrive
foreach ($f in $buang) {
  & $rclone deletefile "${tujuan}${f}" --drive-use-trash=false --log-level ERROR 2>&1 | Out-Null
  Write-Host "   hapus di Drive: $f"
}

Write-Host ""
Write-Host "=== selesai ==="
& $rclone lsf $tujuan --files-only --log-level ERROR 2>$null |
  Where-Object { $_ -like "production-*.tar.gz" } |
  Sort-Object -Descending |
  ForEach-Object { "   Drive: $_" }

# Keluar dengan 0 secara eksplisit. rclone menulis ke stderr pada beberapa tahap,
# dan itu membuat PowerShell mengakhiri proses dengan kode 1 walaupun semuanya
# berhasil -- pemanggil mana pun akan salah membacanya sebagai kegagalan.
# Kegagalan sungguhan sudah ditangani dengan exit 1 di tempatnya masing-masing.
exit 0
