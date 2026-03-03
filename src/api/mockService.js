// Mock Data for all 11 Collections
const mockUsers = [
  { uid: 'U1', name: 'John Doe', email: 'john@example.com', role: 'customer', status: 'active', joined: '2024-01-10' },
  { uid: 'U2', name: 'Green Thumb Services', email: 'pro@lawn.com', role: 'provider', status: 'active', joined: '2024-01-12' },
  { uid: 'U3', name: 'Sarah Miller', email: 'sarah@test.com', role: 'customer', status: 'suspended', joined: '2024-02-01' }
];

const mockJobs = [
  { id: 'JOB-9921', serviceType: 'Mowing', propertySize: 'Large', price: 75, customerName: 'John Doe', providerName: 'Green Thumb', status: 'in_progress', date: '2024-03-04' },
  { id: 'JOB-9922', serviceType: 'Edging', propertySize: 'Small', price: 35, customerName: 'Sarah Miller', providerName: 'Pending', status: 'pending_approval', date: '2024-03-04' }
];

const mockPayments = [
  { id: 'TX_5001', jobId: 'JOB-9921', customerName: 'John Doe', amount: 75, commission: 11.25, status: 'succeeded', method: 'Visa ending 4242' },
  { id: 'TX_5002', jobId: 'JOB-8812', customerName: 'Bob Smith', amount: 50, commission: 7.50, status: 'succeeded', method: 'Apple Pay' }
];

const mockWithdrawals = [
  { id: 'W-771', providerId: 'U2', providerName: 'Green Thumb Services', amount: 450.00, status: 'pending', requestedAt: '2024-03-03', method: 'Stripe Payout' },
  { id: 'W-770', providerId: 'U5', providerName: 'Fast Mowers', amount: 120.50, status: 'completed', requestedAt: '2024-03-01', method: 'Bank Transfer' }
];

const mockDisputes = [
  { id: 'D-101', jobId: 'JOB-7721', raisedBy: 'John Doe', reason: 'Service incomplete', status: 'open', description: 'The provider left the backyard unfinished.', date: '2024-03-02' }
];

const mockSupport = [
  { id: 'T-801', subject: 'App Crashing', userName: 'John Doe', status: 'open', lastMessage: 'The app closes when I try to upload a photo.', messages: [{ sender: 'user', text: 'Help!', timestamp: Date.now() }] }
];

const mockSettings = {
  commissionPercentage: 15,
  taxPercentage: 8,
  pricingRules: { Mowing: 40, Trimming: 25, Edge_Cleaning: 15, Waste_Removal: 10 },
  appVersion: '1.2.0',
  maintenanceMode: false
};

// Simulated API calls with routing logic
export const adminApi = {
  get: (url) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (url.includes('/users')) resolve({ data: mockUsers });
        else if (url.includes('/jobs')) resolve({ data: mockJobs });
        else if (url.includes('/payments')) resolve({ data: mockPayments });
        else if (url.includes('/withdrawals')) resolve({ data: mockWithdrawals });
        else if (url.includes('/disputes')) resolve({ data: mockDisputes });
        else if (url.includes('/support')) resolve({ data: mockSupport });
        else if (url.includes('/settings')) resolve({ data: mockSettings });
        else if (url.includes('/stats')) {
          resolve({ data: {
            revenue: 12450.00,
            activeJobs: mockJobs.length,
            totalUsers: mockUsers.length,
            pendingDisputes: mockDisputes.length
          }});
        }
        else resolve({ data: [] });
      }, 600);
    });
  },
  
  patch: (url, data) => {
    console.log(`[Mock Patch] ${url}`, data);
    return Promise.resolve({ data: { success: true } });
  },
  
  post: (url, data) => {
    console.log(`[Mock Post] ${url}`, data);
    return Promise.resolve({ data: { success: true } });
  }
};

export default adminApi;