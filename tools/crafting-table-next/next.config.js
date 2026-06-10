/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Served at root on its own hostname (ff-crafting-table.possibleworlds.studio)
  // via the Dokploy Traefik network + Cloudflare tunnel — no basePath needed.
  // Asset helpers fall back to '' when NEXT_PUBLIC_BASE_PATH is unset.
}

module.exports = nextConfig
