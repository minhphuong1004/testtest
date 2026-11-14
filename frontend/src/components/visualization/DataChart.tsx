"use client";

import React, { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { Observation } from "@/types/observation";
import { formatTimestamp } from "@/lib/utils";
import { TrendingUp } from "lucide-react";

interface DataChartProps {
  observations: Observation[];
  selectedObservation: Observation | null;
  onSelectObservation?: (obs: Observation) => void;
  variableName?: string;
  unit?: string;
}

interface ChartDataPoint {
  id: string;
  timestamp: string;
  formattedTime: string;
  value: number;
  original: Observation;
}

export const DataChart: React.FC<DataChartProps> = ({
  observations,
  selectedObservation,
  onSelectObservation,
  variableName = "Aerosol Optical Depth (AOD)",
  unit = "dimensionless",
}) => {
  const chartData: ChartDataPoint[] = useMemo(() => {
    return observations.map((obs) => ({
      id: obs.id,
      timestamp: obs.timestamp,
      formattedTime: formatTimestamp(obs.timestamp).split(" ").slice(1, 4).join(" "),
      value: obs.value,
      original: obs,
    }));
  }, [observations]);

  return (
    <div className="rounded-2xl border border-space-800 bg-space-900/90 p-4 sm:p-6 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-cyan-400" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
            Atmospheric Time Series: {variableName}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded bg-space-800 px-2 py-0.5 text-[11px] text-cyan-400 font-mono border border-space-700">
            Unit: {unit}
          </span>
        </div>
      </div>

      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 15, left: -20, bottom: 0 }}
            onClick={(e) => {
              if (e && e.activePayload && e.activePayload[0] && onSelectObservation) {
                const point = e.activePayload[0].payload as ChartDataPoint;
                onSelectObservation(point.original);
              }
            }}
          >
            <defs>
              <linearGradient id="aodGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="formattedTime"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: "#334155" }}
            />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: "#334155" }}
              domain={[0, "auto"]}
            />

            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload as ChartDataPoint;
                  return (
                    <div className="rounded-lg border border-space-700 bg-space-950/95 p-2.5 text-xs shadow-xl backdrop-blur">
                      <p className="text-slate-400 mb-1">{data.formattedTime}</p>
                      <p className="font-bold text-white">
                        {data.value.toFixed(2)}{" "}
                        <span className="text-cyan-400 font-normal">{unit}</span>
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />

            {selectedObservation && (
              <ReferenceLine
                x={formatTimestamp(selectedObservation.timestamp)
                  .split(" ")
                  .slice(1, 4)
                  .join(" ")}
                stroke="#38bdf8"
                strokeDasharray="3 3"
              />
            )}

            <Area
              type="monotone"
              dataKey="value"
              stroke="#06b6d4"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#aodGradient)"
              activeDot={{
                r: 6,
                fill: "#38bdf8",
                stroke: "#0B1120",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 flex items-center justify-between text-[11px] text-slate-300">
        <span>Click any point on the chart to jump to that timestamp</span>
        <span>Extinction at 550nm wavelength</span>
      </div>
    </div>
  );
};
