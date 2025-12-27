const DEFAULT_WHATSAPP_NUMBER = "5569992717580";

export function openWhatsApp() {
  const message = "Olá! Quero conhecer o MéquiZap."
  const base = `https://wa.me/${DEFAULT_WHATSAPP_NUMBER}`;

  const url = message
    ? `${base}?text=${encodeURIComponent(message)}`
    : base;

  window.open(url, "_blank");
}
