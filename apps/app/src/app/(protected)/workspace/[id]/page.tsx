import { getWorkspaceById } from "@/features/workspace/api/get-workspaces";
import { OverviewChart } from "@/features/workspace/components/overview/overview-chart";
import { ParameterCard } from "@/features/workspace/components/overview/parameter-card";
import { TopProductBar } from "@/features/workspace/components/overview/top-product-bar";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function WorkspacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const workspace = await getWorkspaceById(id);
  if (!workspace) {
    redirect("/workspace");
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-center gap-4 flex-row">
        <ParameterCard
          title="Pendapat Hari Ini"
          amount="8.750.000"
          isPositive={true}
          description="Pendapat hari ini"
          percentage="8.32"
        />
        <ParameterCard
          title="Pesanan Masuk"
          amount="87"
          isPositive={true}
          description="Pesanan masuk untuk bulan ini"
          percentage="8.32"
        />
        <ParameterCard
          title="Rata-rata pesanan"
          amount="8.750.000"
          isPositive={true}
          description="Rata-rata pesanan untuk bulan ini"
          percentage="8.32"
        />
        <ParameterCard
          title="Pendapat Bulan Ini"
          amount="8.750.000"
          isPositive={false}
          description="Pendapat bulan ini"
          percentage="8.32"
        />
      </div>
      <div className="mt-4 grid grid-cols-5 gap-4 items-stretch">
        {/* Chart 1 (Lebar 3 kolom) */}
        <div className="col-span-3 flex flex-col">
          <Suspense>
            <OverviewChart />
          </Suspense>
        </div>

        {/* Chart 2 (Lebar 2 kolom) */}
        <div className="col-span-2 flex flex-col">
          <Suspense>
            <TopProductBar />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
