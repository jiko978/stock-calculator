"use client";

import { useState } from "react";

export default function ProfitRatePage() {
  const [buyPrice, setBuyPrice] = useState("");
  const [currentPrice, setCurrentPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  const buy = Number(buyPrice.replace(/[^0-9]/g, ""));
  const current = Number(currentPrice.replace(/[^0-9]/g, ""));
  const qty = Number(quantity.replace(/[^0-9]/g, ""));

  const profit = (current - buy) * qty;
  const rate =
      buy > 0
          ? (((current - buy) / buy) * 100).toFixed(2)
          : "0";

  const formatComma = (raw: string) =>
      raw.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const handleChange = (setter: (v: string) => void) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
          const raw = e.target.value.replace(/[^0-9]/g, "");
          setter(raw === "" ? "" : formatComma(raw));
      };

  return (
    <main style={{ padding: "40px", textAlign: "center" }}>
      <h1>💰 수익률 계산기</h1>

      매입가 : <input
        type="text"
        placeholder="매입가"
        value={buyPrice}
        onChange={handleChange(setBuyPrice)}
        style={{ textAlign: "right", width: "150px" }}
      /> 원
      <br /><br />
      현재가 : <input
        type="text"
        placeholder="현재가"
        value={currentPrice}
        onChange={handleChange(setCurrentPrice)}
        style={{ textAlign: "right", width: "150px" }}
      /> 원
      <br /><br />
      수량 : <input
        type="text"
        placeholder="수량"
        value={quantity}
        onChange={handleChange(setQuantity)}
        style={{ textAlign: "right", width: "150px" }}
      /> 개

      <h2 style={{ marginTop: "30px" }}>
        수익금 : {profit.toLocaleString()} 원
      </h2>
      <h2 style={{ marginTop: "5px" }}>
          수익률 : {rate.toLocaleString()} 원
      </h2>
    </main>
  );
}