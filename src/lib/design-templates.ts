import rawDesignTemplatesJson from '@/data/designs.json';
import type {
  DesignPayloadToCustomizer,
  DesignTemplate,
  DesignTemplateSourceRecord,
} from '@/types/design';

const rawDesignTemplates = rawDesignTemplatesJson as readonly DesignTemplateSourceRecord[];

const readString = (value: unknown): string | undefined =>
  typeof value === 'string' && value.trim().length > 0 ? value.trim() : undefined;

const readStringArray = (value: unknown): string[] =>
  Array.isArray(value)
    ? value
        .map((entry) => readString(entry))
        .filter((entry): entry is string => Boolean(entry))
    : [];

const readNumberArray = (value: unknown): number[] | undefined => {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const normalized = value.filter(
    (entry): entry is number => typeof entry === 'number' && Number.isFinite(entry)
  );

  return normalized.length > 0 ? normalized : undefined;
};

const readBoolean = (value: unknown, fallback: boolean): boolean =>
  typeof value === 'boolean' ? value : fallback;

const toTitleCase = (value: string): string =>
  value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const normalizePayload = (value: unknown): DesignPayloadToCustomizer | undefined => {
  if (!value || typeof value !== 'object') {
    return undefined;
  }

  const record = value as Record<string, unknown>;
  const overlayImageUrl = readString(record.overlay_image_url);

  if (!overlayImageUrl) {
    return undefined;
  }

  return {
    overlay_image_url: overlayImageUrl,
    fit: readString(record.fit),
    area: readString(record.area),
    base_color_factor: readNumberArray(record.base_color_factor),
    target_material: readString(record.target_material),
  };
};

const buildFallbackDescription = (name: string, style: string, tags: string[]): string | undefined => {
  const primaryTag = tags[0];

  if (primaryTag) {
    return `${toTitleCase(primaryTag)} starter template for mug customization.`;
  }

  if (style) {
    return `${toTitleCase(style)} starter template for mug customization.`;
  }

  return name ? `${name} starter template for mug customization.` : undefined;
};

const normalizeDesignTemplate = (
  record: DesignTemplateSourceRecord,
  index: number
): DesignTemplate | null => {
  const payload = normalizePayload(record.payload_to_customizer);
  const id = readString(record.id) ?? `design-template-${index + 1}`;
  const name = readString(record.title) ?? readString(record.name) ?? toTitleCase(id);
  const thumbnail = readString(record.thumbnail) ?? payload?.overlay_image_url;
  const image = payload?.overlay_image_url ?? thumbnail;

  if (!image || !thumbnail) {
    return null;
  }

  const style = readString(record.style) ?? readString(record.category) ?? 'general';
  const tags = readStringArray(record.tags);

  return {
    id,
    name,
    nameFr: readString(record.name_fr) ?? name,
    image,
    thumbnail,
    category: readString(record.category) ?? style,
    style,
    description: readString(record.description) ?? buildFallbackDescription(name, style, tags),
    descriptionFr: readString(record.description_fr),
    tags,
    palette: readStringArray(record.palette),
    payload_to_customizer: payload,
    baseColor: readString(record.base_color),
    finish: readString(record.finish),
    wrap: readString(record.wrap),
    printMethod: readString(record.print_method),
    showInGallery: readBoolean(record.show_in_gallery, true),
    featuredInCustomizer: readBoolean(record.featured_in_customizer, false),
  };
};

export const designTemplates: DesignTemplate[] = rawDesignTemplates
  .map(normalizeDesignTemplate)
  .filter((template): template is DesignTemplate => template !== null);

export const customizerDesignTemplates = designTemplates;

export const galleryDesignTemplates = designTemplates.filter((template) => template.showInGallery);

const featuredTemplates = designTemplates.filter((template) => template.featuredInCustomizer);
export const featuredCustomizerDesignTemplates =
  featuredTemplates.length > 0 ? featuredTemplates : galleryDesignTemplates.slice(0, 4);

export const findDesignTemplateByImage = (image: string | null | undefined) =>
  image ? designTemplates.find((template) => template.image === image) : undefined;
