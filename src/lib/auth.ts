import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

type AdminResult =
  | {
      user: Awaited<
        ReturnType<Awaited<ReturnType<typeof clerkClient>>["users"]["getUser"]>
      >;
      error?: undefined;
    }
  | { user?: undefined; error: NextResponse };

export async function requireAdmin(): Promise<AdminResult> {
  const { userId } = await auth();

  if (!userId) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
  const clerk = await clerkClient();
  const user = await clerk.users.getUser(userId);

  if (user.publicMetadata.role !== "admin") {
    return {
      error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return { user };
}
