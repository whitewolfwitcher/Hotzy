export interface DesignPayloadToCustomizer extends Record<string, unknown> {
  overlay_image_url: string;
  fit?: string;
  area?: string;
  base_color_factor?: number[];
  target_material?: string;
}

export interface DesignTemplate {
  id: string;
  name: string;
  nameFr: string;
  image: string;
  thumbnail: string;
  category: string;
  style: string;
  description?: string;
  descriptionFr?: string;
  tags: string[];
  palette: string[];
  payload_to_customizer?: DesignPayloadToCustomizer;
  baseColor?: string;
  finish?: string;
  wrap?: string;
  printMethod?: string;
  focalX?: number;
  focalY?: number;
  wrapOffsetX?: number;
  previewRotation?: number;
  showInGallery: boolean;
  featuredInCustomizer: boolean;
}

export type DesignTemplateSourceRecord = Record<string, unknown>;
