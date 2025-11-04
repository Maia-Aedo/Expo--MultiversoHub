import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { FavoriteProvider } from "../../src/context/FavoriteContext";
import React from "react";
import { useNetInfo } from "../../src/hooks/useNetInfo";
import { View, Text, StyleSheet } from "react-native";

import { useSafeAreaInsets } from 'react-native-safe-area-context'; // importamos para manejar espacio extra en la parte inferior del tabBarStyle

// Componente Banner de advertencia (Fuera del RootLayout)
function OfflineBanner() {
    return (
        <View style={offlineStyles.banner}>
            <Text style={offlineStyles.text}>
                <Ionicons name="warning-outline" size={16} color="#fff" /> Modo Offline. Algunos datos pueden no estar actualizados.
            </Text>
        </View>
    );
}

// Estilos para el banner Offline (Fuera del RootLayout)
const offlineStyles = StyleSheet.create({
    banner: {
        backgroundColor: 'orange',
        padding: 5,
        alignItems: 'center',
        zIndex: 10,
    },
    text: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
    },
});

export default function RootLayout() {
    const isOnline = useNetInfo();
    const insets = useSafeAreaInsets(); // Obtener los insets (espacios seguros)
    
    return (
        <FavoriteProvider>
            {isOnline === false && <OfflineBanner />} 

            <Tabs
                screenOptions={{
                    headerStyle: { backgroundColor: "#1e1e2d" },
                    headerTintColor: "#fff",
                    headerTitleAlign: "center",
                    tabBarStyle: {
                        backgroundColor: "#1e1e2d",
                        borderTopWidth: 0,
                        elevation: 0,
                         height: 65 + insets.bottom, // añade espacio inferior
                        paddingBottom: 10 + insets.bottom, // añade espacio inferior al contenido de la barra
                    },
                    tabBarActiveTintColor: "#61dafb",
                    tabBarInactiveTintColor: "#888",
                }}
            >
                <Tabs.Screen
                    name="home"
                    options={{
                        title: "Inicio",
                        tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
                        headerShown: false, // <-- OCULTA EL HEADER COMPLETO
                    }}
                />
                <Tabs.Screen
                    name="personajes"
                    options={{
                        title: "Personajes",
                        headerShown: false, // <-- OCULTA EL HEADER COMPLETO
                        tabBarIcon: ({ color, size }) => <Ionicons name="people-outline" size={size} color={color} />,
                    }}
                />
                <Tabs.Screen
                    name="favoritos"
                    options={{
                        title: "Favoritos",
                        headerShown: false, // <-- OCULTA EL HEADER COMPLETO
                        tabBarIcon: ({ color, size }) => <Ionicons name="heart-outline" size={size} color={color} />,
                    }}
                />
                <Tabs.Screen
                    name="settings"
                    options={{
                        title: "Perfil",
                 headerShown: false, // <-- OCULTA EL HEADER COMPLETO
                        tabBarIcon: ({ color, size }) => <Ionicons name="settings-outline" size={size} color={color} />,
                    }}
                />
            </Tabs>
        </FavoriteProvider>
    );
}
