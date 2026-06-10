# Deploying the Crafting Table

Next.js (standalone output), served as a container on the Possible Worlds
bare-metal box via plain `docker compose`, attached to the Dokploy-managed
Traefik overlay network. **No host ports are published.**

## Ingress path

```
Cloudflare tunnel ──▶ Traefik (:80, `web` entrypoint) ──▶ crafting-table-next-1 (:3005)
                      routed by Host(`ff-crafting-table.possibleworlds.studio`)
                      over dokploy-network
```

TLS is terminated at Cloudflare, so Traefik uses the plain `web` entrypoint with
no certresolver — the same pattern as the `parasites` and `neuromancers` stacks
on this box. The app serves at root `/` (no Next.js `basePath`).

## Files

| File | Purpose |
|------|---------|
| `Dockerfile` | multi-stage: `node:20-alpine` builds, standalone server runs on :3005 |
| `next.config.js` | `output: 'standalone'`, no basePath (serves at root) |
| `docker-compose.yml` | one `crafting-table` service on `dokploy-network`, Traefik labels, no published ports |

## Prerequisites (already true on this box)

- `dokploy-network` exists (external overlay, Dokploy-managed).
- Traefik is listening on the `web` entrypoint (:80) and routing by Host header.
- cloudflared is running with the tunnel in `/etc/cloudflared/config.yml`.

## 1. Build + bring up

From the repo subdir on the server:

```bash
cd /home/jh/repos/furtherfield/tools/crafting-table-next
docker compose up -d --build
```

Verify the container is healthy and on the network:

```bash
docker ps | grep crafting-table
docker inspect -f '{{.State.Health.Status}}' crafting-table-next-1   # → healthy
docker logs crafting-table-next-1 --tail 20
```

Confirm it responds inside the container:

```bash
docker exec crafting-table-next-1 wget -qO- http://localhost:3005/ | head -c 200
```

## 2. Cloudflare tunnel route — **you do this manually**

> The agent does **not** edit `/etc/cloudflared/config.yml`. Add the route
> yourself.

**a. DNS route** (creates the CNAME to the tunnel; safe to re-run):

```bash
cloudflared tunnel route dns 23442c9d-496b-44a1-919a-dd7593bbf8f2 \
  ff-crafting-table.possibleworlds.studio
```

**b. Ingress entry** — add to `/etc/cloudflared/config.yml`, in the `ingress:`
list **above** the catch-all `service: http_status:404` rule. Point it at
Traefik's **:80** (same as the parasites/neuromancers entries) — **use port 80,
not 443**: Cloudflare already terminates TLS and Traefik's `web` entrypoint is
plain HTTP, so no app port is published and there is no TLS on the Traefik side.

```yaml
  - hostname: ff-crafting-table.possibleworlds.studio
    service: http://localhost:80
    originRequest:
      httpHostHeader: ff-crafting-table.possibleworlds.studio
      noTLSVerify: true
```

**c. Restart cloudflared:**

```bash
sudo systemctl restart cloudflared
```

## 3. Verify public access

```bash
curl -I https://ff-crafting-table.possibleworlds.studio/    # → 200, text/html
```

Then open it in a browser and confirm the Crafting Table UI renders.

## Redeploys

After pulling new commits:

```bash
cd /home/jh/repos/furtherfield/tools/crafting-table-next
docker compose up -d --build
```

## Teardown

```bash
docker compose down                       # stop + remove the container
docker image rm crafting-table-next:latest   # optional: drop the image
```

(Then remove the cloudflared ingress entry + restart cloudflared if retiring the
hostname.)
