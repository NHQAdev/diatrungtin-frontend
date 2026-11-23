import { Link } from 'react-router-dom';
import { ArrowLink } from '../components/ui/ArrowLink';
import { Container } from '../components/ui/Container';
import { SectionTitle } from '../components/ui/SectionTitle';
import { CATEGORY, COLLECTION, PAGE, categoryUrl, collectionUrl, pageUrl } from '../config/merchandising';
import { FeatureImage, ProductTabsSection } from '../features/home/ProductTabsSection';

// Home page, following the approved Figma frame (long version).
// Editorial photos in /public/images are TEMPORARY low-resolution exports from the design file.

const DISCOVER = [
  { label: 'Trang sức', to: categoryUrl(CATEGORY.jewelry), image: '/images/product-bracelet.webp' },
  { label: 'Nhang trầm', to: categoryUrl(CATEGORY.incense), image: '/images/product-incense-stick.webp' },
  { label: 'Dành cho trẻ em', to: collectionUrl(COLLECTION.kids), image: '/images/kids-bracelet.webp' },
  { label: 'Quà tặng', to: collectionUrl(COLLECTION.gifts), image: '/images/gift-box.webp' },
];

const BANNERS = [
  {
    title: 'Dành cho trẻ em',
    text: 'Xem sản phẩm và hướng dẫn chọn kích thước.',
    link: { label: 'Khám phá bộ sưu tập', to: collectionUrl(COLLECTION.kids) },
    image: '/images/kids-bracelet.webp',
    tone: 'muted' as const,
  },
  {
    title: 'Quà tặng từ trầm',
    text: 'Một món quà, một lời quan tâm.',
    link: { label: 'Khám phá quà tặng', to: collectionUrl(COLLECTION.gifts) },
    image: '/images/gift-box.webp',
    tone: 'brand' as const,
  },
  {
    title: 'Câu chuyện\nĐịa Trung Tín',
    text: 'Trang sức, nhang trầm và những món quà cho nhịp sống mỗi ngày.',
    link: { label: 'Tìm hiểu thương hiệu', to: pageUrl(PAGE.story) },
    image: '/images/story-wood-grain.webp',
    tone: 'muted' as const,
  },
];

const GUIDES = [
  { title: 'Cách đo kích thước vòng tay', to: pageUrl(PAGE.sizeGuide), image: '/images/guide-wrist-measure.webp' },
  { title: 'Chọn nhang cây hay nhang nụ?', to: pageUrl(PAGE.chooseIncense), image: '/images/guide-incense.webp' },
  { title: 'Bảo quản vòng trầm', to: pageUrl(PAGE.care), image: '/images/bracelet-stone-block.webp' },
];

