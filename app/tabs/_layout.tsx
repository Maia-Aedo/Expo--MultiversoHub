import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { FavoriteProvider } from "../../src/context/FavoriteContext";
import React from "react";

export default function RootLayout() {
    return (
        <FavoriteProvider>
            <Tabs
                screenOptions={{
                    headerStyle: { backgroundColor: "#1e1e2d" },
                    headerTintColor: "#fff",
                    headerTitleAlign: "center",
                    tabBarStyle: {
                        backgroundColor: "#1e1e2d",
                        borderTopWidth: 0,
                        elevation: 0,
                        height: 65,
                        paddingBottom: 10,
                        paddingTop: 5,
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
                    }}
                />
                <Tabs.Screen
                    name="personajes"
                    options={{
                        title: "Personajes",
                        tabBarIcon: ({ color, size }) => <Ionicons name="people-outline" size={size} color={color} />,
                    }}
                />
                <Tabs.Screen
                    name="favoritos"
                    options={{
                        title: "Favoritos",
                        tabBarIcon: ({ color, size }) => <Ionicons name="heart-outline" size={size} color={color} />,
                    }}
                />
                <Tabs.Screen
                    name="settings"
                    options={{
                        title: "Perfil",
                        tabBarIcon: ({ color, size }) => <Ionicons name="settings-outline" size={size} color={color} />,
                    }}
                />
            </Tabs>
        </FavoriteProvider>
    );
}
