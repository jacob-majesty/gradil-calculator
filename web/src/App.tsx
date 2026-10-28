import { useEffect, useState } from "react";
import { getOptions, getOrders } from "./api";
import { Calculator } from "./components/Calculator";
import { OrderHistory } from "./components/OrderHistory";
import type { Options, Order } from "./types";

type Tab = "calculator" | "history";

export default function App() {
  const [tab, setTab] = useState<Tab>("calculator");
  const [options, setOptions] = useState<Options | null>(null);
  const [optionsError, setOptionsError] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState("");

  async function refreshOrders() {
    setOrdersLoading(true);
    setOrdersError("");

    try {
      setOrders(await getOrders());
    } catch (error) {
      setOrdersError(
        error instanceof Error ? error.message : "Não foi possível carregar os pedidos.",
      );
    } finally {
      setOrdersLoading(false);
    }
  }

  useEffect(() => {
    getOptions()
      .then(setOptions)
      .catch((error: unknown) => {
        setOptionsError(
          error instanceof Error ? error.message : "Não foi possível carregar as opções.",
        );
      });
  }, []);

  useEffect(() => {
    void refreshOrders();
  }, [tab]);

  return (
    <div className="app">
      <header className="masthead">
        <div className="brand">
          <span className="brand__mark" aria-hidden="true">
            G
          </span>
          <div>
            <h1>Gradil</h1>
            <p>Calculadora de cercas</p>
          </div>
        </div>

        <nav className="tabs" aria-label="Seções do aplicativo">
          <button
            type="button"
            className={tab === "calculator" ? "tab tab--active" : "tab"}
            onClick={() => setTab("calculator")}
            aria-current={tab === "calculator" ? "page" : undefined}
          >
            Calcular
          </button>
          <button
            type="button"
            className={tab === "history" ? "tab tab--active" : "tab"}
            onClick={() => setTab("history")}
            aria-current={tab === "history" ? "page" : undefined}
          >
            Histórico
          </button>
        </nav>
      </header>

      <main>
        {tab === "calculator" ? (
          options ? (
            <Calculator
              options={options}
              onConfirmed={() => {
                void refreshOrders();
              }}
            />
          ) : (
            <p className={optionsError ? "form__error" : "empty"}>
              {optionsError || "Carregando opções…"}
            </p>
          )
        ) : (
          <OrderHistory
            orders={orders}
            loading={ordersLoading}
            error={ordersError}
          />
        )}
      </main>

      <footer className="footer">
        Telas de 2,5 m, postes com até 2 telas, 4 parafusos por poste.
      </footer>
    </div>
  );
}
