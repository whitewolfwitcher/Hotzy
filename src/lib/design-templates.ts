import rawDesignTemplatesJson from '@/data/designs.json';
import type {
  DesignPayloadToCustomizer,
  DesignTemplate,
  DesignTemplateSourceRecord,
} from '@/types/design';

const rawDesignTemplates = rawDesignTemplatesJson as readonly DesignTemplateSourceRecord[];

const readString = (value: unknown): string | undefined =>
  typeof value === 'string' && value.trim().length > 0 ? value.trim() : undefined;

const readNumber = (value: unknown): number | undefined =>
  typeof value === 'number' && Number.isFinite(value) ? value : undefined;

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

const createCustomizerTemplate = ({
  id,
  name,
  nameFr,
  image,
  category,
  tags = [],
  focalX,
  focalY,
  wrapOffsetX,
  previewRotation,
  fit = 'cover',
}: {
  id: string;
  name: string;
  nameFr?: string;
  image: string;
  category: string;
  tags?: string[];
  focalX?: number;
  focalY?: number;
  wrapOffsetX?: number;
  previewRotation?: number;
  fit?: 'cover' | 'contain';
}): DesignTemplate => ({
  id,
  name,
  nameFr: nameFr ?? name,
  image,
  thumbnail: image,
  category,
  style: category,
  tags,
  palette: [],
  payload_to_customizer: {
    overlay_image_url: image,
    fit,
    area: 'full',
  },
  wrap: 'full',
  focalX,
  focalY,
  wrapOffsetX,
  previewRotation,
  showInGallery: false,
  featuredInCustomizer: false,
});

