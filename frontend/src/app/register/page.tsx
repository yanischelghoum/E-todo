"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (
      !username ||
      !firstname ||
      !lastname ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          firstname,
          lastname,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.msg || "An error occurred while registering.");
        return;
      }

      const { token } = data;
      console.log("Register token:", token);
      localStorage.setItem("token", token);

      setSuccessMessage("Account created successfully!");
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
            Register
          </h1>
        </div>

        <div className="space-y-8 text-slate-100">
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent outline-none text-slate-100 placeholder:text-slate-500 text-base"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-3 text-slate-200">
              <span className="w-5 h-5 flex items-center justify-center text-slate-300">
                @
              </span>
              <span className="text-sm uppercase tracking-[0.25em] text-slate-300">
                Username
              </span>
            </div>
            <div className="border-b border-slate-400/70 pb-1">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-transparent outline-none text-slate-100 placeholder:text-slate-500 text-base"
                placeholder="Choose a username"
              />
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-sm uppercase tracking-[0.25em] text-slate-300">
              First name
            </span>
            <div className="border-b border-slate-400/70 pb-1">
              <input
                type="text"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                className="w-full bg-transparent outline-none text-slate-100 placeholder:text-slate-500 text-base"
                placeholder="Enter your first name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-sm uppercase tracking-[0.25em] text-slate-300">
              Last name
            </span>
            <div className="border-b border-slate-400/70 pb-1">
              <input
                type="text"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                className="w-full bg-transparent outline-none text-slate-100 placeholder:text-slate-500 text-base"
                placeholder="Enter your last name"
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

          <div className="space-y-2">
            <div className="flex items-center gap-3 text-slate-200">
              <Lock className="w-5 h-5" />
              <span className="text-sm uppercase tracking-[0.25em] text-slate-300">
                Confirm Password
              </span>
            </div>
            <div className="border-b border-slate-400/70 pb-1">
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-transparent outline-none text-slate-100 placeholder:text-slate-500 text-base"
                placeholder="Re-enter your password"
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              onClick={handleSubmit}
              className="w-full py-3 rounded bg-slate-700 hover:bg-slate-600 text-white tracking-[0.3em] uppercase text-sm font-medium shadow-lg shadow-slate-900/50"
            >
              Register
            </button>
          </div>

          {errorMessage && (
            <p className="text-red-400 text-sm text-center mt-2">
              {errorMessage}
            </p>
          )}

          {successMessage && (
            <p className="text-emerald-400 text-sm text-center mt-2">
              {successMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
