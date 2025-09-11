import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import AdminTestimonialsPage from "../components/AdminTestimonialPage";

export default async function TestimonialPage() {
  const user = await currentUser();

  if (!user || user.publicMetadata.role !== "admin") {
    redirect("/");
  }

  return <AdminTestimonialsPage />;
}
