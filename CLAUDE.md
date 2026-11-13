# CLAUDE.md · fullgrader-docs (web fullgrader.app)

## Acceso a GitHub
- No hace falta ningún token ni que Sergi pegue ninguna clave: la conexión se hace con la integración de GitHub de Claude.
- Si falta algún permiso, decirle exactamente dónde concederlo.
- Usuario de GitHub: `rehgix`.
- Los cambios los sube Claude (commit + push a `main`); nunca usar el ordenador de Sergi para subir.

## Sobre Sergi
- No sabe programar: explicarle todo en lenguaje llano y hacer el trabajo técnico.
- Commits: solo título, menos de 50 caracteres.

## La web
- GitHub Pages con dominio `fullgrader.app` (no tocar `CNAME`). 9 idiomas: es, ca, gl, eu, en, de, fr, it, pt.
- Estilos y scripts comunes: `topbar.css/js`, `ds.css`, `fg2026.css`, `ui.css`, `ui.js`. Al cambiarlos, subir el `?v=AAAAMMDDx` en todas las páginas.
- Si se cambia `index.html`, regenerar las copias `ig/`, `x/` y `play/` (index.html + 4 líneas tras `<head>`: comentario, `<base href="/">`, canonical a `/` y `noindex`; sin la línea canonical original).
- No quitar el texto de Google Classroom de la portada (lo exige la verificación de Google).
- Más detalle en el documento del proyecto «web-fullgrader-app.md».
