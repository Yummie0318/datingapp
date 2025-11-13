// C:\Users\Yummie03\Desktop\datingapp\src\components\ui\chart.tsx
"use client";

import * as React from "react";
import * as RechartsPrimitive from "recharts";
import { cn } from "./utils";

// ✅ Minimal public-safe typings for custom tooltip content
type ValueType = number | string | Array<number | string>;
type NameType = string | number;

// What Recharts actually passes to the custom tooltip content
type RechartsTooltipContentProps = {
  active?: boolean;
  payload?: any[]; // array of tooltip items
  label?: any;
};

// -------------------------
// Theme definitions
// -------------------------
const THEMES = { light: "", dark: ".dark" } as const;

// -------------------------
// Chart config types
// -------------------------
export type ChartConfig = {
  [key: string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  );
};

// -------------------------
// Context for chart config
// -------------------------
type ChartContextProps = {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);
  if (!context) throw new Error("useChart must be used within a <ChartContainer />");
  return context;
}

// -------------------------
// Chart Container
// -------------------------
interface ChartContainerProps extends React.ComponentProps<"div"> {
  id?: string;
  config: ChartConfig;
  children: React.ReactNode;
}

const ChartContainer = ({ id, className, children, config, ...props }: ChartContainerProps) => {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart"
        data-chart={chartId}
        className={cn(
          "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border flex aspect-video justify-center text-xs [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-hidden [&_.recharts-sector]:outline-hidden [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-surface]:outline-hidden",
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>{children}</RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
};

// -------------------------
// Chart style for colors
// -------------------------
const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(([, cfg]) => cfg.theme || cfg.color);
  if (!colorConfig.length) return null;

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(([theme, prefix]) => {
            const themeCss = colorConfig
              .map(([key, cfg]) => {
                const color = (cfg as any).theme?.[theme as keyof typeof THEMES] || cfg.color;
                return color ? `  --color-${key}: ${color};` : "";
              })
              .join("\n");
            return `${prefix} [data-chart=${id}] {\n${themeCss}\n}`;
          })
          .join("\n"),
      }}
    />
  );
};

// -------------------------
// Chart Tooltip
// -------------------------
const ChartTooltip = RechartsPrimitive.Tooltip;

/**
 * IMPORTANT:
 * <Tooltip content={<ChartTooltipContent />} />
 * Your component must be typed with the *content* props (active, payload, label),
 * not the Tooltip component props.
 */
interface ChartTooltipContentProps extends RechartsTooltipContentProps {
  className?: string;
  indicator?: "line" | "dot" | "dashed";
  hideLabel?: boolean;
  hideIndicator?: boolean;

  // We allow ReactNode for label
  label?: React.ReactNode;

  // Optional formatters
  labelFormatter?: (label: any, payload?: any[]) => React.ReactNode;
  labelClassName?: string;
  formatter?: (
    value: ValueType,
    name: NameType,
    item: any,
    index: number
  ) => React.ReactNode;

  color?: string;
  nameKey?: string;
  labelKey?: string;
}

