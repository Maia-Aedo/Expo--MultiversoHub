/**
 * En el nombre del archivo [id] indica que es un parámetro dinámico
 * [id] -> id del personaje
 */

import { View, Text, Image, FlatList, ActivityIndicator, ScrollView, StyleSheet } from "react-native";
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
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.imageContainer}>
                <Image source={{ uri: character.image }} style={styles.characterImage} />
            </View>
            
            <View style={styles.infoBox}>
                <Text style={styles.characterName}>{character.name}</Text>
                
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Estado:</Text>
                    <Text style={[styles.detailValue, character.status === 'Alive' ? styles.statusAlive : character.status === 'Dead' ? styles.statusDead : styles.statusUnknown]}>
                        {character.status}
                    </Text>
                </View>
                
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Especie:</Text>
                    <Text style={styles.detailValue}>{character.species}</Text>
                </View>
                
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Origen:</Text>
                    <Text style={styles.detailValue}>{character.origin.name}</Text>
                </View>
            </View>

            <View style={styles.episodesContainer}>
                <Text style={styles.episodesHeader}>Episodios:</Text>
                <FlatList
                    data={character.episode}
                    keyExtractor={(item, index) => item + index} // Usar index si la URL no es única por sí sola
                    renderItem={({ item }) => <Text style={styles.episodeItem}>• {item.split('/').pop()}</Text>} // Muestra solo el número del episodio
                    scrollEnabled={false}
                />
            </View>
        </ScrollView>
    );
}


const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 35,
        backgroundColor: '#262626', 
        alignItems: 'center', 
        paddingBottom: 50, 
    },
    centerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#262626',
    },
    loadingIndicator: {
        marginTop: 50,
        backgroundColor: '#262626',
        flex: 1,
    },
    notFoundText: {
        color: '#fff',
        fontSize: 18,
    },
    imageContainer: {
        borderRadius: 120, 
        width: 240,
        height: 240,
        backgroundColor: '#444', 
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 25,
        borderWidth: 4, 
        borderColor: '#61dafb', 
        elevation: 10, 
        shadowColor: '#61dafb', 
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
    },
    characterImage: {
        width: 220,
        height: 220,
        borderRadius: 110, 
        borderWidth: 2, 
        borderColor: '#fff',
    },
    infoBox: {
        backgroundColor: '#3a3a3a', 
        borderRadius: 15,
        padding: 20,
        width: '100%',
        maxWidth: 400, 
        marginBottom: 20,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        borderWidth: 1,
        borderColor: '#555',
    },
    characterName: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#61dafb', 
        textAlign: 'center',
        marginBottom: 20,
        textShadowColor: 'rgba(0,0,0,0.75)', 
        textShadowOffset: {width: -1, height: 1},
        textShadowRadius: 10
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#555',
    },
    detailLabel: {
        fontSize: 18,
        fontWeight: '600',
        color: '#ccc',
    },
    detailValue: {
        fontSize: 18,
        color: '#fff',
    },
    statusAlive: {
        color: '#4CAF50', 
        fontWeight: 'bold',
    },
    statusDead: {
        color: '#F44336', 
        fontWeight: 'bold',
    },
    statusUnknown: {
        color: '#FFEB3B', 
        fontWeight: 'bold',
    },
    episodesContainer: {
        backgroundColor: '#3a3a3a',
        borderRadius: 15,
        padding: 20,
        width: '100%',
        maxWidth: 400,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        borderWidth: 1,
        borderColor: '#555',
    },
    episodesHeader: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#61dafb',
        marginBottom: 15,
        textAlign: 'center',
    },
    episodeItem: {
        fontSize: 16,
        color: '#fff',
        paddingVertical: 5,
        paddingLeft: 10,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#555',
    },
});