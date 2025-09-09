export interface Personaje {
    id: number;
    name: string;
    status: string;
    species: string;
    image: string; // url
    origin: {
        name: string;
    };
    episode: string[]; // urls
}