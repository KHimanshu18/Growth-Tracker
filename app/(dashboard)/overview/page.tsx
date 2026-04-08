import { OverviewStats } from "./components/overview-stats";
import { OverviewGraph } from "./components/overview-graph";

export default function OverviewPage() {
  return (
    <div className="space-y-6">
      <OverviewStats />
      <OverviewGraph />
    </div>
  );
}
