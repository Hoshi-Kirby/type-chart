import { useState } from "react";
import "./TypeChart.css";
import React from "react";
import type { TypeName } from "./value";

type TypeChart = {
  [atk in TypeName]?: {
    [def in TypeName]?: number;
  };
};

type Gen = "gen0" | "gen1" | "gen2" | "gen3" | "gen4";

type Props = {
  atkType: TypeName;
  chart: TypeChart;
  gen: Gen;
};

const defTypesByGen: Record<Gen, TypeName[]> = {
  gen0: [
    "普",
    "炎",
    "水",
    "電",
    "草",
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
  gen1: [
    "普",
    "炎",
    "水",
    "電",
    "草",
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
    "電",
    "草",
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
    "電",
    "草",
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
    "電",
    "草",
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

export const DualTypeChartTable: React.FC<Props> = ({
  atkType,
  chart,
  gen,
}) => {
  const types = defTypesByGen[gen];
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
          <th colSpan={types.length}>タイプ2</th>
        </tr>
        <tr>
          <th></th>
          <th></th>
          {types.map((t) => (
            <th key={t}>{t}</th>
          ))}
        </tr>
      </thead>

      <tbody>
        {types.map((type1, rowIndex) => (
          <tr key={type1}>
            {rowIndex === 0 && (
              <th rowSpan={types.length} className="vertical">
                タイプ1
              </th>
            )}
            <th>{type1}</th>

            {types.map((type2, colIndex) => {
              let eff: number;

              if (type1 === type2) {
                // 同タイプ同士 → 単タイプ扱い
                eff = chart[atkType]?.[type1] ?? 1;
                if (gen === "gen4") eff = invert(eff);
              } else {
                // 通常の複合計算
                const eff1 = chart[atkType]?.[type1] ?? 1;
                const eff2 = chart[atkType]?.[type2] ?? 1;
                const e1 = gen === "gen4" ? invert(eff1) : eff1;
                const e2 = gen === "gen4" ? invert(eff2) : eff2;
                eff = e1 * e2;
              }

              return (
                <td
                  key={type2}
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
