"use client";

import Image from "next/image";
import { SignInButton, UserButton, SignedIn, SignedOut } from "@clerk/nextjs";

const PlusIcon = () => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

export default function AppHeader({ onAddClick }) {
    return (
        <>
            <header className="app-header">
                {/* Logo */}
                <Image
                    src="/logo.png"
                    alt="BIG game"
                    width={180}
                    height={100}
                    className="app-logo"
                    priority
                />
            </header>

            {/* Top Right Actions (Fixed) */}
            <div style={{
                position: "fixed",
                top: "24px",
                right: "24px",
                zIndex: 50,
                display: "flex",
                alignItems: "center",
                gap: "12px"
            }}>
                {/* Add Button */}
                {onAddClick && (
                    <>
                        <SignedIn>
                            <button
                                className="add-button"
                                onClick={onAddClick}
                                aria-label="Add game"
                                style={{ position: "static", margin: 0 }}
                            >
                                <PlusIcon />
                            </button>
                        </SignedIn>
                        <SignedOut>
                            <SignInButton mode="modal">
                                <button
                                    className="add-button"
                                    aria-label="Sign in to add game"
                                    style={{ position: "static", margin: 0 }}
                                >
                                    <PlusIcon />
                                </button>
                            </SignInButton>
                        </SignedOut>
                    </>
                )}

                {/* Auth Buttons */}
                <SignedOut>
                    <SignInButton mode="modal">
                        <button style={{
                            padding: "8px 16px",
                            background: "var(--text-brown)",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            fontWeight: "bold",
                            cursor: "pointer",
                            boxShadow: "0 4px 0 rgba(0,0,0,0.2)"
                        }}>
                            Sign In
                        </button>
                    </SignInButton>
                </SignedOut>
                <SignedIn>
                    <UserButton afterSignOutUrl="/" />
                </SignedIn>
            </div>

            {/* Divider */}
            <div className="divider" />
        </>
    );
}
