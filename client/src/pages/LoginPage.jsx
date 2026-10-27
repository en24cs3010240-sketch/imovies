import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Film, Lock, Mail, AlertCircle, ShieldAlert, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const redirect = queryParams.get('redirect') || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        navigate(redirect);
      } else {
        setError(res.message || 'Invalid email or password');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const autofillCustomer = () => {
    setEmail('john@example.com');
    setPassword('Customer@123456');
    setError(null);
  };

  const autofillAdmin = () => {
    setEmail('admin@imovies.com');
    setPassword('Admin@123456');
    setError(null);
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-5">
          <div className="im-card p-4 p-md-5 shadow-lg border-secondary border-opacity-50">
            {/* Header */}
            <div className="text-center mb-4">
              <div
                className="d-inline-flex align-items-center justify-content-center rounded-3 mb-2"
                style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #e50914, #990000)' }}
              >
                <Film size={26} color="#fff" />
              </div>
              <h3 className="fw-bold text-light mb-1">Welcome Back</h3>
              <p className="text-secondary small">Sign in to your IMovies account</p>
            </div>

            {error && (
              <div className="alert alert-danger d-flex align-items-center gap-2 py-2 px-3 mb-4 rounded-3 small">
                <AlertCircle size={16} className="flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="text-secondary small mb-1">Email Address</label>
                <div className="input-group">
                  <span className="input-group-text bg-dark border-secondary text-secondary">
                    <Mail size={16} />
                  </span>
                  <input
                    type="email"
                    className="form-control form-control-dark border-start-0"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="text-secondary small mb-1">Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-dark border-secondary text-secondary">
                    <Lock size={16} />
                  </span>
                  <input
                    type="password"
                    className="form-control form-control-dark border-start-0"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-cinema w-100 py-2 fw-bold"
                disabled={loading}
              >
                {loading ? 'Authenticating...' : 'Sign In'}
              </button>
            </form>

            {/* Quick Demo Fill Buttons */}
            <div className="mt-4 pt-4 border-top border-secondary border-opacity-25">
              <span className="text-muted small d-block mb-2 text-center">Quick Demo Login:</span>
              <div className="d-flex gap-2">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary text-light w-50 d-flex align-items-center justify-content-center gap-1"
                  onClick={autofillCustomer}
                >
                  <UserCheck size={14} className="text-info" />
                  <span>Customer Demo</span>
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-warning w-50 d-flex align-items-center justify-content-center gap-1"
                  onClick={autofillAdmin}
                >
                  <ShieldAlert size={14} />
                  <span>Admin Demo</span>
                </button>
              </div>
            </div>

            <div className="text-center mt-4 small text-secondary">
              Don't have an account?{' '}
              <Link to="/register" className="text-danger fw-semibold text-decoration-none">
                Register here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
