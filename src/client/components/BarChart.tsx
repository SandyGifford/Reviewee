import clsx from "clsx";
import { ReactElement, useEffect, useRef, useState } from "react";
import "./BarChart.style";
import type { CSSProperties } from "react";
import type { ReactNode } from "react";
import { useMemo } from "react";
import { mapToMap, mapToObject, typedValues } from "../utils.client";

export type BarChartData<K = string, V = number> = { key: K; value: V };

export type BarChartFn<K, V, T> = (data: BarChartData<K, V>) => T;

export type BarChartNodeRenderer<K, V> = BarChartFn<K, V, ReactNode>;
export type BarChartValueGetter<K, V> = BarChartFn<K, V, number>;
export type BarChartKeyGetter<K, V> = BarChartFn<K, V, string>;

export type BarChartProps<K, V> = {
  className?: string;
  data: BarChartData<K, V>[];
  barHeight?: number;
  barGap?: number;
} & (V extends number
  ? {
      getValue?: BarChartValueGetter<K, V>;
    }
  : {
      getValue: BarChartValueGetter<K, V>;
    }) &
  (K extends number | string
    ? {
        renderTick?: BarChartNodeRenderer<K, V>;
        getKey?: BarChartKeyGetter<K, V>;
      }
    : {
        renderTick: BarChartNodeRenderer<K, V>;
        getKey: BarChartKeyGetter<K, V>;
      }) &
  (V extends number | string
    ? {
        renderLabel?: BarChartNodeRenderer<K, V>;
      }
    : {
        renderLabel: BarChartNodeRenderer<K, V>;
      });

const BarChart = <K, V>({
  className,
  data,
  barHeight = 36,
  barGap = 8,
  renderTick = ({ key }) => key,
  getKey = ({ key }) => `${key}`,
  // TODO: totally unsure why the types are screwy on this one prop
  renderLabel = (data: BarChartData<K, V>) => data.value as string,
  getValue = ({ value }) => value,
}: BarChartProps<K, V>): ReactElement<BarChartProps<K, V>, "div"> => {
  const [tickWidth, setTickWidth] = useState(100);

  const valueMap = useMemo(
    () =>
      mapToMap(data, (data) => [
        data.key,
        {
          ...data,
          strKey: getKey(data),
          numValue: getValue(data),
          tick: renderTick(data),
          label: renderLabel(data),
        },
      ]),
    [data]
  );

  const maxValue = useMemo(
    () =>
      Math.max(
        ...Array.from(valueMap.values()).map(({ numValue }) => numValue)
      ),
    [valueMap]
  );

  const getY = (i: number) => (barHeight + barGap) * i;

  let maxTickWidth = 0;

  useEffect(() => {
    setTickWidth(maxTickWidth);
  });

  return (
    <div className={clsx("BarChart", className)}>
      <div className="BarChart__ticks" style={{ width: tickWidth }}>
        {data.map(({ key }, i) => {
          const d = valueMap.get(key);
          if (!d) return;
          const { tick, strKey } = d;

          return (
            <div
              key={strKey}
              className="BarChart__ticks__tick"
              style={{ height: barHeight, top: getY(i) }}
              ref={(el) =>
                (maxTickWidth = Math.max(maxTickWidth, el?.offsetWidth || 0))
              }
            >
              {tick}
            </div>
          );
        })}
      </div>
      <div className="BarChart__bars">
        {data.map(({ key }, i) => {
          const d = valueMap.get(key);
          if (!d) return;
          const { label, numValue, strKey } = d;

          return (
            <div
              key={strKey}
              className="BarChart__bars__barWrapper"
              style={{ height: barHeight, top: getY(i) }}
            >
              <div
                className="BarChart__bars__barWrapper__bar"
                style={{ width: `${(100 * numValue) / maxValue}%` }}
              >
                <div className="BarChart__bars__barWrapper__bar__label">
                  {label}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BarChart;
