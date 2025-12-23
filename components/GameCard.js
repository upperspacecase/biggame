"use client";

// Lightning bolt icon for energy indicator
const LightningIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
);

// People icon for player count
const PeopleIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
);

// Clock icon for duration
const ClockIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
    </svg>
);

// Heart icon for favorites
const HeartIcon = ({ filled }) => (
    <svg viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" style={{ width: 24, height: 24 }}>
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
);

export default function GameCard({ game, onClick, isFavorite = false, onFavorite }) {
    if (!game) return null;

    const {
        _id,
        number = "#???",
        name = "Unknown Game",
        subtitle,
        tags = [],
        playerCount = { min: 2, max: 4 },
        duration = { min: 5, max: 10 },
        energy: _energy = "Medium",
        energyColor = "yellow",
        tagline,
    } = game;

    const energyClass = {
        yellow: "medium",
        blue: "low",
        red: "high",
    }[energyColor] || "medium";

    const formatDuration = () => {
        if (duration.max && duration.max !== duration.min) {
            return `${duration.min}-${duration.max} MIN`;
        }
        return `${duration.min} MIN`;
    };

    const handleFavoriteClick = (e) => {
        e.stopPropagation();
        onFavorite?.(_id);
    };

    return (
        <div className="game-card" onClick={() => onClick?.(game)}>
            <div className="game-card-content">
                {/* Game Number */}
                <span className="game-number">{number}</span>

                {/* Favorite Button */}
                {onFavorite && (
                    <button
                        onClick={handleFavoriteClick}
                        style={{
                            position: "absolute",
                            top: "24px",
                            right: "80px",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: isFavorite ? "var(--accent-red)" : "var(--text-muted)",
                            transition: "transform 0.2s, color 0.2s",
                        }}
                        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                    >
                        <HeartIcon filled={isFavorite} />
                    </button>
                )}

                {/* Energy Indicator */}
                <div className={`energy-indicator ${energyClass}`}>
                    <LightningIcon />
                </div>

                {/* Title */}
                <h2 className="game-title">{name}</h2>

                {/* Subtitle */}
                {subtitle && <p className="game-subtitle">{subtitle}</p>}

                {/* Tags */}
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "8px" }}>
                    {tags.map((tag, i) => (
                        <span key={i} className="game-tag">{tag}</span>
                    ))}
                </div>

                {/* Stats Row */}
                <div className="stats-row">
                    <div className="stat-item">
                        <PeopleIcon />
                        <span>{playerCount.min}-{playerCount.max}</span>
                    </div>
                    <div className="stat-item">
                        <ClockIcon />
                        <span>{formatDuration()}</span>
                    </div>
                </div>

                {/* Tagline */}
                {tagline && <p className="game-tagline">&ldquo;{tagline}&rdquo;</p>}
            </div>
        </div>
    );
}
