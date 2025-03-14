# BillingMetrics

BillingMetrics es una aplicación desarrollada con Next.js para visualizar y filtrar datos de facturación de manera eficiente. Utiliza React Table para la gestión de tablas dinámicas y permite filtrar facturas por tipo de documento y rango de fechas.

## 🚀 Características

- 📊 Visualización de datos de facturación en tablas dinámicas.
- 🔍 Filtros interactivos por tipo de documento y rango de fechas.
- 📈 Cálculo automático de totales, promedios y cantidades.
- 💡 Interfaz intuitiva y responsive con Tailwind CSS.

## 📦 Instalación

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/billingmetrics.git
   cd billingmetrics
   ```

2. Instalar las dependencias:
   ```bash
   npm install
   ```

3. Iniciar el servidor en desarrollo:
   ```bash
   npm run dev
   ```

4. Acceder a la aplicación en: `http://localhost:3000`

## 🛠️ Tecnologías utilizadas

- **Next.js** – Framework de React para aplicaciones web modernas.
- **React Table (@tanstack/react-table)** – Manejo eficiente de tablas.
- **Tailwind CSS** – Estilización rápida y responsive.
- **Context API** – Gestión de estados globales.

## 📖 Uso

1. **Carga de datos:** La aplicación consume datos de facturación.
2. **Filtrado interactivo:** Puedes seleccionar filtros por tipo de documento y rango de fechas.
3. **Visualización de métricas:** Se muestran el total facturado, el número de facturas y el promedio por entidad.

## 🐞 Debugging y errores comunes

- Si la aplicación deja de responder al seleccionar filtros, revisa la consola del navegador (`F12 > Console`) para identificar errores.
- Asegúrate de que los datos de facturación tienen el formato correcto.
- Si los estilos no se cargan correctamente, ejecuta `npm run build && npm run start`.

## 📌 Próximos pasos

- 📥 Integración con API para obtener datos en tiempo real.
- 📊 Exportación de reportes en Excel/PDF.
- 📱 Optimización de rendimiento en dispositivos móviles.

## 🤝 Contribución

1. Haz un fork del repositorio.
2. Crea una nueva rama (`git checkout -b feature-nueva-funcionalidad`).
3. Realiza los cambios y haz commit (`git commit -m 'Añadir nueva funcionalidad'`).
4. Sube los cambios (`git push origin feature-nueva-funcionalidad`).
5. Crea un Pull Request.
