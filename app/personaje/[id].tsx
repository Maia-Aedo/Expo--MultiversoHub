/**
 * En el nombre del archivo [id] indica que es un parámetro dinámico
 * [id] -> id del personaje
 */

import { View, Text, Image, FlatList, ActivityIndicator, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { getPersonajeId } from "../../src/api/personajes";
import { Personaje } from "../../src/models/personaje.interface";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function DetallesPersonajes() {
    const { id } = useLocalSearchParams(); // obtenemos el ID del personaje
    const [character, setCharacter] = useState<Personaje | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        // Llama a la api para traer todos los datos
        getPersonajeId(Number(id)).then(data => {
            setCharacter(data);
            setLoading(false);
        });
    }, [id]);

    if (loading) {
        return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
    }

    // Si no existe...
    if (!character) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text>Personaje no encontrado</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={{ padding: 20 }}>
            <Image source={{ uri: character.image }} style={{ width: 200, height: 200, borderRadius: 100, alignSelf: "center" }} />
            <Text style={{ fontSize: 24, fontWeight: "bold", marginTop: 10 }}>{character.name}</Text>
            <Text style={{ fontSize: 16, marginTop: 5 }}>Estado: {character.status}</Text>
            <Text style={{ fontSize: 16 }}>Especie: {character.species}</Text>
            <Text style={{ fontSize: 16 }}>Origen: {character.origin.name}</Text>

            <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 20 }}>Episodios:</Text>
            <FlatList
                data={character.episode}
                keyExtractor={(item) => item}
                renderItem={({ item }) => <Text>- {item}</Text>}
                scrollEnabled={false} // ScrollView controla el scroll
            />
        </ScrollView>
    );
}

