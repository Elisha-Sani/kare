import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import AdminRequestsPage from "../components/AdminRequestPage";

export default async function RequestPage() {
  const user = await currentUser();

  if (!user || user.publicMetadata.role !== "admin") {
    redirect("/");
  }
  return <AdminRequestsPage />;
}
