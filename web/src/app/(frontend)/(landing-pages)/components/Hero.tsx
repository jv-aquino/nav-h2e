import { Button } from "@/components/ui/button";
import { ArrowRight, Leaf, ChevronDown } from "lucide-react";

const Hero = () => {
  return (
    <section id="top" className="relative min-h-screen flex items-end overflow-hidden">
      {/* Background image */}
      <img
        src='/hero-h2.jpg'
        alt="Embarcação movida a hidrogênio verde no oceano ao pôr do sol"
        width={1920}
        height={1280}
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/10" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-transparent to-transparent" />

      <div className="container relative z-10 pt-32 pb-16">
        <div className="max-w-3xl animate-fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-background/80 backdrop-blur-md border border-primary/20 text-primary text-xs font-semibold mb-6 shadow-soft">
            <Leaf className="w-3.5 h-3.5" />
            Engenharia Naval · Poli-USP
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-bold leading-[0.95] tracking-tight text-foreground">
            O futuro navega a{" "}
            <span className="gradient-primary-text">hidrogênio</span>.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-foreground/80 max-w-2xl leading-relaxed">
            <strong className="text-foreground">Hidrogênio Naval</strong> é o blog dos alunos de Engenharia Naval da Escola Politécnica da USP, dedicado a apresentar o hidrogênio como o combustível que vai transformar a navegação mundial.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button size="lg" className="bg-gradient-primary hover:opacity-90 transition-smooth shadow-glow group h-12 px-7">
              Conhecer o projeto
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-smooth" />
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-7 bg-background/60 backdrop-blur-md border-primary/30 hover:bg-accent">
              Ler artigos
            </Button>
          </div>

          <div className="mt-16 grid grid-cols-3 gap-6 max-w-md">
            {[
              { v: "0", l: "Emissões CO₂" },
              { v: "3×", l: "Mais energia" },
              { v: "100%", l: "Renovável" },
            ].map((s) => (
              <div key={s.l}>
                <div className="text-3xl md:text-4xl font-display font-bold text-primary">{s.v}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <a href="#sobre" aria-label="Rolar para baixo" className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-primary animate-float">
        <ChevronDown className="w-7 h-7" />
      </a>
    </section>
  );
};

export default Hero;