const legacyCustomizerTemplates: DesignTemplate[] = [
  createCustomizerTemplate({
    id: 'legacy-geometric',
    name: 'Geometric Pattern',
    image:
      'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f5f72cb8-da36-4f58-8ea5-e9218193ea09/generated_images/minimalist-geometric-pattern-design-with-bc266fca-20251110004625.jpg',
    category: 'minimalist',
  }),
  createCustomizerTemplate({
    id: 'legacy-watercolor',
    name: 'Abstract Watercolor',
    image:
      'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f5f72cb8-da36-4f58-8ea5-e9218193ea09/generated_images/abstract-artistic-watercolor-pattern-wit-7a44e702-20251110002742.jpg',
    category: 'artistic',
  }),
  createCustomizerTemplate({
    id: 'legacy-botanical',
    name: 'Botanical Nature',
    image:
      'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f5f72cb8-da36-4f58-8ea5-e9218193ea09/generated_images/botanical-nature-illustration-with-delic-3550a964-20251110002742.jpg',
    category: 'nature',
  }),
  createCustomizerTemplate({
    id: 'legacy-motivation',
    name: 'Stay Positive',
    image:
      'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f5f72cb8-da36-4f58-8ea5-e9218193ea09/generated_images/motivational-typography-design-with-stay-15f1157b-20251110002742.jpg',
    category: 'quotes',
  }),
  createCustomizerTemplate({
    id: 'legacy-retro',
    name: 'Retro Groovy',
    image:
      'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f5f72cb8-da36-4f58-8ea5-e9218193ea09/generated_images/retro-groovy-geometric-pattern-with-bold-f85a21d2-20251110004626.jpg',
    category: 'artistic',
  }),
  createCustomizerTemplate({
    id: 'legacy-kawaii',
    name: 'Kawaii Coffee',
    image:
      'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f5f72cb8-da36-4f58-8ea5-e9218193ea09/generated_images/cute-kawaii-pattern-with-small-coffee-be-365025da-20251109175917.jpg',
    category: 'minimalist',
  }),
  createCustomizerTemplate({
    id: 'legacy-mountain',
    name: 'Mountain Landscape',
    image:
      'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f5f72cb8-da36-4f58-8ea5-e9218193ea09/generated_images/mountain-landscape-silhouette-design-min-44e956c8-20251109175917.jpg',
    category: 'nature',
  }),
  createCustomizerTemplate({
    id: 'legacy-anime',
    name: 'Anime Kawaii',
    image:
      'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f5f72cb8-da36-4f58-8ea5-e9218193ea09/generated_images/cute-anime-style-pattern-design-with-kaw-08360faa-20251110010149.jpg',
    category: 'artistic',
  }),
  createCustomizerTemplate({
    id: 'legacy-cyberpunk',
    name: 'Cyberpunk Neon',
    image:
      'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f5f72cb8-da36-4f58-8ea5-e9218193ea09/generated_images/cyberpunk-neon-pattern-design-with-elect-2567b26d-20251110010149.jpg',
    category: 'artistic',
  }),
  createCustomizerTemplate({
    id: 'legacy-typography-dream',
    name: 'Dream Typography',
    image:
      'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f5f72cb8-da36-4f58-8ea5-e9218193ea09/generated_images/minimalist-black-and-white-typography-de-673eaa0e-20251110010404.jpg',
    category: 'quotes',
  }),
  createCustomizerTemplate({
    id: 'legacy-cosmic',
    name: 'Cosmic Space',
    image:
      'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f5f72cb8-da36-4f58-8ea5-e9218193ea09/generated_images/cosmic-space-pattern-design-with-swirlin-6cf1076a-20251110010407.jpg',
    category: 'artistic',
  }),
  createCustomizerTemplate({
    id: 'legacy-japanese-wave',
    name: 'Japanese Wave',
    image:
      'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f5f72cb8-da36-4f58-8ea5-e9218193ea09/generated_images/elegant-japanese-wave-pattern-design-ins-c3870911-20251110010405.jpg',
    category: 'minimalist',
  }),
  createCustomizerTemplate({
    id: 'legacy-gothic',
    name: 'Gothic Victorian',
    image:
      'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f5f72cb8-da36-4f58-8ea5-e9218193ea09/generated_images/gothic-dark-pattern-with-ornate-victoria-a1fff3ca-20251110010407.jpg',
    category: 'artistic',
  }),
  createCustomizerTemplate({
    id: 'legacy-tropical',
    name: 'Tropical Paradise',
    image:
      'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f5f72cb8-da36-4f58-8ea5-e9218193ea09/generated_images/tropical-paradise-pattern-with-monstera--99a93a9e-20251110010407.jpg',
    category: 'nature',
  }),
  createCustomizerTemplate({
    id: 'legacy-memphis',
    name: 'Memphis 80s',
    image:
      'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f5f72cb8-da36-4f58-8ea5-e9218193ea09/generated_images/memphis-design-pattern-with-bold-geometr-e926e9cc-20251110010408.jpg',
    category: 'artistic',
  }),
  createCustomizerTemplate({
    id: 'legacy-coffee-beans-minimal',
    name: 'Coffee Beans Minimal',
    image:
      'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f5f72cb8-da36-4f58-8ea5-e9218193ea09/generated_images/minimalist-repeating-pattern-design-with-485fb06e-20251110010613.jpg',
    category: 'minimalist',
  }),
  createCustomizerTemplate({
    id: 'legacy-coffee-watercolor',
    name: 'Coffee Watercolor',
    image:
      'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f5f72cb8-da36-4f58-8ea5-e9218193ea09/generated_images/artistic-watercolor-illustration-pattern-7772371b-20251110010614.jpg',
    category: 'artistic',
  }),
  createCustomizerTemplate({
    id: 'legacy-coffee-vintage',
    name: 'Vintage Coffee',
    image:
      'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f5f72cb8-da36-4f58-8ea5-e9218193ea09/generated_images/vintage-retro-coffee-beans-pattern-desig-a45729cb-20251110010613.jpg',
    category: 'artistic',
  }),
  createCustomizerTemplate({
    id: 'legacy-coffee-geometric',
    name: 'Geometric Coffee',
    image:
      'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f5f72cb8-da36-4f58-8ea5-e9218193ea09/generated_images/modern-abstract-geometric-pattern-design-7b2ca45e-20251110010613.jpg',
    category: 'minimalist',
  }),
  createCustomizerTemplate({
    id: 'legacy-chibi-ninja',
    name: 'Chibi Ninja',
    image:
      'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f5f72cb8-da36-4f58-8ea5-e9218193ea09/generated_images/chibi-ninja-character-pattern-design-for-e5b1af83-20251111020142.jpg',
    category: 'artistic',
  }),
  createCustomizerTemplate({
    id: 'legacy-botanical-haven',
    name: 'Botanical Haven',
    image:
      'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f5f72cb8-da36-4f58-8ea5-e9218193ea09/generated_images/botanical-pattern-design-for-mug-printin-518aede2-20251111020142.jpg',
    category: 'nature',
  }),
  createCustomizerTemplate({
    id: 'legacy-street-art-burst',
    name: 'Street Art Burst',
    image:
      'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f5f72cb8-da36-4f58-8ea5-e9218193ea09/generated_images/street-art-graffiti-pattern-design-for-m-6daddf0e-20251111020142.jpg',
    category: 'artistic',
  }),
  createCustomizerTemplate({
    id: 'legacy-tropical-paradise-explore',
    name: 'Tropical Paradise',
    image:
      'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f5f72cb8-da36-4f58-8ea5-e9218193ea09/generated_images/tropical-paradise-pattern-design-for-mug-6d3c0cc3-20251111020142.jpg',
    category: 'nature',
  }),
  createCustomizerTemplate({
    id: 'legacy-neural-illusion',
    name: 'Neural Illusion',
    image:
      'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f5f72cb8-da36-4f58-8ea5-e9218193ea09/generated_images/neural-network-pattern-design-for-mug-pr-600ccaf7-20251111020142.jpg',
    category: 'artistic',
  }),
  createCustomizerTemplate({
    id: 'legacy-zen-wave',
    name: 'Zen Wave',
    image:
      'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f5f72cb8-da36-4f58-8ea5-e9218193ea09/generated_images/zen-wave-japanese-pattern-design-for-mug-2de3ea0e-20251111020141.jpg',
    category: 'minimalist',
  }),
  createCustomizerTemplate({
    id: 'legacy-sunrise-mist',
    name: 'Sunrise Mist',
    image:
      'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f5f72cb8-da36-4f58-8ea5-e9218193ea09/generated_images/sunrise-mist-gradient-pattern-design-for-dbc2aa7a-20251111020142.jpg',
    category: 'artistic',
  }),
];

