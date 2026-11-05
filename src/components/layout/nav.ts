import { CATEGORY, COLLECTION, PAGE, categoryUrl, collectionUrl, pageUrl } from '../../config/merchandising';

// Main menu from the design. Items with `categorySlug` show that category's sub-categories
// (loaded from the API) in a dropdown.
export interface NavItem {
  label: string;
  to: string;
  categorySlug?: string;
}

export const MAIN_NAV: NavItem[] = [
  { label: 'Trang sức', to: categoryUrl(CATEGORY.jewelry), categorySlug: CATEGORY.jewelry },
  { label: 'Nhang trầm', to: categoryUrl(CATEGORY.incense), categorySlug: CATEGORY.incense },
  { label: 'Dành cho trẻ em', to: collectionUrl(COLLECTION.kids) },
  { label: 'Quà tặng', to: collectionUrl(COLLECTION.gifts) },
  { label: 'Câu chuyện', to: pageUrl(PAGE.story) },
];
