"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setErrorMessage("");

    const email = identifier;

    if (!email || !password) {
      setErrorMessage("Please enter email and password.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.msg || "Login failed.");
        return;
      }

      const { token } = data;
      console.log("Login token:", token);
      localStorage.setItem("token", token);


      router.push("/dashboard");
    } catch (err) {
      setErrorMessage("Unable to contact server.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-slate-900 to-slate-950">
      <div className="w-full max-w-xl px-6 sm:px-10">
        <div className="flex flex-col items-center mb-16">
          <div className="w-16 h-16 rounded-full border border-slate-400 flex items-center justify-center mb-6">
            <span className="text-4xl text-slate-300">👤</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-light tracking-[0.25em] text-slate-100 uppercase">
            User Login
          </h1>
        </div>

        <div className="space-y-10 text-slate-100">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-slate-200">
              <Mail className="w-5 h-5" />
              <span className="text-sm uppercase tracking-[0.25em] text-slate-300">
                Email ID
              </span>
            </div>
            <div className="border-b border-slate-400/70 pb-1">
              <input
                type="email"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full bg-transparent outline-none text-slate-100 placeholder:text-slate-500 text-base"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-3 text-slate-200">
              <Lock className="w-5 h-5" />
              <span className="text-sm uppercase tracking-[0.25em] text-slate-300">
                Password
              </span>
            </div>
            <div className="border-b border-slate-400/70 pb-1">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent outline-none text-slate-100 placeholder:text-slate-500 text-base"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs sm:text-sm text-slate-300">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-slate-400 bg-transparent text-blue-400 focus:ring-blue-400"
              />
              <span>Remember me</span>
            </label>

            <button
              type="button"
              className="text-slate-300/90 hover:text-white italic"
            >
              Forgot Password?
            </button>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              onClick={handleSubmit}
              className="w-full py-3 rounded bg-slate-700 hover:bg-slate-600 text-white tracking-[0.3em] uppercase text-sm font-medium shadow-lg shadow-slate-900/50"
            >
              Login
            </button>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => router.push("/register")}
              className="w-full py-2 rounded border border-slate-500 text-slate-200 hover:bg-slate-800 hover:border-slate-400 text-xs sm:text-sm tracking-[0.2em] uppercase"
            >
              New user? Register
            </button>
          </div>

          {errorMessage && (
            <p className="text-red-400 text-sm text-center mt-2">
              {errorMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
