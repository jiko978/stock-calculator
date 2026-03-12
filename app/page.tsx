export default function Home() {
    return (
        <main className="max-w-5xl mx-auto p-10">

            <h1 className="text-3xl font-bold mb-8">
                JIKO 플랫폼
            </h1>

            <p className="mb-6">
                다양한 계산기와 투자 도구를 제공합니다.
            </p>

            <a
                href="/calculator"
                className="p-6 border rounded-lg hover:bg-gray-100"
            >
                📊 계산기 바로가기
            </a>

        </main>
    )
}