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
    // "SIZES is comma separated: split into an array. 'Free size' means a single option, no size selector needed."
    const rawSizes = row['sizes'] || '';
    let sizes: string[] = [];
    let isFreeSize = false;

    if (rawSizes.trim()) {
      const splitSizes = rawSizes
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      if (splitSizes.length === 0) {
        sizes = ['Free Size'];
        isFreeSize = true;
      } else if (
        splitSizes.length === 1 &&
        splitSizes[0].toLowerCase().includes('free size')
      ) {
        sizes = ['Free Size'];
        isFreeSize = true;
      } else if (splitSizes.every((s) => s.toLowerCase().includes('free size'))) {
        sizes = ['Free Size'];
        isFreeSize = true;
      } else {
        sizes = splitSizes;
        isFreeSize = false;
      }
    } else {
      // Default to Free Size if not provided
      sizes = ['Free Size'];
      isFreeSize = true;
    }

    // 6. Image rule:
    // IMAGE holds direct link (e.g. i.ibb.co) or Google Drive link
    const rawImage = row['image'] || '';
    let formattedImage = rawImage.trim();
    if (
      formattedImage.includes('drive.google.com') ||
      (!formattedImage.startsWith('http') && formattedImage.length >= 20)
    ) {
      formattedImage = formatGoogleDriveUrl(formattedImage);
    }
    const images = formattedImage ? [formattedImage] : [];

    // 7. Description & Tags & Details
    const description =
      row['description'] ||
      `${name} — curated directly from our Kota warehouse with guaranteed quality and fast doorstep delivery.`;

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
      if (categoryGroup === 'watches') {
        details.push('High-precision quartz mechanism & exhibition design');
        details.push('Scratch-resistant mineral crystal glass & solid steel bezel');
        details.push('Adjustable comfortable strap (Free Size)');
        details.push('Ships from Kota with premium protective gift box');
        details.push('Cash on Delivery available across India');
      } else {
        details.push('Set of premium breathable cotton clothing items');
        details.push('Pre-shrunk anti-fade color treatment');
        details.push('Modern streetwear relaxed drape');
        details.push('Fast express dispatch from Kota, Rajasthan');
        details.push('Cash on Delivery available with fast doorstep receipt');
      }
    }

    // 8. Combo role for Combo Builder
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
      description,
      details,
      tags,
      isNewArrival: index < 4 || tagsLower.includes('new'),
      featured: index < 6,
      comboRole,
    });
  });

  return products;
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
