"use client";

import { useState, useEffect, useCallback } from "react";
import AppHeader from "@/components/AppHeader";
import CategoryFilters from "@/components/CategoryFilters";
import GameCard from "@/components/GameCard";
import GameDetailModal from "@/components/GameDetailModal";
import AddGameModal from "@/components/AddGameModal";
import GamePlayMode from "@/components/GamePlayMode";
import { useFavorites } from "@/hooks/useFavorites";

export default function HomePage() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedGame, setSelectedGame] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPlayMode, setShowPlayMode] = useState(false);
  const { isFavorite, toggleFavorite, favorites } = useFavorites();

  const fetchGames = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();

      if (activeFilter !== "all") {
        params.append("tag", activeFilter);
      }

      // Handle favorites filter
      if (activeFilter === "favorites") {
        // Filter client-side for favorites
        const response = await fetch("/api/games");
        if (!response.ok) throw new Error(`API error: ${response.status}`);
        const data = await response.json();
        const favGames = data.filter(g => favorites.includes(g._id));
        setGames(favGames);
        return;
      }

      const response = await fetch(`/api/games?${params.toString()}`);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      setGames(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching games:", err);
      setError(err.message);
      setGames([]);
    } finally {
      setLoading(false);
    }
  }, [activeFilter, favorites]);

  // Fetch games on mount and when dependencies change
  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  const handleRandomClick = async () => {
    try {
      const response = await fetch("/api/games?random=true");
      const data = await response.json();
      if (data && data.length > 0) {
        setSelectedGame(data[0]);
      }
    } catch (error) {
      console.error("Error fetching random game:", error);
    }
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  const handleGameClick = (game) => {
    setSelectedGame(game);
  };

  const handleCloseModal = () => {
    setSelectedGame(null);
  };

  const handleAddClick = () => {
    setEditGame(null); // Clear any previous edit game
    setShowAddModal(true);
  };

  const handleEditGame = (game) => {
    setEditGame(game);
    setSelectedGame(null); // Close detail modal
    setShowAddModal(true); // Open edit modal
  };

  const [editGame, setEditGame] = useState(null);

  return (
    <main style={{ minHeight: "100vh", paddingBottom: "48px" }}>
      {/* Header */}
      <AppHeader onAddClick={handleAddClick} />

      {/* Filters Container */}
      <div style={{
        maxWidth: "500px",
        margin: "0 auto",
        padding: "24px",
      }}>
        {/* Filters */}
        <div style={{
          border: "3px solid var(--border-dark)",
          borderRadius: "16px",
          padding: "20px",
          marginBottom: "24px",
          background: "white",
        }}>
          <CategoryFilters
            activeFilter={activeFilter}
            onFilterChange={handleFilterChange}
            onRandomClick={handleRandomClick}
            premiumCategories={[]}
          />
        </div>

        {/* Games List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {loading ? (
            // Loading skeleton
            [...Array(3)].map((_, i) => (
              <div
                key={i}
                style={{
                  background: "var(--bg-card)",
                  border: "3px solid var(--border-dark)",
                  borderRadius: "16px",
                  padding: "24px",
                  height: "200px",
                  animation: "pulse 2s infinite",
                }}
              />
            ))
          ) : error ? (
            <div style={{
              textAlign: "center",
              padding: "48px 24px",
              color: "var(--accent-red)"
            }}>
              <p style={{ fontSize: "18px", marginBottom: "8px" }}>
                Failed to load games
              </p>
              <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>
                {error}
              </p>
            </div>
          ) : games.length === 0 ? (
            <div style={{
              textAlign: "center",
              padding: "48px 24px",
              color: "var(--text-muted)"
            }}>
              <p style={{ fontSize: "18px", marginBottom: "8px" }}>
                No games found
              </p>
              <p style={{ fontSize: "14px" }}>
                Try a different search or filter
              </p>
            </div>
          ) : (
            games.map((game) => (
              <GameCard
                key={game._id || game.number}
                game={game}
                onClick={handleGameClick}
                isFavorite={isFavorite(game._id)}
                onFavorite={toggleFavorite}
              />
            ))
          )}
        </div>
      </div>

      {/* Game Detail Modal */}
      {selectedGame && (
        <GameDetailModal
          game={selectedGame}
          onClose={handleCloseModal}
          onEdit={handleEditGame}
          onStartGame={(game) => {
            setSelectedGame(game);
            setShowPlayMode(true);
          }}
        />
      )}

      {/* Game Play Mode */}
      {showPlayMode && selectedGame && (
        <GamePlayMode
          game={selectedGame}
          onClose={() => setShowPlayMode(false)}
        />
      )}

      {/* Add/Edit Game Modal */}
      {showAddModal && (
        <AddGameModal
          onClose={() => {
            setShowAddModal(false);
            setEditGame(null);
          }}
          onGameAdded={fetchGames}
          editGame={editGame}
        />
      )}
    </main>
  );
}
