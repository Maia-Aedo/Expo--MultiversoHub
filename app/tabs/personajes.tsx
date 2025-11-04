import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { usePersonajes } from "../../src/hooks/usePersonajes";
import { Link } from "expo-router";
import { SafeAreaView , useSafeAreaInsets } from 'react-native-safe-area-context'; 

export default function ListadoPersonajes() {
    // Hook de carga de personajes
    const { personajes, loading } = usePersonajes();
const insets = useSafeAreaInsets();

    // Spinner
    if (loading) {
        return <ActivityIndicator size="large" style={styles.loadingIndicator} color="#61dafb" />;
    }

    // Si no hay personajes
    if (!personajes || personajes.length === 0) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.text}>No se encontraron personajes.</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={personajes}
                keyExtractor={(item) => item.id.toString()} 
                renderItem={({ item }) => (
                    <Link href={`/personaje/${item.id}`} asChild>
                        <TouchableOpacity style={styles.touchableWrapper}>
                            {/* CardPersonaje o la vista interna de la tarjeta */}
                            <View style={styles.item}>
                                {item.image && <Image source={{ uri: item.image }} style={styles.thumb} />}
                                <View style={styles.itemBody}>
                                    <Text style={styles.name}>{item.name}</Text>
                                    <Text style={styles.meta}>{item.species} - {item.status}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </Link>
                )}
                contentContainerStyle={{ 
                    paddingHorizontal: 15, 
                    paddingBottom: insets.bottom + 80 
                }}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#262626',
    },
    loadingIndicator: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#262626',
    },
    text: {
        color: '#fff',
        textAlign: 'center',
        marginTop: 50,
    },

    touchableWrapper: {
        marginVertical: 4,
    },
    item: {
        flexDirection: "row", 
        alignItems: "center", 
        padding: 15,
        borderRadius: 10,
        backgroundColor: '#3a3a3a', 
        borderLeftWidth: 3,
        borderColor: '#61dafb',
    },
    thumb: { 
        width: 50, 
        height: 50, 
        borderRadius: 25, 
        marginRight: 15,
        borderWidth: 1,
        borderColor: '#fff',
    },
    itemBody: {
        flex: 1
    },
    name: { 
        fontWeight: "700", 
        color: '#fff', 
        fontSize: 16 
    },
    meta: { 
        color: "#ccc", 
        fontSize: 12 
    },
});