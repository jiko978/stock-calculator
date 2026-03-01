'use client'

import { useState } from 'react'

export default function AvgPriceCalculator() {
  const [price1, setPrice1] = useState(0)
  const [qty1, setQty1] = useState(0)
  
  const [price2, setPrice2] = useState(0)
  const [qty2, setQty2] = useState(0)
  
  const [price3, setPrice3] = useState(0)
  const [qty3, setQty3] = useState(0)

  const totalCost = (price1 * qty1) + (price2 * qty2) + (price3 * qty3)
  const totalQty = qty1 + qty2 + qty3
  const avgPrice = totalQty ? totalCost / totalQty : 0

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-5">물타기 평균 단가 계산기</h1>

      <div className="space-y-3">
        <input type="number" placeholder="1차 매수가"
          onChange={e => setPrice1(Number(e.target.value))}
          className="border p-2" />
        <input type="number" placeholder="1차 수량"
          onChange={e => setQty1(Number(e.target.value))}
          className="border p-2" />

        <input type="number" placeholder="2차 매수가"
          onChange={e => setPrice2(Number(e.target.value))}
          className="border p-2" />
        <input type="number" placeholder="2차 수량"
          onChange={e => setQty2(Number(e.target.value))}
          className="border p-2" />

        <input type="number" placeholder="3차 매수가"
          onChange={e => setPrice3(Number(e.target.value))}
          className="border p-2" />
        <input type="number" placeholder="3차 수량"
          onChange={e => setQty3(Number(e.target.value))}
          className="border p-2" />
      </div>

      <div className="mt-5">
        <p>평균 단가: {avgPrice.toFixed(2)} 원</p>
      </div>
    </div>
  )
}