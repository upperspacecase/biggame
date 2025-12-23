"use client";

import { useState } from "react";
import config from "@/config";
import { useUser, useClerk } from "@clerk/nextjs";

// Checkmark icon
const CheckIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20, color: "var(--accent-green)" }}>
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

const CloseIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

export default function PricingModal({ onClose }) {
    const { user, isSignedIn } = useUser();
    const { openSignIn } = useClerk();
    const [isLoading, setIsLoading] = useState(false);

    const plan = config.stripe.plans[0];

    const handleCheckout = async () => {
        if (!isSignedIn) {
            openSignIn();
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch("/api/stripe/create-checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    priceId: plan.priceId,
                    successUrl: window.location.href,
                    cancelUrl: window.location.href,
                }),
            });

            const { url } = await res.json();

            if (url) {
                window.location.href = url;
            } else {
                console.error("No checkout URL returned");
                setIsLoading(false);
            }
        } catch (e) {
            console.error(e);
            setIsLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="modal-content" style={{ maxWidth: "420px", background: "white", padding: 0, overflow: "hidden" }}>
                {/* Header Image/Gradient */}
                <div style={{
                    height: "120px",
                    background: "linear-gradient(135deg, var(--accent-red), var(--accent-orange))",
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}>
                    <button
                        onClick={onClose}
                        style={{
                            position: "absolute",
                            top: "16px",
                            right: "16px",
                            background: "rgba(255,255,255,0.2)",
                            border: "none",
                            borderRadius: "50%",
                            width: "32px",
                            height: "32px",
                            color: "white",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                    >
                        <CloseIcon />
                    </button>
                    <div style={{ fontSize: "48px" }}>💎</div>
                </div>

                <div style={{ padding: "32px 24px" }}>
                    <div style={{ textAlign: "center", marginBottom: "24px" }}>
                        <h2 style={{ fontSize: "24px", fontWeight: 900, fontFamily: '"Nunito", sans-serif', marginBottom: "8px" }}>
                            Unlock Full Access
                        </h2>
                        <p style={{ color: "var(--text-muted)", fontSize: "16px", lineHeight: 1.5 }}>
                            One time purchase. Lifetime access.<br />
                            No subscriptions, ever.
                        </p>
                    </div>

                    {/* Features List */}
                    <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px" }}>
                        {plan.features.map((feature, i) => (
                            <li key={i} style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px", fontSize: "16px", fontWeight: 600 }}>
                                <div style={{
                                    background: "var(--tag-bg)",
                                    borderRadius: "50%",
                                    padding: "4px",
                                    display: "flex"
                                }}>
                                    <CheckIcon />
                                </div>
                                {feature.name}
                            </li>
                        ))}
                    </ul>

                    {/* Price & CTA */}
                    <div style={{ textAlign: "center" }}>
                        <div style={{ marginBottom: "16px" }}>
                            <span style={{ fontSize: "32px", fontWeight: 900, color: "var(--text-brown)" }}>${plan.price}</span>
                            <span style={{ fontSize: "20px", textDecoration: "line-through", color: "var(--text-muted)", marginLeft: "8px", fontWeight: 600 }}>${plan.priceAnchor}</span>
                        </div>

                        <button
                            onClick={handleCheckout}
                            disabled={isLoading}
                            className="btn-gradient"
                            style={{
                                width: "100%",
                                padding: "16px",
                                borderRadius: "16px",
                                fontSize: "18px",
                                fontWeight: 800,
                                cursor: isLoading ? "wait" : "pointer",
                                border: "3px solid var(--border-dark)",
                                textTransform: "uppercase",
                                letterSpacing: "1px"
                            }}
                        >
                            {isLoading ? "Loading..." : "Get Lifetime Access"}
                        </button>
                        <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "12px" }}>
                            Secure payment via Stripe
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
