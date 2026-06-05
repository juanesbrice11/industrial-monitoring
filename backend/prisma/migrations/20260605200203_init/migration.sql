-- CreateTable
CREATE TABLE `Sensor` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `tipo` ENUM('TEMPERATURA', 'PRESION', 'VIBRACION', 'FLUJO') NOT NULL,
    `fabricante` VARCHAR(191) NOT NULL,
    `fechaFabricacion` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Zone` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `descripcion` VARCHAR(191) NOT NULL,
    `ubicacion` VARCHAR(191) NOT NULL,
    `estadoOperativo` ENUM('ACTIVA', 'INACTIVA', 'MANTENIMIENTO') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Monitoring` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sensorId` INTEGER NOT NULL,
    `zoneId` INTEGER NOT NULL,
    `fechaInstalacion` DATETIME(3) NOT NULL,
    `tipoLectura` ENUM('TEMPERATURA', 'PRESION', 'VIBRACION', 'FLUJO') NOT NULL,
    `valorUmbral` DOUBLE NOT NULL,
    `estado` ENUM('ACTIVO', 'PAUSADO') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Monitoring_sensorId_zoneId_key`(`sensorId`, `zoneId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Monitoring` ADD CONSTRAINT `Monitoring_sensorId_fkey` FOREIGN KEY (`sensorId`) REFERENCES `Sensor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Monitoring` ADD CONSTRAINT `Monitoring_zoneId_fkey` FOREIGN KEY (`zoneId`) REFERENCES `Zone`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
