# Local credentials

The deployed `restoration/standalone-demo` branch uses local demo news and
does not call Marketaux. No API token is needed to run or restore the demo.

`.env.example` documents `MARKETAUX_API_TOKEN` for an optional future
server-side integration. A local `.env` may retain a separately managed token;
it is ignored by Git and Docker and is not read by the frontend or container.

Never read this token from browser code or expose it through Parcel/Vite build
variables: a build-time environment variable used by frontend code becomes
public JavaScript. A future live-news integration needs a server-side proxy.

Both historically committed Marketaux tokens were removed from Git history.
The archived `master` integration no longer sends direct provider requests.
Revoke/replace exposed tokens at the provider before any future use; removing
them from Git does not invalidate old copies.
