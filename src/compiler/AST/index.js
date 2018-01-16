// @flow

const {
  parse32F,
  parse64F,
  parse32I,
  parse64I,
  isNanLiteral,
  isInfLiteral
} = require("../parsing/watf/number-literals");

function assert(cond: boolean) {
  if (!cond) {
    throw new Error("assertion error");
  }
}

export function identifier(value: string): Identifier {
  return {
    type: "Identifier",
    value
  };
}

export function valtype(name: Valtype): ValtypeLiteral {
  return {
    type: "ValtypeLiteral",
    name
  };
}

export function stringLiteral(value: string): StringLiteral {
  return {
    type: "StringLiteral",
    value
  };
}

export function program(body: Array<Node>): Program {
  return {
    type: "Program",
    body
  };
}

export function module(id: ?string, fields: ModuleFields): Module {
  if (id != null) {
    assert(typeof id === "string");
  }

  assert(typeof fields === "object" && typeof fields.length !== "undefined");

  return {
    type: "Module",
    id,
    fields
  };
}

export function binaryModule(id: ?string, blob: Array<string>): BinaryModule {
  return {
    type: "BinaryModule",
    blob,
    id,
    fields: []
  };
}

export function quoteModule(id: ?string, string: Array<string>): QuoteModule {
  return {
    type: "QuoteModule",
    string,
    id,
    fields: []
  };
}

export function moduleExport(
  name: string,
  type: ExportDescr,
  id: string
): ModuleExport {
  return {
    type: "ModuleExport",
    name,
    descr: {
      type,
      id
    }
  };
}

export function func(
  id: ?Index,
  params: Array<FuncParam>,
  result: ?Valtype,
  body: Array<Instruction>
): Func {
  assert(typeof params === "object" && typeof params.length !== "undefined");
  assert(typeof body === "object" && typeof body.length !== "undefined");
  assert(typeof id !== "string");

  return {
    type: "Func",
    id,
    params,
    result,
    body
  };
}

export function objectInstruction(
  id: string,
  object: Valtype,
  args: Array<Expression> = [],
  namedArgs: Object = {}
): ObjectInstruction {
  assert(typeof args === "object" && typeof args.length !== "undefined");
  assert(typeof object === "string");

  const n: ObjectInstruction = {
    type: "Instr",
    id,
    object,
    args
  };

  if (Object.keys(namedArgs).length !== 0) {
    n.namedArgs = namedArgs;
  }

  return n;
}

export function instruction(
  id: string,
  args: Array<any> = [],
  namedArgs: Object = {}
): Instruction {
  assert(typeof args === "object" && typeof args.length !== "undefined");
  assert(id !== "block");
  assert(id !== "if");
  assert(id !== "loop");

  const n: Instruction = {
    type: "Instr",
    id,
    args
  };

  if (Object.keys(namedArgs).length !== 0) {
    n.namedArgs = namedArgs;
  }

  return n;
}

export function loopInstruction(
  label: ?Identifier,
  resulttype: ?Valtype,
  instr: Array<Instruction>
): LoopInstruction {
  assert(typeof instr === "object" && typeof instr.length !== "undefined");

  return {
    type: "LoopInstruction",
    id: "loop",
    label,
    resulttype,
    instr
  };
}

export function blockInstruction(
  label: Identifier,
  instr: Array<Instruction>,
  result: ?Valtype
): BlockInstruction {
  assert(typeof label !== "undefined");
  assert(typeof label.type === "string");
  assert(typeof instr === "object" && typeof instr.length !== "undefined");

  return {
    type: "BlockInstruction",
    id: "block",
    label,
    instr,
    result
  };
}

