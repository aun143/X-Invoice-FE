import { createRouter, createWebHistory } from "vue-router";
import Invoice from "../Views/Invoice.vue";
import Index from "../Views/Index.vue";
import Client from "../Views/Client.vue";
import AllClients from "../Views/AllClients.vue";
import BusinessProfile from "../Views/BusinessProfile.vue";
import Login from "../Views/Login.vue";
import NotFound from "../Views/NotFound.vue";
import ForgetPass from "../Views/ForgetPass.vue";
import SignUp from "../Views/SignUp.vue";
import Accounts from "../Views/Accounts.vue";
import ViewClient from "../Views/ViewClient.vue";
import GetInvoice from "../Views/GetInvoice.vue";
import EditClient from "../Views/EditClient.vue";
import EditInvoice from "../Views/EditInvoice.vue";
import SendInvoice from "../Views/SendInvoice.vue";
import Subscription from "../Views/Subscription.vue";
import DashBoard from "../Views/DashBoard.vue";

const routes = [
  { path: "/", redirect: "/Index" },
  {
    name: "Invoice",
    path: "/New",
    component: Invoice,
    meta: { public: false },
  },
  { name: "Index", path: "/Index", component: Index, meta: { public: false } },
  {
    name: "Client",
    path: "/Client",
    component: Client,
    meta: { public: false },
  },
  {
    name: "AllClients",
    path: "/AllClients",
    component: AllClients,
    meta: { public: false },
  },
  {
    name: "DashBoard",
    path: "/DashBoard",
    component: DashBoard,
    meta: { public: false },
  },
  {
    name: "Subscription",
    path: "/Subscription",
    component: Subscription,
    meta: { public: false },
  },
  {
    name: "ViewClient",
    path: "/ViewClient/:clientId/",
    component: ViewClient,
    meta: { public: false },
  },
  {
    name: "BusinessProfile",
    path: "/BusinessProfile",
    component: BusinessProfile,
    meta: { public: false },
  },
  {
    name: "GetInvoice",
    path: "/GetInvoice/:_id",
    component: GetInvoice,
    meta: { public: false },
  },
  // {
  //   name: "GetInvoice",
  //   path: "/pdf/generate/:invoiceId/:businessId/:userId",
  //   component: GetInvoice,
  //   meta: { public: false },
  // },
  {
    name: "EditClient",
    path: "/ViewClient/:clientId/edit",
    component: EditClient,
    meta: { public: false },
  },
  {
    name: "EditInvoice",
    path: "/GetInvoice/:_id/edit",
    component: EditInvoice,
    meta: { public: false },
  },
  {
    name: "SendInvoice",
    path: "/GetInvoice/:_id/send",
    component: SendInvoice,
    meta: { public: false },
  },
  {
    name: "NotFound",
    path: "/:pathMatch(.*)*",
    component: NotFound,
    meta: { public: true },
  },
  { name: "Login", path: "/Login", component: Login, meta: { public: true } },
  {
    name: "ForgetPass",
    path: "/ForgetPass",
    component: ForgetPass,
    meta: { public: true },
  },
  {
    name: "SignUp",
    path: "/SignUp",
    component: SignUp,
    meta: { public: true },
  },
  {
    name: "Accounts",
    path: "/Accounts",
    component: Accounts,
    meta: { public: true },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("accessToken");

  if (!to.meta.public) {
    // Page requires authentication
    if (!token) {
      // User does not have token, redirect to login
      next({ name: "Login" });
    } else {
      // User has token, allow access to authenticated routes
      next();
    }
  } else {
    // Login is supposedly public - skip navigation if we have a token
    if (token) {
      // If user has token and tries to access public routes that should be restricted, redirect to main or another authenticated route
      if (
        to.path === "/login" ||
        to.path === "/signup" ||
        to.path === "/ForgetPass"
        // to.path === "/accounts"
      ) {
        next({ name: "Index" });
      } else {
        // Allow access to other authenticated routes
        next();
      }
    } else {
      // Allow access to public routes
      next();
    }
  }
});

export default router;
