"use client";

import { useState } from "react";
import { CreditCard, ShoppingCartIcon as Paypal, Apple } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PaymentMethodDetails } from "./payment/payment-method-details";
import { TransactionCompletedAlert } from "./payment/transaction-completed-alert";

const paymentMethods = [
  { id: "card", name: "Credit Card", icon: CreditCard },
  { id: "paypal", name: "PayPal", icon: Paypal },
  { id: "apple", name: "Apple Pay", icon: Apple },
];

export function PaymentMethod() {
  const [selectedMethod, setSelectedMethod] = useState("card");
  const [showCompletedAlert, setShowCompletedAlert] = useState(false);

  const handlePayment = () => {
    // Simulate payment processing
    setTimeout(() => {
      setShowCompletedAlert(true);
    }, 1000);
  };

  return (
    <>
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
          <CardDescription>
            Choose your preferred payment method
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            defaultValue="card"
            onValueChange={(value: any) => setSelectedMethod(value)}
            className="grid grid-cols-3 gap-4"
          >
            {paymentMethods.map((method) => (
              <Label
                key={method.id}
                htmlFor={method.id}
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
              >
                <RadioGroupItem
                  value={method.id}
                  id={method.id}
                  className="sr-only"
                />
                <method.icon className="mb-3 h-6 w-6" />
                {method.name}
              </Label>
            ))}
          </RadioGroup>

          <PaymentMethodDetails method={selectedMethod} />
        </CardContent>
        <CardFooter>
          <Button className="w-full bg-blue-600 text-white" onClick={handlePayment}>
            Pay Now
          </Button>
        </CardFooter>
      </Card>

      {showCompletedAlert && (
        <TransactionCompletedAlert
          onClose={() => setShowCompletedAlert(false)}
        />
      )}
    </>
  );
}
