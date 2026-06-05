-- ============================================================
--  Industrial Monitoring - Esquema de base de datos (MySQL)
--  Nombres de columnas en camelCase, igual que el schema que
--  genera Prisma (backend/prisma/schema.prisma) sin @map.
-- ============================================================

CREATE DATABASE IF NOT EXISTS industrial_monitoring;
USE industrial_monitoring;

-- ------------------------------------------------------------
-- Tabla: sensor
--  (ENUMs inline en la columna, propios de MySQL)
-- ------------------------------------------------------------
CREATE TABLE sensor (
    id               INT AUTO_INCREMENT PRIMARY KEY,
    nombre           VARCHAR(255) NOT NULL,
    tipo             ENUM('TEMPERATURA','PRESION','VIBRACION','FLUJO') NOT NULL,
    fabricante       VARCHAR(255) NOT NULL,
    fechaFabricacion DATETIME     NOT NULL,
    createdAt        DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- Tabla: zone
-- ------------------------------------------------------------
CREATE TABLE zone (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    nombre          VARCHAR(255) NOT NULL,
    descripcion     TEXT         NOT NULL,
    ubicacion       VARCHAR(255) NOT NULL,
    estadoOperativo ENUM('ACTIVA','INACTIVA','MANTENIMIENTO') NOT NULL,
    createdAt       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- Tabla: monitoring (intermedia, con atributos propios)
-- ------------------------------------------------------------
CREATE TABLE monitoring (
    id               INT AUTO_INCREMENT PRIMARY KEY,
    sensorId         INT          NOT NULL,
    zoneId           INT          NOT NULL,
    fechaInstalacion DATETIME     NOT NULL,
    tipoLectura      ENUM('TEMPERATURA','PRESION','VIBRACION','FLUJO') NOT NULL,
    valorUmbral      DOUBLE       NOT NULL,
    estado           ENUM('ACTIVO','PAUSADO') NOT NULL,
    createdAt        DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_monitoring_sensor FOREIGN KEY (sensorId) REFERENCES sensor(id),
    CONSTRAINT fk_monitoring_zone   FOREIGN KEY (zoneId)   REFERENCES zone(id),
    CONSTRAINT uq_monitoring_sensor_zone UNIQUE (sensorId, zoneId)
);

-- ============================================================
--  Datos de prueba
-- ============================================================

-- ----- Sensores (4: uno de cada tipo) -----------------------
INSERT INTO sensor (nombre, tipo, fabricante, fechaFabricacion) VALUES
    ('Sensor Temperatura Caldera',  'TEMPERATURA', 'Siemens',        '2023-01-15 00:00:00'),
    ('Sensor Presion Linea A',      'PRESION',     'Honeywell',      '2023-03-22 00:00:00'),
    ('Sensor Vibracion Motor 3',    'VIBRACION',   'Bosch',          '2022-11-08 00:00:00'),
    ('Sensor Flujo Tuberia Norte',  'FLUJO',       'Endress+Hauser', '2024-02-01 00:00:00');

-- ----- Zonas (3: con distintos estados operativos) ----------
INSERT INTO zone (nombre, descripcion, ubicacion, estadoOperativo) VALUES
    ('Zona Calderas',    'Area de calderas y generacion de vapor', 'Planta 1 - Nivel 0', 'ACTIVA'),
    ('Zona Almacenaje',  'Bodega de materia prima',                'Planta 2 - Nivel 1', 'INACTIVA'),
    ('Zona Compresores', 'Sala de compresores y bombas',           'Planta 1 - Nivel 2', 'MANTENIMIENTO');

-- ----- Monitoreos (6: ACTIVO/PAUSADO con umbrales variados) --
-- Pares (sensorId, zoneId) unicos para respetar la restriccion unique
INSERT INTO monitoring (sensorId, zoneId, fechaInstalacion, tipoLectura, valorUmbral, estado) VALUES
    (1, 1, '2024-04-10 09:00:00', 'TEMPERATURA',  85.50, 'ACTIVO'),
    (2, 1, '2024-04-12 11:30:00', 'PRESION',      12.30, 'PAUSADO'),
    (3, 2, '2024-05-01 08:15:00', 'VIBRACION',     0.85, 'ACTIVO'),
    (4, 3, '2024-05-18 14:45:00', 'FLUJO',       150.00, 'PAUSADO'),
    (1, 2, '2024-06-02 10:20:00', 'TEMPERATURA',  78.00, 'ACTIVO'),
    (2, 3, '2024-06-03 16:05:00', 'PRESION',       9.80, 'PAUSADO');
