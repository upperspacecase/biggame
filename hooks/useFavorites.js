import { useState, useEffect, useCallback } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import toast from "react-hot-toast";

export function useFavorites() {
    const { isSignedIn, isLoaded: isAuthLoaded } = useUser();
    const { openSignIn } = useClerk();
    const [favorites, setFavorites] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch favorites from API when signed in
    useEffect(() => {
        if (!isAuthLoaded || !isSignedIn) {
            setFavorites([]);
            return;
        }

        const fetchFavorites = async () => {
            try {
                const response = await fetch("/api/user/favorites");
                if (response.ok) {
                    const data = await response.json();
                    // Setup favorites as array of IDs
                    setFavorites(data.map(f => typeof f === 'object' ? f._id : f));
                }
            } catch (error) {
                console.error("Failed to fetch favorites", error);
            }
        };

        fetchFavorites();
    }, [isSignedIn, isAuthLoaded]);

    const isFavorite = useCallback((gameId) => {
        return favorites.includes(gameId);
    }, [favorites]);

    const toggleFavorite = useCallback(async (gameId) => {
        if (!isSignedIn) {
            toast.error("Sign in to save favorites", {
                duration: 3000,
                icon: "🔒"
            });
            openSignIn();
            return;
        }

        // Optimistic update
        const isPreviouslyFavorited = favorites.includes(gameId);
        setFavorites(prev => {
            if (isPreviouslyFavorited) return prev.filter(id => id !== gameId);
            return [...prev, gameId];
        });

        const undoOptimisticUpdate = () => {
            setFavorites(prev => {
                if (isPreviouslyFavorited) return [...prev, gameId];
                return prev.filter(id => id !== gameId);
            });
        };

        try {
            const response = await fetch("/api/user/favorites", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ gameId }),
            });

            if (!response.ok) {
                throw new Error("Failed to update favorite");
            }
        } catch (error) {
            console.error("Error toggling favorite:", error);
            toast.error("Failed to save changes");
            undoOptimisticUpdate();
        }
    }, [favorites, isSignedIn, openSignIn]);

    return {
        isFavorite,
        toggleFavorite,
        count: favorites.length,
        favorites,
        isSignedIn
    };
}
