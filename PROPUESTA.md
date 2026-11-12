# Propuesta de Proyecto: JAY-wallet

**Universidad del Valle – 2026-2**
**Curso:** Proyecto Integrador I (40%)
**Docente:** Luz Carime Lucumí Hernández

## 1. Integrantes del equipo
*   Yilmar Mauricio Riascos Moreno

---

## 2. Problema y Usuario
**El problema:** Quien presta dinero de forma habitual u ocasional suele llevar el control en la memoria, en notas de celular o en chats. Con el tiempo, esta información se pierde o se desordena, lo que provoca olvidos sobre a quién se le prestó, cuánto, cuándo vence y cuánto se ha abonado.
**El usuario:** Un único tipo de usuario: el **prestamista** (persona natural que presta su capital). Los deudores no son usuarios del sistema, sino registros (datos) que el prestamista administra.

---

## 3. Objetivo y Recorrido Principal
**Objetivo:** Centralizar la información de los préstamos para que el prestamista pueda consultarla en cualquier momento, llevar un control exacto del dinero y cobrar a tiempo.

**Recorrido principal del producto:**
1. El prestamista se registra e inicia sesión en la plataforma.
2. Registra a un nuevo deudor (con sus datos de contacto).
3. Crea un préstamo para ese deudor (definiendo monto, interés y fecha de vencimiento).
4. El sistema calcula el saldo y muestra la lista de préstamos activos.
5. El deudor realiza un pago parcial; el prestamista registra ese "abono".
6. El sistema actualiza automáticamente el saldo pendiente y refleja si el préstamo ya fue pagado o si está vencido.

---

## 4. Funciones Principales
*   **Autenticación:** Registro e inicio de sesión de prestamistas (seguridad con tokens).
*   **Gestión de Deudores:** Crear, listar, editar y eliminar a las personas a las que se les presta.
*   **Gestión de Préstamos:** Registrar el capital prestado y calcular automáticamente el saldo pendiente.
*   **Registro de Abonos:** Ingresar pagos parciales o totales.
*   **Dashboard:** Pantalla principal que muestra cuánto dinero se ha prestado en total y cuánto está pendiente por cobrar.

---

## 5. Reglas de Negocio (Con ejemplos)
Para garantizar la integridad del dinero, el sistema aplicará las siguientes reglas:

**Regla 1: No permitir abonos mayores al saldo pendiente de la deuda.**
*   *Ejemplo:* Si un préstamo es de $100.000 y el deudor ha abonado $30.000 (saldo pendiente: $70.000), el sistema **rechazará** un intento de registrar un abono de $80.000, mostrando el mensaje: *"El abono excede el saldo pendiente actual"*. Si intenta abonar $70.000, se acepta y el préstamo pasa a estado "Pagado".

**Regla 2: La fecha de vencimiento debe ser estrictamente posterior a la fecha de inicio.**
*   *Ejemplo:* Si el prestamista intenta crear un préstamo hoy (12 de noviembre) con fecha de vencimiento el 10 de noviembre, el sistema **rechazará** la acción y mostrará el mensaje: *"La fecha de vencimiento no puede ser anterior a la fecha de inicio"*.

---

## 6. Alcance Inicial (Sprint 1 y 2)
Para la primera entrega funcional, el equipo se enfocará en:
*   Completar el flujo de autenticación (Registro/Login).
*   CRUD completo de Deudores.
*   Creación de préstamos básicos y registro de abonos.
*(Quedarán para fases posteriores la gestión de proveedores de capital y la carga de archivos de soporte).*

---

## 7. Decisiones Técnicas y Dudas
**Stack seleccionado:**
*   **Frontend:** React + Vite (JavaScript).
*   **Backend:** Node.js + Express.
*   **Base de datos:** PostgreSQL (alojada en Neon).
*   **Seguridad:** bcrypt (encriptación) y JWT (tokens de sesión).

**Dudas técnicas / Riesgos identificados:**
1.  *Manejo del tiempo y vencimientos:* PostgreSQL guarda fechas, pero ¿cómo manejar las zonas horarias para calcular si un préstamo está "vencido"?
2.  *Precisión del dinero:* Para evitar errores de redondeo, el dinero se maneja en la base de datos con tipo `NUMERIC(14,2)`, no con decimales flotantes.
3.  *Despliegue:* Evaluaremos la mejor forma gratuita de desplegar el frontend (Vercel/Netlify) y el backend (Render) para la fase final.