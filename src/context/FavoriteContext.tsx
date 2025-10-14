// src/context/FavoriteContext.tsx
import React, { createContext, useReducer, useEffect, useCallback, useContext, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PersonajeCard } from "../models/personaje-card.interface";

interface State {
    favorites: PersonajeCard[];
    loading: boolean;
}

type Action =
    | { type: "SET_FAVORITES"; payload: PersonajeCard[] }
    | { type: "ADD_FAVORITE"; payload: PersonajeCard }
    | { type: "REMOVE_FAVORITE"; payload: number }
    | { type: "SET_LOADING"; payload: boolean };

interface FavoriteContextProps {
    state: State;
    addFavorite: (c: PersonajeCard) => void;
    removeFavorite: (id: number) => void;
    toggleFavorite: (c: PersonajeCard) => void;
}

const STORAGE_KEY = "@favorites_v1";

const initialState: State = { favorites: [], loading: true };

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case "SET_FAVORITES":
            return { ...state, favorites: action.payload, loading: false };
        case "ADD_FAVORITE":
            if (state.favorites.some((f) => f.id === action.payload.id)) return state;
            return { ...state, favorites: [action.payload, ...state.favorites] };
        case "REMOVE_FAVORITE":
            return { ...state, favorites: state.favorites.filter((f) => f.id !== action.payload) };
        case "SET_LOADING":
            return { ...state, loading: action.payload };
        default:
            return state;
    }
}

const FavoriteContext = createContext<FavoriteContextProps | undefined>(undefined);

export const FavoriteProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    // Cargar favoritos de AsyncStorage
    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const raw = await AsyncStorage.getItem(STORAGE_KEY);
                const parsed: PersonajeCard[] = raw ? JSON.parse(raw) : [];
                if (mounted) dispatch({ type: "SET_FAVORITES", payload: parsed });
            } catch (err) {
                console.warn("Error cargando favoritos:", err);
                dispatch({ type: "SET_FAVORITES", payload: [] });
            }
        })();
        return () => {
            mounted = false;
        };
    }, []);

    // Guardar favoritos cada vez que cambian
    useEffect(() => {
        const save = async () => {
            try {
                await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state.favorites));
            } catch (err) {
                console.warn("Error guardando favoritos:", err);
            }
        };
        if (!state.loading) save();
    }, [state.favorites, state.loading]);

    const addFavorite = useCallback((c: PersonajeCard) => dispatch({ type: "ADD_FAVORITE", payload: c }), []);
    const removeFavorite = useCallback((id: number) => dispatch({ type: "REMOVE_FAVORITE", payload: id }), []);
    const toggleFavorite = useCallback(
        (c: PersonajeCard) => {
            const exists = state.favorites.some((f) => f.id === c.id);
            if (exists) dispatch({ type: "REMOVE_FAVORITE", payload: c.id });
            else dispatch({ type: "ADD_FAVORITE", payload: c });
        },
        [state.favorites]
    );

    return (
        <FavoriteContext.Provider value={{ state, addFavorite, removeFavorite, toggleFavorite }}>
            {children}
        </FavoriteContext.Provider>
    );
};

export const useFavorites = (): FavoriteContextProps => {
    const ctx = useContext(FavoriteContext);
    if (!ctx) throw new Error("useFavorites must be used within FavoriteProvider");
    return ctx;
};
