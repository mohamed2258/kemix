/**
 * KEMIX Safe Code Execution Engine
 * Runs user code in an isolated, sandboxed environment with output capturing,
 * timeout protection (stops infinite loops), and helpful beginner-friendly error messages.
 */

export interface ExecutionResult {
  success: boolean;
  output: string;
  error?: string;
  executionTimeMs: number;
}

export function executePythonCode(code: string, timeoutMs: number = 2000): Promise<ExecutionResult> {
  return new Promise((resolve) => {
    const startTime = performance.now();
    const outputLines: string[] = [];

    try {
      // 1. Basic safety checks
      if (!code || code.trim().length === 0) {
        return resolve({
          success: true,
          output: '(لا توجد مخرجات - الكود فارغ)',
          executionTimeMs: 0
        });
      }

      // 2. Line by line parsing for beginner Python statements (print, variables, arithmetic, conditions)
      // We simulate execution safely without evaluating arbitrary Node/OS commands
      const lines = code.split('\n');
      const variables: Record<string, unknown> = {};

      let inLoop = false;
      let loopCounter = 0;
      const MAX_LOOP_ITERATIONS = 500;

      for (let i = 0; i < lines.length; i++) {
        // Timeout check
        if (performance.now() - startTime > timeoutMs) {
          return resolve({
            success: false,
            output: outputLines.join('\n'),
            error: 'تجاوز الكود الحد الأقصى المسموح به للوقت (Time Limit Exceeded). يرجى التأكد من عدم وجود حلقة تكرار لانهائية.',
            executionTimeMs: Math.round(performance.now() - startTime)
          });
        }

        const rawLine = lines[i];
        const trimmed = rawLine.trim();

        // Skip empty lines and comments
        if (!trimmed || trimmed.startsWith('#')) {
          continue;
        }

        // Handle print(...)
        const printMatch = trimmed.match(/^print\s*\((.*)\)$/);
        if (printMatch) {
          const contentInside = printMatch[1];
          const evaluated = evaluatePrintArgs(contentInside, variables);
          outputLines.push(evaluated);
          continue;
        }

        // Handle variable assignment: var_name = expression
        const assignMatch = trimmed.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(.+)$/);
        if (assignMatch) {
          const varName = assignMatch[1];
          const expression = assignMatch[2];
          try {
            const val = evaluateExpression(expression, variables);
            variables[varName] = val;
          } catch (err: unknown) {
            const errorMsg = err instanceof Error ? err.message : String(err);
            return resolve({
              success: false,
              output: outputLines.join('\n'),
              error: `خطأ في السطر ${i + 1}: تعذر حساب القيمة للمتغير '${varName}' (${errorMsg})`,
              executionTimeMs: Math.round(performance.now() - startTime)
            });
          }
          continue;
        }

        // Handle simple if statement: if condition: print(...)
        if (trimmed.startsWith('if ') && trimmed.includes(':')) {
          const colonIdx = trimmed.indexOf(':');
          const conditionStr = trimmed.slice(3, colonIdx).trim();
          const restOfLine = trimmed.slice(colonIdx + 1).trim();

          const condValue = evaluateCondition(conditionStr, variables);
          if (condValue && restOfLine) {
            const inlinePrint = restOfLine.match(/^print\s*\((.*)\)$/);
            if (inlinePrint) {
              outputLines.push(evaluatePrintArgs(inlinePrint[1], variables));
            }
          }
          continue;
        }

        // If unknown command
        if (!trimmed.startsWith('else:') && !trimmed.startsWith('elif ')) {
          return resolve({
            success: false,
            output: outputLines.join('\n'),
            error: `SyntaxError في السطر ${i + 1}: الأمر '${trimmed}' غير مفهوم. تأكد من صحة الكود واستخدام دالة print() أو تعريف المتغيرات.`,
            executionTimeMs: Math.round(performance.now() - startTime)
          });
        }
      }

      resolve({
        success: true,
        output: outputLines.length > 0 ? outputLines.join('\n') : '(اكتمل تنفيذ الكود بنجاح دون طباعة مخرجات)',
        executionTimeMs: Math.round(performance.now() - startTime)
      });
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      resolve({
        success: false,
        output: outputLines.join('\n'),
        error: `خطأ أثناء التشغيل: ${errorMsg}`,
        executionTimeMs: Math.round(performance.now() - startTime)
      });
    }
  });
}

