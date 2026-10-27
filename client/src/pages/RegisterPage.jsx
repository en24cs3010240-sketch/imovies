import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Film, Lock, Mail, User, Phone, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const res = await register({ name, email, password, phone });
      if (res.success) {
        navigate('/');
      } else {
        setError(res.message || 'Registration failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="im-card p-4 p-md-5 shadow-lg border-secondary border-opacity-50">
            {/* Header */}
            <div className="text-center mb-4">
              <div
                className="d-inline-flex align-items-center justify-content-center rounded-3 mb-2"
                style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #e50914, #990000)' }}
              >
                <Film size={26} color="#fff" />
              </div>
              <h3 className="fw-bold text-light mb-1">Create Account</h3>
              <p className="text-secondary small">Join IMovies for seamless online movie ticketing</p>
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
                <label className="text-secondary small mb-1">Full Name</label>
                <div className="input-group">
                  <span className="input-group-text bg-dark border-secondary text-secondary">
                    <User size={16} />
                  </span>
                  <input
                    type="text"
                    className="form-control form-control-dark border-start-0"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

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

              <div className="mb-3">
                <label className="text-secondary small mb-1">Phone Number (optional)</label>
                <div className="input-group">
                  <span className="input-group-text bg-dark border-secondary text-secondary">
                    <Phone size={16} />
                  </span>
                  <input
                    type="text"
                    className="form-control form-control-dark border-start-0"
                    placeholder="+1 (555) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="row g-2 mb-4">
                <div className="col-12 col-sm-6">
                  <label className="text-secondary small mb-1">Password</label>
                  <div className="input-group">
                    <span className="input-group-text bg-dark border-secondary text-secondary">
                      <Lock size={16} />
                    </span>
                    <input
                      type="password"
                      className="form-control form-control-dark border-start-0"
                      placeholder="Min 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="col-12 col-sm-6">
                  <label className="text-secondary small mb-1">Confirm Password</label>
                  <div className="input-group">
                    <span className="input-group-text bg-dark border-secondary text-secondary">
                      <Lock size={16} />
                    </span>
                    <input
                      type="password"
                      className="form-control form-control-dark border-start-0"
                      placeholder="Repeat password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-cinema w-100 py-2 fw-bold"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Register'}
              </button>
            </form>

            <div className="text-center mt-4 small text-secondary">
              Already have an account?{' '}
              <Link to="/login" className="text-danger fw-semibold text-decoration-none">
                Sign in here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
