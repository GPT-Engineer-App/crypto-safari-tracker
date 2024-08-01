import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Zap } from 'lucide-react';

const fetchCoins = async () => {
  const response = await axios.get('https://api.coincap.io/v2/assets');
  return response.data.data;
};

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: coins, isLoading, isError } = useQuery({
    queryKey: ['coins'],
    queryFn: fetchCoins,
  });

  const filteredCoins = coins?.filter(coin =>
    coin.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <div className="text-center mt-8 font-mono text-purple-400">Decrypting data...</div>;
  if (isError) return <div className="text-center mt-8 font-mono text-red-400">Error: Data breach detected</div>;

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold mb-6 text-center font-mono text-purple-300 flex items-center justify-center">
        <Zap className="mr-2" />
        Crypto Intelligence Hub
      </h1>
      <div className="relative mb-4">
        <Input
          type="text"
          placeholder="Hack the search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-purple-900 border-purple-700 text-purple-100 placeholder-purple-400"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" size={20} />
      </div>
      <div className="overflow-x-auto">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="bg-purple-900 border-b border-purple-700">
              <TableHead className="text-purple-300">Rank</TableHead>
              <TableHead className="text-purple-300">Asset</TableHead>
              <TableHead className="text-purple-300">Price</TableHead>
              <TableHead className="text-purple-300">24h Flux</TableHead>
              <TableHead className="text-purple-300">Market Cap</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCoins?.map((coin) => (
              <TableRow key={coin.id} className="border-b border-purple-800 hover:bg-purple-900/50">
                <TableCell className="font-mono">{coin.rank}</TableCell>
                <TableCell className="font-medium font-mono">
                  <div className="flex items-center">
                    {coin.symbol}
                  </div>
                </TableCell>
                <TableCell className="font-mono">${parseFloat(coin.priceUsd).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                <TableCell className={`font-mono ${parseFloat(coin.changePercent24Hr) > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {parseFloat(coin.changePercent24Hr).toFixed(2)}%
                </TableCell>
                <TableCell className="font-mono">${parseFloat(coin.marketCapUsd).toLocaleString(undefined, { maximumFractionDigits: 0 })}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Index;
