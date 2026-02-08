# gator

Gator is an RSS Feed aggregator written in TypeScript. There is also [a Go version](https://github.com/morauszkia/gator).

## Prerequisites and Config

To run gator, you will need Node.js and npm, which you can intall by following the instructions [on their webpage](https://nodejs.org/en), or you can use [nvm](https://github.com/nvm-sh/nvm) to manage you Node.js installations. In the latter case you can run `nvm use` in the root of the project to use the same Node.js version that was used during development.

You will also need PostgreSQL. For information about the installation visit the [PostgreSQL](https://www.postgresql.org/) website. You need to create a database for gator. You can use `psql` to connect to your PostgreSQL server.

```bash
sudo -u postgres psql
```

And then you can run the query to create the database. I named mine `gator`

```sql
CREATE DATABASE gator;
```

You need to create a `.gatorconfig.json` file in your home directory. This config file should contain the URL of your database (key `db_url`).
The URL may have different structure depending on your OS.

```json
{
    "db_url": "postgres://<user>:<passwd>@localhost:<port>/<db-name>?sslmode=disable"
}
```

After installing Node.js and PostgreSQL, and setting up the database and providing the url in the config file, run the following commands in the project root folder:

```bash
nvm use
npm install
npm run migrate
```

This will use the correct Node.js version, install project dependencies and migrate your database to the desired state.

## Usage

After this you can run `npm start` with one of the following commands:

- `register <user-name>`: register new user
- `login <user-name>`: log user in (set as current user)
- `reset`: will delete all users, and their feeds, feed follows, posts, etc.
- `users`: list registered users
- `agg <duration>`: run aggregate loop and fetch last fetched feed with the specified timeout between fetches
- `addfeed <feed-name> <url>`: add new feed (will automatically follow it)
- `feeds`: list registered feeds
- `follow <url>`: follow specified feed by current user
- `following`: list feeds followed by current user
- `unfollow <url>`: unfollow specified feed by current user
- `browse [limit]`: list latest posts from the followed feeds with title, feed name, url, publication date

When you register a new user, they are automatically logged in as the current user. When you add a new feed, it is also automatically followed by the current user. A simple example flow:

```bash
npm start register johndoe
npm start addfeed ExampleFeed "https://example.com/rss"
npm start agg 30s
```

Then in a separate terminal or after exiting the aggregation loop with `Ctrl+C`, you can run

```bash
npm start browse 5
```

This will show you the five most recent posts in you database.
