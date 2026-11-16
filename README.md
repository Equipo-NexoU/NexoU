# NexoU — Prototipo web para IHC

Prototipo frontend de una plataforma universitaria orientada a descubrir actividades, conocer compañeros y coordinar encuentros. Es un proyecto académico: las acciones de usuario se simulan localmente; no hay un sistema de cuentas real ni una base de datos en la versión revisada.

## Autores
- Brayan Anderson Espinoza Churasi
- Italo Alessandro Cardenas Ocmin
- Sánchez Alcedo, Joaquín Sebastián
-  Luna Huaman, Diego Fabricio

## Enlaces

- Repositorio: [https://github.com/brayan-ech/NexoU](https://github.com/Equipo-NexoU/NexoU)
- Página proporcionada por el equipo: [https://brayan-ech.github.io/NexoU/](https://equipo-nexou.github.io/NexoU/)
- Diseño: https://www.figma.com/design/fnTvtYm2g73rYkLMMvNmaA/NexoU?node-id=0-1
- Tablero del Sprint: https://trello.com/b/78NQJodV/nexou-sprint-1

## Estructura actual verificada

```text
public/
  index.html
  assets/
    images/
    styles/
      styles.css
      styles_descubrir.css
      styles_eventos.css
      ...
    scripts/
      scripts_descubrir.js
      scripts_perfil_eventos_y_navegacion.js
      scripts_login_y_signup.js
      ...
README.md
```

La navegación y los módulos de Descubrir, Eventos, Perfil, Conocer y Chats se agrupan en `index.html`. Los estilos y scripts se cargan mediante rutas relativas.

## Ejecución

Abrir `index.html` en un navegador actualizado o servir la carpeta como sitio estático (por ejemplo, con una extensión de servidor local de VS Code). Para publicar con GitHub Pages, el administrador puede elegir `Settings > Pages > Deploy from a branch > main > /(root)` si esa es la estrategia aprobada. Confirmar en GitHub la configuración real antes de afirmar que está aplicada.

## Capacidades demostrativas identificadas

- Búsqueda de tarjetas por texto desde Descubrir.
- Creación de tarjetas de eventos con formulario local.
- Unirse/cancelar y reflejar el estado en Eventos y en el contador de Perfil (memoria del navegador).
- Pantallas y estilos responsive definidos mediante CSS.

## Limitaciones importantes

- No existe verificación real de credenciales: el inicio de sesión es una demostración visual.
- El estado de los eventos no se persiste en servidor y puede perderse al recargar.
- Falta evaluar los casos alternativos, validaciones de fecha/cupos y aceptación de las historias de usuario.
- No está verificado que se hayan completado las 30 historias core exigidas por el curso.

## Colaboración y cambios

El repositorio original tiene como rama verificada `main`. Para integrar este paquete, crear una rama `feature/av2-implementacion-mejoras`, copiar los archivos aprobados y presentar un Pull Request hacia `main` o `develop` si el equipo ya implementó GitFlow. **No publicar este paquete sin revisar sus diferencias y ejecutar las pruebas.**

Consulta el resto de archivos en `docs/` para pasos de GitFlow, despliegue, pruebas y trazabilidad de historias.
