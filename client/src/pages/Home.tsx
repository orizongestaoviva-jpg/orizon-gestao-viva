import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";

export default function Home() {
  const { user, loading, isAuthenticated, logout } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-600">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Carregando ORIZON...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated && user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-4xl font-bold text-indigo-600 mb-4">
              Bem-vindo ao ORIZON SaaS, {user.name}!
            </h1>
            <p className="text-gray-600 mb-8">
              Sistema de Gestão de Pessoas e Performance com Remote Performance
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-indigo-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-indigo-600 mb-2">📊 Dashboard</h3>
                <p className="text-gray-600">Visualize KPIs e indicadores em tempo real</p>
              </div>
              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-600 mb-2">👥 Colaboradores</h3>
                <p className="text-gray-600">Gerencie sua equipe e performance</p>
              </div>
              <div className="bg-amber-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-amber-600 mb-2">🚀 Remote Performance</h3>
                <p className="text-gray-600">Monitore produtividade remota com ética</p>
              </div>
            </div>

            <div className="bg-indigo-100 border-l-4 border-indigo-600 p-6 rounded mb-8">
              <h3 className="text-lg font-semibold text-indigo-600 mb-2">🔐 Perfil Atual</h3>
              <p className="text-gray-700">
                <strong>Email:</strong> {user.email}
              </p>
              <p className="text-gray-700">
                <strong>Perfil:</strong> {user.profile || "Não definido"}
              </p>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={() => (window.location.href = "/dashboard")}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg"
              >
                Ir para Dashboard
              </Button>
              <Button
                onClick={logout}
                variant="outline"
                className="border-indigo-600 text-indigo-600 hover:bg-indigo-50 px-6 py-2 rounded-lg"
              >
                Sair
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-white mb-4">ORIZON</h1>
        <p className="text-xl text-indigo-100 mb-8">
          Sistema de Gestão de Pessoas e Performance
        </p>
        <p className="text-lg text-indigo-200 mb-12">
          Com Módulo Inovador de Remote Performance
        </p>
        <a href={getLoginUrl()}>
          <Button className="bg-white text-indigo-600 hover:bg-indigo-50 px-8 py-3 rounded-lg text-lg font-semibold">
            Entrar no Sistema
          </Button>
        </a>
      </div>
    </div>
  );
}
