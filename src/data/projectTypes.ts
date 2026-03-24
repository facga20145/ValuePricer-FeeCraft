import type { ProjectType } from '../types'

export const PROJECT_TYPES: ProjectType[] = [
  {
    id: 'landing',
    name: 'Landing Page',
    description: 'Sitio de una sola página enfocado en conversiones y ventas directas.',
    baseHourlyRate: 35,
  },
  {
    id: 'ecommerce',
    name: 'E-commerce',
    description: 'Tienda online con carrito, pagos y gestión de inventario.',
    baseHourlyRate: 55,
  },
  {
    id: 'saas',
    name: 'SaaS / Web App',
    description: 'Software como servicio con paneles de usuario y lógica compleja.',
    baseHourlyRate: 70,
  },
  {
    id: 'api',
    name: 'API / Backend',
    description: 'Desarrollo de servicios, bases de datos e integraciones robustas.',
    baseHourlyRate: 65,
  },
  {
    id: 'consulting',
    name: 'Consultoría',
    description: 'Asesoramiento estratégico, auditorías y diseño de arquitectura.',
    baseHourlyRate: 90,
  },
  {
    id: 'mobile',
    name: 'App Móvil',
    description: 'Aplicaciones nativas o híbridas para iOS y Android.',
    baseHourlyRate: 75,
  },
]
