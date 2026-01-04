import { useState } from "react";
import "./TypeChart.css";
import React from "react";
import type { TypeName } from "./value";

type TypeChart = {
  [atk in TypeName]?: {
    [def in TypeName]?: number;
  };
};

type Gen = "gen1" | "gen2" | "gen3" | "gen4";

type Props = {
  defTypes: TypeName[];
  chart: TypeChart;
  gen: Gen;
};

const atkTypesByGen: Record<Gen, TypeName[]> = {
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

export const ResistTypeChartTable: React.FC<Props> = ({
  defTypes,
  chart,
  gen,
}) => {
  const types = atkTypesByGen[gen];
  const poke = ["1", "2", "3", "4", "5", "6"];
  const [hoverRow, setHoverRow] = useState<number | null>(null);
  const [hoverCol, setHoverCol] = useState<number | null>(null);

  function invert(eff: number): number {
    if (eff === 2) return 0.5;
    if (eff === 0.5) return 2;
    if (eff === 0) return 2;
    return 1; // 1倍はそのまま
  }
  function toSymbol(eff: number): string {
    if (eff === 4) return "◎";
    if (eff === 2) return "○";
    if (eff === 0.5) return "△";
    if (eff === 0.25) return "⟁";
    if (eff === 0) return "×";
    return "";
  }
  function getClassName(eff: number): string {
    if (eff === 4) return "eff-super2";
    if (eff === 2) return "eff-super";
    if (eff === 0.5) return "eff-notvery";
    if (eff === 0.25) return "eff-notvery2";
    if (eff === 0) return "eff-immune";
    return "eff-normal";
  }
  return (
    <table border={1} style={{ borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th></th>
          <th></th>
          <th colSpan={types.length}>ポケモン</th>
        </tr>
        <tr>
          <th></th>
          <th></th>
          {poke.map((t) => (
            <th key={t}>{t}</th>
          ))}
        </tr>
      </thead>

      <tbody>
        {types.map((type1, rowIndex) => (
          <tr key={type1}>
            {rowIndex === 0 && (
              <th rowSpan={types.length} className="vertical">
                攻撃タイプ
              </th>
            )}
            <th>{type1}</th>

            {poke.map((num, colIndex) => {
              let eff: number;

              let eff1 = chart[type1]?.[defTypes[colIndex * 2]] ?? 1;
              let eff2 = chart[type1]?.[defTypes[colIndex * 2 + 1]] ?? 1;
              if (gen === "gen4") {
                eff1 = invert(eff1);
                eff2 = invert(eff2);
              }
              eff = eff1 * eff2;

              return (
                <td
                  key={num}
                  onMouseEnter={() => {
                    setHoverRow(rowIndex);
                    setHoverCol(colIndex);
                  }}
                  onMouseLeave={() => {
                    setHoverRow(null);
                    setHoverCol(null);
                  }}
                  className={[
                    getClassName(eff),
                    hoverRow === rowIndex ? "hover-row" : "",
                    hoverCol === colIndex ? "hover-col" : "",
                    hoverRow === rowIndex && hoverCol === colIndex
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
  );
};
