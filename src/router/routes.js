import DashboardLayout from "@/layout/dashboard/DashboardLayout.vue";
import Dashboard from "@/pages/Dashboard.vue";

const routes = [
  {
    path: '/',
    component: DashboardLayout,
    children: [
      {
        path: "",
        name: "dashboard",
        component: Dashboard
      },
      {
        path: '/:id',
        name: "city",
        component: Dashboard
      }
    ]
  }
]

export default routes;
