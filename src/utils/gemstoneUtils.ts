interface GemstoneNameParams {
  process?: string;
  color?: string;
  shape?: string;
  gemsType?: string;
  subType?: string;
  carat?: string | number;
  quantity?: string | number;
  clarity?: string;
}

export const generateGemstoneName = (params: GemstoneNameParams): string => {
  const {
    process,
    color,
    shape,
    gemsType,
    subType,
    carat,
    quantity,
    clarity
  } = params;

  const parts: string[] = [];

  // 1. Process (Natural/Lab)
  if (process && process.toLowerCase() !== 'n/a') {
    parts.push(process);
  }

  // 2. Quantity (if > 1)
  const qty = Number(quantity);
  if (qty > 1) {
    parts.push(`${qty}pcs`);
  }

  // 3. Carat
  if (carat && carat !== 'N/A') {
    const caratVal = typeof carat === 'string' ? carat : carat.toString();
    parts.push(`${caratVal}ct`);
  }

  // 4. Shape
  if (shape && shape.toLowerCase() !== 'n/a') {
    parts.push(shape);
  }

  // 5. Color
  if (color && color.toLowerCase() !== 'n/a') {
    parts.push(color);
  }

  // 6. Clarity
  if (clarity && clarity.toLowerCase() !== 'n/a') {
    parts.push(clarity);
  }

  // 7. Gem Type
  if (gemsType && gemsType.toLowerCase() !== 'n/a') {
    parts.push(gemsType);
  }

  // 8. Sub Type (in parentheses)
  if (subType && subType.toLowerCase() !== 'n/a' && subType !== gemsType) {
    parts.push(`(${subType})`);
  }

  return parts.join(' ').trim();
};
