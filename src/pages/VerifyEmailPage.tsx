import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { MailIcon } from '../components/ui/icons';
import { StatusMessage } from '../components/ui/StatusMessage';
import { TextField } from '../components/ui/TextField';
import { AuthHeading, AuthSplit, FormAlert, primaryButton } from '../features/auth/AuthSplit';
import { maskEmail } from '../features/auth/mask';
import { OtpInput } from '../features/auth/OtpInput';
import { safeNextPath } from '../features/auth/redirect';
import { EMAIL_PATTERN, useSetCurrentCustomer } from '../features/auth/session';
import { api, ApiError } from '../lib/api';
import { queryKeys, useCurrentCustomer } from '../lib/queries';
import type { Customer } from '../types/api';

interface VerificationStatus {
  emailVerified: boolean;
  email: string;
  expiresAt: string | null;
  resendAvailableAt: string;
}
const STATUS_KEY = ['email-verification'] as const;

/** Seconds left until `iso`, refreshed every second. */
function useSecondsUntil(iso: string | undefined) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);
  return iso ? Math.max(0, Math.ceil((new Date(iso).getTime() - now) / 1000)) : 0;
}

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const next = safeNextPath(searchParams.get('next'));
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const setCustomer = useSetCurrentCustomer();
  const { data: customer, isPending: checkingSession } = useCurrentCustomer();
  const status = useQuery({
    queryKey: STATUS_KEY,
    queryFn: () => api<VerificationStatus>('/api/auth/email-verification'),
    enabled: !!customer && !customer.emailVerified,
  });

  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ tone: 'error' | 'success'; message: string } | null>(null);
  const [busy, setBusy] = useState<'verify' | 'resend' | 'email' | null>(null);
  const [editingEmail, setEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [emailError, setEmailError] = useState<string | undefined>();
  const lastAutoSubmitted = useRef('');
  const secondsToResend = useSecondsUntil(status.data?.resendAvailableAt);

  useEffect(() => {
    if (notice) document.getElementById('verify-notice')?.focus();
  }, [notice]);

  // After a wrong code the boxes are cleared: put the cursor back in the first one (once they are enabled again).
  useEffect(() => {
    if (codeError && busy === null) document.querySelector<HTMLInputElement>('input[aria-label="Chữ số 1"]')?.focus();
  }, [codeError, busy]);

  if (checkingSession) return <AuthSplit><StatusMessage kind="loading">Đang tải…</StatusMessage></AuthSplit>;
  if (!customer) return <Navigate to={`/dang-nhap?next=${encodeURIComponent('/xac-minh-email' + (next !== '/' ? `?next=${encodeURIComponent(next)}` : ''))}`} replace />;
  if (customer.emailVerified && busy !== 'verify') return <Navigate to={next === '/' ? '/tai-khoan' : next} replace />;

  const updateStatus = (patch: Partial<VerificationStatus>) =>
    queryClient.setQueryData<VerificationStatus>(STATUS_KEY, (current) => (current ? { ...current, ...patch } : current));

  async function verify(value: string) {
    if (busy) return;
    setNotice(null);
    if (!/^\d{6}$/.test(value)) return setCodeError('Vui lòng nhập đủ 6 chữ số.');
    setCodeError(null);
    setBusy('verify');
    try {
      const result = await api<{ customer: Customer }>('/api/auth/email-verification/verify', { method: 'POST', body: { code: value } });
      await setCustomer(result.customer);
      navigate(next === '/' ? '/tai-khoan' : next, { replace: true, state: { notice: 'Email đã được xác minh.' } });
    } catch (error) {
      setBusy(null);
      setCode('');
      if (error instanceof ApiError) {
        const field = error.fieldErrors().code;
        if (field) setCodeError(field);
        else if (error.code === 'UNAUTHENTICATED') navigate('/dang-nhap', { replace: true });
        else {
          setCodeError(error.message);
          // An expired or locked code: the status endpoint now reports "no usable code".
          void queryClient.invalidateQueries({ queryKey: STATUS_KEY });
        }
      } else setCodeError('Có lỗi xảy ra. Vui lòng thử lại.');
    }
  }

  function handleCodeChange(value: string) {
    setCode(value);
    setCodeError(null);
    // Submit on its own once all six digits are in (once per distinct code).
    if (value.length === 6 && value !== lastAutoSubmitted.current) {
      lastAutoSubmitted.current = value;
      void verify(value);
    }
  }

  async function resend() {
    if (busy || secondsToResend > 0) return;
    setBusy('resend');
    setNotice(null);
    try {
      const result = await api<{ expiresAt: string; resendAvailableAt: string; email: string }>('/api/auth/email-verification/resend', { method: 'POST' });
      updateStatus({ expiresAt: result.expiresAt, resendAvailableAt: result.resendAvailableAt });
      setCode('');
      setCodeError(null);
      lastAutoSubmitted.current = '';
      setNotice({ tone: 'success', message: `Đã gửi mã mới tới ${maskEmail(result.email)}. Mã cũ không còn dùng được.` });
    } catch (error) {
      if (error instanceof ApiError) {
        const retry = (error.details as { retryAfterSeconds?: number } | undefined)?.retryAfterSeconds;
        if (retry) updateStatus({ resendAvailableAt: new Date(Date.now() + retry * 1000).toISOString() });
        setNotice({ tone: 'error', message: error.message });
      } else setNotice({ tone: 'error', message: 'Có lỗi xảy ra. Vui lòng thử lại.' });
    } finally {
      setBusy(null);
    }
  }

  async function changeEmail(event: FormEvent) {
    event.preventDefault();
    if (busy) return;
    const value = newEmail.trim();
    if (!EMAIL_PATTERN.test(value)) return setEmailError('Email chưa đúng định dạng, ví dụ: ten@gmail.com.');
    setEmailError(undefined);
    setBusy('email');
    try {
      const result = await api<{ customer: Customer; expiresAt: string; resendAvailableAt: string }>('/api/auth/email-verification/email', { method: 'PATCH', body: { email: value } });
      queryClient.setQueryData(queryKeys.me, result.customer);
      queryClient.setQueryData<VerificationStatus>(STATUS_KEY, { emailVerified: false, email: result.customer.email, expiresAt: result.expiresAt, resendAvailableAt: result.resendAvailableAt });
      setEditingEmail(false);
      setNewEmail('');
      setCode('');
      lastAutoSubmitted.current = '';
      setNotice({ tone: 'success', message: `Đã cập nhật email và gửi mã tới ${maskEmail(result.customer.email)}.` });
    } catch (error) {
      if (error instanceof ApiError) setEmailError(error.fieldErrors().email ?? error.message);
      else setEmailError('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setBusy(null);
    }
  }

  const email = status.data?.email ?? customer.email;
  const noUsableCode = status.isSuccess && !status.data.expiresAt;

  return (
    <AuthSplit>
      <title>Xác minh email | Trầm Hương Địa Trung Tín</title>
      <meta name="robots" content="noindex" />

      <div className="grid h-11 w-11 place-items-center rounded-full bg-surface-muted text-brand md:bg-surface">
        <MailIcon size={20} />
      </div>
      <div className="mt-5">
        <AuthHeading eyebrow="Xác minh tài khoản" title="Xác minh email">
          Nhập mã 6 chữ số được gửi tới
          <br />
          <strong className="font-semibold text-ink">{maskEmail(email)}</strong>
        </AuthHeading>
      </div>

      {notice && (
        <div className="mt-5">
          <FormAlert id="verify-notice" tone={notice.tone} message={notice.message} />
        </div>
      )}

      {editingEmail ? (
        <form noValidate onSubmit={changeEmail} className="mt-6 space-y-4">
          <TextField label="Email mới" type="email" autoComplete="email" inputMode="email" placeholder="Nhập địa chỉ email" value={newEmail} onChange={(event) => setNewEmail(event.target.value)} error={emailError} autoFocus />
          <button type="submit" disabled={busy === 'email'} className={primaryButton}>
            {busy === 'email' ? 'Đang gửi mã…' : 'Gửi mã tới email mới'}
          </button>
          <button type="button" onClick={() => setEditingEmail(false)} className="h-11 w-full text-[15px] font-semibold text-ink-muted hover:text-brand">
            Hủy
          </button>
        </form>
      ) : (
        <form
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            void verify(code);
          }}
          className="mt-6"
        >
          <p className="text-[15px] font-semibold text-ink">Mã xác minh</p>
          <div className="mt-2">
            <OtpInput value={code} onChange={handleCodeChange} invalid={!!codeError} describedBy={codeError ? 'otp-error' : 'otp-hint'} disabled={busy === 'verify'} />
          </div>
          {codeError ? (
            <p id="otp-error" role="alert" className="mt-2 text-sm font-medium text-brand">
              {codeError}
            </p>
          ) : (
            <p id="otp-hint" className="mt-2 text-sm text-ink-muted">
              {noUsableCode ? 'Mã trước đã hết hạn. Bấm "Gửi lại mã" để nhận mã mới.' : 'Mã có hiệu lực trong 10 phút. Kiểm tra cả thư mục Spam nếu chưa thấy email.'}
            </p>
          )}
          <button type="submit" disabled={busy === 'verify'} className={`${primaryButton} mt-5`}>
            {busy === 'verify' ? 'Đang xác minh…' : 'Xác minh'}
          </button>

          <div className="mt-4 flex items-center justify-between gap-4 text-[15px] font-semibold">
            <button type="button" onClick={resend} disabled={busy === 'resend' || secondsToResend > 0} className="-ml-1 h-11 px-1 text-brand hover:underline disabled:cursor-not-allowed disabled:text-ink-muted disabled:no-underline">
              {busy === 'resend' ? 'Đang gửi…' : secondsToResend > 0 ? `Gửi lại mã (${secondsToResend} giây)` : 'Gửi lại mã'}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditingEmail(true);
                setNewEmail('');
                setEmailError(undefined);
                setNotice(null);
              }}
              className="-mr-1 h-11 px-1 text-brand hover:underline"
            >
              Đổi địa chỉ email
            </button>
          </div>
        </form>
      )}
    </AuthSplit>
  );
}
