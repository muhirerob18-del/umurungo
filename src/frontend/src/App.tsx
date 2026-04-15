import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Suspense, lazy } from "react";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { AdminLayout } from "./layouts/AdminLayout";
import { StorefrontLayout } from "./layouts/StorefrontLayout";

// ── Lazy page imports ──────────────────────────────────────────────────────────
const HomePage = lazy(() => import("./pages/Home"));
const SearchPage = lazy(() => import("./pages/Search"));
const CategoryPage = lazy(() => import("./pages/Category"));
const ProductPage = lazy(() => import("./pages/Product"));
const CartPage = lazy(() => import("./pages/Cart"));
const CheckoutPage = lazy(() => import("./pages/Checkout"));
const CheckoutSuccessPage = lazy(() => import("./pages/CheckoutSuccess"));
const AccountPage = lazy(() => import("./pages/Account"));
const OrdersPage = lazy(() => import("./pages/Orders"));
const OrderDetailPage = lazy(() => import("./pages/OrderDetail"));
const WishlistPage = lazy(() => import("./pages/Wishlist"));
const ProfilePage = lazy(() => import("./pages/Profile"));

// Admin pages
const AdminDashboardPage = lazy(() => import("./pages/admin/Dashboard"));
const AdminProductsPage = lazy(() => import("./pages/admin/Products"));
const AdminOrdersPage = lazy(() => import("./pages/admin/Orders"));
const AdminInventoryPage = lazy(() => import("./pages/admin/Inventory"));
const AdminCouponsPage = lazy(() => import("./pages/admin/Coupons"));
const AdminUsersPage = lazy(() => import("./pages/admin/Users"));
const AdminAnalyticsPage = lazy(() => import("./pages/admin/Analytics"));
const AdminReviewsPage = lazy(() => import("./pages/admin/Reviews"));

const PageLoader = () => (
  <LoadingSpinner fullPage={false} size="lg" label="Loading page..." />
);

// ── Root route ─────────────────────────────────────────────────────────────────
const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

// ── Storefront layout route ────────────────────────────────────────────────────
const storefrontRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "storefront",
  component: () => (
    <StorefrontLayout>
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
    </StorefrontLayout>
  ),
});

// ── Admin layout route ─────────────────────────────────────────────────────────
const adminLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "admin-layout",
  component: () => (
    <AdminLayout>
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
    </AdminLayout>
  ),
});

// ── Storefront routes ──────────────────────────────────────────────────────────
const homeRoute = createRoute({
  getParentRoute: () => storefrontRoute,
  path: "/",
  component: () => <HomePage />,
});

const searchRoute = createRoute({
  getParentRoute: () => storefrontRoute,
  path: "/search",
  validateSearch: (search: Record<string, unknown>) => ({
    q: (search.q as string | undefined) ?? "",
  }),
  component: () => <SearchPage />,
});

const categoryRoute = createRoute({
  getParentRoute: () => storefrontRoute,
  path: "/category/$categoryId",
  component: () => <CategoryPage />,
});

const productRoute = createRoute({
  getParentRoute: () => storefrontRoute,
  path: "/product/$productId",
  component: () => <ProductPage />,
});

const cartRoute = createRoute({
  getParentRoute: () => storefrontRoute,
  path: "/cart",
  component: () => <CartPage />,
});

const checkoutRoute = createRoute({
  getParentRoute: () => storefrontRoute,
  path: "/checkout",
  component: () => <CheckoutPage />,
});

const checkoutSuccessRoute = createRoute({
  getParentRoute: () => storefrontRoute,
  path: "/checkout/success",
  component: () => <CheckoutSuccessPage />,
});

const accountRoute = createRoute({
  getParentRoute: () => storefrontRoute,
  path: "/account",
  component: () => <AccountPage />,
});

const ordersRoute = createRoute({
  getParentRoute: () => storefrontRoute,
  path: "/account/orders",
  component: () => <OrdersPage />,
});

const orderDetailRoute = createRoute({
  getParentRoute: () => storefrontRoute,
  path: "/account/orders/$orderId",
  component: () => <OrderDetailPage />,
});

const wishlistRoute = createRoute({
  getParentRoute: () => storefrontRoute,
  path: "/account/wishlist",
  component: () => <WishlistPage />,
});

const profileRoute = createRoute({
  getParentRoute: () => storefrontRoute,
  path: "/account/profile",
  component: () => <ProfilePage />,
});

// ── Admin routes ───────────────────────────────────────────────────────────────
const adminRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/admin",
  component: () => <AdminDashboardPage />,
});

const adminProductsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/admin/products",
  component: () => <AdminProductsPage />,
});

const adminOrdersRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/admin/orders",
  component: () => <AdminOrdersPage />,
});

const adminInventoryRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/admin/inventory",
  component: () => <AdminInventoryPage />,
});

const adminCouponsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/admin/coupons",
  component: () => <AdminCouponsPage />,
});

const adminUsersRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/admin/users",
  component: () => <AdminUsersPage />,
});

const adminAnalyticsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/admin/analytics",
  component: () => <AdminAnalyticsPage />,
});

const adminReviewsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/admin/reviews",
  component: () => <AdminReviewsPage />,
});

// ── Route tree ─────────────────────────────────────────────────────────────────
const routeTree = rootRoute.addChildren([
  storefrontRoute.addChildren([
    homeRoute,
    searchRoute,
    categoryRoute,
    productRoute,
    cartRoute,
    checkoutRoute,
    checkoutSuccessRoute,
    accountRoute,
    ordersRoute,
    orderDetailRoute,
    wishlistRoute,
    profileRoute,
  ]),
  adminLayoutRoute.addChildren([
    adminRoute,
    adminProductsRoute,
    adminOrdersRoute,
    adminInventoryRoute,
    adminCouponsRoute,
    adminUsersRoute,
    adminAnalyticsRoute,
    adminReviewsRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
