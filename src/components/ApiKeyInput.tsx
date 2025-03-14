
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { testConnection, setApiKey, setApiUrl } from "@/lib/api";

interface ApiKeyInputProps {
  onConnect: () => void;
}

const ApiKeyInput = ({ onConnect }: ApiKeyInputProps) => {
  const [apiKey, setApiKeyState] = useState<string>(localStorage.getItem('pyApiKey') || "");
  const [apiUrl, setApiUrlState] = useState<string>(localStorage.getItem('pyApiUrl') || "http://localhost:5000");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleConnect = async () => {
    setIsLoading(true);
    
    if (apiKey.trim() !== "") {
      setApiKey(apiKey.trim());
    }
    
    if (apiUrl.trim() !== "") {
      setApiUrl(apiUrl.trim());
    }
    
    const success = await testConnection();
    setIsLoading(false);
    
    if (success) {
      onConnect();
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto animate-fade-in glass-card">
      <CardHeader>
        <CardTitle className="text-xl font-medium">Connect to Python Backend</CardTitle>
        <CardDescription>
          Enter your API key and backend URL to connect to your crypto trading bot
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="api-url" className="text-sm font-medium">
            API URL
          </label>
          <Input
            id="api-url"
            placeholder="http://localhost:5000"
            value={apiUrl}
            onChange={(e) => setApiUrlState(e.target.value)}
            className="bg-white"
          />
          <p className="text-xs text-muted-foreground">
            Enter the URL where your Python backend is running
          </p>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="api-key" className="text-sm font-medium">
            API Key (Optional)
          </label>
          <Input
            id="api-key"
            type="password"
            placeholder="Your API key"
            value={apiKey}
            onChange={(e) => setApiKeyState(e.target.value)}
            className="bg-white"
          />
          <p className="text-xs text-muted-foreground">
            If your backend requires authentication, enter your API key here
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleConnect} 
          disabled={isLoading} 
          className="w-full bg-crypto-accent hover:bg-crypto-accent/90"
        >
          {isLoading ? "Connecting..." : "Connect"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ApiKeyInput;
