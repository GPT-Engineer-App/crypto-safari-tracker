import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search } from 'lucide-react';

const fetchCoins = async () => {
  const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
    params: {
      vs_currency: 'usd',
      order: 'market_cap_desc',
      per_page: 100,
      page: 1,
      sparkline: false,
    },
  });
  return response.data;
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Cryptocurrency Tracker</h1>
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
            <TableHead>Coin</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>24h Change</TableHead>
            <TableHead>Market Cap</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCoins?.map((coin) => (
            <TableRow key={coin.id}>
              <TableCell className="font-medium">
                <div className="flex items-center">
                  <img src={coin.image} alt={coin.name} className="w-6 h-6 mr-2" />
                  {coin.name}
                </div>
              </TableCell>
              <TableCell>${coin.current_price.toLocaleString()}</TableCell>
              <TableCell className={coin.price_change_percentage_24h > 0 ? 'text-green-600' : 'text-red-600'}>
                {coin.price_change_percentage_24h.toFixed(2)}%
              </TableCell>
              <TableCell>${coin.market_cap.toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Index;
