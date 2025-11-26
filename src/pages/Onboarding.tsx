import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { McButton } from "@/components/McButton";
import { McCard } from "@/components/McCard";
import { Smartphone, Zap, Lock, ArrowRight, MessageCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { openWhatsApp } from "@/lib/whatsapp";

const onboardingSteps = [
  {
    icon: Smartphone,
    title: "Retirada Inteligente",
    description:
      "Retire seu pedido em lockers automatizados sem filas e sem espera",
  },
  {
    icon: Zap,
    title: "Preparo Just-in-Time",
    description:
      "Nossa IA sincroniza o preparo com sua chegada para garantir comida sempre fresca",
  },
  {
    icon: Lock,
    title: "Seguro e Rápido",
    description:
      "Acesso exclusivo com QR Code. Seu pedido protegido até você chegar",
  },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowWhatsAppModal(true);
    }
  };

  const handleWhatsAppCTA = () => {
    openWhatsApp();
    navigate("/stores");
  };

  const handleWhatsAppSkip = () => {
    setShowWhatsAppModal(false);
    navigate("/stores");
  };

  const handleSkip = () => {
    navigate("/stores");
  };

  const step = onboardingSteps[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-2">McSmart</h1>
            <p className="text-lg text-muted-foreground">Pick-up</p>
          </div>

          {/* Step Card */}
          <McCard elevated className="bg-card text-center">
            <div className="flex flex-col items-center space-y-6 py-8">
              <div className="p-6 rounded-3xl bg-primary/10">
                <step.icon className="h-16 w-16 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-3">
                  {step.title}
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed px-4">
                  {step.description}
                </p>
              </div>
            </div>
          </McCard>

          {/* Progress Indicators */}
          <div className="flex justify-center gap-2">
            {onboardingSteps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentStep ? "w-8 bg-primary" : "w-2 bg-border"
                }`}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <McButton
              onClick={handleNext}
              icon={
                currentStep === onboardingSteps.length - 1
                  ? ArrowRight
                  : undefined
              }
            >
              {currentStep === onboardingSteps.length - 1
                ? "Começar"
                : "Próximo"}
            </McButton>

            {currentStep < onboardingSteps.length - 1 && (
              <button
                onClick={handleSkip}
                className="w-full py-3 text-muted-foreground hover:text-foreground transition-colors"
              >
                Pular introdução
              </button>
            )}
          </div>
        </div>
      </div>

      {/* MéquiZap WhatsApp Modal */}
      <Dialog open={showWhatsAppModal} onOpenChange={setShowWhatsAppModal}>
        <DialogContent className="sm:max-w-md border-0 p-0 gap-0 bg-card">
          <div className="p-6 pb-4">
            <DialogHeader className="space-y-3 text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <MessageCircle className="h-8 w-8 text-primary" />
              </div>
              <DialogTitle className="text-2xl font-bold text-foreground">
                Conheça o MéquiZap! 💛
              </DialogTitle>
              <DialogDescription className="text-base text-muted-foreground leading-relaxed">
                Peça pelo WhatsApp de forma rápida e simples. A mesma
                experiência do Méqui, direto no seu zap!
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="p-6 pt-2 space-y-3">
            <McButton onClick={handleWhatsAppCTA} icon={MessageCircle}>
              Quero testar no WhatsApp
            </McButton>
            <button
              onClick={handleWhatsAppSkip}
              className="w-full py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Agora não
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
