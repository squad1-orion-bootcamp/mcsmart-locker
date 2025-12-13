import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { McHeader } from "@/components/McHeader";
import { McCard } from "@/components/McCard";
import { MapPin, Box, Clock, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Store {
  id: string | number;
  name: string;
  address: string;
  distance: string;
  lockersAvailable: number;
  estimatedTime: string;
}

export default function Stores() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const webhookUrl = `${import.meta.env.VITE_N8N_WEBHOOK_URL}/getStores`;
        
        const response = await fetch(webhookUrl);
        if (!response.ok) throw new Error("Falha ao buscar lojas");
        
        const data = await response.json();
        
        const storesData = Array.isArray(data) ? data : (data.stores || []);
        
        setStores(storesData);
      } catch (error) {        
        setStores([
          {
            id: 1,
            name: "McDonald's Shopping Center",
            address: "Av. Principal, 1000 - Centro",
            distance: "1.2 km",
            lockersAvailable: 8,
            estimatedTime: "10-15 min"
          },
          {
            id: 2,
            name: "McDonald's Beira Mar",
            address: "Av. Beira Mar, 2500",
            distance: "2.5 km",
            lockersAvailable: 5,
            estimatedTime: "15-20 min"
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStores();
  }, [toast]);

  return (
    <div className="min-h-screen bg-background">
      <McHeader title="Escolher Loja" showBack={false} />

      <div className="p-6 space-y-4">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">Lojas próximas</h2>
          <p className="text-muted-foreground">Selecione a loja com locker inteligente</p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Buscando lojas...</p>
          </div>
        ) : (
          stores.map((store) => (
            <McCard
              key={store.id}
              onClick={() => navigate("/menu")}
              elevated
            >
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">{store.name}</h3>
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <MapPin className="h-4 w-4" />
                    <span>{store.address}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-2">
                    <Box className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">
                      {store.lockersAvailable} lockers
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">{store.distance}</span>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{store.estimatedTime}</span>
                    </div>
                  </div>
                </div>
              </div>
            </McCard>
          ))
        )}
      </div>
    </div>
  );
}
