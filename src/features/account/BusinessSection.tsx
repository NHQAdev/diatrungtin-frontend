import { useState, type FormEvent } from 'react';
import { TextField } from '../../components/ui/TextField';
import { api, ApiError } from '../../lib/api';
import type { Customer } from '../../types/api';
import { FormAlert } from '../auth/AuthSplit';
import { useSetCurrentCustomer } from '../auth/session';
import { AccountCard, saveButton } from './AccountCard';
import { BUSINESS_STATUS_LABEL } from './labels';

type Fields = { companyName: string; taxCode: string; invoiceAddress: string };

const STATUS_STYLE = {
  pending: 'bg-[#f3e9d2] text-[#7a5a14]',
  approved: 'bg-[#e3ece4] text-[#2f5a3d]',
  rejected: 'bg-brand/10 text-brand',
} as const;

/**
 * Invoice details and business price status (D8, D9). A personal account can add them here and
 * become a business account; changing the company or tax code sends it back for review.
 */
export function BusinessSection({ customer }: { customer: Customer }) {
  const setCustomer = useSetCurrentCustomer();
  const isBusiness = customer.accountType === 'business';
  const [open, setOpen] = useState(isBusiness);
  const [values, setValues] = useState<Fields>({
    companyName: customer.companyName ?? '',
    taxCode: customer.taxCode ?? '',
    invoiceAddress: customer.invoiceAddress ?? '',
  });
  const [errors, setErrors] = useState<Partial<Fields>>({});
  const [notice, setNotice] = useState<{ tone: 'error' | 'success'; message: string } | null>(null);
  const [saving, setSaving] = useState(false);

  const willNeedReview = isBusiness && (values.companyName.trim() !== customer.companyName || values.taxCode.trim() !== customer.taxCode);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (saving) return;
    setNotice(null);
    const found: Partial<Fields> = {};
    if (!values.companyName.trim()) found.companyName = 'Vui lòng nhập tên công ty.';
    if (!/^[0-9]{10}(-[0-9]{3})?$/.test(values.taxCode.trim())) found.taxCode = 'Mã số thuế gồm 10 số (hoặc 10 số-3 số với chi nhánh).';
    if (!values.invoiceAddress.trim()) found.invoiceAddress = 'Vui lòng nhập địa chỉ xuất hóa đơn.';
    setErrors(found);
    if (Object.keys(found).length) return;

    setSaving(true);
    try {
      const body = { companyName: values.companyName.trim(), taxCode: values.taxCode.trim(), invoiceAddress: values.invoiceAddress.trim() };
      const result = await api<{ customer: Customer }>('/api/account/business', { method: 'PUT', body });
      await setCustomer(result.customer);
      setNotice({
        tone: 'success',
        message: result.customer.businessStatus === 'pending' ? 'Đã lưu. Cửa hàng sẽ kiểm tra mã số thuế trước khi áp dụng giá doanh nghiệp.' : 'Đã lưu thông tin xuất hóa đơn.',
      });
    } catch (error) {
      if (error instanceof ApiError && Object.keys(error.fieldErrors()).length) setErrors(error.fieldErrors());
      else setNotice({ tone: 'error', message: error instanceof ApiError ? error.message : 'Có lỗi xảy ra. Vui lòng thử lại.' });
    } finally {
      setSaving(false);
    }
  }

  const field = (name: keyof Fields) => ({
    value: values[name],
    error: errors[name],
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => setValues((current) => ({ ...current, [name]: event.target.value })),
  });

  const status = customer.businessStatus;
  return (
    <AccountCard
      title="Thông tin doanh nghiệp"
      description={isBusiness ? 'Dùng để xuất hóa đơn và áp dụng giá dành cho doanh nghiệp.' : 'Mua hàng cho công ty? Thêm thông tin để xuất hóa đơn.'}
      aside={status ? <span className={`rounded-full px-3 py-1 text-[13px] font-semibold ${STATUS_STYLE[status]}`}>{BUSINESS_STATUS_LABEL[status]}</span> : undefined}
    >
      {!open ? (
        <div className="space-y-4 text-[15px] leading-6 text-ink-muted">
          <p>Sau khi cửa hàng kiểm tra mã số thuế, tài khoản sẽ được áp dụng giá dành cho doanh nghiệp. Trong lúc chờ, bạn vẫn mua với giá bán lẻ.</p>
          <button type="button" onClick={() => setOpen(true)} className="h-12 rounded-md border border-brand px-6 font-semibold text-brand hover:bg-brand/5">
            Thêm thông tin doanh nghiệp
          </button>
        </div>
      ) : (
        <form noValidate onSubmit={handleSubmit} className="space-y-5">
          {notice && <FormAlert tone={notice.tone} message={notice.message} />}
          {status === 'pending' && !notice && <p className="text-[15px] text-ink-muted">Cửa hàng đang kiểm tra mã số thuế. Trong lúc chờ, đơn hàng tính theo giá bán lẻ.</p>}
          {status === 'rejected' && !notice && <p className="text-[15px] text-brand">Thông tin chưa được duyệt. Vui lòng kiểm tra lại tên công ty và mã số thuế, hoặc liên hệ cửa hàng.</p>}
          <div className="grid gap-5 md:grid-cols-2 md:gap-x-6">
            <TextField label="Tên công ty" autoComplete="organization" placeholder="Nhập tên công ty" {...field('companyName')} />
            <TextField label="Mã số thuế" inputMode="numeric" placeholder="Ví dụ: 0312345678" {...field('taxCode')} />
            <TextField className="md:col-span-2" label="Địa chỉ xuất hóa đơn" placeholder="Nhập địa chỉ trên hóa đơn" {...field('invoiceAddress')} />
          </div>
          {willNeedReview && status === 'approved' && (
            <p className="text-sm font-medium text-brand">Đổi tên công ty hoặc mã số thuế sẽ cần cửa hàng duyệt lại; trong lúc chờ, đơn hàng tính theo giá bán lẻ.</p>
          )}
          <div className="flex flex-col gap-3 md:flex-row">
            <button type="submit" disabled={saving} className={saveButton}>
              {saving ? 'Đang lưu…' : isBusiness ? 'Lưu thông tin' : 'Gửi để cửa hàng duyệt'}
            </button>
            {!isBusiness && (
              <button type="button" onClick={() => setOpen(false)} className="h-12 px-4 font-semibold text-ink-muted hover:text-brand">
                Hủy
              </button>
            )}
          </div>
        </form>
      )}
    </AccountCard>
  );
}
