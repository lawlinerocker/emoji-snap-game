"use client";

import { EXPRESSION_ORDER } from "@/lib/enum";
import { Expressions } from "@/lib/types/expression.types";

const ORDER = EXPRESSION_ORDER;
export default function ExpressionBars({
  expressions,
  highlight = [],
  title,
}: {
  expressions: Expressions | null | undefined;
  highlight?: string[];
  title?: string;
}) {
  return (
    <div className="border rounded p-3 text-xs h-40 overflow-hidden flex flex-col">
      <div className="font-semibold mb-2">{title ?? "Expressions"}</div>
      {!expressions ? (
        <div className="opacity-60">No face detected</div>
      ) : (
        <div className="space-y-1 overflow-auto pr-1">
          {ORDER.map((k) => {
            const v = expressions[k] ?? 0;
            const pct = Math.round(v * 100);
            const isHi = highlight.includes(k);
            return (
              <div key={k} className="flex items-center gap-2">
                <div
                  className={`w-20 shrink-0 ${
                    isHi ? "font-semibold" : "opacity-80"
                  }`}
                >
                  {k}
                </div>
                <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
                  <div
                    className={`h-full ${
                      isHi ? "bg-indigo-500" : "bg-gray-400"
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div
                  className={`w-10 text-right tabular-nums ${
                    isHi ? "font-semibold" : "opacity-80"
                  }`}
                >
                  {pct}%
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
