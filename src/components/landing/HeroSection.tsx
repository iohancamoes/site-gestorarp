import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import heroBg from '@/assets/hero-bg.jpg';

const HeroSection = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image Fallback */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      {/* Video Background */}
      <div className={`absolute inset-0 z-0 transition-opacity duration-1000 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          onLoadedData={() => setVideoLoaded(true)}
          className="w-full h-full object-cover opacity-50"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
      </div>
      
      {/* Overlay Gradients */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-background/40 via-background/70 to-background" />
      <div className="absolute inset-0 z-[1] bg-hero-gradient" />

      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 z-[2] opacity-10"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Content */}
      <div className="container mx-auto px-6 relative z-10 text-center pt-32 pb-20 lg:pt-40">
        <div className={`transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-8 animate-fade-up">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-sm text-muted-foreground">Solução para Gestão Pública</span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight mb-6 text-balance animate-fade-up delay-100">
            Gestão eficiente, transparente
            <br />
            <span className="gradient-text">e sob controle</span>
          </h1>

          {/* Sub-headline */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 text-balance animate-fade-up delay-200">
            Com o Gestor de ARP, centralize suas Atas de Registro de Preços e acompanhe saldos, consumo e vigências com precisão, rastreabilidade e conformidade.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-up delay-300">
            <Button variant="hero" size="xl" className="group">
              Acessar gratuitamente
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button variant="secondary" size="xl" className="group" asChild>
              <a href="#como-funciona">
                Ver como funciona
              </a>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="animate-fade-up delay-500">
            <p className="text-sm text-muted-foreground mb-4">Adotado por órgãos públicos em todo o Brasil</p>
            <div className="flex items-center justify-center gap-8 opacity-60">
              <div className="text-foreground font-display font-semibold text-lg">Prefeituras</div>
              <div className="w-px h-6 bg-border" />
              <div className="text-foreground font-display font-semibold text-lg">Câmaras</div>
              <div className="w-px h-6 bg-border" />
              <div className="text-foreground font-display font-semibold text-lg">Autarquias</div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 left-10 w-72 h-72 bg-primary/20 rounded-full blur-[100px] animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-accent/20 rounded-full blur-[120px] animate-pulse-slow delay-1000" />
    </section>
  );
};

export default HeroSection;