import type { ProductVariant } from '../../types/api';

// Pure helpers for choosing a variant on the product page. No React here, so it is easy to test.
//
// Variants describe themselves with `options`, e.g. { bead_size_mm: 8 }. Each option key becomes a
// row of buttons ("Đường kính hạt: 8 mm · 10 mm · 12 mm"). Products whose variants have no options
// get a single row with the variant names.

export type Selection = Record<string, string>;

export interface OptionValue {
  value: string;
  label: string;
  /** Some variant has this value together with the other current choices. */
  exists: boolean;
  /** …and that variant can be bought right now. */
  inStock: boolean;
}

export interface OptionGroup {
  key: string;
  label: string;
  values: OptionValue[];
}

const NAME_KEY = '__variant';

/** Vietnamese labels for known option keys. Unknown keys fall back to the key itself. */
const OPTION_LABELS: Record<string, { label: string; format?: (value: string) => string }> = {
  bead_size_mm: { label: 'Đường kính hạt', format: (v) => `${v} mm` },
  bead_count: { label: 'Số hạt', format: (v) => `${v} hạt` },
  length_cm: { label: 'Chiều dài', format: (v) => `${v} cm` },
  pack: { label: 'Quy cách' },
  size: { label: 'Kích thước' },
};

export function optionLabel(key: string) {
  return key === NAME_KEY ? 'Phiên bản' : (OPTION_LABELS[key]?.label ?? key);
}

export function formatOptionValue(key: string, value: string) {
  return OPTION_LABELS[key]?.format?.(value) ?? value;
}

/** Options of a variant as strings; variants without options are identified by their name. */
export function optionsOf(variant: ProductVariant): Selection {
  const entries = Object.entries(variant.options ?? {});
  if (entries.length === 0) return { [NAME_KEY]: variant.name };
  return Object.fromEntries(entries.map(([key, value]) => [key, String(value)]));
}

function keysOf(variants: ProductVariant[]): string[] {
  const keys: string[] = [];
  for (const variant of variants) for (const key of Object.keys(optionsOf(variant))) if (!keys.includes(key)) keys.push(key);
  return keys;
}

function matches(variant: ProductVariant, selection: Selection, ignoreKey?: string) {
  const options = optionsOf(variant);
  return Object.entries(selection).every(([key, value]) => key === ignoreKey || options[key] === value);
}

/** The variant exactly matching every selected option, or undefined. */
export function findVariant(variants: ProductVariant[], selection: Selection): ProductVariant | undefined {
  const keys = keysOf(variants);
  if (keys.some((key) => selection[key] === undefined)) return undefined;
  return variants.find((variant) => matches(variant, selection));
}

/** Start with the first variant that is in stock (or simply the first one). */
export function initialSelection(variants: ProductVariant[]): Selection {
  const first = variants.find((variant) => variant.inStock) ?? variants[0];
  return first ? optionsOf(first) : {};
}

function sortValues(values: string[]) {
  return [...values].sort((a, b) => {
    const na = Number(a);
    const nb = Number(b);
    return Number.isFinite(na) && Number.isFinite(nb) ? na - nb : a.localeCompare(b, 'vi');
  });
}

/** Rows of buttons with availability computed against the other current choices. */
export function optionGroups(variants: ProductVariant[], selection: Selection): OptionGroup[] {
  return keysOf(variants).map((key) => {
    const values = sortValues([...new Set(variants.map((variant) => optionsOf(variant)[key]).filter((v): v is string => v !== undefined))]);
    return {
      key,
      label: optionLabel(key),
      values: values.map((value) => {
        const candidates = variants.filter((variant) => optionsOf(variant)[key] === value && matches(variant, selection, key));
        return {
          value,
          label: key === NAME_KEY ? value : formatOptionValue(key, value),
          exists: candidates.length > 0,
          inStock: candidates.some((variant) => variant.inStock),
        };
      }),
    };
  });
}

/**
 * Choosing a value. If the new value does not exist together with the other current choices,
 * switch the other options to the closest variant that has it (preferring one in stock).
 */
export function selectValue(variants: ProductVariant[], selection: Selection, key: string, value: string): Selection {
  const next = { ...selection, [key]: value };
  if (findVariant(variants, next)) return next;
  const withValue = variants.filter((variant) => optionsOf(variant)[key] === value);
  const best = withValue.find((variant) => variant.inStock) ?? withValue[0];
  return best ? optionsOf(best) : next;
}

/** Price of one unit including extra beads. */
export function unitPrice(variant: ProductVariant, extraBeads: number) {
  return variant.price + extraBeads * (variant.extraBeadPrice ?? 0);
}

/** Keep extra beads and quantity inside what the chosen variant allows. */
export function clampChoices(variant: ProductVariant | undefined, extraBeads: number, quantity: number) {
  const maxBeads = variant?.maxExtraBeads ?? 0;
  const maxQuantity = Math.max(1, variant?.availableQuantity ?? 1);
  return {
    extraBeads: Math.max(0, Math.min(maxBeads, extraBeads)),
    quantity: Math.max(1, Math.min(maxQuantity, quantity)),
  };
}
