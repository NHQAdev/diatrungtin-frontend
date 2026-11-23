import { useState, type FormEvent } from 'react';
import { TextField } from '../../components/ui/TextField';
import { api, ApiError } from '../../lib/api';
import { FormAlert } from '../auth/AuthSplit';
import { AccountCard, saveButton } from './AccountCard';

type Fields = { currentPassword: string; newPassword: string; confirmPassword: string };
const EMPTY: Fields = { currentPassword: '', newPassword: '', confirmPassword: '' };

export function PasswordSection() {
  const [values, setValues] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Partial<Fields>>({});
  const [notice, setNotice] = useState<{ tone: 'error' | 'success'; message: string } | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (saving) return;
    setNotice(null);
    const found: Partial<Fields> = {};
    if (!values.currentPassword) found.currentPassword = 'Vui lòng nhập mật khẩu hiện tại.';
    if (values.newPassword.length < 8) found.newPassword = 'Mật khẩu mới cần ít nhất 8 ký tự.';
    else if (values.newPassword.trim() !== values.newPassword) found.newPassword = 'Mật khẩu không được bắt đầu hoặc kết thúc bằng khoảng trắng.';
    if (values.confirmPassword !== values.newPassword) found.confirmPassword = 'Mật khẩu nhập lại không khớp.';
    setErrors(found);
    if (Object.keys(found).length) return;

    setSaving(true);
    try {
      const result = await api<{ message: string }>('/api/account/change-password', { method: 'POST', body: { currentPassword: values.currentPassword, newPassword: values.newPassword } });
      setValues(EMPTY);
      setNotice({ tone: 'success', message: result.message });
    } catch (error) {
      if (error instanceof ApiError) {
        const fields = error.fieldErrors();
        if (Object.keys(fields).length) setErrors(fields);
        else if (error.status === 401 || error.status === 400) setErrors({ currentPassword: error.message });
        else setNotice({ tone: 'error', message: error.message });
      } else setNotice({ tone: 'error', message: 'Có lỗi xảy ra. Vui lòng thử lại.' });
    } finally {
      setSaving(false);
    }
  }

  const field = (name: keyof Fields) => ({
    value: values[name],
    error: errors[name],
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => setValues((current) => ({ ...current, [name]: event.target.value })),
  });

  return (
    <AccountCard title="Đổi mật khẩu" description="Sau khi đổi, các thiết bị khác sẽ bị đăng xuất.">
      <form noValidate onSubmit={handleSubmit} className="max-w-[440px] space-y-5">
        {notice && <FormAlert tone={notice.tone} message={notice.message} />}
        <TextField label="Mật khẩu hiện tại" type="password" autoComplete="current-password" {...field('currentPassword')} />
        <TextField label="Mật khẩu mới" type="password" autoComplete="new-password" hint="Ít nhất 8 ký tự." {...field('newPassword')} />
        <TextField label="Nhập lại mật khẩu mới" type="password" autoComplete="new-password" {...field('confirmPassword')} />
        <button type="submit" disabled={saving} className={saveButton}>
          {saving ? 'Đang lưu…' : 'Đổi mật khẩu'}
        </button>
      </form>
    </AccountCard>
  );
}
