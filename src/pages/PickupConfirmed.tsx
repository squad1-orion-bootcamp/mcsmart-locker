import { useNavigate } from "react-router-dom";
import { McButton } from "@/components/McButton";
import { McCard } from "@/components/McCard";
import { CheckCircle2, Star, Home } from "lucide-react";
import { useState } from "react";

export default function PickupConfirmed() {
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleFinish = () => {
    // Enviar avaliação e voltar ao início
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
            <p className="text-3xl font-bold text-foreground">#1547</p>
            <div className="pt-2 border-t border-border/50 mt-4">
              <p className="text-sm text-muted-foreground">Retirado às</p>
              <p className="font-semibold text-foreground">18:32</p>
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
                  onClick={() => setRating(star)}
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
              <p className="text-sm font-medium text-primary">
                {rating === 5 && "Excelente! Obrigado pelo feedback 🎉"}
                {rating === 4 && "Muito bom! Vamos melhorar ainda mais 👍"}
                {rating === 3 && "Bom! Como podemos melhorar? 🤔"}
                {rating <= 2 && "Que pena! Vamos trabalhar para melhorar 💪"}
              </p>
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