export function HomePage() {
  return (
    <>
      {/* ---------- Hero (full width: photo 64% | red panel 36%) ---------- */}
      <section className="bg-surface md:mt-6" aria-labelledby="hero-title">
        <div className="grid overflow-hidden md:h-[min(895px,62vw)] md:grid-cols-[64fr_36fr] md:grid-rows-[100%]">
          <div className="relative aspect-[10/9] md:aspect-auto">
            <img src="/images/hero-model.webp" alt="Người đeo vòng tay và vòng cổ trầm hương" className="absolute inset-0 h-full w-full bg-surface-muted object-cover" />
          </div>
          <div className="flex min-h-0 flex-col overflow-hidden bg-brand text-on-brand">
            <div className="px-6 pb-6 pt-8 md:pb-10 md:pl-14 md:pr-6 md:pt-[72px]">
              <h1 id="hero-title" className="font-serif text-[36px] leading-[1.1] md:text-[clamp(48px,5vw,72px)] md:leading-[1.08]">
                Trầm trong
                <br />
                phong cách
                <br />
                của bạn.
              </h1>
              <p className="mt-4 text-[15px] opacity-90 md:mt-6 md:text-xl">Khám phá vòng tay và vòng cổ.</p>
              <Link to={categoryUrl(CATEGORY.jewelry)} className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-sm bg-surface px-7 text-[15px] font-semibold text-brand hover:bg-on-brand md:mt-8 md:h-16 md:w-auto md:text-xl">
                Khám phá trang sức
              </Link>
            </div>
            <div className="relative aspect-[16/10] md:aspect-auto md:min-h-0 md:flex-1">
              <img src="/images/bracelet-stone-wide.webp" alt="" className="absolute inset-0 h-full w-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      <Container>
        {/* ---------- Bạn đang tìm gì? ---------- */}
        <section className="mt-12 md:mt-16" aria-labelledby="discover-title">
          <SectionTitle id="discover-title">Bạn đang tìm gì?</SectionTitle>
          <ul className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-6">
            {DISCOVER.map((item) => (
              <li key={item.label}>
                <Link to={item.to} className="group block overflow-hidden">
                  <img src={item.image} alt="" loading="lazy" className="aspect-[4/3] w-full bg-surface-muted object-cover transition duration-500 group-hover:scale-[1.03] md:aspect-[16/9]" />
                  <span className="block bg-ink px-4 py-3 text-sm font-medium text-on-brand md:px-5 md:py-4 md:text-xl">
                    {item.label} <span aria-hidden="true">→</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* ---------- Trang sức trầm hương ---------- */}
        <ProductTabsSection
          title="Trang sức trầm hương"
          allLink={categoryUrl(CATEGORY.jewelry)}
          tabs={[
            { label: 'Vòng tay', categorySlug: CATEGORY.bracelets },
            { label: 'Vòng cổ', categorySlug: CATEGORY.necklaces },
          ]}
          featureSide="right"
          feature={<FeatureImage src="/images/wear-your-way.webp" title={'Đeo theo\ncách của bạn.'} to={categoryUrl(CATEGORY.jewelry)} />}
        />

        {/* ---------- Hương cho không gian ---------- */}
        <ProductTabsSection
          title="Hương cho không gian"
          allLink={categoryUrl(CATEGORY.incense)}
          tabs={[
            { label: 'Nhang cây', categorySlug: CATEGORY.incenseSticks },
            { label: 'Nhang nụ', categorySlug: CATEGORY.incenseCones },
          ]}
          featureSide="left"
          feature={<FeatureImage src="/images/space-incense.webp" title={'Hương cho\nkhông gian'} to={categoryUrl(CATEGORY.incense)} />}
        />

        {/* ---------- Banners ---------- */}
        <div className="mt-14 space-y-5 md:mt-[72px] md:space-y-8">
          {BANNERS.map((banner) => (
            <section key={banner.title} className={`grid overflow-hidden md:min-h-[390px] md:grid-cols-[1.18fr_1fr] ${banner.tone === 'brand' ? 'bg-brand text-on-brand' : 'bg-surface-muted text-ink'}`}>
              <div className="relative aspect-[16/9] md:aspect-auto">
                <img src={banner.image} alt="" loading="lazy" className="absolute inset-0 h-full w-full bg-surface-muted object-cover" />
              </div>
              <div className="flex flex-col justify-center px-6 py-8 md:px-10">
                <h2 className={`whitespace-pre-line font-serif text-[28px] leading-tight md:text-[48px] ${banner.tone === 'brand' ? 'text-on-brand' : 'text-brand'}`}>{banner.title}</h2>
                <p className="mt-3 max-w-lg text-[15px] leading-6 opacity-90 md:mt-4 md:text-xl md:leading-8">{banner.text}</p>
                <ArrowLink to={banner.link.to} tone={banner.tone === 'brand' ? 'light' : 'brand'} className="mt-5 self-start md:mt-8">
                  {banner.link.label}
                </ArrowLink>
              </div>
            </section>
          ))}
        </div>

        {/* ---------- Chọn và chăm trầm ---------- */}
        <section className="mt-14 md:mt-[72px]" aria-labelledby="guides-title">
          <SectionTitle id="guides-title">Chọn và chăm trầm</SectionTitle>
          <ul className="grid gap-8 md:grid-cols-3 md:gap-6">
            {GUIDES.map((guide) => (
              <li key={guide.title} className="flex flex-col">
                <img src={guide.image} alt="" loading="lazy" className="aspect-[16/9] w-full bg-surface-muted object-cover" />
                <h3 className="mt-3 text-base font-semibold text-ink md:mt-4 md:text-[22px]">{guide.title}</h3>
                <ArrowLink to={guide.to} className="mt-3 self-start md:mt-10">Xem hướng dẫn</ArrowLink>
              </li>
            ))}
          </ul>
        </section>
      </Container>
    </>
  );
}
