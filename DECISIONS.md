# DECISIONS.md

Documento de decisiones técnicas tomadas durante el desarrollo del sistema de monitoreo industrial.

---

## 1. ¿Cómo modelaste la relación entre sensores y zonas y por qué?

La relación entre sensores y zonas es many-to-many, pero con un matiz importante: cada asignación tiene información propia que no pertenece ni al sensor ni a la zona. La fecha de instalación, el tipo de lectura, el valor umbral y el estado del monitoreo describen el vínculo en sí mismo, no a ninguna de las dos entidades por separado. Un mismo sensor puede tener un umbral distinto según la zona donde esté instalado, así que esos datos no podían vivir en la tabla `sensor` ni en la tabla `zone`.

Por eso descarté resolverlo con foreign keys directas y modelé una tabla intermedia llamada `Monitoring`, que trato como una entidad de negocio propia y no como un simple puente. Tiene `sensorId` y `zoneId` como foreign keys hacia `Sensor` y `Zone`, más sus atributos específicos (`fechaInstalacion`, `tipoLectura`, `valorUmbral`, `estado`).

Además agregué una restricción `@@unique([sensorId, zoneId])` para impedir que un mismo sensor se asigne dos veces a la misma zona, lo cual no tendría sentido en el dominio. Esta decisión refleja la realidad del negocio: asignar un sensor a una zona es un acto con entidad propia (una instalación con su configuración), no solo un enlace entre dos registros.

---

## 2. ¿Qué validación o restricción consideras más importante en tu solución y por qué?

La más importante a nivel de base de datos es la restricción `@@unique([sensorId, zoneId])`. Protege la integridad del modelo: un sensor no puede estar monitoreando la misma zona dos veces, y dejar que eso ocurriera generaría datos contradictorios (dos umbrales distintos para la misma instalación). La base de datos es la última línea de defensa y debe garantizar esa invariante pase lo que pase.

Sin embargo, no me quedé solo con la restricción de la base. En el servicio `createMonitoring` verifico explícitamente que la combinación no exista antes de insertar, para responder con un error HTTP 400 descriptivo ("El sensor X ya está asignado a la zona Y") en lugar de dejar que estalle un error genérico de constraint de MySQL, que sería opaco para quien consume la API.

La otra validación que considero clave es el rango de `valorUmbral` según el tipo de lectura (TEMPERATURA, PRESION, VIBRACION, FLUJO). Sin ella el sistema aceptaría valores absurdos como negativos, ceros o cifras fuera de cualquier rango físico realista. La implementé con defensa en profundidad: en el frontend antes de enviar, en el controlador del backend y respaldada por los tipos. Así el dato queda correcto sin importar por dónde entre al sistema.

---

## 3. ¿Cómo organizaste la estructura de tu backend y por qué elegiste esa organización?

Organicé el backend en capas con una responsabilidad clara por cada una. Las rutas (`routes/`) solo definen los endpoints y los apuntan a su controlador. Los controladores (`controllers/`) reciben el request, validan la estructura del body, llaman al servicio y arman la respuesta con el código HTTP correcto. Los servicios (`services/`) concentran la lógica de negocio y las consultas a Prisma. Los tipos (`types/`) viven en archivos separados y se comparten entre capas. Los middlewares (`middlewares/`) manejan los errores globales y las rutas no encontradas. Y `utils/` agrupa helpers reutilizables como `createError` y los rangos de validación.

Elegí esta separación porque cada capa cambia por motivos distintos. Si mañana reemplazo Prisma por otro ORM, solo toco los servicios; si cambio Express por Fastify, solo afecto rutas y controladores. La lógica de negocio no depende del framework HTTP ni del detalle de la base.

El manejo de errores es centralizado y es la pieza que conecta todo. Los servicios lanzan errores con `statusCode` mediante `createError`, los controladores los delegan al middleware global con `next(err)`, y ese middleware responde siempre con el mismo formato estandarizado `ApiResponse<T>`. Eso evita repetir try/catch con respuestas distintas en cada endpoint y garantiza que el cliente reciba siempre una estructura consistente.

---

## 4. Si tuvieras un día adicional para mejorar el proyecto, ¿qué implementarías primero y por qué?

Implementaría autenticación con JWT y un sistema de roles (administrador y operador), junto con el CRUD completo de sensores y zonas.

Hoy el sistema permite asignar monitoreos y actualizar su umbral y estado, pero no permite crear sensores ni zonas desde la interfaz. En una planta real eso es una limitación seria: se incorporan sensores nuevos y se reconfiguran zonas con frecuencia, y obligar a hacerlo por SQL directo no es viable. Por eso priorizaría los endpoints `POST`, `PUT` y `DELETE` para `Sensor` y `Zone`, con sus vistas de administración en el frontend.

La autenticación es igual de urgente. Actualmente cualquiera con acceso a la API puede pausar el monitoreo de una zona crítica o modificar un umbral de alerta. En un contexto industrial eso es un riesgo operativo directo: un umbral mal puesto puede silenciar una alarma real. Añadiría un middleware de autenticación JWT y una tabla de usuarios con roles, de modo que un operador pueda consultar el estado y ajustar umbrales, mientras que solo un administrador pueda crear o eliminar entidades.

Elegiría esto antes que cualquier mejora estética o de rendimiento porque es lo que separa un prototipo funcional de un sistema realmente utilizable en producción: aporta valor de negocio inmediato y cierra un hueco de seguridad evidente.
