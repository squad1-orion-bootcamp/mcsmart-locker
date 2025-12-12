import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { McHeader } from "@/components/McHeader";
import { McButton } from "@/components/McButton";
import { McCard } from "@/components/McCard";
import { MapPin, Clock, Box, Loader2 } from "lucide-react";

export default function LockerReady() {
  const navigate = useNavigate();
  const location = useLocation();
  const order = location.state?.order;
  const [showCode, setShowCode] = useState(false);
  const [accessCode] = useState(
    () => String(Math.floor(Math.random() * 1_000_000)).padStart(6, "0")
  );
  
  const [qrCodeBase64, setQrCodeBase64] = useState<string | null>(null);
  const [isLoadingQr, setIsLoadingQr] = useState(true);

  useEffect(() => {
    const fetchQRCode = async () => {
      if (!order?.id) return;

      try {
        const webhookUrl = `${import.meta.env.VITE_N8N_WEBHOOK_URL}/createQRCode`;
        
        const response = await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ orderId: order.id }),
        });

        if (response.ok) {
          const data = await response.json();
          // Expecting { qrcode: "base64string..." } or just the string if the webhook handles it that way
          // Based on common n8n patterns, let's assume it returns a JSON with a field or the string directly.
          // Let's handle both cases if possible or assume a standard field 'qrcode'.
          // Implementation plan said: Output: { qrcode: "data:image/png;base64,..." }
          
          if (data.qrcode) {
             setQrCodeBase64(data.qrcode);
          } else if (typeof data === 'string' && data.startsWith('data:image')) {
             setQrCodeBase64(data);
          }
        }
      } catch (error) {
        console.error("Failed to fetch QR Code:", error);
      } finally {
        setIsLoadingQr(false);
      }
    };

    fetchQRCode();
  }, [order?.id]);

  const handleOpenLocker = () => {
    // Simular abertura do locker
    setTimeout(() => {
      navigate("/pickup-confirmed", { state: { order } });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      <McHeader title="Retirar Pedido" showBack={false} />

      <div className="p-6 space-y-6">
        {/* Status Card */}
        <McCard elevated className="text-center bg-gradient-to-br from-primary/10 to-primary/5">
          <div className="py-6 space-y-4">
            <div className="inline-flex p-4 rounded-3xl bg-primary">
              <Box className="h-12 w-12 text-primary-foreground" />
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Pedido Pronto!
              </h2>
              <p className="text-muted-foreground">
                Seu pedido está no locker {order?.locker} aguardando retirada
              </p>
            </div>
          </div>
        </McCard>

        {/* Locker Info */}
        <McCard elevated>
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground text-lg">Informações do Locker</h3>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 rounded-lg bg-primary/10">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">McDonald's Shopping Center</p>
                  <p className="text-muted-foreground">Entrada lateral - Área de Lockers</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Box className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Locker {order?.locker}</p>
                  <p className="text-muted-foreground">Corredor {order?.locker}, posição {order?.locker}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Válido por 15 minutos</p>
                  <p className="text-muted-foreground">Retire até 18:45</p>
                </div>
              </div>
            </div>
          </div>
        </McCard>

        {/* QR Code */}
        <McCard elevated className="text-center">
          <div className="py-6 space-y-6">
            <div>
              <h3 className="font-semibold text-foreground text-lg mb-2">
                Código de Acesso
              </h3>
              <p className="text-sm text-muted-foreground">
                Aproxime este QR Code do leitor do locker
              </p>
            </div>

            <div className="flex justify-center">
              <div className="p-6 bg-white rounded-2xl shadow-lg min-h-[240px] w-[240px] flex items-center justify-center">
                {isLoadingQr ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="text-sm text-muted-foreground">Gerando QR Code...</span>
                  </div>
                ) : qrCodeBase64 ? (
                  <img 
                    src={qrCodeBase64} 
                    alt="QR Code de Retirada" 
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-red-500 text-sm">
                    Erro ao carregar QR Code
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Código numérico de backup:</p>
              <div className="flex justify-center">
                <button
                  onClick={() => setShowCode(!showCode)}
                  className="px-6 py-3 bg-muted rounded-xl font-mono text-xl font-bold text-foreground hover:bg-muted/80 transition-colors"
                >
                  {showCode ? accessCode : "••••••"}
                </button>
              </div>
            </div>
          </div>
        </McCard>

        {/* Instruções */}
        <McCard className="bg-muted/30">
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">Como retirar:</h3>
            <ol className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="font-bold text-primary">1.</span>
                <span>Localize o locker B-07 na área de retirada</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-primary">2.</span>
                <span>Aproxime o QR Code do leitor do locker</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-primary">3.</span>
                <span>Aguarde a porta abrir automaticamente</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-primary">4.</span>
                <span>Retire seu pedido e feche a porta</span>
              </li>
            </ol>
          </div>
        </McCard>
      </div>

      {/* Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-background border-t border-border">
        <McButton onClick={handleOpenLocker}>
          Abri o Locker
        </McButton>
        <p className="text-center text-xs text-muted-foreground mt-3">
          Clique após aproximar o QR Code
        </p>
      </div>
    </div>
  );
}
