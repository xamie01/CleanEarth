import { useEffect, useState } from 'react';
import { Layout } from '../../components/layout/Layout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import {
  Truck,
  DollarSign,
  Wallet,
  MapPin,
  BarChart2,
  Bell,
  ChevronRight,
} from 'lucide-react';

interface CollectorProfile {
  id: string;
  business_name?: string;
  owner_name?: string;
  phone?: string;
  email?: string;
  service_areas?: string[];
  wallet_balance?: number;
  verification_status?: string;
}

interface Pickup {
  id: string;
  user_id?: string | null;
  collector_id?: string | null;
  scheduled_date?: string;
  scheduled_time_slot?: string;
  address?: string;
  status?: string;
  waste_types?: string[];
}

interface TransactionItem {
  id: string | number;
  type: 'Credit' | 'Debit' | string;
  amount: number;
  date?: string;
  description?: string;
}

export function CollectorDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<CollectorProfile | null>(null);
  const [pickups, setPickups] = useState<Pickup[]>([]);
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'wallet' | 'newPickup' | 'uploadRecyclables' | null>(null);

  // Form state for new pickup / withdrawal
  const [pickupAddress, setPickupAddress] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTimeSlot, setPickupTimeSlot] = useState('Morning');
  const [withdrawAmount, setWithdrawAmount] = useState<number | ''>('');

  useEffect(() => {
    document.title = 'Collector Dashboard | cleanEarth';
  }, []);

  useEffect(() => {
    if (!user) return;
    loadDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch collector profile
      const { data: collectorData, error: profileError } = await supabase
        .from('collector_profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        // Log error but continue — table might not be present in dev
        console.error('Error fetching collector profile:', profileError);
      }

      if (collectorData) {
        setProfile(collectorData as CollectorProfile);
      }

      // Fetch pickups assigned to this collector (pending/in_progress)
      const { data: pickupsData, error: pickupsError } = await supabase
        .from('pickups')
        .select('*')
        .or(
          `collector_id.eq.${user?.id},assigned_collector.eq.${user?.id}`
        )
        .in('status', ['pending', 'in_progress'])
        .order('scheduled_date', { ascending: false })
        .limit(10);

      if (pickupsError) {
        // If table/column doesn't exist or query fails, fallback to empty array
        console.warn('Could not load pickups (fallback to empty):', pickupsError.message || pickupsError);
      }

      if (Array.isArray(pickupsData)) setPickups(pickupsData as Pickup[]);

      // Fetch recent transactions for the collector
      const { data: txData, error: txError } = await supabase
        .from('transactions')
        .select('*')
        .eq('collector_id', user?.id)
        .order('date', { ascending: false })
        .limit(8);

      if (txError) {
        console.warn('Could not load transactions (will use local mock):', txError.message || txError);
      }

      if (Array.isArray(txData) && txData.length > 0) {
        setTransactions(txData as TransactionItem[]);
      } else {
        // Fallback mock data when no transactions exist in DB
        setTransactions([
          { id: 1, type: 'Credit', amount: 5000, date: '2025-10-17', description: 'User Subscription Payment' },
          { id: 2, type: 'Debit', amount: 750, date: '2025-10-17', description: 'Commission Fee (15%)' },
          { id: 3, type: 'Credit', amount: 8000, date: '2025-10-18', description: 'User Subscription Payment' },
          { id: 4, type: 'Debit', amount: 1200, date: '2025-10-18', description: 'Commission Fee (15%)' },
          { id: 5, type: 'Credit', amount: 50000, date: '2025-10-20', description: 'Payout Withdrawal' },
        ]);
      }
    } catch (err) {
      console.error('Unexpected error loading collector dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (type: typeof modalType) => {
    setModalType(type);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType(null);
    setPickupAddress('');
    setPickupDate('');
    setPickupTimeSlot('Morning');
    setWithdrawAmount('');
  };

  const handleLogNewPickup = async () => {
    if (!user) return;
    if (!pickupAddress || !pickupDate) {
      alert('Please provide address and date for the pickup');
      return;
    }

    // optimistic item
    const newPickup: Pickup = {
      id: `tmp-${Date.now()}`,
      collector_id: user.id,
      scheduled_date: pickupDate,
      scheduled_time_slot: pickupTimeSlot,
      address: pickupAddress,
      status: 'pending',
      waste_types: [],
    };

    setPickups((p) => [newPickup, ...p]);
    closeModal();

    // attempt to insert into Supabase; if it fails, keep optimistic state but log error
    try {
      const { data, error } = await supabase.from('pickups').insert({
        collector_id: user.id,
        scheduled_date: pickupDate,
        scheduled_time_slot: pickupTimeSlot,
        address: pickupAddress,
        status: 'pending',
      });

      if (error) {
        console.error('Failed to persist new pickup to DB:', error.message || error);
        return;
      }

      if (Array.isArray(data) && data[0]) {
        // replace temporary pickup id with persisted record
        setPickups((p) => p.map((item) => (item.id === newPickup.id ? (data[0] as Pickup) : item)));
      }
    } catch (err) {
      console.error('Error inserting pickup:', err);
    }
  };

  const handleWithdraw = async () => {
    if (!user) return;
    const amount = Number(withdrawAmount) || 0;
    if (amount <= 0) {
      alert('Please enter a valid withdrawal amount');
      return;
    }

    // optimistic transaction
    const tx: TransactionItem = {
      id: `tmp-tx-${Date.now()}`,
      type: 'Debit',
      amount,
      date: new Date().toISOString().split('T')[0],
      description: 'Withdrawal Request',
    };

    setTransactions((t) => [tx, ...t]);
    // optimistic wallet update
    setProfile((p) => (p ? { ...p, wallet_balance: (p.wallet_balance || 0) - amount } : p));
    closeModal();

    // try to persist transaction and wallet change
    try {
      const { data, error } = await supabase.from('transactions').insert({
        collector_id: user.id,
        type: 'Debit',
        amount,
        date: new Date().toISOString().split('T')[0],
        description: 'Withdrawal Request',
      });

      if (error) {
        console.error('Failed to persist withdrawal:', error.message || error);
        return;
      }

      // try to update collector wallet_balance if field exists
      if (profile && typeof profile.wallet_balance === 'number') {
        const { error: upErr } = await supabase
          .from('collector_profiles')
          .update({ wallet_balance: (profile.wallet_balance || 0) - amount })
          .eq('id', profile.id);

        if (upErr) console.warn('Could not persist wallet change to collector_profiles:', upErr.message || upErr);
      }

      if (Array.isArray(data) && data[0]) {
        setTransactions((prev) => prev.map((t) => (t.id === tx.id ? (data[0] as TransactionItem) : t)));
      }
    } catch (err) {
      console.error('Error creating withdrawal transaction:', err);
    }
  };

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

  const walletBalanceDisplay = (profile?.wallet_balance ?? 0).toLocaleString('en-NG', { minimumFractionDigits: 2 });

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">{profile?.business_name || 'Collector Dashboard'}</h1>
            <p className="text-gray-600">Welcome back, {profile?.owner_name?.split(' ')[0] || 'Collector'} — manage pickups and finances here.</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="p-2 text-gray-500 hover:text-green-600 transition-colors">
              <Bell className="w-6 h-6" />
            </button>
            <div className="flex items-center space-x-2">
              <span className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-semibold">{(profile?.business_name || 'C')[0]}</span>
              <div className="text-sm text-gray-700">{profile?.business_name}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card hover className="text-center cursor-pointer" onClick={() => openModal('wallet')}>
            <Wallet className="h-10 w-10 text-green-600 mx-auto mb-3" />
            <h3 className="font-semibold text-lg mb-1">Wallet Balance</h3>
            <p className="text-2xl font-bold text-gray-900">₦{walletBalanceDisplay}</p>
            <p className="text-sm text-gray-600 mt-1">Commission rate: {profile?.verification_status || '—'}</p>
          </Card>

          <Card hover className="text-center cursor-pointer" onClick={() => openModal('newPickup')}>
            <Truck className="h-10 w-10 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold text-lg mb-1">Active Pickups</h3>
            <p className="text-2xl font-bold text-gray-900">{pickups.length}</p>
            <p className="text-sm text-gray-600 mt-1">Showing recent pending/in-progress</p>
          </Card>

          <Card hover className="text-center cursor-pointer" onClick={() => openModal('uploadRecyclables')}>
            <DollarSign className="h-10 w-10 text-yellow-600 mx-auto mb-3" />
            <h3 className="font-semibold text-lg mb-1">Recycling Sales</h3>
            <p className="text-2xl font-bold text-gray-900">— kg</p>
            <p className="text-sm text-gray-600 mt-1">Last update: N/A</p>
          </Card>

          <Card hover className="text-center cursor-pointer">
            <BarChart2 className="h-10 w-10 text-indigo-600 mx-auto mb-3" />
            <h3 className="font-semibold text-lg mb-1">Total Pickups</h3>
            <p className="text-2xl font-bold text-gray-900">{pickups.length + 100}</p>
            <p className="text-sm text-gray-600 mt-1">Completed: {Math.max(0, pickups.length - 3)}</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Recent Wallet Activity</h2>
              <button onClick={() => openModal('wallet')} className="px-4 py-2 text-sm font-semibold bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-md">Withdraw Funds</button>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {transactions.map((t) => (
                <div key={t.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${t.type === 'Credit' ? 'bg-green-100' : 'bg-red-100'}`}>
                      {t.type === 'Credit' ? <DollarSign className="w-5 h-5 text-green-600" /> : <Wallet className="w-5 h-5 text-red-600" />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{t.description}</p>
                      <p className="text-xs text-gray-400">{t.date}</p>
                    </div>
                  </div>
                  <p className={`text-sm font-bold ${t.type === 'Credit' ? 'text-green-600' : 'text-red-600'}`}>{t.type === 'Credit' ? '+' : '-'}₦{Number(t.amount).toLocaleString()}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 text-center">
              <button onClick={() => openModal('wallet')} className="text-sm font-semibold text-green-600 hover:text-green-800 flex items-center mx-auto">View All Transactions <ChevronRight className="w-4 h-4 ml-1" /></button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md lg:col-span-1">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-green-100 transition-colors" onClick={() => openModal('newPickup')}>
                <span className='flex items-center'><Truck className='w-5 h-5 mr-3'/> Log New Pickup</span>
                <ChevronRight className='w-4 h-4' />
              </button>

              <button className="w-full flex items-center justify-between p-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-green-100 transition-colors" onClick={() => openModal('uploadRecyclables')}>
                <span className='flex items-center'><DollarSign className='w-5 h-5 mr-3'/> Upload Recyclables Weight</span>
                <ChevronRight className='w-4 h-4' />
              </button>

              <button className="w-full flex items-center justify-between p-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-green-100 transition-colors" onClick={() => {}}>
                <span className='flex items-center'><MapPin className='w-5 h-5 mr-3'/> Optimize Today's Route</span>
                <ChevronRight className='w-4 h-4' />
              </button>
            </div>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md">
              <h2 className="text-xl font-bold mb-4 text-gray-800">
                {modalType === 'wallet' ? 'Initiate Withdrawal' : modalType === 'newPickup' ? 'Log New Pickup' : 'Record Recycling Data'}
              </h2>

              {modalType === 'newPickup' && (
                <div className="space-y-3">
                  <Input label="Pickup Address" value={pickupAddress} onChange={(e) => setPickupAddress(e.target.value)} />
                  <Input label="Scheduled Date" type="date" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time Slot</label>
                    <select className="w-full px-4 py-2 border rounded-lg" value={pickupTimeSlot} onChange={(e) => setPickupTimeSlot(e.target.value)}>
                      <option>Morning</option>
                      <option>Afternoon</option>
                      <option>Evening</option>
                    </select>
                  </div>
                  <div className="flex justify-end space-x-3">
                    <Button variant="outline" onClick={closeModal}>Cancel</Button>
                    <Button onClick={handleLogNewPickup}>Save & Continue</Button>
                  </div>
                </div>
              )}

              {modalType === 'wallet' && (
                <div className="space-y-3">
                  <Input label="Withdrawal Amount (NGN)" type="number" value={withdrawAmount as any} onChange={(e) => setWithdrawAmount(e.target.value === '' ? '' : Number(e.target.value))} />
                  <div className="flex justify-end space-x-3">
                    <Button variant="outline" onClick={closeModal}>Cancel</Button>
                    <Button onClick={handleWithdraw}>Confirm Withdrawal</Button>
                  </div>
                </div>
              )}

              {modalType === 'uploadRecyclables' && (
                <div className="space-y-3">
                  <Input label="Weight (kg)" type="number" />
                  <Input label="Notes (optional)" />
                  <div className="flex justify-end space-x-3">
                    <Button variant="outline" onClick={closeModal}>Cancel</Button>
                    <Button onClick={closeModal}>Record</Button>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </Layout>
  );
}
