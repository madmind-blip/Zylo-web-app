import { Product } from '../types';

export const PUBLISHED_SHEET_CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vRUvTHvotcGd7Cnsig2E79kBrFdABqbGiiIsgFbzMcCMfcbGQy29LOhz5l-mOU-8y_4MdKKlS57ituC/pub?output=csv';

/**
 * Extracts Google Drive file ID from various common Google Drive URL patterns:
 * - https://drive.google.com/file/d/FILE_ID/view?usp=sharing
 * - https://drive.google.com/file/d/FILE_ID/view
 * - https://drive.google.com/open?id=FILE_ID
 * - https://drive.google.com/uc?id=FILE_ID
 * - https://drive.google.com/uc?export=view&id=FILE_ID
 * - Plain file ID string
 */
export function extractGoogleDriveFileId(url: string): string | null {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();

  // Pattern 1: /file/d/FILE_ID or /d/FILE_ID
  const dMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/i) || trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/i);
  if (dMatch && dMatch[1]) return dMatch[1];

  // Pattern 2: id=FILE_ID parameter
  const idMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/i);
  if (idMatch && idMatch[1]) return idMatch[1];

  // Pattern 3: raw file ID (alphanumeric, dashes, underscores, length >= 20)
  if (/^[a-zA-Z0-9_-]{20,}$/.test(trimmed)) {
    return trimmed;
  }

  return null;
}

/**
 * Converts a Google Drive link or file ID to https://drive.google.com/uc?export=view&id=FILE_ID
 * as specified in the requirements.
 */
export function formatGoogleDriveUrl(rawUrl: string): string {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  const trimmed = rawUrl.trim();
  const fileId = extractGoogleDriveFileId(trimmed);
  if (fileId) {
    return `https://drive.google.com/uc?export=view&id=${fileId}`;
  }
  return trimmed;
}

/**
 * Parses raw sizes string or array (comma, hyphen, slash, or semicolon separated)
 * into a clean list of individual selectable sizes and detects Free Size.
 */
export function parseProductSizes(sizesInput: string[] | string | undefined): {
  sizes: string[];
  isFreeSize: boolean;
} {
  if (!sizesInput) {
    return { sizes: ['Free Size'], isFreeSize: true };
  }

  let rawTokens: string[] = [];
  if (Array.isArray(sizesInput)) {
    for (const item of sizesInput) {
      if (!item) continue;
      const parts = item.split(/[,/\-|;]+/).map((s) => s.trim()).filter(Boolean);
      rawTokens.push(...parts);
    }
  } else if (typeof sizesInput === 'string') {
    rawTokens = sizesInput.split(/[,/\-|;]+/).map((s) => s.trim()).filter(Boolean);
  }

  if (rawTokens.length === 0) {
    return { sizes: ['Free Size'], isFreeSize: true };
  }

  // Deduplicate while preserving order
  const uniqueSizes: string[] = [];
  for (const t of rawTokens) {
    if (!uniqueSizes.some((u) => u.toLowerCase() === t.toLowerCase())) {
      uniqueSizes.push(t);
    }
  }

  const allFreeSize = uniqueSizes.every(
    (s) =>
      s.toLowerCase() === 'free size' ||
      s.toLowerCase() === 'free-size' ||
      s.toLowerCase() === 'freesize' ||
      s.toLowerCase() === 'free'
  );

  if (allFreeSize) {
    return { sizes: ['Free Size'], isFreeSize: true };
  }

  const filtered = uniqueSizes.filter(
    (s) =>
      s.toLowerCase() !== 'free size' &&
      s.toLowerCase() !== 'free-size' &&
      s.toLowerCase() !== 'freesize' &&
      s.toLowerCase() !== 'free'
  );

  if (filtered.length === 0) {
    return { sizes: ['Free Size'], isFreeSize: true };
  }

  return { sizes: filtered, isFreeSize: false };
}

/**
 * Generates sensible, category-specific product feature bullets plus universal assurances.
 */
