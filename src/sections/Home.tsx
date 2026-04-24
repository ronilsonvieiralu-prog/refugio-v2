export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--refugio-bg)] text-[var(--refugio-ink)] font-sans">

      {/* HERO */}
      <section className="flex flex-col items-center justify-center text-center px-6 pt-24 pb-16">
        <h1 className="font-serif text-6xl mb-4">
          Refúgio
        </h1>

        <p className="text-lg text-[var(--refugio-muted)] max-w-xl">
          Um espaço de silêncio, profundidade e encontro interior.
        </p>

        <button className="mt-8 px-8 py-3 rounded-lg bg-[var(--refugio-accent)] text-white font-sans hover:opacity-90 transition">
          Entrar no Refúgio
        </button>
      </section>

      {/* FRASE CENTRAL */}
      <section className="px-6 py-20 text-center border-y border-[var(--refugio-line)] bg-[var(--refugio-accent-light)]">
        <p className="font-serif text-3xl text-[var(--refugio-ink)] max-w-3xl mx-auto leading-snug">
          “O silêncio não é ausência.  
          É presença profunda.”
        </p>
      </section>

      {/* SEÇÃO DE CONTEÚDO */}
      <section className="px-6 py-20 max-w-4xl mx-auto space-y-12">

        <div className="space-y-4">
          <h2 className="font-serif text-3xl">
            Um lugar para respirar
          </h2>
          <p className="text-[var(--refugio-muted)] leading-relaxed">
            O Refúgio é um espaço criado para acolher sua jornada interior.
            Aqui, cada palavra, cada pausa e cada silêncio tem um propósito:
            reconectar você ao essencial.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="font-serif text-3xl">
            Caminhos de profundidade
          </h2>
          <p className="text-[var(--refugio-muted)] leading-relaxed">
            Textos, meditações, reflexões e práticas que convidam você a
            desacelerar, ouvir e perceber o que realmente importa.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="font-serif text-3xl">
            Um convite ao silêncio
          </h2>
          <p className="text-[var(--refugio-muted)] leading-relaxed">
            O silêncio não é vazio — é um lugar de encontro.  
            Um lugar onde a alma respira.
          </p>
        </div>

      </section>

      {/* RODAPÉ */}
      <footer className="py-10 text-center text-[var(--refugio-muted)] border-t border-[var(--refugio-line)]">
        <p className="font-sans text-sm">
          © {new Date().getFullYear()} Refúgio — um espaço de profundidade.
        </p>
      </footer>

    </main>
  );
}
