"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../lib/auth-context";

function LogoMark() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
      <path
        d="M0,10 L5,10 L7,3 L10,17 L13,7 L15,10 L20,10"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Navbar() {
  const { token, username, ready, logout } = useAuth();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <header className="navbar">
      <div className="container">
        <div className="navInner">
          <Link href="/" className="brand">
            <LogoMark />
            Pulse
          </Link>

          <div className="navActions">
            {!ready ? null : token ? (
              <>
                <span className="navUser">{username}</span>
                <Link href="/dashboard" className="btn btnGhost">
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="btn btnGhost">
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link href="/signin" className="btn btnGhost">
                  Sign in
                </Link>
                <Link href="/signup" className="btn btnPrimary">
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