const ChartTooltipContent = ({
  active,
  payload,
  className,
  indicator = "dot",
  hideLabel = false,
  hideIndicator = false,
  label,
  labelFormatter,
  labelClassName,
  formatter,
  color,
  nameKey,
  labelKey,
}: ChartTooltipContentProps) => {
  const { config } = useChart();

  const tooltipLabel = React.useMemo(() => {
    if (hideLabel || !payload?.length) return null;
    const item = payload[0] as any;
    const key = `${labelKey || (item?.dataKey as string) || (item?.name as string) || "value"}`;
    const itemConfig = getPayloadConfigFromPayload(config, item, key);
    const value =
      !labelKey && typeof label === "string"
        ? config[label as keyof typeof config]?.label || label
        : itemConfig?.label;

    if (!value) return null;

    return labelFormatter ? (
      <div className={cn("font-medium", labelClassName)}>
        {labelFormatter(value, payload as any[])}
      </div>
    ) : (
      <div className={cn("font-medium", labelClassName)}>{value}</div>
    );
  }, [label, labelFormatter, payload, hideLabel, labelClassName, config, labelKey]);

  if (!active || !payload?.length) return null;

  const nestLabel = payload.length === 1 && indicator !== "dot";

  return (
    <div
      className={cn(
        "border-border/50 bg-background grid min-w-[8rem] items-start gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs shadow-xl",
        className
      )}
    >
      {!nestLabel ? tooltipLabel : null}
      <div className="grid gap-1.5">
        {(payload as any[]).map((item, index: number) => {
          const key = `${nameKey || (item.name as string) || (item.dataKey as string) || "value"}`;
          const itemConfig = getPayloadConfigFromPayload(config, item, key);
          const indicatorColor = color || (item.payload as any)?.fill || (item as any).color;

          return (
            <div
              key={(item.dataKey as string) || index}
              className={cn(
                "[&>svg]:text-muted-foreground flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5",
                indicator === "dot" && "items-center"
              )}
            >
              {formatter && item?.value !== undefined && item.name != null ? (
                <>{formatter(item.value as ValueType, item.name as NameType, item, index)}</>
              ) : (
                <>
                  {itemConfig?.icon ? (
                    <itemConfig.icon />
                  ) : (
                    !hideIndicator && (
                      <div
                        className={cn(
                          "shrink-0 rounded-[2px] border-(--color-border) bg-(--color-bg)",
                          {
                            "h-2.5 w-2.5": indicator === "dot",
                            "w-1": indicator === "line",
                            "w-0 border-[1.5px] border-dashed bg-transparent":
                              indicator === "dashed",
                            "my-0.5": nestLabel && indicator === "dashed",
                          }
                        )}
                        style={
                          {
                            "--color-bg": indicatorColor,
                            "--color-border": indicatorColor,
                          } as React.CSSProperties
                        }
                      />
                    )
                  )}
                  <div
                    className={cn(
                      "flex flex-1 justify-between leading-none",
                      nestLabel ? "items-end" : "items-center"
                    )}
                  >
                    <div className="grid gap-1.5">
                      {nestLabel ? tooltipLabel : null}
                      <span className="text-muted-foreground">
                        {itemConfig?.label || (item.name as React.ReactNode)}
                      </span>
                    </div>
                    {item.value != null && (
                      <span className="text-foreground font-mono font-medium tabular-nums">
                        {typeof item.value === "number"
                          ? item.value.toLocaleString()
                          : String(item.value)}
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// -------------------------
// Chart Legend
// -------------------------
const ChartLegend = RechartsPrimitive.Legend;

interface ChartLegendContentProps extends React.ComponentProps<"div"> {
  hideIcon?: boolean;
  payload?: any[];
  verticalAlign?: "top" | "bottom";
  nameKey?: string;
}

const ChartLegendContent = ({
  className,
  hideIcon = false,
  payload,
  verticalAlign = "bottom",
  nameKey,
}: ChartLegendContentProps) => {
  const { config } = useChart();
  if (!payload?.length) return null;

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-4",
        verticalAlign === "top" ? "pb-3" : "pt-3",
        className
      )}
    >
      {payload.map((item: any) => {
        const key = `${nameKey || item.dataKey || "value"}`;
        const itemConfig = getPayloadConfigFromPayload(config, item, key);
        return (
          <div
            key={item.value || key}
            className={cn(
              "[&>svg]:text-muted-foreground flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3"
            )}
          >
            {itemConfig?.icon && !hideIcon ? (
              <itemConfig.icon />
            ) : (
              <div
                className="h-2 w-2 shrink-0 rounded-[2px]"
                style={{ backgroundColor: item.color }}
              />
            )}
            {itemConfig?.label}
          </div>
        );
      })}
    </div>
  );
};

// -------------------------
// Helper to map payload to config
// -------------------------
function getPayloadConfigFromPayload(config: ChartConfig, payload: any, key: string) {
  if (!payload || typeof payload !== "object") return undefined;
  const payloadPayload =
    payload.payload && typeof payload.payload === "object" ? payload.payload : undefined;

  let configLabelKey = key;
  if (key in payload && typeof (payload as any)[key] === "string") configLabelKey = (payload as any)[key];
  else if (payloadPayload && key in payloadPayload && typeof (payloadPayload as any)[key] === "string")
    configLabelKey = (payloadPayload as any)[key];

  return (config as any)[configLabelKey] ?? (config as any)[key];
}

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
};
