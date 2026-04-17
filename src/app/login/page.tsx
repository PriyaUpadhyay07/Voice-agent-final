"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PhoneCall, Mail, Lock, Loader2, LogIn } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();
  
  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
        setLoading(false);
      } else {
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred");
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    signIn("google");
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
      <div className="glass-card animate-fade-in" style={{ width: "100%", maxWidth: "400px", padding: "2.5rem" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <PhoneCall size={40} color="hsl(var(--primary))" style={{ marginBottom: "1rem" }} />
          <h1 style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>Welcome Back</h1>
          <p style={{ color: "hsl(var(--muted-foreground))", fontSize: "0.9rem" }}>
            Log in to manage your AI Voice Agent
          </p>
        </div>

        {error && (
          <div style={{ 
            background: "rgba(239, 68, 68, 0.1)", 
            border: "1px solid rgba(239, 68, 68, 0.2)", 
            color: "#f87171", 
            padding: "0.75rem", 
            borderRadius: "var(--radius)", 
            fontSize: "0.85rem", 
            marginBottom: "1.5rem",
            textAlign: "center"
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleCredentialsLogin} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div style={{ position: "relative" }}>
            <Mail size={18} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "hsl(var(--muted-foreground))" }} />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ paddingLeft: "2.75rem" }}
            />
          </div>

          <div style={{ position: "relative" }}>
            <Lock size={18} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "hsl(var(--muted-foreground))" }} />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ paddingLeft: "2.75rem" }}
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading} style={{ width: "100%", height: "3rem" }}>
            {loading ? <Loader2 size={20} className="animate-spin" /> : "Sign In"}
          </button>
        </form>

        <div style={{ display: "flex", alignItems: "center", margin: "1.5rem 0", gap: "1rem" }}>
          <div style={{ flex: 1, height: "1px", background: "hsl(var(--border))" }}></div>
          <span style={{ fontSize: "0.8rem", color: "hsl(var(--muted-foreground))" }}>OR</span>
          <div style={{ flex: 1, height: "1px", background: "hsl(var(--border))" }}></div>
        </div>

        <button 
          onClick={handleGoogleLogin} 
          className="btn-outline" 
          disabled={googleLoading}
          style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem", height: "3rem" }}
        >
          {googleLoading ? <Loader2 size={20} className="animate-spin" /> : <><LogIn size={20} /> Continue with Google</>}
        </button>

        {/* Removed Sign Up link as requested */}
      </div>
    </div>
  );
}
