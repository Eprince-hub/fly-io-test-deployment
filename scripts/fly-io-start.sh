#!/usr/bin/env bash

# Exit if any command exits with a non-zero exit code
set -o errexit

if [[ ! -f /postgres-volume/run/postgresql/data/postgresql.conf ]]; then
  echo "❗️ No PostgreSQL database found, run the setup script"
  sleep infinity
fi

echo "Setting up PostgreSQL on Fly.io..."
su postgres -c "pg_ctl start -D /postgres-volume/run/postgresql/data"

pnpm migrate up
./node_modules/.bin/next start


# I don't have so much detail right now about this issue, but i was able to reproduce the problem in my own project and i would want you to try these steps
# Run fly ssh issue --agent You will get some prompt to select your Organization (I assume you have just one) so you just press enter
# Open the URL of your deployed project and while it is loading or running on the browser
# Run the flyctl ssh console --app <app name>   again. <app name>  = your app name
