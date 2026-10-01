# Publicación con GitHub Actions

Una PR ejecuta lint, TypeScript del Worker, 22 pruebas con respuestas simuladas y build estático. No recibe credenciales de Cloudflare ni publica. Al hacer push a main, los mismos checks deben pasar; después se publica sancho-chat y, solo si ese paso termina bien, el artefacto de GitHub Pages. No hay conversaciones, fallos provocados ni pruebas funcionales contra producción.

## Configuración manual, una sola vez

Este acceso persistente requiere autorización del propietario. No enviar tokens por chat ni incluirlos en archivos del repositorio.

1. En Cloudflare, usar un token con estas dos políticas comprobadas para la cuenta `cbf35b93aad7541e8b0a6d731597c7b2`:
   - **Individual Workers Editor**, alcance `Specified Workers` → **sancho-chat**. Permite modificar código, secretos y ajustes únicamente de ese Worker.
   - **Workers Content Read-Only**, alcance **Entire Account** de esta cuenta. Permite leer código y metadatos de todos los Workers presentes y futuros de esta cuenta; no limitar la explicación a “leer rutas”. No concede escritura en otros Workers.

   El propietario aprobó expresamente esta ampliación de lectura durante la publicación inicial. Para una nueva cuenta o ampliación futura se necesita autorización específica antes de guardar el permiso. No autorizar DNS, facturación, administración de cuenta ni escritura KV/R2. Proteger el workflow y restringir quién puede modificarlo es necesario.

   Formulario oficial: https://dash.cloudflare.com/cbf35b93aad7541e8b0a6d731597c7b2/api-tokens/create . `Token name` → nombre descriptivo; `Start from scratch` → política de Worker específico; añadir otra política de cuenta → `Workers / Content Read-only`. Elegir expiración y completar revisión/creación personalmente. Para un token existente, `Token actions → Edit` permite actualizar las políticas sin rotarlo ni volver a copiar su valor.
2. Abrir https://github.com/esteban-sanchez-ortiz/portfolio/settings/environments (requiere sesión del propietario). En GitHub → repositorio portfolio → Settings → Environments, crear `cloudflare-production`. Restringir deployment branches a `main`; añadir revisión requerida si el plan de GitHub lo permite y se desea aprobación por release.
3. En ese entorno, añadir el secret `CLOUDFLARE_API_TOKEN` pegando el valor directamente desde Cloudflare. Añadir la variable no secreta `CLOUDFLARE_ACCOUNT_ID` con `cbf35b93aad7541e8b0a6d731597c7b2`.
4. Conservar el entorno existente `github-pages`. FIREWORKS_API_KEY, GROQ_API_KEY y CANARY permanecen como secretos del Worker; no copiarlos a GitHub.

No se usa OAuth interactivo de Wrangler ni OIDC hacia Cloudflare. OIDC está limitado al job de GitHub Pages. No hay un entorno Wrangler llamado production: no añadir --env production.

## Por qué se necesita la política adicional de lectura

El token inicial con Editor solo en sancho-chat devolvió HTTP 200 para servicio, bindings, subdominio, entorno y schedules, pero HTTP 403 para rutas y dominios personalizados. Wrangler 4.115.0 consulta esos metadatos antes del upload cuando el último cambio procede del dashboard (`last_deployed_from === "dash"`), incluso si esta release no cambia rutas ni dominios. Añadir la lectura de Workers de esta cuenta resolvió ambas consultas sin ampliar la escritura. No es una garantía de que este permiso baste para otros productos o futuras configuraciones.

El preflight de CI imprime únicamente etiquetas y estados HTTP; nunca cuerpos de respuesta, bindings ni credenciales. Si un endpoint devuelve error, el job se detiene antes del despliegue. No ampliar permisos automáticamente.

Evidencia de la publicación inicial: https://github.com/esteban-sanchez-ortiz/portfolio/actions/runs/36766937286 (attempt 2); commit `527a37291d05519c4fc4b633cdc4d351a1cd3a01`; Worker `8f5f9c6b-9d9c-4b74-b8dc-26a7af3ecd9b`.

## Alcance y evidencia

Wrangler 4.115.0 está fijado en package.json y lockfile; la acción Wrangler v4 está fijada por SHA. Se mantienen nombre, workers.dev, namespaces KV, rate limiter y módulos Markdown. `keep_vars` conserva variables existentes del dashboard; las variables declaradas en wrangler.jsonc actualizan explícitamente los modelos. Los secretos no se incluyen en el bundle ni en los inputs de secrets de la acción.

Las releases se serializan con cancel-in-progress false. Una falla en Worker impide publicar Pages. Una falla posterior en Pages puede dejar el nuevo backend con el frontend anterior: revisar ambos jobs y reejecutar el job fallido, sin provocar errores en producción. Guardar el commit y los IDs de versión anterior/nueva que Cloudflare muestra antes/después de publicar. La verificación posterior se limita a estado CI, versión y HTTP de archivos estáticos.

## Rollback explícito

No hay rollback automático. Antes de hacer rollback del backend, consultar Cloudflare Deployments y confirmar el UUID completo de la versión previa y su configuración. Solo se registró el prefijo `d2b52f3d` antes de la publicación inicial; no usarlo como UUID completo. Para backend, seleccionar conscientemente esa versión confirmada; esa versión podría seguir usando los modelos retirados y no constituye una reparación del fallo original. Para frontend/código, revertir el commit de release mediante un nuevo commit normal en main. Esto vuelve a ejecutar el pipeline; revisar también qué configuración de Worker se está revirtiendo. Nunca reset/force push ni borrar secretos.

Fuentes oficiales: https://developers.cloudflare.com/workers/authorization/workers/ y https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/
