import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowLeft, Star, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast";

const fetchCoinDetails = async (id) => {
  const response = await axios.get(`https://api.coincap.io/v2/assets/${id}`);
  return response.data.data;
};

const fetchCoinHistory = async (id) => {
  const end = Date.now();
  const start = end - 30 * 24 * 60 * 60 * 1000; // 30 days ago
  const response = await axios.get(`https://api.coincap.io/v2/assets/${id}/history?interval=d1&start=${start}&end=${end}`);
  return response.data.data;
};

const CryptoDetails = () => {
  const { id } = useParams();
  const { toast } = useToast();

  const { data: coinDetails, isLoading: isLoadingDetails, isError: isErrorDetails } = useQuery({
    queryKey: ['coinDetails', id],
    queryFn: () => fetchCoinDetails(id),
  });

  const { data: coinHistory, isLoading: isLoadingHistory, isError: isErrorHistory } = useQuery({
    queryKey: ['coinHistory', id],
    queryFn: () => fetchCoinHistory(id),
  });

  const addToFavorites = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (!favorites.includes(id)) {
      favorites.push(id);
      localStorage.setItem('favorites', JSON.stringify(favorites));
      toast({
        title: "Added to Favorites",
        description: `${coinDetails.name} has been added to your favorites.`,
      });
    } else {
      toast({
        title: "Already in Favorites",
        description: `${coinDetails.name} is already in your favorites.`,
      });
    }
  };

  if (isLoadingDetails || isLoadingHistory) return <div className="text-center mt-8 font-mono text-purple-400">Decrypting asset data...</div>;
  if (isErrorDetails || isErrorHistory) return <div className="text-center mt-8 font-mono text-red-400">Error: Asset data breach detected</div>;

  const chartData = coinHistory.map(dataPoint => ({
    date: new Date(dataPoint.time).toLocaleDateString(),
    price: parseFloat(dataPoint.priceUsd)
  }));

  return (
    <div className="py-8">
      <div className="flex justify-between items-center mb-4">
        <Link to="/">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Assets
          </Button>
        </Link>
        <div>
          <Button variant="outline" onClick={addToFavorites} className="mr-2">
            <Star className="mr-2 h-4 w-4" /> Add to Favorites
          </Button>
          <Button variant="outline" as="a" href={`https://www.binance.com/en/trade/${coinDetails.symbol}_USDT`} target="_blank" rel="noopener noreferrer">
            <ShoppingCart className="mr-2 h-4 w-4" /> Buy on Binance
          </Button>
        </div>
      </div>
      <h1 className="text-3xl font-bold mb-6 text-center font-mono text-purple-300">{coinDetails.name} ({coinDetails.symbol})</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-purple-900 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-purple-300">Asset Details</h2>
          <p className="mb-2"><span className="font-bold">Rank:</span> {coinDetails.rank}</p>
          <p className="mb-2"><span className="font-bold">Price:</span> ${parseFloat(coinDetails.priceUsd).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          <p className="mb-2"><span className="font-bold">Market Cap:</span> ${parseFloat(coinDetails.marketCapUsd).toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
          <p className="mb-2"><span className="font-bold">24h Change:</span> <span className={parseFloat(coinDetails.changePercent24Hr) > 0 ? 'text-green-400' : 'text-red-400'}>{parseFloat(coinDetails.changePercent24Hr).toFixed(2)}%</span></p>
          <p className="mb-2"><span className="font-bold">Volume (24h):</span> ${parseFloat(coinDetails.volumeUsd24Hr).toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
          <p className="mb-2"><span className="font-bold">Supply:</span> {parseFloat(coinDetails.supply).toLocaleString(undefined, { maximumFractionDigits: 0 })} {coinDetails.symbol}</p>
          <p className="mb-2"><span className="font-bold">Max Supply:</span> {coinDetails.maxSupply ? parseFloat(coinDetails.maxSupply).toLocaleString(undefined, { maximumFractionDigits: 0 }) : 'Unlimited'} {coinDetails.symbol}</p>
          <p className="mb-2"><span className="font-bold">Circulating Supply:</span> {parseFloat(coinDetails.supply).toLocaleString(undefined, { maximumFractionDigits: 0 })} {coinDetails.symbol}</p>
          <p className="mb-2"><span className="font-bold">VWAP (24h):</span> ${parseFloat(coinDetails.vwap24Hr).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
        <div className="bg-purple-900 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-purple-300">Price History (30 Days)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4a0e4e" />
              <XAxis dataKey="date" stroke="#d8b4fe" />
              <YAxis stroke="#d8b4fe" />
              <Tooltip contentStyle={{ backgroundColor: '#4a0e4e', border: 'none' }} />
              <Line type="monotone" dataKey="price" stroke="#8b5cf6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="bg-purple-900 p-6 rounded-lg shadow-lg mt-8">
        <h2 className="text-xl font-semibold mb-4 text-purple-300">About {coinDetails.name}</h2>
        <p className="text-purple-200">{coinDetails.name} is a cryptocurrency with the symbol {coinDetails.symbol}. It is currently ranked #{coinDetails.rank} by market cap. The current price is ${parseFloat(coinDetails.priceUsd).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} with a 24-hour trading volume of ${parseFloat(coinDetails.volumeUsd24Hr).toLocaleString(undefined, { maximumFractionDigits: 0 })}. The circulating supply is {parseFloat(coinDetails.supply).toLocaleString(undefined, { maximumFractionDigits: 0 })} {coinDetails.symbol}.</p>
        <p className="mt-4 text-purple-200">For more information, visit the official website or check out cryptocurrency exchanges that support {coinDetails.symbol}.</p>
      </div>
    </div>
  );
};

export default CryptoDetails;
