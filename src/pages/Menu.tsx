import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { McHeader } from "@/components/McHeader";
import { McButton } from "@/components/McButton";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, ShoppingCart } from "lucide-react";

const menuItems = [
  {
    id: 1,
    name: "Big Mac",
    description: "Dois hambúrgueres, alface, queijo, molho especial",
    price: 28.90,
    image: "🍔"
  },
  {
    id: 2,
    name: "McChicken",
    description: "Frango empanado crocante com maionese",
    price: 22.90,
    image: "🍗"
  },
  {
    id: 3,
    name: "Batata Frita Grande",
    description: "Batatas fritas crocantes e douradas",
    price: 12.90,
    image: "🍟"
  },
  {
    id: 4,
    name: "McFlurry Ovomaltine",
    description: "Sorvete cremoso com Ovomaltine",
    price: 14.90,
    image: "🍦"
  }
];

export default function Menu() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<Record<number, number>>({});

  const addToCart = (itemId: number) => {
    setCart(prev => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
  };

  const removeFromCart = (itemId: number) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[itemId] > 1) {
        newCart[itemId]--;
      } else {
        delete newCart[itemId];
      }
      return newCart;
    });
  };

  const totalItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  const totalPrice = menuItems.reduce((sum, item) => 
    sum + (cart[item.id] || 0) * item.price, 0
  );

  return (
    <div className="min-h-screen bg-background pb-32">
      <McHeader title="Cardápio" />

      <div className="p-6 space-y-4">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">Monte seu pedido</h2>
          <p className="text-muted-foreground">Selecione os itens desejados</p>
        </div>

        {menuItems.map((item) => (
          <div
            key={item.id}
            className="bg-card rounded-2xl p-4 shadow-[var(--shadow-card)] transition-all hover:shadow-[var(--shadow-elevated)]"
          >
            <div className="flex gap-4">
              <div className="text-6xl">{item.image}</div>
              
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-1">{item.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-foreground">
                    R$ {item.price.toFixed(2)}
                  </span>
                  
                  {cart[item.id] ? (
                    <div className="flex items-center gap-3 bg-muted rounded-xl p-1">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 rounded-lg hover:bg-background transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="font-semibold min-w-[2ch] text-center">
                        {cart[item.id]}
                      </span>
                      <button
                        onClick={() => addToCart(item.id)}
                        className="p-2 rounded-lg hover:bg-background transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addToCart(item.id)}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors"
                    >
                      Adicionar
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-background border-t border-border shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-primary" />
              <span className="font-semibold text-foreground">
                {totalItems} {totalItems === 1 ? "item" : "itens"}
              </span>
            </div>
            <span className="text-xl font-bold text-foreground">
              R$ {totalPrice.toFixed(2)}
            </span>
          </div>
          
          <McButton onClick={() => navigate("/checkout")}>
            Continuar para Checkout
          </McButton>
        </div>
      )}
    </div>
  );
}
