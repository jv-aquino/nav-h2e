import Navbar from "@/components/base/nav";
import Hero from "./components/Hero";
import About from "./components/About";
import Footer from "./components/Footer";

export default async function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <About />
      </main>
      <Footer />
    </div>
  );
}