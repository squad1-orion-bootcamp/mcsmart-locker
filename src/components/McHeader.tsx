import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface McHeaderProps {
  title: string;
  onBack?: () => void;
  showBack?: boolean;
  className?: string;
}

export const McHeader = ({ title, onBack, showBack = true, className }: McHeaderProps) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <header className={cn("flex items-center gap-4 p-4 bg-background border-b border-border", className)}>
      {showBack && (
        <button
          onClick={handleBack}
          className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors"
          aria-label="Voltar"
        >
          <ArrowLeft className="h-6 w-6 text-foreground" />
        </button>
      )}
      <h1 className="text-xl font-bold text-foreground">{title}</h1>
    </header>
  );
};
