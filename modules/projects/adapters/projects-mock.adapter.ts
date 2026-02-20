import type {
  ProjectsCatalogPort,
  ProgressEntryInput,
} from "../application/ports";
import type { Project, ProgressEntry, CreateProjectInput } from "../domain";

export class ProjectsMockAdapter implements ProjectsCatalogPort {
  private items: Project[] = [
    {
      id: "1",
      ideaId: "1",
      title: "Consultoría de redes para pymes",
      description: "Gestión de redes y contenido para negocios locales.",
      createdAt: "2025-02-01",
      buyerPersona: {
        name: "Dueño de pyme local",
        ageRange: "35-50 años",
        pain: "No tiene tiempo ni conocimiento para redes; pierde clientes que buscan en Instagram.",
        goal: "Tener presencia en redes sin dedicar horas cada día.",
        whereTheyAre: "Instagram, WhatsApp, recomendaciones boca a boca.",
      },
      roadmapSteps: [
        {
          week: 1,
          title: "Definir oferta y cliente",
          tasks: [
            "Escribir en una frase qué ofreces y a quién.",
            "Listar 5 negocios locales que serían clientes ideales.",
            "Definir un precio de entrada (ej. primer mes con descuento).",
          ],
          checkpoint: "Tienes oferta clara y lista de prospectos.",
        },
        {
          week: 2,
          title: "Crear oferta y primer contacto",
          tasks: [
            "Armar un post o mini-landing con tu oferta.",
            "Contactar por WhatsApp o DM a 10 prospectos.",
            "Agendar al menos 2 llamadas o reuniones.",
          ],
          checkpoint: "Al menos 1 conversación seria con un posible cliente.",
        },
        {
          week: 3,
          title: "Cerrar primer cliente o ajustar",
          tasks: [
            "Presentar propuesta y precio en las reuniones.",
            "Si no cierras: preguntar qué faltó y ajustar oferta o público.",
            "Repetir contacto con 5 prospectos más.",
          ],
          checkpoint: "Primera venta o feedback concreto para iterar.",
        },
        {
          week: 4,
          title: "Validar y escalar",
          tasks: [
            "Entregar el primer servicio y pedir testimonial.",
            "Definir siguiente paso: más clientes o mejor oferta.",
            "Documentar proceso para replicar.",
          ],
          checkpoint: "Primera validación real (venta o compromiso de pago).",
        },
      ],
    },
    {
      id: "2",
      ideaId: "2",
      title: "Plantillas y recursos digitales",
      description: "Venta de plantillas en Gumroad o similar.",
      createdAt: "2025-02-10",
      buyerPersona: {
        name: "Emprendedor digital",
        ageRange: "25-45 años",
        pain: "Pierde horas creando documentos desde cero; quiere enfocarse en vender.",
        goal: "Tener plantillas listas y profesionales sin diseñar cada vez.",
        whereTheyAre: "Twitter/X, LinkedIn, grupos de Notion o productividad.",
      },
      roadmapSteps: [
        {
          week: 1,
          title: "Elegir tipo de plantilla y cliente",
          tasks: [
            "Elegir un formato (Notion, Canva, Google Sheet).",
            "Definir un problema concreto que resuelve la plantilla.",
            "Buscar 3 plantillas similares y ver precios.",
          ],
          checkpoint: "Tienes 1 idea de plantilla definida.",
        },
        {
          week: 2,
          title: "Crear y publicar MVP",
          tasks: [
            "Crear la versión mínima de la plantilla.",
            "Abrir cuenta en Gumroad (o similar) y subir producto.",
            "Escribir título, descripción y precio.",
          ],
          checkpoint: "Producto publicado y enlazable.",
        },
        {
          week: 3,
          title: "Primeros clientes",
          tasks: [
            "Compartir el link en 3 lugares donde está tu cliente (redes, grupos).",
            "Ofrecer descuento a los primeros 5 compradores a cambio de feedback.",
            "Ajustar descripción o precio según respuestas.",
          ],
          checkpoint: "Al menos 1 venta o 3 respuestas de interés.",
        },
        {
          week: 4,
          title: "Iterar o repetir",
          tasks: [
            "Incorporar feedback en la plantilla.",
            "Decidir: mejorar esta o crear una segunda.",
            "Dejar un sistema de captación (email o lista) para futuros lanzamientos.",
          ],
          checkpoint: "Validación de que alguien paga por tu recurso.",
        },
      ],
    },
  ];

  private progressByProject = new Map<string, ProgressEntry[]>();

  async listProjects(): Promise<Project[]> {
    return [...this.items];
  }

  async getProjectById(id: string): Promise<Project | null> {
    const project = this.items.find((p) => p.id === id) ?? null;
    if (!project) return null;
    const progress = this.progressByProject.get(id) ?? [];
    return { ...project, progress };
  }

  async createProject(input: CreateProjectInput): Promise<Project> {
    const id = crypto.randomUUID();
    const project: Project = {
      id,
      title: input.title,
      description: input.description,
      source: input.source,
      pitch: input.pitch,
      whyItWins: input.whyItWins,
      roadmap: input.roadmap,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    this.items.push(project);
    return project;
  }

  async addProgressEntry(
    projectId: string,
    entry: ProgressEntryInput
  ): Promise<ProgressEntry> {
    const progressEntry: ProgressEntry = {
      id: crypto.randomUUID(),
      projectId,
      date: entry.date,
      notes: entry.notes,
      percent: entry.percent,
      createdAt: new Date().toISOString(),
    };
    const list = this.progressByProject.get(projectId) ?? [];
    list.push(progressEntry);
    this.progressByProject.set(projectId, list);
    return progressEntry;
  }

  async getProgressHistory(projectId: string): Promise<ProgressEntry[]> {
    const list = this.progressByProject.get(projectId) ?? [];
    return [...list].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }
}
