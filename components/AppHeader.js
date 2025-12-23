"use client";

import Image from "next/image";

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

            {/* Add Button - Fixed position */}
            {onAddClick && (
                <button className="add-button" onClick={onAddClick} aria-label="Add game">
                    <PlusIcon />
                </button>
            )}

            {/* Divider */}
            <div className="divider" />
        </>
    );
}
