import { ChartDashboard } from "@/components/chart-dashboard";
import TabsDashboard from "@/components/tabs-dashboard";

export default function page() {
  return (
    <>
      <div className="mb-5">
        <ChartDashboard />
      </div>
      <TabsDashboard />
    </>
  );
}
