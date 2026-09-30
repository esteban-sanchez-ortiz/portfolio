// Read metadata status only. Never print response bodies, bindings, or credentials.
const account = process.env.CLOUDFLARE_ACCOUNT_ID
const token = process.env.CLOUDFLARE_API_TOKEN
const base = `/accounts/${account}/workers`
const endpoints = [
  ['service', `${base}/services/sancho-chat`],
  ['bindings', `${base}/services/sancho-chat/environments/production/bindings`],
  ['routes', `${base}/services/sancho-chat/environments/production/routes?show_zonename=true`],
  ['custom-domains', `${base}/domains/records?page=0&per_page=5&service=sancho-chat&environment=production`],
  ['subdomain', `${base}/services/sancho-chat/environments/production/subdomain`],
  ['environment', `${base}/services/sancho-chat/environments/production`],
  ['schedules', `${base}/scripts/sancho-chat/schedules`],
]
let failed = false
for (const [label, path] of endpoints) {
  const response = await fetch(`https://api.cloudflare.com/client/v4${path}`, {
    headers: {Authorization: `Bearer ${token}`}, signal: AbortSignal.timeout(15000),
  })
  console.log(`${label}: HTTP ${response.status}`)
  failed ||= !response.ok
  await response.body?.cancel()
}
if (failed) process.exitCode = 1
