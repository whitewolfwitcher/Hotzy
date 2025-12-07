import { feature, product, featureItem, priceItem } from "atmn";

export const designPreviews = feature({
  id: "design_previews",
  name: "Design Previews",
  type: "single_use",
});

export const designSaves = feature({
  id: "design_saves",
  name: "Custom Design Saves",
  type: "single_use",
});

export const basicViewer = feature({
  id: "basic_viewer",
  name: "Basic Mug Viewer Access",
  type: "boolean",
});

export const premiumMaterials = feature({
  id: "premium_materials",
  name: "Premium Materials Access",
  type: "boolean",
});

export const aiSuggestions = feature({
  id: "ai_suggestions",
  name: "AI-Powered Design Suggestions",
  type: "boolean",
});

export const standardShipping = feature({
  id: "standard_shipping",
  name: "Standard Shipping Included",
  type: "boolean",
});

export const priorityAi = feature({
  id: "priority_ai",
  name: "Priority AI Design Generation",
  type: "boolean",
});

export const exclusiveMaterials = feature({
  id: "exclusive_materials",
  name: "Exclusive Materials and Finishes Access",
  type: "boolean",
});

export const printing3d = feature({
  id: "printing_3d",
  name: "3D Printing Customization Options",
  type: "boolean",
});

export const expressShipping = feature({
  id: "express_shipping",
  name: "Express Shipping Included",
  type: "boolean",
});

export const collaborationTools = feature({
  id: "collaboration_tools",
  name: "Design Collaboration Tools",
  type: "boolean",
});

export const hotzyBasic = product({
  id: "hotzy_basic",
  name: "Hotzy Basic",
  is_default: true,
  items: [
    featureItem({
      feature_id: basicViewer.id,
    }),
    featureItem({
      feature_id: designPreviews.id,
      included_usage: 3,
      interval: "month",
    }),
  ],
});

export const hotzyPro = product({
  id: "hotzy_pro",
  name: "Hotzy Pro",
  items: [
    priceItem({
      price: 29,
      interval: "month",
    }),
    featureItem({
      feature_id: designPreviews.id,
      included_usage: 999999,
      interval: "month",
    }),
    featureItem({
      feature_id: premiumMaterials.id,
    }),
    featureItem({
      feature_id: designSaves.id,
      included_usage: 10,
      interval: "month",
    }),
    featureItem({
      feature_id: aiSuggestions.id,
    }),
    featureItem({
      feature_id: standardShipping.id,
    }),
  ],
});

export const hotzyPremium = product({
  id: "hotzy_premium",
  name: "Hotzy Premium",
  items: [
    priceItem({
      price: 79,
      interval: "month",
    }),
    featureItem({
      feature_id: designPreviews.id,
      included_usage: 999999,
      interval: "month",
    }),
    featureItem({
      feature_id: premiumMaterials.id,
    }),
    featureItem({
      feature_id: designSaves.id,
      included_usage: 999999,
      interval: "month",
    }),
    featureItem({
      feature_id: priorityAi.id,
    }),
    featureItem({
      feature_id: exclusiveMaterials.id,
    }),
    featureItem({
      feature_id: printing3d.id,
    }),
    featureItem({
      feature_id: expressShipping.id,
    }),
    featureItem({
      feature_id: collaborationTools.id,
    }),
  ],
});