// Type para filtros
export type Status = 'Alive' | 'Dead' | 'unknown' | 'Desconocido' | string;

export interface Personaje {
    id: number;
    name: string;
    status: Status;
    species: string;
    image: string; // url
    origin: {
        name: string;
    };
    episode: string[]; // urls
}