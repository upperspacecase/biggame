"use client";

const ShuffleIcon = () => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ width: 20, height: 20 }}
    >
        <polyline points="16 3 21 3 21 8" />
        <line x1="4" y1="20" x2="21" y2="3" />
        <polyline points="21 16 21 21 16 21" />
        <line x1="15" y1="15" x2="21" y2="21" />
        <line x1="4" y1="4" x2="9" y2="9" />
    </svg>
);

const CrownIcon = () => (
    <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="crown-icon"
    >
        <path d="M2.5 19h19v2h-19v-2zm19.57-9.36c-.21-.8-1.04-1.28-1.84-1.06l-2.96.79-2.79-4.65c-.2-.34-.55-.58-.94-.67h-.01c-.4-.08-.81.02-1.14.25L12 4.97l-.4-.67c-.32-.23-.74-.33-1.14-.25h-.01c-.39.09-.74.33-.94.67L6.72 9.37l-2.96-.79c-.8-.22-1.63.26-1.84 1.06-.22.8.26 1.63 1.06 1.84l4.04 1.08L8.8 17h6.4l1.78-4.44 4.04-1.08c.8-.22 1.28-1.04 1.06-1.84z" />
    </svg>
);

// Category filters (free)
const CATEGORIES = [
    { name: "Chaotic", key: "Chaotic" },
    { name: "Chill", key: "Chill" },
    { name: "Competitive", key: "Competitive" },
    { name: "Family", key: "Family" },
];

// Special filters (some premium)
const SPECIAL_FILTERS = [
    { name: "⚡ Quick (<5 min)", key: "quick", isPremium: true },
    { name: "👥 Large Groups (8+)", key: "large", isPremium: true },
    { name: "🎯 No Props", key: "noprops", isPremium: true },
    { name: "🔥 High Energy", key: "High" },
    { name: "😌 Low Energy", key: "Low" },
];

export default function CategoryFilters({
    activeFilter,
    onFilterChange,
    onRandomClick,
}) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Main Buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <button
                    className="btn-all"
                    onClick={() => onFilterChange("all")}
                    style={{
                        opacity: activeFilter === "all" ? 1 : 0.8,
                        transform: activeFilter === "all" ? "scale(1.02)" : "scale(1)"
                    }}
                >
                    All
                </button>
                <button className="btn-random" onClick={onRandomClick}>
                    <ShuffleIcon />
                    Random
                </button>
            </div>

            {/* Category Tags */}
            <div style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: "8px",
                marginTop: "8px"
            }}>
                {CATEGORIES.map((category) => {
                    const isActive = activeFilter === category.key;

                    return (
                        <button
                            key={category.key}
                            className={`category-tag ${isActive ? "active" : ""}`}
                            onClick={() => onFilterChange(category.key)}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                cursor: "pointer"
                            }}
                        >
                            {category.name}
                        </button>
                    );
                })}
            </div>

            {/* Special Filters */}
            <div style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: "6px",
                paddingTop: "8px",
                borderTop: "2px dashed var(--border-light)"
            }}>
                {SPECIAL_FILTERS.map((filter) => {
                    const isActive = activeFilter === filter.key;

                    return (
                        <button
                            key={filter.key}
                            className={`category-tag ${isActive ? "active" : ""} ${filter.isPremium ? "premium" : ""}`}
                            onClick={() => !filter.isPremium && onFilterChange(filter.key)}
                            disabled={filter.isPremium}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                cursor: filter.isPremium ? "not-allowed" : "pointer",
                                fontSize: "12px",
                                padding: "6px 12px",
                            }}
                        >
                            {filter.name}
                            {filter.isPremium && <CrownIcon />}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
