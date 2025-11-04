import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from 'react-native-safe-area-context'; 
import { logEvent } from "../../src/utils/telemetry"; 
import { Ionicons } from "@expo/vector-icons";

const APP_VERSION = "1.0.0 (Beta)"; 

export default function SettingsScreen() {

    const handleClearData = async () => {
        Alert.alert(
            "Confirmar Eliminación",
            "¿Estás seguro de que deseas borrar todos los datos guardados (favoritos)? Esta acción es irreversible.",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Borrar Datos",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await AsyncStorage.clear(); 
                            logEvent('PROFILE', { action: 'clear_data', status: 'success' }); 
                            Alert.alert("¡Éxito!", "Todos los datos (favoritos) fueron eliminados. Reinicia la app para recargar los cambios.");
                            
                        } catch (e) {
                            logEvent('PROFILE', { action: 'clear_data', status: 'error', error: e });
                            Alert.alert("Error", "No se pudieron borrar los datos.");
                        }
                    },
                },
            ]
        );
    };
    
    // Tema Claro/Oscuro
    const ThemeOption = () => (
        <View style={styles.infoContainer}>
            <Text style={styles.label}>Tema Actual:</Text>
            <Text style={styles.value}>Oscuro (Por Defecto)</Text>
             <Ionicons name="color-palette-outline" size={24} color="#61dafb" />
        </View>
    );

    return (
        
        <SafeAreaView style={styles.container}> 
            <Text style={styles.header}>Configuración y Perfil</Text>

            {/* Opción 1: Tema (Claro/Oscuro) */}
            <ThemeOption />

            {/* Opción 2: Borrar Datos Guardados (Destructiva) */}
            <TouchableOpacity style={styles.button} onPress={handleClearData}>
                <Text style={styles.buttonText}>🗑️ Borrar Datos Guardados</Text>
            </TouchableOpacity>
            
            <View style={styles.separator} />

            {/* Opción 3: Versión de la Aplicación */}
           <View style={styles.infoContainer}>
                <Text style={styles.label}>Versión:</Text>
                <Text style={styles.value}>{APP_VERSION}</Text>
                 <Ionicons name="information-circle-outline" size={24} color="#61dafb"  /> 
            </View>
            
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#262626', 
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
        color: '#61dafb', 
    },
    button: {
        backgroundColor: '#dc3545', 
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 10, 
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    separator: {
        marginVertical: 20,
        borderBottomColor: '#555', 
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    infoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        backgroundColor: '#3a3a3a', 
        paddingHorizontal: 15,
        borderRadius: 10,
        marginVertical: 5,
        borderLeftWidth: 3,
        borderLeftColor: '#61dafb',
    },
    label: {
        fontSize: 16,
        color: '#ccc', 
        fontWeight: '600',
        flex: 1, 
    },
    value: {
        fontSize: 16,
        fontWeight: '400',
        color: '#fff', 
         marginRight: 10, 
    },
});