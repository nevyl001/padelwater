import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

type WhatsAppLinkProps = {
  children: React.ReactNode;
  message?: string;
  className?: string;
  variant?: "primary" | "secondary" | "ghost" | "lime";
  size?: "md" | "lg";
  magnetic?: boolean;
};

export function WhatsAppLink({
  children,
  message,
  className,
  variant = "primary",
  size = "md",
  magnetic = false,
}: WhatsAppLinkProps) {
  return (
    <Button
      href={buildWhatsAppUrl(message)}
      external
      variant={variant}
      size={size}
      magnetic={magnetic}
      className={cn(className)}
    >
      {children}
    </Button>
  );
}
