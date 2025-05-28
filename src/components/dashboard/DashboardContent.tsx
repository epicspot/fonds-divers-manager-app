
import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { DashboardMain } from "./DashboardMain";
import { DossiersSection } from "./sections/DossiersSection";
import { RepartitionSection } from "./sections/RepartitionSection";
import { PersonnelSection } from "./sections/PersonnelSection";
import { RegionsSection } from "./sections/RegionsSection";
import { ReferencesSection } from "./sections/ReferencesSection";

export function DashboardContent() {
  const [activeSection, setActiveSection] = useState("dashboard");

  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardMain />;
      case "dossiers":
        return <DossiersSection />;
      case "repartition":
        return <RepartitionSection />;
      case "personnel":
        return <PersonnelSection />;
      case "regions":
        return <RegionsSection />;
      case "references":
        return <ReferencesSection />;
      default:
        return <DashboardMain />;
    }
  };

  return (
    <>
      <AppSidebar onSectionChange={setActiveSection} activeSection={activeSection} />
      <main className="flex-1 overflow-auto">
        <div className="p-4 border-b bg-white">
          <SidebarTrigger />
        </div>
        {renderSection()}
      </main>
    </>
  );
}
