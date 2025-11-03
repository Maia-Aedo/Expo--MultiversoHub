import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Image, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { usePersonajes, Filter } from "../../src/hooks/usePersonajes";
import { useFavorites } from "../../src/context/FavoriteContext";
import type { Personaje } from "../../src/models/personaje.interface";
import type { PersonajeCard } from "../../src/models/personaje-card.interface";
import { logEvent } from "../../src/utils/telemetry";


export default function HomeScreen() {
    // const navigation = useNavigation();
    const router = useRouter();
    const { personajes, loading } = usePersonajes(1);
    const { state: favState, toggleFavorite } = useFavorites();
    const insets = useSafeAreaInsets();

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
        // USAR router.push PARA NAVEGAR
        router.push(`/personaje/${item.id}`);
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
        const isDead = item.status.toLowerCase() === 'dead';

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
                        logEvent('FAVORITE', { id: item.id, action: isFav ? 'removed' : 'added' });
                    }}
                >
                    <Ionicons name={isFav ? "heart" : "heart-outline"} size={22} color={isFav ? '#dc3545' : '#ccc'} />
                </TouchableOpacity>
            </Pressable>
        );
    };

    if (loading || favState.loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#61dafb" />
            </View>
        );
    }

    //*usamos SafeAreaView para poder ocular la barra superior*
    return (
        <SafeAreaView style={styles.container}>             
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
                        onPress={() => {
                            setFilter(f);
                            logEvent('FILTER', { newFilter: f });
                        }}
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

                contentContainerStyle={{
                    paddingHorizontal: 0,
                    paddingBottom: insets.bottom + 80 //  80 para la barra de pestañas + un margen extra
                }}

                showsVerticalScrollIndicator={false} //  OCULTA SCROLLBAR
                ListEmptyComponent={
                    <View style={styles.center}>
                        <Text style={styles.emptyText}>No hay personajes para mostrar con este filtro.</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        backgroundColor: "#262626" // fondo oscuro
    },
    center: { flex: 1, justifyContent: "center", alignItems: "center" },
    emptyText: { color: '#ccc' },

    summary: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
    summaryCard: {
        flex: 1,
        marginHorizontal: 6,
        padding: 12,
        borderRadius: 10,
        backgroundColor: "#3a3a3a",
        alignItems: "center",
        borderLeftWidth: 3,
        borderColor: '#61dafb',
    },
    summaryTitle: { fontSize: 14, color: "#ccc" },
    summaryNumber: { fontSize: 22, fontWeight: "700", color: "#fff" },

    filters: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginVertical: 12 },
    chip: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#555",
    },
    chipActive: {
        backgroundColor: "#61dafb",
        borderColor: "#61dafb",
    },
    chipText: { color: "#ccc" },
    chipTextActive: { color: "#262626", fontWeight: 'bold' },

    // list: { paddingBottom: 80 },

    item: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 15,
        paddingHorizontal: 10,
        marginVertical: 4,
        borderRadius: 10,
        backgroundColor: '#3a3a3a',
        borderLeftWidth: 3,
        borderColor: '#555',
        elevation: 2,
    },
    itemDead: {
        opacity: 0.6,
        borderColor: '#dc3545',
    },
    itemPressed: { opacity: 0.8 },

    avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 15 },
    avatarPlaceholder: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
        backgroundColor: "#555",
        justifyContent: "center",
        alignItems: "center",
    },
    avatarText: { fontWeight: "700", color: '#fff' },

    itemBody: { flex: 1 },
    name: { fontSize: 16, fontWeight: "600", color: '#fff' },
    status: { color: "#ccc" },
    extra: { color: "#888", fontSize: 12 },

    favoriteBtn: { paddingHorizontal: 8, paddingVertical: 4 },
});