# Publicación con GitHub Actions

Una PR ejecuta lint, TypeScript del Worker, 22 pruebas con respuestas simuladas y build estático. No recibe credenciales de Cloudflare ni publica. Al hacer push a main, los mismos checks deben pasar; después se publica sancho-chat y, solo si ese paso termina bien, el artefacto de GitHub Pages. No hay conversaciones, fallos provocados ni pruebas funcionales contra producción.

## Configuración manual, una sola vez

Este acceso persistente requiere autorización del propietario. No enviar tokens por chat ni incluirlos en archivos del repositorio.

1. Abrir https://dash.cloudflare.com/cbf35b93aad7541e8b0a6d731597c7b2/api-tokens/create . En el formulario actual: `Token name` → nombre descriptivo; `Start from scratch` → `Specified Workers` → `sancho-chat`; `Individual Workers` → `Editor`. Elegir expiración y completar revisión/creación personalmente. En Cloudflare, crear un API token con el rol **Workers Editor**, restringido al Worker existente **sancho-chat** de la cuenta `cbf35b93aad7541e8b0a6d731597c7b2`. No autorizar DNS, facturación, administración de cuenta ni escritura KV/R2. El rol puede cambiar código, secretos y ajustes de ese Worker: proteger el workflow es necesario.
2. Abrir https://github.com/esteban-sanchez-ortiz/portfolio/settings/environments (requiere sesión del propietario). En GitHub → repositorio portfolio → Settings → Environments, crear `cloudflare-production`. Restringir deployment branches a `main`; añadir revisión requerida si el plan de GitHub lo permite y se desea aprobación por release.
3. En ese entorno, añadir el secret `CLOUDFLARE_API_TOKEN` pegando el valor directamente desde Cloudflare. Añadir la variable no secreta `CLOUDFLARE_ACCOUNT_ID` con `cbf35b93aad7541e8b0a6d731597c7b2`.
4. Conservar el entorno existente `github-pages`. FIREWORKS_API_KEY, GROQ_API_KEY y CANARY permanecen como secretos del Worker; no copiarlos a GitHub.

No se usa OAuth interactivo de Wrangler ni OIDC hacia Cloudflare. OIDC está limitado al job de GitHub Pages. No hay un entorno Wrangler llamado production: no añadir --env production.

## Alcance y evidencia

Wrangler 4.115.0 está fijado en package.json y lockfile; la acción Wrangler v4 está fijada por SHA. Se mantienen nombre, workers.dev, namespaces KV, rate limiter y módulos Markdown. `keep_vars` conserva variables existentes del dashboard; las variables declaradas en wrangler.jsonc actualizan explícitamente los modelos. Los secretos no se incluyen en el bundle ni en los inputs de secrets de la acción.

Las releases se serializan con cancel-in-progress false. Una falla en Worker impide publicar Pages. Una falla posterior en Pages puede dejar el nuevo backend con el frontend anterior: revisar ambos jobs y reejecutar el job fallido, sin provocar errores en producción. Guardar el commit y los IDs de versión anterior/nueva que Cloudflare muestra antes/después de publicar. La verificación posterior se limita a estado CI, versión y HTTP de archivos estáticos.

## Rollback explícito

No hay rollback automático. Para backend, seleccionar conscientemente la versión previa en Cloudflare Deployments; esa versión podría seguir usando los modelos retirados y no constituye una reparación del fallo original. Para frontend/código, revertir el commit de release mediante un nuevo commit normal en main. Esto vuelve a ejecutar el pipeline; revisar también qué configuración de Worker se está revirtiendo. Nunca reset/force push ni borrar secretos.

Fuentes oficiales: https://developers.cloudflare.com/workers/authorization/workers/ y https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/
