import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useActor } from "@caffeineai/core-infrastructure";
import { useNavigate } from "@tanstack/react-router";
import { CheckCircle2, CreditCard, Phone, Tag, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PaymentMethod, createActor } from "../backend";
import type { Address } from "../backend";
import { useAuth } from "../hooks/use-auth";
import { useCart } from "../hooks/use-cart";
import { usePlaceOrder } from "../hooks/use-orders";
import { formatPrice } from "../lib/backend";

const STEPS = ["Review", "Delivery", "Payment"] as const;

const emptyAddress: Address = {
  fullName: "",
  street: "",
  city: "",
  state: "",
  country: "",
  postalCode: "",
  phone: "",
};

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { actor } = useActor(createActor);
  const { profile } = useAuth();
  const { items, products, clearItems } = useCart();
  const placeOrder = usePlaceOrder();

  const [step, setStep] = useState(0);
  const [address, setAddress] = useState<Address>(() => {
    if (profile?.addresses?.length) {
      const idx =
        profile.defaultAddressIndex !== undefined
          ? Number(profile.defaultAddressIndex)
          : 0;
      return profile.addresses[idx] ?? emptyAddress;
    }
    return emptyAddress;
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    PaymentMethod.Stripe,
  );
  const [momoPhone, setMomoPhone] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
  } | null>(null);
  const [couponError, setCouponError] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof Address, string>>
  >({});

  const subtotal = items.reduce((sum, item) => {
    const p = products[item.productId.toString()];
    return p ? sum + p.price * Number(item.quantity) : sum;
  }, 0);
  const discount = appliedCoupon?.discount ?? 0;
  const total = Math.max(0, subtotal - discount);

  const validateAddress = (): boolean => {
    const errors: Partial<Record<keyof Address, string>> = {};
    if (!address.fullName.trim()) errors.fullName = "Full name is required";
    if (!address.street.trim()) errors.street = "Street is required";
    if (!address.city.trim()) errors.city = "City is required";
    if (!address.state.trim()) errors.state = "State is required";
    if (!address.country.trim()) errors.country = "Country is required";
    if (!address.postalCode.trim())
      errors.postalCode = "Postal code is required";
    if (!address.phone.trim()) errors.phone = "Phone is required";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    if (step === 1 && !validateAddress()) return;
    setStep((s) => Math.min(s + 1, 2));
  };

  const handleValidateCoupon = async () => {
    if (!couponCode.trim() || !actor) return;
    setCouponLoading(true);
    setCouponError("");
    try {
      const categoryIds = items
        .map((i) => products[i.productId.toString()]?.categoryId)
        .filter(Boolean) as bigint[];
      const result = await actor.validateCoupon(
        couponCode.trim().toUpperCase(),
        subtotal,
        categoryIds,
      );
      if (result.isValid) {
        setAppliedCoupon({
          code: couponCode.trim().toUpperCase(),
          discount: result.discountAmount,
        });
        toast.success(result.message || "Coupon applied!");
      } else {
        setCouponError(result.message || "Invalid coupon code.");
      }
    } catch {
      setCouponError("Failed to validate coupon.");
    } finally {
      setCouponLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!validateAddress()) {
      setStep(1);
      return;
    }
    if (paymentMethod === PaymentMethod.MtnMomo && !momoPhone.trim()) {
      toast.error("Please enter your MTN MOMO phone number.");
      return;
    }
    try {
      const order = await placeOrder.mutateAsync({
        shippingAddress: address,
        paymentMethod,
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
        })),
        couponCode: appliedCoupon?.code,
      });
      clearItems();
      navigate({
        to: "/checkout/success",
        search: { orderId: order.id.toString() },
      });
    } catch {
      toast.error("Failed to place order. Please try again.");
    }
  };

  const setAddrField = (field: keyof Address, val: string) => {
    setAddress((p) => ({ ...p, [field]: val }));
    if (fieldErrors[field])
      setFieldErrors((p) => ({ ...p, [field]: undefined }));
  };

  const ADDRESS_FIELDS: {
    field: keyof Address;
    label: string;
    colSpan?: boolean;
  }[] = [
    { field: "fullName", label: "Full Name" },
    { field: "phone", label: "Phone" },
    { field: "street", label: "Street Address", colSpan: true },
    { field: "city", label: "City" },
    { field: "state", label: "State / Province" },
    { field: "country", label: "Country" },
    { field: "postalCode", label: "Postal Code" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8" data-ocid="checkout.page">
      <h1 className="text-2xl font-display font-semibold mb-8">Checkout</h1>

      {/* Step indicator */}
      <div className="flex items-center gap-0 mb-10">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center">
            <button
              type="button"
              onClick={() => step > i && setStep(i)}
              className="flex items-center gap-2"
              data-ocid={`checkout.step_${i + 1}_tab`}
            >
              <span
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-smooth ${
                  i < step
                    ? "bg-primary text-primary-foreground"
                    : i === step
                      ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {i < step ? <CheckCircle2 className="h-3.5 w-3.5" /> : i + 1}
              </span>
              <span
                className={`text-sm font-medium ${i === step ? "text-foreground" : "text-muted-foreground"}`}
              >
                {label}
              </span>
            </button>
            {i < STEPS.length - 1 && (
              <div
                className={`mx-3 h-px w-12 ${i < step ? "bg-primary" : "bg-border"}`}
              />
            )}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Step 0 — Review Items */}
          {step === 0 && (
            <div
              className="bg-card border border-border rounded-xl p-5"
              data-ocid="checkout.review_panel"
            >
              <h2 className="font-display font-semibold mb-4">
                Review Your Items
              </h2>
              <div className="space-y-3">
                {items.map((item, idx) => {
                  const p = products[item.productId.toString()];
                  return (
                    <div
                      key={item.productId.toString()}
                      className="flex gap-3 items-center"
                      data-ocid={`checkout.item.${idx + 1}`}
                    >
                      <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                        <img
                          src={p?.images[0] || "/assets/images/placeholder.svg"}
                          alt={p?.title ?? ""}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {p?.title ?? "—"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Qty: {Number(item.quantity)}
                        </p>
                      </div>
                      <span className="text-sm font-semibold">
                        {p ? formatPrice(p.price * Number(item.quantity)) : "—"}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-6 flex justify-end">
                <Button
                  onClick={handleNextStep}
                  data-ocid="checkout.next_button"
                >
                  Continue to Delivery
                </Button>
              </div>
            </div>
          )}

          {/* Step 1 — Delivery Address */}
          {step === 1 && (
            <div
              className="bg-card border border-border rounded-xl p-5"
              data-ocid="checkout.delivery_panel"
            >
              <h2 className="font-display font-semibold mb-4">
                Delivery Address
              </h2>
              {profile?.addresses && profile.addresses.length > 0 && (
                <div className="mb-5">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                    Saved Addresses
                  </p>
                  <div className="space-y-2 mb-4">
                    {profile.addresses.map((addr, i) => (
                      <button
                        key={`${addr.street}-${addr.city}-${i}`}
                        type="button"
                        onClick={() => setAddress(addr)}
                        className={`w-full text-left p-3 rounded-lg border text-sm transition-smooth ${address.street === addr.street && address.city === addr.city ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
                        data-ocid={`checkout.saved_address.${i + 1}`}
                      >
                        <p className="font-medium">{addr.fullName}</p>
                        <p className="text-muted-foreground text-xs">
                          {addr.street}, {addr.city}, {addr.country}
                        </p>
                      </button>
                    ))}
                  </div>
                  <Separator className="mb-4" />
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3">
                    Or Enter New Address
                  </p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                {ADDRESS_FIELDS.map(({ field, label, colSpan }) => (
                  <div key={field} className={colSpan ? "col-span-2" : ""}>
                    <Label htmlFor={field} className="text-xs mb-1 block">
                      {label}
                    </Label>
                    <Input
                      id={field}
                      value={address[field]}
                      onChange={(e) => setAddrField(field, e.target.value)}
                      className={`h-9 text-sm ${fieldErrors[field] ? "border-destructive" : ""}`}
                      data-ocid={`checkout.${field}_input`}
                    />
                    {fieldErrors[field] && (
                      <p
                        className="text-xs text-destructive mt-0.5"
                        data-ocid={`checkout.${field}_field_error`}
                      >
                        {fieldErrors[field]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setStep(0)}
                  data-ocid="checkout.back_button"
                >
                  Back
                </Button>
                <Button
                  onClick={handleNextStep}
                  data-ocid="checkout.next_button"
                >
                  Continue to Payment
                </Button>
              </div>
            </div>
          )}

          {/* Step 2 — Payment */}
          {step === 2 && (
            <div
              className="bg-card border border-border rounded-xl p-5"
              data-ocid="checkout.payment_panel"
            >
              <h2 className="font-display font-semibold mb-4">
                Payment Method
              </h2>
              <div className="space-y-3">
                {[
                  {
                    method: PaymentMethod.Stripe,
                    icon: <CreditCard className="h-5 w-5 text-white" />,
                    bg: "bg-[#635bff]",
                    label: "Credit / Debit Card",
                    sub: "Powered by Stripe — Visa, Mastercard, Amex",
                    ocid: "checkout.payment_stripe_radio",
                  },
                  {
                    method: PaymentMethod.PayPal,
                    icon: (
                      <span className="text-white font-bold text-xs">PP</span>
                    ),
                    bg: "bg-[#003087]",
                    label: "PayPal",
                    sub: "Pay securely with your PayPal account",
                    ocid: "checkout.payment_paypal_radio",
                  },
                  {
                    method: PaymentMethod.MtnMomo,
                    icon: <Phone className="h-5 w-5 text-[#333]" />,
                    bg: "bg-[#ffcc00]",
                    label: "MTN Mobile Money",
                    sub: "Pay with your MTN MOMO account",
                    ocid: "checkout.payment_momo_radio",
                  },
                ].map(({ method, icon, bg, label, sub, ocid }) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className={`w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-smooth ${paymentMethod === method ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}
                    data-ocid={ocid}
                  >
                    <div
                      className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center flex-shrink-0`}
                    >
                      {icon}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm">{label}</p>
                      <p className="text-xs text-muted-foreground">{sub}</p>
                    </div>
                    <div
                      className={`ml-auto w-4 h-4 rounded-full border-2 flex-shrink-0 ${paymentMethod === method ? "border-primary bg-primary" : "border-border"}`}
                    />
                  </button>
                ))}
              </div>
              {paymentMethod === PaymentMethod.MtnMomo && (
                <div className="mt-4">
                  <Label className="text-xs mb-1 block">
                    MTN MOMO Phone Number
                  </Label>
                  <Input
                    value={momoPhone}
                    onChange={(e) => setMomoPhone(e.target.value)}
                    placeholder="+234 800 000 0000"
                    className="h-9 text-sm"
                    data-ocid="checkout.momo_phone_input"
                  />
                </div>
              )}
              <div className="mt-6 flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  data-ocid="checkout.back_button"
                >
                  Back
                </Button>
                <Button
                  onClick={handlePlaceOrder}
                  disabled={placeOrder.isPending}
                  size="lg"
                  className="gap-2"
                  data-ocid="checkout.place_order_button"
                >
                  {placeOrder.isPending ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
                      Placing Order...
                    </span>
                  ) : (
                    `Place Order — ${formatPrice(total)}`
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="bg-card border border-border rounded-xl p-5 h-fit sticky top-4">
          <h2 className="font-display font-semibold mb-4 text-sm">
            Order Summary
          </h2>
          {!appliedCoupon ? (
            <div className="mb-4">
              <div className="flex gap-2">
                <Input
                  value={couponCode}
                  onChange={(e) => {
                    setCouponCode(e.target.value);
                    setCouponError("");
                  }}
                  placeholder="Promo code"
                  className="text-sm h-8"
                  data-ocid="checkout.coupon_input"
                  onKeyDown={(e) => e.key === "Enter" && handleValidateCoupon()}
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleValidateCoupon}
                  disabled={couponLoading || !couponCode.trim()}
                  data-ocid="checkout.coupon_apply_button"
                >
                  <Tag className="h-3.5 w-3.5" />
                </Button>
              </div>
              {couponError && (
                <p
                  className="text-xs text-destructive mt-1"
                  data-ocid="checkout.coupon_error_state"
                >
                  {couponError}
                </p>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-between bg-primary/10 rounded-lg px-3 py-2 mb-4">
              <div className="flex items-center gap-2">
                <Tag className="h-3.5 w-3.5 text-primary" />
                <span className="text-sm font-medium text-primary">
                  {appliedCoupon.code}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setAppliedCoupon(null);
                  setCouponCode("");
                }}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
          <Separator className="mb-3" />
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            {appliedCoupon && (
              <div className="flex justify-between text-primary">
                <span>Discount</span>
                <span>−{formatPrice(discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Est. Delivery</span>
              <span>3–7 business days</span>
            </div>
          </div>
          <Separator className="my-3" />
          <div className="flex justify-between font-display font-semibold">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
