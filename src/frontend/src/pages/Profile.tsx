import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, LogIn, MapPin, Plus, Star, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { createActor } from "../backend";
import type { Address } from "../backend";
import { useAuth } from "../hooks/use-auth";

const emptyAddress: Address = {
  fullName: "",
  street: "",
  city: "",
  state: "",
  country: "",
  postalCode: "",
  phone: "",
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
  { field: "state", label: "State" },
  { field: "country", label: "Country" },
  { field: "postalCode", label: "Postal Code" },
];

export default function ProfilePage() {
  const { isAuthenticated, profile, profileLoading, login, refetchProfile } =
    useAuth();
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState<Address>(emptyAddress);
  const [addressSaving, setAddressSaving] = useState(false);
  const [addrErrors, setAddrErrors] = useState<
    Partial<Record<keyof Address, string>>
  >({});

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName);
      setEmail(profile.email);
    }
  }, [profile]);

  if (!isAuthenticated) {
    return (
      <div
        className="max-w-md mx-auto px-4 py-20 text-center"
        data-ocid="profile.login_prompt"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
          <LogIn className="h-7 w-7 text-muted-foreground" />
        </div>
        <h1 className="text-xl font-display font-semibold mb-2">
          Sign in to manage your profile
        </h1>
        <Button
          onClick={login}
          className="gap-2 mt-4"
          data-ocid="profile.login_button"
        >
          <LogIn className="h-4 w-4" />
          Sign In
        </Button>
      </div>
    );
  }

  const handleSaveProfile = async () => {
    if (!actor) return;
    setSaving(true);
    setSaveSuccess(false);
    try {
      await actor.updateMyProfile({
        displayName: displayName || undefined,
        email: email || undefined,
      });
      await refetchProfile();
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      setSaveSuccess(true);
      toast.success("Profile updated!");
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch {
      toast.error("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const validateAddress = (): boolean => {
    const errors: Partial<Record<keyof Address, string>> = {};
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
      toast.success("Address added!");
    } catch {
      toast.error("Failed to add address.");
    } finally {
      setAddressSaving(false);
    }
  };

  const handleRemoveAddress = async (idx: number) => {
    if (!actor) return;
    try {
      await actor.removeAddress(BigInt(idx));
      await refetchProfile();
      toast.success("Address removed.");
    } catch {
      toast.error("Failed to remove address.");
    }
  };

  const handleSetDefault = async (idx: number) => {
    if (!actor) return;
    try {
      await actor.setDefaultAddress(BigInt(idx));
      await refetchProfile();
      toast.success("Default address updated.");
    } catch {
      toast.error("Failed to set default.");
    }
  };

  const setAddrField = (field: keyof Address, value: string) => {
    setNewAddress((p) => ({ ...p, [field]: value }));
    if (addrErrors[field]) setAddrErrors((p) => ({ ...p, [field]: undefined }));
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8" data-ocid="profile.page">
      <div className="flex items-center gap-3 mb-6">
        <Link
          to="/account"
          className="text-muted-foreground hover:text-foreground transition-colors"
          data-ocid="profile.back_link"
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-display font-semibold">My Profile</h1>
      </div>

      {/* Profile form */}
      <div className="bg-card border border-border rounded-xl p-5 mb-5">
        <h2 className="font-display font-semibold text-sm mb-4">
          Account Information
        </h2>
        {profileLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 rounded-lg" />
            <Skeleton className="h-10 rounded-lg" />
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <Label htmlFor="displayName" className="text-xs mb-1 block">
                Display Name
              </Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="h-10"
                data-ocid="profile.name_input"
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-xs mb-1 block">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10"
                data-ocid="profile.email_input"
              />
            </div>
            <div className="flex items-center gap-3 pt-1">
              <Button
                onClick={handleSaveProfile}
                disabled={saving}
                className="gap-2"
                data-ocid="profile.save_button"
              >
                {saving ? (
                  <span className="flex items-center gap-2">
                    <span className="h-3.5 w-3.5 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
                    Saving...
                  </span>
                ) : (
                  "Save Changes"
                )}
              </Button>
              {saveSuccess && (
                <span
                  className="text-sm text-primary"
                  data-ocid="profile.save_success_state"
                >
                  ✓ Saved!
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Addresses */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <h2 className="font-display font-semibold text-sm">
              Saved Addresses
            </h2>
          </div>
          {!showAddressForm && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowAddressForm(true)}
              className="gap-1.5 text-xs"
              data-ocid="profile.add_address_button"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Address
            </Button>
          )}
        </div>

        {profileLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-20 rounded-lg" />
            <Skeleton className="h-20 rounded-lg" />
          </div>
        ) : profile?.addresses && profile.addresses.length > 0 ? (
          <div className="space-y-3 mb-4">
            {profile.addresses.map((addr, i) => {
              const isDefault =
                profile.defaultAddressIndex !== undefined &&
                Number(profile.defaultAddressIndex) === i;
              return (
                <div
                  key={`${addr.street}-${addr.city}-${i}`}
                  className={`flex gap-3 p-3 rounded-lg border ${isDefault ? "border-primary bg-primary/5" : "border-border"}`}
                  data-ocid={`profile.address.${i + 1}`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-medium">{addr.fullName}</p>
                      {isDefault && (
                        <span className="text-[10px] font-medium bg-primary/10 text-primary px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                          <Star className="h-2.5 w-2.5 fill-current" />
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {addr.street}, {addr.city}, {addr.country}{" "}
                      {addr.postalCode}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {addr.phone}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1.5 flex-shrink-0 items-end">
                    {!isDefault && (
                      <button
                        type="button"
                        onClick={() => handleSetDefault(i)}
                        className="text-xs text-primary hover:underline"
                        data-ocid={`profile.set_default_button.${i + 1}`}
                      >
                        Set Default
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveAddress(i)}
                      className="text-destructive hover:text-destructive/80 transition-colors"
                      aria-label="Remove address"
                      data-ocid={`profile.delete_address_button.${i + 1}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : !showAddressForm ? (
          <p
            className="text-sm text-muted-foreground py-4 text-center"
            data-ocid="profile.addresses_empty_state"
          >
            No saved addresses yet.
          </p>
        ) : null}

        {/* Add address form */}
        {showAddressForm && (
          <div
            className="border border-border rounded-xl p-4 bg-muted/20"
            data-ocid="profile.add_address_form"
          >
            <h3 className="text-sm font-medium mb-3">New Address</h3>
            <div className="grid grid-cols-2 gap-3">
              {ADDRESS_FIELDS.map(({ field, label, colSpan }) => (
                <div key={field} className={colSpan ? "col-span-2" : ""}>
                  <Label
                    htmlFor={`addr-${field}`}
                    className="text-xs mb-1 block"
                  >
                    {label}
                  </Label>
                  <Input
                    id={`addr-${field}`}
                    value={newAddress[field]}
                    onChange={(e) => setAddrField(field, e.target.value)}
                    className={`h-9 text-sm ${addrErrors[field] ? "border-destructive" : ""}`}
                    data-ocid={`profile.addr_${field}_input`}
                  />
                  {addrErrors[field] && (
                    <p
                      className="text-xs text-destructive mt-0.5"
                      data-ocid={`profile.addr_${field}_field_error`}
                    >
                      {addrErrors[field]}
                    </p>
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-4">
              <Button
                size="sm"
                onClick={handleAddAddress}
                disabled={addressSaving}
                data-ocid="profile.save_address_button"
              >
                {addressSaving ? "Saving..." : "Save Address"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setShowAddressForm(false);
                  setNewAddress(emptyAddress);
                  setAddrErrors({});
                }}
                data-ocid="profile.cancel_address_button"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
