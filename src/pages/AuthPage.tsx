"use client";

import AuthLayout from "../components/ui/smart-hover-auth-layout";

// Route: /auth
// This is the existing authentication page, moved here from src/App.tsx unchanged.
export default function AuthPage() {
  return (
    <div className="dark w-full h-full min-h-screen font-sans">
      <AuthLayout>
        <div className="flex flex-col gap-4">
          <div className="mb-4 text-center">
            <h2 className="text-3xl font-black text-neutral-900 dark:text-white mb-2 tracking-tight">Welcome Back</h2>
            <p className="text-neutral-500 dark:text-neutral-400 font-medium">Sign in to your account</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-1">Email Address</label>
              <input
                type="email"
                placeholder="hello@21st.dev"
                className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all font-medium"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-bold text-neutral-700 dark:text-neutral-300">Password</label>
                <a href="#" className="text-xs font-bold text-orange-500 hover:text-orange-600">Forgot?</a>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all font-medium"
              />
            </div>
          </div>

          <button className="w-full py-3.5 mt-6 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-black text-lg transition-all shadow-[0_8px_30px_rgb(249,115,22,0.3)] hover:shadow-[0_8px_30px_rgb(249,115,22,0.5)] hover:-translate-y-1 active:translate-y-0">
            Sign In
          </button>

          <p className="text-center text-sm font-medium text-neutral-500 dark:text-neutral-400 mt-6">
            Don&apos;t have an account?{" "}
            <a href="#" className="text-orange-500 font-bold hover:underline">Create one</a>
          </p>
        </div>
      </AuthLayout>
    </div>
  );
}
