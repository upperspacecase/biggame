"use client";

// Icons
const LightningIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 24, height: 24 }}>
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
);

const PeopleIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24 }}>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
);

const ClockIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24 }}>
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
    </svg>
);

const CloseIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

const ShareIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
);

export default function GameDetailModal({ game, onClose }) {
    if (!game) return null;

    const {
        name,
        tags = [],
        playerCount = { min: 2, max: 4 },
        duration = { min: 5, max: 10 },
        energy = "Medium",
        setup = [],
        rules = [],
        tips = [],
    } = game;

    const formatDuration = () => {
        if (duration.max && duration.max !== duration.min) {
            return `${duration.min}-${duration.max} min`;
        }
        return `${duration.min} min`;
    };

    const handleShare = async () => {
        const shareData = {
            title: name,
            text: `Check out this party game: ${name}`,
            url: window.location.href,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch {
                console.log("Share cancelled");
            }
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href);
            alert("Link copied to clipboard!");
        }
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={handleBackdropClick}>
            <div className="modal-content">
                {/* Header */}
                <div className="modal-header">
                    <button className="modal-close" onClick={onClose}>
                        <CloseIcon />
                    </button>

                    {/* Tags */}
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
                        {tags.map((tag, i) => (
                            <span key={i} className="game-tag" style={{ background: "white" }}>{tag}</span>
                        ))}
                    </div>

                    {/* Title */}
                    <h1 style={{
                        fontFamily: '"Playfair Display", serif',
                        fontWeight: 900,
                        fontSize: "32px",
                        lineHeight: 1.1,
                        color: "white",
                        textTransform: "uppercase",
                    }}>
                        {name}
                    </h1>
                </div>

                {/* Body */}
                <div className="modal-body">
                    {/* Stats Grid */}
                    <div className="stats-grid">
                        <div className="stat-box">
                            <PeopleIcon />
                            <div className="stat-box-label">Players</div>
                            <div className="stat-box-value">{playerCount.min}-{playerCount.max}</div>
                        </div>
                        <div className="stat-box">
                            <ClockIcon />
                            <div className="stat-box-label">Time</div>
                            <div className="stat-box-value">{formatDuration()}</div>
                        </div>
                        <div className="stat-box">
                            <LightningIcon />
                            <div className="stat-box-label">Energy</div>
                            <div className="stat-box-value">{energy}</div>
                        </div>
                    </div>

                    {/* Setup Section */}
                    {setup.length > 0 && (
                        <>
                            <div className="section-header">
                                <div className="section-dot" />
                                <span className="section-title">Setup</span>
                            </div>
                            <ol className="game-list">
                                {setup.map((item, i) => (
                                    <li key={i}>
                                        <span className="list-number">{i + 1}.</span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ol>
                        </>
                    )}

                    {/* Rules Section */}
                    {rules.length > 0 && (
                        <>
                            <div className="section-header">
                                <div className="section-dot" />
                                <span className="section-title">How to Play</span>
                            </div>
                            <ol className="game-list">
                                {rules.map((item, i) => (
                                    <li key={i}>
                                        <span className="list-number">{i + 1}.</span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ol>
                        </>
                    )}

                    {/* Tips Section */}
                    {tips.length > 0 && (
                        <>
                            <div className="section-header">
                                <div className="section-dot" style={{ background: "var(--accent-gold)" }} />
                                <span className="section-title">Tips</span>
                            </div>
                            <ol className="game-list">
                                {tips.map((item, i) => (
                                    <li key={i}>
                                        <span className="list-number">•</span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ol>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="modal-footer">
                    <button className="btn-share" onClick={handleShare} style={{ flex: 1, justifyContent: "center" }}>
                        <ShareIcon />
                        Share Game
                    </button>
                </div>
            </div>
        </div>
    );
}