export function getProductCategoryHighlights(
  name: string = '',
  category: string = '',
  categoryGroup: 'combos' | 'watches' | 'other' = 'other'
): string[] {
  const n = name.toLowerCase();
  const c = category.toLowerCase();

  const bullets: string[] = [];

  // 1. Watches
  if (categoryGroup === 'watches' || c.includes('watch') || n.includes('watch')) {
    bullets.push('Water resistant & durable build');
    bullets.push('Adjustable strap with premium finish');
    bullets.push('Exhibition dial design & scratch-resistant glass');
  }
  // 2. Jackets / Hoodies / Winterwear
  else if (
    c.includes('jacket') ||
    c.includes('hoodie') ||
    c.includes('bomber') ||
    c.includes('coat') ||
    c.includes('windbreaker') ||
    c.includes('sweatshirt') ||
    n.includes('jacket') ||
    n.includes('hoodie') ||
    n.includes('bomber')
  ) {
    bullets.push('All season wear with thermal comfort');
    bullets.push('Machine washable & colorfast fabric');
    bullets.push('Reinforced heavy-duty zipper & premium stitching');
  }
  // 3. Combos & Sets
  else if (
    categoryGroup === 'combos' ||
    c.includes('combo') ||
    c.includes('bundle') ||
    c.includes('pack') ||
    c.includes('set') ||
    n.includes('combo')
  ) {
    bullets.push('Includes all listed pieces in the bundle');
    bullets.push('Curated streetwear color-matched styling');
    bullets.push('Pre-shrunk anti-fade treated fabrics');
  }
  // 4. Pants / Bottoms / Cargos / Jeans
  else if (
    c.includes('cargo') ||
    c.includes('pant') ||
    c.includes('bottom') ||
    c.includes('jean') ||
    c.includes('denim') ||
    c.includes('trouser') ||
    c.includes('chino') ||
    n.includes('cargo') ||
    n.includes('pant') ||
    n.includes('denim')
  ) {
    bullets.push('Comfort-stretch durable fabric');
    bullets.push('Deep utility pockets & relaxed drape');
    bullets.push('Reinforced seams for everyday wear');
  }
  // 5. Shirts / T-shirts / Tops
  else if (
    c.includes('shirt') ||
    c.includes('tee') ||
    c.includes('top') ||
    c.includes('polo') ||
    n.includes('shirt') ||
    n.includes('tee')
  ) {
    bullets.push('Breathable premium cotton blend');
    bullets.push('Modern streetwear relaxed fit');
    bullets.push('Pre-shrunk anti-fade color treatment');
  }
  // 6. Shoes / Footwear
  else if (c.includes('shoe') || c.includes('sneaker') || n.includes('shoe') || n.includes('sneaker')) {
    bullets.push('Cushioned anti-fatigue sole');
    bullets.push('High-traction grip & breathable lining');
    bullets.push('Durable premium finish');
  }
  // 7. General / Accessories
  else {
    bullets.push('Premium finish & durable quality');
    bullets.push('Modern minimalist streetwear design');
  }

  // Universal bullets required across all products:
  bullets.push('Fast dispatch nationwide');
  bullets.push('Cash on Delivery available');

  return bullets;
}

/**
 * Normalizes user-pasted Google Sheet URLs to the direct published CSV export URL.
 * Works with:
 * - Published to web URL (pub?output=csv)
 * - Standard edit URL (/spreadsheets/d/ID/edit...)
 * - pubhtml URL
 */
