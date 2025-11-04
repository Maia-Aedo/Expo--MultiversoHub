import { useState, useEffect } from 'react';
import NetInfo from "@react-native-community/netinfo";

export function useNetInfo() {
  const [isOnline, setIsOnline] = useState<boolean | null>(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      // Asumimos offline si isInternetReachable es false o no esta disponible
      const online = state.isConnected && state.isInternetReachable;
      setIsOnline(online !== null ? online : state.isConnected);
    });

    // Retorno para limpiar el listener al desmontar
    return () => unsubscribe();
  }, []);

  return isOnline;
}