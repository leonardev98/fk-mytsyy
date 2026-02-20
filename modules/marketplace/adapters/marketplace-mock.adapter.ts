import type { MarketplaceCatalogPort } from "../application/ports";
import type { Product } from "../domain";

/**
 * Mock catalog: productos y proveedores estratégicos para emprendedores.
 * Comunidad vendedor estratégico ↔ emprendedor.
 */
export class MarketplaceMockAdapter implements MarketplaceCatalogPort {
  private readonly items: Product[] = [
    {
      id: "1",
      title: "Plantilla Plan de Negocio 30 días",
      description:
        "Plantilla guiada para definir tu oferta, cliente y primeros pasos en 30 días. Incluye checklist y ejemplos.",
      price: 29,
      currency: "USD",
      category: "plantilla",
      provider: {
        id: "p1",
        name: "Mytsyy",
        tagline: "De idea a venta en 30 días",
      },
    },
    {
      id: "2",
      title: "Sesión de mentoría estratégica (1h)",
      description:
        "Una hora con un mentor para revisar tu idea, definir siguiente paso y desbloquearte.",
      price: 49,
      currency: "USD",
      category: "mentoría",
      provider: {
        id: "p2",
        name: "Estrategia Emprende",
        tagline: "Mentores con experiencia en validación",
      },
    },
    {
      id: "3",
      title: "Pack branding emprendedor",
      description:
        "Logo, paleta de colores y guía de voz de marca para presentar tu negocio con profesionalidad.",
      price: 79,
      currency: "USD",
      category: "herramienta",
      provider: {
        id: "p3",
        name: "Brand Lab",
        tagline: "Branding simple para quien empieza",
      },
    },
    {
      id: "4",
      title: "Auditoría de tu landing y oferta",
      description:
        "Revisión de tu página y mensaje de venta con recomendaciones concretas para mejorar conversión.",
      price: 39,
      currency: "USD",
      category: "mentoría",
      provider: {
        id: "p4",
        name: "Conversión Simple",
        tagline: "Landings que venden",
      },
    },
    {
      id: "5",
      title: "Scripts de venta por WhatsApp",
      description:
        "Plantillas de mensajes para primer contacto, seguimiento y cierre. Incluye ejemplos por industria.",
      price: 19,
      currency: "USD",
      category: "recurso",
      provider: {
        id: "p5",
        name: "Vende por Chat",
        tagline: "Comunicación que cierra ventas",
      },
    },
    {
      id: "6",
      title: "Taller: Validar en 1 semana",
      description:
        "Taller en vivo de 2h para definir tu mínimo viable y salir a validar con clientes reales.",
      price: 0,
      currency: "USD",
      category: "mentoría",
      provider: {
        id: "p1",
        name: "Mytsyy",
        tagline: "De idea a venta en 30 días",
      },
    },
  ];

  listProducts(): Product[] {
    return [...this.items];
  }

  getProductById(id: string): Product | null {
    return this.items.find((p) => p.id === id) ?? null;
  }
}
