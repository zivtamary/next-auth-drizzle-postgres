This repository implements **Next.js 13 App Router**, with **Next-Auth** for sessions, **Drizzle ORM** + **NextAuth Drizzle Adapter** and **PostgresDB**

## 

After cloning the repo, create **.env** file with the following

```
DATABASE_URL='postgres://YOUR_DATABASE_URL'

NEXTAUTH_SECRET=
NEXTAUTH_URL=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

Run ```npm run db:push``` to migrate the schema in the database

And you are ready to go!
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

<sup>Props to [@mschieller](https://github.com/mschieller) for creating the drizzle adapter!</sup>