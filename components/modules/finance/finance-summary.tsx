import { CircleDollarSign, TrendingDown, Scale } from "lucide-react";
import { KpiCard } from "../dashboard/kpi-card";
import { formatCurrency } from "@/lib/utils";

export function FinanceSummary({
  totalIncome,
  totalExpenses,
  netBalance,
}: {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
}) {
  // Net balance gets a tone that reflects whether the centre is in the black or red.
  const netTone: "success" | "warning" = netBalance >= 0 ? "success" : "warning";
  const netHint =
    netBalance >= 0 ? "Surplus" : "Deficit — review spending";

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <KpiCard
        icon={CircleDollarSign}
        label="Total Income"
        value={formatCurrency(totalIncome)}
        hint="Payments received"
        tone="success"
      />
      <KpiCard
        icon={TrendingDown}
        label="Total Expenses"
        value={formatCurrency(totalExpenses)}
        hint="All-time outflow"
        tone="warning"
      />
      <KpiCard
        icon={Scale}
        label="Net Balance"
        value={formatCurrency(netBalance)}
        hint={netHint}
        tone={netTone}
      />
    </section>
  );
}
