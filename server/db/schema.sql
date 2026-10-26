-- JAY-wallet · Esquema de base de datos (PostgreSQL / Neon)
-- Un solo tipo de usuario: el prestamista. Los deudores son datos, no usuarios.

-- 1. Usuarios (prestamistas)
CREATE TABLE usuarios (
  id               INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nombre           VARCHAR(120) NOT NULL,
  correo           VARCHAR(255) NOT NULL UNIQUE,
  contrasena_hash  VARCHAR(255) NOT NULL,          -- nunca la contraseña en claro
  creado_en        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Deudores (personas a quienes se presta). Cada uno pertenece a un prestamista.
CREATE TABLE deudores (
  id          INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  usuario_id  INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  nombre      VARCHAR(120) NOT NULL,
  documento   VARCHAR(30),
  telefono    VARCHAR(30),
  direccion   VARCHAR(255),
  correo      VARCHAR(255),
  notas       TEXT,
  creado_en   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (usuario_id, documento)                   -- no repetir el mismo documento por prestamista
);

-- 3. Préstamos. El codeudor es otro registro de deudores (opcional).
CREATE TABLE prestamos (
  id                 INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  usuario_id         INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  deudor_id          INTEGER NOT NULL REFERENCES deudores(id) ON DELETE RESTRICT,
  codeudor_id        INTEGER REFERENCES deudores(id) ON DELETE SET NULL,
  monto              NUMERIC(14,2) NOT NULL CHECK (monto > 0),
  tasa_interes       NUMERIC(5,2)  NOT NULL DEFAULT 0 CHECK (tasa_interes >= 0),  -- % mensual
  fecha_inicio       DATE NOT NULL,
  fecha_vencimiento  DATE NOT NULL,
  -- "vencido" NO se guarda: se calcula (activo + fecha_vencimiento pasada)
  estado             VARCHAR(10) NOT NULL DEFAULT 'activo'
                     CHECK (estado IN ('activo', 'pagado', 'anulado')),
  notas              TEXT,
  creado_en          TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (fecha_vencimiento >= fecha_inicio),
  CHECK (codeudor_id IS NULL OR codeudor_id <> deudor_id)
);

-- 4. Abonos (pagos parciales o totales de un préstamo)
CREATE TABLE abonos (
  id           INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  prestamo_id  INTEGER NOT NULL REFERENCES prestamos(id) ON DELETE CASCADE,
  monto        NUMERIC(14,2) NOT NULL CHECK (monto > 0),
  fecha        DATE NOT NULL DEFAULT CURRENT_DATE,
  nota         TEXT,
  creado_en    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Proveedores (entidades que aportan capital al prestamista)
CREATE TABLE proveedores (
  id            INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  usuario_id    INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  entidad       VARCHAR(120) NOT NULL,
  monto         NUMERIC(14,2) NOT NULL CHECK (monto > 0),
  tasa_interes  NUMERIC(5,2)  NOT NULL DEFAULT 0 CHECK (tasa_interes >= 0),
  plazo_meses   INTEGER CHECK (plazo_meses > 0),
  fecha_inicio  DATE NOT NULL,
  fecha_fin     DATE,
  notas         TEXT,
  creado_en     TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (fecha_fin IS NULL OR fecha_fin >= fecha_inicio)
);

-- 6. Soportes (pagaré, comprobante, foto). Se guarda la URL, no el archivo.
CREATE TABLE soportes (
  id           INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  prestamo_id  INTEGER NOT NULL REFERENCES prestamos(id) ON DELETE CASCADE,
  descripcion  VARCHAR(200),
  url_archivo  VARCHAR(500) NOT NULL,
  creado_en    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índices para las búsquedas más frecuentes
CREATE INDEX idx_deudores_usuario     ON deudores(usuario_id);
CREATE INDEX idx_prestamos_usuario    ON prestamos(usuario_id);
CREATE INDEX idx_prestamos_deudor     ON prestamos(deudor_id);
CREATE INDEX idx_prestamos_estado_venc ON prestamos(estado, fecha_vencimiento);
CREATE INDEX idx_abonos_prestamo      ON abonos(prestamo_id);
CREATE INDEX idx_proveedores_usuario  ON proveedores(usuario_id);
CREATE INDEX idx_soportes_prestamo    ON soportes(prestamo_id);

-- Vista: saldo pendiente (solo capital) y si está vencido, calculados al consultar
CREATE VIEW v_prestamos_saldo AS
SELECT
  p.*,
  COALESCE(SUM(a.monto), 0)                      AS total_abonado,
  p.monto - COALESCE(SUM(a.monto), 0)            AS saldo_pendiente,
  (p.estado = 'activo' AND p.fecha_vencimiento < CURRENT_DATE) AS vencido
FROM prestamos p
LEFT JOIN abonos a ON a.prestamo_id = p.id
GROUP BY p.id;
