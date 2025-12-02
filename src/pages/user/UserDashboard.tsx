import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarPlus, Upload, Gift, Trash2, Recycle, TrendingUp, TreePine } from 'lucide-react';
import { Layout } from '../../components/layout/Layout';
import { Card, MetricCard } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

interface UserProfile {
  full_name: string;
  eco_points: number;
  total_waste_collected_kg: number;
  total_recycling_kg: number;
  co2_saved_kg: number;
}

interface Pickup {
  id: string;
  scheduled_date: string;
  scheduled_time_slot: string;
  address: string;
  status: string;
  waste_types: string[];
}

export function UserDashboard() {
  const { user, userType } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [upcomingPickups, setUpcomingPickups] = useState<Pickup[]>([]);
  const [loading, setLoading] = useState(true);

  // Booking modal + alerts
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingStep, setBookingStep] = useState<number>(1);
  const [bookingType, setBookingType] = useState<'ondemand' | 'schedule'>('ondemand');
  const [alerts, setAlerts] = useState<Array<{ id: number; message: string; type?: 'info' | 'success' | 'error' }>>([]);

  // UI view state
  const VIEWS = {
    USER_DASHBOARD: 'user-dashboard',
    USER_BOOKING: 'user-booking',
    USER_SCHEDULES: 'user-schedules',
    USER_TRANSACTIONS: 'user-transactions',
    PROVIDER_DASHBOARD: 'provider-dashboard',
    SETTINGS: 'settings',
  } as const;

  const [currentView, setCurrentView] = useState<string>(VIEWS.USER_DASHBOARD);
  const [displayRole, setDisplayRole] = useState<'user' | 'provider' | 'collector'>(() => (user ? ((userType as any) || 'user') : 'user'));

  useEffect(() => {
    if (user) {
      loadDashboardData();
      setDisplayRole((userType as any) || 'user');
    }
  }, [user, userType]);

  const loadDashboardData = async () => {
    try {
      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (profileData) setProfile(profileData);

      const { data: pickupsData } = await supabase
        .from('pickups')
        .select('*')
        .eq('user_id', user?.id)
        .in('status', ['pending', 'in_progress'])
        .order('scheduled_date', { ascending: true })
        .limit(3);

      if (pickupsData) setUpcomingPickups(pickupsData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Modal / booking helpers (simplified, mocked)
  function openBookingModal(type: 'ondemand' | 'schedule') {
    setBookingType(type);
    setBookingStep(1);
    setShowBookingModal(true);
  }

  function nextBookingStep() {
    setBookingStep(2);
  }

  function closeBookingModal() {
    setShowBookingModal(false);
    setBookingStep(1);
  }

  function alertMessage(message: string, type: 'info' | 'success' | 'error' = 'info') {
    const id = Date.now();
    setAlerts((s) => [...s, { id, message, type }]);
    setTimeout(() => setAlerts((s) => s.filter((a) => a.id !== id)), 3500);
  }

  function submitBooking() {
    // Mock submission flow
    closeBookingModal();
    alertMessage('Pickup successfully booked!', 'success');
    // In a real integration: call API, refresh pickups, navigate, etc.
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex">
        {/* Sidebar - no role switching here; role selection is done on login/signup */}
        <aside className="w-64 bg-white shadow-sm hidden md:flex flex-col p-4 h-screen sticky top-0">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center"><span className="text-green-500 mr-2">♻️</span> CleanEarth</h2>
          </div>

          <div className="p-3 bg-gray-50 rounded mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-500">Current Role:</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-semibold">{displayRole}</span>
            </div>
          </div>

          <nav className="flex-1 space-y-2">
            {displayRole === 'user' ? (
              <>
                <button onClick={() => setCurrentView(VIEWS.USER_DASHBOARD)} className={`w-full text-left p-3 rounded-lg ${currentView === VIEWS.USER_DASHBOARD ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-green-50'}`}>🏠 Dashboard</button>
                <button onClick={() => setCurrentView(VIEWS.USER_BOOKING)} className={`w-full text-left p-3 rounded-lg ${currentView === VIEWS.USER_BOOKING ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-green-50'}`}>📅 New Booking</button>
                <button onClick={() => setCurrentView(VIEWS.USER_SCHEDULES)} className={`w-full text-left p-3 rounded-lg ${currentView === VIEWS.USER_SCHEDULES ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-green-50'}`}>🔁 My Schedules</button>
                <button onClick={() => setCurrentView(VIEWS.USER_TRANSACTIONS)} className={`w-full text-left p-3 rounded-lg ${currentView === VIEWS.USER_TRANSACTIONS ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-green-50'}`}>💰 Transactions</button>
              </>
            ) : (
              <>
                <button onClick={() => setCurrentView(VIEWS.PROVIDER_DASHBOARD)} className={`w-full text-left p-3 rounded-lg ${currentView === VIEWS.PROVIDER_DASHBOARD ? 'bg-purple-50 text-purple-700' : 'text-gray-600 hover:bg-purple-50'}`}>📦 Job Board</button>
                <button onClick={() => setCurrentView(VIEWS.PROVIDER_DASHBOARD)} className={`w-full text-left p-3 rounded-lg text-gray-600 hover:bg-purple-50`}>📈 My Earnings</button>
                <button onClick={() => setCurrentView(VIEWS.PROVIDER_DASHBOARD)} className={`w-full text-left p-3 rounded-lg text-gray-600 hover:bg-purple-50`}>🚛 Vehicle Info</button>
              </>
            )}
            <button onClick={() => setCurrentView(VIEWS.SETTINGS)} className={`w-full text-left p-3 rounded-lg ${currentView === VIEWS.SETTINGS ? 'bg-gray-100 text-gray-800' : 'text-gray-600 hover:bg-gray-100'}`}>⚙️ Settings & Profile</button>
          </nav>
        </aside>

        {/* Main content area */}
        <main className="flex-1 p-8">
          {/* Alerts */}
          <div className="fixed top-4 right-4 z-50 space-y-2">
            {alerts.map((a) => (
              <div
                key={a.id}
                className={`p-3 rounded-lg text-white shadow-lg ${
                  a.type === 'success' ? 'bg-green-500' : a.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                }`}
              >
                {a.message}
              </div>
            ))}
          </div>

          {/* Conditional views */}
          {currentView === VIEWS.USER_DASHBOARD && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Welcome back, {profile?.full_name?.split(' ')[0] || 'User'}!</h1>
                <p className="text-gray-600 mt-1">Track your impact and manage your waste collection</p>
              </div>

              {/* dashboard content (cards, metrics, upcoming pickups, recent activity) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div onClick={() => openBookingModal('ondemand')}>
                  <Card hover className="text-center cursor-pointer">
                    <CalendarPlus className="h-10 w-10 text-green-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-lg mb-1">Book On-Demand</h3>
                    <p className="text-sm text-green-600">Need an immediate pickup? Get a quote instantly.</p>
                  </Card>
                </div>
                <div onClick={() => openBookingModal('schedule')}>
                  <Card hover className="text-center cursor-pointer">
                    <Upload className="h-10 w-10 text-blue-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-lg mb-1">Setup Recurring Schedule</h3>
                    <p className="text-sm text-blue-600">Set up weekly or bi-weekly routine services.</p>
                  </Card>
                </div>
                <Link to="/user/rewards">
                  <Card hover className="text-center cursor-pointer">
                    <Gift className="h-10 w-10 text-amber-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-lg mb-1">View Rewards</h3>
                    <p className="text-sm text-gray-600">Redeem your EcoPoints</p>
                  </Card>
                </Link>
                <Card className="text-center bg-gradient-to-br from-green-50 to-emerald-50">
                  <div className="text-3xl font-bold text-green-600 mb-1">{profile?.eco_points || 0}</div>
                  <h3 className="font-semibold text-lg">EcoPoints</h3>
                </Card>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Environmental Impact</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <MetricCard
                    title="Total Waste Collected"
                    value={`${profile?.total_waste_collected_kg?.toFixed(1) || 0} kg`}
                    icon={<Trash2 className="h-6 w-6" />}
                    color="green"
                  />
                  <MetricCard
                    title="Recycling Volume"
                    value={`${profile?.total_recycling_kg?.toFixed(1) || 0} kg`}
                    icon={<Recycle className="h-6 w-6" />}
                    color="blue"
                  />
                  <MetricCard
                    title="CO2 Emissions Saved"
                    value={`${profile?.co2_saved_kg?.toFixed(1) || 0} kg`}
                    icon={<TrendingUp className="h-6 w-6" />}
                    color="amber"
                  />
                  <MetricCard
                    title="Trees Saved"
                    value={Math.floor((profile?.co2_saved_kg || 0) / 20)}
                    icon={<TreePine className="h-6 w-6" />}
                    color="green"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Upcoming Pickups</h3>
                  {upcomingPickups.length === 0 ? (
                    <div className="text-center py-8">
                      <CalendarPlus className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 mb-4">No upcoming pickups scheduled</p>
                      <Link to="/user/schedule">
                        <Button>Schedule a Pickup</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {upcomingPickups.map((pickup) => (
                        <div key={pickup.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-semibold text-gray-900">
                                {new Date(pickup.scheduled_date).toLocaleDateString('en-US', {
                                  weekday: 'short',
                                  month: 'short',
                                  day: 'numeric',
                                })}
                              </p>
                              <p className="text-sm text-gray-600">{pickup.scheduled_time_slot}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              pickup.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                            }`}>
                              {pickup.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{pickup.address}</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {pickup.waste_types.map((type, idx) => (
                              <span key={idx} className="px-2 py-1 bg-gray-100 rounded text-xs">{type}</span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>

                <Card>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3 pb-3 border-b border-gray-100">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <Gift className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Earned 50 EcoPoints</p>
                        <p className="text-xs text-gray-500">Completed pickup on Jan 15</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 pb-3 border-b border-gray-100">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <Recycle className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Recycled 15kg of materials</p>
                        <p className="text-xs text-gray-500">Jan 10, 2025</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="bg-amber-100 p-2 rounded-lg">
                        <TrendingUp className="h-5 w-5 text-amber-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Milestone: 100kg collected</p>
                        <p className="text-xs text-gray-500">Jan 5, 2025</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {currentView === VIEWS.USER_BOOKING && (
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-4">New Waste Pickup Request</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 flex flex-col items-center text-center">
                  <span className="text-6xl mb-4">⚡️</span>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Instant Pickup</h3>
                  <p className="text-gray-600 mb-6">Book a one-time service to be completed within 24-48 hours. Perfect for bulk waste or post-event cleanup.</p>
                  <button onClick={() => openBookingModal('ondemand')} className="w-full md:w-auto px-8 py-3 bg-green-500 text-white font-semibold rounded-xl shadow-md hover:bg-green-600 transition">Book On-Demand</button>
                </div>
                <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 flex flex-col items-center text-center">
                  <span className="text-6xl mb-4">🗓️</span>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Recurring Schedule</h3>
                  <p className="text-gray-600 mb-6">Set up a fixed weekly, bi-weekly, or monthly schedule for your household or business waste.</p>
                  <button onClick={() => openBookingModal('schedule')} className="w-full md:w-auto px-8 py-3 bg-blue-500 text-white font-semibold rounded-xl shadow-md hover:bg-blue-600 transition">Create Schedule</button>
                </div>
              </div>
            </div>
          )}

          {currentView === VIEWS.USER_SCHEDULES && (
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-4">My Active Schedules</h2>
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frequency</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50"><td className="px-6 py-4">General + Recycling</td><td className="px-6 py-4">Bi-Weekly (Tuesdays)</td><td className="px-6 py-4">Dec 3, 2025</td><td className="px-6 py-4"><span className="px-2 inline-flex text-xs font-semibold rounded-full bg-green-100 text-green-800">Active</span></td><td className="px-6 py-4 text-right"><a href="#" className="text-indigo-600">Manage</a></td></tr>
                    <tr className="hover:bg-gray-50"><td className="px-6 py-4">Compost Only</td><td className="px-6 py-4">Weekly (Fridays)</td><td className="px-6 py-4">Nov 29, 2025</td><td className="px-6 py-4"><span className="px-2 inline-flex text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending Update</span></td><td className="px-6 py-4 text-right"><a href="#" className="text-indigo-600">Manage</a></td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {currentView === VIEWS.USER_TRANSACTIONS && (
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-4">Transaction History</h2>
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <p className="p-6 text-gray-600">A full transaction table can be viewed on the Transactions page. (Placeholder)</p>
              </div>
            </div>
          )}

          {currentView === VIEWS.SETTINGS && (
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-4">Settings & Profile</h2>
              <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                <p className="text-gray-600">Manage account details and payment methods here. (Placeholder)</p>
              </div>
            </div>
          )}

          {currentView === VIEWS.PROVIDER_DASHBOARD && (
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-4">Service Provider Job Board</h2>
              <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                <p className="text-gray-600">Provider functionality is available in the Collector area. <Link to="/collector/dashboard" className="text-indigo-600">Open Collector Dashboard</Link></p>
              </div>
            </div>
          )}

          {/* Booking modal (controlled by component state) */}
          {showBookingModal && (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-60 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 p-6 md:p-8">
                <div className="flex justify-between items-start border-b pb-4 mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">{bookingType === 'ondemand' ? 'New On-Demand Pickup' : 'New Scheduled Pickup'}</h3>
                  <button onClick={closeBookingModal} className="text-gray-400 hover:text-gray-600 text-3xl leading-none">&times;</button>
                </div>

                {/* Step 1 */}
                {bookingStep === 1 && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-700 mb-4">Step 1: Details</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Type of Waste</label>
                        <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border">
                          <option>General Household Waste</option>
                          <option>Recycling (Plastics, Paper, Metal)</option>
                          <option>Yard Waste / Compost</option>
                          <option>Bulk Item (Sofa, Appliance, etc.)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Estimated Volume (Optional)</label>
                        <input type="number" placeholder="e.g., 2 standard bins or 1 large item" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Pickup Location Notes (Gate Code, etc.)</label>
                        <textarea rows={2} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"></textarea>
                      </div>
                    </div>

                    <div className="mt-8 flex justify-end">
                      <button onClick={nextBookingStep} className="px-6 py-3 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition">Next: Time & Payment →</button>
                    </div>
                  </div>
                )}

                {/* Step 2 */}
                {bookingStep === 2 && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-700 mb-4">Step 2: Schedule & Confirm</h4>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Preferred Pickup Date</label>
                        <input type="date" defaultValue={new Date().toISOString().slice(0, 10)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Time Slot</label>
                        <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border">
                          <option>Morning (8:00 AM - 12:00 PM)</option>
                          <option>Afternoon (1:00 PM - 5:00 PM)</option>
                          <option>All Day (8:00 AM - 5:00 PM)</option>
                        </select>
                      </div>

                      {bookingType === 'schedule' && (
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-3">
                          <p className="font-semibold text-blue-700">Schedule Frequency</p>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Repeat Every</label>
                            <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border">
                              <option>Week</option>
                              <option>2 Weeks (Bi-Weekly)</option>
                              <option>Month</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">End Date (Optional)</label>
                            <input type="date" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <h5 className="font-bold text-gray-800 mb-2">Order Summary</h5>
                      <div className="flex justify-between text-sm py-1"><span>Service Fee:</span><span className="font-medium">$15.00</span></div>
                      <div className="flex justify-between text-sm py-1"><span>Taxes & Fees:</span><span className="font-medium">$1.50</span></div>
                      <div className="flex justify-between text-lg pt-2 border-t mt-2"><span className="font-bold">Total Quote:</span><span className="font-bold text-green-600">$16.50</span></div>
                    </div>

                    <div className="mt-8 flex justify-between">
                      <button onClick={() => setBookingStep(1)} className="px-6 py-3 text-gray-600 bg-gray-100 font-semibold rounded-xl hover:bg-gray-200 transition">← Back</button>
                      <button onClick={submitBooking} className="px-6 py-3 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition">Confirm Booking</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </Layout>
  );
}