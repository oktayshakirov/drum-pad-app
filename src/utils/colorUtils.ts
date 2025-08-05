const hexToRgb = (hex: string): {r: number; g: number; b: number} | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

const rgbToHex = (r: number, g: number, b: number): string => {
  const toHex = (n: number) => {
    const hex = Math.round(n).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

const rgbToHsl = (
  r: number,
  g: number,
  b: number,
): {h: number; s: number; l: number} => {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {h: h * 360, s: s * 100, l: l * 100};
};

const hslToRgb = (
  h: number,
  s: number,
  l: number,
): {r: number; g: number; b: number} => {
  h /= 360;
  s /= 100;
  l /= 100;

  const hue2rgb = (p: number, q: number, t: number): number => {
    if (t < 0) {
      t += 1;
    }
    if (t > 1) {
      t -= 1;
    }
    if (t < 1 / 6) {
      return p + (q - p) * 6 * t;
    }
    if (t < 1 / 2) {
      return q;
    }
    if (t < 2 / 3) {
      return p + (q - p) * (2 / 3 - t) * 6;
    }
    return p;
  };

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
};

export const brightenColor = (color: string, factor: number = 0.3): string => {
  const rgb = hexToRgb(color);
  if (!rgb) {
    return color;
  }

  const {r, g, b} = rgb;
  const hsl = rgbToHsl(r, g, b);

  // Calculate luminance to determine if pad is dark or bright
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  if (luminance < 0.3) {
    // Dark pads: Create vibrant, saturated colors
    const newL = Math.min(85, hsl.l + (100 - hsl.l) * factor);
    const newS = Math.min(100, hsl.s + (100 - hsl.s) * 0.5);
    const newRgb = hslToRgb(hsl.h, newS, newL);
    return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
  } else {
    // Bright pads: Create darker, saturated colors for contrast
    const newL = Math.max(15, hsl.l - hsl.l * 0.7);
    const newS = Math.min(100, hsl.s + (100 - hsl.s) * 0.3);
    const newRgb = hslToRgb(hsl.h, newS, newL);
    return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
  }
};
