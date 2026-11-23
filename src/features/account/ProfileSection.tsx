import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { TextField } from '../../components/ui/TextField';
import { api, ApiError } from '../../lib/api';
import type { Customer } from '../../types/api';
import { FormAlert } from '../auth/AuthSplit';
import { PHONE_PATTERN, useSetCurrentCustomer } from '../auth/session';
import { AccountCard, saveButton } from './AccountCard';

export function ProfileSection({ customer }: { customer: Customer }) {
  const setCustomer = useSetCurrentCustomer();
  const [fullName, setFullName] = useState(customer.fullName);
  const [phone, setPhone] = useState(customer.phone);
  const [errors, setErrors] = useState<{ fullName?: string; phone?: string }>({});
  const [notice, setNotice] = useState<{ tone: 'error' | 'success'; message: string } | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (saving) return;
    setNotice(null);
    const cleanPhone = phone.replace(/[\s.-]/g, '');
    const found: typeof errors = {};
    if (!fullName.trim()) found.fullName = 'Vui lòng nhập họ và tên.';
    if (!PHONE_PATTERN.test(cleanPhone)) found.phone = 'Số điện thoại gồm 10 số, ví dụ: 0912345678.';
    setErrors(found);
    if (Object.keys(found).length) return;

    setSaving(true);
    try {
      const result = await api<{ customer: Customer }>('/api/account/profile', { method: 'PATCH', body: { fullName: fullName.trim(), phone: cleanPhone } });
      await setCustomer(result.customer);
      setPhone(result.customer.phone);
      setNotice({ tone: 'success', message: 'Đã lưu thay đổi.' });
    } catch (error) {
      if (error instanceof ApiError && Object.keys(error.fieldErrors()).length) setErrors(error.fieldErrors());
      else setNotice({ tone: 'error', message: error instanceof ApiError ? error.message : 'Có lỗi xảy ra. Vui lòng thử lại.' });
    } finally {
      setSaving(false);
    }
  }

  const emailBadge = customer.emailVerified ? (
    <span className="rounded-full bg-[#e3ece4] px-3 py-1 text-[13px] font-semibold text-[#2f5a3d]">Đã xác minh</span>
  ) : (
    <Link to="/xac-minh-email?next=%2Ftai-khoan" className="rounded-full bg-brand/10 px-3 py-1 text-[13px] font-semibold text-brand hover:bg-brand/15">
      Chưa xác minh · Xác minh ngay
    </Link>
  );

  return (
    <AccountCard title="Hồ sơ cá nhân" description="Cập nhật tên và số điện thoại liên hệ.">
      <form noValidate onSubmit={handleSubmit} className="space-y-5">
        {notice && <FormAlert tone={notice.tone} message={notice.message} />}
        <div className="grid gap-5 md:grid-cols-2 md:gap-x-6">
          <TextField label="Họ và tên" autoComplete="name" value={fullName} onChange={(event) => setFullName(event.target.value)} error={errors.fullName} />
          <TextField label="Số điện thoại" type="tel" autoComplete="tel" inputMode="tel" placeholder="Nhập số điện thoại" value={phone} onChange={(event) => setPhone(event.target.value)} error={errors.phone} />
          <TextField label="Email" type="email" value={customer.email} readOnly labelAside={emailBadge} hint={customer.emailVerified ? undefined : 'Xác minh email để nhận thông báo đơn hàng chắc chắn tới đúng hộp thư.'} />
        </div>
        <button type="submit" disabled={saving} className={saveButton}>
          {saving ? 'Đang lưu…' : 'Lưu thay đổi'}
        </button>
      </form>
    </AccountCard>
  );
}
