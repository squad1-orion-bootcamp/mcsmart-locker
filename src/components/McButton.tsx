import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface McButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  icon?: LucideIcon;
  variant?: "primary" | "secondary" | "outline";
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export const McButton = ({ 
  children, 
  onClick, 
  icon: Icon, 
  variant = "primary",
  className,
  disabled,
  type = "button"
}: McButtonProps) => {
  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-full h-14 text-base font-semibold rounded-2xl transition-all duration-300",
        variant === "primary" && "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg",
        variant === "secondary" && "bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-md hover:shadow-lg",
        variant === "outline" && "bg-transparent border-2 border-primary text-foreground hover:bg-primary/10",
        className
      )}
    >
      {Icon && <Icon className="mr-2 h-5 w-5" />}
      {children}
    </Button>
  );
};
