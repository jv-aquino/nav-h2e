const Footer = () => {
  return (
    <footer className="border-t border-border bg-gradient-soft">
      <div className="container py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 font-display font-bold text-lg mb-3">
              <span className="w-8 h-8 rounded-lg bg-gradient-primary grid place-items-center text-primary-foreground text-sm">H₂</span>
              <span>Hidrogênio Naval</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Apresentando o hidrogênio para o mundo. Um projeto de alunos da Engenharia Naval da Poli-USP.
            </p>
          </div>
          <div>
            <h4 className="font-display font-semibold mb-3">Navegação</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#sobre" className="hover:text-primary transition-smooth">Sobre</a></li>
              <li><a href="#blog" className="hover:text-primary transition-smooth">Blog</a></li>
              <li><a href="#equipe" className="hover:text-primary transition-smooth">Equipe</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display font-semibold mb-3">Instituição</h4>
            <p className="text-sm text-muted-foreground">
              Escola Politécnica<br/>Universidade de São Paulo<br/>Engenharia Naval e Oceânica
            </p>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-border text-xs text-muted-foreground flex flex-col sm:flex-row justify-between gap-2">
          <span>© 2026 nav-h2e · Poli-USP</span>
          <span>Feito com 💚 por estudantes de Engenharia Naval</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
