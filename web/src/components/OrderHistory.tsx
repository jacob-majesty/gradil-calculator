import { formatDateTime, formatMeters } from "../format";
import type { Order } from "../types";

interface OrderHistoryProps {
  orders: Order[];
  loading: boolean;
  error: string;
}

export function OrderHistory({ orders, loading, error }: OrderHistoryProps) {
  return (
    <section className="card" aria-labelledby="history-title">
      <header className="card__header">
        <div>
          <p className="eyebrow">Histórico</p>
          <h2 id="history-title">Pedidos confirmados</h2>
        </div>
        {orders.length > 0 && (
          <span className="pill">
            {orders.length} {orders.length === 1 ? "pedido" : "pedidos"}
          </span>
        )}
      </header>

      {error && (
        <p className="form__error" role="alert">
          {error}
        </p>
      )}

      {loading ? (
        <p className="empty">Carregando pedidos…</p>
      ) : error ? null : orders.length === 0 ? (
        <p className="empty">Nenhum pedido confirmado ainda.</p>
      ) : (
        <>
          <p className="history__hint">
            Ordenados do mais recente para o mais antigo.
          </p>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Confirmado em</th>
                  <th>Comprimento</th>
                  <th>Altura</th>
                  <th>Cor</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>{formatDateTime(order.confirmedAt)}</td>
                    <td>{formatMeters(order.length)} m</td>
                    <td>{formatMeters(order.height)} m</td>
                    <td>{order.color}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
