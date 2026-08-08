import { useState, useRef, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "@/api/client";

// ─── Types ────────────────────────────────────────────────────────────────────
type AnalysisResult = {
  skinTone: string;
  undertone: "warm" | "cool" | "neutral";
  toneCategory: "fair" | "light" | "medium" | "tan" | "deep";
  description: string;
  recommendedColors: ColorSwatch[];
  avoidColors: ColorSwatch[];
  sareeColorKeywords: string[];
  stylingTip: string;
};

type ColorSwatch = {
  hex: string;
  name: string;
  sareeStyle?: string;
};

type BackendProduct = {
  id: string; name: string; slug?: string; price: number;
  discount_price?: number | null; thumbnail?: string | null;
  images?: string[]; short_description?: string | null;
  color?: string | null; fabric?: string | null; stock?: number | null;
};

type Saree = {
  id: string; slug: string; name: string; price: number;
  originalPrice: number; image: string; color: string;
  fabric: string; description: string;
};

// ─── Skin tone palette database ───────────────────────────────────────────────
// Each entry maps a toneCategory + undertone combination to recommendations

type PaletteEntry = {
  skinTone: string;
  description: string;
  recommendedColors: ColorSwatch[];
  avoidColors: ColorSwatch[];
  sareeColorKeywords: string[];
  stylingTip: string;
};

const PALETTE_DB: Record<string, Record<string, PaletteEntry>> = {
  fair: {
    warm: {
      skinTone: "Ivory Warm Fair",
      description: "Your complexion carries the luminous quality of moonlit pearls with a gentle golden warmth. This rare tone catches light beautifully, glowing softly in candlelight and morning sun alike.",
      recommendedColors: [
        { hex: "#C41E3A", name: "Deep Rose", sareeStyle: "Banarasi Silk" },
        { hex: "#CC7722", name: "Ochre Gold", sareeStyle: "Kanjivaram Silk" },
        { hex: "#5B2333", name: "Burgundy", sareeStyle: "Chanderi Silk" },
        { hex: "#228B22", name: "Forest Green", sareeStyle: "Tussar Silk" },
        { hex: "#4B0082", name: "Indigo", sareeStyle: "Mysore Silk" },
        { hex: "#8B4513", name: "Sienna", sareeStyle: "Ikat Silk" },
      ],
      avoidColors: [
        { hex: "#FFFDD0", name: "Cream White" },
        { hex: "#FFE4E1", name: "Misty Rose" },
        { hex: "#F5F5DC", name: "Beige" },
      ],
      sareeColorKeywords: ["red", "gold", "burgundy", "green"],
      stylingTip: "Rich jewel tones like deep ruby and emerald create a striking contrast against your fair warm skin — choose sarees with heavy gold zari work for maximum luminosity.",
    },
    cool: {
      skinTone: "Porcelain Cool Fair",
      description: "Your skin holds the cool clarity of winter dawn — a porcelain canvas with subtle pink undertones that lend an ethereal, almost translucent quality. You carry an effortless elegance.",
      recommendedColors: [
        { hex: "#1B2A6B", name: "Royal Navy", sareeStyle: "Banarasi Silk" },
        { hex: "#800020", name: "Deep Crimson", sareeStyle: "Kanjivaram Silk" },
        { hex: "#301934", name: "Deep Purple", sareeStyle: "Mysore Silk" },
        { hex: "#008080", name: "Teal", sareeStyle: "Patola Silk" },
        { hex: "#36454F", name: "Charcoal Blue", sareeStyle: "Chanderi" },
        { hex: "#B22222", name: "Firebrick Red", sareeStyle: "Pochampally" },
      ],
      avoidColors: [
        { hex: "#FF7F50", name: "Coral Orange" },
        { hex: "#DAA520", name: "Goldenrod" },
        { hex: "#D2691E", name: "Chocolate" },
      ],
      sareeColorKeywords: ["navy", "crimson", "purple", "teal"],
      stylingTip: "Cool jewel tones and deep blues create a regal contrast against your fair cool complexion — avoid warm oranges and yellows which can make your skin appear washed out.",
    },
    neutral: {
      skinTone: "Petal Neutral Fair",
      description: "Your complexion is a rare balance of warmth and cool clarity — like the delicate blush of a lotus petal just catching the morning light. This balanced tone is endlessly versatile.",
      recommendedColors: [
        { hex: "#800020", name: "Maroon", sareeStyle: "Banarasi Silk" },
        { hex: "#1B2A6B", name: "Midnight Blue", sareeStyle: "Kanjivaram" },
        { hex: "#2E8B57", name: "Sea Green", sareeStyle: "Tussar Silk" },
        { hex: "#9B2335", name: "Raspberry", sareeStyle: "Chanderi" },
        { hex: "#8B4513", name: "Saddle Brown", sareeStyle: "Ikat" },
        { hex: "#4682B4", name: "Steel Blue", sareeStyle: "Patola" },
      ],
      avoidColors: [
        { hex: "#FFFDD0", name: "Pale Cream" },
        { hex: "#FFE4B5", name: "Moccasin" },
        { hex: "#E8E8E8", name: "Light Grey" },
      ],
      sareeColorKeywords: ["maroon", "blue", "green", "pink"],
      stylingTip: "Your neutral undertone is a gift — you can wear both warm and cool palettes with ease. Rich, saturated hues in any family will enhance your fair balanced complexion beautifully.",
    },
  },
  light: {
    warm: {
      skinTone: "Golden Warm Light",
      description: "Your skin glows with the warmth of raw honey — a luminous light tone with a distinctive golden radiance that evokes the rich heritage of Indian craft traditions. The sun seems to have kissed you perfectly.",
      recommendedColors: [
        { hex: "#FF6B35", name: "Burnt Orange", sareeStyle: "Kanjivaram Silk" },
        { hex: "#DAA520", name: "Golden Yellow", sareeStyle: "Banarasi Brocade" },
        { hex: "#800020", name: "Deep Maroon", sareeStyle: "Mysore Silk" },
        { hex: "#228B22", name: "Emerald", sareeStyle: "Pochampally Ikat" },
        { hex: "#8B0000", name: "Dark Red", sareeStyle: "Chanderi" },
        { hex: "#CC5500", name: "Burnt Sienna", sareeStyle: "Tussar Silk" },
      ],
      avoidColors: [
        { hex: "#FFDAB9", name: "Peach" },
        { hex: "#F5DEB3", name: "Wheat" },
        { hex: "#E6E6FA", name: "Lavender" },
      ],
      sareeColorKeywords: ["orange", "gold", "maroon", "green"],
      stylingTip: "Earthy terracottas, deep maroons, and golden yellows mirror and amplify your warm glow — lean into rich Banarasi brocades with dense gold zari for a breathtaking festival look.",
    },
    cool: {
      skinTone: "Rose Petal Light",
      description: "Your light skin carries cool rose undertones that catch light with the soft luminescence of dawn clouds. There is a quiet, refined elegance to your complexion that speaks of understated grace.",
      recommendedColors: [
        { hex: "#800080", name: "Purple", sareeStyle: "Mysore Silk" },
        { hex: "#008080", name: "Teal Green", sareeStyle: "Patola Silk" },
        { hex: "#C41E3A", name: "Rose Red", sareeStyle: "Kanjivaram" },
        { hex: "#191970", name: "Midnight Blue", sareeStyle: "Banarasi Silk" },
        { hex: "#006400", name: "Dark Green", sareeStyle: "Chanderi" },
        { hex: "#8B008B", name: "Dark Magenta", sareeStyle: "Bhagalpuri Silk" },
      ],
      avoidColors: [
        { hex: "#FF8C00", name: "Dark Orange" },
        { hex: "#DAA520", name: "Goldenrod" },
        { hex: "#CD853F", name: "Peru Brown" },
      ],
      sareeColorKeywords: ["purple", "teal", "red", "blue"],
      stylingTip: "Cool jewel tones like amethyst purple and peacock teal complement your rose-cool undertones magnificently — choose sarees with silver thread work over gold for the most harmonious effect.",
    },
    neutral: {
      skinTone: "Warm Neutral Light",
      description: "Your complexion sits at the beautiful crossroads of warm and cool — a harmonious light tone with balanced undertones that give your skin a natural radiance throughout the day.",
      recommendedColors: [
        { hex: "#800020", name: "Maroon", sareeStyle: "Kanjivaram Silk" },
        { hex: "#2E8B57", name: "Forest Green", sareeStyle: "Banarasi Silk" },
        { hex: "#4B0082", name: "Deep Violet", sareeStyle: "Mysore Silk" },
        { hex: "#D4AF37", name: "Antique Gold", sareeStyle: "Chanderi" },
        { hex: "#008080", name: "Teal", sareeStyle: "Patola" },
        { hex: "#B22222", name: "Firebrick", sareeStyle: "Pochampally" },
      ],
      avoidColors: [
        { hex: "#F0E68C", name: "Khaki Yellow" },
        { hex: "#E0E0E0", name: "Light Grey" },
        { hex: "#FAEBD7", name: "Antique White" },
      ],
      sareeColorKeywords: ["maroon", "green", "violet", "gold"],
      stylingTip: "Your balanced undertone makes you a rare canvas — experiment freely with both warm and cool palettes. Deep, saturated colours with intricate weaves will showcase your natural light beautifully.",
    },
  },
  medium: {
    warm: {
      skinTone: "Warm Golden Brown",
      description: "Your medium complexion carries the rich warmth of toasted amber — a quintessential South Asian glow that has inspired poets and weavers for centuries. The golden warmth of your skin is your greatest ornament.",
      recommendedColors: [
        { hex: "#FF4500", name: "Vermillion Red", sareeStyle: "Kanjivaram Silk" },
        { hex: "#DAA520", name: "Rich Gold", sareeStyle: "Banarasi Brocade" },
        { hex: "#006400", name: "Deep Green", sareeStyle: "Patola Silk" },
        { hex: "#FF8C00", name: "Marigold Orange", sareeStyle: "Pochampally Ikat" },
        { hex: "#800020", name: "Blood Red", sareeStyle: "Chanderi Silk" },
        { hex: "#4B0082", name: "Royal Purple", sareeStyle: "Mysore Silk" },
      ],
      avoidColors: [
        { hex: "#F5F5DC", name: "Beige" },
        { hex: "#D2B48C", name: "Tan Brown" },
        { hex: "#C8A882", name: "Pale Sand" },
      ],
      sareeColorKeywords: ["red", "orange", "green", "gold"],
      stylingTip: "Embrace vibrant vermillion, marigold orange and jewel-toned greens — colours as bold and radiant as your warm medium complexion. Heavy gold zari Kanjivaram silks were made for your skin.",
    },
    cool: {
      skinTone: "Dusky Rose Medium",
      description: "Your medium complexion carries cool, rosy undertones that give your skin an almost painted quality — like mahogany wood with a subtle sheen. There is depth and intrigue in your coloring.",
      recommendedColors: [
        { hex: "#800020", name: "Deep Crimson", sareeStyle: "Banarasi Silk" },
        { hex: "#2E0854", name: "Deep Purple", sareeStyle: "Mysore Silk" },
        { hex: "#005F5F", name: "Dark Teal", sareeStyle: "Patola Silk" },
        { hex: "#1B2A6B", name: "Royal Blue", sareeStyle: "Chanderi" },
        { hex: "#8B0000", name: "Dark Wine", sareeStyle: "Kanjivaram" },
        { hex: "#355E3B", name: "Hunter Green", sareeStyle: "Tussar Silk" },
      ],
      avoidColors: [
        { hex: "#FF7F50", name: "Coral" },
        { hex: "#FFA500", name: "Orange" },
        { hex: "#DAA520", name: "Warm Gold" },
      ],
      sareeColorKeywords: ["crimson", "purple", "teal", "blue"],
      stylingTip: "Deep wines, forest greens and midnight blues bring out the cool depth of your medium complexion — silver jewellery and platinum-threaded sarees will enhance your natural cool radiance.",
    },
    neutral: {
      skinTone: "Honey Neutral Medium",
      description: "Your medium complexion has the balanced beauty of warm honey — neither too golden nor too rosy, it possesses a natural harmony that makes colours come alive against your skin in remarkable ways.",
      recommendedColors: [
        { hex: "#CC0000", name: "Scarlet Red", sareeStyle: "Kanjivaram Silk" },
        { hex: "#014421", name: "Bottle Green", sareeStyle: "Banarasi Silk" },
        { hex: "#800080", name: "Magenta Purple", sareeStyle: "Mysore Silk" },
        { hex: "#B8860B", name: "Dark Goldenrod", sareeStyle: "Chanderi Brocade" },
        { hex: "#003153", name: "Prussian Blue", sareeStyle: "Patola Silk" },
        { hex: "#C41E3A", name: "Cardinal Rose", sareeStyle: "Bhagalpuri Silk" },
      ],
      avoidColors: [
        { hex: "#F5DEB3", name: "Pale Wheat" },
        { hex: "#E8E8E8", name: "Silver Grey" },
        { hex: "#FFDEAD", name: "Navajo White" },
      ],
      sareeColorKeywords: ["red", "green", "purple", "gold"],
      stylingTip: "Your balanced medium tone is incredibly versatile — rich scarlet, jewel green, and regal purple all work magnificently. Aim for saturated, deep hues rather than pastels to let your natural glow shine.",
    },
  },
  tan: {
    warm: {
      skinTone: "Bronze Warm Tan",
      description: "Your tan complexion glows with the warmth of burnished bronze — a rich, sun-kissed tone reminiscent of the earth after monsoon. Your skin carries a natural luminosity that deepens beautifully in candlelight.",
      recommendedColors: [
        { hex: "#FF6600", name: "Vibrant Orange", sareeStyle: "Pochampally Ikat" },
        { hex: "#CC0000", name: "Bright Red", sareeStyle: "Kanjivaram Silk" },
        { hex: "#FFD700", name: "Bright Gold", sareeStyle: "Banarasi Brocade" },
        { hex: "#006400", name: "Vivid Green", sareeStyle: "Patola Silk" },
        { hex: "#9900CC", name: "Electric Purple", sareeStyle: "Mysore Silk" },
        { hex: "#FF1493", name: "Deep Pink", sareeStyle: "Chanderi" },
      ],
      avoidColors: [
        { hex: "#A0522D", name: "Sienna Brown" },
        { hex: "#8B7355", name: "Dark Tan" },
        { hex: "#C4A882", name: "Camel" },
      ],
      sareeColorKeywords: ["orange", "red", "gold", "pink"],
      stylingTip: "Bright, vivid colours are your domain — electric orange, hot pink, and bold gold will pop magnificently against your warm bronze tan. Avoid earth tones that blend into your natural skin colour.",
    },
    cool: {
      skinTone: "Mocha Cool Tan",
      description: "Your tan complexion holds cool, violet undertones beneath its warmth — like the shadow side of a sun-drenched terracotta wall. This rare combination gives your skin a sophisticated depth that is truly captivating.",
      recommendedColors: [
        { hex: "#CC0066", name: "Hot Magenta", sareeStyle: "Kanjivaram Silk" },
        { hex: "#0066CC", name: "Cobalt Blue", sareeStyle: "Patola Silk" },
        { hex: "#00B3B3", name: "Bright Teal", sareeStyle: "Chanderi" },
        { hex: "#CC0000", name: "True Red", sareeStyle: "Banarasi Silk" },
        { hex: "#6600CC", name: "Violet Purple", sareeStyle: "Mysore Silk" },
        { hex: "#00CC66", name: "Spring Green", sareeStyle: "Bhagalpuri" },
      ],
      avoidColors: [
        { hex: "#FF8C00", name: "Dark Orange" },
        { hex: "#D2691E", name: "Chocolate" },
        { hex: "#B8860B", name: "Ochre Gold" },
      ],
      sareeColorKeywords: ["magenta", "blue", "teal", "red"],
      stylingTip: "Cool, electric hues like cobalt blue, hot magenta and vivid teal create stunning contrast against your cool tan complexion — choose silk sarees with dense weaving for maximum colour vibrancy.",
    },
    neutral: {
      skinTone: "Caramel Tan",
      description: "Your complexion is the perfect caramel — a warm tan with balanced undertones that gives your skin an even, rich quality reminiscent of the finest aged teak. Colours seem to deepen and enrich themselves against your skin.",
      recommendedColors: [
        { hex: "#CC0000", name: "Ruby Red", sareeStyle: "Kanjivaram Silk" },
        { hex: "#FFD700", name: "Yellow Gold", sareeStyle: "Banarasi Brocade" },
        { hex: "#0066CC", name: "Royal Blue", sareeStyle: "Patola Silk" },
        { hex: "#CC6600", name: "Burnt Orange", sareeStyle: "Pochampally Ikat" },
        { hex: "#009966", name: "Emerald", sareeStyle: "Chanderi Silk" },
        { hex: "#990099", name: "Rich Purple", sareeStyle: "Mysore Silk" },
      ],
      avoidColors: [
        { hex: "#C8A882", name: "Sandy Tan" },
        { hex: "#D2B48C", name: "Light Tan" },
        { hex: "#DEBB9B", name: "Pale Caramel" },
      ],
      sareeColorKeywords: ["red", "gold", "blue", "orange"],
      stylingTip: "Rich jewel tones and warm metallics are your calling — ruby red Kanjivaram silks with gold zari and bright royal blue Patolas will make your caramel complexion absolutely radiant.",
    },
  },
  deep: {
    warm: {
      skinTone: "Mahogany Warm Deep",
      description: "Your deep complexion carries the majestic warmth of polished mahogany — a rich, glowing darkness that possesses its own inner luminance. Your skin tone is among the most celebrated in Indian textile traditions for good reason.",
      recommendedColors: [
        { hex: "#FF0000", name: "Pure Red", sareeStyle: "Kanjivaram Silk" },
        { hex: "#FF6600", name: "Vivid Orange", sareeStyle: "Pochampally Ikat" },
        { hex: "#FFFF00", name: "Bright Yellow", sareeStyle: "Banarasi Brocade" },
        { hex: "#FF00FF", name: "Fuchsia", sareeStyle: "Chanderi Silk" },
        { hex: "#00FF00", name: "Bright Green", sareeStyle: "Patola Silk" },
        { hex: "#FFD700", name: "Pure Gold", sareeStyle: "Mysore Silk" },
      ],
      avoidColors: [
        { hex: "#4A3728", name: "Dark Brown" },
        { hex: "#3D2B1F", name: "Deep Umber" },
        { hex: "#5C4033", name: "Mocha" },
      ],
      sareeColorKeywords: ["red", "yellow", "orange", "fuchsia"],
      stylingTip: "The most vibrant, saturated colours exist specifically for your magnificent deep warm complexion — pure reds, electric yellows and bold fuchsia pop gloriously. Heavy gold zari work creates an unmatched radiance.",
    },
    cool: {
      skinTone: "Ebony Cool Deep",
      description: "Your deep cool complexion has the dramatic beauty of an Indian midnight sky — rich, velvety darkness with cool blue-violet undertones that create an extraordinary depth. Bold colours transform on your skin in ways few other tones can achieve.",
      recommendedColors: [
        { hex: "#FF00FF", name: "Magenta", sareeStyle: "Banarasi Silk" },
        { hex: "#00FFFF", name: "Cyan Blue", sareeStyle: "Patola Silk" },
        { hex: "#FF0066", name: "Hot Pink", sareeStyle: "Kanjivaram" },
        { hex: "#6600FF", name: "Electric Violet", sareeStyle: "Mysore Silk" },
        { hex: "#00FF99", name: "Neon Teal", sareeStyle: "Chanderi" },
        { hex: "#FFFFFF", name: "Pure White", sareeStyle: "Kasavu Silk" },
      ],
      avoidColors: [
        { hex: "#8B0000", name: "Dark Wine" },
        { hex: "#4B0000", name: "Very Dark Red" },
        { hex: "#2C1810", name: "Near Black" },
      ],
      sareeColorKeywords: ["magenta", "blue", "pink", "white"],
      stylingTip: "Electric, neon-adjacent colours and pure white create the most dramatic and beautiful contrast against your deep cool complexion — traditional white Kerala Kasavu sarees with gold borders look extraordinary on you.",
    },
    neutral: {
      skinTone: "Rich Neutral Deep",
      description: "Your deep complexion possesses a perfect balance — the warm earthiness of teak without the red, the cool depth of ebony without the blue. This balanced richness is a canvas upon which any colour becomes more itself.",
      recommendedColors: [
        { hex: "#FF0000", name: "True Red", sareeStyle: "Kanjivaram Silk" },
        { hex: "#FF69B4", name: "Hot Pink", sareeStyle: "Chanderi Silk" },
        { hex: "#FFD700", name: "Gold", sareeStyle: "Banarasi Brocade" },
        { hex: "#00CED1", name: "Turquoise", sareeStyle: "Patola Silk" },
        { hex: "#FF4500", name: "Orange Red", sareeStyle: "Pochampally Ikat" },
        { hex: "#7FFF00", name: "Chartreuse", sareeStyle: "Bhagalpuri Silk" },
      ],
      avoidColors: [
        { hex: "#36454F", name: "Charcoal" },
        { hex: "#2F4F4F", name: "Dark Slate" },
        { hex: "#556B2F", name: "Dark Olive" },
      ],
      sareeColorKeywords: ["red", "pink", "gold", "turquoise"],
      stylingTip: "Bright, pure colours in every family look spectacular against your deep balanced complexion — aim for maximum saturation and contrast. Colours that seem 'too bold' for others are perfectly calibrated for you.",
    },
  },
};

// ─── Canvas pixel analysis ────────────────────────────────────────────────────

function rgbToLab(r: number, g: number, b: number): [number, number, number] {
  // sRGB to linear
  let rr = r / 255, gg = g / 255, bb = b / 255;
  rr = rr > 0.04045 ? Math.pow((rr + 0.055) / 1.055, 2.4) : rr / 12.92;
  gg = gg > 0.04045 ? Math.pow((gg + 0.055) / 1.055, 2.4) : gg / 12.92;
  bb = bb > 0.04045 ? Math.pow((bb + 0.055) / 1.055, 2.4) : bb / 12.92;

  // Linear to XYZ (D65)
  const X = (rr * 0.4124564 + gg * 0.3575761 + bb * 0.1804375) / 0.95047;
  const Y = (rr * 0.2126729 + gg * 0.7151522 + bb * 0.0721750) / 1.00000;
  const Z = (rr * 0.0193339 + gg * 0.1191920 + bb * 0.9503041) / 1.08883;

  const f = (t: number) => t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116;
  return [116 * f(Y) - 16, 500 * (f(X) - f(Y)), 200 * (f(Y) - f(Z))];
}

function classifySkinTone(r: number, g: number, b: number): { toneCategory: AnalysisResult["toneCategory"]; undertone: AnalysisResult["undertone"] } {
  const [L, a, bLab] = rgbToLab(r, g, b);

  // Tone category from L (lightness)
  let toneCategory: AnalysisResult["toneCategory"];
  if (L > 75) toneCategory = "fair";
  else if (L > 65) toneCategory = "light";
  else if (L > 52) toneCategory = "medium";
  else if (L > 38) toneCategory = "tan";
  else toneCategory = "deep";

  // Undertone from a/b ratio
  // a+ = reddish, a- = greenish
  // b+ = yellowish (warm), b- = bluish (cool)
  let undertone: AnalysisResult["undertone"];
  const warmScore = bLab - Math.abs(a) * 0.3;
  if (warmScore > 8) undertone = "warm";
  else if (warmScore < 2 || a > 6) undertone = "cool";
  else undertone = "neutral";

  return { toneCategory, undertone };
}

function sampleSkinPixels(imgEl: HTMLImageElement): { r: number; g: number; b: number } | null {
  try {
    const canvas = document.createElement("canvas");
    const SIZE = 200;
    canvas.width = SIZE; canvas.height = SIZE;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(imgEl, 0, 0, SIZE, SIZE);

    // Sample from the center region (face/wrist area)
    const cx = SIZE / 2, cy = SIZE / 2;
    const samples: { r: number; g: number; b: number }[] = [];

    // Sample in a diamond pattern — center region most likely to be skin
    const points = [
      [cx, cy], [cx - 20, cy], [cx + 20, cy],
      [cx, cy - 20], [cx, cy + 20],
      [cx - 12, cy - 12], [cx + 12, cy - 12],
      [cx - 12, cy + 12], [cx + 12, cy + 12],
      [cx - 30, cy], [cx + 30, cy],
      [cx, cy - 30], [cx, cy + 30],
    ];

    for (const [px, py] of points) {
      const pixel = ctx.getImageData(Math.round(px), Math.round(py), 1, 1).data;
      const r = pixel[0], g = pixel[1], b = pixel[2];
      // Filter out near-white backgrounds and near-black pixels
      const brightness = (r + g + b) / 3;
      if (brightness > 30 && brightness < 240) {
        // Filter to rough skin-tone range (eliminate strong blue/green backgrounds)
        if (r > g * 0.7 && r > b * 0.7) {
          samples.push({ r, g, b });
        }
      }
    }

    // If strict filter yields nothing, fall back to all non-extreme pixels
    const pool = samples.length >= 3 ? samples : points.map(([px, py]) => {
      const pixel = ctx.getImageData(Math.round(px), Math.round(py), 1, 1).data;
      return { r: pixel[0], g: pixel[1], b: pixel[2] };
    }).filter(({ r, g, b }) => (r + g + b) / 3 > 30 && (r + g + b) / 3 < 240);

    if (!pool.length) return null;

    // Weighted average — central samples count more
    const avg = pool.reduce(
      (acc, c) => ({ r: acc.r + c.r, g: acc.g + c.g, b: acc.b + c.b }),
      { r: 0, g: 0, b: 0 }
    );
    return { r: Math.round(avg.r / pool.length), g: Math.round(avg.g / pool.length), b: Math.round(avg.b / pool.length) };
  } catch {
    return null;
  }
}

export function analyzePixels(imgEl: HTMLImageElement): AnalysisResult {
  const rgb = sampleSkinPixels(imgEl);

  // Default fallback — medium warm (most common South Asian tone)
  const { r, g, b } = rgb ?? { r: 180, g: 130, b: 95 };
  const { toneCategory, undertone } = classifySkinTone(r, g, b);

  const palette = PALETTE_DB[toneCategory]?.[undertone] ?? PALETTE_DB.medium.warm;
  return { ...palette, undertone, toneCategory };
}

// ─── Constants ────────────────────────────────────────────────────────────────
const C = {
  maroon: "#800020", maroonDeep: "#5a0016", maroonLight: "#a0002a",
  navy: "#1B2A6B", navyDeep: "#0E1A4A",
  forest: "#14402A", forestMid: "#1e5c3c",
  gold: "#C4980A", goldVibrant: "#D4AF37", goldLight: "#e8c84a",
  blush: "#F2C4CE",
  cream: "#F5E6D3", creamLight: "#FFF9F0", creamMid: "#F8EEE2",
  charcoal: "#1a1010", warmGrey: "#4a3828",
};

const FONT = {
  heading: "'Cinzel', serif",
  body: "'Josefin Sans', sans-serif",
  serif: "'Cormorant Garamond', serif",
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Josefin+Sans:ital,wght@0,100;0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400;1,500&display=swap');

.sta-root {
  font-family: 'Josefin Sans', sans-serif;
  background: linear-gradient(160deg, #FFF9F0 0%, #F8EEE2 55%, #F5E6D3 100%);
  min-height: 100vh;
  color: #5a0016;
  overflow-x: hidden;
}

.sta-drop {
  border: 1.5px dashed rgba(196,152,10,.55);
  background: rgba(255,249,240,.7);
  cursor: pointer;
  transition: border-color .3s, background .3s, transform .2s;
  position: relative; overflow: hidden;
}
.sta-drop:hover, .sta-drop.drag {
  border-color: rgba(128,0,32,.7);
  background: rgba(255,249,240,.95);
  transform: translateY(-2px);
}

.sta-cam-wrap { position:relative; overflow:hidden; background:#000; }
.sta-cam-wrap video { width:100%; display:block; aspect-ratio:4/3; object-fit:cover; }
.sta-cam-overlay {
  position:absolute; inset:0; pointer-events:none;
  display:flex; align-items:center; justify-content:center;
}
.sta-face-guide {
  width:52%; aspect-ratio:3/4;
  border:2px solid rgba(212,175,55,.65);
  border-radius:50% 50% 44% 44% / 52% 52% 38% 38%;
  box-shadow:0 0 0 9999px rgba(0,0,0,.38);
}

.sta-preview { position:relative; overflow:hidden; }
.sta-preview img { width:100%; display:block; aspect-ratio:4/3; object-fit:cover; }
.sta-preview-overlay {
  position:absolute; inset:0;
  background:linear-gradient(to top, rgba(90,0,22,.5) 0%, transparent 50%);
}

.sta-swatch {
  width:48px; height:48px; border-radius:0;
  border:2px solid transparent;
  cursor:pointer; transition:transform .2s, box-shadow .2s, border-color .2s;
  flex-shrink:0;
}
.sta-swatch:hover { transform:scale(1.15); box-shadow:0 8px 20px rgba(0,0,0,.22); }
.sta-swatch.active { border-color:#C4980A; transform:scale(1.1); box-shadow:0 0 0 3px rgba(196,152,10,.28); }

.sta-saree-card {
  background:rgba(255,249,240,.85);
  border:1px solid rgba(196,152,10,.22);
  overflow:hidden;
  transition:transform .35s cubic-bezier(.4,0,.2,1), box-shadow .35s, border-color .35s;
  position:relative;
}
.sta-saree-card:hover {
  transform:translateY(-5px);
  box-shadow:0 22px 56px rgba(128,0,32,.12);
  border-color:rgba(196,152,10,.48);
}
.sta-saree-card img { width:100%; aspect-ratio:3/4; object-fit:cover; display:block; }
.sta-saree-card-overlay {
  position:absolute; top:0; left:0; right:0; height:36px;
  background:linear-gradient(to bottom,rgba(90,0,22,.28),transparent);
  pointer-events:none;
}

.sta-progress-bar {
  height:2px; background:rgba(196,152,10,.2); overflow:hidden; position:relative;
}
.sta-progress-fill {
  height:100%; background:linear-gradient(90deg,#C4980A,#D4AF37,#e8c84a);
  background-size:200% 100%; animation:staProgress 1.8s ease-in-out infinite;
}
@keyframes staProgress {
  0%{background-position:200% center}
  100%{background-position:-200% center}
}

.sta-scan-line {
  position:absolute; left:0; right:0; height:2px;
  background:linear-gradient(90deg, transparent, rgba(212,175,55,.85), transparent);
  animation:staScan 1.4s ease-in-out infinite;
}
@keyframes staScan {
  0%{top:0%;opacity:0} 10%{opacity:1} 50%{top:100%} 90%{opacity:1} 100%{top:0%;opacity:0}
}

.sta-btn {
  display:inline-flex; align-items:center; gap:10px; justify-content:center;
  padding:14px 38px;
  background:linear-gradient(135deg,#D4AF37 0%,#b89a0c 100%);
  color:#5a0016;
  font-family:'Josefin Sans'; font-size:10px; letter-spacing:.22em;
  font-weight:700; text-transform:uppercase;
  border:none; cursor:pointer; width:100%;
  transition:transform .3s, box-shadow .3s;
  box-shadow:0 5px 24px rgba(196,152,10,.32);
  position:relative; overflow:hidden;
}
.sta-btn::after {
  content:''; position:absolute; top:0; left:-80%; width:60%; height:100%;
  background:linear-gradient(90deg,transparent,rgba(255,255,255,.28),transparent);
  animation:staShim 3s ease infinite;
}
@keyframes staShim { 0%{left:-80%} 100%{left:120%} }
.sta-btn:hover { transform:translateY(-2px); box-shadow:0 10px 32px rgba(196,152,10,.48); }
.sta-btn:disabled { opacity:.55; cursor:not-allowed; transform:none; }

.sta-btn-outline {
  display:inline-flex; align-items:center; justify-content:center; gap:10px;
  padding:13px 36px; width:100%;
  border:1.5px solid rgba(128,0,32,.45); color:#800020;
  font-family:'Josefin Sans'; font-size:10px; letter-spacing:.22em;
  font-weight:600; text-transform:uppercase;
  background:transparent; cursor:pointer;
  transition:all .3s;
}
.sta-btn-outline:hover { background:rgba(128,0,32,.07); border-color:#800020; transform:translateY(-1px); }

.sta-ut-pill {
  display:inline-block; padding:5px 14px;
  font-family:'Josefin Sans'; font-size:9px; letter-spacing:.18em;
  text-transform:uppercase; font-weight:600;
}

.sta-avoid { position:relative; }
.sta-avoid::after {
  content:''; position:absolute; inset:0;
  background:repeating-linear-gradient(-45deg, transparent, transparent 4px, rgba(255,255,255,.28) 4px, rgba(255,255,255,.28) 6px);
}

.sta-reveal { opacity:0; transform:translateY(22px); transition:opacity .8s cubic-bezier(.4,0,.2,1), transform .8s cubic-bezier(.4,0,.2,1); }
.sta-reveal.on { opacity:1; transform:translateY(0); }

.sta-root *::-webkit-scrollbar { width:4px; }
.sta-root *::-webkit-scrollbar-track { background:transparent; }
.sta-root *::-webkit-scrollbar-thumb { background:rgba(196,152,10,.35); }

.sta-ey {
  font-family:'Josefin Sans'; font-size:10px; letter-spacing:.30em;
  text-transform:uppercase; color:#C4980A; font-weight:600;
}
.sta-rule { width:44px; height:1px; background:#C4980A; }

.sta-tab {
  flex:1; padding:13px;
  font-family:'Josefin Sans'; font-size:10px; letter-spacing:.18em;
  text-transform:uppercase; font-weight:600;
  border:none; cursor:pointer; transition:all .25s;
}
.sta-tab.active { background:#800020; color:white; }
.sta-tab:not(.active) { background:rgba(255,249,240,.7); color:#4a3828; }
.sta-tab:not(.active):hover { background:rgba(128,0,32,.1); color:#800020; }

@media(max-width:768px) {
  .sta-grid-2 { grid-template-columns:1fr!important; }
  .sta-pad { padding:32px 20px!important; }
}
`;

// ─── Helpers ─────────────────────────────────────────────────────────────────
function mapProduct(p: BackendProduct): Saree {
  return {
    id: p.id, slug: p.slug || p.id,
    name: p.name,
    price: p.discount_price ?? p.price,
    originalPrice: p.price,
    image: p.thumbnail || p.images?.[0] || "",
    color: p.color || "",
    fabric: p.fabric || "",
    description: p.short_description || "",
  };
}

function useReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, on] as const;
}

function Swatch({ color, active, onClick }: { color: ColorSwatch; active: boolean; onClick: () => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 7, cursor: "pointer" }} onClick={onClick}>
      <div className={`sta-swatch ${active ? "active" : ""}`} style={{ background: color.hex }} title={color.name} />
      <span style={{ fontFamily: FONT.body, fontSize: 9, letterSpacing: ".12em", textTransform: "uppercase", color: C.warmGrey, textAlign: "center", maxWidth: 56 }}>{color.name}</span>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function SkinToneAnalyzer() {
  const [mode, setMode]           = useState<"upload" | "camera">("upload");
  const [imageData, setImageData] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult]       = useState<AnalysisResult | null>(null);
  const [sarees, setSarees]       = useState<Saree[]>([]);
  const [loadingSarees, setLoadingSarees] = useState(false);
  const [activeColor, setActiveColor]     = useState<ColorSwatch | null>(null);
  const [camActive, setCamActive] = useState(false);
  const [dragOver, setDragOver]   = useState(false);
  const [error, setError]         = useState<string | null>(null);

  const videoRef    = useRef<HTMLVideoElement>(null);
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const imgRef      = useRef<HTMLImageElement>(null);
  const streamRef   = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Stores pre-sampled RGB from camera frame so we don't need imgRef for camera captures
  const capturedRGBRef = useRef<{ r: number; g: number; b: number } | null>(null);

  const [heroRef, heroOn]     = useReveal(0.05);
  const [resultRef, resultOn] = useReveal(0.1);

  // ── Camera ──────────────────────────────────────────────────────────────────
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 960 } }
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCamActive(true);
      setImageData(null);
      setResult(null);
    } catch {
      setError("Camera access denied. Please allow camera permission or use file upload.");
    }
  }, []);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    setCamActive(false);
  }, []);

  useEffect(() => { if (mode === "upload") stopCamera(); }, [mode, stopCamera]);
  useEffect(() => () => stopCamera(), [stopCamera]);

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const v = videoRef.current;
    if (!v.videoWidth || !v.videoHeight) {
      setError("Camera not ready yet — please wait a moment and try again.");
      return;
    }
    // Use an in-memory canvas — canvasRef is inside the preview block and not mounted yet
    const c = document.createElement("canvas");
    c.width = v.videoWidth;
    c.height = v.videoHeight;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(v, 0, 0);
    // Pre-sample pixels directly from the live video frame
    capturedRGBRef.current = sampleSkinPixels(c as unknown as HTMLImageElement);
    const data = c.toDataURL("image/jpeg", 0.92);
    setImageData(data);
    stopCamera();
  };

  // ── File upload ──────────────────────────────────────────────────────────────
  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) { setError("Please upload an image file."); return; }
    const reader = new FileReader();
    reader.onload = e => {
      setImageData(e.target?.result as string);
      setResult(null);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  // ── Canvas pixel analysis (no API key needed) ────────────────────────────────
  const analyzeImage = async () => {
    if (!imageData) return;
    setAnalyzing(true);
    setError(null);
    setResult(null);
    setSarees([]);

    // Small delay so the scanning animation renders
    await new Promise(r => setTimeout(r, 1400));

    try {
      let rgb: { r: number; g: number; b: number } | null = null;

      // Camera path: pixels were already sampled at capture time
      if (capturedRGBRef.current) {
        rgb = capturedRGBRef.current;
        capturedRGBRef.current = null;
      } else {
        // Upload path: sample from the <img> element
        const img = imgRef.current;
        if (!img) throw new Error("Image element not found.");
        await new Promise<void>((resolve, reject) => {
          if (img.complete && img.naturalWidth > 0) { resolve(); return; }
          img.onload = () => resolve();
          img.onerror = () => reject(new Error("Image failed to load for analysis"));
        });
        rgb = sampleSkinPixels(img);
      }

      const { r, g, b } = rgb ?? { r: 180, g: 130, b: 95 };
      const { toneCategory, undertone } = classifySkinTone(r, g, b);
      const palette = PALETTE_DB[toneCategory]?.[undertone] ?? PALETTE_DB.medium.warm;
      const analysisResult: AnalysisResult = { ...palette, undertone, toneCategory };

      setResult(analysisResult);
      if (analysisResult.recommendedColors?.length) setActiveColor(analysisResult.recommendedColors[0]);
      await fetchMatchingSarees(analysisResult.sareeColorKeywords || []);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Analysis failed. Please try again.";
      setError(msg);
    } finally {
      setAnalyzing(false);
    }
  };

  // ── Fetch sarees ─────────────────────────────────────────────────────────────
  const fetchMatchingSarees = async (colorKeywords: string[]) => {
    if (!colorKeywords.length) return;
    setLoadingSarees(true);
    try {
      let items: BackendProduct[] = [];

      for (const keyword of colorKeywords) {
        if (items.length) break;
        const res = await api.get("/products", {
          params: { color: keyword, page_size: 6 }
        });
        items = res.data?.data?.items || [];
      }

      // Fallback: latest products
      if (!items.length) {
        const res = await api.get("/products", {
          params: { page_size: 6, sort_by: "created_at", sort_order: "desc" }
        });
        items = res.data?.data?.items || [];
      }

      setSarees(items.map(mapProduct));
    } catch {
      // silently fail — sarees section just stays hidden
    } finally {
      setLoadingSarees(false);
    }
  };

  const reset = () => {
    setImageData(null);
    setResult(null);
    setSarees([]);
    setError(null);
    setActiveColor(null);
  };

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{CSS}</style>
      <div className="sta-root">

        {/* ── Hero Banner ── */}
        <section ref={heroRef} style={{
          position: "relative", padding: "120px 64px 80px", overflow: "hidden",
          background: `linear-gradient(155deg, ${C.maroonDeep} 0%, ${C.maroon} 40%, ${C.navy} 100%)`
        }}>
          <div style={{ position: "absolute", top: "20%", right: "8%", width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle, rgba(212,175,55,.12) 0%, transparent 68%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: "10%", left: "5%", width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(242,196,206,.08) 0%, transparent 68%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", right: "15%", top: "50%", transform: "translateY(-50%)", width: 480, height: 480, borderRadius: "50%", border: "1px solid rgba(212,175,55,.12)", pointerEvents: "none" }} />

          <div className={`sta-reveal ${heroOn ? "on" : ""}`} style={{ maxWidth: 1240, margin: "0 auto", position: "relative", zIndex: 1 }}>
            <span className="sta-ey" style={{ color: "rgba(212,175,55,.80)", display: "block", marginBottom: 18 }}>Neyge Couture · AI Styling</span>
            <h1 style={{ fontFamily: FONT.heading, fontSize: "clamp(38px,6vw,76px)", fontWeight: 400, color: "white", lineHeight: 1.06, letterSpacing: ".05em", marginBottom: 16 }}>
              YOUR SKIN.<br />YOUR PALETTE.
            </h1>
            <p style={{ fontFamily: FONT.serif, fontSize: "clamp(16px,2vw,22px)", fontStyle: "italic", fontWeight: 300, color: "rgba(255,255,255,.72)", maxWidth: 480, lineHeight: 1.65, marginBottom: 28 }}>
              Let our AI read the warmth, depth and soul of your complexion — then discover sarees woven for you.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {["✦ Instant Analysis", "✦ No Account Needed", "✦ Privacy First"].map(t => (
                <span key={t} style={{ fontFamily: FONT.body, fontSize: 9, letterSpacing: ".20em", textTransform: "uppercase", color: "rgba(255,255,255,.45)", fontWeight: 500 }}>{t}</span>
              ))}
            </div>
          </div>
        </section>

        {/* ── Main Panel ── */}
        <section style={{ padding: "72px 64px", maxWidth: 1300, margin: "0 auto" }} className="sta-pad">
          <div className="sta-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "start" }}>

            {/* LEFT */}
            <div>
              {/* Tab switcher */}
              <div style={{ display: "flex", marginBottom: 28, border: "1.5px solid rgba(128,0,32,.22)" }}>
                <button className={`sta-tab ${mode === "upload" ? "active" : ""}`} onClick={() => setMode("upload")}>📁 Upload Photo</button>
                <button className={`sta-tab ${mode === "camera" ? "active" : ""}`} onClick={() => { setMode("camera"); if (!camActive && !imageData) startCamera(); }}>📷 Use Camera</button>
              </div>

              {/* Upload mode */}
              {mode === "upload" && !imageData && (
                <div
                  className={`sta-drop ${dragOver ? "drag" : ""}`}
                  style={{ padding: "64px 32px", textAlign: "center" }}
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} style={{ display: "none" }} />
                  <div style={{ fontSize: 52, marginBottom: 18, lineHeight: 1 }}>🎨</div>
                  <h3 style={{ fontFamily: FONT.heading, fontSize: 16, fontWeight: 400, color: C.maroon, marginBottom: 10, letterSpacing: ".06em" }}>DROP YOUR PHOTO HERE</h3>
                  <p style={{ fontFamily: FONT.body, fontSize: 12, color: C.warmGrey, lineHeight: 1.65, fontWeight: 300, marginBottom: 16 }}>
                    Upload a clear photo of your face or wrist in natural light for the most accurate colour reading
                  </p>
                  <span style={{ fontFamily: FONT.body, fontSize: 9, letterSpacing: ".18em", textTransform: "uppercase", color: C.gold, fontWeight: 600 }}>JPG · PNG · WEBP · up to 10MB</span>
                </div>
              )}

              {/* Camera mode */}
              {mode === "camera" && !imageData && (
                <div>
                  <div className="sta-cam-wrap">
                    <video ref={videoRef} autoPlay playsInline muted />
                    <div className="sta-cam-overlay">
                      <div className="sta-face-guide" />
                    </div>
                  </div>
                  <p style={{ fontFamily: FONT.body, fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase", color: C.warmGrey, textAlign: "center", marginTop: 12, marginBottom: 18 }}>
                    Align your face within the oval · Natural light preferred
                  </p>
                  <button className="sta-btn" onClick={capturePhoto} disabled={!camActive}>
                    ◎ &nbsp;Capture Photo
                  </button>
                </div>
              )}

              {/* Preview */}
              {imageData && (
                <div>
                  <div className="sta-preview">
                    {/* Hidden img used for canvas pixel sampling */}
                    <img
                      ref={imgRef}
                      src={imageData}
                      alt="Your photo"
                      crossOrigin="anonymous"
                    />
                    <div className="sta-preview-overlay" />
                    {analyzing && (
                      <div style={{ position: "absolute", inset: 0, background: "rgba(90,0,22,.55)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, backdropFilter: "blur(2px)" }}>
                        <div className="sta-scan-line" />
                        <div style={{ fontFamily: FONT.heading, fontSize: 13, color: "white", letterSpacing: ".12em", textAlign: "center" }}>READING YOUR PALETTE…</div>
                        <div style={{ width: 200 }}>
                          <div className="sta-progress-bar"><div className="sta-progress-fill" /></div>
                        </div>
                        <div style={{ fontFamily: FONT.body, fontSize: 9, color: "rgba(255,255,255,.55)", letterSpacing: ".18em", textTransform: "uppercase" }}>Analysing pixel tones</div>
                      </div>
                    )}
                  </div>
                  <canvas ref={canvasRef} style={{ display: "none" }} />
                  <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
                    <button className="sta-btn" onClick={analyzeImage} disabled={analyzing} style={{ flex: 2 }}>
                      {analyzing ? "Analysing…" : "✦ Reveal My Palette"}
                    </button>
                    <button className="sta-btn-outline" onClick={reset} style={{ flex: 1, width: "auto", padding: "14px 20px" }}>
                      ↺ Retake
                    </button>
                  </div>
                </div>
              )}

              {/* Error */}
              {error && (
                <div style={{ marginTop: 16, padding: "14px 18px", background: "rgba(128,0,32,.07)", border: "1px solid rgba(128,0,32,.24)" }}>
                  <p style={{ fontFamily: FONT.body, fontSize: 12, color: C.maroon, lineHeight: 1.65, fontWeight: 500 }}>{error}</p>
                </div>
              )}

              {/* Privacy note */}
              <div style={{ marginTop: 22, padding: "14px 18px", background: "rgba(20,64,42,.05)", border: "1px solid rgba(20,64,42,.18)" }}>
                <p style={{ fontFamily: FONT.body, fontSize: 10, color: C.forest, letterSpacing: ".10em", lineHeight: 1.70, fontWeight: 500 }}>
                  🔒 &nbsp;Your photo never leaves your device. All analysis happens locally in your browser — nothing is uploaded or stored.
                </p>
              </div>
            </div>

            {/* RIGHT — Results */}
            <div ref={resultRef}>
              {!result ? (
                <div style={{ padding: "56px 32px", textAlign: "center", border: "1.5px dashed rgba(196,152,10,.28)", background: "rgba(255,249,240,.5)" }}>
                  <div style={{ fontSize: 64, marginBottom: 22, lineHeight: 1 }}>🪷</div>
                  <h3 style={{ fontFamily: FONT.heading, fontSize: 18, fontWeight: 400, color: C.maroon, marginBottom: 12, letterSpacing: ".06em" }}>YOUR COLOUR STORY AWAITS</h3>
                  <p style={{ fontFamily: FONT.body, fontSize: 13, color: C.warmGrey, lineHeight: 1.80, fontWeight: 300, maxWidth: 280, margin: "0 auto" }}>
                    Upload your photo and let our AI discover the exact shades that will make your complexion glow in a Neyge saree.
                  </p>
                  <div style={{ margin: "28px auto 0", width: 44, height: 1, background: C.gold, opacity: .5 }} />
                  <p style={{ fontFamily: FONT.body, fontSize: 9, letterSpacing: ".20em", textTransform: "uppercase", color: C.gold, marginTop: 18 }}>colour science · no api required</p>
                </div>
              ) : (
                <div className={`sta-reveal ${resultOn ? "on" : ""}`} style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                  {/* Tone identity */}
                  <div>
                    <span className="sta-ey" style={{ display: "block", marginBottom: 10 }}>Your Skin Palette</span>
                    <h2 style={{ fontFamily: FONT.heading, fontSize: "clamp(22px,3vw,32px)", fontWeight: 400, color: C.maroon, letterSpacing: ".05em", marginBottom: 8 }}>
                      {result.skinTone}
                    </h2>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 14, flexWrap: "wrap" }}>
                      <span className="sta-ut-pill" style={{
                        background: result.undertone === "warm" ? "rgba(196,152,10,.12)" : result.undertone === "cool" ? "rgba(27,42,107,.10)" : "rgba(20,64,42,.10)",
                        color: result.undertone === "warm" ? C.gold : result.undertone === "cool" ? C.navy : C.forest,
                        border: `1px solid ${result.undertone === "warm" ? "rgba(196,152,10,.35)" : result.undertone === "cool" ? "rgba(27,42,107,.25)" : "rgba(20,64,42,.25)"}`,
                      }}>
                        {result.undertone} undertone
                      </span>
                      <span className="sta-ut-pill" style={{ background: "rgba(128,0,32,.08)", color: C.maroon, border: "1px solid rgba(128,0,32,.22)" }}>
                        {result.toneCategory} depth
                      </span>
                    </div>
                    <p style={{ fontFamily: FONT.serif, fontSize: 15, fontStyle: "italic", color: "#3a1818", lineHeight: 1.80, borderLeft: "2px solid rgba(196,152,10,.4)", paddingLeft: 16, fontWeight: 400 }}>
                      {result.description}
                    </p>
                  </div>

                  <div style={{ width: "100%", height: 1, background: "rgba(196,152,10,.22)" }} />

                  {/* Recommended colours */}
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
                      <div className="sta-rule" />
                      <span style={{ fontFamily: FONT.body, fontSize: 9, letterSpacing: ".22em", textTransform: "uppercase", color: C.warmGrey, fontWeight: 700 }}>Colours that sing on you</span>
                    </div>
                    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                      {result.recommendedColors.map((c, i) => (
                        <Swatch key={i} color={c} active={activeColor?.hex === c.hex} onClick={() => setActiveColor(c)} />
                      ))}
                    </div>
                    {activeColor?.sareeStyle && (
                      <div style={{ marginTop: 14, padding: "10px 14px", background: "rgba(196,152,10,.08)", border: "1px solid rgba(196,152,10,.22)" }}>
                        <span style={{ fontFamily: FONT.body, fontSize: 10, color: C.warmGrey, letterSpacing: ".10em" }}>
                          ✦ &nbsp;<strong style={{ color: C.maroon }}>{activeColor.name}</strong> — pairs beautifully with {activeColor.sareeStyle}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Avoid colours */}
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
                      <div className="sta-rule" style={{ background: "rgba(128,0,32,.35)" }} />
                      <span style={{ fontFamily: FONT.body, fontSize: 9, letterSpacing: ".22em", textTransform: "uppercase", color: C.warmGrey, fontWeight: 700 }}>Colours to avoid</span>
                    </div>
                    <div style={{ display: "flex", gap: 16 }}>
                      {result.avoidColors.map((c, i) => (
                        <div key={i} className="sta-avoid" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 7 }}>
                          <div className="sta-swatch" style={{ background: c.hex, opacity: .55 }} />
                          <span style={{ fontFamily: FONT.body, fontSize: 9, letterSpacing: ".10em", textTransform: "uppercase", color: "#9a8070", textAlign: "center", maxWidth: 56 }}>{c.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Styling tip */}
                  <div style={{ padding: "18px 20px", background: "linear-gradient(135deg, rgba(20,64,42,.07) 0%, rgba(27,42,107,.05) 100%)", border: "1px solid rgba(20,64,42,.18)" }}>
                    <span style={{ fontFamily: FONT.body, fontSize: 9, letterSpacing: ".20em", textTransform: "uppercase", color: C.forest, fontWeight: 700, display: "block", marginBottom: 8 }}>✦ Stylist's tip</span>
                    <p style={{ fontFamily: FONT.serif, fontSize: 14, fontStyle: "italic", color: "#2a1010", lineHeight: 1.75, fontWeight: 400 }}>{result.stylingTip}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── Saree Recommendations ── */}
        {(sarees.length > 0 || loadingSarees) && (
          <section style={{ padding: "32px 64px 96px", maxWidth: 1300, margin: "0 auto" }} className="sta-pad">
            <div style={{ textAlign: "center", marginBottom: 52 }}>
              <span className="sta-ey" style={{ display: "block", marginBottom: 14 }}>Curated for Your Complexion</span>
              <h2 style={{ fontFamily: FONT.heading, fontSize: "clamp(24px,3.5vw,40px)", fontWeight: 400, color: C.maroon, marginBottom: 14, letterSpacing: ".06em" }}>
                SAREES MADE FOR YOUR SKIN
              </h2>
              <div style={{ width: 44, height: 1, background: C.gold, margin: "0 auto 16px" }} />
              <p style={{ fontFamily: FONT.body, fontSize: 13, color: C.warmGrey, fontWeight: 300, maxWidth: 380, margin: "0 auto", lineHeight: 1.72 }}>
                Each piece below has been matched to the colours that celebrate your unique complexion
              </p>
            </div>

            {loadingSarees ? (
              <div style={{ textAlign: "center", padding: "48px 0" }}>
                <div style={{ fontFamily: FONT.body, fontSize: 11, letterSpacing: ".18em", textTransform: "uppercase", color: C.warmGrey }}>Finding your matches…</div>
                <div style={{ width: 200, margin: "18px auto 0" }}><div className="sta-progress-bar"><div className="sta-progress-fill" /></div></div>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 24 }}>
                {sarees.map(s => (
                  <Link key={s.id} to={`/product/${s.slug}`} style={{ textDecoration: "none" }}>
                    <div className="sta-saree-card">
                      <div className="sta-saree-card-overlay" />
                      {s.image ? (
                        <img src={s.image} alt={s.name} loading="lazy" />
                      ) : (
                        <div style={{ width: "100%", aspectRatio: "3/4", background: "linear-gradient(135deg, rgba(196,152,10,.15), rgba(128,0,32,.10))", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <span style={{ fontSize: 40 }}>🪷</span>
                        </div>
                      )}
                      <div style={{ padding: "16px 14px" }}>
                        <p style={{ fontFamily: FONT.body, fontSize: 11, letterSpacing: ".10em", textTransform: "uppercase", color: C.warmGrey, marginBottom: 5, fontWeight: 500, lineHeight: 1.45 }}>{s.name}</p>
                        {s.color && (
                          <p style={{ fontFamily: FONT.body, fontSize: 9, letterSpacing: ".14em", textTransform: "uppercase", color: C.gold, marginBottom: 8, fontWeight: 600 }}>✦ {s.color}</p>
                        )}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <span style={{ fontFamily: FONT.heading, fontSize: 15, color: C.maroon, fontWeight: 500 }}>₹{s.price.toLocaleString("en-IN")}</span>
                          {s.originalPrice > s.price && (
                            <span style={{ fontFamily: FONT.body, fontSize: 10, color: "#9a8070", textDecoration: "line-through" }}>₹{s.originalPrice.toLocaleString("en-IN")}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            <div style={{ textAlign: "center", marginTop: 52 }}>
              <Link to="/shop" style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                padding: "14px 48px",
                background: C.maroon, color: "white",
                fontFamily: FONT.body, fontSize: 10, letterSpacing: ".22em",
                fontWeight: 700, textTransform: "uppercase", textDecoration: "none",
                transition: "all .3s",
                boxShadow: "0 5px 24px rgba(128,0,32,.22)",
              }}>
                Browse All Sarees &nbsp;→
              </Link>
            </div>
          </section>
        )}

      </div>
    </>
  );
}