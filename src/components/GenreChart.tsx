import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  type TooltipContentProps,
} from "recharts";
import { Card, CardDescription, CardTitle } from "./ui/card";

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipContentProps<number, string>) => {
  const isVisible = active && payload && payload.length;
  return (
    <div
      className="custom-tooltip"
      style={{ visibility: isVisible ? "visible" : "hidden" }}
    >
      {isVisible && (
        <Card className="p-5 items-center opacity-80 gap-4">
          <CardTitle className="text-sm text-foreground">{label}</CardTitle>
          <CardDescription>{"value: " + payload[0].value}</CardDescription>
        </Card>
      )}
    </div>
  );
};

type GenreChartProps = {
  data: { name: string; value: number }[];
};

export default function GenreChart({ data }: GenreChartProps) {
  // Get theme colors from CSS variables
  const colorForeground =
    typeof window !== "undefined"
      ? getComputedStyle(document.documentElement)
          .getPropertyValue("--color-foreground")
          .trim()
      : "#8884d8";

  const colorMutedForeground =
    typeof window !== "undefined"
      ? getComputedStyle(document.documentElement)
          .getPropertyValue("--color-muted-foreground")
          .trim()
      : "#ccc";

  const colorBackground =
    typeof window !== "undefined"
      ? getComputedStyle(document.documentElement)
          .getPropertyValue("--color-background")
          .trim()
      : "#010000";

  // Fallback if there is no data
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-80 flex items-center justify-center text-muted-foreground text-sm">
        No data found
      </div>
    );
  }

  return (
    <div className="w-full h-80 text-sm flex justify-center">
      <ResponsiveContainer
        width="100%"
        height="100%"
        className="recharts-no-outline"
      >
        <BarChart
          data={data}
          margin={{
            top: 0,
            right: 30,
            left: -20,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="2 5" fill={colorBackground} />
          <XAxis dataKey="name" stroke={colorMutedForeground} />
          <YAxis allowDecimals={false} stroke={colorMutedForeground} />
          <Tooltip cursor={{ fill: "transparent" }} content={CustomTooltip} />
          <Bar
            dataKey="value"
            fill={colorForeground}
            activeBar={
              <Rectangle fill={colorMutedForeground} stroke={colorForeground} />
            }
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
