import { type FormEvent, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SearchIcon } from '../ui/icons';

/** Search field → /san-pham?q=… (search ignores accents: "vong tay" finds "Vòng tay"). */
export function SearchBox({ className = '', id }: { className?: string; id: string }) {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [value, setValue] = useState(params.get('q') ?? '');

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const q = value.trim();
    navigate(q ? `/san-pham?q=${encodeURIComponent(q)}` : '/san-pham');
  };

  return (
    <form role="search" onSubmit={submit} className={`relative ${className}`}>
      <label htmlFor={id} className="sr-only">Tìm sản phẩm</label>
      <SearchIcon size={20} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink" />
      <input
        id={id}
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Tìm sản phẩm..."
        className="h-11 w-full rounded-md border border-line bg-surface pl-11 pr-3 text-[15px] md:text-lg text-ink placeholder:text-ink-muted focus:border-brand focus:outline-none"
      />
    </form>
  );
}
