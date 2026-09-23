# 手机访问学习平台 —— 一键启动本地网页服务
$ErrorActionPreference = 'Continue'
$root = $PSScriptRoot
if (-not $root) { $root = (Get-Location).Path }
Set-Location -LiteralPath $root

Write-Host ''
Write-Host '================================================' -ForegroundColor Cyan
Write-Host '   Agent 学习平台 · 手机访问服务' -ForegroundColor Cyan
Write-Host '================================================' -ForegroundColor Cyan
Write-Host ''

$ips = @()
try {
  $ips = Get-NetIPAddress -AddressFamily IPv4 |
    Where-Object { $_.IPAddress -notlike '127.*' -and $_.IPAddress -notlike '169.254.*' -and $_.PrefixOrigin -ne 'WellKnown' } |
    Select-Object -ExpandProperty IPAddress -Unique
} catch { }
if (-not $ips -or $ips.Count -eq 0) { $ips = @('127.0.0.1') }

Write-Host '手机访问地址（手机需和电脑连同一个 Wi-Fi）：' -ForegroundColor Yellow
foreach ($ip in $ips) {
  Write-Host ('   http://' + $ip + ':8000') -ForegroundColor Green
}
Write-Host ''
Write-Host ' 1) 在手机浏览器输入上面任意一个地址' -ForegroundColor Gray
Write-Host ' 2) 首次运行会弹防火墙提示，选「允许访问」' -ForegroundColor Gray
Write-Host ' 3) 这个窗口不能关，关掉手机就打不开' -ForegroundColor Gray
Write-Host ' 4) 结束服务：按 Ctrl + C' -ForegroundColor Gray
Write-Host ''

try { Start-Process 'http://127.0.0.1:8000' | Out-Null } catch { }

python -m http.server 8000 --bind 0.0.0.0
