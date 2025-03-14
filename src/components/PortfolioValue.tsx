
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { fetchPortfolioValue } from "@/lib/api";
import type { PortfolioValue as PortfolioValueType } from "@/lib/api";

const PortfolioValue = () => {
  const [portfolio, setPortfolio] = useState<PortfolioValueType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const getPortfolioData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchPortfolioValue();
        setPortfolio(data);
      } catch (error) {
        console.error("Error fetching portfolio value:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getPortfolioData();
    
    // Set up interval to fetch portfolio value every 30 seconds
    const interval = setInterval(getPortfolioData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <Card className="glass-card overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Portfolio Value</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 animate-pulse">
            <div className="h-8 w-3/4 bg-muted rounded"></div>
            <div className="h-5 w-1/4 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!portfolio) return null;

  const isPositive = portfolio.change24h >= 0;

  return (
    <Card className="glass-card overflow-hidden animate-scale-in">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">Portfolio Value</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <div className="text-3xl font-bold tracking-tight">
            ${portfolio.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center text-sm ${isPositive ? 'text-crypto-success' : 'text-crypto-danger'}`}>
              {isPositive ? (
                <ArrowUpIcon className="mr-1 h-3 w-3" />
              ) : (
                <ArrowDownIcon className="mr-1 h-3 w-3" />
              )}
              ${Math.abs(portfolio.change24h).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              &nbsp;({Math.abs(portfolio.changePercentage24h).toFixed(2)}%)
            </span>
            <span className="text-xs text-muted-foreground">24h</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PortfolioValue;
