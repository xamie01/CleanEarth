import React, { useState, useEffect, useCallback } from 'react';
import { Truck, DollarSign, Wallet, MapPin, BarChart2, Bell, Users, Settings, LogOut, ChevronRight } from 'lucide-react';

// Mock data to simulate the PSP Partner's dashboard state
const initialPartnerData = {
  partnerName: "GreenCycle Logistics Ltd.",
  partnerId: "PSP-GCL-102",
  walletBalance: 85250.75, // Naira (NGN)
  commissionRate: 15, // Percent
  totalPickups: 420,
  pickupsToday: 12,
  completedPickups: 395,
  pendingPickups: 25,
  recyclablesSold: 4500, // kg
  recentTransactions: [
    { id: 1, type: 'Credit', amount: 5000, date: '2025-10-17', description: 'User Subscription Payment' },
    { id: 2, type: 'Debit', amount: 750, date: '2025-10-17', description: 'Commission Fee (15%)' },
    { id: 3, type: 'Credit', amount: 8000, date: '2025-10-18', description: 'User Subscription Payment' },
    { id: 4, type: 'Debit', amount: 1200, date: '2025-10-18', description: 'Commission Fee (15%)' },
    { id: 5, type: 'Credit', amount: 50000, date: '2025-10-20', description: 'Payout Withdrawal' },
  ]
};

// Utility components for clean UI

const Card = ({ title, value, icon: Icon, colorClass = 'text-green-600', subText, onClick }) => (
  <div
    className={`bg-white p-4 rounded-xl shadow-md flex flex-col justify-between h-full transition-all duration-300 hover:shadow-lg cursor-pointer ${onClick ? 'hover:scale-[1.02]' : ''}`}
    onClick={onClick}
  >
    <div className="flex items-start justify-between">
      <div className='flex flex-col'>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <h3 className="text-2xl font-extrabold text-gray-900 mt-1">{value}</h3>
      </div>
      <div className={`p-2 rounded-full bg-opacity-10 ${colorClass}`} style={{ backgroundColor: colorClass.replace('text-', 'bg-').replace('-600', '-100') }}>
        <Icon className={`w-6 h-6 ${colorClass}`} />
      </div>
    </div>
    {subText && <p className="text-xs text-gray-400 mt-2 truncate">{subText}</p>}
  </div>
);

