import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { McHeader } from "@/components/McHeader";
import { McButton } from "@/components/McButton";
import { McCard } from "@/components/McCard";
import { Lock, CreditCard, Smartphone, Box } from "lucide-react";

export default function Checkout() {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState<"locker" | "counter">("locker");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "pix">("card");

  const handleConfirm = () => {
    if (selectedMethod === "locker") {
      navigate("/location-permission");
    } else {
      // Fluxo tradicional
      navigate("/order-status");
    }
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      <McHeader title="Finalizar Pedido" />

      <div className="p-6 space-y-6">
        {/* Método de Retirada */}
        <div>
          <h2 className="text-xl font-bold text-foreground mb-4">Método de Retirada</h2>
          
          <div className="space-y-3">
            <McCard
              icon={Box}
              onClick={() => setSelectedMethod("locker")}
              className={`cursor-pointer transition-all ${
                selectedMethod === "locker"
                  ? "border-2 border-primary bg-primary/5"
                  : "border border-border"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    Retirada Inteligente (Locker)
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Sem filas • Preparo sincronizado • Comida fresca
                  </p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedMethod === "locker"
                    ? "border-primary bg-primary"
                    : "border-border"
                }`}>
                  {selectedMethod === "locker" && (
                    <div className="w-2.5 h-2.5 rounded-full bg-primary-foreground" />
                  )}
                </div>
              </div>
            </McCard>

            <McCard
              icon={Smartphone}
              onClick={() => setSelectedMethod("counter")}
              className={`cursor-pointer transition-all ${
                selectedMethod === "counter"
                  ? "border-2 border-primary bg-primary/5"
                  : "border border-border"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    Retirada no Balcão
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Método tradicional
                  </p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedMethod === "counter"
                    ? "border-primary bg-primary"
                    : "border-border"
                }`}>
                  {selectedMethod === "counter" && (
                    <div className="w-2.5 h-2.5 rounded-full bg-primary-foreground" />
                  )}
                </div>
              </div>
            </McCard>
          </div>
        </div>

        {/* Pagamento */}
        <div>
          <h2 className="text-xl font-bold text-foreground mb-4">Pagamento</h2>
          
          <div className="space-y-3">
            <McCard
              icon={CreditCard}
              onClick={() => setPaymentMethod("card")}
              className={`cursor-pointer transition-all ${
                paymentMethod === "card"
                  ? "border-2 border-primary bg-primary/5"
                  : "border border-border"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground">Cartão de Crédito</span>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  paymentMethod === "card"
                    ? "border-primary bg-primary"
                    : "border-border"
                }`}>
                  {paymentMethod === "card" && (
                    <div className="w-2.5 h-2.5 rounded-full bg-primary-foreground" />
                  )}
                </div>
              </div>
            </McCard>

            <McCard
              onClick={() => setPaymentMethod("pix")}
              className={`cursor-pointer transition-all ${
                paymentMethod === "pix"
                  ? "border-2 border-primary bg-primary/5"
                  : "border border-border"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground">PIX</span>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  paymentMethod === "pix"
                    ? "border-primary bg-primary"
                    : "border-border"
                }`}>
                  {paymentMethod === "pix" && (
                    <div className="w-2.5 h-2.5 rounded-full bg-primary-foreground" />
                  )}
                </div>
              </div>
            </McCard>
          </div>
        </div>

        {/* Resumo */}
        <McCard elevated className="bg-muted/30">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-semibold">R$ 79,60</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Taxa de serviço</span>
              <span className="font-semibold">R$ 0,00</span>
            </div>
            <div className="border-t border-border pt-3 flex justify-between">
              <span className="font-bold text-lg">Total</span>
              <span className="font-bold text-xl text-primary">R$ 79,60</span>
            </div>
          </div>
        </McCard>
      </div>

      {/* Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-background border-t border-border">
        <McButton onClick={handleConfirm} icon={Lock}>
          Confirmar Pedido
        </McButton>
      </div>
    </div>
  );
}
