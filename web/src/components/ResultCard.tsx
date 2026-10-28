import { formatMeters } from "../format";
import type { FenceResult } from "../types";
import { FenceSketch } from "./FenceSketch";

interface ResultCardProps {
  result: FenceResult;
}

export function ResultCard({ result }: ResultCardProps) {
  const fastenersPerPanel = result.fasteners / result.panels;

  return (
    <section className="card result" aria-labelledby="result-title">
      <header className="card__header">
        <div>
          <p className="eyebrow">Orçamento</p>
          <h2 id="result-title">Resultado do cálculo</h2>
        </div>
        <span className="pill">{result.color}</span>
      </header>

      <div className="stats">
        <div className="stat">
          <span>Comprimento solicitado</span>
          <strong>{formatMeters(result.length)} m</strong>
        </div>
        <div className="stat">
          <span>Comprimento vendido</span>
          <strong>{formatMeters(result.soldLength)} m</strong>
        </div>
        <div className="stat">
          <span>Altura</span>
          <strong>{formatMeters(result.height)} m</strong>
        </div>
      </div>

      {result.difference > 0 && (
        <p className="notice">
          A cerca vendida tem {formatMeters(result.difference)} m a mais que os{" "}
          {formatMeters(result.length)} m solicitados.
        </p>
      )}

      <div className="result__grid">
        <div>
          <h3>Componentes</h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Componente</th>
                  <th>Detalhe</th>
                  <th className="numeric">Qtd.</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Tela</td>
                  <td>{formatMeters(result.panelLength)} m por unidade</td>
                  <td className="numeric">{result.panels}</td>
                </tr>
                <tr>
                  <td>Poste</td>
                  <td>Fixa até 2 telas</td>
                  <td className="numeric">{result.posts}</td>
                </tr>
                <tr>
                  <td>Fixador</td>
                  <td>{fastenersPerPanel} por tela</td>
                  <td className="numeric">{result.fasteners}</td>
                </tr>
                <tr>
                  <td>Parafuso</td>
                  <td>4 por poste</td>
                  <td className="numeric">{result.screws}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h3>Esboço</h3>
          <FenceSketch
            panels={result.panels}
            height={result.height}
            color={result.color}
          />
        </div>
      </div>
    </section>
  );
}
