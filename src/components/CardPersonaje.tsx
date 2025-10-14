import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useFavorites } from "../context/FavoriteContext";
import { PersonajeCard } from "../models/personaje-card.interface";

interface Props {
    personaje: PersonajeCard;
}

export default function CardPersonaje({ personaje }: Props) {
    const { state, toggleFavorite } = useFavorites();
    const isFav = state.favorites.some((f) => f.id === personaje.id);

    return (
        <View style={styles.card}>
            {personaje.image && <Image source={{ uri: personaje.image }} style={styles.image} />}
            <View style={{ flex: 1, paddingHorizontal: 8 }}>
                <Text style={styles.name}>{personaje.name}</Text>
                <Text style={styles.meta}>{personaje.species} - {personaje.status}</Text>
            </View>
            <TouchableOpacity onPress={() => toggleFavorite(personaje)} style={styles.favBtn}>
                <Text style={{ fontSize: 18 }}>{isFav ? "★" : "☆"}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    card: { flexDirection: "row", alignItems: "center", padding: 8, borderBottomWidth: 1, borderColor: "#eee" },
    image: { width: 64, height: 64, borderRadius: 8 },
    name: { fontWeight: "700" },
    meta: { color: "#666", fontSize: 12 },
    favBtn: { padding: 8 },
});
