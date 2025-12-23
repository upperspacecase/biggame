"use client";

import { useState, useEffect, useCallback } from "react";

const FAVORITES_KEY = "biggame_favorites";

export function useFavorites() {
    const [favorites, setFavorites] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load favorites from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(FAVORITES_KEY);
            if (stored) {
                setFavorites(JSON.parse(stored));
            }
        } catch (e) {
            console.error("Error loading favorites:", e);
        }
        setIsLoaded(true);
    }, []);

    // Save to localStorage whenever favorites change
    useEffect(() => {
        if (isLoaded) {
            try {
                localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
            } catch (e) {
                console.error("Error saving favorites:", e);
            }
        }
    }, [favorites, isLoaded]);

    const isFavorite = useCallback((gameId) => {
        return favorites.includes(gameId);
    }, [favorites]);

    const toggleFavorite = useCallback((gameId) => {
        setFavorites(prev => {
            if (prev.includes(gameId)) {
                return prev.filter(id => id !== gameId);
            } else {
                return [...prev, gameId];
            }
        });
    }, []);

    const addFavorite = useCallback((gameId) => {
        setFavorites(prev => {
            if (!prev.includes(gameId)) {
                return [...prev, gameId];
            }
            return prev;
        });
    }, []);

    const removeFavorite = useCallback((gameId) => {
        setFavorites(prev => prev.filter(id => id !== gameId));
    }, []);

    return {
        favorites,
        isFavorite,
        toggleFavorite,
        addFavorite,
        removeFavorite,
        count: favorites.length,
        isLoaded,
    };
}
