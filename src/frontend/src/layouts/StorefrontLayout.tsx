import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Link, useNavigate } from "@tanstack/react-router";
import { Heart, Menu, Search, ShoppingCart, User, X, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../hooks/use-auth";
import { useCart } from "../hooks/use-cart";
import { useWishlist } from "../hooks/use-wishlist";

interface StorefrontLayoutProps {
  children: React.ReactNode;
}

export function StorefrontLayout({ children }: StorefrontLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const cartCount = useCart((s) => s.getTotalCount());
  const wishCount = useWishlist((s) => s.count());
  const { isAuthenticated, isAdmin, profile, login, logout } = useAuth();
  const navigate = useNavigate();
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate({ to: "/search", search: { q: searchQuery.trim() } });
      setSearchQuery("");
      setMobileOpen(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border shadow-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-4">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2 flex-shrink-0"
              data-ocid="nav.logo_link"
            >
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Zap
                  className="h-4.5 w-4.5 text-primary-foreground"
                  fill="currentColor"
                />
              </div>
              <span className="font-display font-bold text-lg text-foreground tracking-tight hidden sm:block">
                UMURUNGO
              </span>
            </Link>

            {/* Nav Links — desktop */}
            <nav className="hidden md:flex items-center gap-1 ml-2">
              <Link
                to="/"
                className="px-3 py-1.5 text-sm font-medium text-muted-foreground rounded-md hover:text-foreground hover:bg-muted transition-colors"
                activeProps={{ className: "text-foreground bg-muted" }}
                activeOptions={{ exact: true }}
                data-ocid="nav.home_link"
              >
                Home
              </Link>
              <Link
                to="/category/$categoryId"
                params={{ categoryId: "1" }}
                className="px-3 py-1.5 text-sm font-medium text-muted-foreground rounded-md hover:text-foreground hover:bg-muted transition-colors"
                activeProps={{ className: "text-foreground bg-muted" }}
                data-ocid="nav.electronics_link"
              >
                Electronics
              </Link>
              <Link
                to="/category/$categoryId"
                params={{ categoryId: "2" }}
                className="px-3 py-1.5 text-sm font-medium text-muted-foreground rounded-md hover:text-foreground hover:bg-muted transition-colors"
                activeProps={{ className: "text-foreground bg-muted" }}
                data-ocid="nav.fashion_link"
              >
                Fashion
              </Link>
            </nav>

            {/* Search — desktop */}
            <form
              onSubmit={handleSearch}
              className="hidden md:flex flex-1 max-w-md ml-auto"
            >
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search 15,000+ products..."
                  className="pl-9 bg-muted/50 border-transparent focus:border-primary/30 focus:bg-card"
                  data-ocid="nav.search_input"
                />
              </div>
            </form>

            {/* Actions */}
            <div className="flex items-center gap-1 ml-2">
              {/* Wishlist */}
              <Link to="/account/wishlist" data-ocid="nav.wishlist_link">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative h-9 w-9"
                >
                  <Heart className="h-4.5 w-4.5" />
                  {wishCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-4 min-w-4 px-0.5 text-[10px] flex items-center justify-center bg-destructive text-destructive-foreground border-0">
                      {wishCount > 99 ? "99+" : wishCount}
                    </Badge>
                  )}
                </Button>
              </Link>

              {/* Cart */}
              <Link to="/cart" data-ocid="nav.cart_link">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative h-9 w-9"
                >
                  <ShoppingCart className="h-4.5 w-4.5" />
                  {cartCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-4 min-w-4 px-0.5 text-[10px] flex items-center justify-center bg-primary text-primary-foreground border-0">
                      {cartCount > 99 ? "99+" : cartCount}
                    </Badge>
                  )}
                </Button>
              </Link>

              {/* User menu */}
              <div className="relative" ref={userMenuRef}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => setUserMenuOpen((v) => !v)}
                  data-ocid="nav.user_menu_button"
                >
                  {profile?.avatarUrl ? (
                    <img
                      src={profile.avatarUrl}
                      alt={profile.displayName}
                      className="h-7 w-7 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-4.5 w-4.5" />
                  )}
                </Button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-card border border-border rounded-xl shadow-elevated py-1 z-50">
                    {isAuthenticated ? (
                      <>
                        <div className="px-3 py-2 border-b border-border">
                          <p className="text-sm font-medium text-foreground truncate">
                            {profile?.displayName ?? "User"}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {profile?.email}
                          </p>
                        </div>
                        <Link
                          to="/account"
                          className="flex items-center px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                          data-ocid="nav.account_link"
                        >
                          My Account
                        </Link>
                        <Link
                          to="/account/orders"
                          className="flex items-center px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                          data-ocid="nav.orders_link"
                        >
                          My Orders
                        </Link>
                        {isAdmin && (
                          <Link
                            to="/admin"
                            className="flex items-center px-3 py-2 text-sm text-primary font-medium hover:bg-muted transition-colors"
                            onClick={() => setUserMenuOpen(false)}
                            data-ocid="nav.admin_link"
                          >
                            Admin Panel
                          </Link>
                        )}
                        <div className="border-t border-border mt-1 pt-1">
                          <button
                            type="button"
                            className="flex items-center w-full px-3 py-2 text-sm text-destructive hover:bg-muted transition-colors"
                            onClick={() => {
                              logout();
                              setUserMenuOpen(false);
                            }}
                            data-ocid="nav.logout_button"
                          >
                            Sign Out
                          </button>
                        </div>
                      </>
                    ) : (
                      <button
                        type="button"
                        className="flex items-center w-full px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                        onClick={() => {
                          login();
                          setUserMenuOpen(false);
                        }}
                        data-ocid="nav.login_button"
                      >
                        Sign In
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Mobile menu toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden h-9 w-9"
                onClick={() => setMobileOpen((v) => !v)}
                data-ocid="nav.mobile_menu_button"
              >
                {mobileOpen ? (
                  <X className="h-4.5 w-4.5" />
                ) : (
                  <Menu className="h-4.5 w-4.5" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile search */}
          {mobileOpen && (
            <div className="md:hidden pb-3 border-t border-border pt-3 space-y-3">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="pl-9"
                    data-ocid="nav.mobile_search_input"
                  />
                </div>
              </form>
              <nav className="flex flex-col gap-0.5">
                <Link
                  to="/"
                  className="px-3 py-2 text-sm text-muted-foreground rounded-lg hover:text-foreground hover:bg-muted transition-colors"
                  onClick={() => setMobileOpen(false)}
                  activeOptions={{ exact: true }}
                >
                  Home
                </Link>
                <Link
                  to="/category/$categoryId"
                  params={{ categoryId: "1" }}
                  className="px-3 py-2 text-sm text-muted-foreground rounded-lg hover:text-foreground hover:bg-muted transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  Electronics
                </Link>
                <Link
                  to="/category/$categoryId"
                  params={{ categoryId: "2" }}
                  className="px-3 py-2 text-sm text-muted-foreground rounded-lg hover:text-foreground hover:bg-muted transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  Fashion
                </Link>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 bg-background">{children}</main>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
                  <Zap
                    className="h-4 w-4 text-primary-foreground"
                    fill="currentColor"
                  />
                </div>
                <span className="font-display font-bold text-foreground">
                  UMURUNGO
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Premium products across Electronics, Fashion & more. Curated for
                quality.
              </p>
            </div>
            <div>
              <h4 className="font-display font-semibold text-sm text-foreground mb-3">
                Shop
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/category/$categoryId"
                    params={{ categoryId: "1" }}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Electronics
                  </Link>
                </li>
                <li>
                  <Link
                    to="/category/$categoryId"
                    params={{ categoryId: "2" }}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Fashion &amp; Apparel
                  </Link>
                </li>
                <li>
                  <Link
                    to="/search"
                    search={{ q: "new arrivals" }}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    New Arrivals
                  </Link>
                </li>
                <li>
                  <Link
                    to="/search"
                    search={{ q: "sale" }}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Sale
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-display font-semibold text-sm text-foreground mb-3">
                Account
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/account/orders"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    My Orders
                  </Link>
                </li>
                <li>
                  <Link
                    to="/account/wishlist"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Wishlist
                  </Link>
                </li>
                <li>
                  <Link
                    to="/account/profile"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Profile Settings
                  </Link>
                </li>
                <li>
                  <Link
                    to="/account"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Help Center
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-display font-semibold text-sm text-foreground mb-3">
                Legal
              </h4>
              <ul className="space-y-2">
                {[
                  "Privacy Policy",
                  "Terms of Service",
                  "Refunds",
                  "Shipping",
                ].map((item) => (
                  <li key={item}>
                    <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()}. Built with love using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                caffeine.ai
              </a>
            </p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span>🔒 Secure Checkout</span>
              <span>•</span>
              <span>Free Returns</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
