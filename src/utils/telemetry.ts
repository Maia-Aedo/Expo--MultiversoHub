type EventType = 'NAV' | 'FAVORITE' | 'FILTER' | 'OFFLINE' | 'PROFILE';

export function logEvent(type: EventType, details: Record<string, any>) {
  const timestamp = new Date().toISOString();
  const message = `[${timestamp}] [${type}] - ${JSON.stringify(details)}`;
  console.log(message);
}

// Cada vez que una parte importante de tu aplicación hace algo (como añadir un favorito), llama a esta función. 
// El archivo telemetry.ts registra el evento en la consola,
//  creando un historial que es fundamental para depurar (encontrar errores) y entender cómo se usa la aplicación.