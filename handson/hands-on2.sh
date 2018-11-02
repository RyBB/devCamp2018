# コマンドプロンプト, ターミナルの方
curl -X "GET" -H "X-Cybozu-API-Token: YOUR_TOKEN" \
"https://{subdomain}.cybozu.com/k/v1/records.json?app={XXX}"

# PowerShellの方
curl.exe -X "GET" -H "X-Cybozu-API-Token: YOUR_TOKEN" \
"https://{subdomain}.cybozu.com/k/v1/records.json?app={XXX}"