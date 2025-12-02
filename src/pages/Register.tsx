import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, User, Briefcase } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { signUp } from '../lib/auth';

export function Register() {
  const [userType, setUserType] = useState<'user' | 'collector'>('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [userFormData, setUserFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
  });

  const [collectorFormData, setCollectorFormData] = useState({
    businessName: '',
    ownerName: '',
    registrationNumber: '',
    phone: '',
    bankAccountName: '',
    bankAccountNumber: '',
    bankName: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const profileData = userType === 'user' ? userFormData : collectorFormData;
      await signUp(email, password, userType, profileData);
      navigate(userType === 'user' ? '/user/dashboard' : '/collector/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4 py-12">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Leaf className="h-10 w-10 text-green-600" />
            <span className="text-3xl font-bold text-gray-900">
              clean<span className="text-green-600">Earth</span>
            </span>
          </div>
          <p className="text-gray-600">Create your account</p>
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
          {userType === 'user' ? (
            <>
              <Input
                type="text"
                label="Full Name"
                placeholder="John Doe"
                value={userFormData.fullName}
                onChange={(e) => setUserFormData({ ...userFormData, fullName: e.target.value })}
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="tel"
                  label="Phone"
                  placeholder="080XXXXXXXX"
                  value={userFormData.phone}
                  onChange={(e) => setUserFormData({ ...userFormData, phone: e.target.value })}
                  required
                />
                <Input
                  type="email"
                  label="Email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Input
                type="text"
                label="Address"
                placeholder="123 Street Name, Lagos"
                value={userFormData.address}
                onChange={(e) => setUserFormData({ ...userFormData, address: e.target.value })}
                required
              />
            </>
          ) : (
            <>
              <Input
                type="text"
                label="Business Name"
                placeholder="Green Waste Solutions Ltd"
                value={collectorFormData.businessName}
                onChange={(e) => setCollectorFormData({ ...collectorFormData, businessName: e.target.value })}
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="text"
                  label="Owner Name"
                  placeholder="John Doe"
                  value={collectorFormData.ownerName}
                  onChange={(e) => setCollectorFormData({ ...collectorFormData, ownerName: e.target.value })}
                  required
                />
                <Input
                  type="text"
                  label="Registration Number"
                  placeholder="RC123456"
                  value={collectorFormData.registrationNumber}
                  onChange={(e) => setCollectorFormData({ ...collectorFormData, registrationNumber: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="tel"
                  label="Phone"
                  placeholder="080XXXXXXXX"
                  value={collectorFormData.phone}
                  onChange={(e) => setCollectorFormData({ ...collectorFormData, phone: e.target.value })}
                  required
                />
                <Input
                  type="email"
                  label="Email"
                  placeholder="business@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Input
                  type="text"
                  label="Account Name"
                  placeholder="Business Name"
                  value={collectorFormData.bankAccountName}
                  onChange={(e) => setCollectorFormData({ ...collectorFormData, bankAccountName: e.target.value })}
                  required
                />
                <Input
                  type="text"
                  label="Account Number"
                  placeholder="0123456789"
                  value={collectorFormData.bankAccountNumber}
                  onChange={(e) => setCollectorFormData({ ...collectorFormData, bankAccountNumber: e.target.value })}
                  required
                />
                <Input
                  type="text"
                  label="Bank Name"
                  placeholder="First Bank"
                  value={collectorFormData.bankName}
                  onChange={(e) => setCollectorFormData({ ...collectorFormData, bankName: e.target.value })}
                  required
                />
              </div>
            </>
          )}

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

          <div className="flex items-start space-x-2">
            <input type="checkbox" required className="mt-1" />
            <label className="text-sm text-gray-600">
              I agree to the Terms and Conditions and Privacy Policy
            </label>
          </div>

          <Button type="submit" fullWidth disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-green-600 hover:text-green-700 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
