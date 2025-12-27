import { useNavigate, useLocation } from "react-router-dom";
import { McButton } from "@/components/McButton";
import { McCard } from "@/components/McCard";
import { CheckCircle2, Star, Home, Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function PickupConfirmed() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const order = location.state?.order;
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [confirmedAt] = useState(new Date());

  const handleRating = async (value: number) => {
    setRating(value);

    if (order?.id) {
      setIsSubmitting(true);
      try {
        const N8N_WEBHOOK_URL = `${import.meta.env.VITE_N8N_WEBHOOK_URL}/getAvaliation`;
        
        if (N8N_WEBHOOK_URL) {
          await fetch(N8N_WEBHOOK_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              orderId: order.id,
              rating: value,
              platform: "App McSmart"
            }),
          });
        }
        
        toast({
          title: "Obrigado!",
          description: "Sua avaliação foi enviada com sucesso.",
        });
      } catch (error) {
        console.error("Erro ao enviar feedback:", error);
        toast({
          title: "Erro",
          description: "Não foi possível enviar sua avaliação.",
          variant: "destructive"
        });
      } finally {
        setIsSubmitting(false);
      }

    }
  };

  const handleFinish = () => {
    navigate("/stores");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        {/* Success Icon */}
        <div className="text-center">
          <div className="inline-flex p-6 rounded-full bg-primary/10 mb-4">
            <CheckCircle2 className="h-20 w-20 text-primary" />
          </div>
          
          <h1 className="text-3xl font-bold text-foreground mb-3">
            Pedido Retirado!
          </h1>
          
          <p className="text-muted-foreground text-lg">
            Aproveite sua refeição 😋
          </p>
        </div>

        {/* Order Summary */}
        <McCard elevated className="bg-gradient-to-br from-primary/5 to-primary/10">
          <div className="text-center py-4 space-y-2">
            <p className="text-sm text-muted-foreground">Pedido</p>
            <p className="text-3xl font-bold text-foreground">#{order?.id || "----"}</p>
            <div className="pt-2 border-t border-border/50 mt-4">
              <p className="text-sm text-muted-foreground">Retirado às</p>
              <p className="font-semibold text-foreground capitalize">
                {format(confirmedAt, "HH:mm", { locale: ptBR })}
              </p>
            </div>
          </div>
        </McCard>

        {/* Rating */}
        <McCard elevated>
          <div className="text-center space-y-4">
            <div>
              <h3 className="font-semibold text-foreground text-lg mb-2">
                Como foi sua experiência?
              </h3>
              <p className="text-sm text-muted-foreground">
                Avalie o serviço McSmart Pick-up
              </p>
            </div>

            <div className="flex justify-center gap-2 py-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-10 w-10 ${
                      star <= (hoveredRating || rating)
                        ? "fill-primary text-primary"
                        : "text-border"
                    }`}
                  />
                </button>
              ))}
            </div>

            {rating > 0 && (
              <div className="animate-in fade-in slide-in-from-bottom-2">
                <p className="text-sm font-medium text-primary">
                  {rating === 5 && "Excelente! Obrigado pelo feedback 🎉"}
                  {rating === 4 && "Muito bom! Vamos melhorar ainda mais 👍"}
                  {rating === 3 && "Bom! Como podemos melhorar? 🤔"}
                  {rating <= 2 && "Que pena! Vamos trabalhar para melhorar 💪"}
                </p>
              </div>
            )}
          </div>
        </McCard>

        {/* Benefits Reminder */}
        <McCard className="bg-muted/30">
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">Vantagens do McSmart:</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-primary">✓</span>
                <span>Sem filas, sem espera</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">✓</span>
                <span>Comida sempre fresca com IA</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">✓</span>
                <span>Retirada rápida e segura</span>
              </li>
            </ul>
          </div>
        </McCard>

        {/* Actions */}
        <div className="space-y-3">
          <McButton onClick={handleFinish} icon={Home}>
            Fazer Novo Pedido
          </McButton>
          
          <button
            onClick={() => navigate("/stores")}
            className="w-full py-3 text-muted-foreground hover:text-foreground transition-colors"
          >
            Voltar ao início
          </button>
        </div>
      </div>
    </div>
  );
}
