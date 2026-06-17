import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Input, Alert } from '../../components/ui/index';
import { Spinner } from '../../components/ui/index';
import toast from 'react-hot-toast';
import api from '../../services/api';

const ROLE_DASH = { donor: '/donor/dashboard', orphanage: '/orphanage/dashboard', admin: '/admin/dashboard' };

export function LoginPage() {
  const { login, loading } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [form, setForm]     = useState({ email: '', password: '' });
  const [show, setShow]     = useState(false);
  const [error, setError]   = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`);
      navigate(ROLE_DASH[user.role] || from);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex bg-ivory">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 gradient-hero text-white p-12">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
            <Heart size={16} className="text-white fill-white" />
          </div>
          <span className="font-display font-bold text-xl">NeedsLink</span>
        </Link>
        <div>
          <blockquote className="font-display text-2xl font-semibold leading-snug mb-4 text-balance">
            "The smallest act of kindness is worth more than the grandest intention."
          </blockquote>
          <p className="text-white/70 text-sm">Welcome back. Every login brings you closer to a child in need.</p>
        </div>
        <div className="flex gap-1 h-1">
          <div className="flex-1 bg-forest-400 rounded-full" />
          <div className="flex-1 bg-ember rounded-full" />
          <div className="flex-1 bg-gold rounded-full" />
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-forest flex items-center justify-center">
              <Heart size={16} className="text-white fill-white" />
            </div>
            <span className="font-display font-bold text-xl text-ink">NeedsLink</span>
          </div>

          <h1 className="font-display text-3xl font-bold text-ink mb-2">Welcome back</h1>
          <p className="text-ink-muted text-sm mb-8">Log in to your NeedsLink account</p>

          <Alert type="error" message={error} />
          {error && <div className="mb-4" />}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              required
              autoFocus
            />
            <div>
              <div className="relative">
                <Input
                  label="Password"
                  type={show ? 'text' : 'password'}
                  placeholder="Your password"
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShow(v => !v)}
                  className="absolute right-3 top-9 text-ink-muted hover:text-ink"
                >
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <div className="flex justify-end mt-1">
                <Link to="/forgot-password" className="text-xs text-forest hover:underline">Forgot password?</Link>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full btn-lg justify-center">
              {loading ? <Spinner size={18} className="text-white" /> : 'Log in'}
            </button>
          </form>

          <p className="text-center text-sm text-ink-muted mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-forest font-semibold hover:underline">Create one free</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

/* ─── Register Page ─────────────────────────────────────────── */
const STRENGTH = ['', 'Weak', 'Fair', 'Good', 'Strong'];
const strengthColor = ['', 'bg-ember', 'bg-gold', 'bg-gold-600', 'bg-forest'];

function passwordStrength(p) {
  let s = 0;
  if (p.length >= 8)          s++;
  if (/[A-Z]/.test(p))        s++;
  if (/[0-9]/.test(p))        s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  return s;
}

export function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep]   = useState(1); // 1=role, 2=form
  const [role, setRole]   = useState('');
  const [show, setShow]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm]   = useState({
    name: '', email: '', password: '', confirm: '',
    org_name: '', location: '', contact_person: '', phone: '', description: '',
  });

  const strength = passwordStrength(form.password);
  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    if (form.password.length < 8)       { setError('Password must be at least 8 characters.'); return; }
    setLoading(true);
    try {
      const { default: api } = await import('../../services/api');
      await api.post('/auth/register', { ...form, role });
      toast.success('Account created! Check your email to verify your account.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-ivory">
      <div className="hidden lg:flex flex-col justify-between w-1/2 gradient-hero text-white p-12">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
            <Heart size={16} className="text-white fill-white" />
          </div>
          <span className="font-display font-bold text-xl">NeedsLink</span>
        </Link>
        <div>
          <h2 className="font-display text-3xl font-bold mb-4 text-balance">
            Join a community that cares for Cameroon's children.
          </h2>
          <p className="text-white/70 text-sm">Free to join. Transparent. Impactful.</p>
        </div>
        <div className="flex gap-1 h-1">
          <div className="flex-1 bg-forest-400 rounded-full" /><div className="flex-1 bg-ember rounded-full" /><div className="flex-1 bg-gold rounded-full" />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12 overflow-y-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-forest flex items-center justify-center"><Heart size={16} className="text-white fill-white" /></div>
            <span className="font-display font-bold text-xl text-ink">NeedsLink</span>
          </div>

          {step === 1 && (
            <>
              <h1 className="font-display text-3xl font-bold text-ink mb-2">Create an account</h1>
              <p className="text-ink-muted text-sm mb-8">Choose how you want to use NeedsLink</p>
              <div className="grid gap-4">
                {[
                  { val: 'donor', icon: '❤️', title: 'I am a Donor', desc: 'I want to discover orphanages and contribute to their needs.' },
                  { val: 'orphanage', icon: '🏛️', title: 'I represent an Orphanage', desc: 'I want to register our orphanage and post our current needs.' },
                ].map(({ val, icon, title, desc }) => (
                  <motion.button
                    key={val}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { setRole(val); setStep(2); }}
                    className="card p-5 text-left flex gap-4 items-start hover:border-forest/40 hover:shadow-hover transition-all border-2 border-transparent"
                  >
                    <div className="text-3xl">{icon}</div>
                    <div>
                      <p className="font-semibold text-ink mb-1">{title}</p>
                      <p className="text-sm text-ink-muted">{desc}</p>
                    </div>
                  </motion.button>
                ))}
              </div>
              <p className="text-center text-sm text-ink-muted mt-6">
                Already have an account? <Link to="/login" className="text-forest font-semibold hover:underline">Log in</Link>
              </p>
            </>
          )}

          {step === 2 && (
            <>
              <div className="flex items-center gap-3 mb-6">
                <button onClick={() => setStep(1)} className="text-ink-muted hover:text-ink text-sm">← Back</button>
                <h1 className="font-display text-2xl font-bold text-ink">
                  {role === 'donor' ? 'Donor registration' : 'Orphanage registration'}
                </h1>
              </div>

              <Alert type="error" message={error} />
              {error && <div className="mb-4" />}

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input label="Full Name" placeholder="Your full name" value={form.name} onChange={set('name')} required />
                <Input label="Email Address" type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} required />

                {role === 'orphanage' && (
                  <>
                    <Input label="Organisation Name" placeholder="St. Glory Orphanage" value={form.org_name} onChange={set('org_name')} required />
                    <Input label="Location (City/Region)" placeholder="Molyko, Buea" value={form.location} onChange={set('location')} required />
                    <Input label="Contact Person" placeholder="Name of contact person" value={form.contact_person} onChange={set('contact_person')} required />
                    <Input label="Phone Number" type="tel" placeholder="+237 6XX XXX XXX" value={form.phone} onChange={set('phone')} />
                    <div>
                      <label className="input-label">Brief Description</label>
                      <textarea
                        className="input-field resize-none"
                        rows={3}
                        placeholder="Tell donors about your orphanage…"
                        value={form.description}
                        onChange={set('description')}
                        maxLength={300}
                      />
                      <p className="text-xs text-ink-light mt-1 text-right">{form.description.length}/300</p>
                    </div>
                  </>
                )}

                <div className="relative">
                  <Input
                    label="Password"
                    type={show ? 'text' : 'password'}
                    placeholder="Min 8 characters"
                    value={form.password}
                    onChange={set('password')}
                    required
                  />
                  <button type="button" onClick={() => setShow(v => !v)} className="absolute right-3 top-9 text-ink-muted">
                    {show ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {/* Strength bar */}
                {form.password && (
                  <div>
                    <div className="flex gap-1 h-1.5 mb-1">
                      {[1,2,3,4].map(i => (
                        <div key={i} className={`flex-1 rounded-full transition-colors ${i <= strength ? strengthColor[strength] : 'bg-earth/20'}`} />
                      ))}
                    </div>
                    <p className={`text-xs font-medium ${['','text-ember','text-gold-800','text-gold-700','text-forest'][strength]}`}>
                      {STRENGTH[strength]}
                    </p>
                  </div>
                )}

                <Input
                  label="Confirm Password"
                  type="password"
                  placeholder="Repeat password"
                  value={form.confirm}
                  onChange={set('confirm')}
                  required
                  error={form.confirm && form.confirm !== form.password ? 'Passwords do not match' : ''}
                />

                <button type="submit" disabled={loading} className="btn-primary w-full btn-lg justify-center mt-2">
                  {loading ? <Spinner size={18} className="text-white" /> : 'Create account'}
                </button>
              </form>

              <p className="text-center text-sm text-ink-muted mt-4">
                Already have an account? <Link to="/login" className="text-forest font-semibold hover:underline">Log in</Link>
              </p>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}

/* ─── Forgot Password ─────────────────────────────────────────── */
export function ForgotPasswordPage() {
  const [email, setEmail]     = useState('');
  const [sent, setSent]       = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { default: api } = await import('../../services/api');
      await api.post('/auth/forgot-password', { email });
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ivory px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-forest flex items-center justify-center"><Heart size={16} className="text-white fill-white" /></div>
          <span className="font-display font-bold text-xl text-ink">NeedsLink</span>
        </Link>
        {sent ? (
          <div className="card p-8 text-center">
            <div className="text-5xl mb-4">📬</div>
            <h2 className="font-display text-2xl font-bold text-ink mb-2">Check your email</h2>
            <p className="text-sm text-ink-muted">If an account exists for <strong>{email}</strong>, a reset link has been sent.</p>
            <Link to="/login" className="btn-primary mt-6 inline-flex">Back to login</Link>
          </div>
        ) : (
          <>
            <h1 className="font-display text-3xl font-bold text-ink mb-2">Reset your password</h1>
            <p className="text-ink-muted text-sm mb-8">Enter your email and we'll send you a reset link.</p>
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input label="Email address" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
              <button type="submit" disabled={loading} className="btn-primary w-full btn-lg justify-center">
                {loading ? <Spinner size={18} className="text-white" /> : 'Send reset link'}
              </button>
            </form>
            <p className="text-center text-sm text-ink-muted mt-4">
              <Link to="/login" className="text-forest hover:underline">← Back to login</Link>
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
}

/* ─── Verify Email ─────────────────────────────────────────── */
export function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Verification token missing.');
      return;
    }

    (async () => {
      try {
        const { data } = await api.get('/auth/verify-email', { params: { token } });
        setStatus('success');
        setMessage(data.message || 'Email verified successfully. You can now log in.');
        toast.success('Email verified. You can now log in.');
      } catch (err) {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Verification failed.');
      }
    })();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-ivory px-4">
      <div className="w-full max-w-md">
        <div className="card p-8 text-center">
          {status === 'loading' && <div className="mb-4">Verifying…</div>}
          {status === 'success' && (
            <>
              <div className="text-4xl mb-4">✅</div>
              <h2 className="font-display text-2xl font-bold text-ink mb-2">Email verified</h2>
              <p className="text-sm text-ink-muted">{message}</p>
              <Link to="/login" className="btn-primary mt-6 inline-flex">Go to login</Link>
            </>
          )}
          {status === 'error' && (
            <>
              <div className="text-4xl mb-4">⚠️</div>
              <h2 className="font-display text-2xl font-bold text-ink mb-2">Verification failed</h2>
              <p className="text-sm text-ink-muted">{message}</p>
              <Link to="/register" className="btn-primary mt-6 inline-flex">Register again</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
