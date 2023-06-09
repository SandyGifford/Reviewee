import { FC, useMemo } from "react";
import clsx from "clsx";
import "./App.style";
import { usePromise } from "../hooks";
import type { ReviewsByResponse } from "../types.client";
import BarChart, { BarChartData } from "./BarChart";
import { mapObject, typedEntries } from "../utils.client";

export type AppProps = {
  className?: string;
};

const App: FC<AppProps> = ({ className }) => {
  const [data, loading, error] = usePromise<ReviewsByResponse[]>(
    () => fetch("/api/reviewsBy").then((r) => r.json()),
    []
  );

  const barChartData = useMemo<BarChartData[] | undefined>(() => {
    const map = data?.reduce((acc, { login }) => {
      if (!acc[login]) acc[login] = 0;
      acc[login]++;
      return acc;
    }, {} as Record<string, number>);

    return map && typedEntries(map).map(([key, value]) => ({ key, value }));
  }, [data]);

  return (
    <div className={clsx("App", className)}>
      {(() => {
        if (error) return "ERROR!";
        if (!barChartData && loading) return "loading...";

        return barChartData && <BarChart data={barChartData} />;
      })()}
    </div>
  );
};

export default App;
