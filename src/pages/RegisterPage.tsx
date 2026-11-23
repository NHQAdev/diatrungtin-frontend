import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { TextField } from '../components/ui/TextField';
import { AuthHeading, AuthSplit, FormAlert, primaryButton } from '../features/auth/AuthSplit';
import { safeNextPath } from '../features/auth/redirect';
import { EMAIL_PATTERN, PHONE_PATTERN, useSetCurrentCustomer } from '../features/auth/session';
import { api, ApiError } from '../lib/api';
import { useCurrentCustomer } from '../lib/queries';
import type { Customer } from '../types/api';

type AccountType = 'personal' | 'business';
const FIELDS = ['fullName', 'email', 'phone', 'password', 'confirmPassword', 'companyName', 'taxCode', 'invoiceAddress'] as const;
type Field = (typeof FIELDS)[number];
type Values = Record<Field, string>;
type Errors = Partial<Record<Field, string>>;

const EMPTY: Values = { fullName: '', email: '', phone: '', password: '', confirmPassword: '', companyName: '', taxCode: '', invoiceAddress: '' };

function validate(values: Values, accountType: AccountType): Errors {
  const errors: Errors = {};
  if (!values.fullName.trim()) errors.fullName = accountType === 'business' ? 'Vui lòng nhập họ tên người liên hệ.' : 'Vui lòng nhập họ và tên.';
  if (!values.email.trim()) errors.email = 'Vui lòng nhập email.';
  else if (!EMAIL_PATTERN.test(values.email.trim())) errors.email = 'Email chưa đúng định dạng, ví dụ: ten@gmail.com.';
  const phone = values.phone.replace(/[\s.-]/g, '');
  if (!phone) errors.phone = 'Vui lòng nhập số điện thoại.';
  else if (!PHONE_PATTERN.test(phone)) errors.phone = 'Số điện thoại gồm 10 số, ví dụ: 0912345678.';
  if (values.password.length < 8) errors.password = 'Mật khẩu cần ít nhất 8 ký tự.';
  else if (values.password.trim() !== values.password) errors.password = 'Mật khẩu không được bắt đầu hoặc kết thúc bằng khoảng trắng.';
  if (!values.confirmPassword) errors.confirmPassword = 'Vui lòng nhập lại mật khẩu.';
  else if (values.confirmPassword !== values.password) errors.confirmPassword = 'Mật khẩu nhập lại không khớp.';
  if (accountType === 'business') {
    if (!values.companyName.trim()) errors.companyName = 'Vui lòng nhập tên công ty.';
    if (!/^[0-9]{10}(-[0-9]{3})?$/.test(values.taxCode.trim())) errors.taxCode = 'Mã số thuế gồm 10 số (hoặc 10 số-3 số với chi nhánh).';
    if (!values.invoiceAddress.trim()) errors.invoiceAddress = 'Vui lòng nhập địa chỉ xuất hóa đơn.';
  }
  return errors;
}

