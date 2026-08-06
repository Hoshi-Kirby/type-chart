// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import "./App.css";
import { useEffect, useState, useRef } from "react";
import { TypeChartTable } from "./TypeChart";
import { DualTypeChartTable } from "./DualTypeChart";
import { CoverTypeChartTable } from "./CoverTypeChart";
import { ResistTypeChartTable } from "./ResistTypeChart";
import { ConditionTypeChartTable } from "./ConditionTypeChart";
import type { TypeName } from "./value";

type Gen = "gen0" | "gen1" | "gen2" | "gen3" | "gen4";
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
  gen0: [
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
  const [atkTypeSets, setAtkTypeSets] = useState<TypeName[][]>([
    ["-", "-", "-", "-", "-", "-"], // タブ1
  ]);
  const [activeIndex, setActiveIndex] = useState(0);

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
  const [andOr, setAndOr] = useState<string>("aaa");
  const [text, setText] = useState<string>("1⋂2⋂3⋂4");
  const [cursor, setCursor] = useState<number>(0);
  const [currentInput, setCurrentInput] = useState<string>("1⋂2⋂3⋂4");
  const [editing, setEditing] = useState(true);
  const [showError, setShowError] = useState(false);
  const displayRef = useRef<HTMLDivElement>(null);

  const [atkTypesC, setAtkTypesC] = useState<TypeName[]>(["-", "-", "-", "-"]);
  const [atkMagniC, setAtkMagniC] = useState<number[]>([1, 1, 1, 1]);
  const [atkSizeC, setAtkSizeC] = useState<(-1 | 0 | 1)[]>([0, 0, 0, 0]);

  // 特性
  const [abilities, setAbilities] = useState({
    levitate: false,
    gutsy: false, // 肝っ玉
  });

  useEffect(() => {
    const box = displayRef.current;
    const cursorEl = document.getElementById("cursor");

    if (!box || !cursorEl) return;

    const cursorX = cursorEl.offsetLeft;
    const boxWidth = box.clientWidth;

    // カーソルが中央に来るようにスクロール
    box.scrollLeft = cursorX - boxWidth / 2;
  }, [currentInput, cursor]);
  useEffect(() => {
    fetch("/type.json")
      .then((res) => res.json())
      .then((data) => setAllCharts(data));
  }, []);
  // タブの削除
  function removeTab(index: number) {
    const newSets = atkTypeSets.filter((_, i) => i !== index);

    if (activeIndex === index) {
      if (index === newSets.length) {
        // 削除したのが最後のタブだった → 1つ左へ
        setActiveIndex(index - 1);
        setAtkTypes(atkTypeSets[index - 1]);
      } else {
        setAtkTypes(atkTypeSets[index + 1]);
      }
    } else if (activeIndex > index) {
      // 選択中タブが後ろにあった → 1つ前に詰まる
      setActiveIndex(activeIndex - 1);
    }
    //  タブ一覧を更新
    setAtkTypeSets(newSets);
  }
  // タブの追加
  function addTab() {
    if (atkTypeSets.length >= 4) {
      return; // これ以上追加しない
    }

    const last = atkTypeSets[atkTypeSets.length - 1];
    const newSets = [...atkTypeSets, [...last]];

    setAtkTypeSets(newSets);
    setActiveIndex(newSets.length - 1);
    setAtkTypes([...last]);
  }

  // タブの選択
  function selectTab(index: number) {
    setActiveIndex(index);
    setAtkTypes(atkTypeSets[index]);
  }

  //  キー
  const leftChar = currentInput[cursor - 1];

  function LogicDisplay({
    currentInput,
    cursor,
    showError,
  }: {
    currentInput: string;
    cursor: number;
    showError: boolean;
  }) {
    const rendered = [];
    const errorPositions = showError
      ? getErrorPositions(currentInput)
      : new Set<number>();

    rendered.push(<span key="g-start" className="gap"></span>);
    for (let i = 0; i < currentInput.length; i++) {
      const c = currentInput[i];
      const isError = errorPositions.has(i);

      let className = "";
      if (isError) className = "error-char";
      if (c >= "5" && c <= "8") className += " not-mode";

      const base = c >= "5" && c <= "8" ? String(Number(c) - 4) : c;

      rendered.push(
        <span key={`c-${i}`} className={className.trim()}>
          {base}
        </span>,
      );

      // gap を入れる（カーソルがここに来る可能性がある）
      rendered.push(<span key={`g-${i}`} className="gap"></span>);
    }

    // カーソルを表示位置に挿入
    const cursorPos = cursor * 2; // 文字とgapが交互なので2倍
    rendered[cursorPos] = (
      <span key={`cursor-${cursor}`} id="cursor" className="cursor"></span>
    );

    return <div className="logic-display">{rendered}</div>;
  }

  function Key({
    label,
    wide,
    className,
    onClick,
  }: {
    label: string;
    wide?: boolean;
    className?: string;
    onClick?: () => void;
  }) {
    return (
      <button
        className={`key ${wide ? "wide" : ""} ${className ?? ""}`}
        onClick={onClick}
      >
        {label}
      </button>
    );
  }
  // 入力
  function insertAtCursor(key: string) {
    setCurrentInput((prev) => {
      const left = prev.slice(0, cursor);
      const right = prev.slice(cursor);
      return left + key + right;
    });
    setCursor((c) => c + key.length);
  }
  // 削除
  function backspace() {
    if (cursor === 0) return; // ← 左に何もないので削除不可

    setCurrentInput((prev) => {
      const left = prev.slice(0, cursor - 1); // ← 1文字左を削除
      const right = prev.slice(cursor);
      return left + right;
    });

    setCursor((c) => c - 1); // ← カーソルを左へ
  }
  function replaceLeft(newChar: string) {
    const pos = cursor - 1;

    setCurrentInput(
      currentInput.slice(0, pos) + newChar + currentInput.slice(pos + 1),
    );

    // カーソル位置はそのまま（1文字置換なのでズレない）
    setCursor(pos + 1);
  }
  // 数字

  function handleDigitClick(digit: string) {
    const left = currentInput[cursor - 1];
    const isNot = ["5", "6", "7", "8"].includes(left);

    // NOT を外す
    if (isNot) {
      if (Number(left) === Number(digit) + 4) {
        const original = String(Number(left) - 4); // 5→1, 6→2...
        replaceLeft(original);
        return;
      }
    }
    // NOT を付ける
    if (left === digit) {
      const notVersion = String(Number(digit) + 4); // 1→5, 2→6...
      replaceLeft(notVersion);
      return;
    }
    // 通常挿入
    insertAtCursor(digit);
  }

  // チェック
  function isValidExpression(input: string): boolean {
    if (input.trim() === "") return false;
    // 許可される文字のみ
    if (!/^[1-8⋂⋃()]*$/.test(input)) return false;

    // トークン化（1文字ずつ）
    const tokens = [...input];

    // 括弧の深さ
    let depth = 0;

    // 前のトークンの種類
    type Prev = "start" | "operand" | "operator" | "lparen" | "rparen";
    let prev: Prev = "start";

    const isOperand = (t: string) => /^[1-8]$/.test(t);
    const isOperator = (t: string) => t === "⋂" || t === "⋃";

    for (const t of tokens) {
      if (isOperand(t)) {
        // オペランドの前に来てよいのは start, operator, lparen
        if (!(prev === "start" || prev === "operator" || prev === "lparen")) {
          return false;
        }
        prev = "operand";
      } else if (isOperator(t)) {
        // 演算子の前に来てよいのは operand, rparen
        if (!(prev === "operand" || prev === "rparen")) {
          return false;
        }
        prev = "operator";
      } else if (t === "(") {
        // ( の前に来てよいのは start, operator, lparen
        if (!(prev === "start" || prev === "operator" || prev === "lparen")) {
          return false;
        }
        depth++;
        prev = "lparen";
      } else if (t === ")") {
        // ) の前に来てよいのは operand, rparen
        if (!(prev === "operand" || prev === "rparen")) {
          return false;
        }
        depth--;
        if (depth < 0) return false;
        prev = "rparen";
      }
    }

    // 括弧が閉じているか
    if (depth !== 0) return false;

    // 最後が operator で終わっていないか
    if (prev === "operator" || prev === "lparen") return false;

    return true;
  }
  // チェックナンバー
  function getErrorPositions(input: string): Set<number> {
    const error = new Set<number>();
    const chars = [...input];

    type Prev = "start" | "operand" | "operator" | "lparen" | "rparen";
    let prev: Prev = "start";

    const isOperand = (t: string) => /^[1-8]$/.test(t);
    const isOperator = (t: string) => t === "⋂" || t === "⋃";

    const stack: number[] = [];

    chars.forEach((ch, i) => {
      if (isOperand(ch)) {
        if (!(prev === "start" || prev === "operator" || prev === "lparen")) {
          error.add(i);
        }
        prev = "operand";
      } else if (isOperator(ch)) {
        if (!(prev === "operand" || prev === "rparen")) {
          error.add(i);
        }
        prev = "operator";
      } else if (ch === "(") {
        if (!(prev === "start" || prev === "operator" || prev === "lparen")) {
          error.add(i);
        }
        stack.push(i);
        prev = "lparen";
      } else if (ch === ")") {
        if (!(prev === "operand" || prev === "rparen")) {
          error.add(i);
        }
        if (stack.length === 0) {
          error.add(i);
        } else {
          stack.pop();
        }
        prev = "rparen";
      }
    });

    // 対応しなかった "(" を赤く
    stack.forEach((pos) => error.add(pos));

    // 演算子で終わっていたら最後の文字を赤く
    if (["operator", "rparen"].includes(prev)) {
      error.add(chars.length - 1);
    }

    return error;
  }

  return (
    <>
      <div className="back"></div>
      <div className="app-wrapper">
        <div className="container">
          <h1 className="title">タイプ相性表</h1>
          <button className="help-button" onClick={() => setHelp(!help)}>
            {help ? "使い方∧" : "使い方∨"}
          </button>
          <>
            <div className={`help-panel ${help ? "open" : ""}`}>
              <div className="header">
                <button
                  className="help-button"
                  onClick={() => setHelpPage(helpPage > 1 ? helpPage - 1 : 1)}
                >
                  ＜
                </button>
                <p>{helpPage}/7</p>
                <button
                  className="help-button"
                  onClick={() => setHelpPage(helpPage < 7 ? helpPage + 1 : 7)}
                >
                  ＞
                </button>
              </div>
              {helpPage === 1 ? (
                <>
                  <h4>このサイトについて</h4>
                  <div>
                    このサイトは全世代、複合タイプ対応のポケモンタイプ相性表です。
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
                    テラバーストやウェザーボールなどの一つの技で二タイプ使える技は、「例外」の欄を利用してください。
                  </div>
                  <div className="hr">
                    相手の特性を考慮する場合、相手の特性によって最善の相性が変化する可能性がある複合タイプを赤色で示します。
                  </div>
                  <div className="hr">
                    また、その特性はタップまたはホバーすることで見ることができます。
                  </div>
                </>
              ) : helpPage === 5 ? (
                <>
                  <h4>モード：複合耐性</h4>
                  <div className="hr">
                    選択した複合タイプに対する全タイプの相性を見ることができます。
                  </div>
                  <div className="hr">六匹同時に見ることができます。</div>
                </>
              ) : helpPage === 6 ? (
                <>
                  <h4>モード：相性条件</h4>
                  <div className="hr">
                    四つの技のタイプと相性の条件を入力すると、その条件をすべて満たす複合タイプを調べることができます。
                  </div>
                  <div className="hr">
                    条件式は変更することが出来て、自分で入力することもできます。また、notは数字キーをダブルクリックすることで使用できます。
                  </div>
                  <div className="hr">
                    相手の特性を考慮する場合、相手の特性によって条件を満たすことのできる複合タイプを赤色で示します。
                  </div>
                  <div className="hr">
                    また、その特性はタップまたはマウスオーバーすることで見ることができます。
                  </div>
                </>
              ) : (
                <>
                  <h4>相手の特性を考慮　について</h4>

                  <div className="hr">
                    考慮する特性は、ふゆう、どしょく、ちくでん、ひらいしん、でんきエンジン、うなぎのぼり、ちょすい、よびみず、もらいび、こんがりボディ、そうしょく、あついしぼう、かんそうはだ、たいねつ、きよめのしお、すいほうです。
                  </div>
                  <div className="hr">
                    また、それぞれの世代においてある特性を持ったポケモンが存在しないタイプではその特性は考慮しません。
                  </div>
                  <div className="hr">
                    かんそうはだへの炎技は1.25倍で計算していますが、かんそうはだへの炎技がかんそうはだではない同じタイプへの水技よりも低い倍率になるポケモンがZA以前に存在しないため、相性表の記号に影響はありません。
                  </div>
                </>
              )}
              <hr className="hr"></hr>
            </div>
          </>

          <div className="layout-row">
            <p>世代</p>
            <select value={gen} onChange={(e) => setGen(e.target.value as Gen)}>
              <option value="gen0">チャンピオンズM-B</option>
              <option value="gen1">赤緑</option>
              <option value="gen2">金銀～BW</option>
              <option value="gen3">XY～ZA</option>
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
                  <div className="title-row">
                    <h3>攻撃タイプ</h3>
                    <div className="tabs">
                      {atkTypeSets.map((_, i) => (
                        <div
                          key={i}
                          className={i === activeIndex ? "tab active" : "tab"}
                          onClick={() => selectTab(i)}
                        >
                          技セット {i + 1}
                          {/* × ボタン（タブが2個以上のときだけ表示） */}
                          {atkTypeSets.length >= 2 && (
                            <span
                              className="close"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeTab(i);
                              }}
                            >
                              ×
                            </span>
                          )}
                        </div>
                      ))}

                      {/* ＋ ボタン（タブが3個以下のときだけ表示） */}
                      {atkTypeSets.length <= 3 && (
                        <div className="add-tab" onClick={addTab}>
                          ＋
                        </div>
                      )}
                    </div>
                  </div>

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

                            const newSets = [...atkTypeSets];
                            newSets[activeIndex] = newArr;
                            setAtkTypeSets(newSets);
                          }}
                        >
                          <option value="-">-</option> {}
                          {atkTypesByGen[gen].map((type) => (
                            <option key={type} value={type}>
                              {typeLabels[type]}
                            </option>
                          ))}
                          {(gen === "gen0" ||
                            gen === "gen3" ||
                            gen === "gen4") && (
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
                {(gen === "gen0" ||
                  "gen2" ||
                  gen === "gen3" ||
                  gen === "gen4") && (
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
                  <span className="x025">⟁</span>:×0.25　
                  <span className="x0125">▲</span>:×0.125　
                  <span className="x0">×</span>:×0
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
                  <span>論理式</span>
                  <select
                    value={andOr}
                    onChange={(e) => {
                      const v = e.target.value;
                      const label = e.target.selectedOptions[0].text; // ← 表示文字列

                      setAndOr(v);

                      if (v !== "custom") {
                        setText(label);
                        setCurrentInput(label);
                      } else {
                      }
                    }}
                    className="and-or"
                  >
                    <option value="aaa">1⋂2⋂3⋂4</option>
                    <option value="ooo">1⋃2⋃3⋃4</option>
                    <option value="o-aa">(1⋃2)⋂3⋂4</option>
                    <option value="a-oo">(1⋂2)⋃3⋃4</option>
                    <option value="oo-a">(1⋃2⋃3)⋂4</option>
                    <option value="aa-o">(1⋂2⋂3)⋃4</option>
                    <option value="o-ao">(1⋃2)⋂(3⋃4)</option>
                    <option value="a-oa">(1⋂2)⋃(3⋂4)</option>
                    <option value="a-o-a">((1⋂2)⋃3)⋂4</option>
                    <option value="o-a-o">((1⋃2)⋂3)⋃4</option>
                    <option value="custom">入力する...</option>
                  </select>
                  {andOr === "custom" ? (
                    <>
                      {!editing && (
                        <button
                          className="compact-display"
                          onClick={() => setEditing(true)}
                        >
                          <LogicDisplay
                            currentInput={currentInput}
                            cursor={-1}
                            showError={showError}
                          />
                        </button>
                      )}
                      {editing && (
                        <div className="logic-editor">
                          {/* 入力欄（カーソル付き） */}
                          <div className="display-box" ref={displayRef}>
                            <LogicDisplay
                              currentInput={currentInput}
                              cursor={cursor}
                              showError={showError}
                            />
                          </div>

                          {/* キーボード */}
                          <div className="keyboard">
                            <div className="row">
                              <Key
                                label="("
                                onClick={() => {
                                  insertAtCursor("(");
                                  setShowError(false);
                                }}
                              />
                              <Key
                                label=")"
                                onClick={() => {
                                  insertAtCursor(")");
                                  setShowError(false);
                                }}
                              />
                              <Key
                                label="⋂"
                                onClick={() => {
                                  insertAtCursor("⋂");
                                  setShowError(false);
                                }}
                              />
                              <Key
                                label="⋃"
                                onClick={() => {
                                  insertAtCursor("⋃");
                                  setShowError(false);
                                }}
                              />
                              <Key
                                label="1"
                                className={leftChar === "1" ? "not-mode" : ""}
                                onClick={() => {
                                  handleDigitClick("1");
                                  setShowError(false);
                                }}
                              />
                              <Key
                                label="2"
                                className={leftChar === "2" ? "not-mode" : ""}
                                onClick={() => {
                                  handleDigitClick("2");
                                  setShowError(false);
                                }}
                              />
                              <Key
                                label="3"
                                className={leftChar === "3" ? "not-mode" : ""}
                                onClick={() => {
                                  handleDigitClick("3");
                                  setShowError(false);
                                }}
                              />
                              <Key
                                label="4"
                                className={leftChar === "4" ? "not-mode" : ""}
                                onClick={() => {
                                  handleDigitClick("4");
                                  setShowError(false);
                                }}
                              />
                            </div>

                            <div className="row">
                              <Key
                                label="←"
                                onClick={() =>
                                  setCursor(Math.max(0, cursor - 1))
                                }
                              />
                              <Key
                                label="→"
                                onClick={() =>
                                  setCursor(
                                    Math.min(currentInput.length, cursor + 1),
                                  )
                                }
                              />
                              <Key
                                label="⌫"
                                onClick={() => {
                                  backspace();
                                  setShowError(false);
                                }}
                              />
                              <Key
                                label="クリア"
                                wide
                                onClick={() => {
                                  setCurrentInput("");
                                  setCursor(0);
                                  setShowError(false);
                                }}
                              />
                              <Key
                                label="決定"
                                wide
                                className="decision"
                                onClick={() => {
                                  if (isValidExpression(currentInput)) {
                                    setText(currentInput);
                                    setEditing(false);
                                  } else {
                                    setShowError(true);
                                  }
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <></>
                  )}

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
                          {(gen === "gen0" ||
                            gen === "gen3" ||
                            gen === "gen4") && (
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
                {(gen === "gen0" ||
                  gen === "gen2" ||
                  gen === "gen3" ||
                  gen === "gen4") && (
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
                    text={text}
                  />
                )}

                <div className="mark">
                  <span className="x2">●</span>:ok
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
