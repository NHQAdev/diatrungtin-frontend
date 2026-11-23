import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { TextField } from '../components/ui/TextField';
import { AuthHeading, AuthSplit, FormAlert, primaryButton } from '../features/auth/AuthSplit';
import { safeNextPath } from '../features/auth/redirect';
import { EMAIL_PATTERN, useSetCurrentCustomer } from '../features/auth/session';
import { api, ApiError } from '../lib/api';
import { useCurrentCustomer } from '../lib/queries';
import type { Customer } from '../types/api';

type FieldErrors = { email?: string; password?: string };

export function LoginPage() {
  const [searchParams] = useSearchParams();
  const next = safeNextPath(searchParams.get('next'));
  const navigate = useNavigate();
  const setCustomer = useSetCurrentCustomer();
  const { data: customer, isPending: checkingSession } = useCurrentCustomer();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (formError) document.getElementById('login-error')?.focus();
  }, [formError]);

  // Already logged in (bookmark, back button): go straight on.
  if (!checkingSession && customer && !submitting) {
    return <Navigate to={customer.emailVerified ? (next === '/' ? '/tai-khoan' : next) : `/xac-minh-email${next !== '/' ? `?next=${encodeURIComponent(next)}` : ''}`} replace />;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (submitting) return;
    setFormError(null);

    const errors: FieldErrors = {};
    if (!email.trim()) errors.email = 'Vui lòng nhập email.';
    else if (!EMAIL_PATTERN.test(email.trim())) errors.email = 'Email chưa đúng định dạng, ví dụ: ten@gmail.com.';
    if (!password) errors.password = 'Vui lòng nhập mật khẩu.';
    setFieldErrors(errors);
    if (errors.email) return emailRef.current?.focus();
    if (errors.password) return passwordRef.current?.focus();

    setSubmitting(true);
    try {
      const result = await api<{ customer: Customer }>('/api/auth/login', { method: 'POST', body: { email: email.trim(), password } });
      await setCustomer(result.customer);
      // D10: an account whose email is not confirmed yet goes to the code screen first.
      if (!result.customer.emailVerified) navigate(`/xac-minh-email${next !== '/' ? `?next=${encodeURIComponent(next)}` : ''}`, { replace: true });
      else navigate(next, { replace: true });
    } catch (error) {
      setSubmitting(false);
      if (error instanceof ApiError) {
        const fields = error.fieldErrors();
        if (fields.email || fields.password) return setFieldErrors({ email: fields.email, password: fields.password });
        setFormError(error.message);
        if (error.status === 401) setPassword('');
      } else {
        setFormError('Có lỗi xảy ra. Vui lòng thử lại.');
      }
    }
  }

  return (
    <AuthSplit>
      <title>Đăng nhập | Trầm Hương Địa Trung Tín</title>
      <meta name="robots" content="noindex" />

      <AuthHeading eyebrow="Tài khoản" title="Đăng nhập">
        Chào mừng bạn trở lại Địa Trung Tín.
      </AuthHeading>

      <form noValidate onSubmit={handleSubmit} className="mt-7 space-y-5">
        {formError && <FormAlert id="login-error" message={formError} />}
        <TextField
          ref={emailRef}
          label="Email"
          type="email"
          name="email"
          autoComplete="email"
          inputMode="email"
          placeholder="Nhập địa chỉ email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={fieldErrors.email}
        />
        <TextField
          ref={passwordRef}
          label="Mật khẩu"
          type="password"
          name="password"
          autoComplete="current-password"
          placeholder="Nhập mật khẩu"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={fieldErrors.password}
          labelAside={
            <Link to="/quen-mat-khau" className="-my-2 py-2 text-[15px] font-semibold text-brand hover:underline">
              Quên mật khẩu?
            </Link>
          }
        />
        <button type="submit" disabled={submitting} className={`${primaryButton} !mt-6`}>
          {submitting ? 'Đang đăng nhập…' : 'Đăng nhập'}
        </button>
      </form>

      <p className="mt-6 text-center text-[15px] text-ink-muted">
        Chưa có tài khoản?{' '}
        <Link to={next === '/' ? '/dang-ky' : `/dang-ky?next=${encodeURIComponent(next)}`} className="-my-2 inline-block py-2 font-semibold text-brand hover:underline">
          Đăng ký
        </Link>
      </p>
    </AuthSplit>
  );
}
