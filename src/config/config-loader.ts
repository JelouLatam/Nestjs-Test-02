import * as fs from 'fs';
import * as path from 'path';

export function loadConfig(env: string): Record<string, any> {
  const envPath = path.resolve(__dirname, `../../environments/${env}.env`);

  if (!fs.existsSync(envPath)) {
    throw new Error(`Config file not found: ${envPath}`);
  }

  const fileContent = fs.readFileSync(envPath, 'utf-8');

  // Parsear el archivo .env con soporte para [SECCION]
  const parsedEnv: Record<string, any> = {};
  let currentSection = '';

  fileContent.split(/\r?\n/).forEach((line) => {
    line = line.trim();
    if (!line || line.startsWith('#')) return; // Ignorar líneas vacías y comentarios

    // Detectar si es una sección nueva [SECCION]
    const sectionMatch = line.match(/^\[(.+)]$/);
    if (sectionMatch) {
      currentSection = sectionMatch[1];
      return;
    }

    // Extraer clave y valor
    const [key, value] = line.split('=').map((part) => part.trim());

    if (key) {
      // Guardar en formato SECTION_KEY (ej: DATABASE_DB_HOST)
      const envKey = currentSection
        ? `${currentSection}_${key}`.toUpperCase()
        : key.toUpperCase();
      parsedEnv[envKey] = value.replace(/^"|"$/g, ''); // Eliminar comillas del valor
    }
  });

  return parsedEnv;
}
