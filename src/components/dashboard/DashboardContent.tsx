
import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { DashboardMain } from "./DashboardMain";
import { DossiersSection } from "./sections/DossiersSection";
import { RepartitionSection } from "./sections/RepartitionSection";
import { PersonnelSection } from "./sections/PersonnelSection";
import { RegionsSection } from "./sections/RegionsSection";
import { ReferencesSection } from "./sections/ReferencesSection";
import { DashboardStatsSection } from "./sections/DashboardStatsSection";

export function DashboardContent() {
  const [activeSection, setActiveSection] = useState("main");

  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardStatsSection />;
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
      case "main":
        return <DashboardMain onSectionChange={setActiveSection} />;
      default:
        return <DashboardMain onSectionChange={setActiveSection} />;
    }
  };

  return (
    <>
      <AppSidebar onSectionChange={setActiveSection} activeSection={activeSection} />
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <div className="p-2 border-b bg-white flex-shrink-0">
          <SidebarTrigger />
        </div>
        <div className="flex-1 overflow-auto">
          {renderSection()}
        </div>
      </main>
    </>
  );
}
