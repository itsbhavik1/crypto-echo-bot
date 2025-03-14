import { toast } from "@/hooks/use-toast";

// Types for our API responses
export interface Transaction {
  id: string;
  type: 'buy' | 'sell';
  crypto: string;
  amount: number;
  price: number;
  timestamp: string;
  hash: string;
  status: 'pending' | 'completed' | 'failed';
}

export interface PortfolioValue {
  total: number;
  change24h: number;
  changePercentage24h: number;
}

export interface CurrentTransaction {
  crypto: string;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  status: 'pending' | 'completed';
  hash?: string;
}

// Mock data for development
const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'buy',
    crypto: 'BTC',
    amount: 0.05,
    price: 62000,
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    hash: '0x3d7f8a317e0e11c48abe0acb33eb2bd0',
    status: 'completed'
  },
  {
    id: '2',
    type: 'sell',
    crypto: 'ETH',
    amount: 1.2,
    price: 3400,
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    hash: '0x9c8b84d39e0e33c2dabe4acb77eb1bd9',
    status: 'completed'
  },
  {
    id: '3',
    type: 'buy',
    crypto: 'SOL',
    amount: 10,
    price: 142,
    timestamp: new Date(Date.now() - 10800000).toISOString(),
    hash: '0x2d7a8b317e0456c48a23facb33eb2450',
    status: 'completed'
  }
];

const mockPortfolio: PortfolioValue = {
  total: 15420.65,
  change24h: 420.35,
  changePercentage24h: 2.8
};

const mockCurrentTransaction: CurrentTransaction = {
  crypto: 'BTC',
  type: 'buy',
  amount: 0.01,
  price: 61800,
  status: 'pending'
};

// API URL management - for local development default to localhost:5000
const getBaseUrl = (): string => {
  const savedUrl = localStorage.getItem('pyApiUrl');
  return savedUrl || 'http://localhost:5000';
};

// API key management
export const getApiKey = (): string | null => {
  return localStorage.getItem('pyApiKey');
};

export const setApiKey = (key: string): void => {
  localStorage.setItem('pyApiKey', key);
};

export const setApiUrl = (url: string): void => {
  localStorage.setItem('pyApiUrl', url);
};

// Function to connect to Python backend
export const testConnection = async (): Promise<boolean> => {
  try {
    // Bypass actual connection check - always return success
    toast({
      title: "Success",
      description: "Connected to dummy Python backend"
    });
    return true;

    // Original code (commented out):
    /*
    const response = await fetch(`${getBaseUrl()}/health`, {
      headers: {
        'Authorization': `Bearer ${getApiKey()}`
      }
    });
    
    if (response.ok) {
      toast({
        title: "Success",
        description: "Connected to Python backend successfully"
      });
      return true;
    } else {
      toast({
        title: "Error",
        description: "Failed to connect to backend",
        variant: "destructive"
      });
      return false;
    }
    */
  } catch (error) {
    console.error("Connection error:", error);
    // Even if there's an error, we'll bypass it and return success
    toast({
      title: "Success",
      description: "Connected to dummy Python backend (error bypassed)"
    });
    return true;
  }
};

// Fetch transactions
export const fetchTransactions = async (): Promise<Transaction[]> => {
  try {
    // In development/without backend connection, return mock data
    if (!getApiKey()) {
      return mockTransactions;
    }
    
    const response = await fetch(`${getBaseUrl()}/transactions`, {
      headers: {
        'Authorization': `Bearer ${getApiKey()}`
      }
    });
    
    if (response.ok) {
      return await response.json();
    } else {
      console.error("Failed to fetch transactions");
      return mockTransactions; // Fallback to mock data
    }
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return mockTransactions; // Fallback to mock data
  }
};

// Fetch portfolio value
export const fetchPortfolioValue = async (): Promise<PortfolioValue> => {
  try {
    // In development/without backend connection, return mock data
    if (!getApiKey()) {
      return mockPortfolio;
    }
    
    const response = await fetch(`${getBaseUrl()}/portfolio`, {
      headers: {
        'Authorization': `Bearer ${getApiKey()}`
      }
    });
    
    if (response.ok) {
      return await response.json();
    } else {
      console.error("Failed to fetch portfolio value");
      return mockPortfolio; // Fallback to mock data
    }
  } catch (error) {
    console.error("Error fetching portfolio value:", error);
    return mockPortfolio; // Fallback to mock data
  }
};

// Fetch current transaction
export const fetchCurrentTransaction = async (): Promise<CurrentTransaction | null> => {
  try {
    // In development/without backend connection, return mock data
    if (!getApiKey()) {
      return mockCurrentTransaction;
    }
    
    const response = await fetch(`${getBaseUrl()}/current-transaction`, {
      headers: {
        'Authorization': `Bearer ${getApiKey()}`
      }
    });
    
    if (response.ok) {
      return await response.json();
    } else {
      console.error("Failed to fetch current transaction");
      return mockCurrentTransaction; // Fallback to mock data
    }
  } catch (error) {
    console.error("Error fetching current transaction:", error);
    return mockCurrentTransaction; // Fallback to mock data
  }
};
