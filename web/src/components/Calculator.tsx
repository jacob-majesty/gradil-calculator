import { useState, type FormEvent } from "react";
import { calculateOrder } from "../api";
import { formatDateTime, formatMeters } from "../format";
import type { Color, FenceResult, Height, Options, Order } from "../types";
import { ResultCard } from "./ResultCard";

interface CalculatorProps {
  options: Options;
  onConfirmed: () => void;
}

function parseLength(value: string): number {
  return Number(value.trim().replace(",", "."));
}

export function Calculator({ options, onConfirmed }: CalculatorProps) {
  const [length, setLength] = useState("");
  const [height, setHeight] = useState<Height>(options.heights[0].height);
  const [color, setColor] = useState<Color>(options.colors[0]);
  const [confirmed, setConfirmed] = useState(false);
  const [result, setResult] = useState<FenceResult | null>(null);
  const [savedOrder, setSavedOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) {
      return;
    }

    setError("");
    setSavedOrder(null);

    const parsedLength = parseLength(length);

    if (!Number.isFinite(parsedLength) || parsedLength <= 0) {
      setError("Informe um comprimento válido, maior que zero.");
      return;
    }

    setLoading(true);

    try {
      const response = await calculateOrder({
        length: parsedLength,
        height,
        color,
        confirmed,
      });

      setResult(response.result);

      if (response.order) {
        setSavedOrder(response.order);
        setConfirmed(false);
        onConfirmed();
      }
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Não foi possível calcular a cerca.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <section className="card" aria-labelledby="form-title">
        <header className="card__header">
          <div>
            <p className="eyebrow">Novo pedido</p>
            <h2 id="form-title">Configure a sua cerca</h2>
          </div>
        </header>

        <form className="form" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="length">Comprimento total (m)</label>
            <input
              id="length"
              name="length"
              inputMode="decimal"
              placeholder="Ex.: 12,5"
              value={length}
              onChange={(event) => setLength(event.target.value)}
              autoComplete="off"
              required
            />
            <small>Informe o comprimento linear que deseja cercar.</small>
          </div>

          <div className="field">
            <label htmlFor="height">Altura</label>
            <select
              id="height"
              name="height"
              value={height}
              onChange={(event) => setHeight(Number(event.target.value) as Height)}
            >
              {options.heights.map((option) => (
                <option key={option.height} value={option.height}>
                  {formatMeters(option.height)} m — {option.fasteners} fixadores por tela
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="color">Cor</label>
            <select
              id="color"
              name="color"
              value={color}
              onChange={(event) => setColor(event.target.value as Color)}
            >
              {options.colors.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <label className="checkbox">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(event) => setConfirmed(event.target.checked)}
            />
            <span>Confirmar pedido e salvar no histórico</span>
          </label>

          {error && (
            <p className="form__error" role="alert">
              {error}
            </p>
          )}

          {savedOrder && (
            <p className="form__success" role="status">
              Pedido confirmado e salvo em {formatDateTime(savedOrder.confirmedAt)}.
            </p>
          )}

          <button className="button" type="submit" disabled={loading}>
            {loading ? "Calculando…" : "Calcular cerca"}
          </button>
        </form>
      </section>

      {result && <ResultCard result={result} />}
    </>
  );
}
