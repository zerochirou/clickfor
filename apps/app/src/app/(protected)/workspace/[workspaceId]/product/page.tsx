import { MetricsCard } from "@/features/product/components/overview/metrics-card";
import { ProductTable } from "@/features/product/components/overview/product-table";

export default function ProductPage() {
  return (
    <div className="p-4">
      <div className="flex items-center justify-center gap-4 flex-row mb-4">
        <MetricsCard
          title="Total Penjualan"
          amount="1.000.000"
          percentage="10"
          isPositive={true}
          prefix="Rp"
          description="Mengalami kenaikan yang bagus"
        />
        <MetricsCard
          title="Jumlah Penjualan"
          amount="20"
          percentage="10"
          prefix="pcs"
          isPositive={true}
          description="Mengalami kenaikan yang bagus"
        />
        <MetricsCard
          title="Keuntungan Maksimal"
          amount="2.730.000"
          prefix="Rp"
          isPositive={true}
          description="Mengalami kenaikan yang bagus"
        />
        <MetricsCard
          title="Total Diskon"
          amount="200.000"
          prefix="Rp"
          isPositive={true}
          description="Sudah termasuk diskon"
        />
      </div>
      <ProductTable />
    </div>
  );
}
