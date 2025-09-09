import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { usePersonajes } from "../src/hooks/usePersonajes";
import { Link } from "expo-router";

export default function CharacterList() {
    const { personajes, loading } = usePersonajes();

    // Spinner
    if (loading) {
        return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
    }

    return (
        // Listado de personajes
        <FlatList
            data={personajes}
            keyExtractor={(item) => item.id.toString()} // ! key única para cada elto
            renderItem={({ item }) => (
                // Al tocar un personaje, navega a detalles
                <Link href={`/character/${item.id}`} asChild>
                    <TouchableOpacity style={{ flexDirection: "row", padding: 10, alignItems: "center" }}>
                        <Image source={{ uri: item.image }} style={{ width: 60, height: 60, borderRadius: 30 }} />
                        <View style={{ marginLeft: 10 }}>
                            <Text style={{ fontSize: 18, fontWeight: "bold" }}>{item.name}</Text>
                            <Text>{item.species} - {item.status}</Text>
                        </View>
                    </TouchableOpacity>
                </Link>
            )}
        />
    );
}
