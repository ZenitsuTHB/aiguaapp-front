import { useNavigate } from 'react-router-dom';
import { Droplets, TrendingUp, Shield, Users, ArrowRight } from 'lucide-react';

export function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: TrendingUp,
      title: 'Monitorització en temps real',
      description: 'Seguiment continu del consum d\'aigua per barris amb actualització cada 30 segons'
    },
    {
      icon: Shield,
      title: 'Detecció d\'anomalies',
      description: 'Sistema intel·ligent que identifica fugues, pics i desviacions de consum'
    },
    {
      icon: Users,
      title: 'Gestió sostenible',
      description: 'Alineat amb els ODS 6 i 13 per una gestió responsable dels recursos hídrics'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background decorativo */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 opacity-10"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Contenido */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full mb-6">
                <Droplets className="w-4 h-4" />
                <span className="text-sm font-semibold">Hackathon IT Academy 2025</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
                💧 <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600">
                  AiguaApp
                </span>
              </h1>
              
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
                Gestió sostenible de l'aigua a Catalunya
              </h2>
              
              <p className="text-lg text-gray-600 mb-8 max-w-2xl">
                Aplicació web per a la monitorització i conscienciació sobre el consum d'aigua 
                en barris de Catalunya. Reto 3 – Gestió sostenible dels recursos hídrics, 
                alineat amb els <strong>ODS 6</strong> (Aigua neta i sanejament) i <strong>ODS 13</strong> (Acció pel clima).
              </p>

              <blockquote className="text-xl italic text-blue-700 mb-8 border-l-4 border-blue-500 pl-4">
                "L'aigua també té un ritme."
              </blockquote>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-sky-600 text-white font-semibold rounded-xl shadow-lg hover:bg-sky-700 hover:scale-105 transform transition-all"
                >
                  Començar
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => navigate('/mapa')}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-sky-600 font-semibold rounded-xl shadow-lg hover:shadow-xl transform transition-all border-2 border-sky-600"
                >
                  Veure Mapa
                </button>
              </div>
            </div>

            {/* Imagen/Visual */}
            <div className="relative hidden lg:block">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <div className="aspect-square bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center">
                  <Droplets className="w-64 h-64 text-white opacity-20" />
                </div>
              </div>
              {/* Decoración flotante */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-500 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-cyan-500 rounded-full opacity-20 animate-pulse delay-75"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Funcionalitats Principals
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Eines potents per a la gestió intel·ligent dels recursos hídrics
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-8 hover:shadow-lg transition-shadow"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-lg mb-4">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-cyan-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-white">
            <div>
              <div className="text-4xl font-bold mb-2">10+</div>
              <div className="text-blue-100">Barris Monitoritzats</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-blue-100">Monitorització Contínua</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">30s</div>
              <div className="text-blue-100">Actualització de Dades</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            Comença a Monitoritzar Ara
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Descobreix com pots contribuir a la gestió sostenible de l'aigua
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-blue-600 text-white font-bold text-lg rounded-xl shadow-xl hover:bg-blue-700 hover:scale-105 transform transition-all"
          >
            Accedir al Dashboard
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </section>
    </div>
  );
}
