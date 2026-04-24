export default function Textos() {
  const textos = [
    {
      titulo: "O silêncio que acolhe",
      trecho:
        "Há um silêncio que não é vazio, mas cheio de presença. Um silêncio que abraça.",
    },
    {
      titulo: "Respirar com profundidade",
      trecho:
        "A respiração é uma ponte entre o visível e o invisível. Entre o corpo e a alma.",
    },
    {
      titulo: "O caminho interior",
      trecho:
        "O verdadeiro caminho não está fora, mas dentro. É um retorno ao essencial.",
    },
  ];

  return (
    <main className="min-h-screen bg-[var(--refugio-bg)] text-[var(--refugio-ink)] px-6 pt-24 pb-20 font-sans">
      <h1 className="font-serif text-5xl mb-10 text-center">
        Textos
      </h1>

      <div className="max-w-4xl mx-auto grid gap-8">
        {textos.map((item, index) => (
          <div
            key={index}
            className="p-6 rounded-xl bg-[var(--refugio-accent-light)] border border-[var(--refugio-line)] hover:shadow-md transition"
          >
            <h2 className="font-serif text-2xl mb-2">
              {item.titulo}
            </h2>
            <p className="text-[var(--refugio-muted)] leading-relaxed">
              {item.trecho}
            </p>

            <button className="mt-4 px-4 py-2 rounded-lg bg-[var(--refugio-accent)] text-white hover:opacity-90 transition">
              Ler mais
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
