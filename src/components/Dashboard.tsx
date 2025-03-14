
import { useState, useEffect } from "react";
import ApiKeyInput from "./ApiKeyInput";
import PortfolioValue from "./PortfolioValue";
import CurrentTransaction from "./CurrentTransaction";
import TransactionList from "./TransactionList";
import CryptoChart from "./CryptoChart";
import { getApiKey } from "@/lib/api";
import { ErrorBoundary } from "./ErrorBoundary";

const Dashboard = () => {
  const [isConnected, setIsConnected] = useState<boolean>(!!getApiKey());

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-screen p-6">
        <ApiKeyInput onConnect={() => setIsConnected(true)} />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 animate-fade-in">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Crypto Trading Dashboard</h1>
        <p className="text-muted-foreground">Monitor your automated trading activities</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <ErrorBoundary fallback={<div className="glass-card rounded-lg p-4">Unable to load portfolio data</div>}>
          <PortfolioValue />
        </ErrorBoundary>
        <ErrorBoundary fallback={<div className="glass-card rounded-lg p-4">Unable to load transaction data</div>}>
          <CurrentTransaction />
        </ErrorBoundary>
        <div className="md:col-span-1 flex items-center justify-center p-4 glass-card rounded-lg animate-scale-in">
          <button 
            onClick={() => setIsConnected(false)}
            className="text-crypto-accent hover:text-crypto-accent/80 text-sm"
          >
            Change API Connection
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <ErrorBoundary fallback={<div className="glass-card rounded-lg p-4">Unable to load transaction list</div>}>
            <TransactionList />
          </ErrorBoundary>
        </div>
        <div className="md:col-span-2">
          <ErrorBoundary fallback={<div className="glass-card rounded-lg p-4">Unable to load chart data</div>}>
            <CryptoChart />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
