"use client";

import { useState } from "react";

const CloseIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

const CATEGORIES = ["Family", "Chill", "Chaotic", "Competitive"];
const ENERGY_LEVELS = [
    { value: "Low", color: "blue" },
    { value: "Medium", color: "yellow" },
    { value: "High", color: "red" },
];

export default function AddGameModal({ onClose, onGameAdded, editGame = null }) {
    const isEditMode = !!editGame;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        name: editGame?.name || "",
        subtitle: editGame?.subtitle || "",
        tags: editGame?.tags || [],
        playerMin: editGame?.playerCount?.min || 2,
        playerMax: editGame?.playerCount?.max || 8,
        durationMin: editGame?.duration?.min || 5,
        durationMax: editGame?.duration?.max || 10,
        energy: editGame?.energy || "Medium",
        energyColor: editGame?.energyColor || "yellow",
        tagline: editGame?.tagline || "",
        setup: editGame?.setup?.join("\n") || "",
        rules: editGame?.rules?.join("\n") || "",
        tips: editGame?.tips?.join("\n") || "",
        videoUrl: editGame?.videoUrl || "",
    });

    const handleTagToggle = (tag) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.includes(tag)
                ? prev.tags.filter(t => t !== tag)
                : [...prev.tags, tag]
        }));
    };

    const handleEnergyChange = (level) => {
        setFormData(prev => ({
            ...prev,
            energy: level.value,
            energyColor: level.color,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const gameData = {
                name: formData.name,
                subtitle: formData.subtitle || undefined,
                tags: formData.tags,
                playerCount: {
                    min: parseInt(formData.playerMin),
                    max: parseInt(formData.playerMax),
                },
                duration: {
                    min: parseInt(formData.durationMin),
                    max: parseInt(formData.durationMax),
                },
                energy: formData.energy,
                energyColor: formData.energyColor,
                tagline: formData.tagline || undefined,
                setup: formData.setup ? formData.setup.split("\n").filter(s => s.trim()) : [],
                rules: formData.rules ? formData.rules.split("\n").filter(s => s.trim()) : [],
                tips: formData.tips ? formData.tips.split("\n").filter(s => s.trim()) : [],
                videoUrl: formData.videoUrl || undefined,
                isPremium: false,
            };

            const url = isEditMode ? `/api/games/${editGame._id}` : "/api/games";
            const method = isEditMode ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(gameData),
            });

            if (!response.ok) {
                throw new Error(isEditMode ? "Failed to update game" : "Failed to add game");
            }

            onGameAdded?.();
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={handleBackdropClick}>
            <div className="modal-content" style={{ maxHeight: "95vh" }}>
                {/* Header */}
                <div className="modal-header" style={{ padding: "20px 24px" }}>
                    <button className="modal-close" onClick={onClose}>
                        <CloseIcon />
                    </button>
                    <h1 style={{
                        fontFamily: '"Nunito", sans-serif',
                        fontWeight: 900,
                        fontSize: "24px",
                        color: "white",
                    }}>
                        {isEditMode ? "Edit Game" : "Add New Game"}
                    </h1>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="modal-body" style={{ paddingBottom: "0" }}>
                        {error && (
                            <div style={{ color: "var(--accent-red)", marginBottom: "16px", fontWeight: 600 }}>
                                {error}
                            </div>
                        )}

                        {/* Game Name */}
                        <div style={{ marginBottom: "16px" }}>
                            <label style={{ display: "block", fontWeight: 700, marginBottom: "6px" }}>
                                Game Name *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="e.g. Marshmallow Toss"
                                style={{
                                    width: "100%",
                                    padding: "12px 16px",
                                    border: "2px solid var(--border-dark)",
                                    borderRadius: "12px",
                                    fontSize: "16px",
                                    fontFamily: "inherit",
                                }}
                            />
                        </div>

                        {/* Subtitle */}
                        <div style={{ marginBottom: "16px" }}>
                            <label style={{ display: "block", fontWeight: 700, marginBottom: "6px" }}>
                                Subtitle
                            </label>
                            <input
                                type="text"
                                value={formData.subtitle}
                                onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                                placeholder="e.g. Classic Aim Game"
                                style={{
                                    width: "100%",
                                    padding: "12px 16px",
                                    border: "2px solid var(--border-dark)",
                                    borderRadius: "12px",
                                    fontSize: "16px",
                                    fontFamily: "inherit",
                                }}
                            />
                        </div>

                        {/* Categories */}
                        <div style={{ marginBottom: "16px" }}>
                            <label style={{ display: "block", fontWeight: 700, marginBottom: "8px" }}>
                                Categories
                            </label>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                                {CATEGORIES.map(cat => (
                                    <button
                                        key={cat}
                                        type="button"
                                        onClick={() => handleTagToggle(cat)}
                                        className="game-tag"
                                        style={{
                                            background: formData.tags.includes(cat) ? "var(--accent-green)" : "var(--tag-bg)",
                                            color: formData.tags.includes(cat) ? "white" : "inherit",
                                            cursor: "pointer",
                                        }}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Players */}
                        <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: "block", fontWeight: 700, marginBottom: "6px" }}>
                                    Min Players
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={formData.playerMin}
                                    onChange={(e) => setFormData(prev => ({ ...prev, playerMin: e.target.value }))}
                                    style={{
                                        width: "100%",
                                        padding: "12px 16px",
                                        border: "2px solid var(--border-dark)",
                                        borderRadius: "12px",
                                        fontSize: "16px",
                                        fontFamily: "inherit",
                                    }}
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: "block", fontWeight: 700, marginBottom: "6px" }}>
                                    Max Players
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={formData.playerMax}
                                    onChange={(e) => setFormData(prev => ({ ...prev, playerMax: e.target.value }))}
                                    style={{
                                        width: "100%",
                                        padding: "12px 16px",
                                        border: "2px solid var(--border-dark)",
                                        borderRadius: "12px",
                                        fontSize: "16px",
                                        fontFamily: "inherit",
                                    }}
                                />
                            </div>
                        </div>

                        {/* Duration */}
                        <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: "block", fontWeight: 700, marginBottom: "6px" }}>
                                    Min Duration (min)
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={formData.durationMin}
                                    onChange={(e) => setFormData(prev => ({ ...prev, durationMin: e.target.value }))}
                                    style={{
                                        width: "100%",
                                        padding: "12px 16px",
                                        border: "2px solid var(--border-dark)",
                                        borderRadius: "12px",
                                        fontSize: "16px",
                                        fontFamily: "inherit",
                                    }}
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: "block", fontWeight: 700, marginBottom: "6px" }}>
                                    Max Duration (min)
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={formData.durationMax}
                                    onChange={(e) => setFormData(prev => ({ ...prev, durationMax: e.target.value }))}
                                    style={{
                                        width: "100%",
                                        padding: "12px 16px",
                                        border: "2px solid var(--border-dark)",
                                        borderRadius: "12px",
                                        fontSize: "16px",
                                        fontFamily: "inherit",
                                    }}
                                />
                            </div>
                        </div>

                        {/* Energy Level */}
                        <div style={{ marginBottom: "16px" }}>
                            <label style={{ display: "block", fontWeight: 700, marginBottom: "8px" }}>
                                Energy Level
                            </label>
                            <div style={{ display: "flex", gap: "8px" }}>
                                {ENERGY_LEVELS.map(level => (
                                    <button
                                        key={level.value}
                                        type="button"
                                        onClick={() => handleEnergyChange(level)}
                                        className="game-tag"
                                        style={{
                                            background: formData.energy === level.value ? `var(--energy-${level.color === "yellow" ? "medium" : level.color})` : "var(--tag-bg)",
                                            color: formData.energy === level.value ? "white" : "inherit",
                                            cursor: "pointer",
                                        }}
                                    >
                                        {level.value}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Tagline */}
                        <div style={{ marginBottom: "16px" }}>
                            <label style={{ display: "block", fontWeight: 700, marginBottom: "6px" }}>
                                Tagline
                            </label>
                            <input
                                type="text"
                                value={formData.tagline}
                                onChange={(e) => setFormData(prev => ({ ...prev, tagline: e.target.value }))}
                                placeholder="e.g. Simple, fun, works for all ages"
                                style={{
                                    width: "100%",
                                    padding: "12px 16px",
                                    border: "2px solid var(--border-dark)",
                                    borderRadius: "12px",
                                    fontSize: "16px",
                                    fontFamily: "inherit",
                                }}
                            />
                        </div>

                        {/* Setup */}
                        <div style={{ marginBottom: "16px" }}>
                            <label style={{ display: "block", fontWeight: 700, marginBottom: "6px" }}>
                                Setup (one item per line)
                            </label>
                            <textarea
                                value={formData.setup}
                                onChange={(e) => setFormData(prev => ({ ...prev, setup: e.target.value }))}
                                placeholder="Red solo cups&#10;Marshmallows&#10;Tape for line"
                                rows={3}
                                style={{
                                    width: "100%",
                                    padding: "12px 16px",
                                    border: "2px solid var(--border-dark)",
                                    borderRadius: "12px",
                                    fontSize: "16px",
                                    fontFamily: "inherit",
                                    resize: "vertical",
                                }}
                            />
                        </div>

                        {/* Rules */}
                        <div style={{ marginBottom: "16px" }}>
                            <label style={{ display: "block", fontWeight: 700, marginBottom: "6px" }}>
                                Rules (one step per line)
                            </label>
                            <textarea
                                value={formData.rules}
                                onChange={(e) => setFormData(prev => ({ ...prev, rules: e.target.value }))}
                                placeholder="Stand behind the line&#10;Toss marshmallows into cups&#10;Most in wins!"
                                rows={3}
                                style={{
                                    width: "100%",
                                    padding: "12px 16px",
                                    border: "2px solid var(--border-dark)",
                                    borderRadius: "12px",
                                    fontSize: "16px",
                                    fontFamily: "inherit",
                                    resize: "vertical",
                                }}
                            />
                        </div>

                        {/* Tips */}
                        <div style={{ marginBottom: "16px" }}>
                            <label style={{ display: "block", fontWeight: 700, marginBottom: "6px" }}>
                                Tips (one per line)
                            </label>
                            <textarea
                                value={formData.tips}
                                onChange={(e) => setFormData(prev => ({ ...prev, tips: e.target.value }))}
                                placeholder="Increase distance for harder difficulty"
                                rows={2}
                                style={{
                                    width: "100%",
                                    padding: "12px 16px",
                                    border: "2px solid var(--border-dark)",
                                    borderRadius: "12px",
                                    fontSize: "16px",
                                    fontFamily: "inherit",
                                    resize: "vertical",
                                }}
                            />
                        </div>

                        {/* Video URL */}
                        <div style={{ marginBottom: "16px" }}>
                            <label style={{ display: "block", fontWeight: 700, marginBottom: "6px" }}>
                                Video URL (YouTube, TikTok, etc.)
                            </label>
                            <input
                                type="url"
                                value={formData.videoUrl}
                                onChange={(e) => setFormData(prev => ({ ...prev, videoUrl: e.target.value }))}
                                placeholder="https://youtube.com/watch?v=..."
                                style={{
                                    width: "100%",
                                    padding: "12px 16px",
                                    border: "2px solid var(--border-dark)",
                                    borderRadius: "12px",
                                    fontSize: "16px",
                                    fontFamily: "inherit",
                                }}
                            />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn-share"
                            onClick={onClose}
                            style={{ flex: 1, justifyContent: "center" }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn-play"
                            disabled={loading || !formData.name}
                            style={{ opacity: loading || !formData.name ? 0.6 : 1 }}
                        >
                            {loading ? (isEditMode ? "Saving..." : "Adding...") : (isEditMode ? "Save Changes" : "Add Game")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
