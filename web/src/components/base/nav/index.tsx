import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/70 border-b border-border/50">
      <nav className="container flex items-center justify-between h-16">
        <a href="#top" className="flex items-center gap-2 font-display font-bold text-lg">
          <span className="w-8 h-8 rounded-lg bg-gradient-primary grid place-items-center text-primary-foreground text-sm">H₂</span>
          <span>Hidrogênio Naval</span>
        </a>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <a href="#sobre" className="hover:text-primary transition-smooth">Sobre</a>
          <a href="#blog" className="hover:text-primary transition-smooth">Blog</a>
          <a href="#equipe" className="hover:text-primary transition-smooth">Equipe</a>
          <a href="#contato" className="hover:text-primary transition-smooth">Contato</a>
        </div>
        <Button variant="default" size="sm" className="bg-gradient-primary hover:opacity-90 transition-smooth">
          Saiba mais
        </Button>
      </nav>
    </header>
  );
};

export default Navbar;
