import { LoginForm } from "@/components/auth/LoginForm"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-6 rounded-xl shadow bg-white dark:bg-zinc-900">
        <h1 className="text-xl font-semibold mb-4 text-center">Login</h1>
        <LoginForm />
      </div>
    </div>
  )
}
