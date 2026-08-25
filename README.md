# mktsurge.com — sitio público

Sitio estático (HTML/CSS, sin build ni dependencias) para la agencia MKT Surge.

## Estructura
```
index.html       → landing principal
catalogo.html     → catálogo detallado de los 10 servicios
assets/css/       → sistema de marca (colores, tipografías, componentes)
assets/img/       → logo y favicon
robots.txt        → indexación para buscadores
sitemap.xml       → mapa del sitio para Google
```

## Previsualizar en tu PC
No necesita servidor ni instalación. Doble clic en `index.html` lo abre en el navegador. Si prefieres verlo como se vería en línea (recomendado antes de publicar), corre desde esta carpeta:

```
python -m http.server 8000
```
y abre `http://localhost:8000` en el navegador.

## Publicar en GitHub Pages
1. Abre git bash en esta carpeta (`PROGRAMACION\mktsurge.com`).
2. Si aún no es un repo: `git init`, luego `git add .` y `git commit -m "Primera versión del sitio"`.
3. Crea el repositorio **público** en GitHub (ej. `mktsurge-web`) y conéctalo: `git remote add origin <url-del-repo>`.
4. `git push -u origin main`.
5. En GitHub → Settings → Pages, activa Pages sobre la rama `main` (carpeta raíz).
6. En GoDaddy, apunta el DNS de `mktsurge.com` al registro que te da GitHub Pages (registros A hacia las IPs de GitHub Pages, o CNAME si usas `www`). GitHub Pages documenta los valores exactos en Settings → Pages una vez actives el dominio personalizado.
7. Cada vez que quieras publicar un cambio: edita local → `git add .` → `git commit -m "..."` → `git push`. GitHub Pages actualiza el sitio solo, unos minutos después del push.

## Pendiente antes de publicar
- Confirmar con los clientes mencionados en "Resultados, no promesas" (velas artesanales, aniversario parroquial) si prefieres usar sus nombres reales — dejé las descripciones genéricas a propósito hasta confirmar.
- Reemplazar/ajustar la paleta y el logo si el branding de Canva trae cambios.
- Revisar el número de WhatsApp y el correo antes de publicar (tomados de la factura oficial: +1 929 530 8974 / mktsurge@gmail.com).
