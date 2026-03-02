import Link from "next/link";

export default function Home() {
  return (
    <main style={{ padding: "40px", textAlign: "center" }}>
      <h1>📈 주식 계산기 모음</h1>
      <p>필요한 계산기를 선택하세요.</p>

      <div style={{ marginTop: "30px" }}>
        <Link href="/avg-price">
          <button style={{ margin: "10px", padding: "10px 20px" }}>
            평단가 계산기
          </button>
        </Link>

        <Link href="/profit-rate">
          <button style={{ margin: "10px", padding: "10px 20px" }}>
            수익률 계산기
          </button>
        </Link>
      </div>
    </main>
  );
}