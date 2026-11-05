// Slugs used by the home page and menu. They must exist in the admin (categories / collections /
// pages). The demo seed creates all of them.

export const CATEGORY = {
  jewelry: 'trang-suc',
  bracelets: 'vong-tay',
  necklaces: 'vong-co',
  incense: 'nhang-tram',
  incenseSticks: 'nhang-cay',
  incenseCones: 'nhang-nu',
} as const;

export const COLLECTION = {
  kids: 'danh-cho-tre-em',
  gifts: 'qua-tang',
} as const;

export const PAGE = {
  story: 'gioi-thieu',
  howToBuy: 'huong-dan-mua-hang',
  shipping: 'chinh-sach-giao-hang',
  returns: 'chinh-sach-doi-tra',
  privacy: 'chinh-sach-bao-mat',
  sizeGuide: 'huong-dan-do-size',
  care: 'su-dung-bao-quan',
  chooseIncense: 'chon-nhang-cay-hay-nhang-nu',
} as const;

export const pageUrl = (slug: string) => `/trang/${slug}`;
export const categoryUrl = (slug: string) => `/san-pham?category=${slug}`;
export const collectionUrl = (slug: string) => `/san-pham?collection=${slug}`;