export function numberLiteral(
  rawValue: number | string,
  instructionType: Valtype = "i32"
): NumberLiteral | LongNumberLiteral | FloatLiteral {
  let value;
  let nan = false;
  let inf = false;
  let type = "NumberLiteral";

  if (typeof rawValue === "number") {
    value = rawValue;
  } else {
    switch (instructionType) {
      case "i32": {
        value = parse32I(rawValue);
        break;
      }
      case "i64": {
        type = "LongNumberLiteral";
        value = parse64I(rawValue);
        break;
      }
      case "f32": {
        type = "FloatLiteral";
        value = parse32F(rawValue);
        nan = isNanLiteral(rawValue);
        inf = isInfLiteral(rawValue);
        break;
      }
      // f64
      default: {
        type = "FloatLiteral";
        value = parse64F(rawValue);
        nan = isNanLiteral(rawValue);
        inf = isInfLiteral(rawValue);
        break;
      }
    }
  }

  // This is a hack to avoid rewriting all tests to have a "isnan: false" field
  const x = {
    type,
    value
  };

  if (nan) {
    x.nan = true;
  }

  if (inf) {
    x.inf = true;
  }

  return x;
}

export function callInstruction(index: Index): CallInstruction {
  assert(typeof index.type === "string");

  return {
    type: "CallInstruction",
    id: "call",
    index
  };
}

export function ifInstruction(
  testLabel: Identifier,
  result: ?Valtype,
  consequent: Array<Instruction>,
  alternate: Array<Instruction>
): IfInstruction {
  assert(typeof testLabel.type === "string");

  return {
    type: "IfInstruction",
    id: "if",
    testLabel,
    result,
    consequent,
    alternate
  };
}

export function withLoc(n: Node, end: Position, start: Position): Node {
  const loc = {
    start,
    end
  };

  n.loc = loc;

  return n;
}

/**
 * Import
 */

export function moduleImport(
  module: string,
  name: string,
  descr: ImportDescr
): ModuleImport {
  return {
    type: "ModuleImport",
    module,
    name,
    descr
  };
}

export function globalImportDescr(
  valtype: Valtype,
  mutability: Mutability
): GlobalType {
  return {
    type: "GlobalType",
    elementType: "anyfunc",

    valtype,
    mutability
  };
}

export function funcParam(valtype: Valtype, id: ?string): FuncParam {
  return {
    valtype,
    id
  };
}

export function funcImportDescr(
  value: Index,
  params: Array<FuncParam> = [],
  results: Array<Valtype> = []
): FuncImportDescr {
  assert(typeof params === "object" && typeof params.length !== "undefined");
  assert(typeof results === "object" && typeof results.length !== "undefined");

  return {
    type: "FuncImportDescr",
    value,
    params,
    results
  };
}

export function table(elementType: TableElementType, limits: Limit): Table {
  return {
    type: "Table",
    elementType,
    limits
  };
}

export function limits(min: number, max?: number): Limit {
  return {
    type: "Limit",
    min,
    max
  };
}

export function memory(limits: Limit, id: ?Index): Memory {
  return {
    type: "Memory",
    limits,
    id
  };
}

export function data(
  memoryIndex: Index,
  offset: Array<Instruction>,
  init: ByteArray
): Data {
  return {
    type: "Data",
    memoryIndex,
    offset,
    init
  };
}

export function global(
  globalType: GlobalType,
  init: Array<Instruction>
): Global {
  return {
    type: "Global",
    globalType,
    init
  };
}

export function globalType(
  valtype: Valtype,
  mutability: Mutability
): GlobalType {
  return {
    type: "GlobalType",
    valtype,
    mutability
  };
}

export function byteArray(values: Array<Byte>): ByteArray {
  return {
    type: "Bytes",
    values
  };
}

export function leadingComment(value: string): LeadingComment {
  return {
    type: "LeadingComment",
    value
  };
}

export function blockComment(value: string): BlockComment {
  return {
    type: "BlockComment",
    value
  };
}

export function unaryExpression(
  operator: UnaryExpressionOperators,
  argument: Expression
): UnaryExpression {
  return {
    type: "UnaryExpression",
    operator,
    argument
  };
}

export function indexLiteral(value: number | string): Index {
  return numberLiteral(value, "i32");
}
