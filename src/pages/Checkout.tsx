import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { McHeader } from "@/components/McHeader";
import { McButton } from "@/components/McButton";
import { McCard } from "@/components/McCard";
import { Lock, CreditCard, Smartphone, Box, Loader2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Checkout() {
  const navigate = useNavigate();
  const { items, total } = useCart();
  const { toast } = useToast();
  const [selectedMethod, setSelectedMethod] = useState<"locker" | "counter">("locker");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "pix">("card");
  const [whatsapp, setWhatsapp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    if (!whatsapp) {
      toast({
        title: "WhatsApp necessário",
        description: "Por favor, informe seu WhatsApp para receber atualizações do pedido.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    const order = {
      id: Math.floor(Math.random() * 10000).toString(),
      whatsapp,
      items,
      status: "pending",
      total,
      paymentMethod,
      pickupMethod: selectedMethod
    };

    try {
      const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_CREATE_ORDER_WEBHOOK_URL;
      
      if (N8N_WEBHOOK_URL) {
        await fetch(N8N_WEBHOOK_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(order),
        });
      } else {
        console.warn("VITE_N8N_CREATE_ORDER_WEBHOOK_URL not configured");
      }

      if (selectedMethod === "locker") {
        navigate("/location-permission", { state: { order } });
      } else {
        navigate("/order-status", { state: { order } });
      }
    } catch (error) {
      console.error("Error creating order:", error);
      toast({
        title: "Erro ao criar pedido",
        description: "Houve um problema ao processar seu pedido. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
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

        {/* Dados do Cliente */}
        <div>
          <h2 className="text-xl font-bold text-foreground mb-4">Seus Dados</h2>
          <McCard className="p-4 border border-border">
            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp para contato</Label>
              <Input
                id="whatsapp"
                placeholder="(11) 99999-9999"
                value={whatsapp}
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, "");
                  if (value.length > 11) value = value.slice(0, 11);
                  
                  let formatted = value;
                  if (value.length > 10) {
                    // Mobile: (XX) XXXXX-XXXX
                    formatted = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
                  } else if (value.length > 6) {
                    // Landline/Typing: (XX) XXXX-XXXX
                    formatted = `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(6)}`;
                  } else if (value.length > 2) {
                    // Started number: (XX) X...
                    formatted = `(${value.slice(0, 2)}) ${value.slice(2)}`;
                  } else if (value.length === 2) {
                    // Area code complete: (XX)
                    formatted = `(${value.slice(0, 2)})`;
                  } else if (value.length > 0) {
                    // Start: (X...
                    formatted = `(${value}`;
                  }
                  
                  setWhatsapp(formatted);
                }}
                type="tel"
                maxLength={15}
              />
              <p className="text-xs text-muted-foreground">
                Enviaremos o status do seu pedido por aqui.
              </p>
            </div>
          </McCard>
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
              <span className="font-semibold">R$ {total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Taxa de serviço</span>
              <span className="font-semibold">R$ 0,00</span>
            </div>
            <div className="border-t border-border pt-3 flex justify-between">
              <span className="font-bold text-lg">Total</span>
              <span className="font-bold text-xl text-primary">R$ {total.toFixed(2)}</span>
            </div>
          </div>
        </McCard>
      </div>

      {/* Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-background border-t border-border">
        <McButton onClick={handleConfirm} icon={isSubmitting ? Loader2 : Lock} disabled={isSubmitting}>
          {isSubmitting ? "Processando..." : "Confirmar Pedido"}
        </McButton>
      </div>
    </div>
  );
}
