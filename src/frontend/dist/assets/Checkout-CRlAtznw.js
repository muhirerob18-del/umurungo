import { c as createLucideIcon, u as useNavigate, a as useActor, k as useAuth, l as useCart, r as reactExports, P as PaymentMethod, j as jsxRuntimeExports, b as Button, I as Input, T as Tag, X, d as createActor } from "./index-CzdgUJ7r.js";
import { L as Label } from "./label-CY5rK_iJ.js";
import { S as Separator } from "./separator-ByvfqywK.js";
import { u as ue } from "./index-B4E3ZcaY.js";
import { u as usePlaceOrder } from "./use-orders-CM4FWeUj.js";
import { a as formatPrice } from "./backend-BvEPXO-C.js";
import { C as CircleCheck } from "./circle-check-BjAFXj6r.js";
import "./index-CEjBcvQ_.js";
import "./useMutation-keq2ozyC.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["rect", { width: "20", height: "14", x: "2", y: "5", rx: "2", key: "ynyp8z" }],
  ["line", { x1: "2", x2: "22", y1: "10", y2: "10", key: "1b3vmo" }]
];
const CreditCard = createLucideIcon("credit-card", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384",
      key: "9njp5v"
    }
  ]
];
const Phone = createLucideIcon("phone", __iconNode);
const STEPS = ["Review", "Delivery", "Payment"];
const emptyAddress = {
  fullName: "",
  street: "",
  city: "",
  state: "",
  country: "",
  postalCode: "",
  phone: ""
};
function CheckoutPage() {
  const navigate = useNavigate();
  const { actor } = useActor(createActor);
  const { profile } = useAuth();
  const { items, products, clearItems } = useCart();
  const placeOrder = usePlaceOrder();
  const [step, setStep] = reactExports.useState(0);
  const [address, setAddress] = reactExports.useState(() => {
    var _a;
    if ((_a = profile == null ? void 0 : profile.addresses) == null ? void 0 : _a.length) {
      const idx = profile.defaultAddressIndex !== void 0 ? Number(profile.defaultAddressIndex) : 0;
      return profile.addresses[idx] ?? emptyAddress;
    }
    return emptyAddress;
  });
  const [paymentMethod, setPaymentMethod] = reactExports.useState(
    PaymentMethod.Stripe
  );
  const [momoPhone, setMomoPhone] = reactExports.useState("");
  const [couponCode, setCouponCode] = reactExports.useState("");
  const [appliedCoupon, setAppliedCoupon] = reactExports.useState(null);
  const [couponError, setCouponError] = reactExports.useState("");
  const [couponLoading, setCouponLoading] = reactExports.useState(false);
  const [fieldErrors, setFieldErrors] = reactExports.useState({});
  const subtotal = items.reduce((sum, item) => {
    const p = products[item.productId.toString()];
    return p ? sum + p.price * Number(item.quantity) : sum;
  }, 0);
  const discount = (appliedCoupon == null ? void 0 : appliedCoupon.discount) ?? 0;
  const total = Math.max(0, subtotal - discount);
  const validateAddress = () => {
    const errors = {};
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
      const categoryIds = items.map((i) => {
        var _a;
        return (_a = products[i.productId.toString()]) == null ? void 0 : _a.categoryId;
      }).filter(Boolean);
      const result = await actor.validateCoupon(
        couponCode.trim().toUpperCase(),
        subtotal,
        categoryIds
      );
      if (result.isValid) {
        setAppliedCoupon({
          code: couponCode.trim().toUpperCase(),
          discount: result.discountAmount
        });
        ue.success(result.message || "Coupon applied!");
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
      ue.error("Please enter your MTN MOMO phone number.");
      return;
    }
    try {
      const order = await placeOrder.mutateAsync({
        shippingAddress: address,
        paymentMethod,
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity
        })),
        couponCode: appliedCoupon == null ? void 0 : appliedCoupon.code
      });
      clearItems();
      navigate({
        to: "/checkout/success",
        search: { orderId: order.id.toString() }
      });
    } catch {
      ue.error("Failed to place order. Please try again.");
    }
  };
  const setAddrField = (field, val) => {
    setAddress((p) => ({ ...p, [field]: val }));
    if (fieldErrors[field])
      setFieldErrors((p) => ({ ...p, [field]: void 0 }));
  };
  const ADDRESS_FIELDS = [
    { field: "fullName", label: "Full Name" },
    { field: "phone", label: "Phone" },
    { field: "street", label: "Street Address", colSpan: true },
    { field: "city", label: "City" },
    { field: "state", label: "State / Province" },
    { field: "country", label: "Country" },
    { field: "postalCode", label: "Postal Code" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-5xl mx-auto px-4 py-8", "data-ocid": "checkout.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-semibold mb-8", children: "Checkout" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-0 mb-10", children: STEPS.map((label, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => step > i && setStep(i),
          className: "flex items-center gap-2",
          "data-ocid": `checkout.step_${i + 1}_tab`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-smooth ${i < step ? "bg-primary text-primary-foreground" : i === step ? "bg-primary text-primary-foreground ring-4 ring-primary/20" : "bg-muted text-muted-foreground"}`,
                children: i < step ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3.5 w-3.5" }) : i + 1
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `text-sm font-medium ${i === step ? "text-foreground" : "text-muted-foreground"}`,
                children: label
              }
            )
          ]
        }
      ),
      i < STEPS.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: `mx-3 h-px w-12 ${i < step ? "bg-primary" : "bg-border"}`
        }
      )
    ] }, label)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-3 gap-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-2", children: [
        step === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "bg-card border border-border rounded-xl p-5",
            "data-ocid": "checkout.review_panel",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-semibold mb-4", children: "Review Your Items" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: items.map((item, idx) => {
                const p = products[item.productId.toString()];
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "flex gap-3 items-center",
                    "data-ocid": `checkout.item.${idx + 1}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-lg bg-muted overflow-hidden flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "img",
                        {
                          src: (p == null ? void 0 : p.images[0]) || "/assets/images/placeholder.svg",
                          alt: (p == null ? void 0 : p.title) ?? "",
                          className: "w-full h-full object-cover"
                        }
                      ) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium truncate", children: (p == null ? void 0 : p.title) ?? "—" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                          "Qty: ",
                          Number(item.quantity)
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", children: p ? formatPrice(p.price * Number(item.quantity)) : "—" })
                    ]
                  },
                  item.productId.toString()
                );
              }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  onClick: handleNextStep,
                  "data-ocid": "checkout.next_button",
                  children: "Continue to Delivery"
                }
              ) })
            ]
          }
        ),
        step === 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "bg-card border border-border rounded-xl p-5",
            "data-ocid": "checkout.delivery_panel",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-semibold mb-4", children: "Delivery Address" }),
              (profile == null ? void 0 : profile.addresses) && profile.addresses.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-wide mb-2", children: "Saved Addresses" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 mb-4", children: profile.addresses.map((addr, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => setAddress(addr),
                    className: `w-full text-left p-3 rounded-lg border text-sm transition-smooth ${address.street === addr.street && address.city === addr.city ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`,
                    "data-ocid": `checkout.saved_address.${i + 1}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: addr.fullName }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground text-xs", children: [
                        addr.street,
                        ", ",
                        addr.city,
                        ", ",
                        addr.country
                      ] })
                    ]
                  },
                  `${addr.street}-${addr.city}-${i}`
                )) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "mb-4" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-wide mb-3", children: "Or Enter New Address" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-4", children: ADDRESS_FIELDS.map(({ field, label, colSpan }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: colSpan ? "col-span-2" : "", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: field, className: "text-xs mb-1 block", children: label }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: field,
                    value: address[field],
                    onChange: (e) => setAddrField(field, e.target.value),
                    className: `h-9 text-sm ${fieldErrors[field] ? "border-destructive" : ""}`,
                    "data-ocid": `checkout.${field}_input`
                  }
                ),
                fieldErrors[field] && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-xs text-destructive mt-0.5",
                    "data-ocid": `checkout.${field}_field_error`,
                    children: fieldErrors[field]
                  }
                )
              ] }, field)) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "outline",
                    onClick: () => setStep(0),
                    "data-ocid": "checkout.back_button",
                    children: "Back"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    onClick: handleNextStep,
                    "data-ocid": "checkout.next_button",
                    children: "Continue to Payment"
                  }
                )
              ] })
            ]
          }
        ),
        step === 2 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "bg-card border border-border rounded-xl p-5",
            "data-ocid": "checkout.payment_panel",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-semibold mb-4", children: "Payment Method" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [
                {
                  method: PaymentMethod.Stripe,
                  icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "h-5 w-5 text-white" }),
                  bg: "bg-[#635bff]",
                  label: "Credit / Debit Card",
                  sub: "Powered by Stripe — Visa, Mastercard, Amex",
                  ocid: "checkout.payment_stripe_radio"
                },
                {
                  method: PaymentMethod.PayPal,
                  icon: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white font-bold text-xs", children: "PP" }),
                  bg: "bg-[#003087]",
                  label: "PayPal",
                  sub: "Pay securely with your PayPal account",
                  ocid: "checkout.payment_paypal_radio"
                },
                {
                  method: PaymentMethod.MtnMomo,
                  icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-5 w-5 text-[#333]" }),
                  bg: "bg-[#ffcc00]",
                  label: "MTN Mobile Money",
                  sub: "Pay with your MTN MOMO account",
                  ocid: "checkout.payment_momo_radio"
                }
              ].map(({ method, icon, bg, label, sub, ocid }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => setPaymentMethod(method),
                  className: `w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-smooth ${paymentMethod === method ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`,
                  "data-ocid": ocid,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: `w-10 h-10 rounded-lg ${bg} flex items-center justify-center flex-shrink-0`,
                        children: icon
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-sm", children: label }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: sub })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: `ml-auto w-4 h-4 rounded-full border-2 flex-shrink-0 ${paymentMethod === method ? "border-primary bg-primary" : "border-border"}`
                      }
                    )
                  ]
                },
                method
              )) }),
              paymentMethod === PaymentMethod.MtnMomo && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs mb-1 block", children: "MTN MOMO Phone Number" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    value: momoPhone,
                    onChange: (e) => setMomoPhone(e.target.value),
                    placeholder: "+234 800 000 0000",
                    className: "h-9 text-sm",
                    "data-ocid": "checkout.momo_phone_input"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "outline",
                    onClick: () => setStep(1),
                    "data-ocid": "checkout.back_button",
                    children: "Back"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    onClick: handlePlaceOrder,
                    disabled: placeOrder.isPending,
                    size: "lg",
                    className: "gap-2",
                    "data-ocid": "checkout.place_order_button",
                    children: placeOrder.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-4 w-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" }),
                      "Placing Order..."
                    ] }) : `Place Order — ${formatPrice(total)}`
                  }
                )
              ] })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl p-5 h-fit sticky top-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-semibold mb-4 text-sm", children: "Order Summary" }),
        !appliedCoupon ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: couponCode,
                onChange: (e) => {
                  setCouponCode(e.target.value);
                  setCouponError("");
                },
                placeholder: "Promo code",
                className: "text-sm h-8",
                "data-ocid": "checkout.coupon_input",
                onKeyDown: (e) => e.key === "Enter" && handleValidateCoupon()
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "sm",
                variant: "outline",
                onClick: handleValidateCoupon,
                disabled: couponLoading || !couponCode.trim(),
                "data-ocid": "checkout.coupon_apply_button",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "h-3.5 w-3.5" })
              }
            )
          ] }),
          couponError && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-xs text-destructive mt-1",
              "data-ocid": "checkout.coupon_error_state",
              children: couponError
            }
          )
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between bg-primary/10 rounded-lg px-3 py-2 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "h-3.5 w-3.5 text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-primary", children: appliedCoupon.code })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => {
                setAppliedCoupon(null);
                setCouponCode("");
              },
              className: "text-muted-foreground hover:text-foreground transition-colors",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3.5 w-3.5" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "mb-3" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Subtotal" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatPrice(subtotal) })
          ] }),
          appliedCoupon && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-primary", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Discount" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "−",
              formatPrice(discount)
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Est. Delivery" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "3–7 business days" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "my-3" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between font-display font-semibold", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Total" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatPrice(total) })
        ] })
      ] })
    ] })
  ] });
}
export {
  CheckoutPage as default
};
