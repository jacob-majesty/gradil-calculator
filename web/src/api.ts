import type { CalculateResponse, Color, Height, Options, Order } from "./types";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });

  const payload = (await response.json().catch(() => null)) as
    | { error?: string }
    | null;

  if (!response.ok) {
    throw new Error(payload?.error ?? "Não foi possível concluir a operação.");
  }

  return payload as unknown as T;
}

export function getOptions(): Promise<Options> {
  return request<Options>("/api/options");
}

export function getOrders(): Promise<Order[]> {
  return request<{ orders: Order[] }>("/api/orders").then((data) => data.orders);
}

export function calculateOrder(input: {
  length: number;
  height: Height;
  color: Color;
  confirmed: boolean;
}): Promise<CalculateResponse> {
  return request<CalculateResponse>("/api/orders", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
