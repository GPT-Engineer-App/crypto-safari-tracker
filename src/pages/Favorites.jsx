import { useState, useEffect } from 'react';
import { useQueries } from '@tanstack/react-query';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ExternalLink, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast";

const fetchCoinDetails = async (id) => {
  const response = await axios.get(`https://api.coincap.io/v2/assets/${id}`);
  return response.data.data;
};

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavorites(storedFavorites);
  }, []);

  const favoriteQueries = useQueries({
    queries: favorites.map(id => ({
      queryKey: ['coinDetails', id],
      queryFn: () => fetchCoinDetails(id),
    })),
  });

  const removeFavorite = (id) => {
    const updatedFavorites = favorites.filter(fav => fav !== id);
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    toast({
      title: "Removed from Favorites",
      description: `Asset has been removed from your favorites.`,
    });
  };

  const isLoading = favoriteQueries.some(query => query.isLoading);
  const isError = favoriteQueries.some(query => query.isError);

  if (isLoading) return <div className="text-center mt-8 font-mono text-purple-400">Decrypting favorite assets...</div>;
  if (isError) return <div className="text-center mt-8 font-mono text-red-400">Error: Favorite assets data breach detected</div>;

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold mb-6 text-center font-mono text-purple-300">Favorite Assets</h1>
      {favorites.length === 0 ? (
        <p className="text-center text-purple-400">No favorite assets yet. Add some from the main list!</p>
      ) : (
        <Table className="w-full">
          <TableHeader>
            <TableRow className="bg-purple-900 border-b border-purple-700">
              <TableHead className="text-purple-300">Asset</TableHead>
              <TableHead className="text-purple-300">Price</TableHead>
              <TableHead className="text-purple-300">24h Flux</TableHead>
              <TableHead className="text-purple-300">Market Cap</TableHead>
              <TableHead className="text-purple-300">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {favoriteQueries.map((query) => {
              if (!query.data) return null;
              const coin = query.data;
              return (
                <TableRow key={coin.id} className="border-b border-purple-800 hover:bg-purple-900/50">
                  <TableCell className="font-medium font-mono">
                    <Link to={`/crypto/${coin.id}`} className="flex items-center hover:text-purple-400">
                      {coin.symbol}
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                  </TableCell>
                  <TableCell className="font-mono">${parseFloat(coin.priceUsd).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                  <TableCell className={`font-mono ${parseFloat(coin.changePercent24Hr) > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {parseFloat(coin.changePercent24Hr).toFixed(2)}%
                  </TableCell>
                  <TableCell className="font-mono">${parseFloat(coin.marketCapUsd).toLocaleString(undefined, { maximumFractionDigits: 0 })}</TableCell>
                  <TableCell>
                    <Button variant="ghost" onClick={() => removeFavorite(coin.id)}>
                      <Trash2 className="h-4 w-4 text-red-400" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default Favorites;
