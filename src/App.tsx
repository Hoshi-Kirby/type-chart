// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import "./App.css";
import { useEffect, useState } from "react";
import { TypeChartTable } from "./TypeChart";

type Gen = "gen1" | "gen2" | "gen3" | "gen4";

export default function App() {
  const [allCharts, setAllCharts] = useState<any>({});
  const [gen, setGen] = useState<Gen>("gen1");
  const chartForGen = gen === "gen4" ? allCharts["gen3"] : allCharts[gen];

  useEffect(() => {
    fetch("/type.json")
      .then((res) => res.json())
      .then((data) => setAllCharts(data));
  }, []);
  return (
    <div>
      <div>
        <h1>タイプ相性表</h1>
      </div>
      <div className="layout-row">
        <p>世代</p>
        <select value={gen} onChange={(e) => setGen(e.target.value as Gen)}>
          <option value="gen1">赤緑</option>
          <option value="gen2">金銀~BW</option>
          <option value="gen3">XY~</option>
          <option value="gen4">サカサ</option>
        </select>
      </div>
      <div className="layout-row">
        <p>モード</p>
        <select>
          <option value="gen1">タイプ相性</option>
          <option value="gen2">対複合相性</option>
          <option value="gen3">相性補完</option>
          <option value="gen4">複合耐性</option>
        </select>
      </div>

      <div className="chart-wrapper">
        {chartForGen && <TypeChartTable chart={chartForGen} gen={gen} />}
      </div>
    </div>
  );
}
