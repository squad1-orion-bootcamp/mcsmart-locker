import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, PackageOpen } from "lucide-react";

const LockerSimulation = () => {
  const [code, setCode] = useState("");
  const [orderId, setOrderId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLockerOpen, setIsLockerOpen] = useState(false);

  const handlePickup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !orderId) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    setIsLoading(true);
    try {
      const webhookUrl = `${import.meta.env.VITE_N8N_WEBHOOK_URL}/verifyCode`;
      
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code, orderId }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Código verificado! Portas se abrindo...", {
          icon: <PackageOpen className="h-5 w-5" />,
        });
        setIsLockerOpen(true);
        setTimeout(() => {
          setCode("");
          setOrderId("");
          setIsLockerOpen(false);
        }, 5000); // Reset after 5 seconds
      } else {
        toast.error("Código inválido ou expirado.");
      }
    } catch (error) {
      console.error("Erro ao verificar código:", error);
      toast.error("Erro de conexão com o sistema.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4">
      {/* Simulation Container - Represents the physical screen bezel */}
      <div className="w-full max-w-lg bg-black p-2 rounded-3xl shadow-2xl border-4 border-neutral-800 relative overflow-hidden">
        {/* Screen Content */}
        <div className="bg-neutral-900 rounded-2xl h-[600px] flex flex-col items-center justify-center relative overflow-hidden">
          
          {/* Success Inner Content (Revealed when open) */}
          <div className="absolute inset-0 bg-yellow-500 flex flex-col items-center justify-center z-0 p-8 text-center animate-in fade-in duration-1000">
            <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-6 shadow-xl animate-bounce">
              <PackageOpen className="h-16 w-16 text-black" />
            </div>
            <h2 className="text-4xl font-bold text-black mb-2">Pedido Retirado!</h2>
            <p className="text-black/80 font-medium">Obrigado por comprar no McDonald's</p>
            <div className="mt-8 bg-black/10 px-4 py-2 rounded-full">
              <p className="text-black text-sm font-bold">Porta Closing im 5s</p>
            </div>
          </div>

          {/* Door Overlay Container */}
          <div className={`absolute inset-0 z-10 flex transition-transform duration-1000 ease-in-out ${isLockerOpen ? 'pointer-events-none' : ''}`}>
             
             {/* Left Door */}
            <div className={`w-1/2 h-full bg-neutral-900 flex flex-col items-end justify-center pr-1 transition-transform duration-1000 ease-in-out ${isLockerOpen ? '-translate-x-full' : 'translate-x-0'}`}>
               {/* Door texture/detail */}
               <div className="w-2 h-32 bg-neutral-800 rounded-l-md mb-2"></div>
            </div>

            {/* Right Door */}
            <div className={`w-1/2 h-full bg-neutral-900 flex flex-col items-start justify-center pl-1 transition-transform duration-1000 ease-in-out ${isLockerOpen ? 'translate-x-full' : 'translate-x-0'}`}>
               {/* Door texture/detail */}
                <div className="w-2 h-32 bg-neutral-800 rounded-r-md mb-2"></div>
            </div>

            {/* Content Over Doors (The Input Form) - Only visible when closed */}
             <div className={`absolute inset-0 flex flex-col items-center justify-center p-8 transition-opacity duration-500 ${isLockerOpen ? 'opacity-0' : 'opacity-100'}`}>
                
                {/* Decorative background elements */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-50" />
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-red-500/5 rounded-full blur-3xl" />

                {/* Header */}
                <div className="text-center mb-12 relative z-10">
                  <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Smart Locker</h1>
                  <p className="text-neutral-400 text-sm uppercase tracking-widest">Ponto de Retirada</p>
                </div>

                {/* Interaction Area */}
                <form onSubmit={handlePickup} className="w-full max-w-xs space-y-6 relative z-10">
                  <div className="space-y-2">
                    <label htmlFor="orderId" className="text-sm font-medium text-neutral-300 ml-1">
                      Número do Pedido
                    </label>
                    <Input
                      id="orderId"
                      type="text"
                      value={orderId}
                      onChange={(e) => setOrderId(e.target.value)}
                      placeholder="Ex: 1234"
                      className="bg-neutral-800/50 border-neutral-700 text-white text-center text-2xl h-16 tracking-widest placeholder:text-neutral-600 focus:border-yellow-500 focus:ring-yellow-500 transition-all mb-4"
                      autoComplete="off"
                    />
                    <label htmlFor="code" className="text-sm font-medium text-neutral-300 ml-1">
                      Código de Retirada
                    </label>
                    <Input
                      id="code"
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value.toUpperCase())}
                      placeholder="Ex: 123456"
                      className="bg-neutral-800/50 border-neutral-700 text-white text-center text-2xl h-16 tracking-widest placeholder:text-neutral-600 focus:border-yellow-500 focus:ring-yellow-500 transition-all uppercase"
                      maxLength={6}
                      autoComplete="off"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-14 text-lg bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition-all shadow-[0_0_20px_-5px_rgba(234,179,8,0.3)] hover:shadow-[0_0_25px_-5px_rgba(234,179,8,0.5)]"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Verificando...
                      </>
                    ) : (
                      "Retirar Pedido"
                    )}
                  </Button>
                </form>

                {/* Footer simulation */}
                <div className="absolute bottom-6 text-neutral-600 text-xs">
                  ID do Terminal: DASXZ-54
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LockerSimulation;
