"use client";

import ShinyText from "@/components/commons/text-animations/shiny-text";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingDown, TrendingUp } from "lucide-react";

interface ParameterCardProps {
  title: string;
  amount: string; // Nominal utama (contoh: "90.000")
  percentage: string; // Nilai persentase (contoh: "8.32")
  isPositive: boolean;
  description: string;
}

export function ParameterCard({
  title,
  amount,
  percentage,
  isPositive,
  description,
}: ParameterCardProps) {

  return (
    <Card className="max-w-sm w-full shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div
          className={cn(
            "flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold",
            isPositive
              ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10"
              : "text-red-600 dark:text-red-400 bg-red-500/10",
          )}
        >
          {isPositive ? (
            <TrendingUp className="w-3.5 h-3.5" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5" />
          )}
          <span>
            {isPositive ? "+" : "-"}
            {percentage}%
          </span>
        </div>
      </CardHeader>

      <CardContent suppressHydrationWarning className="pt-2">
        <div className="flex items-baseline gap-1.5">
          <span className="text-lg font-semibold text-muted-foreground">
            Rp
          </span>
          <ShinyText
            text={amount}
            speed={2}
            delay={0}
            // color={theme === "dark" ? "#b5b5b5" : "#141414"}
            color="#b5b5b5"
            // shineColor={theme === "dark" ? "#ffffff" : "#5d5d5d"}
            shineColor="#5d5d5d"
            spread={120}
            direction="left"
            yoyo={true}
            pauseOnHover={true}
            disabled={false}
            className="text-3xl font-bold font-mono tracking-tight"
          />
        </div>
      </CardContent>

      <CardFooter className="pt-0 text-xs text-muted-foreground">
        {description}
      </CardFooter>
    </Card>
  );
}
