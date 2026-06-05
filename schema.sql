-- ============================================================
--  Industrial Monitoring - Esquema de base de datos (MySQL)
--  Equivalente al schema de Prisma (backend/prisma/schema.prisma)
-- ============================================================

CREATE DATABASE IF NOT EXISTS industrial_monitoring;
USE industrial_monitoring;

-- ------------------------------------------------------------
-- Tabla: sensor
--  (ENUMs inline en la columna, propios de MySQL)
-- ------------------------------------------------------------
CREATE TABLE sensor (
    id                INT AUTO_INCREMENT PRIMARY KEY,
    nombre            VARCHAR(255) NOT NULL,
    tipo              ENUM('TEMPERATURA','PRESION','VIBRACION','FLUJO') NOT NULL,
    fabricante        VARCHAR(255) NOT NULL,
    fecha_fabricacion DATETIME     NOT NULL,
    created_at        DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- Tabla: zone
-- ------------------------------------------------------------
CREATE TABLE zone (
    id               INT AUTO_INCREMENT PRIMARY KEY,
    nombre           VARCHAR(255) NOT NULL,
    descripcion      TEXT         NOT NULL,
    ubicacion        VARCHAR(255) NOT NULL,
    estado_operativo ENUM('ACTIVA','INACTIVA','MANTENIMIENTO') NOT NULL,
    created_at       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- Tabla: monitoring (intermedia, con atributos propios)
-- ------------------------------------------------------------
CREATE TABLE monitoring (
    id                INT AUTO_INCREMENT PRIMARY KEY,
    sensor_id         INT          NOT NULL,
    zone_id           INT          NOT NULL,
    fecha_instalacion DATETIME     NOT NULL,
    tipo_lectura      ENUM('TEMPERATURA','PRESION','VIBRACION','FLUJO') NOT NULL,
    valor_umbral      DOUBLE       NOT NULL,
    estado            ENUM('ACTIVO','PAUSADO') NOT NULL,
    created_at        DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_monitoring_sensor FOREIGN KEY (sensor_id) REFERENCES sensor(id),
    CONSTRAINT fk_monitoring_zone   FOREIGN KEY (zone_id)   REFERENCES zone(id),
    CONSTRAINT uq_monitoring_sensor_zone UNIQUE (sensor_id, zone_id)
);

-- ============================================================
--  Datos de prueba
-- ============================================================

-- ----- Sensores (4: uno de cada tipo) -----------------------
INSERT INTO sensor (nombre, tipo, fabricante, fecha_fabricacion) VALUES
    ('Sensor Temperatura Caldera',  'TEMPERATURA', 'Siemens',        '2023-01-15 00:00:00'),
    ('Sensor Presion Linea A',      'PRESION',     'Honeywell',      '2023-03-22 00:00:00'),
    ('Sensor Vibracion Motor 3',    'VIBRACION',   'Bosch',          '2022-11-08 00:00:00'),
    ('Sensor Flujo Tuberia Norte',  'FLUJO',       'Endress+Hauser', '2024-02-01 00:00:00');

-- ----- Zonas (3: con distintos estados operativos) ----------
INSERT INTO zone (nombre, descripcion, ubicacion, estado_operativo) VALUES
    ('Zona Calderas',    'Area de calderas y generacion de vapor', 'Planta 1 - Nivel 0', 'ACTIVA'),
    ('Zona Almacenaje',  'Bodega de materia prima',                'Planta 2 - Nivel 1', 'INACTIVA'),
    ('Zona Compresores', 'Sala de compresores y bombas',           'Planta 1 - Nivel 2', 'MANTENIMIENTO');

-- ----- Monitoreos (6: ACTIVO/PAUSADO con umbrales variados) --
-- Pares (sensor_id, zone_id) unicos para respetar la restriccion unique
INSERT INTO monitoring (sensor_id, zone_id, fecha_instalacion, tipo_lectura, valor_umbral, estado) VALUES
    (1, 1, '2024-04-10 09:00:00', 'TEMPERATURA',  85.50, 'ACTIVO'),
    (2, 1, '2024-04-12 11:30:00', 'PRESION',      12.30, 'PAUSADO'),
    (3, 2, '2024-05-01 08:15:00', 'VIBRACION',     0.85, 'ACTIVO'),
    (4, 3, '2024-05-18 14:45:00', 'FLUJO',       150.00, 'PAUSADO'),
    (1, 2, '2024-06-02 10:20:00', 'TEMPERATURA',  78.00, 'ACTIVO'),
    (2, 3, '2024-06-03 16:05:00', 'PRESION',       9.80, 'PAUSADO');
