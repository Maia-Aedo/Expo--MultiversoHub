# MultiversoHub: Explorador de Personajes de Rick & Morty

## 📄 1. Resumen del Proyecto

**MultiversoHub** es una aplicación móvil educativa y de entretenimiento desarrollada para explorar el universo de *Rick and Morty*. El objetivo principal fue implementar una solución que permitiera a los usuarios:
1.  Visualizar listados y detalles de personajes (consumo de API).
2.  Gestionar y **persistir** una lista de favoritos (Almacenamiento Local).
3.  Mantener la funcionalidad parcial en **Modo Offline** (Manejo de conectividad).

El proyecto fue desarrollado utilizando **React Native con Expo Router** para una navegación moderna y limpia (Tabs y Stacks), cumpliendo con todos los requerimientos de telemetría y configuración solicitados.

---
## 🔗 1.1. Documentación Completa del Proyecto

Aquí se encuentra la documentación detallada del trabajo, casos de uso, decisiones técnicas y evidencias del desarrollo:

👉 https://docs.google.com/document/d/10d5JIKT7dn2mAzYa2U0enoxdvjcUewPdTinyTWa0d6Q/edit?usp=sharing
---

## 🛠️ 2. Tecnologías Utilizadas

| Tecnología | Rol en el Proyecto |
| :--- | :--- |
| **React Native (Expo)** | Framework principal para el desarrollo móvil. |
| **Expo Router** | Sistema de enrutamiento y navegación (Tabs y Stacks). |
| **Context API + useReducer** | Manejo del estado global de la lista de Favoritos. |
| **AsyncStorage** | Persistencia local de la lista de favoritos. |
| **@react-native-community/netinfo** | Detección del estado de la conexión a Internet (Modo Offline). |
| **TypeScript** | Tipado estático para asegurar la calidad y evitar errores en la lógica. |
| **Rick and Morty API** | Fuente pública de datos para personajes. |

---

## 3. Guía de Ejecución

Para iniciar el proyecto en tu máquina local:

1.  **Clonar el repositorio:**
    ```bash
    git clone [https://www.youtube.com/watch?v=dnxdIzF8p3k](https://www.youtube.com/watch?v=dnxdIzF8p3k)
    cd Expo-MultiversoHub
    ```
2.  **Instalar dependencias:**
    ```bash
    npm install
    # o yarn install
    ```
3.  **Ejecutar la aplicación:**
    ```bash
    npx expo start
    ```
    Escanea el código QR con la aplicación **Expo Go** en tu dispositivo móvil o emulador.

---

## 💡 4. Decisiones Importantes de Diseño e Implementación

| Requisito del TP | Implementación y Justificación |
| :--- | :--- |
| **4. Favoritos y 6. Persistencia** | Se usó **Context API** con `useReducer` para la gestión global de favoritos, garantizando que el estado sea accesible por el Home, la lista de Favoritos, y el Detalle. Se combinó con **AsyncStorage** para que la lista se recuerde después de cerrar la aplicación. |
| **7. Modo Offline** | Se implementó el hook `useNetInfo` en el `app/tabs/_layout.tsx` (el layout principal de pestañas). Si la conexión es `false`, se renderiza un **Banner de Advertencia** visible en la parte superior de todas las vistas principales. |
| **8. Telemetría Local** | Se creó la utilidad `src/utils/telemetry.ts` para registrar eventos clave (`FAVORITE`, `FILTER`, `PROFILE`) en la consola (`console.log`), cumpliendo con el requisito de registro de acciones del usuario. |
| **9. Perfil** | La pantalla `app/tabs/settings.tsx` incluye la opción de **Borrar Datos Guardados** (llamando a `AsyncStorage.clear()`), cumpliendo con la gestión de preferencias y la visualización de la versión. |
| **Estructura de Navegación** | Se implementó el patrón **Tabs** para las vistas principales (`home`, `favoritos`, etc.) y un **Stack anidado** en la ruta `/personaje/[id]` para el detalle, garantizando que el usuario pueda navegar entre pestañas mientras ve un detalle. |

---

## 🧠 5. Aprendizajes Obtenidos

* **Gestión de Estados Complejos:** Se dominó la combinación de la **Context API** y `useReducer` para manejar un estado global (favoritos) de forma limpia y escalable.
* **Diseño de Experiencias Offline:** Se aprendió a usar el estado de conectividad (`NetInfo`) para modificar la interfaz del usuario (`OfflineBanner`), haciendo la aplicación más robusta.
* **Tipado Riguroso:** El uso de **TypeScript** fue clave para definir las estructuras de datos de la API y evitar errores de asignación, especialmente en las operaciones de guardar/cargar favoritos.
* **Navegación Dinámica:** Se consolidó el uso de Expo Router para manejar rutas dinámicas (pasando el `ID` del personaje a la pantalla de detalle).

---

## 🧑‍💻 6. Contribuidores

* **[AEDO MAIA]**
* **[ULLOA SOTO MELINA]**
