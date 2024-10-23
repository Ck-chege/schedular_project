import { createClient } from "@/utils/supabase/server";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  const supabase = createClient()
  supabase.auth.signOut()
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <LoginForm />
    </div>
  )
}