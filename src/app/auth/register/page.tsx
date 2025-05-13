import { RegisterForm } from "@/components/auth/RegisterForm"

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-6 rounded-xl shadow bg-white dark:bg-zinc-900">
        <h1 className="text-xl font-semibold mb-4 text-center">Register</h1>
        <RegisterForm />
      </div>
    </div>
  )
}