export function normalizeGoogleSheetCsvUrl(inputUrl: string): string {
  if (!inputUrl) return '';
  const trimmed = inputUrl.trim();

  // Already an export or pub with output=csv
  if (trimmed.includes('output=csv') || trimmed.includes('format=csv')) {
    return trimmed;
  }

  // If it's a published URL e.g. /pub?gid=... or /pub
  if (trimmed.includes('/pub')) {
    const base = trimmed.split('?')[0];
    const query = trimmed.includes('?') ? trimmed.split('?')[1] : '';
    const params = new URLSearchParams(query);
    params.set('output', 'csv');
    return `${base}?${params.toString()}`;
  }

  // If it's a regular Google Spreadsheet edit URL
  const sheetIdMatch = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/i);
  if (sheetIdMatch && sheetIdMatch[1]) {
    // Check if there's a gid specified
    const gidMatch = trimmed.match(/[?&#]gid=([0-9]+)/i);
    const gidParam = gidMatch ? `&gid=${gidMatch[1]}` : '';
    return `https://docs.google.com/spreadsheets/d/${sheetIdMatch[1]}/export?format=csv${gidParam}`;
  }

  return trimmed;
}

/**
 * Robust RFC 4180 compliant CSV text parser.
 * Handles commas inside quotes, multiline values, and quoted quotes ("").
 */
export function parseCSVText(csvText: string): Record<string, string>[] {
  if (!csvText || !csvText.trim()) return [];

  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = '';
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (inQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          currentCell += '"';
          i++; // skip escaped quote
        } else {
          inQuotes = false;
        }
      } else {
        currentCell += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        currentRow.push(currentCell.trim());
        currentCell = '';
      } else if (char === '\r') {
        if (nextChar === '\n') {
          i++;
        }
        currentRow.push(currentCell.trim());
        currentCell = '';
        if (currentRow.some((c) => c !== '')) {
          rows.push(currentRow);
        }
        currentRow = [];
      } else if (char === '\n') {
        currentRow.push(currentCell.trim());
        currentCell = '';
        if (currentRow.some((c) => c !== '')) {
          rows.push(currentRow);
        }
        currentRow = [];
      } else {
        currentCell += char;
      }
    }
  }

  // Push final trailing cell/row if present
  if (currentCell.length > 0 || currentRow.length > 0) {
    currentRow.push(currentCell.trim());
    if (currentRow.some((c) => c !== '')) {
      rows.push(currentRow);
    }
  }

  if (rows.length < 2) return [];

  // Match headers ignoring uppercase/lowercase and trailing spaces
  const headerRow = rows[0];
  const headerMap: { [normalized: string]: number } = {};
  headerRow.forEach((h, idx) => {
    const normalized = h.trim().toLowerCase();
    headerMap[normalized] = idx;
  });

  const parsedRecords: Record<string, string>[] = [];

  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    // Skip empty lines
    if (!row || row.length === 0 || row.every((c) => !c)) continue;

    const record: Record<string, string> = {};
    for (const [header, colIndex] of Object.entries(headerMap)) {
      record[header] = row[colIndex] !== undefined ? row[colIndex].trim() : '';
    }
    parsedRecords.push(record);
  }

  return parsedRecords;
}

/**
 * Parses raw CSV rows into strictly typed, business-rule validated Product models.
 * Headers: ID, NAME, CATEGORY, PRICE, ORIGINAL PRICE, SIZES, STOCK, IMAGE, DESCRIPTION, TAGS
 */
