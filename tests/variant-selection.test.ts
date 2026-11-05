// Run in the browser-free test environment (node:test). Pure logic only.
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { ProductVariant } from '../src/types/api.ts';
import { clampChoices, findVariant, initialSelection, optionGroups, selectValue, unitPrice } from '../src/features/product/variant-selection.ts';

const v = (id: string, options: ProductVariant['options'], extra: Partial<ProductVariant> = {}): ProductVariant => ({
  id,
  sku: id.toUpperCase(),
  name: id,
  options,
  price: 500_000,
  retailPrice: 500_000,
  inStock: true,
  availableQuantity: 5,
  maxExtraBeads: 0,
  extraBeadPrice: null,
  ...extra,
});

describe('variant selection', () => {
  const bracelets = [
    v('8', { bead_size_mm: 8 }, { inStock: false, availableQuantity: 0 }),
    v('10', { bead_size_mm: 10 }, { price: 700_000, maxExtraBeads: 3, extraBeadPrice: 30_000 }),
    v('12', { bead_size_mm: 12 }),
  ];

  it('starts on the first variant in stock', () => {
    assert.deepEqual(initialSelection(bracelets), { bead_size_mm: '10' });
  });

  it('builds one row per option with Vietnamese labels, numeric order and stock flags', () => {
    const [group] = optionGroups(bracelets, { bead_size_mm: '10' });
    assert.equal(group!.label, 'Đường kính hạt');
    assert.deepEqual(group!.values.map((x) => [x.label, x.exists, x.inStock]), [
      ['8 mm', true, false],
      ['10 mm', true, true],
      ['12 mm', true, true],
    ]);
  });

  it('finds the exact variant and prices extra beads', () => {
    const chosen = findVariant(bracelets, { bead_size_mm: '10' })!;
    assert.equal(chosen.id, '10');
    assert.equal(unitPrice(chosen, 2), 760_000);
  });

  it('handles two option keys and jumps to a valid combination', () => {
    const variants = [
      v('a', { bead_size_mm: 8, pack: 'Hộp' }),
      v('b', { bead_size_mm: 10, pack: 'Túi' }),
      v('c', { bead_size_mm: 10, pack: 'Hộp' }, { inStock: false }),
    ];
    // 8 mm only exists in "Hộp": with 8 mm chosen, "Túi" is shown as not existing.
    const groups = optionGroups(variants, { bead_size_mm: '8', pack: 'Hộp' });
    assert.deepEqual(groups[1]!.values.map((x) => [x.value, x.exists]), [['Hộp', true], ['Túi', false]]);
    // Choosing "Túi" moves the bead size to 10 mm (the only variant with "Túi").
    assert.deepEqual(selectValue(variants, { bead_size_mm: '8', pack: 'Hộp' }, 'pack', 'Túi'), { bead_size_mm: '10', pack: 'Túi' });
  });

  it('uses variant names when variants have no options', () => {
    const variants = [v('Hộp 20 nụ', {}), v('Hộp 50 nụ', {})];
    const [group] = optionGroups(variants, initialSelection(variants));
    assert.equal(group!.label, 'Phiên bản');
    assert.deepEqual(group!.values.map((x) => x.label), ['Hộp 20 nụ', 'Hộp 50 nụ']);
  });

  it('keeps extra beads and quantity within the variant limits', () => {
    assert.deepEqual(clampChoices(bracelets[1], 9, 99), { extraBeads: 3, quantity: 5 });
    assert.deepEqual(clampChoices(bracelets[2], 2, 0), { extraBeads: 0, quantity: 1 });
  });
});
