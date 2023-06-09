import type { FC } from "react";
import clsx from "clsx";
import "./App.style";

export interface AppProps {
  className?: string;
}

const App: FC<AppProps> = ({ className }) => {
	return <div className={clsx("App", className)}>test</div>;
};

export default App;
