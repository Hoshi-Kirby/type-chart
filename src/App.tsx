// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import "./App.css";
import { useEffect, useState } from "react";
import { TypeChartTable } from "./TypeChart";
import { DualTypeChartTable } from "./DualTypeChart";
import { CoverTypeChartTable } from "./CoverTypeChart";
import { ResistTypeChartTable } from "./ResistTypeChart";
import { ConditionTypeChartTable } from "./ConditionTypeChart";
import type { TypeName } from "./value";

type Gen = "gen1" | "gen2" | "gen3" | "gen4";
const typeLabels: Record<TypeName, string> = {
  普: "ノーマル",
  炎: "ほのお",
  水: "みず",
  草: "くさ",
  電: "でんき",
  氷: "こおり",
  闘: "かくとう",
  毒: "どく",
  地: "じめん",
  飛: "ひこう",
  超: "エスパー",
  虫: "むし",
  岩: "いわ",
  霊: "ゴースト",
  竜: "ドラゴン",
  悪: "あく",
  鋼: "はがね",
  妖: "フェアリー",
  "-": "タイプ無し",
};

const atkTypesByGen: Record<Gen, TypeName[]> = {
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
    // サカサは gen3 と同じタイプ数
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
export default function App() {
  const [help, setHelp] = useState<boolean>(false);
  const [helpPage, setHelpPage] = useState<number>(1);
  const [allCharts, setAllCharts] = useState<any>({});
  const [gen, setGen] = useState<Gen>("gen3");
  const chartForGen = gen === "gen4" ? allCharts["gen3"] : allCharts[gen];
  const [mode, setMode] = useState("single");
  const [atkType, setAtkType] = useState<TypeName>("普");
  const [atkTypes, setAtkTypes] = useState<TypeName[]>([
    "-",
    "-",
    "-",
    "-",
    "-",
    "-",
  ]);
  const [defTypes, setDefTypes] = useState<TypeName[]>([
    "-",
    "-",
    "-",
    "-",
    "-",
    "-",
    "-",
    "-",
    "-",
    "-",
    "-",
    "-",
  ]);
  const [atkTypesC, setAtkTypesC] = useState<TypeName[]>(["-", "-", "-", "-"]);
  const [atkMagniC, setAtkMagniC] = useState<number[]>([1, 1, 1, 1]);
  const [atkSizeC, setAtkSizeC] = useState<(-1 | 0 | 1)[]>([0, 0, 0, 0]);

  // 特性
  const [abilities, setAbilities] = useState({
    levitate: false,
    gutsy: false, // 肝っ玉
  });

  useEffect(() => {
    fetch("/type.json")
      .then((res) => res.json())
      .then((data) => setAllCharts(data));
  }, []);
  return (
    <>
      <div className="back"></div>
      <div className="app-wrapper">
        <div className="container">
          <h1 className="title">タイプ相性表</h1>
          {help === false ? (
            <button className="help-button" onClick={() => setHelp(true)}>
              使い方∨
            </button>
          ) : (
            <>
              <button className="help-button" onClick={() => setHelp(false)}>
                使い方∧
              </button>
              <div>
                <div className="header">
                  <button
                    className="help-button"
                    onClick={() => setHelpPage(helpPage > 1 ? helpPage - 1 : 1)}
                  >
                    ＜
                  </button>
                  <p>{helpPage}/5</p>
                  <button
                    className="help-button"
                    onClick={() => setHelpPage(helpPage < 5 ? helpPage + 1 : 5)}
                  >
                    ＞
                  </button>
                </div>
                {helpPage === 1 ? (
                  <>
                    <h4>このサイトについて</h4>
                    <div>
                      このサイトは全世代、複合タイプ対応のタイプ相性表です。
                    </div>
                    <div>また、四つの技の技範囲を見ることもできます。</div>
                    <div className="hr">
                      世代を選択することで、過去作の相性で調べることができます。
                    </div>
                  </>
                ) : helpPage === 2 ? (
                  <>
                    <h4>モード：タイプ相性</h4>
                    <div>よく見るタイプ相性表です。</div>
                  </>
                ) : helpPage === 3 ? (
                  <>
                    <h4>モード：対複合相性</h4>
                    <div>複合タイプのタイプ相性表です。</div>
                    <div className="hr">
                      攻撃するタイプを選択すると、複合タイプに対する相性を見ることができます。
                    </div>
                  </>
                ) : helpPage === 4 ? (
                  <>
                    <h4>モード：技範囲</h4>
                    <div className="hr">
                      攻撃するタイプを複数入力して、それぞれの複合タイプに対して最善の技を打った場合の相性が表示されます。
                    </div>
                    <div className="hr">
                      テラバーストやウェザーボールなどの一つのタイプで二タイプ使える技は、「例外」の欄を利用してください。
                    </div>
                    <div className="hr">
                      相手の特性を考慮する場合、相手の特性によって最善の相性が変化する可能性がある複合タイプを赤色で示します。
                    </div>
                    <div className="hr">
                      また、その特性はタップまたはマウスオーバーすることで見ることができます。
                    </div>
                  </>
                ) : (
                  <>
                    <h4>モード：複合耐性</h4>
                    <div className="hr">
                      選択した複合タイプに対する全タイプの相性を見ることができます。
                    </div>
                    <div className="hr">六匹同時に見ることができます。</div>
                  </>
                )}
                <hr className="hr"></hr>
              </div>
            </>
          )}

          <div className="layout-row">
            <p>世代</p>
            <select value={gen} onChange={(e) => setGen(e.target.value as Gen)}>
              <option value="gen1">赤緑</option>
              <option value="gen2">金銀～BW</option>
              <option value="gen3">XY～</option>
              <option value="gen4">さかさ</option>
            </select>
          </div>
          <div className="layout-row">
            <p>モード</p>
            <select value={mode} onChange={(e) => setMode(e.target.value)}>
              <option value="single">タイプ相性</option>
              <option value="dual">対複合相性</option>
              <option value="cover">技範囲</option>
              <option value="resist">複合耐性</option>
              <option value="condition">相性条件</option>
            </select>
          </div>
          {mode === "single" && (
            <div className="chart-wrapper">
              {chartForGen && <TypeChartTable chart={chartForGen} gen={gen} />}

              <div className="mark">
                <span className="x2">○</span>
                :×2　
                <span className="x05">△</span>:×0.5　
                <span className="x0">×</span>:×0
              </div>
            </div>
          )}
          {mode === "dual" && (
            <>
              <div className="layout-row">
                <p>攻撃タイプ</p>
                <select
                  value={atkType}
                  onChange={(e) => setAtkType(e.target.value as TypeName)}
                >
                  {atkTypesByGen[gen].map((t) => (
                    <option key={t} value={t}>
                      {typeLabels[t]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="chart-wrapper">
                {chartForGen && (
                  <DualTypeChartTable
                    atkType={atkType}
                    chart={chartForGen}
                    gen={gen}
                  />
                )}

                <div className="mark">
                  <span className="x4">◎</span>:×4　
                  <span className="x2">○</span>:×2　
                  <span className="x05">△</span>:×0.5　
                  <span className="x025">⟁</span>
                  :×0.25　<span className="x0">×</span>:×0
                </div>
              </div>
            </>
          )}
          {mode === "cover" && (
            <>
              <div style={{ width: "100%" }}>
                <div className="cover-types">
                  <h3>攻撃タイプ</h3>

                  <div className="atk-grid">
                    {atkTypes.map((t, i) => (
                      <div key={i} className="atk-item">
                        <p>{i >= 4 ? "例外" : `技 ${i + 1}`}</p>
                        <select
                          value={t}
                          onChange={(e) => {
                            const newArr = [...atkTypes];
                            newArr[i] = e.target.value as TypeName;
                            setAtkTypes(newArr);
                          }}
                        >
                          <option value="-">-</option> {}
                          {atkTypesByGen[gen].map((type) => (
                            <option key={type} value={type}>
                              {typeLabels[type]}
                            </option>
                          ))}
                          {(gen === "gen3" || gen === "gen4") && (
                            <>
                              <option value="1">フリーズドライ</option>
                              <option value="2">フライングプレス</option>
                              {gen === "gen3" && (
                                <>
                                  <option value="3">サウザンアロー</option>
                                  <option value="4">無に帰す光</option>
                                </>
                              )}
                            </>
                          )}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
                {(gen === "gen2" || gen === "gen3" || gen === "gen4") && (
                  <>
                    <h3>特性</h3>
                    <label>
                      <input
                        type="checkbox"
                        checked={abilities.gutsy}
                        onChange={(e) =>
                          setAbilities({
                            ...abilities,
                            gutsy: e.target.checked,
                          })
                        }
                      />
                      肝っ玉/心眼
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        checked={abilities.levitate}
                        onChange={(e) =>
                          setAbilities({
                            ...abilities,
                            levitate: e.target.checked,
                          })
                        }
                      />
                      相手の特性を考慮
                    </label>
                  </>
                )}
              </div>
              <div className="chart-wrapper">
                {chartForGen && (
                  <CoverTypeChartTable
                    atkTypes={atkTypes}
                    chart={chartForGen}
                    gen={gen}
                    gutsy={abilities.gutsy}
                    levitate={abilities.levitate}
                  />
                )}

                <div className="mark">
                  <span className="x4">◎</span>:×4　
                  <span className="x2">○</span>:×2　
                  <span className="x05">△</span>:×0.5　
                  <span className="x025">⟁</span>
                  :×0.25　<span className="x0">×</span>:×0
                </div>
              </div>
            </>
          )}
          {mode === "resist" && (
            <>
              <div className="cover-types">
                <h3>防御タイプ</h3>

                <div className="def-grid">
                  {defTypes.map((t, i) => (
                    <div key={i} className="def-item">
                      <p>{i % 2 === 0 ? `ポケモン ${i / 2 + 1}` : ""}</p>
                      <select
                        value={t}
                        onChange={(e) => {
                          const newArr = [...defTypes];
                          newArr[i] = e.target.value as TypeName;
                          setDefTypes(newArr);
                        }}
                      >
                        <option value="-">-</option> {}
                        {defTypesByGen[gen].map((type) => (
                          <option key={type} value={type}>
                            {typeLabels[type]}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
              <div className="chart-wrapper">
                {chartForGen && (
                  <ResistTypeChartTable
                    defTypes={defTypes}
                    chart={chartForGen}
                    gen={gen}
                  />
                )}

                <div className="mark">
                  <span className="x4">◎</span>:×4　
                  <span className="x2">○</span>:×2　
                  <span className="x05">△</span>:×0.5　
                  <span className="x025">⟁</span>
                  :×0.25　<span className="x0">×</span>:×0
                </div>
              </div>
            </>
          )}
          {mode === "condition" && (
            <>
              <div style={{ width: "100%" }}>
                <div className="cover-types">
                  <h3>攻撃タイプ</h3>

                  <div>
                    {[0, 1, 2, 3].map((i) => (
                      <div key={i} className="atk-item">
                        <p>技 {i + 1}</p>

                        {/* タイプ選択 */}
                        <select
                          value={atkTypesC[i]}
                          onChange={(e) => {
                            const newArr = [...atkTypesC];
                            newArr[i] = e.target.value as TypeName;

                            setAtkTypesC(newArr);
                          }}
                        >
                          {" "}
                          <option value="-">-</option>
                          {/* 通常タイプ */}
                          {atkTypesByGen[gen].map((type) => (
                            <option key={type} value={type}>
                              {typeLabels[type]}
                            </option>
                          ))}
                          {/* 特殊技 */}
                          {(gen === "gen3" || gen === "gen4") && (
                            <>
                              <option value="1">フリーズドライ</option>
                              <option value="2">フライングプレス</option>

                              {gen === "gen3" && (
                                <>
                                  <option value="3">サウザンアロー</option>
                                  <option value="4">無に帰す光</option>
                                </>
                              )}
                            </>
                          )}
                        </select>

                        {/* 二連セレクト（倍率 × 条件） */}
                        <div className="dual-select">
                          {/* 倍率 */}
                          <select
                            value={atkMagniC[i]}
                            onChange={(e) => {
                              const newArr = [...atkMagniC];
                              newArr[i] = Number(e.target.value);
                              setAtkMagniC(newArr);
                            }}
                          >
                            <option value={0}>無効</option>
                            <option value={0.25}>1/4倍</option>
                            <option value={0.5}>半減</option>
                            <option value={1}>等倍</option>
                            <option value={2}>弱点</option>
                            <option value={4}>4倍</option>
                          </select>

                          {/* 条件 */}
                          <select
                            value={atkSizeC[i]}
                            onChange={(e) => {
                              const newArr = [...atkSizeC];
                              newArr[i] = Number(e.target.value) as -1 | 0 | 1;

                              setAtkSizeC(newArr);
                            }}
                          >
                            <option value={0}>-</option>
                            <option value={-1}>以下</option>
                            <option value={1}>以上</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {(gen === "gen2" || gen === "gen3" || gen === "gen4") && (
                  <>
                    <h3>特性</h3>
                    <label>
                      <input
                        type="checkbox"
                        checked={abilities.gutsy}
                        onChange={(e) =>
                          setAbilities({
                            ...abilities,
                            gutsy: e.target.checked,
                          })
                        }
                      />
                      肝っ玉/心眼
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        checked={abilities.levitate}
                        onChange={(e) =>
                          setAbilities({
                            ...abilities,
                            levitate: e.target.checked,
                          })
                        }
                      />
                      相手の特性を考慮
                    </label>
                  </>
                )}
              </div>
              <div className="chart-wrapper">
                {chartForGen && (
                  <ConditionTypeChartTable
                    atkTypesC={atkTypesC}
                    atkMagniC={atkMagniC}
                    atkSizeC={atkSizeC}
                    chart={chartForGen}
                    gen={gen}
                    gutsy={abilities.gutsy}
                    levitate={abilities.levitate}
                  />
                )}

                <div className="mark">
                  <span className="x2">○</span>:×2　 :×0.25　
                  <span className="x0">×</span>:×0
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
