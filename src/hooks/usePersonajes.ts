import { useEffect, useState } from "react";
import { fetchPersonajes } from "../api/personajes";
import { Personaje } from "../models/personaje.interface";

export function usePersonajes(page: number = 1) {

    /**
     * @description Hook para centraliza la lógica de obtención de personajes DESDE LA API.
     * @param page Número de página para la paginación.
     * @returns Un objeto con los personajes y el estado de carga.
     */

    const [personajes, setPersonajes] = useState<Personaje[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetchPersonajes(page).then(data => {
            setPersonajes(data);
            setLoading(false);
        });
    }, [page]);

    return { personajes, loading };
}

export type Filter = 'ALL' | 'ALIVE' | 'UNKNOWN' | 'FAVORITES';