const TransactionItem = ({ transaction }) => {
  const isCredit = transaction.type === 'Credit';
  const amountClass = isCredit ? 'text-green-600' : 'text-red-600';
  const sign = isCredit ? '+' : '-';

  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-full ${isCredit ? 'bg-green-100' : 'bg-red-100'}`}>
          {isCredit ? <DollarSign className="w-5 h-5 text-green-600" /> : <Wallet className="w-5 h-5 text-red-600" />}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-800">{transaction.description}</p>
          <p className="text-xs text-gray-400">{transaction.date}</p>
        </div>
      </div>
      <p className={`text-sm font-bold ${amountClass}`}>
        {sign}₦{transaction.amount.toLocaleString()}
      </p>
    </div>
  );
};


// Main Application Component
export default function App() {
  const [partnerData, setPartnerData] = useState(initialPartnerData);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null); // 'pickup', 'wallet', etc.

  // Simulate authentication/initial load
  useEffect(() => {
    document.title = `${partnerData.partnerName} | cleanEarth Portal`;
  }, [partnerData.partnerName]);

  const handleAction = useCallback((type) => {
    setModalType(type);
    setShowModal(true);
  }, []);

  const closeModal = () => {
    setShowModal(false);
    setModalType(null);
  };

  const handleWithdrawal = () => {
    // Basic validation
    handleAction('wallet');
  };

  const menuItems = [
    { name: 'Dashboard', icon: BarChart2 },
    { name: 'Pickups', icon: Truck },
    { name: 'Wallet & Payouts', icon: Wallet },
    { name: 'Recycling Sales', icon: DollarSign },
    { name: 'Routes & Maps', icon: MapPin },
    { name: 'Team Management', icon: Users },
  ];

  // Component for the main dashboard view
  const DashboardView = () => (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Welcome back, {partnerData.partnerName.split(' ')[0]}!</h1>
      
      {/* KPI Cards Grid - Responsive layout for mobile and desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card
          title="Wallet Balance (NGN)"
          value={`₦${partnerData.walletBalance.toLocaleString('en-NG', { minimumFractionDigits: 2 })}`}
          icon={Wallet}
          colorClass="text-green-700"
          subText={`Commission Rate: ${partnerData.commissionRate}%`}
          onClick={() => setActiveTab('Wallet & Payouts')}
        />
        <Card
          title="Pickups Today"
          value={partnerData.pickupsToday}
          icon={Truck}
          colorClass="text-blue-600"
          subText={`Pending: ${partnerData.pendingPickups}`}
          onClick={() => setActiveTab('Pickups')}
        />
        <Card
          title="Recycling Sales (Kg)"
          value={partnerData.recyclablesSold.toLocaleString()}
          icon={DollarSign}
          colorClass="text-yellow-600"
          subText="Last update 1hr ago"
          onClick={() => setActiveTab('Recycling Sales')}
        />
        <Card
          title="Total Pickups"
          value={partnerData.totalPickups.toLocaleString()}
          icon={BarChart2}
          colorClass="text-indigo-600"
          subText={`Completed: ${partnerData.completedPickups}`}
        />
      </div>

      {/* Main Content Area: Financial Summary & Task List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Transactions / Wallet Activity (2/3 width on desktop) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
          <div className='flex justify-between items-center mb-4'>
            <h2 className="text-xl font-semibold text-gray-800">Recent Wallet Activity</h2>
            <button
              onClick={handleWithdrawal}
              className="px-4 py-2 text-sm font-semibold bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-md"
            >
              Withdraw Funds
            </button>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {partnerData.recentTransactions
              .filter(t => t.type !== 'Payout Withdrawal') // Hide full payout to focus on credits/debits
              .slice(0, 8)
              .map(t => (
                <TransactionItem key={t.id} transaction={t} />
              ))}
          </div>
          <div className="mt-4 text-center">
            <button onClick={() => setActiveTab('Wallet & Payouts')} className="text-sm font-semibold text-green-600 hover:text-green-800 flex items-center mx-auto">
              View All Transactions <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>

        {/* Quick Actions / Schedule (1/3 width on desktop) */}
        <div className="bg-white p-6 rounded-xl shadow-md lg:col-span-1">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button
              className="w-full flex items-center justify-between p-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-green-100 transition-colors"
              onClick={() => handleAction('newPickup')}
            >
              <span className='flex items-center'><Truck className='w-5 h-5 mr-3'/> Log New Pickup</span>
              <ChevronRight className='w-4 h-4' />
            </button>
            <button
              className="w-full flex items-center justify-between p-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-green-100 transition-colors"
              onClick={() => handleAction('uploadRecyclables')}
            >
              <span className='flex items-center'><DollarSign className='w-5 h-5 mr-3'/> Upload Recyclables Weight</span>
              <ChevronRight className='w-4 h-4' />
            </button>
            <button
              className="w-full flex items-center justify-between p-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-green-100 transition-colors"
              onClick={() => handleAction('viewRoutes')}
            >
              <span className='flex items-center'><MapPin className='w-5 h-5 mr-3'/> Optimize Today's Route</span>
              <ChevronRight className='w-4 h-4' />
            </button>
          </div>
        </div>

      </div>
    </div>
  );

  // Simple modal placeholder for actions
  const ActionModal = () => (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          {modalType === 'wallet' ? 'Initiate Withdrawal' :
           modalType === 'newPickup' ? 'Log New Pickup' :
           modalType === 'uploadRecyclables' ? 'Record Recycling Data' :
           'Feature Placeholder'}
        </h2>
        <p className="text-gray-600 mb-6">
          This is where the detailed form for **{modalType}** would be implemented, including necessary validation and Firestore interactions.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={closeModal}
            className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={closeModal}
            className="px-4 py-2 text-sm font-semibold bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            {modalType === 'wallet' ? 'Confirm Withdrawal' : 'Save & Continue'}
          </button>
        </div>
      </div>
    </div>
  );

  // Layout structure
  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      
      {/* Sidebar - Mobile toggle implementation */}
      <div
        className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out z-40 w-64 bg-white shadow-xl flex flex-col`}
      >
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-2xl font-black text-green-700 flex items-center">
            <Truck className="w-6 h-6 mr-2" /> cleanEarth Portal
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex-grow p-4 space-y-2">
          {menuItems.map((item) => (
            <a
              key={item.name}
              href="#"
              onClick={() => { setActiveTab(item.name); setIsSidebarOpen(false); }}
              className={`flex items-center p-3 rounded-xl transition-colors duration-200 ${
                activeTab === item.name
                  ? 'bg-green-100 text-green-700 font-semibold shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </a>
          ))}
        </nav>

        {/* Footer/Settings */}
        <div className="p-4 border-t border-gray-100 space-y-2">
           <a href="#" className="flex items-center p-3 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors duration-200">
              <Settings className="w-5 h-5 mr-3" />
              Settings
            </a>
           <a href="#" className="flex items-center p-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors duration-200">
              <LogOut className="w-5 h-5 mr-3" />
              Log Out
            </a>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`lg:ml-64 ${isSidebarOpen ? 'ml-64' : 'ml-0'} transition-all duration-300 ease-in-out`}>
        
        {/* Top Header */}
        <header className="sticky top-0 bg-white shadow-sm z-30 p-4 flex justify-between items-center border-b border-gray-200 lg:px-8">
          <button 
            className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100" 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-label="Toggle Menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
          
          <h2 className="text-xl font-bold text-gray-800 ml-4 lg:ml-0">{activeTab}</h2>

          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-500 hover:text-green-600 transition-colors">
              <Bell className="w-6 h-6" />
            </button>
            <div className="flex items-center space-x-2">
              <span className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-semibold">G</span>
              <span className="hidden sm:inline text-sm font-medium text-gray-700">{partnerData.partnerName}</span>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="pt-2">
          {/* Render the active tab content. For MVP, we only detail the Dashboard */}
          {activeTab === 'Dashboard' && <DashboardView />}
          {activeTab !== 'Dashboard' && (
             <div className="p-8 text-center text-gray-500">
                <item.icon className='w-10 h-10 mx-auto mb-4 text-green-500'/>
                <h3 className='text-xl font-semibold'>The {activeTab} View</h3>
                <p>This section is under construction. It will contain detailed management tools for {activeTab.toLowerCase()}.</p>
             </div>
          )}
        </main>
      </div>
      
      {/* Modal Overlay */}
      {showModal && <ActionModal />}

    </div>
  );
}

