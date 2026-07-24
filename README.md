# 🐕 Patitas Seguras — App Web

**Patitas Seguras** es una aplicación que conecta a dueños de mascotas con paseadores de perros **verificados y confiables**. Este repositorio contiene la aplicación web, construida con Next.js y Firebase.

> 📱 ¿Buscas la app móvil para Android? Visita [patitas-seguras-download](https://github.com/Jhonmarin07/patitas-seguras-download) para descargar el APK (React Native + Expo).

## ✨ Características

- 🔍 **Paseadores verificados** — validación de identidad, documentos y antecedentes para la tranquilidad del dueño.
- 📍 **Seguimiento GPS en tiempo real** — sigue la ruta exacta del paseo en un mapa en vivo, con tiempo transcurrido y distancia recorrida.
- 💬 **Chat en tiempo real** — comunicación directa entre dueño y paseador durante el servicio.
- 🐾 **Perfiles de mascota** — información completa de cada perro, incluido su historial médico.
- ⭐ **Calificaciones y reseñas** — sistema de reputación basado en evaluaciones post-servicio.
- 🤝 **Matching inteligente** — algoritmo que sugiere el paseador ideal según la ubicación y las características del perro.
- 💳 **Pagos seguros** — procesamiento a través de pasarelas de pago, sin efectivo y con historial de transacciones.
- 🔔 **Notificaciones instantáneas** — avisos de reservas, inicio y fin de paseos.

## 📸 Capturas

<!--
Agrega aquí capturas de la app, por ejemplo:
![Pantalla de inicio](docs/screenshots/home.png)
![Seguimiento GPS](docs/screenshots/gps.png)
-->

*Próximamente.*

## 🛠️ Stack tecnológico

| Capa | Tecnología |
|------|------------|
| Framework web | Next.js (App Router) + React |
| Lenguaje | TypeScript |
| Estilos / UI | Tailwind CSS + shadcn/ui |
| Backend | Firebase: Firestore, Cloud Functions y App Hosting |
| Seguridad | Reglas de seguridad de Firestore (`firestore.rules`) |
| App móvil | React Native + Expo ([repositorio complementario](https://github.com/Jhonmarin07/patitas-seguras-download)) |

## 🚀 Ejecutar en local

```bash
# 1. Clonar el repositorio
git clone https://github.com/Jhonmarin07/paseo-de-perros-app.git
cd paseo-de-perros-app

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor de desarrollo
npm run dev
```

> Necesitarás un proyecto propio de Firebase y sus credenciales para conectar Firestore y las Cloud Functions.

## 📂 Estructura del proyecto

```
├── src/              # Código de la aplicación (páginas, componentes, lógica)
├── functions/        # Cloud Functions de Firebase
├── docs/             # Documentación de diseño del producto
├── firestore.rules   # Reglas de seguridad de Firestore
└── apphosting.yaml   # Configuración de Firebase App Hosting
```

## 👨‍💻 Autor

**Jhon Marin** — [GitHub](https://github.com/Jhonmarin07)

<!-- Agrega tu LinkedIn aquí: [LinkedIn](https://www.linkedin.com/in/TU-USUARIO) -->

---

⭐ Si este proyecto te parece interesante, ¡dale una estrella!