function evaluatePrintArgs(argsStr: string, variables: Record<string, unknown>): string {
  // Split arguments by comma outside of quotes
  const parts: string[] = [];
  let current = '';
  let inDoubleQuote = false;
  let inSingleQuote = false;

  for (let i = 0; i < argsStr.length; i++) {
    const ch = argsStr[i];
    if (ch === '"' && !inSingleQuote) inDoubleQuote = !inDoubleQuote;
    else if (ch === "'" && !inDoubleQuote) inSingleQuote = !inSingleQuote;
    else if (ch === ',' && !inDoubleQuote && !inSingleQuote) {
      parts.push(current.trim());
      current = '';
      continue;
    }
    current += ch;
  }
  if (current.trim()) parts.push(current.trim());

  return parts.map(part => {
    return String(evaluateExpression(part, variables));
  }).join(' ');
}

function evaluateExpression(expr: string, variables: Record<string, unknown>): unknown {
  const trimmed = expr.trim();

  // String literals "text" or 'text'
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1).replace(/\\n/g, '\n').replace(/\\t/g, '\t');
  }

  // Boolean
  if (trimmed === 'True') return true;
  if (trimmed === 'False') return false;

  // Numeric literal
  if (!isNaN(Number(trimmed))) {
    return Number(trimmed);
  }

  // Known variable
  if (Object.prototype.hasOwnProperty.call(variables, trimmed)) {
    return variables[trimmed];
  }

  // Arithmetic or string concatenation with +
  if (trimmed.includes('+')) {
    const parts = trimmed.split('+').map(p => evaluateExpression(p.trim(), variables));
    if (parts.length > 0) {
      // If any is string, concat
      if (parts.some(p => typeof p === 'string')) {
        return parts.join('');
      }
      return parts.reduce((acc: number, val) => acc + Number(val), 0);
    }
  }

  // Multiplication *
  if (trimmed.includes('*')) {
    const parts = trimmed.split('*').map(p => evaluateExpression(p.trim(), variables));
    return parts.reduce((acc: number, val) => acc * Number(val), 1);
  }

  // Subtraction -
  if (trimmed.includes('-')) {
    const parts = trimmed.split('-').map(p => evaluateExpression(p.trim(), variables));
    return Number(parts[0]) - Number(parts[1]);
  }

  throw new Error(`المتغير أو الرمز '${trimmed}' غير معرّف (NameError)`);
}

function evaluateCondition(condStr: string, variables: Record<string, unknown>): boolean {
  if (condStr.includes('==')) {
    const [left, right] = condStr.split('==').map(s => evaluateExpression(s.trim(), variables));
    return left === right;
  }
  if (condStr.includes('!=')) {
    const [left, right] = condStr.split('!=').map(s => evaluateExpression(s.trim(), variables));
    return left !== right;
  }
  if (condStr.includes('>=')) {
    const [left, right] = condStr.split('>=').map(s => Number(evaluateExpression(s.trim(), variables)));
    return left >= right;
  }
  if (condStr.includes('<=')) {
    const [left, right] = condStr.split('<=').map(s => Number(evaluateExpression(s.trim(), variables)));
    return left <= right;
  }
  if (condStr.includes('>')) {
    const [left, right] = condStr.split('>').map(s => Number(evaluateExpression(s.trim(), variables)));
    return left > right;
  }
  if (condStr.includes('<')) {
    const [left, right] = condStr.split('<').map(s => Number(evaluateExpression(s.trim(), variables)));
    return left < right;
  }
  return Boolean(evaluateExpression(condStr, variables));
}
