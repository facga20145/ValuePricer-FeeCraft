# ValuePricer — FeeCraft

Calculadora de tarifas basada en valor para freelancers y consultores. No calcula por horas — calcula por el valor real que entregas al cliente.

## El problema

La mayoría de los freelancers cotizan multiplicando horas × tarifa. Eso los pone en desventaja: el cliente negocia el tiempo, no el valor. Un proyecto que le genera $100k a un cliente no debería costar lo mismo que uno que le genera $5k, aunque ambos tarden 40 horas.

## Cómo funciona

ValuePricer usa una fórmula de precio basada en cuatro palancas de valor:

```
Precio = (Horas × Tarifa Base × Buffer de Riesgo) × Multiplicador de Valor
```

El **Multiplicador de Valor** se calcula a partir de:

| Factor | Peso | Descripción |
|---|---|---|
| Impacto al negocio | 35% | Cuánto dinero genera o ahorra el proyecto |
| Valor estratégico | 30% | Si es crítico o solo nice-to-have |
| Urgencia | 20% | Qué tan pronto lo necesita el cliente |
| Exclusividad | 15% | Si cualquiera puede hacerlo o eres la persona indicada |

El multiplicador va de **×0.8x** (proyecto de bajo impacto) hasta **×3.0x** (proyecto crítico y urgente). El resultado incluye un rango de negociación (±15%) para que el freelancer tenga margen sin comprometer su rentabilidad mínima.

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4
- jsPDF (exportación de cotizaciones en PDF)
- localStorage (historial de cotizaciones, sin backend)

## Funcionalidades actuales

- 6 tipos de proyecto con tarifas base diferenciadas
- Estimación de horas con buffer de riesgo configurable (0% — 50%)
- 4 palancas de valor ajustables con sliders
- Precio sugerido + rango de negociación
- Exportación a PDF con desglose completo
- Copia de propuesta en texto plano
- Historial de las últimas 5 cotizaciones (localStorage)
- Diseño responsivo, dark mode

## Instalación

```bash
pnpm install
pnpm dev
```

## Demo

[facga20145.github.io/ValuePricer-FeeCraft](https://facga20145.github.io/ValuePricer-FeeCraft/)

---

## Roadmap

### v2.0 — Con backend (en desarrollo)

La versión actual es 100% frontend y funciona sin servidor. La siguiente versión conectará con una API REST para:

- Historial de cotizaciones en la nube (sincronizado entre dispositivos)
- Gestión de clientes y proyectos
- Plantillas de cotización reutilizables
- Autenticación de usuarios
- Panel de analytics (proyectos cotizados, tasa de cierre, ingresos estimados)
- API key segura para el generador de propuestas con IA

Stack planeado para el back: Node.js + Express + PostgreSQL + JWT.

**Proximamente.**
