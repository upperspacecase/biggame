"use client";

import { useState, useEffect, useCallback } from "react";

// Play icon
const PlayIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 32, height: 32 }}>
        <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
);

// Pause icon
const PauseIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 32, height: 32 }}>
        <rect x="6" y="4" width="4" height="16" />
        <rect x="14" y="4" width="4" height="16" />
    </svg>
);

// Reset icon
const ResetIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 24, height: 24 }}>
        <polyline points="1 4 1 10 7 10" />
        <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
    </svg>
);

// Close icon
const CloseIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 28, height: 28 }}>
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

// Plus icon
const PlusIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ width: 20, height: 20 }}>
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

// Minus icon
const MinusIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ width: 20, height: 20 }}>
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

export default function GamePlayMode({ game, onClose }) {
    const [mode, setMode] = useState("timer"); // "timer" or "scoreboard"
    const [timerType, setTimerType] = useState("countdown"); // "countdown" or "stopwatch"
    const [timeLeft, setTimeLeft] = useState(game?.duration?.min * 60 || 300);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [teams, setTeams] = useState([
        { name: "Team 1", score: 0, color: "var(--accent-red)" },
        { name: "Team 2", score: 0, color: "var(--accent-green)" },
    ]);

    // Timer effect
    useEffect(() => {
        let interval;
        if (isRunning) {
            interval = setInterval(() => {
                if (timerType === "countdown") {
                    setTimeLeft(prev => {
                        if (prev <= 1) {
                            setIsRunning(false);
                            return 0;
                        }
                        return prev - 1;
                    });
                } else {
                    setElapsedTime(prev => prev + 1);
                }
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isRunning, timerType]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    const resetTimer = useCallback(() => {
        setIsRunning(false);
        if (timerType === "countdown") {
            setTimeLeft(game?.duration?.min * 60 || 300);
        } else {
            setElapsedTime(0);
        }
    }, [timerType, game]);

    const updateScore = (teamIndex, delta) => {
        setTeams(prev => prev.map((team, i) =>
            i === teamIndex ? { ...team, score: Math.max(0, team.score + delta) } : team
        ));
    };

    const addTeam = () => {
        const colors = ["var(--accent-yellow)", "var(--accent-orange)", "#9B59B6", "#3498DB"];
        setTeams(prev => [...prev, {
            name: `Team ${prev.length + 1}`,
            score: 0,
            color: colors[(prev.length - 2) % colors.length]
        }]);
    };

    const removeTeam = (index) => {
        if (teams.length > 2) {
            setTeams(prev => prev.filter((_, i) => i !== index));
        }
    };

    const displayTime = timerType === "countdown" ? timeLeft : elapsedTime;

    return (
        <div style={{
            position: "fixed",
            inset: 0,
            background: "var(--bg-cream)",
            zIndex: 200,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
        }}>
            {/* Header */}
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px 20px",
                borderBottom: "3px solid var(--border-dark)",
                background: "white",
            }}>
                <h1 style={{
                    fontFamily: '"Nunito", sans-serif',
                    fontWeight: 900,
                    fontSize: "20px",
                    color: "var(--text-brown)",
                    margin: 0,
                }}>
                    {game?.name || "Game"}
                </h1>
                <button
                    onClick={onClose}
                    style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: "4px",
                        color: "var(--text-brown)",
                    }}
                >
                    <CloseIcon />
                </button>
            </div>

            {/* Mode Toggle */}
            <div style={{
                display: "flex",
                gap: "8px",
                padding: "16px 20px",
                justifyContent: "center",
            }}>
                <button
                    onClick={() => setMode("timer")}
                    style={{
                        padding: "10px 24px",
                        borderRadius: "20px",
                        border: "2px solid var(--border-dark)",
                        background: mode === "timer" ? "var(--border-dark)" : "white",
                        color: mode === "timer" ? "white" : "var(--text-brown)",
                        fontWeight: 700,
                        cursor: "pointer",
                    }}
                >
                    ⏱️ Timer
                </button>
                <button
                    onClick={() => setMode("scoreboard")}
                    style={{
                        padding: "10px 24px",
                        borderRadius: "20px",
                        border: "2px solid var(--border-dark)",
                        background: mode === "scoreboard" ? "var(--border-dark)" : "white",
                        color: mode === "scoreboard" ? "white" : "var(--text-brown)",
                        fontWeight: 700,
                        cursor: "pointer",
                    }}
                >
                    📊 Scoreboard
                </button>
            </div>

            {/* Content */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "20px" }}>
                {mode === "timer" ? (
                    <>
                        {/* Timer Type Toggle */}
                        <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "24px" }}>
                            <button
                                onClick={() => { setTimerType("countdown"); resetTimer(); }}
                                style={{
                                    padding: "8px 16px",
                                    borderRadius: "16px",
                                    border: "none",
                                    background: timerType === "countdown" ? "var(--accent-red)" : "var(--tag-bg)",
                                    color: timerType === "countdown" ? "white" : "var(--text-muted)",
                                    fontWeight: 600,
                                    fontSize: "14px",
                                    cursor: "pointer",
                                }}
                            >
                                Countdown
                            </button>
                            <button
                                onClick={() => { setTimerType("stopwatch"); resetTimer(); }}
                                style={{
                                    padding: "8px 16px",
                                    borderRadius: "16px",
                                    border: "none",
                                    background: timerType === "stopwatch" ? "var(--accent-green)" : "var(--tag-bg)",
                                    color: timerType === "stopwatch" ? "white" : "var(--text-muted)",
                                    fontWeight: 600,
                                    fontSize: "14px",
                                    cursor: "pointer",
                                }}
                            >
                                Stopwatch
                            </button>
                        </div>

                        {/* Timer Display */}
                        <div style={{
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}>
                            <div style={{
                                fontSize: "clamp(80px, 20vw, 140px)",
                                fontFamily: '"Nunito", sans-serif',
                                fontWeight: 900,
                                color: displayTime <= 10 && timerType === "countdown" ? "var(--accent-red)" : "var(--text-brown)",
                                textAlign: "center",
                                letterSpacing: "4px",
                            }}>
                                {formatTime(displayTime)}
                            </div>
                        </div>

                        {/* Timer Controls */}
                        <div style={{
                            display: "flex",
                            justifyContent: "center",
                            gap: "16px",
                            padding: "24px 0",
                        }}>
                            <button
                                onClick={resetTimer}
                                style={{
                                    width: "60px",
                                    height: "60px",
                                    borderRadius: "50%",
                                    border: "3px solid var(--border-dark)",
                                    background: "white",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "var(--text-brown)",
                                }}
                            >
                                <ResetIcon />
                            </button>
                            <button
                                onClick={() => setIsRunning(!isRunning)}
                                style={{
                                    width: "80px",
                                    height: "80px",
                                    borderRadius: "50%",
                                    border: "3px solid var(--border-dark)",
                                    background: isRunning ? "var(--accent-red)" : "var(--accent-green)",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "white",
                                    boxShadow: "0 4px 0 var(--border-dark)",
                                }}
                            >
                                {isRunning ? <PauseIcon /> : <PlayIcon />}
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Scoreboard */}
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "12px" }}>
                            {teams.map((team, index) => (
                                <div
                                    key={index}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "12px",
                                        padding: "16px",
                                        background: "white",
                                        border: "3px solid var(--border-dark)",
                                        borderRadius: "16px",
                                        borderLeft: `8px solid ${team.color}`,
                                    }}
                                >
                                    <input
                                        type="text"
                                        value={team.name}
                                        onChange={(e) => setTeams(prev => prev.map((t, i) =>
                                            i === index ? { ...t, name: e.target.value } : t
                                        ))}
                                        style={{
                                            flex: 1,
                                            border: "none",
                                            fontSize: "18px",
                                            fontWeight: 700,
                                            color: "var(--text-brown)",
                                            background: "transparent",
                                            fontFamily: "inherit",
                                        }}
                                    />
                                    <button
                                        onClick={() => updateScore(index, -1)}
                                        style={{
                                            width: "40px",
                                            height: "40px",
                                            borderRadius: "50%",
                                            border: "2px solid var(--border-dark)",
                                            background: "var(--tag-bg)",
                                            cursor: "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <MinusIcon />
                                    </button>
                                    <div style={{
                                        fontSize: "32px",
                                        fontWeight: 900,
                                        minWidth: "60px",
                                        textAlign: "center",
                                        color: "var(--text-brown)",
                                    }}>
                                        {team.score}
                                    </div>
                                    <button
                                        onClick={() => updateScore(index, 1)}
                                        style={{
                                            width: "40px",
                                            height: "40px",
                                            borderRadius: "50%",
                                            border: "2px solid var(--border-dark)",
                                            background: team.color,
                                            cursor: "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            color: "white",
                                        }}
                                    >
                                        <PlusIcon />
                                    </button>
                                    {teams.length > 2 && (
                                        <button
                                            onClick={() => removeTeam(index)}
                                            style={{
                                                background: "none",
                                                border: "none",
                                                cursor: "pointer",
                                                fontSize: "18px",
                                                padding: "4px",
                                            }}
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Add Team Button */}
                        {teams.length < 6 && (
                            <button
                                onClick={addTeam}
                                style={{
                                    marginTop: "16px",
                                    padding: "12px 24px",
                                    borderRadius: "12px",
                                    border: "2px dashed var(--border-light)",
                                    background: "transparent",
                                    color: "var(--text-muted)",
                                    fontWeight: 600,
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "8px",
                                }}
                            >
                                <PlusIcon /> Add Team
                            </button>
                        )}

                        {/* Reset Scores */}
                        <button
                            onClick={() => setTeams(prev => prev.map(t => ({ ...t, score: 0 })))}
                            style={{
                                marginTop: "16px",
                                padding: "12px 24px",
                                borderRadius: "12px",
                                border: "2px solid var(--border-dark)",
                                background: "white",
                                color: "var(--text-brown)",
                                fontWeight: 600,
                                cursor: "pointer",
                            }}
                        >
                            Reset All Scores
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
