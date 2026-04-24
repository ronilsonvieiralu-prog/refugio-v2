import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

interface Desabafo {
  id: number
  texto: string
  oracoes: number
  tempo: string
}

function App() {
  const [tela, setTela] = useState<'home' | 'mural' | 'escrever'>('home')
  const [novoDesabafo, setNovoDesabafo] = useState('')

  const [desabafos, setDesabafos] = useState<Desabafo[]>(() => {
    const salvo = localStorage.getItem('refugio_desabafos')
    return salvo? JSON.parse(salvo) : [
      {
        id: 1,
        texto: "Perdi meu emprego hoje e tô com medo de não conseguir pagar as contas. Me sinto um fracasso.",
        oracoes: 47,
        tempo: "há 2 horas"
      },
      {
        id: 2,
        texto: "Minha ansiedade não me deixa dormir faz 3 dias. Só queria paz na mente.",
        oracoes: 89,
        tempo: "há 5 horas"
      },
      {
        id: 3,
        texto: "Terminei um relacionamento de 4 anos. Dói demais, mas sei que vou ficar bem um dia.",
        oracoes: 132,
        tempo: "há 1 dia"
      }
    ]
  })

  const [oracoesEnviadas, setOracoesEnviadas] = useState(() => {
    const salvo = localStorage.getItem('refugio_total_oracoes')
    return salvo? JSON.parse(salvo) : 1247
  })

  const [jaOrou, setJaOrou] = useState<number[]>(() => {
    const salvo = localStorage.getItem('refugio_ja_orou')
    return salvo? JSON.parse(salvo) : []
  })

  useEffect(() => {
    localStorage.setItem('refugio_desabafos', JSON.stringify(desabafos))
  }, [desabafos])

  useEffect(() => {
    localStorage.setItem('refugio_total_oracoes', JSON.stringify(oracoesEnviadas))
  }, [oracoesEnviadas])

  useEffect(() => {
    localStorage.setItem('refugio_ja_orou', JSON.stringify(jaOrou))
  }, [jaOrou])

  const orarPorAlguem = (id: number) => {
    if (jaOrou.includes(id)) return

    setDesabafos(desabafos.map(d =>
      d.id === id? {...d, oracoes: d.oracoes + 1 } : d
    ))
    setOracoesEnviadas(prev => prev + 1)
    setJaOrou([...jaOrou, id])
  }

  const enviarDesabafo = () => {
    if (novoDesabafo.trim().length < 10) return

    const novo: Desabafo = {
      id: Date.now(),
      texto: novoDesabafo,
      oracoes: 0,
      tempo: "agora"
    }

    setDesabafos([novo,...desabafos])
    setNovoDesabafo('')
    setTela('mural')
  }

  return (
    <div className="min-h-screen bg-calm-50">
      <AnimatePresence mode="wait">
        {tela === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex items-center justify-center overflow-hidden px-4"
          >
            <div className="text-center w-full max-w-2xl">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-5xl sm:text-6xl md:text-7xl font-playfair text-calm-600 mb-6"
              >
                Refúgio
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                className="text-lg sm:text-xl text-calm-700 font-inter mb-12 leading-relaxed"
              >
                Um espaço seguro e anônimo.<br />
                Desabafe sem medo. Receba orações sem se expor.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <button
                  onClick={() => setTela('escrever')}
                  className="px-8 py-4 bg-calm-500 text-white text-lg rounded-xl hover:bg-calm-600 transition-colors shadow-lg w-full sm:w-auto"
                >
                  Preciso desabafar
                </button>

                <button
                  onClick={() => setTela('mural')}
                  className="px-8 py-4 bg-white text-calm-600 text-lg rounded-xl hover:bg-calm-100 transition-colors shadow-lg border-2 border-calm-200 w-full sm:w-auto"
                >
                  Quero orar por alguém 🙏
                </button>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="mt-16 text-sm text-calm-500"
              >
                Hoje, {oracoesEnviadas.toLocaleString()} orações foram enviadas
              </motion.p>
            </div>
          </motion.div>
        )}

        {tela === 'mural' && (
          <motion.div
            key="mural"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="min-h-screen py-8 px-4"
          >
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-playfair text-calm-600">Mural de Orações</h2>
                <button
                  onClick={() => setTela('home')}
                  className="text-calm-600 hover:text-calm-700"
                >
                  ← Voltar
                </button>
              </div>

              <button
                onClick={() => setTela('escrever')}
                className="w-full mb-6 py-4 bg-white border-2 border-dashed border-calm-300 rounded-xl text-calm-500 hover:border-calm-400 hover:text-calm-600 transition"
              >
                + Escrever meu desabafo
              </button>

              <div className="space-y-4">
                {desabafos.map((desabafo, index) => (
                  <motion.div
                    key={desabafo.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white p-6 rounded-2xl shadow-md"
                  >
                    <p className="text-calm-800 leading-relaxed mb-4 font-inter">
                      {desabafo.texto}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-calm-400">{desabafo.tempo}</span>

                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => orarPorAlguem(desabafo.id)}
                        disabled={jaOrou.includes(desabafo.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                          jaOrou.includes(desabafo.id)
                           ? 'bg-calm-100 text-calm-500 cursor-not-allowed'
                            : 'bg-calm-500 text-white hover:bg-calm-600'
                        }`}
                      >
                        <span>{jaOrou.includes(desabafo.id)? '🙏 Orado' : '🙏 Eu oro por você'}</span>
                        <span className="font-bold">{desabafo.oracoes}</span>
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {tela === 'escrever' && (
          <motion.div
            key="escrever"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="min-h-screen flex items-center justify-center px-4"
          >
            <div className="w-full max-w-2xl">
              <button
                onClick={() => setTela('mural')}
                className="mb-6 text-calm-600 hover:text-calm-700"
              >
                ← Voltar ao mural
              </button>

              <h2 className="text-3xl font-playfair text-calm-600 mb-6">
                Desabafe aqui. Ninguém vai te julgar.
              </h2>

              <textarea
                value={novoDesabafo}
                onChange={(e) => setNovoDesabafo(e.target.value)}
                placeholder="Escreva o que está no seu coração..."
                className="w-full h-48 p-4 bg-white rounded-xl border-2 border-calm-200 focus:border-calm-400 focus:outline-none text-calm-800 font-inter resize-none"
                maxLength={500}
              />

              <div className="flex items-center justify-between mt-4">
                <span className="text-sm text-calm-400">
                  {novoDesabafo.length}/500 caracteres
                </span>
                <span className="text-sm text-calm-500">
                  100% anônimo
                </span>
              </div>

              <button
                onClick={enviarDesabafo}
                disabled={novoDesabafo.trim().length < 10}
                className="w-full mt-6 py-4 bg-calm-500 text-white text-lg rounded-xl hover:bg-calm-600 transition disabled:bg-calm-200 disabled:cursor-not-allowed"
              >
                Enviar anonimamente
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App