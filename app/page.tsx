"use client";

import { useEffect, useRef, useState } from "react";

type Step = "landing" | "chat" | "result" | "final";
type Question = { text: string; buttons?: string[]; money?: boolean; placeholder?: string };

const QUESTIONS: Question[] = [
  { text: "¿Cuál es el nombre de tu negocio?", placeholder: "Ej: Tienda Doña Rosa" },
  { text: "¿Qué tipo de negocio tienes?", placeholder: "Ej: Tienda de barrio" },
  { text: "¿Cuánto dinero necesitas?", money: true, placeholder: "Ej: 5000000" },
  { text: "¿Para qué necesitas el dinero?", placeholder: "Ej: Comprar más mercancía" },
  { text: "¿Cuánto vendes aproximadamente al día?", money: true, placeholder: "Ej: 300000" },
  { text: "¿Cada cuánto recibes ingresos?", buttons: ["Diario", "Semanal", "Otro"] },
];

const cop = (v: string) => "$" + new Intl.NumberFormat("es-CO").format(Number(v));

export default function Home() {
  const [step, setStep] = useState<Step>("landing");
  const [answers, setAnswers] = useState<string[]>([]);
  const [text, setText] = useState("");
  const [analyzing, setAnalyzing] = useState(true);
  const endRef = useRef<HTMLDivElement>(null);

  const current = QUESTIONS[answers.length];
  const show = (i: number) => (QUESTIONS[i].money ? cop(answers[i]) : answers[i]);

  useEffect(() => {
  endRef.current?.scrollIntoView({ behavior: "smooth" });
}, [answers, step]);

  useEffect(() => {
    if (step !== "result") return;
    setAnalyzing(true);
    const t = setTimeout(() => setAnalyzing(false), 2000);
    return () => clearTimeout(t);
  }, [step]);

  function reply(raw: string) {
    const value = current.money ? raw.replace(/\D/g, "") : raw.trim();
    if (!value || (current.money && Number(value) === 0)) return;
    const next = [...answers, value];
    setAnswers(next);
    setText("");
    if (next.length === QUESTIONS.length) setTimeout(() => setStep("result"), 600);
  }

  function restart() {
    setAnswers([]);
    setText("");
    setStep("landing");
  }

  const primary =
    "w-full rounded-xl bg-brand px-5 py-4 text-base font-semibold text-white hover:bg-brand-dark focus:outline-none focus-visible:ring-4 focus-visible:ring-sun/60";

  const Header = (
    <header className="flex items-center gap-2 border-b border-slate-100 px-5 py-4">
      <span className="h-3 w-3 rounded-full bg-sun" />
      <span className="text-lg font-bold text-brand">Impulso</span>
    </header>
  );

  if (step === "landing") {
    return (
      <>
        {Header}
        <main className="flex flex-1 flex-col justify-center gap-6 px-5 py-10">
          <h1 className="text-4xl font-extrabold leading-tight text-brand">
            Encuentra una opción de crédito para tu negocio
          </h1>
          <p className="text-lg leading-relaxed text-slate-600">
            Te ayudamos a encontrar financiación formal para tu negocio. Responde unas preguntas
            sencillas, sin papeleo ni filas.
          </p>
          <button className={primary} onClick={() => setStep("chat")}>
            Solicitar financiación
          </button>
        </main>
      </>
    );
  }

  if (step === "chat") {
    return (
      <>
        {Header}
        <main className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-5">
          {QUESTIONS.slice(0, answers.length + 1).map((q, i) => (
            <div key={i} className="flex flex-col gap-3">
              <div className="max-w-[85%] self-start rounded-2xl rounded-bl-sm bg-brand-soft px-4 py-3 text-slate-800">
                {q.text}
              </div>
              {i < answers.length && (
                <div className="max-w-[85%] self-end rounded-2xl rounded-br-sm bg-brand px-4 py-3 text-white">
                  {show(i)}
                </div>
              )}
            </div>
          ))}
          <div ref={endRef} />
        </main>

        {current && (
          <div className="border-t border-slate-100 p-4">
            {current.buttons ? (
              <div className="flex gap-2">
                {current.buttons.map((b) => (
                  <button
                    key={b}
                    onClick={() => reply(b)}
                    className="flex-1 rounded-xl border-2 border-brand px-3 py-3 font-semibold text-brand hover:bg-brand-soft focus:outline-none focus-visible:ring-4 focus-visible:ring-sun/60"
                  >
                    {b}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  autoFocus
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && reply(text)}
                  inputMode={current.money ? "numeric" : "text"}
                  placeholder={current.placeholder}
                  aria-label={current.text}
                  className="min-w-0 flex-1 rounded-xl border border-slate-300 px-4 py-3 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
                />
                <button
                  onClick={() => reply(text)}
                  className="rounded-xl bg-brand px-5 py-3 font-semibold text-white hover:bg-brand-dark focus:outline-none focus-visible:ring-4 focus-visible:ring-sun/60"
                >
                  Enviar
                </button>
              </div>
            )}
          </div>
        )}
      </>
    );
  }

  if (step === "result") {
    return (
      <>
        {Header}
        <main className="flex flex-1 flex-col justify-center gap-6 px-5 py-10">
          {analyzing ? (
            <p className="text-center text-xl font-semibold text-brand" role="status">
              Estamos analizando la información de tu negocio.
            </p>
          ) : (
            <>
              <h1 className="text-2xl font-extrabold leading-snug text-brand">
                Tu solicitud está lista para ser evaluada por una entidad financiera aliada.
              </h1>
              <dl className="divide-y divide-slate-100 rounded-2xl border border-slate-200">
                {[
                  ["Negocio", answers[0]],
                  ["Monto solicitado", cop(answers[2])],
                  ["Uso del crédito", answers[3]],
                  ["Ingreso aproximado", `${cop(answers[4])} al día · ingresos ${answers[5].toLowerCase()}`],
                ].map(([k, v]) => (
                  <div key={k} className="px-4 py-3">
                    <dt className="text-sm text-slate-500">{k}</dt>
                    <dd className="font-semibold">{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="text-sm text-slate-500">Resultado de demostración con datos de ejemplo.</p>
              <button className={primary} onClick={() => setStep("final")}>
                Continuar solicitud
              </button>
            </>
          )}
        </main>
      </>
    );
  }

  return (
    <>
      {Header}
      <main className="flex flex-1 flex-col justify-center gap-6 px-5 py-10">
        <h1 className="text-2xl font-extrabold leading-snug text-brand">Importante</h1>
        <p className="rounded-2xl bg-brand-soft p-5 text-lg leading-relaxed text-slate-800">
          Este prototipo no presta dinero directamente. La plataforma conecta tu solicitud con
          entidades financieras reguladas.
        </p>
        <button className={primary} onClick={restart}>
          Volver al inicio
        </button>
      </main>
    </>
  );
}
