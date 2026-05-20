import { CircleDollarSign, TrendingDown, CalendarCheck2 } from "lucide-react";
import { KpiCard } from "../dashboard/kpi-card";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";

export function FinanceSummary({
  totalCollected,
  outstanding,
  thisMonthCollected,
}: {
  totalCollected: number;
  outstanding: number;
  thisMonthCollected: number;
}) {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <KpiCard
        icon={CircleDollarSign}
        label="Total Collected"
        value={formatCurrency(totalCollected)}
        hint="All time"
        tone="success"
      />
      <KpiCard
        icon={TrendingDown}
        label="Outstanding"
        value={formatCurrency(outstanding)}
        hint="To be collected"
        tone="warning"
      />
      <KpiCard
        icon={CalendarCheck2}
        label="This Month"
        value={formatCurrency(thisMonthCollected)}
        hint={format(new Date(), "MMMM yyyy")}
        tone="info"
      />
    </section>
  );
}
