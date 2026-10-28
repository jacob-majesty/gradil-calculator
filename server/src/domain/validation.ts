import { COLORS, HEIGHTS, type Color, type FenceInput, type Height } from "./calculation.js";

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

function isHeight(value: unknown): value is Height {
  return typeof value === "number" && (HEIGHTS as readonly number[]).includes(value);
}

function isColor(value: unknown): value is Color {
  return typeof value === "string" && (COLORS as readonly string[]).includes(value);
}

export function parseFenceInput(raw: unknown): FenceInput {
  if (typeof raw !== "object" || raw === null) {
    throw new ValidationError("Dados do pedido inválidos.");
  }

  const data = raw as Record<string, unknown>;
  const length = data.length;

  if (typeof length !== "number" || !Number.isFinite(length) || length <= 0) {
    throw new ValidationError("O comprimento deve ser um número maior que zero.");
  }

  if (!isHeight(data.height)) {
    throw new ValidationError("Altura inválida. Escolha uma das alturas disponíveis.");
  }

  if (!isColor(data.color)) {
    throw new ValidationError("Cor inválida. Escolha uma das pinturas disponíveis.");
  }

  return {
    length,
    height: data.height,
    color: data.color,
  };
}

export function parseConfirmed(raw: unknown): boolean {
  const confirmed = (raw as Record<string, unknown>).confirmed;

  if (confirmed === undefined) {
    return false;
  }

  if (typeof confirmed !== "boolean") {
    throw new ValidationError("A confirmação do pedido deve ser verdadeira ou falsa.");
  }

  return confirmed;
}
