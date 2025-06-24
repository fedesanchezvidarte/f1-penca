import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function requireAuth() {
  const session = await auth();
  
  if (!session) {
    redirect("/auth/signin");
  }
  
  return session;
}

export async function requireAdmin() {
  const session = await auth();
  
  if (!session) {
    redirect("/auth/signin");
  }
  
  if (session.user.role !== "ADMIN") {
    redirect("/");
  }
  
  return session;
}