export function RegisterPage() {
  const [searchParams] = useSearchParams();
  const next = safeNextPath(searchParams.get('next'));
  const navigate = useNavigate();
  const setCustomer = useSetCurrentCustomer();
  const { data: customer, isPending: checkingSession } = useCurrentCustomer();

  const [accountType, setAccountType] = useState<AccountType>('personal');
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const focusField = (name: Field) => formRef.current?.querySelector<HTMLInputElement>(`input[name="${name}"]`)?.focus();

  useEffect(() => {
    if (formError) document.getElementById('register-error')?.focus();
  }, [formError]);

  if (!checkingSession && customer && !submitting) return <Navigate to="/tai-khoan" replace />;

  const field = (name: Field) => ({
    name,
    value: values[name],
    error: errors[name],
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => setValues((current) => ({ ...current, [name]: event.target.value })),
  });

  function focusFirstError(found: Errors) {
    const first = FIELDS.find((name) => found[name]);
    if (first) focusField(first);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (submitting) return;
    setFormError(null);
    const found = validate(values, accountType);
    setErrors(found);
    if (Object.keys(found).length > 0) return focusFirstError(found);

    setSubmitting(true);
    try {
      const body = {
        accountType,
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        phone: values.phone.replace(/[\s.-]/g, ''),
        password: values.password,
        ...(accountType === 'business' && { companyName: values.companyName.trim(), taxCode: values.taxCode.trim(), invoiceAddress: values.invoiceAddress.trim() }),
      };
      const result = await api<{ customer: Customer }>('/api/auth/register', { method: 'POST', body });
      await setCustomer(result.customer);
      navigate(`/xac-minh-email${next !== '/' ? `?next=${encodeURIComponent(next)}` : ''}`, { replace: true });
    } catch (error) {
      setSubmitting(false);
      if (error instanceof ApiError) {
        const fields = error.fieldErrors() as Errors;
        if (Object.keys(fields).length > 0) {
          setErrors(fields);
          return focusFirstError(fields);
        }
        if (error.status === 409) {
          setErrors({ email: error.message });
          return focusField('email');
        }
        setFormError(error.message);
      } else {
        setFormError('Có lỗi xảy ra. Vui lòng thử lại.');
      }
    }
  }

  return (
    <AuthSplit>
      <title>Đăng ký | Trầm Hương Địa Trung Tín</title>
      <meta name="robots" content="noindex" />

      <AuthHeading eyebrow="Tài khoản" title="Đăng ký">
        Tạo tài khoản để theo dõi đơn hàng.
      </AuthHeading>

      <form ref={formRef} noValidate onSubmit={handleSubmit} className="mt-7 space-y-5">
        {formError && <FormAlert id="register-error" message={formError} />}

        <fieldset>
          <legend className="text-[15px] font-semibold text-ink">Loại tài khoản</legend>
          <div className="mt-2 grid grid-cols-2 gap-1 rounded-md border border-line bg-surface p-1">
            {(
              [
                ['personal', 'Cá nhân'],
                ['business', 'Doanh nghiệp'],
              ] as const
            ).map(([value, label]) => (
              <label
                key={value}
                className={`flex h-10 cursor-pointer items-center justify-center rounded text-[15px] font-semibold transition has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-brand ${
                  accountType === value ? 'bg-brand text-on-brand' : 'text-ink hover:text-brand'
                }`}
              >
                <input type="radio" name="accountType" value={value} checked={accountType === value} onChange={() => setAccountType(value)} className="sr-only" />
                {label}
              </label>
            ))}
          </div>
        </fieldset>

        <TextField label={accountType === 'business' ? 'Họ và tên người liên hệ' : 'Họ và tên'} autoComplete="name" placeholder="Nhập họ và tên" {...field('fullName')} />
        <TextField label="Email" type="email" autoComplete="email" inputMode="email" placeholder="Nhập địa chỉ email" hint="Chúng tôi sẽ gửi mã xác minh tới email này." {...field('email')} />
        <TextField label="Số điện thoại" type="tel" autoComplete="tel" inputMode="tel" placeholder="Nhập số điện thoại" {...field('phone')} />

        {accountType === 'business' && (
          <div className="space-y-5 rounded-md border border-line bg-surface/60 p-4">
            <TextField label="Tên công ty" autoComplete="organization" placeholder="Nhập tên công ty" {...field('companyName')} />
            <TextField label="Mã số thuế" inputMode="numeric" placeholder="Ví dụ: 0312345678" {...field('taxCode')} />
            <TextField label="Địa chỉ xuất hóa đơn" autoComplete="street-address" placeholder="Nhập địa chỉ trên hóa đơn" {...field('invoiceAddress')} />
            <p className="text-sm leading-6 text-ink-muted">Giá dành cho doanh nghiệp được áp dụng sau khi cửa hàng kiểm tra mã số thuế. Trong lúc chờ duyệt, bạn vẫn mua được với giá bán lẻ.</p>
          </div>
        )}

        <TextField label="Mật khẩu" type="password" autoComplete="new-password" placeholder="Nhập mật khẩu" hint="Ít nhất 8 ký tự." {...field('password')} />
        <TextField label="Xác nhận mật khẩu" type="password" autoComplete="new-password" placeholder="Nhập lại mật khẩu" {...field('confirmPassword')} />

        <button type="submit" disabled={submitting} className={`${primaryButton} !mt-6`}>
          {submitting ? 'Đang tạo tài khoản…' : 'Tạo tài khoản'}
        </button>
      </form>

      <p className="mt-6 text-center text-[15px] text-ink-muted">
        Đã có tài khoản?{' '}
        <Link to={next === '/' ? '/dang-nhap' : `/dang-nhap?next=${encodeURIComponent(next)}`} className="-my-2 inline-block py-2 font-semibold text-brand hover:underline">
          Đăng nhập
        </Link>
      </p>
    </AuthSplit>
  );
}
