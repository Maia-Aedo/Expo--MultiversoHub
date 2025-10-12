import { Stack } from "expo-router";

export default function PersonajeLayout() {
    return (
        <Stack>
            <Stack.Screen name="[id]" options={{ title: "Detalles del personaje:" }} />
        </Stack>
    );
}
