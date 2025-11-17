import { useNavigate } from "react-router-dom";
import { McButton } from "@/components/McButton";
import { McCard } from "@/components/McCard";
import { MapPin, Zap } from "lucide-react";

export default function LocationPermission() {
  const navigate = useNavigate();

  const handleAllow = () => {
    // Simular permissão de localização
    navigate("/order-status");
  };

  const handleDeny = () => {
    // Continuar sem localização (sem sincronização IA)
    navigate("/order-status");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center mb-8">
          <div className="inline-flex p-6 rounded-3xl bg-primary/10 mb-4">
            <MapPin className="h-16 w-16 text-primary" />
          </div>
          
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Ativar Localização
          </h1>
          
          <p className="text-muted-foreground text-lg leading-relaxed">
            Para sincronizar o preparo com sua chegada, precisamos acompanhar sua localização
          </p>
        </div>

        <McCard icon={Zap} elevated className="bg-primary/5 border border-primary/20">
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">Por que isso é importante?</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Pedido preparado no momento certo</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Comida sempre fresca e quentinha</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Menos tempo de espera</span>
              </li>
            </ul>
          </div>
        </McCard>

        <div className="space-y-3">
          <McButton onClick={handleAllow}>
            Permitir Localização
          </McButton>
          
          <button
            onClick={handleDeny}
            className="w-full py-3 text-muted-foreground hover:text-foreground transition-colors"
          >
            Continuar sem sincronização
          </button>
        </div>

        <p className="text-xs text-center text-muted-foreground">
          Sua privacidade é importante. A localização é usada apenas durante o preparo do pedido.
        </p>
      </div>
    </div>
  );
}
