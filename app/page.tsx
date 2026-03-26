import { redirect } from "next/navigation"

export default function Home() {
  // Academy standalone — root redirects to academy dashboard
  redirect("/explorar")
}
