import { Personaje } from "../models/personaje.interface";

const API_URL = "https://rickandmortyapi.com/api";

export async function fetchPersonajes(page: number = 1): Promise<Personaje[]> {
    try {
        const response = await fetch(`${API_URL}/character?page=${page}`);
        if (!response.ok) {
            throw new Error("Error al obtener personajes");
        }
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error("API Error:", error);
        return [];
    }
}

export async function getPersonajeId(id: number): Promise<Personaje | null> {
    try {
        const response = await fetch(`${API_URL}/character/${id}`);
        if (!response.ok) {
            throw new Error("Error al obtener el personaje");
        }
        return await response.json();
    } catch (error) {
        console.error("API Error:", error);
        return null;
    }
}
