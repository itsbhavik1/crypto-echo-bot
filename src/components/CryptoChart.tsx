
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Mock data for chart
const generateMockData = () => {
  const data = [];
  const now = new Date();
  
  for (let i = 20; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 15 * 60000);
    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    
    // Create some realistic price movements
    const baseValue = 15000 + Math.random() * 1000;
    const value = i === 0 
      ? baseValue 
      : data[data.length - 1].value + (Math.random() - 0.5) * 200;
    
    data.push({
      time: `${hours}:${minutes}`,
      value: value
    });
  }
  
  return data;
};

const CryptoChart = () => {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    setData(generateMockData());
    setIsLoading(false);

    // Update chart data every minute
    const interval = setInterval(() => {
      const lastPoint = data[data.length - 1];
      if (lastPoint) {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        
        const newValue = lastPoint.value + (Math.random() - 0.5) * 200;
        
        setData(prevData => [
          ...prevData.slice(1),
          { time: `${hours}:${minutes}`, value: newValue }
        ]);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <Card className="glass-card overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Portfolio Value Trend</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-[200px] animate-pulse bg-muted rounded"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card overflow-hidden animate-scale-in">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">Portfolio Value Trend</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#007AFF" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#007AFF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
              <XAxis 
                dataKey="time" 
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#8A8A8E' }}
              />
              <YAxis 
                domain={['dataMin - 100', 'dataMax + 100']}
                orientation="right"
                fontSize={10}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#8A8A8E' }}
              />
              <Tooltip 
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Value']}
                contentStyle={{
                  borderRadius: '8px',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                  fontSize: '12px',
                }}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#007AFF" 
                strokeWidth={2}
                fill="url(#colorValue)" 
                animationDuration={500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default CryptoChart;
