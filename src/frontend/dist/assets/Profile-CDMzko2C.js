import { k as useAuth, a as useActor, i as useQueryClient, r as reactExports, j as jsxRuntimeExports, b as Button, L as Link, I as Input, o as Star, d as createActor } from "./index-CzdgUJ7r.js";
import { L as Label } from "./label-CY5rK_iJ.js";
import { S as Skeleton } from "./skeleton-CbZpD72u.js";
import { u as ue } from "./index-B4E3ZcaY.js";
import { L as LogIn } from "./log-in-B0rYGWR-.js";
import { C as ChevronLeft } from "./chevron-left-BAeFkPTF.js";
import { M as MapPin } from "./map-pin-CGhrhGh0.js";
import { P as Plus } from "./plus-DGDwjsZ6.js";
import { T as Trash2 } from "./trash-2-DjWRPbkV.js";
import "./index-CEjBcvQ_.js";
const emptyAddress = {
  fullName: "",
  street: "",
  city: "",
  state: "",
  country: "",
  postalCode: "",
  phone: ""
};
const ADDRESS_FIELDS = [
  { field: "fullName", label: "Full Name" },
  { field: "phone", label: "Phone" },
  { field: "street", label: "Street Address", colSpan: true },
  { field: "city", label: "City" },
  { field: "state", label: "State" },
  { field: "country", label: "Country" },
  { field: "postalCode", label: "Postal Code" }
];
function ProfilePage() {
  const { isAuthenticated, profile, profileLoading, login, refetchProfile } = useAuth();
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  const [displayName, setDisplayName] = reactExports.useState("");
  const [email, setEmail] = reactExports.useState("");
  const [saving, setSaving] = reactExports.useState(false);
  const [saveSuccess, setSaveSuccess] = reactExports.useState(false);
  const [showAddressForm, setShowAddressForm] = reactExports.useState(false);
  const [newAddress, setNewAddress] = reactExports.useState(emptyAddress);
  const [addressSaving, setAddressSaving] = reactExports.useState(false);
  const [addrErrors, setAddrErrors] = reactExports.useState({});
  reactExports.useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName);
      setEmail(profile.email);
    }
  }, [profile]);
  if (!isAuthenticated) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "max-w-md mx-auto px-4 py-20 text-center",
        "data-ocid": "profile.login_prompt",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LogIn, { className: "h-7 w-7 text-muted-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-display font-semibold mb-2", children: "Sign in to manage your profile" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              onClick: login,
              className: "gap-2 mt-4",
              "data-ocid": "profile.login_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LogIn, { className: "h-4 w-4" }),
                "Sign In"
              ]
            }
          )
        ]
      }
    );
  }
  const handleSaveProfile = async () => {
    if (!actor) return;
    setSaving(true);
    setSaveSuccess(false);
    try {
      await actor.updateMyProfile({
        displayName: displayName || void 0,
        email: email || void 0
      });
      await refetchProfile();
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      setSaveSuccess(true);
      ue.success("Profile updated!");
      setTimeout(() => setSaveSuccess(false), 3e3);
    } catch {
      ue.error("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };
  const validateAddress = () => {
    const errors = {};
    if (!newAddress.fullName.trim()) errors.fullName = "Required";
    if (!newAddress.street.trim()) errors.street = "Required";
    if (!newAddress.city.trim()) errors.city = "Required";
    if (!newAddress.country.trim()) errors.country = "Required";
    setAddrErrors(errors);
    return Object.keys(errors).length === 0;
  };
  const handleAddAddress = async () => {
    if (!actor || !validateAddress()) return;
    setAddressSaving(true);
    try {
      await actor.addAddress(newAddress);
      await refetchProfile();
      setNewAddress(emptyAddress);
      setShowAddressForm(false);
      ue.success("Address added!");
    } catch {
      ue.error("Failed to add address.");
    } finally {
      setAddressSaving(false);
    }
  };
  const handleRemoveAddress = async (idx) => {
    if (!actor) return;
    try {
      await actor.removeAddress(BigInt(idx));
      await refetchProfile();
      ue.success("Address removed.");
    } catch {
      ue.error("Failed to remove address.");
    }
  };
  const handleSetDefault = async (idx) => {
    if (!actor) return;
    try {
      await actor.setDefaultAddress(BigInt(idx));
      await refetchProfile();
      ue.success("Default address updated.");
    } catch {
      ue.error("Failed to set default.");
    }
  };
  const setAddrField = (field, value) => {
    setNewAddress((p) => ({ ...p, [field]: value }));
    if (addrErrors[field]) setAddrErrors((p) => ({ ...p, [field]: void 0 }));
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto px-4 py-8", "data-ocid": "profile.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Link,
        {
          to: "/account",
          className: "text-muted-foreground hover:text-foreground transition-colors",
          "data-ocid": "profile.back_link",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-5 w-5" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-semibold", children: "My Profile" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl p-5 mb-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-semibold text-sm mb-4", children: "Account Information" }),
      profileLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 rounded-lg" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 rounded-lg" })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "displayName", className: "text-xs mb-1 block", children: "Display Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "displayName",
              value: displayName,
              onChange: (e) => setDisplayName(e.target.value),
              className: "h-10",
              "data-ocid": "profile.name_input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "email", className: "text-xs mb-1 block", children: "Email Address" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "email",
              type: "email",
              value: email,
              onChange: (e) => setEmail(e.target.value),
              className: "h-10",
              "data-ocid": "profile.email_input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 pt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: handleSaveProfile,
              disabled: saving,
              className: "gap-2",
              "data-ocid": "profile.save_button",
              children: saving ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-3.5 w-3.5 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" }),
                "Saving..."
              ] }) : "Save Changes"
            }
          ),
          saveSuccess && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "text-sm text-primary",
              "data-ocid": "profile.save_success_state",
              children: "✓ Saved!"
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-4 w-4 text-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-semibold text-sm", children: "Saved Addresses" })
        ] }),
        !showAddressForm && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            variant: "outline",
            onClick: () => setShowAddressForm(true),
            className: "gap-1.5 text-xs",
            "data-ocid": "profile.add_address_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
              "Add Address"
            ]
          }
        )
      ] }),
      profileLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 rounded-lg" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 rounded-lg" })
      ] }) : (profile == null ? void 0 : profile.addresses) && profile.addresses.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3 mb-4", children: profile.addresses.map((addr, i) => {
        const isDefault = profile.defaultAddressIndex !== void 0 && Number(profile.defaultAddressIndex) === i;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: `flex gap-3 p-3 rounded-lg border ${isDefault ? "border-primary bg-primary/5" : "border-border"}`,
            "data-ocid": `profile.address.${i + 1}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-0.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: addr.fullName }),
                  isDefault && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] font-medium bg-primary/10 text-primary px-1.5 py-0.5 rounded-full flex items-center gap-0.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-2.5 w-2.5 fill-current" }),
                    "Default"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                  addr.street,
                  ", ",
                  addr.city,
                  ", ",
                  addr.country,
                  " ",
                  addr.postalCode
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: addr.phone })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5 flex-shrink-0 items-end", children: [
                !isDefault && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => handleSetDefault(i),
                    className: "text-xs text-primary hover:underline",
                    "data-ocid": `profile.set_default_button.${i + 1}`,
                    children: "Set Default"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => handleRemoveAddress(i),
                    className: "text-destructive hover:text-destructive/80 transition-colors",
                    "aria-label": "Remove address",
                    "data-ocid": `profile.delete_address_button.${i + 1}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" })
                  }
                )
              ] })
            ]
          },
          `${addr.street}-${addr.city}-${i}`
        );
      }) }) : !showAddressForm ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "p",
        {
          className: "text-sm text-muted-foreground py-4 text-center",
          "data-ocid": "profile.addresses_empty_state",
          children: "No saved addresses yet."
        }
      ) : null,
      showAddressForm && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "border border-border rounded-xl p-4 bg-muted/20",
          "data-ocid": "profile.add_address_form",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-medium mb-3", children: "New Address" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: ADDRESS_FIELDS.map(({ field, label, colSpan }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: colSpan ? "col-span-2" : "", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Label,
                {
                  htmlFor: `addr-${field}`,
                  className: "text-xs mb-1 block",
                  children: label
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: `addr-${field}`,
                  value: newAddress[field],
                  onChange: (e) => setAddrField(field, e.target.value),
                  className: `h-9 text-sm ${addrErrors[field] ? "border-destructive" : ""}`,
                  "data-ocid": `profile.addr_${field}_input`
                }
              ),
              addrErrors[field] && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-xs text-destructive mt-0.5",
                  "data-ocid": `profile.addr_${field}_field_error`,
                  children: addrErrors[field]
                }
              )
            ] }, field)) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mt-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  size: "sm",
                  onClick: handleAddAddress,
                  disabled: addressSaving,
                  "data-ocid": "profile.save_address_button",
                  children: addressSaving ? "Saving..." : "Save Address"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  size: "sm",
                  variant: "outline",
                  onClick: () => {
                    setShowAddressForm(false);
                    setNewAddress(emptyAddress);
                    setAddrErrors({});
                  },
                  "data-ocid": "profile.cancel_address_button",
                  children: "Cancel"
                }
              )
            ] })
          ]
        }
      )
    ] })
  ] });
}
export {
  ProfilePage as default
};
