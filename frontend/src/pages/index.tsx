import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8">Página Inicial</h1>
      <Link href="/dashboard">
        <a className="text-blue-500 hover:underline">Ir para o Dashboard</a>
      </Link>
    </div>
  );
}