const websiteCustomizerTemplates: DesignTemplate[] = [
  createCustomizerTemplate({
    id: 'full-cover-aurora-borealis-glow',
    name: 'Aurora Borealis Glow',
    image: '/templates/01_aurora_borealis_glow_HQ_FULL_COVER_4500x1800.jpg',
    category: 'full-cover',
    tags: ['aurora', 'glow', 'full-wrap'],
    focalX: 0.5,
    focalY: 0.5,
    wrapOffsetX: 0,
    previewRotation: -0.55,
  }),
  createCustomizerTemplate({
    id: 'full-cover-cosmic-leopard-waves',
    name: 'Cosmic Leopard Waves',
    image: '/templates/02_cosmic_leopard_waves_HQ_FULL_COVER_4500x1800.jpg',
    category: 'full-cover',
    tags: ['cosmic', 'waves', 'full-wrap'],
    focalX: 0.5,
    focalY: 0.5,
    wrapOffsetX: 0,
    previewRotation: -0.55,
  }),
  createCustomizerTemplate({
    id: 'full-cover-cyberpunk-grid-city',
    name: 'Cyberpunk Grid City',
    image: '/templates/03_cyberpunk_grid_city_HQ_FULL_COVER_4500x1800.jpg',
    category: 'full-cover',
    tags: ['cyberpunk', 'city', 'full-wrap'],
    focalX: 0.5,
    focalY: 0.5,
    wrapOffsetX: 0,
    previewRotation: -0.55,
  }),
  createCustomizerTemplate({
    id: 'full-cover-underwater-glow',
    name: 'Underwater Glow',
    image: '/templates/04_underwater_glow_HQ_FULL_COVER_4500x1800.jpg',
    category: 'full-cover',
    tags: ['underwater', 'glow', 'full-wrap'],
    focalX: 0.5,
    focalY: 0.5,
    wrapOffsetX: 0,
    previewRotation: -0.55,
  }),
  createCustomizerTemplate({
    id: 'full-cover-futuristic-neon-circuit',
    name: 'Futuristic Neon Circuit',
    image: '/templates/05_futuristic_neon_circuit_HQ_FULL_COVER_4500x1800.jpg',
    category: 'full-cover',
    tags: ['neon', 'circuit', 'full-wrap'],
    focalX: 0.5,
    focalY: 0.5,
    wrapOffsetX: 0,
    previewRotation: -0.55,
  }),
  createCustomizerTemplate({
    id: 'full-cover-inferno-dragon',
    name: 'Inferno Dragon',
    image: '/templates/06_inferno_dragon_HQ_FULL_COVER_4500x1800.jpg',
    category: 'full-cover',
    tags: ['inferno', 'dragon', 'full-wrap'],
    focalX: 0.5,
    focalY: 0.5,
    wrapOffsetX: 0,
    previewRotation: -0.55,
  }),
  createCustomizerTemplate({
    id: 'full-cover-arcane-crystal-garden',
    name: 'Arcane Crystal Garden',
    image: '/templates/07_arcane_crystal_garden_HQ_FULL_COVER_4500x1800.jpg',
    category: 'full-cover',
    tags: ['arcane', 'crystal', 'full-wrap'],
    focalX: 0.5,
    focalY: 0.5,
    wrapOffsetX: 0,
    previewRotation: -0.55,
  }),
  createCustomizerTemplate({
    id: 'website-dark-floral-mystical-silhouette',
    name: 'Dark Floral Mystical Silhouette',
    image: '/templates/dark-floral-mystical-silhouette-4500x1800.jpg',
    category: 'mystical',
    tags: ['dark', 'floral', 'mystical', 'silhouette', 'full-wrap'],
    focalX: 0.5,
    focalY: 0.5,
    wrapOffsetX: 0.02,
    previewRotation: -0.55,
  }),
  createCustomizerTemplate({
    id: 'website-cosmic-neon-floral-silhouette',
    name: 'Cosmic Neon Floral Silhouette',
    image: '/templates/cosmic-neon-floral-silhouette-4500x1800.jpg',
    category: 'mystical',
    tags: ['cosmic', 'neon', 'floral', 'silhouette', 'full-wrap'],
    focalX: 0.5,
    focalY: 0.5,
    wrapOffsetX: 0,
    previewRotation: -0.55,
  }),
];

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
    focalX: readNumber(record.focal_x),
    focalY: readNumber(record.focal_y),
    wrapOffsetX: readNumber(record.wrap_offset_x),
    previewRotation: readNumber(record.preview_rotation),
    showInGallery: readBoolean(record.show_in_gallery, true),
    featuredInCustomizer: readBoolean(record.featured_in_customizer, false),
  };
};

export const designTemplates: DesignTemplate[] = rawDesignTemplates
  .map(normalizeDesignTemplate)
  .filter((template): template is DesignTemplate => template !== null);

const isUsableCustomizerImage = (image: string): boolean => !image.startsWith('/designs/');

const mergeUniqueTemplates = (templates: DesignTemplate[]): DesignTemplate[] => {
  const seenImages = new Set<string>();

  return templates.filter((template) => {
    if (seenImages.has(template.image)) {
      return false;
    }

    seenImages.add(template.image);
    return true;
  });
};

export const customizerDesignTemplates = mergeUniqueTemplates([
  ...websiteCustomizerTemplates,
  ...legacyCustomizerTemplates,
  ...designTemplates.filter((template) => isUsableCustomizerImage(template.image)),
]);

export const galleryDesignTemplates = designTemplates.filter((template) => template.showInGallery);

const featuredTemplates = designTemplates.filter((template) => template.featuredInCustomizer);
export const featuredCustomizerDesignTemplates =
  featuredTemplates.length > 0 ? featuredTemplates : galleryDesignTemplates.slice(0, 4);

export const findDesignTemplateByImage = (image: string | null | undefined) =>
  image ? customizerDesignTemplates.find((template) => template.image === image) : undefined;
