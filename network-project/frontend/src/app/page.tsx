import { Button } from "../components/Button/button";
export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8">Dashboard Principal</h1>
      <p className="text-lg mb-8">Este é um texto de exemplo no dashboard.</p>
      <Button>Clique Aquis</Button>
    </div>
  );
}
