import { Button } from "~/components/ui/Button";
import { db } from "~/drizzle";
import { getAuthSession } from "~/lib/auth";

export default async function Home() {
  const session = await getAuthSession();
  const test = await db.query.user.findMany();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 gap-8">
      <Button session={session} />
      <div className="">User logged in: {session?.user ? "true" : "false"}</div>
      {session?.user && <p>{session.user.email}</p>}
      {JSON.stringify(test)}
    </main>
  );
}
