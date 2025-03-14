
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchTransactions } from "@/lib/api";
import { ArrowUpIcon, ArrowDownIcon, CheckCircleIcon, AlertCircleIcon, ClockIcon } from "lucide-react";
import type { Transaction } from "@/lib/api";

const TransactionItem = ({ transaction }: { transaction: Transaction }) => {
  const formattedDate = new Date(transaction.timestamp).toLocaleString();
  const isBuy = transaction.type === 'buy';
  const totalValue = transaction.amount * transaction.price;
  
  return (
    <div className={`transaction-item ${transaction.type} p-4 border-b border-border`}>
      <div className="flex justify-between items-start mb-1">
        <div className="flex items-center">
          <div className={`rounded-full p-1 mr-2 ${isBuy ? 'bg-crypto-success/10 text-crypto-success' : 'bg-crypto-danger/10 text-crypto-danger'}`}>
            {isBuy ? <ArrowUpIcon className="h-4 w-4" /> : <ArrowDownIcon className="h-4 w-4" />}
          </div>
          <div>
            <div className="font-medium flex items-center">
              {isBuy ? 'Bought' : 'Sold'} {transaction.crypto}
              {transaction.status === 'completed' && <CheckCircleIcon className="h-3.5 w-3.5 ml-1.5 text-crypto-success" />}
              {transaction.status === 'pending' && <ClockIcon className="h-3.5 w-3.5 ml-1.5 text-crypto-warning" />}
              {transaction.status === 'failed' && <AlertCircleIcon className="h-3.5 w-3.5 ml-1.5 text-crypto-danger" />}
            </div>
            <div className="text-xs text-muted-foreground">{formattedDate}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="font-medium">{transaction.amount} {transaction.crypto}</div>
          <div className="text-sm text-muted-foreground">${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
        </div>
      </div>
      <div className="font-mono text-xs text-muted-foreground mt-1 truncate">
        {transaction.hash}
      </div>
    </div>
  );
};

const TransactionList = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const getTransactions = async () => {
      setIsLoading(true);
      try {
        const data = await fetchTransactions();
        setTransactions(data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getTransactions();
    
    // Set up interval to fetch transactions every 20 seconds
    const interval = setInterval(getTransactions, 20000);
    
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <Card className="glass-card overflow-hidden h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-4 p-4 animate-pulse">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2 border-b border-border pb-4">
                <div className="flex justify-between">
                  <div className="h-5 w-1/3 bg-muted rounded"></div>
                  <div className="h-5 w-1/4 bg-muted rounded"></div>
                </div>
                <div className="h-3 w-full bg-muted rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card overflow-hidden h-full animate-scale-in">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent className="p-0 overflow-auto max-h-[calc(100vh-350px)]">
        {transactions.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            No transactions found
          </div>
        ) : (
          <div>
            {transactions.map((transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionList;
