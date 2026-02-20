import type { IdeasCatalogPort } from "../application/ports";
import type { Idea } from "../domain";

export class IdeasMockAdapter implements IdeasCatalogPort {
  listIdeas(): Idea[] {
    return [
      {
        id: "1",
        title: "Consultoría de redes sociales para pymes locales",
        description:
          "Ofreces gestión de redes y contenido a negocios que no tienen tiempo. Cobras por paquete mensual.",
        whyFitsYou: "Bajo capital inicial, escalable con tu tiempo y encaja con demanda local.",
        difficulty: "low",
        estimatedCapital: "Menos de 100 USD",
        timeToValidation: "2-3 semanas",
      },
      {
        id: "2",
        title: "Venta de plantillas y recursos digitales",
        description:
          "Creas plantillas (Notion, Canva, hojas de cálculo) y las vendes en Gumroad o similar.",
        whyFitsYou: "Una vez creadas, generan ingresos pasivos. Ideal si sabes diseñar o organizar.",
        difficulty: "low",
        estimatedCapital: "0 USD (solo tiempo)",
        timeToValidation: "1-2 semanas",
      },
      {
        id: "3",
        title: "Servicio de copywriting para landing pages",
        description:
          "Escribes textos de venta para landings y emails. Los emprendedores pagan por conversión.",
        whyFitsYou: "Si te gusta escribir y entender al cliente, el margen es alto.",
        difficulty: "medium",
        estimatedCapital: "0 USD",
        timeToValidation: "3-4 semanas",
      },
      {
        id: "4",
        title: "Asesoría en validación de ideas (1:1)",
        description:
          "Sesiones de 1h donde guías a alguien a validar su idea en 30 días con un plan concreto.",
        whyFitsYou: "Monetizas tu experiencia y ayudas a otros a no cometer los mismos errores.",
        difficulty: "medium",
        estimatedCapital: "0 USD",
        timeToValidation: "2-4 semanas",
      },
    ];
  }
}
