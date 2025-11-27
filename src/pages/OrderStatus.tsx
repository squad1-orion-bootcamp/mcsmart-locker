import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { McHeader } from "@/components/McHeader";
import { McCard } from "@/components/McCard";
import { Loader2, Brain, CheckCircle2, Package, MessageCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { openWhatsApp } from "@/lib/whatsapp";

const statusSteps = [
  { label: "Pedido confirmado", progress: 25, icon: CheckCircle2 },
  { label: "IA sincronizando preparo", progress: 50, icon: Brain },
  { label: "Preparando seu pedido", progress: 75, icon: Package },
  { label: "Pronto para retirada", progress: 100, icon: CheckCircle2 }
];

export default function OrderStatus() {
  const navigate = useNavigate();
  const location = useLocation();
  const order = location.state?.order;
  const [currentStep, setCurrentStep] = useState(0);
  const [distance, setDistance] = useState(2.5);

  useEffect(() => {
    // Simular progresso
    const timer = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < statusSteps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(timer);
          setTimeout(() => navigate("/locker-ready"), 2000);
          return prev;
        }
      });
    }, 3000);

    // Simular aproximação
    const distanceTimer = setInterval(() => {
      setDistance(prev => Math.max(0, prev - 0.1));
    }, 2000);

    return () => {
      clearInterval(timer);
      clearInterval(distanceTimer);
    };
  }, [navigate]);

  const step = statusSteps[currentStep];

  return (
    <div className="min-h-screen bg-background">
      <McHeader title="Status do Pedido" showBack={false} />

      <div className="p-6 space-y-6">
        {/* Número do Pedido */}
        <McCard elevated className="text-center bg-gradient-to-br from-primary/10 to-primary/5">
          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-2">Número do Pedido</p>
            <h2 className="text-4xl font-bold text-foreground">#{order?.id || "1547"}</h2>
          </div>
        </McCard>

        {/* Status Atual */}
        <McCard icon={step.icon} elevated>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {currentStep < statusSteps.length - 1 && (
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              )}
              <h3 className="text-xl font-semibold text-foreground">{step.label}</h3>
            </div>
            
            <Progress value={step.progress} className="h-2" />
            
            <p className="text-sm text-muted-foreground">
              {currentStep === 1 && "Nossa IA está calculando o melhor momento para iniciar o preparo"}
              {currentStep === 2 && "Seu pedido está sendo preparado com ingredientes frescos"}
              {currentStep === 3 && "Pronto! Dirija-se ao locker para retirar"}
            </p>
          </div>
        </McCard>

        {/* IA Tracking */}
        {currentStep >= 1 && (
          <McCard icon={Brain} elevated className="bg-muted/30">
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">IA Sincronizada</h3>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Distância da loja</span>
                  <span className="font-semibold text-foreground">{distance.toFixed(1)} km</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tempo estimado</span>
                  <span className="font-semibold text-foreground">
                    {Math.ceil(distance * 4)} min
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Preparo iniciado</span>
                  <span className="font-semibold text-primary">
                    {currentStep >= 2 ? "Sim" : "Aguardando"}
                  </span>
                </div>
              </div>

              {distance < 1 && (
                <div className="mt-4 p-3 bg-primary/10 rounded-xl">
                  <p className="text-sm text-foreground text-center">
                    🎯 Você está quase chegando! Pedido será finalizado em instantes.
                  </p>
                </div>
              )}
            </div>
          </McCard>
        )}

        {/* MéquiZap Promo Banner */}
        <McCard className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
              <MessageCircle className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <h3 className="font-semibold text-foreground mb-1">
                  Já pensou pedir direto pelo WhatsApp? 🤖📱
                </h3>
                <p className="text-sm text-muted-foreground">
                  Conheça o MéquiZap: nossa IA que faz pedidos rapidinho no zap!
                </p>
              </div>
              <button
                onClick={() =>
                  openWhatsApp()
                }
                className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1"
              >
                Abrir no WhatsApp
                <span className="text-lg">→</span>
              </button>
            </div>
          </div>
        </McCard>

        {/* Timeline de Status */}
        <McCard elevated>
          <h3 className="font-semibold text-foreground mb-4">Progresso</h3>
          
          <div className="space-y-4">
            {statusSteps.map((s, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  index <= currentStep
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}>
                  {index < currentStep ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <s.icon className="h-5 w-5" />
                  )}
                </div>
                
                <div className="flex-1">
                  <p className={`font-medium ${
                    index <= currentStep ? "text-foreground" : "text-muted-foreground"
                  }`}>
                    {s.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </McCard>
      </div>
    </div>
  );
}