export function mapRowsToProducts(rows: Record<string, string>[]): Product[] {
  const products: Product[] = [];

  rows.forEach((row, index) => {
    // 1. ID & Name (fallback to auto-generated if missing)
    const id = row['id'] || `prod-${index + 1}`;
    const name = row['name'] || `Zyle Exclusive Item #${index + 1}`;
    if (!name && !row['id']) return; // Skip completely blank lines

    // 2. Category grouping:
    // "if CATEGORY starts with 'Combo' show it under 'Combos'. If it contains 'Watch', show it under 'Watches'."
    const rawCategory = row['category'] || 'Combos';
    const rawCatLower = rawCategory.trim().toLowerCase();

    let categoryGroup: 'combos' | 'watches' | 'other' = 'other';
    let normalizedCategory = rawCategory.trim();

    if (rawCatLower.startsWith('combo')) {
      categoryGroup = 'combos';
      normalizedCategory = 'combos';
    } else if (rawCatLower.includes('watch')) {
      categoryGroup = 'watches';
      normalizedCategory = 'watches';
    } else {
      categoryGroup = 'other';
      normalizedCategory = rawCategory.trim().toLowerCase();
    }

    // 3. Price and Original Price rules:
    // "Convert PRICE, ORIGINAL PRICE and STOCK to numbers.
    // In some rows PRICE is larger than ORIGINAL PRICE. Always treat the SMALLER number as the selling price
    // and the LARGER number as the cut-off price, and calculate discount % from them."
    const cleanNum = (val: string | undefined): number => {
      if (!val) return 0;
      const parsed = parseFloat(val.replace(/[^0-9.]/g, ''));
      return isNaN(parsed) ? 0 : parsed;
    };

    const numA = cleanNum(row['price']);
    const numB = cleanNum(row['original price'] || row['originalprice']);

    let sellingPrice = 0;
    let cutOffPrice = 0;

    if (numA > 0 && numB > 0) {
      sellingPrice = Math.min(numA, numB);
      cutOffPrice = Math.max(numA, numB);
    } else {
      sellingPrice = numA || numB || 0;
      cutOffPrice = numB || numA || 0;
    }

    const discountPercent =
      cutOffPrice > sellingPrice && cutOffPrice > 0
        ? Math.round(((cutOffPrice - sellingPrice) / cutOffPrice) * 100)
        : 0;

    // 4. Stock rules:
    // "Convert STOCK to numbers. Show 'Sold out' when STOCK is 0 and 'Only X left' when STOCK is 5 or less."
    const stockVal = parseInt((row['stock'] || '10').replace(/[^0-9]/g, ''), 10);
    const stock = isNaN(stockVal) ? 10 : stockVal;

    // 5. Sizes rules:
    // Comma or hyphen separated sizes, e.g. "M-L-XL-XXL" or "M, L, XL". "Free size" means single option.
    const { sizes, isFreeSize } = parseProductSizes(row['sizes']);

    // 6. Image rule:
    // IMAGE holds direct link (e.g. i.ibb.co) or Google Drive link, or multiple comma-separated links
    const rawImage = row['image'] || '';
    const images: string[] = [];
    if (rawImage && rawImage.trim()) {
      const parts = rawImage.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean);
      for (const p of parts) {
        let formatted = p;
        if (
          formatted.includes('drive.google.com') ||
          (!formatted.startsWith('http') && formatted.length >= 20)
        ) {
          formatted = formatGoogleDriveUrl(formatted);
        }
        if (formatted) {
          images.push(formatted);
        }
      }
    }

    // 7. Colors & Color Images rules:
    // COLORS: comma-separated color names (e.g. "Black, Navy, Olive")
    // COLOR IMAGES: comma-separated image links, in the same order as COLORS (first link belongs to first color, and so on)
    // Match headers ignoring case and trailing spaces. If COLORS is blank, show no color selector and keep the product behaving exactly as it does now.
    const rawColors = row['colors'] || '';
    const rawColorImages = row['color images'] || row['colorimages'] || row['color_images'] || '';

    let colors: string[] | undefined = undefined;
    let colorImages: string[] | undefined = undefined;
    let colorMap: Record<string, string> | undefined = undefined;

    if (rawColors && rawColors.trim()) {
      const parsedColors = rawColors
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean);

      if (parsedColors.length > 0) {
        colors = parsedColors;

        if (rawColorImages && rawColorImages.trim()) {
          const parsedImgs = rawColorImages
            .split(/[\n,]+/)
            .map((s) => s.trim())
            .filter(Boolean)
            .map((img) => {
              if (
                img.includes('drive.google.com') ||
                (!img.startsWith('http') && img.length >= 20)
              ) {
                return formatGoogleDriveUrl(img);
              }
              return img;
            });

          colorImages = parsedImgs;
          colorMap = {};
          parsedColors.forEach((colorName, cIdx) => {
            if (parsedImgs[cIdx]) {
              colorMap![colorName.toLowerCase()] = parsedImgs[cIdx];
            }
          });
        }
      }
    }

    // 8. Description & Tags & Details
    const description =
      row['description'] ||
      `${name} — curated with guaranteed premium quality and fast nationwide doorstep delivery.`;

    const rawTags = row['tags'] || '';
    const tags = rawTags
      ? rawTags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
      : [];

    let details: string[] = [];
    if (row['details']) {
      details = row['details']
        .split(/[\n;]+/)
        .map((d) => d.trim())
        .filter(Boolean);
    }
    if (details.length === 0) {
      details = getProductCategoryHighlights(name, rawCategory, categoryGroup);
    }

    // 9. Combo role for Combo Builder
    const nameLower = name.toLowerCase();
    const tagsLower = rawTags.toLowerCase();
    let comboRole: 'top' | 'bottom' | 'watch' | undefined = undefined;

    if (categoryGroup === 'watches' || rawCatLower.includes('watch') || nameLower.includes('watch')) {
      comboRole = 'watch';
    } else if (
      rawCatLower.includes('top') ||
      rawCatLower.includes('tee') ||
      rawCatLower.includes('shirt') ||
      tagsLower.includes('top') ||
      tagsLower.includes('shirt') ||
      nameLower.includes('tee') ||
      nameLower.includes('shirt')
    ) {
      comboRole = 'top';
    } else if (
      rawCatLower.includes('bottom') ||
      rawCatLower.includes('cargo') ||
      rawCatLower.includes('pant') ||
      rawCatLower.includes('chino') ||
      rawCatLower.includes('trouser') ||
      rawCatLower.includes('denim') ||
      tagsLower.includes('bottom') ||
      tagsLower.includes('cargo') ||
      nameLower.includes('cargo') ||
      nameLower.includes('pant') ||
      nameLower.includes('chino')
    ) {
      comboRole = 'bottom';
    }

    products.push({
      id,
      name,
      subtitle:
        row['subtitle'] ||
        (rawCategory.trim().toLowerCase() !== name.toLowerCase() ? rawCategory.trim() : undefined) ||
        tags.slice(0, 2).join(' • ') ||
        undefined,
      category: rawCategory.trim() || normalizedCategory,
      categoryGroup,
      price: sellingPrice,
      originalPrice: cutOffPrice,
      discountPercent,
      stock,
      images,
      sizes,
      isFreeSize,
      colors,
      colorImages,
      colorMap,
      description,
      details,
      tags,
      isNewArrival: index < 4 || tagsLower.includes('new'),
      featured: index < 6,
      comboRole,
      rowIndex: index,
    });
  });

  return products;
}

