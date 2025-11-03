import { Stack } from "expo-router";

export default function PersonajeLayout() {
    return (
        <Stack
            screenOptions={{
                headerStyle: { backgroundColor: "#1e1e2d" },
                headerTintColor: "#fff",
                headerTitleAlign: "center",
                // headerBackTitleVisible: false, // Opcional: Oculta el título "Atrás" en iOS
            }}
        >
            <Stack.Screen 
                name="[id]" 
                options={{ 
                    title: "Detalles", // Título por defecto
                    headerShown: false, // <-- OCULTA EL HEADER COMPLETO
                }} 
            />
        </Stack>
    );
}
