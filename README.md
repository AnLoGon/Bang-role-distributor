# 🤠 BANG! - Distribuidor de Roles y Personajes

Una aplicación web moderna y temática del Viejo Oeste para barajar y repartir los roles y personajes del juego de mesa **BANG!** (3 a 8 jugadores).

## ✨ Características

- 👥 **Soporte de 3 a 8 jugadores** con la distribución oficial de roles (Sheriff, Alguacil, Forajidos y Renegado).
- 🤠 **Personalización de Humanos vs VNJs (Bots)**: Juega con tu grupo de amigos o en solitario contra bots.
- 🔒 **Modo Pasar y Jugar (Cartas Secretas)**: Dorso temático 3D con giro para revelar tu rol en privado sin que los demás jugadores lo vean.
- 🔓 **Modo Descubierto**: Opción para ver todos los roles de la mesa a la vez.
- 🔲 **Vistas Dinámicas**: Elige entre la mesa redonda de la cantina o cuadrícula de cartas optimizada para móviles y tablets.
- 📖 **Guía Completa de Reglas y Personajes**: Buscador de más de 30 personajes con sus habilidades oficiales y puntos de vida (+1 vida extra para el Sheriff).
- 🔊 **Efectos de Sonido del Oeste**: Sonidos de barajado y disparos con Web Audio API (con botón para silenciar).

---

## 🚀 Cómo Publicar en GitHub Pages

Esta aplicación ya está configurada con `base: './'` en `vite.config.ts` y cuenta con un flujo de trabajo automatizado de GitHub Actions.

### Opción 1 (Recomendada - 100% Automática con GitHub Actions)

1. Sube tu código a un repositorio en **GitHub**.
2. En tu repositorio de GitHub, entra en **Settings** (Configuración) -> **Pages**.
3. En **Build and deployment** -> **Source**, selecciona: **GitHub Actions**.
4. ¡Listo! El archivo `.github/workflows/deploy.yml` compilará la app automáticamente en cada `git push` y te dará la URL pública de tu app en GitHub Pages.

### Opción 2 (Despliegue Manual desde `dist`)

1. Ejecuta en tu terminal:
   ```bash
   npm install
   npm run build
   ```
2. La carpeta generada `dist` contiene los archivos estáticos listos para producción (`index.html`, `assets/`, etc.).
3. Puedes subir el contenido de `dist` a la rama `gh-pages` de tu repositorio.

---

## 💻 Desarrollo Local

Para probar la app en tu ordenador:

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

Abre `http://localhost:3000` en tu navegador.