/**
 * Comparator for sorting products with newest first:
 * - Sorts by incrementing ID in descending order (higher ID = newer product)
 * - If IDs are not purely numeric or are missing/equal, falls back to the row's position in the sheet (later rows = newer)
 */
export function compareProductsNewestFirst(a: Product, b: Product): number {
  const cleanA = String(a.id || '').trim();
  const cleanB = String(b.id || '').trim();

  // Try extracting numeric ID values
  const matchA = cleanA.match(/\d+(\.\d+)?/g);
  const matchB = cleanB.match(/\d+(\.\d+)?/g);

  const numA = matchA ? parseFloat(matchA.join('')) : NaN;
  const numB = matchB ? parseFloat(matchB.join('')) : NaN;

  const validA = !isNaN(numA);
  const validB = !isNaN(numB);

  // If both have valid numeric IDs and they differ, sort by ID descending (highest ID first)
  if (validA && validB && numA !== numB) {
    return numB - numA;
  }

  // If IDs are not purely numeric or missing/equal, fall back to row position in the sheet
  const rowA = a.rowIndex !== undefined ? a.rowIndex : -1;
  const rowB = b.rowIndex !== undefined ? b.rowIndex : -1;

  if (rowA !== -1 && rowB !== -1 && rowA !== rowB) {
    return rowB - rowA; // Higher row index = later row in the sheet = newer
  }

  // Fallback to numeric-aware string comparison descending
  return cleanB.localeCompare(cleanA, undefined, { numeric: true });
}

/**
 * Fetches and parses a published Google Sheet CSV URL.
 */
export async function fetchProductsFromSheetUrl(
  url: string = PUBLISHED_SHEET_CSV_URL
): Promise<Product[]> {
  const normalizedUrl = normalizeGoogleSheetCsvUrl(url);
  if (!normalizedUrl) {
    throw new Error('Please provide a valid Google Sheet CSV URL.');
  }

  const response = await fetch(normalizedUrl);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch Google Sheet CSV (Status ${response.status}: ${response.statusText}). Make sure the sheet is published to the web as CSV.`
    );
  }

  const csvText = await response.text();
  if (!csvText || !csvText.trim()) {
    throw new Error('The published Google Sheet returned an empty CSV.');
  }

  const parsedRows = parseCSVText(csvText);
  if (parsedRows.length === 0) {
    throw new Error(
      'No data rows found in the CSV. Verify headers: ID, NAME, CATEGORY, PRICE, ORIGINAL PRICE, SIZES, STOCK, IMAGE, DESCRIPTION, TAGS.'
    );
  }

  const products = mapRowsToProducts(parsedRows);
  if (products.length === 0) {
    throw new Error('Could not parse any products from the CSV rows.');
  }

  return products;
}
