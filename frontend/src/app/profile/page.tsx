"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, getToken, removeToken } from "../../utils/api";
import type { User } from "../../utils/api";

export default function ProfilePage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const token = getToken();
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const user = (await getCurrentUser()) as User;
        setUsername(user.username);
        setFirstname(user.firstname);
        setLastname(user.lastname);
        setEmail(user.email);
        setPhone(user.phone || "");
      } catch {
        removeToken();
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const token = getToken();
      if (!token) {
        router.push("/login");
        return;
      }

      const res = await fetch("http://localhost:3000/user/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username,
          firstname,
          lastname,
          email,
          phone,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || data.msg || "Failed to update profile.");
        return;
      }

      setSuccess("Profile updated successfully.");
    } catch {
      setError("Unable to contact server.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-slate-900 to-slate-950 text-slate-100">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-slate-900 to-slate-950 text-slate-100">
      <div className="w-full max-w-xl px-6 sm:px-10 space-y-8">
        <h1 className="text-3xl sm:text-4xl font-light tracking-[0.25em] uppercase text-center">
          Profile
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-[0.25em] text-slate-300 mb-1">
              Username
            </label>
            <input
              className="w-full bg-slate-950/60 border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-[0.25em] text-slate-300 mb-1">
              First name
            </label>
            <input
              className="w-full bg-slate-950/60 border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-[0.25em] text-slate-300 mb-1">
              Last name
            </label>
            <input
              className="w-full bg-slate-950/60 border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-[0.25em] text-slate-300 mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full bg-slate-950/60 border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-[0.25em] text-slate-300 mb-1">
              Phone
            </label>
            <input
              className="w-full bg-slate-950/60 border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded bg-slate-700 hover:bg-slate-600 text-white tracking-[0.3em] uppercase text-sm font-medium shadow-lg shadow-slate-900/50"
          >
            Save changes
          </button>

          {error && (
            <p className="text-red-400 text-sm text-center mt-2">{error}</p>
          )}
          {success && (
            <p className="text-emerald-400 text-sm text-center mt-2">
              {success}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
