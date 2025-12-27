import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { McHeader } from "@/components/McHeader";
import { McButton } from "@/components/McButton";
import { McCard } from "@/components/McCard";
import { MapPin, Clock, Box, Loader2, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function LockerReady() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();
  const order = location.state?.order;
  const [showCode, setShowCode] = useState(false);
  const [accessCode, setAccessCode] = useState<string | null>(null);
  const [lockerNumber, setLockerNumber] = useState<string | number | undefined>(order?.locker);
  const [isCopied, setIsCopied] = useState(false);
  
  const [qrCodeBase64, setQrCodeBase64] = useState<string | null>(null);
  const [isLoadingQr, setIsLoadingQr] = useState(true);

  useEffect(() => {
    const fetchQRCode = async () => {

      if (!order?.id) {
        console.error("No order ID found");
        return;
      }

      try {
        const webhookUrl = `${import.meta.env.VITE_N8N_WEBHOOK_URL}/qrCode`;

        
        const response = await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ orderId: order.id }),
        });

        if (response.ok) {
          const textData = await response.text();

          
          if (!textData) {
             console.error("Webhook returned empty response");
             return;
          }

          let data;
          try {
             data = JSON.parse(textData);
          } catch (e) {
             console.error("Failed to parse webhook response as JSON:", e);
             return;
          }


          
          // N8N return might be an array or object
          const result = Array.isArray(data) ? data[0] : data;

          
          // Look for 'baseUrlQrCode', 'qrcode', 'data', or use result itself
          const qrCodeParsed = result?.baseUrlQrCode || result?.qrcode || result?.data || result;

          
          if (result?.locker) {
            setLockerNumber(result.locker);
          }
          
          if (result?.token) {
            setAccessCode(result.token);
          }
          
          if (typeof qrCodeParsed === 'string') {
             // If it starts with data:image, use it as is
             if (qrCodeParsed.startsWith('data:image')) {
                setQrCodeBase64(qrCodeParsed);
             } else {
                // Otherwise assume it's raw base64 png
                const finalString = `data:image/png;base64,${qrCodeParsed}`;

                setQrCodeBase64(finalString);
             }
          }
        } 
      } catch (error) {
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
                Seu pedido está no locker {lockerNumber} aguardando retirada
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
                  <p className="font-medium text-foreground">Locker {lockerNumber}</p>
                  <p className="text-muted-foreground">Corredor {lockerNumber}, posição {lockerNumber}</p>
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
                  <div className="flex flex-col items-center justify-center p-6 text-center">
                    <p className="text-muted-foreground text-sm mb-2">Use o código:</p>
                    <span className="text-4xl font-mono font-bold text-foreground tracking-widest">
                      {accessCode || "---"}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Código numérico de backup:</p>
              <div className="flex flex-col justify-center items-center gap-3">
                <button
                  onClick={() => setShowCode(!showCode)}
                  className="px-6 py-3 bg-muted rounded-xl font-mono text-xl font-bold text-foreground hover:bg-muted/80 transition-colors"
                >
                  {showCode ? (accessCode || "Carregando...") : "••••••"}
                </button>
                {accessCode && (
                  <button
                    onClick={() => {
                        if (accessCode) {
                            navigator.clipboard.writeText(accessCode);
                            setIsCopied(true);
                            setTimeout(() => setIsCopied(false), 2000);
                        }
                    }}
                    className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors"
                  >
                    {isCopied ? (
                        <>
                            <Check className="h-3 w-3 text-green-500" />
                            <span className="text-green-500">Copiado!</span>
                        </>
                    ) : (
                        <>
                            <Copy className="h-3 w-3" />
                            <span>Copiar código</span>
                        </>
                    )}
                  </button>
                )}
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
