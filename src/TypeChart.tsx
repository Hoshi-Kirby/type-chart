import { useState } from "react";
import "./TypeChart.css";
import React from "react";

type TypeName =
  | "普"
  | "炎"
  | "水"
  | "草"
  | "電"
  | "氷"
  | "闘"
  | "毒"
  | "地"
  | "飛"
  | "超"
  | "虫"
  | "岩"
  | "霊"
  | "竜"
  | "悪"
  | "鋼"
  | "妖";

type TypeChart = {
  [atk in TypeName]?: {
    [def in TypeName]?: number;
  };
};

type Gen = "gen1" | "gen2" | "gen3" | "gen4";

type Props = {
  chart: TypeChart;
  gen: Gen;
};

const defTypesByGen: Record<Gen, TypeName[]> = {
  gen1: [
    "普",
    "炎",
    "水",
    "草",
    "電",
    "氷",
    "闘",
    "毒",
    "地",
    "飛",
    "超",
    "虫",
    "岩",
    "霊",
    "竜",
  ],
  gen2: [
    "普",
    "炎",
    "水",
    "草",
    "電",
    "氷",
    "闘",
    "毒",
    "地",
    "飛",
    "超",
    "虫",
    "岩",
    "霊",
    "竜",
    "悪",
    "鋼",
  ],
  gen3: [
    "普",
    "炎",
    "水",
    "草",
    "電",
    "氷",
    "闘",
    "毒",
    "地",
    "飛",
    "超",
    "虫",
    "岩",
    "霊",
    "竜",
    "悪",
    "鋼",
    "妖",
  ],
  gen4: [
    "普",
    "炎",
    "水",
    "草",
    "電",
    "氷",
    "闘",
    "毒",
    "地",
    "飛",
    "超",
    "虫",
    "岩",
    "霊",
    "竜",
    "悪",
    "鋼",
    "妖",
  ],
};

export const TypeChartTable: React.FC<Props> = ({ chart, gen }) => {
  const atkTypes = Object.keys(chart) as TypeName[];
  const defTypes = defTypesByGen[gen];
  const [hoverRow, setHoverRow] = useState<number | null>(null);
  const [hoverCol, setHoverCol] = useState<number | null>(null);

  function invert(eff: number): number {
    if (eff === 2) return 0.5;
    if (eff === 0.5) return 2;
    if (eff === 0) return 2;
    return 1; // 1倍はそのまま
  }

  function toSymbol(eff: number): string {
    if (eff === 2) return "○";
    if (eff === 0.5) return "△";
    if (eff === 0) return "×";
    return "";
  }

  function getClassName(eff: number): string {
    if (eff === 2) return "eff-super";
    if (eff === 0.5) return "eff-notvery";
    if (eff === 0) return "eff-immune";
    return "eff-normal";
  }

  return (
    <div>
      <table border={1} style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th></th>
            <th></th>
            <th colSpan={defTypes.length}>防御タイプ</th>
          </tr>
          <tr>
            <th></th>
            <th></th>
            {defTypes.map((def) => (
              <th key={def}>{def}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {atkTypes.map((atk, rowIndex) => (
            <tr key={atk}>
              {rowIndex === 0 ? (
                <th rowSpan={atkTypes.length} className="vertical">
                  攻撃タイプ
                </th>
              ) : null}

              <th>{atk}</th>

              {defTypes.map((def, defIndex) => {
                let eff = chart[atk]?.[def] ?? 1;
                if (gen === "gen4") eff = invert(eff);

                return (
                  <td
                    key={def}
                    onMouseEnter={() => {
                      setHoverRow(rowIndex);
                      setHoverCol(defIndex); // ← ここで defIndex が使える
                    }}
                    onMouseLeave={() => {
                      setHoverRow(null);
                      setHoverCol(null);
                    }}
                    className={[
                      getClassName(eff),
                      hoverRow === rowIndex ? "hover-row" : "",
                      hoverCol === defIndex ? "hover-col" : "",
                      hoverRow === rowIndex && hoverCol === defIndex
                        ? "hover-cell"
                        : "",
                    ].join(" ")}
                  >
                    <div className="squ">{toSymbol(eff)}</div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
