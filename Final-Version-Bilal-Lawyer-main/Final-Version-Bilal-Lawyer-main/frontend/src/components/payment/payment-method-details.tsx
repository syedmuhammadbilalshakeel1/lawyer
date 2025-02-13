import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PaymentMethodDetailsProps {
  method: string;
}

export function PaymentMethodDetails({ method }: PaymentMethodDetailsProps) {
  if (method === "card") {
    return (
      <div className="space-y-4 mt-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cardName">Name on Card</Label>
            <Input id="cardName" placeholder="John Doe" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="expiry">Expiry Date</Label>
            <Input id="expiry" placeholder="MM/YY" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cvc">CVC</Label>
            <Input id="cvc" placeholder="123" />
          </div>
        </div>
      </div>
    );
  }

  if (method === "paypal") {
    return (
      <div className="space-y-4 mt-4">
        <div className="space-y-2">
          <Label htmlFor="paypalEmail">PayPal Email</Label>
          <Input id="paypalEmail" type="email" placeholder="you@example.com" />
        </div>
      </div>
    );
  }

  if (method === "apple") {
    return (
      <div className="mt-4 text-center text-sm text-muted-foreground">
        You will be redirected to Apple Pay to complete your payment.
      </div>
    );
  }

  return null;
}
