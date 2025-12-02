import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, User, Briefcase } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { signIn, getUserType } from '../lib/auth';

export function Login() {
  const [userType, setUserType] = useState<'user' | 'collector'>('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { user } = await signIn(email, password);
      if (!user) throw new Error('Login failed');

      const actualUserType = await getUserType(user.id);

      if (actualUserType !== userType) {
        setError(`This account is registered as a ${actualUserType === 'user' ? 'User' : 'Service Provider'}. Please select the correct account type.`);
        setLoading(false);
        return;
      }

      navigate(userType === 'user' ? '/user/dashboard' : '/collector/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Leaf className="h-10 w-10 text-green-600" />
            <span className="text-3xl font-bold text-gray-900">
              clean<span className="text-green-600">Earth</span>
            </span>
          </div>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            type="button"
            onClick={() => setUserType('user')}
            className={`p-4 rounded-lg border-2 transition-all ${
              userType === 'user'
                ? 'border-green-600 bg-green-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <User className={`h-8 w-8 mx-auto mb-2 ${userType === 'user' ? 'text-green-600' : 'text-gray-400'}`} />
            <div className="font-medium text-sm">User</div>
          </button>
          <button
            type="button"
            onClick={() => setUserType('collector')}
            className={`p-4 rounded-lg border-2 transition-all ${
              userType === 'collector'
                ? 'border-green-600 bg-green-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Briefcase className={`h-8 w-8 mx-auto mb-2 ${userType === 'collector' ? 'text-green-600' : 'text-gray-400'}`} />
            <div className="font-medium text-sm">Service Provider</div>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            label="Email"
            placeholder="your.email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            label="Password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <Button type="submit" fullWidth disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-green-600 hover:text-green-700 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
