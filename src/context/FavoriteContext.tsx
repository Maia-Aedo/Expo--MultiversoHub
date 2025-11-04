import React, { createContext, useReducer, useEffect, useCallback, useContext, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PersonajeCard } from "../models/personaje-card.interface";
import { logEvent } from "../utils/telemetry";

interface State {
    favoritos: PersonajeCard[];
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

const initialState: State = { favoritos: [], loading: true };

/**
 * @description Definimos un contexto GLOBAL para manipular la lista de favoritos sin pasar las props manualmente ente components.
 * useReducer para acciones de favoritos.
 * Guarda los favoritos en localStorage.
*/

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case "SET_FAVORITES":
            return { ...state, favoritos: action.payload, loading: false };
        case "ADD_FAVORITE":
            if (state.favoritos.some((f) => f.id === action.payload.id)) return state;
            return { ...state, favoritos: [action.payload, ...state.favoritos] };
        case "REMOVE_FAVORITE":
            return { ...state, favoritos: state.favoritos.filter((f) => f.id !== action.payload) };
        case "SET_LOADING":
            return { ...state, loading: action.payload };
        default:
            return state;
    }
}

const FavoriteContext = createContext<FavoriteContextProps | undefined>(undefined);

// Con el provider cualquier componente dentro puede acceder al contexto
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
                await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state.favoritos));
            } catch (err) {
                console.warn("Error guardando favoritos:", err);
            }
        };
        if (!state.loading) save();
    }, [state.favoritos, state.loading]);

    const addFavorite = useCallback((c: PersonajeCard) => dispatch({ type: "ADD_FAVORITE", payload: c }), []);
    const removeFavorite = useCallback((id: number) => dispatch({ type: "REMOVE_FAVORITE", payload: id }), []);
    
    const toggleFavorite = useCallback(
        (c: PersonajeCard) => {
            const exists = state.favoritos.some((f) => f.id === c.id);
            if (exists) dispatch({ type: "REMOVE_FAVORITE", payload: c.id });
            else dispatch({ type: "ADD_FAVORITE", payload: c });
            if (exists) {
                dispatch({ type: "REMOVE_FAVORITE", payload: c.id });
                logEvent('FAVORITE', { id: c.id, action: 'removed' }); 
            } else {
                dispatch({ type: "ADD_FAVORITE", payload: c });
                logEvent('FAVORITE', { id: c.id, action: 'added' }); 
            }
        },
        [state.favoritos]
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
