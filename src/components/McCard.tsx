import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface McCardProps {
  children: React.ReactNode;
  icon?: LucideIcon;
  title?: string;
  description?: string;
  onClick?: () => void;
  className?: string;
  elevated?: boolean;
}

export const McCard = ({ 
  children, 
  icon: Icon, 
  title, 
  description, 
  onClick,
  className,
  elevated = false
}: McCardProps) => {
  return (
    <Card
      onClick={onClick}
      className={cn(
        "p-6 rounded-2xl border-0 transition-all duration-300",
        elevated ? "shadow-[var(--shadow-elevated)]" : "shadow-[var(--shadow-card)]",
        onClick && "cursor-pointer hover:shadow-xl hover:scale-[1.02]",
        className
      )}
    >
      {(Icon || title) && (
        <div className="flex items-start gap-4 mb-4">
          {Icon && (
            <div className="p-3 rounded-xl bg-primary/10">
              <Icon className="h-6 w-6 text-primary" />
            </div>
          )}
          <div className="flex-1">
            {title && <h3 className="text-lg font-semibold text-foreground">{title}</h3>}
            {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
          </div>
        </div>
      )}
      {children}
    </Card>
  );
};
