import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search } from 'lucide-react';

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

  if (isLoading) return <div className="text-center mt-8">Loading...</div>;
  if (isError) return <div className="text-center mt-8">Error fetching data</div>;

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Cryptocurrency Tracker</h1>
      <div className="relative mb-4">
        <Input
          type="text"
          placeholder="Search coins..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Rank</TableHead>
            <TableHead>Coin</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>24h Change</TableHead>
            <TableHead>Market Cap</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCoins?.map((coin) => (
            <TableRow key={coin.id}>
              <TableCell>{coin.rank}</TableCell>
              <TableCell className="font-medium">
                <div className="flex items-center">
                  {coin.symbol}
                </div>
              </TableCell>
              <TableCell>${parseFloat(coin.priceUsd).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
              <TableCell className={parseFloat(coin.changePercent24Hr) > 0 ? 'text-green-600' : 'text-red-600'}>
                {parseFloat(coin.changePercent24Hr).toFixed(2)}%
              </TableCell>
              <TableCell>${parseFloat(coin.marketCapUsd).toLocaleString(undefined, { maximumFractionDigits: 0 })}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Index;
