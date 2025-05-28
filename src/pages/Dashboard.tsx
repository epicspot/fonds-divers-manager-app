
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardContent } from "@/components/dashboard/DashboardContent";

const Dashboard = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen max-h-screen flex w-full overflow-hidden">
        <DashboardContent />
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
