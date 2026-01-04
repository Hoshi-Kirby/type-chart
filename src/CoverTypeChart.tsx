import { useMemo, useState } from "react";
import "./TypeChart.css";
import React from "react";
import type { TypeName } from "./value";
import type { SpecialMove } from "./value";
import abilityData from "../public/ability.json";

type AttackType = TypeName | SpecialMove;

type TypeChart = {
  [atk in TypeName]?: {
    [def in TypeName]?: number;
  };
};

type Gen = "gen1" | "gen2" | "gen3" | "gen4";

type Props = {
  atkTypes: AttackType[]; // ← 6つの攻撃タイプ
  chart: TypeChart;
  gen: Gen;
  gutsy: boolean;
  levitate: boolean;
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

export const CoverTypeChartTable: React.FC<Props> = ({
  atkTypes,
  chart,
  gen,
  gutsy,
  levitate,
}) => {
  const types = defTypesByGen[gen];
  const [hoverRow, setHoverRow] = useState<number | null>(null);
  const [hoverCol, setHoverCol] = useState<number | null>(null);
  const abilityForGen = useMemo(() => {
    if (gen === "gen2") {
      return abilityData.gen2;
    } else if (gen === "gen3") {
      return mergeAbility(abilityData.gen2, abilityData.gen3);
    } else if (gen === "gen4") {
      return mergeAbility(abilityData.gen2, abilityData.gen4);
    } else {
      return {}; // gen1 は特性なし
    }
  }, [gen]);

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

  function mergeAbility(base: any, delta: any) {
    const result: Record<string, TypeName[][]> = JSON.parse(
      JSON.stringify(base)
    );

    for (const ability in delta) {
      const { add = [], remove = [] } = delta[ability];

      if (!result[ability]) result[ability] = [];

      // remove
      result[ability] = result[ability].filter(
        (t) =>
          !remove.some(
            (r: TypeName[]) => JSON.stringify(r) === JSON.stringify(t)
          )
      );

      // add
      result[ability].push(...add);
    }

    return result;
  }
  function hasAbilityType(
    abilityName: string,
    type1: TypeName,
    type2: TypeName,
    abilityForGen: Record<string, string[][]>
  ): boolean {
    const list = abilityForGen[abilityName];
    if (!list) return false;

    return list.some((pair) => pair[0] === type1 && pair[1] === type2);
  }
  function getWorstEffForAbility(
    abilityName: string,
    atkTypes: AttackType[],
    type1: TypeName,
    type2: TypeName,
    chart: TypeChart,
    gen: Gen,
    gutsy: boolean,
    abilityForGen: Record<string, string[][]>
  ): number {
    let maxEff = 0;

    for (const atk of atkTypes) {
      const eff = calcEff(
        atk,
        type1,
        type2,
        chart,
        gen,
        gutsy,
        abilityName,
        abilityForGen
      );
      if (eff > maxEff) maxEff = eff;
    }

    return maxEff;
  }
  function getBestAbilityEff(
    atkTypes: AttackType[],
    type1: TypeName,
    type2: TypeName,
    chart: TypeChart,
    gen: Gen,
    gutsy: boolean,
    levitate: boolean,
    abilityForGen: Record<string, string[][]>
  ): { eff: number; abilities: string[] } {
    const abilityNames = Object.keys(abilityForGen);

    // 特性なし
    let firstEff = getWorstEffForAbility(
      "",
      atkTypes,
      type1,
      type2,
      chart,
      gen,
      gutsy,
      abilityForGen
    );
    let bestEff = firstEff;
    let betterAbilities: string[] = [];

    // 各特性
    if (levitate) {
      for (const ability of abilityNames) {
        const eff = getWorstEffForAbility(
          ability,
          atkTypes,
          type1,
          type2,
          chart,
          gen,
          gutsy,
          abilityForGen
        );

        if (eff < firstEff) betterAbilities.push(ability);
        if (eff < bestEff) bestEff = eff;
      }
    }
    if (bestEff === firstEff) {
      return { eff: bestEff, abilities: [] };
    }

    return { eff: bestEff, abilities: betterAbilities };
  }

  function calcEff(
    atkType: AttackType,
    type1: TypeName,
    type2: TypeName,
    chart: TypeChart,
    gen: Gen,
    gutsy: boolean,
    avilityName: string,
    abilityForGen: Record<string, string[][]>
  ): number {
    let eff: number;
    // ① タイプ無し
    if (atkType === "-") return 0;

    // ② フリーズドライ（特殊技1）
    if (atkType === "1") {
      if (type1 === type2) {
        let eff1 = chart["氷"]?.[type1] ?? 1;
        eff1 = gen === "gen4" ? invert(eff1) : eff1;

        if (type1 === "水") eff1 = 2;
        return eff1;
      } else {
        let eff1 = chart["氷"]?.[type1] ?? 1;
        let eff2 = chart["氷"]?.[type2] ?? 1;

        if (gen === "gen4") {
          eff1 = invert(eff1);
          eff2 = invert(eff2);
        }

        if (type1 === "水") eff1 = 2;
        if (type2 === "水") eff2 = 2;
        return eff1 * eff2;
      }
    }

    // ③ フライングプレス（特殊技2）
    if (atkType === "2") {
      let effFight = calcEff(
        "闘",
        type1,
        type2,
        chart,
        gen,
        gutsy,
        avilityName,
        abilityForGen
      );
      let effFly = calcEff(
        "飛",
        type1,
        type2,
        chart,
        gen,
        gutsy,
        avilityName,
        abilityForGen
      );

      return effFight * effFly;
    }

    // ④ サウザンアロー（特殊技3）浮遊も無効化
    if (atkType === "3") {
      if (type1 === type2) {
        let eff1 = chart["地"]?.[type1] ?? 1;
        eff1 = gen === "gen4" ? invert(eff1) : eff1;
        if (type1 === "飛") eff1 = 1;
        return eff1;
      } else {
        let eff1 = chart["地"]?.[type1] ?? 1;
        let eff2 = chart["地"]?.[type2] ?? 1;

        if (type1 === "飛") eff1 = 1;
        if (type2 === "飛") eff2 = 1;
        return eff1 * eff2;
      }
    }

    // ⑤ 無に帰す光（特殊技4）
    if (atkType === "4") {
      if (type1 === type2) {
        let eff1 = chart["竜"]?.[type1] ?? 1;
        eff1 = gen === "gen4" ? invert(eff1) : eff1;
        if (type1 === "妖") eff1 = 1;
        return eff1;
      } else {
        let eff1 = chart["竜"]?.[type1] ?? 1;
        let eff2 = chart["竜"]?.[type2] ?? 1;

        if (type1 === "妖") eff1 = 1;
        if (type2 === "妖") eff2 = 1;

        return eff1 * eff2;
      }
    }
    // ⑥ きもったま、しんがん
    if (gutsy) {
      if (atkType === "普" || atkType === "闘") {
        if (type1 === "霊" || type2 === "霊") {
          if (type1 === type2) {
            let eff1 = chart[atkType]?.[type1] ?? 1;
            eff1 = gen === "gen4" ? invert(eff1) : eff1;

            if (eff1 === 0) eff1 = 1;
            return eff1;
          } else {
            let eff1 = chart[atkType]?.[type1] ?? 1;
            let eff2 = chart[atkType]?.[type2] ?? 1;

            if (gen === "gen4") {
              eff1 = invert(eff1);
              eff2 = invert(eff2);
            }

            if (eff1 === 0) eff1 = 1;
            if (eff2 === 0) eff2 = 1;
            return eff1 * eff2;
          }
        }
      }
    }
    // ⑦ 相手の特性
    if (avilityName == "ふゆう") {
      if (hasAbilityType(avilityName, type1, type2, abilityForGen)) {
        if (atkType === "地") {
          return 0;
        }
      }
    }
    if (avilityName == "どしょく") {
      if (hasAbilityType(avilityName, type1, type2, abilityForGen)) {
        if (atkType === "地") {
          return 0;
        }
      }
    }
    if (avilityName == "ちくでん") {
      if (hasAbilityType(avilityName, type1, type2, abilityForGen)) {
        if (atkType === "電") {
          return 0;
        }
      }
    }
    if (avilityName == "ひらいしん") {
      if (hasAbilityType(avilityName, type1, type2, abilityForGen)) {
        if (atkType === "電") {
          return 0;
        }
      }
    }
    if (avilityName == "でんきエンジン") {
      if (hasAbilityType(avilityName, type1, type2, abilityForGen)) {
        if (atkType === "電") {
          return 0;
        }
      }
    }
    if (avilityName == "ちょすい") {
      if (hasAbilityType(avilityName, type1, type2, abilityForGen)) {
        if (atkType === "水") {
          return 0;
        }
      }
    }
    if (avilityName == "よびみず") {
      if (hasAbilityType(avilityName, type1, type2, abilityForGen)) {
        if (atkType === "水") {
          return 0;
        }
      }
    }
    if (avilityName == "もらいび") {
      if (hasAbilityType(avilityName, type1, type2, abilityForGen)) {
        if (atkType === "炎") {
          return 0;
        }
      }
    }
    if (avilityName == "こんがりボディ") {
      if (hasAbilityType(avilityName, type1, type2, abilityForGen)) {
        if (atkType === "炎") {
          return 0;
        }
      }
    }
    if (avilityName == "そうしょく") {
      if (hasAbilityType(avilityName, type1, type2, abilityForGen)) {
        if (atkType === "草") {
          return 0;
        }
      }
    }
    if (avilityName == "あついしぼう") {
      if (hasAbilityType(avilityName, type1, type2, abilityForGen)) {
        if (atkType === "氷" || atkType === "炎") {
          return (
            calcEff(
              atkType,
              type1,
              type2,
              chart,
              gen,
              gutsy,
              "",
              abilityForGen
            ) / 2
          );
        }
      }
    }
    if (avilityName == "かんそうはだ") {
      if (hasAbilityType(avilityName, type1, type2, abilityForGen)) {
        if (atkType === "水") {
          return 0;
        }
        if (atkType === "炎") {
          return (
            calcEff(
              atkType,
              type1,
              type2,
              chart,
              gen,
              gutsy,
              "",
              abilityForGen
            ) * 1.25
          );
        }
      }
    }
    if (avilityName == "たいねつ") {
      if (hasAbilityType(avilityName, type1, type2, abilityForGen)) {
        if (atkType === "炎") {
          return (
            calcEff(
              atkType,
              type1,
              type2,
              chart,
              gen,
              gutsy,
              "",
              abilityForGen
            ) / 2
          );
        }
      }
    }
    if (avilityName == "きよめのしお") {
      if (hasAbilityType(avilityName, type1, type2, abilityForGen)) {
        if (atkType === "霊") {
          return (
            calcEff(
              atkType,
              type1,
              type2,
              chart,
              gen,
              gutsy,
              "",
              abilityForGen
            ) / 2
          );
        }
      }
    }
    if (avilityName == "すいほう") {
      if (hasAbilityType(avilityName, type1, type2, abilityForGen)) {
        if (atkType === "炎") {
          return (
            calcEff(
              atkType,
              type1,
              type2,
              chart,
              gen,
              gutsy,
              "",
              abilityForGen
            ) / 2
          );
        }
      }
    }

    //  通常のタイプ計算（ここが元の処理）

    if (type1 === type2) {
      eff = chart[atkType]?.[type1] ?? 1;
      if (gen === "gen4") eff = invert(eff);
    } else {
      const eff1 = chart[atkType]?.[type1] ?? 1;
      const eff2 = chart[atkType]?.[type2] ?? 1;
      const e1 = gen === "gen4" ? invert(eff1) : eff1;
      const e2 = gen === "gen4" ? invert(eff2) : eff2;
      eff = e1 * e2;
    }

    return eff;
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
              const { eff, abilities } = getBestAbilityEff(
                atkTypes,
                type1,
                type2,
                chart,
                gen,
                gutsy,
                levitate,
                abilityForGen
              );

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
                    abilities.length > 0 ? "everyday" : "",
                    getClassName(eff),
                    hoverRow === rowIndex ? "hover-row" : "",
                    hoverCol === colIndex ? "hover-col" : "",
                    hoverRow === rowIndex && hoverCol === colIndex
                      ? "hover-cell"
                      : "",
                    abilities.length > 0 ? "everyday" : "",
                  ].join(" ")}
                >
                  <div className="squ">
                    {toSymbol(eff)}

                    {hoverRow === rowIndex &&
                    hoverCol === colIndex &&
                    abilities.length > 0 ? (
                      <div className="abilities">
                        {abilities.map((a) => (
                          <div>{a}</div>
                        ))}
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
