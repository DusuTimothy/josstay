# Aiven CA certificate

Place the certificate downloaded from the Aiven console here as:

```
server/certs/aiven-ca.pem
```

Set the path in `server/.env`:

```env
AIVEN_CA_CERT_PATH=./certs/aiven-ca.pem
DB_SSL=true
```

The API reads this file at startup and uses it for TLS certificate verification
(`rejectUnauthorized: true`). See [`../../../AIVEN-SETUP.md`](../../../AIVEN-SETUP.md)
for step-by-step instructions.

`*.pem` files are ignored by git by default. The Aiven CA is a public root
certificate and can be committed if your deployment needs it — remove the
relevant rule in `.gitignore` or mount it as a secret file instead.
