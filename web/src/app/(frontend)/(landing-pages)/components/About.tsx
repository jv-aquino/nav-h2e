import { Atom, Ship, GraduationCap, Sparkles } from "lucide-react";

const features = [
  { icon: Atom, title: "Ciência Acessível", desc: "Traduzimos a complexidade do hidrogênio em conteúdo claro para todos." },
  { icon: Ship, title: "Foco Naval", desc: "Aplicações práticas do H₂ em embarcações e na descarbonização dos mares." },
  { icon: GraduationCap, title: "Pesquisa USP", desc: "Conhecimento produzido na Escola Politécnica da Universidade de São Paulo." },
  { icon: Sparkles, title: "Visão de Futuro", desc: "Mostramos como o hidrogênio pode redesenhar a matriz energética global." },
];

const About = () => {
  return (
    <section id="sobre" className="py-24 bg-gradient-soft">
      <div className="container">
        <div className="max-w-3xl mb-16">
          <div className="text-sm font-semibold text-primary uppercase tracking-widest mb-4">
            Sobre o projeto
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold leading-tight">
            Apresentando o hidrogênio para o mundo.
          </h2>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
            O <strong className="text-foreground">Hidrogênio Naval</strong> nasceu da paixão de alunos de Engenharia Naval da Poli-USP por uma navegação mais limpa. Aqui, você encontra artigos, análises e descobertas sobre como o hidrogênio está moldando o amanhã.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="group p-6 rounded-2xl bg-card border border-border shadow-card hover:shadow-glow hover:-translate-y-1 transition-smooth"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="w-12 h-12 rounded-xl bg-accent grid place-items-center mb-4 group-hover:bg-gradient-primary transition-smooth">
                <f.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-smooth" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
