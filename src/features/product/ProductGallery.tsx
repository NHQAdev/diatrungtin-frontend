import { useRef, useState } from 'react';
import { ImagePlaceholder } from '../../components/ui/ImagePlaceholder';
import { CloseIcon, ZoomIcon } from '../../components/ui/icons';
import type { ProductDetail } from '../../types/api';

/** Main photo + thumbnails; the magnifier opens the photo full size in a dialog. */
export function ProductGallery({ images, productName }: { images: ProductDetail['images']; productName: string }) {
  const [index, setIndex] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const current = images[index];

  if (!current) {
    return (
      <div className="aspect-square">
        <ImagePlaceholder label="Sản phẩm chưa có ảnh" />
      </div>
    );
  }

  return (
    <div>
      <div className="relative aspect-square overflow-hidden bg-surface-muted md:aspect-[700/542]">
        <img src={current.url} alt={current.alt ?? productName} className="h-full w-full bg-surface-muted object-cover" />
        <button
          type="button"
          onClick={() => dialog.current?.showModal()}
          className="absolute right-3 top-3 grid h-11 w-11 md:right-5 md:top-5 md:h-12 md:w-12 place-items-center rounded-full bg-surface/90 text-ink shadow hover:bg-surface"
          aria-label="Phóng to ảnh"
        >
          <ZoomIcon />
        </button>
      </div>
      {images.length > 1 && (
        <ul className="mt-3 grid grid-cols-4 gap-3 md:mt-5 md:gap-6" aria-label="Ảnh sản phẩm">
          {images.map((image, i) => (
            <li key={image.id}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Xem ảnh ${i + 1}`}
                aria-current={i === index}
                className={`block aspect-square w-full overflow-hidden border-2 ${i === index ? 'border-brand' : 'border-transparent hover:border-line'}`}
              >
                <img src={image.url} alt="" loading="lazy" className="h-full w-full bg-surface-muted object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <dialog ref={dialog} className="m-auto max-h-[92vh] max-w-[92vw] bg-transparent p-0 backdrop:bg-ink/80" aria-label={productName} onClick={(event) => event.target === dialog.current && dialog.current?.close()}>
        <img src={current.url} alt={current.alt ?? productName} className="max-h-[88vh] max-w-[92vw] object-contain" />
        <button type="button" onClick={() => dialog.current?.close()} className="absolute right-2 top-2 grid h-11 w-11 place-items-center rounded-full bg-surface text-ink" aria-label="Đóng">
          <CloseIcon />
        </button>
      </dialog>
    </div>
  );
}
