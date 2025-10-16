import React from "react";
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useFavorites } from "../../src/context/FavoriteContext";
import { PersonajeCard } from "../../src/models/personaje-card.interface";

export default function FavoritosScreen() {
    const { state, removeFavorite } = useFavorites();
    if (state.loading)
        return (
            <View style={styles.center}>
                <Text>Cargando favoritos...</Text>
            </View>
        );

    if (state.favoritos.length === 0)
        return (
            <View style={styles.center}>
                <Text>No tenés favoritos aún.</Text>
            </View>
        );

    const renderItem = ({ item }: { item: PersonajeCard }) => (
        <View style={styles.row}>
            {item.image && <Image source={{ uri: item.image }} style={styles.thumb} />}
            <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.meta}>{item.species} - {item.status}</Text>
            </View>
            <TouchableOpacity onPress={() => removeFavorite(item.id)} style={styles.btn}>
                <Text>Eliminar</Text>
            </TouchableOpacity>
        </View>
    );

    return <FlatList data={state.favoritos} keyExtractor={(i) => i.id.toString()} renderItem={renderItem} contentContainerStyle={{ padding: 12 }} />;
}

const styles = StyleSheet.create({
    center: { flex: 1, justifyContent: "center", alignItems: "center" },
    row: { flexDirection: "row", alignItems: "center", paddingVertical: 8, borderBottomWidth: 1, borderColor: "#eee" },
    thumb: { width: 56, height: 56, borderRadius: 8, marginRight: 12 },
    name: { fontWeight: "700" },
    meta: { color: "#666", fontSize: 12 },
    btn: { padding: 8 },
});

