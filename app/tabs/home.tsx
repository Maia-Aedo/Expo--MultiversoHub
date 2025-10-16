import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Image, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { usePersonajes, Filter } from "../../src/hooks/usePersonajes";
import { useFavorites } from "../../src/context/FavoriteContext";
import type { Personaje } from "../../src/models/personaje.interface";
import type { PersonajeCard } from "../../src/models/personaje-card.interface";


export default function HomeScreen() {
    const navigation = useNavigation();
    const { personajes, loading } = usePersonajes(1);
    const { state: favState, toggleFavorite } = useFavorites();

    const [filter, setFilter] = useState<Filter>("ALL");

    // Conteos
    const total = personajes.length;
    const conteoFavoritos = favState.favoritos.length;

    // Helper para saber si un personaje está en favoritos
    const favoritoIds = useMemo(() => new Set(favState.favoritos.map((f) => f.id)), [favState.favoritos]);

    const filtered = useMemo(() => {
        switch (filter) {
            case "ALIVE":
                return personajes.filter(
                    (p) => (p.status ?? "").toString().toLowerCase() === "alive" || (p.status ?? "").toString().toLowerCase() === "vivo"
                );
            case "UNKNOWN":
                return personajes.filter((p) => {
                    const s = (p.status ?? "").toString().toLowerCase();
                    return s === "unknown" || s === "desconocido" || s === "";
                });
            case "FAVORITES":
                return personajes.filter((p) => favoritoIds.has(p.id));
            default:
                return personajes;
        }
    }, [personajes, filter, favoritoIds]);

    const onPressItem = (item: Personaje) => {
        // Navegar a detalle
        // navigation.navigate("DetallesPersonajes" as never, { id: item.id } as never);
    };

    const onToggleFavorite = (p: Personaje) => {
        const card: PersonajeCard = {
            id: p.id,
            name: p.name,
            image: p.image,
            species: p.species,
            status: p.status,
        };
        toggleFavorite(card);
    };

    const renderItem = ({ item }: { item: Personaje }) => {
        const isFav = favoritoIds.has(item.id);
        return (
            // uso Pressable para manejar mejor la interacción y permitir el corazón independiente
            <Pressable onPress={() => onPressItem(item)} style={({ pressed }) => [styles.item, pressed && styles.itemPressed]}>
                {item.image ? (
                    <Image source={{ uri: item.image }} style={styles.avatar} />
                ) : (
                    <View style={styles.avatarPlaceholder}>
                        <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
                    </View>
                )}

                <View style={styles.itemBody}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.status}>Status: {item.status ?? "Desconocido"}</Text>
                    <Text style={styles.extra}>Origen: {item.origin?.name ?? "-"}</Text>
                </View>

                <TouchableOpacity
                    style={styles.favoriteBtn}
                    onPress={(ev) => {
                        ev.stopPropagation?.(); // por seguridad (algunas versiones)
                        onToggleFavorite(item);
                    }}
                >
                    <Ionicons name={isFav ? "heart" : "heart-outline"} size={22} />
                </TouchableOpacity>
            </Pressable>
        );
    };

    if (loading || favState.loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Resumen */}
            <View style={styles.summary}>
                <View style={styles.summaryCard}>
                    <Text style={styles.summaryTitle}>Total</Text>
                    <Text style={styles.summaryNumber}>{total}</Text>
                </View>

                <View style={styles.summaryCard}>
                    <Text style={styles.summaryTitle}>Favoritos</Text>
                    <Text style={styles.summaryNumber}>{conteoFavoritos}</Text>
                </View>
            </View>

            {/* Filtros */}
            <View style={styles.filters}>
                {(["ALL", "ALIVE", "UNKNOWN", "FAVORITES"] as Filter[]).map((f) => (
                    <TouchableOpacity
                        key={f}
                        style={[styles.chip, filter === f ? styles.chipActive : undefined]}
                        onPress={() => setFilter(f)}
                    >
                        <Text style={filter === f ? styles.chipTextActive : styles.chipText}>
                            {f === "ALL" ? "Todos" : f === "ALIVE" ? "Vivos" : f === "UNKNOWN" ? "Desconocidos" : "Favoritos"}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Lista */}
            <FlatList
                data={filtered}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    <View style={styles.center}>
                        <Text>No hay personajes para mostrar</Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: "#fff" },
    center: { flex: 1, justifyContent: "center", alignItems: "center" },

    summary: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
    summaryCard: {
        flex: 1,
        marginHorizontal: 6,
        padding: 12,
        borderRadius: 8,
        backgroundColor: "#f3f3f3",
        alignItems: "center",
    },
    summaryTitle: { fontSize: 14, color: "#666" },
    summaryNumber: { fontSize: 22, fontWeight: "700" },

    filters: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginVertical: 12 },
    chip: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#ddd",
        marginRight: 8,
    },
    chipActive: {
        backgroundColor: "#222",
        borderColor: "#222",
    },
    chipText: { color: "#333" },
    chipTextActive: { color: "#fff" },

    list: { paddingBottom: 80 },

    item: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: "#eee",
    },
    itemPressed: { opacity: 0.9 },

    avatar: { width: 48, height: 48, borderRadius: 24, marginRight: 12 },
    avatarPlaceholder: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 12,
        backgroundColor: "#ddd",
        justifyContent: "center",
        alignItems: "center",
    },
    avatarText: { fontWeight: "700" },

    itemBody: { flex: 1 },
    name: { fontSize: 16, fontWeight: "600" },
    status: { color: "#666" },
    extra: { color: "#888", fontSize: 12 },

    favoriteBtn: { paddingHorizontal: 8, paddingVertical: 4 },
});
