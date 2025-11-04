import React from "react";
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFavorites } from "../../src/context/FavoriteContext";
import { PersonajeCard } from "../../src/models/personaje-card.interface";
import { logEvent } from "../../src/utils/telemetry"; // Para registrar la eliminación

export default function FavoritosScreen() {
    const { state, removeFavorite } = useFavorites();
    const router = useRouter();
 const insets = useSafeAreaInsets(); 

    const onPressItem = (id: number) => {
        router.push(`/personaje/${id}`);
    };

    if (state.loading)
        return (
            <View style={styles.center}>
                <Text style={styles.text}>Cargando favoritos...</Text>
            </View>
        );


    if (state.favoritos.length === 0)
        return (
            //  USO DE SAFESAREAVIEW
            <SafeAreaView style={styles.center}>
                <Text style={styles.text}>¡Aún no tienes personajes favoritos!</Text>
                <Text style={styles.subText}>Marca el corazón en la pantalla de Personajes.</Text>
            </SafeAreaView>
        );

    const renderItem = ({ item }: { item: PersonajeCard }) => (
        <TouchableOpacity 
            style={styles.row}
            onPress={() => onPressItem(item.id)}
            activeOpacity={0.8}
        >
            {item.image && <Image source={{ uri: item.image }} style={styles.thumb} />}
            <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.meta}>{item.species} - {item.status}</Text>
            </View>
            
            {/* Botón para eliminar con icono */}
            <TouchableOpacity 
                onPress={() => {
                    removeFavorite(item.id);
                    logEvent('FAVORITE', { id: item.id, action: 'removed_from_list' });
                }} 
                style={styles.btn}
            >
                 <Ionicons name="trash-outline" size={24} color="#dc3545" />
            </TouchableOpacity>
        </TouchableOpacity>
    );

    return (
       
        <SafeAreaView style={styles.container}>
            <FlatList 
                data={state.favoritos} 
                keyExtractor={(i) => i.id.toString()} 
                renderItem={renderItem} 
                contentContainerStyle={{ 
                    padding: 12, 
                    paddingBottom: insets.bottom + 10 
                }}  
                showsVerticalScrollIndicator={false} // OCULTA SCROLLBAR
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#262626' 
    },
    center: { 
        flex: 1, 
        justifyContent: "center", 
        alignItems: "center",
        backgroundColor: '#262626',
        padding: 20
    },
    text: { color: '#fff', fontSize: 18, marginBottom: 5 },
    subText: { color: '#ccc', fontSize: 14 },
    row: { 
        flexDirection: "row", 
        alignItems: "center", 
        padding: 15,
        marginVertical: 5,
        borderRadius: 10,
        backgroundColor: '#3a3a3a', 
        borderLeftWidth: 3,
        borderColor: '#61dafb', 
        elevation: 2,
    },
    thumb: { 
        width: 50, 
        height: 50, 
        borderRadius: 25, 
        marginRight: 15,
        borderWidth: 1,
        borderColor: '#fff',
    },
    name: { fontWeight: "700", color: '#fff', fontSize: 16 }, 
    meta: { color: "#ccc", fontSize: 12 }, 
    btn: { padding: 8, paddingLeft: 15 },
});