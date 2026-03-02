"use client";

import { useState } from "react";

export default function ProfitRatePage() {
  const [buyPrice, setBuyPrice] = useState(0);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);

  const profit = (currentPrice - buyPrice) * quantity;
  const rate =
    buyPrice > 0
      ? (((currentPrice - buyPrice) / buyPrice) * 100).toFixed(2)
      : "0";

  return (
    <main style={{ padding: "40px", textAlign: "center" }}>
      <h1>💰 수익률 계산기</h1>

      <input
        type="number"
        placeholder="매입가"
        onChange={(e) => setBuyPrice(Number(e.target.value))}
      />
      <br /><br />
      <input
        type="number"
        placeholder="현재가"
        onChange={(e) => setCurrentPrice(Number(e.target.value))}
      />
      <br /><br />
      <input
        type="number"
        placeholder="수량"
        onChange={(e) => setQuantity(Number(e.target.value))}
      />

      <h2 style={{ marginTop: "30px" }}>
        수익금: {profit.toLocaleString()} 원
      </h2>
      <h2>수익률: {rate} %</h2>
    </main>
  );
}