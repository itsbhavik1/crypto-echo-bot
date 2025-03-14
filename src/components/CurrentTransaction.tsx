
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchCurrentTransaction } from "@/lib/api";
import { Loader2Icon, TrendingUpIcon, TrendingDownIcon } from "lucide-react";
import type { CurrentTransaction as CurrentTransactionType } from "@/lib/api";

const CurrentTransaction = () => {
  const [transaction, setTransaction] = useState<CurrentTransactionType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const getTransaction = async () => {
      setIsLoading(true);
      try {
        const data = await fetchCurrentTransaction();
        setTransaction(data);
      } catch (error) {
        console.error("Error fetching current transaction:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getTransaction();
    
    // Set up interval to fetch current transaction every 10 seconds
    const interval = setInterval(getTransaction, 10000);
    
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <Card className="glass-card overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Current Transaction</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 animate-pulse">
            <div className="h-6 w-1/2 bg-muted rounded"></div>
            <div className="h-4 w-3/4 bg-muted rounded"></div>
            <div className="h-4 w-2/3 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!transaction) {
    return (
      <Card className="glass-card overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Current Transaction</CardTitle>
        </CardHeader>
        <CardContent className="py-6">
          <div className="text-center text-muted-foreground">
            No active transactions
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card overflow-hidden animate-scale-in">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">Current Transaction</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center">
            {transaction.type === 'buy' ? (
              <TrendingUpIcon className="h-5 w-5 mr-2 text-crypto-success" />
            ) : (
              <TrendingDownIcon className="h-5 w-5 mr-2 text-crypto-danger" />
            )}
            <span className="text-lg font-semibold">
              {transaction.type === 'buy' ? 'Buying' : 'Selling'} {transaction.crypto}
            </span>
            {transaction.status === 'pending' && (
              <span className="ml-auto">
                <Loader2Icon className="h-4 w-4 animate-spin text-muted-foreground" />
              </span>
            )}
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Amount</span>
            <span className="font-medium">{transaction.amount} {transaction.crypto}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Price</span>
            <span className="font-medium">${transaction.price.toLocaleString()}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total</span>
            <span className="font-medium">${(transaction.amount * transaction.price).toLocaleString()}</span>
          </div>
          
          {transaction.hash && (
            <div className="pt-2">
              <div className="text-xs text-muted-foreground mb-1">Transaction Hash</div>
              <div className="font-mono text-xs bg-crypto-subtle p-2 rounded overflow-x-auto">
                {transaction.hash}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrentTransaction;
