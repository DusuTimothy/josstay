# Aiven PostgreSQL setup (TLS + CA certificate)

JosStay uses Aiven for managed PostgreSQL. Aiven requires TLS, and the API is configured to **verify the server certificate** with Aiven's CA. This is stricter and safer than `sslmode=require` alone.

## 1. Get the connection details

1. Open [Aiven Console](https://console.aiven.io/) → your PostgreSQL service.
2. On **Overview**, copy the **Service URI**. It looks like:
   ```
   postgres://avnadmin:YOUR_PASSWORD@josstay-db-xxxx.aivencloud.com:12345/defaultdb?sslmode=require
   ```
3. Still on **Overview**, download the **CA certificate** (`ca.pem`).

> Some Aiven consoles show the CA under **Overview → Connection information → CA certificate** or under **Service settings → CA certificate**. If your service uses a project CA, download that instead. The certificate is public and safe to ship with the API, but this repo ignores `*.pem` by default; see the deployment note below.

## 2. Put the certificate in place

```bash
# from the repo root
mv ~/Downloads/ca.pem server/certs/aiven-ca.pem
```

The API resolves relative paths from its working directory (`server`), so the default value works:

```env
AIVEN_CA_CERT_PATH=./certs/aiven-ca.pem
```

Absolute paths (`/etc/secrets/aiven-ca.pem`) also work.

## 3. Configure the API environment

```bash
cp server/.env.example server/.env
```

Set at minimum:

```env
DATABASE_URL=postgres://avnadmin:...@josstay-db-xxxx.aivencloud.com:12345/defaultdb?sslmode=require
AIVEN_CA_CERT_PATH=./certs/aiven-ca.pem
DB_SSL=true
```

`DB_SSL=true` is the default. Set `DB_SSL=false` only when running against a local PostgreSQL container that does not use TLS.

## 4. How the connection is built

`server/src/config/database.ts`:

- reads the CA file from `AIVEN_CA_CERT_PATH`,
- throws a clear startup error if `DB_SSL=true` and the file is missing,
- connects with `ssl.require = true`, `ssl.rejectUnauthorized = true`, and the CA,
- uses a small pool (`max: 5`) because Aiven plans cap concurrent connections.

This satisfies Aiven's TLS requirement and prevents man-in-the-middle connections.

## 5. Allow network access

- **Aiven IP allow-list:** add your current IP for local development and your API host's egress IPs in production (Render uses static outbound IPs on paid plans; otherwise allow `0.0.0.0/0` and rely on TLS + strong credentials).
- **Local firewall/VPN:** if `sequelize.authenticate()` times out, the allow-list is almost always the cause.
- **Render:** add `AIVEN_CA_CERT_PATH` and paste the certificate in one of two ways:
  1. Commit the public CA file at `server/certs/aiven-ca.pem` (remove the `.gitignore` rule for this file), or
  2. Add a Render **Secret File** mounted at `/etc/secrets/aiven-ca.pem` and set `AIVEN_CA_CERT_PATH=/etc/secrets/aiven-ca.pem`.

## 6. Verify

```bash
npm run dev:api
# ✅ Database connected (Aiven PostgreSQL, TLS verify on)
curl http://localhost:4000/health
```

If you see `SELF_SIGNED_CERT_IN_CHAIN` or `unable to get local issuer certificate`, the wrong CA is in place (for example, a project CA is required). If you see `ECONNREFUSED`/timeouts, check the allow-list and that the port matches the Service URI.

## 7. Schema

For the scaffold, `npm run db:sync` creates the tables with `sequelize.sync()`. Before launch, replace this with versioned Sequelize migrations (the models already use snake_case columns and UUID primary keys, so migrations are straightforward). Never run `sync({ alter: true })` against production.
