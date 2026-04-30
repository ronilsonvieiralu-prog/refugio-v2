import { gerarNomeBiblicoUnico } from './nomesBiblicos'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useMemo } from 'react'
import { supabase } from './lib/supabase'

interface Desabafo {
  id: string
  mensagem: string
  oracoes: number
  created_at: string
  codigo_dono: string
}

interface MensagemPastor {
  id: string
  texto: string
  data: string
  lida: boolean
  codigo: string
  resposta?: string
  dataResposta?: string
}

const VERSICULOS_CURAS = [
  "Lança sobre ele toda a sua ansiedade, porque ele tem cuidado de você. 1 Pedro 5:7",
  "O Senhor está perto dos que têm o coração quebrantado. Salmos 34:18",
  "Vinde a mim todos os cansados, e eu vos aliviarei. Mateus 11:28",
  "Não temas, porque eu sou contigo. Isaías 41:10",
  "A minha graça te basta, porque o meu poder se aperfeiçoa na fraqueza. 2 Coríntios 12:9",
  "Entrega o teu caminho ao Senhor; confia nele, e ele o fará. Salmos 37:5",
  "Tudo posso naquele que me fortalece. Filipenses 4:13"
]

function RespostaMensagem({ msgId, onEnviar }: { msgId: string, onEnviar: (id: string, texto: string) => void }) {
  const [texto, setTexto] = useState('')

  return (
    <div>
      <textarea
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Escreva sua resposta pastoral..."
        className="w-full h-24 p-3 bg-calm-50 rounded-lg border border-calm-200 focus:border-amber-400 focus:outline-none text-calm-800 text-sm resize-none mb-2"
      />
      <button
        onClick={() => { onEnviar(msgId, texto); setTexto('') }}
        disabled={texto.trim().length < 5}
        className="w-full py-2 bg-amber-500 text-white text-sm rounded-lg hover:bg-amber-600 transition disabled:bg-calm-200"
      >
        Enviar Resposta
      </button>
    </div>
  )
}


// AQUI COMEÇA O APP
function App() {
  const [tela, setTela] = useState<'home' | 'mural' | 'escrever' | 'pastor'>('home')
  const [novoDesabafo, setNovoDesabafo] = useState('')
  const [mostrarNotificacao, setMostrarNotificacao] = useState(false)
  const [versiculoAtual, setVersiculoAtual] = useState('')
  const [mensagensPastor, setMensagensPastor] = useState<MensagemPastor[]>([])
  const [textoMensagemPastor, setTextoMensagemPastor] = useState('')
  const [senhaPastor, setSenhaPastor] = useState('')
  const [pastorLogado, setPastorLogado] = useState(false)
  const [telaPastor, setTelaPastor] = useState<'login' | 'mensagens' | 'escrever' | 'codigo' | 'verResposta'>('login')
  const [codigoAcompanhamento, setCodigoAcompanhamento] = useState('')
  const [mensagemEncontrada, setMensagemEncontrada] = useState<MensagemPastor | null>(null)
  const [desabafos, setDesabafos] = useState<Desabafo[]>([])
  const [oracoesEnviadas, setOracoesEnviadas] = useState<number>(0)
  const [buscaMural, setBuscaMural] = useState('')
  const [oracoesRecebidas, setOracoesRecebidas] = useState<number>(0)
  const [mostrarModalLogin, setMostrarModalLogin] = useState(false)
  const [genero, setGenero] = useState<'homem' | 'mulher' | null>(null)
  const [nomeBiblico, setNomeBiblico] = useState('')
  const [senhaRefugio, setSenhaRefugio] = useState('')
  const meuCodigo = nomeBiblico || 'Anônimo'

  useEffect(() => {
    const nomeSalvo = localStorage.getItem('nomeRefugio')
    if (nomeSalvo) {
      setNomeBiblico(nomeSalvo)
      setMostrarModalLogin(false)
    }
  }, [])

  const handleGerarNome = async (gen: 'homem' | 'mulher') => {
    setNomeBiblico('Gerando...')
    const nome = await gerarNomeBiblicoUnico(gen)
    setNomeBiblico(nome)
    setGenero(gen)
  }

  const fazerLoginRefugio = async () => {
  if (!nomeBiblico ||!senhaRefugio || nomeBiblico === 'Gerando...') {
    alert('Escolha um gênero e crie uma senha!')
    return
  }

    const { error } = await supabase
   .from('usuarios_refugio')
   .insert({
        nome_biblico: nomeBiblico,
        genero: genero,
        senha: senhaRefugio
      })

    if (error) {
      alert('Esse nome acabou de ser escolhido. Gera outro!')
      handleGerarNome(genero!)
      return
    }

    localStorage.setItem('nomeRefugio', nomeBiblico)
    setMostrarModalLogin(false)
  }

const fazerLogoutRefugio = () => {
  setNomeBiblico('')
  setSenhaRefugio('')
  setGenero(null)
  }

  useEffect(() => {
    carregarDesabafos()
    contarOracoes()

    const channel = supabase
   .channel('desabafos-realtime')
   .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'desabafos' },
        () => {
          carregarDesabafos()
          contarOracoes()
        }
      )
   .on('postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'desabafos' },
        (payload) => {
          setDesabafos(prev => prev.filter(d => d.id!== payload.old.id))
          contarOracoes()
        }
      )
   .on('postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'desabafos' },
        (payload) => {
          setDesabafos(prev => prev.map(d => d.id === payload.new.id? payload.new as Desabafo : d))
        }
      )
   .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  useEffect(() => {
    const contarMinhasOracoes = async () => {
      const { data } = await supabase
     .from('desabafos')
     .select('oracoes')
     .eq('codigo_dono', meuCodigo)

      if (data) {
        const total = data.reduce((acc: number, curr: { oracoes: number }) => acc + curr.oracoes, 0)
        setOracoesRecebidas(total)
      }
    }
    contarMinhasOracoes()
  }, [meuCodigo, desabafos])

  const carregarDesabafos = async () => {
    const { data, error } = await supabase
   .from('desabafos')
   .select('*')
   .order('created_at', { ascending: false })

    if (!error && data) setDesabafos(data)
  }

  const contarOracoes = async () => {
    const { data } = await supabase
   .from('desabafos')
   .select('oracoes')

    if (data) {
      const total = data.reduce((acc: number, curr: { oracoes: number }) => acc + curr.oracoes, 0)
      setOracoesEnviadas(total)
    }
  }

  const getOracoesVotadas = (): string[] => {
    const salvos = localStorage.getItem('refugio_oracoes_votadas')
    return salvos? JSON.parse(salvos) : []
  }

  const handleOrar = async (desabafoId: string) => {
    const jaVotou = getOracoesVotadas()

    if (jaVotou.includes(desabafoId)) {
      alert('Você já orou por esse pedido 🙏')
      return
    }

    const desabafoAtual = desabafos.find(d => d.id === desabafoId)
    if (!desabafoAtual) return

    const { error } = await supabase
   .from('desabafos')
   .update({ oracoes: desabafoAtual.oracoes + 1 })
   .eq('id', desabafoId)

    if (!error) {
      setDesabafos(desabafos.map(d =>
        d.id === desabafoId
       ? {...d, oracoes: d.oracoes + 1 }
          : d
      ))
      setOracoesEnviadas((prev: number) => prev + 1)

      localStorage.setItem(
        'refugio_oracoes_votadas',
        JSON.stringify([...jaVotou, desabafoId])
      )

      const versiculoSorteado = VERSICULOS_CURAS[Math.floor(Math.random() * VERSICULOS_CURAS.length)]
      setVersiculoAtual(versiculoSorteado)
      setMostrarNotificacao(true)
      setTimeout(() => setMostrarNotificacao(false), 5000)
    }
  }

  const enviarDesabafo = async () => {
    if (novoDesabafo.trim().length < 10) return

    const { error } = await supabase
   .from('desabafos')
   .insert({ mensagem: novoDesabafo, oracoes: 0, codigo_dono: meuCodigo })

    if (!error) {
      setNovoDesabafo('')
      await carregarDesabafos()
      setTela('mural')
    } else {
      alert('Erro ao enviar: ' + error.message)
    }
  }

  const deletarDesabafo = async (id: string) => {
    if (!pastorLogado) return
    if (confirm('Tem certeza que deseja apagar este desabafo? Esta ação não pode ser desfeita.')) {
      const { error } = await supabase
     .from('desabafos')
     .delete()
     .eq('id', id)

      if (!error) {
        setDesabafos(desabafos.filter(d => d.id!== id))
      }
    }
  }

  const topHashtags = useMemo(() => {
    const stopWords = ['para', 'como', 'mais', 'muito', 'estou', 'sobre', 'ainda', 'depois', 'porque', 'quando', 'minha', 'meu', 'essa', 'esse', 'isso', 'esta', 'está', 'com', 'sem', 'mas', 'que', 'não', 'uma', 'por', 'dos', 'das', 'pelo', 'pela']
    const todasPalavras = desabafos.map(d => d.mensagem.toLowerCase().replace(/[.,!?;]/g, '')).join(' ').split(' ').filter(p => p.length >= 4 &&!stopWords.includes(p))
    const contagem: Record<string, number> = {}
    todasPalavras.forEach(p => { contagem[p] = (contagem[p] || 0) + 1 })
    return Object.entries(contagem).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([palavra]) => palavra)
  }, [desabafos])

  const desabafosFiltrados = useMemo(() => {
    if (!buscaMural.trim()) return desabafos
    return desabafos.filter(d => d.mensagem.toLowerCase().includes(buscaMural.toLowerCase()))
  }, [desabafos, buscaMural])

  const gerarCodigo = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    let codigo = 'REFUGIO-'
    for (let i = 0; i < 6; i++) { codigo += chars.charAt(Math.floor(Math.random() * chars.length)) }
    return codigo
  }

  const enviarMensagemPastor = async () => {
  if (textoMensagemPastor.trim().length < 10) return
  const novoCodigo = gerarCodigo()

  const { error } = await supabase
  .from('mensagens_pastor')
  .insert({
      texto: textoMensagemPastor,
      codigo: novoCodigo,
      nome_remetente: nomeBiblico || 'Anônimo'
    })

  if (error) {
    alert('Erro ao enviar: ' + error.message)
    return
  }

  setCodigoAcompanhamento(novoCodigo)
  setTextoMensagemPastor('')
  setTelaPastor('codigo')
  }
  const carregarMensagensPastor = async () => {
  const { data } = await supabase
  .from('mensagens_pastor')
  .select('*')
  .order('data', { ascending: false })

  if (data) {
    const msgs: MensagemPastor[] = data.map(d => ({
      id: d.id,
      texto: d.texto,
      data: new Date(d.data).toLocaleString('pt-BR'),
      lida: d.lida,
      codigo: d.codigo,
      resposta: d.resposta,
      dataResposta: d.data_resposta? new Date(d.data_resposta).toLocaleString('pt-BR') : undefined
    }))
    setMensagensPastor(msgs)
  }
}
const enviarRespostaPastor = async (id: string, resposta: string) => {
  if (resposta.trim().length < 5) return

  const { error } = await supabase
  .from('mensagens_pastor')
  .update({
      resposta: resposta,
      data_resposta: new Date().toISOString(),
      lida: true
    })
  .eq('id', id)

  if (!error) {
    carregarMensagensPastor()
  } else {
    alert('Erro ao enviar resposta')
  }
}
  const buscarResposta = async () => {
  const codigo = codigoAcompanhamento.trim().toUpperCase()

  const { data, error } = await supabase
  .from('mensagens_pastor')
  .select('*')
  .eq('codigo', codigo)
  .maybeSingle()

  if (error ||!data) {
    alert('Código não encontrado. Verifique e tente novamente.')
    return
  }

  setMensagemEncontrada({
    id: data.id,
    texto: data.texto,
    data: new Date(data.data).toLocaleString('pt-BR'),
    lida: data.lida,
    codigo: data.codigo,
    resposta: data.resposta,
    dataResposta: data.data_resposta? new Date(data.data_resposta).toLocaleString('pt-BR') : undefined
  })
  setTelaPastor('verResposta')
  }

  const loginPastor = () => {
    if (senhaPastor === 'Refugio-lu-2026') {
      setPastorLogado(true)
      setTelaPastor('mensagens')
      setSenhaPastor('')
       carregarMensagensPastor()
    } else {
      alert('Senha incorreta')
    }
  }

  const formatarTempo = (dataISO: string) => {
    const diff = Date.now() - new Date(dataISO).getTime()
    const minutos = Math.floor(diff / 60000)
    if (minutos < 1) return 'agora'
    if (minutos < 60) return `há ${minutos} min`
    const horas = Math.floor(minutos / 60)
    if (horas < 24) return `há ${horas} hora${horas > 1? 's' : ''}`
    const dias = Math.floor(horas / 24)
    return `há ${dias} dia${dias > 1? 's' : ''}`
  }

  return (
    <div className="min-h-screen bg-calm-50">
      {pastorLogado && (
        <div className="fixed top-4 right-4 z-[9999] bg-amber-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg flex items-center gap-2">
          <span>✝️</span> Pastor Online
        </div>
      )}
      <AnimatePresence>
        {mostrarNotificacao && (
          <motion.div initial={{ opacity: 0, y: -50, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -50, scale: 0.9 }} className="fixed top-6 left-1/2 -translate-x-1/2 z-50 max-w-md mx-4">
            <div className="bg-white border-2 border-calm-200 text-calm-800 px-6 py-4 rounded-2xl shadow-xl">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🙏</span>
                <div>
                  <p className="font-medium text-calm-600 mb-1">Sua oração foi ouvida</p>
                  <p className="text-sm italic leading-relaxed">"{versiculoAtual}"</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence mode="wait">
        {tela === 'home' && (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen flex items-center justify-center overflow-hidden px-4">
            <div className="text-center w-full max-w-2xl">
              <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} className="text-5xl sm:text-6xl md:text-7xl font-playfair text-calm-600 mb-6">Refúgio</motion.h1>

              {nomeBiblico && (
                <div className="flex items-center justify-center gap-4 mb-6">
                  <p className="text-calm-600">Olá, {nomeBiblico}</p>
                  <button onClick={fazerLogoutRefugio} className="text-xs text-calm-400 hover:text-calm-600">Sair</button>
                </div>
              )}

              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }} className="text-lg sm:text-xl text-calm-700 font-inter mb-12 leading-relaxed">Um espaço seguro e anônimo.<br />Desabafe sem medo. Receba orações. Pr.Refúgio.</motion.p>
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }} className="flex flex-col gap-4 justify-center max-w-md mx-auto">
                <button
                  onClick={() => {
                    if (nomeBiblico) {
                      setTela('escrever')
                    } else {
                      setMostrarModalLogin(true)
                    }
                  }}
                  className="px-8 py-4 bg-calm-500 text-white text-lg rounded-xl hover:bg-calm-600 transition-colors shadow-lg w-full"
                >
                  Preciso desabafar
                </button>
                <button
                  onClick={() => {
                    if (nomeBiblico) {
                      setTela('mural')
                    } else {
                      setMostrarModalLogin(true)
                    }
                  }}
                  className="px-8 py-4 bg-white text-calm-600 text-lg rounded-xl hover:bg-calm-100 transition-colors shadow-lg border-2 border-calm-200 w-full"
                >
                  Quero orar por alguém 🙏
                </button>
                <button onClick={() => setTela('pastor')} className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-lg rounded-xl hover:from-amber-600 hover:to-amber-700 transition-colors shadow-lg w-full flex items-center justify-center gap-2"><span>✝️</span> Falar com o Pastor</button>
              </motion.div>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="mt-16 text-sm text-calm-500">Hoje, {oracoesEnviadas.toLocaleString()} orações foram enviadas</motion.p>
              {oracoesRecebidas > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4 }}
                  className="mt-6 bg-amber-50 border-amber-200 px-6 py-3 rounded-2xl inline-block"
                >
                  <p className="text-amber-700 font-medium">
                    🙏 Você recebeu {oracoesRecebidas} {oracoesRecebidas === 1? 'oração' : 'orações'}
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
        {tela === 'mural' && (
          <motion.div key="mural" initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -100 }} className="min-h-screen py-8 px-4">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-playfair text-calm-600">Mural de Orações</h2>
                <button onClick={() => setTela('home')} className="text-calm-600 hover:text-calm-700">← Voltar</button>
              </div>
              <div className="mb-6 space-y-4">
                <input type="text" value={buscaMural} onChange={(e) => setBuscaMural(e.target.value)} placeholder="Buscar por palavra-chave..." className="w-full p-3 bg-white rounded-xl border-2 border-calm-200 focus:border-calm-400 focus:outline-none text-calm-800" />
                {topHashtags.length > 0 && (
                  <div className="bg-white p-4 rounded-xl border-calm-100">
                    <p className="text-xs text-calm-500 mb-2 font-medium">FOCO DE ORAÇÃO - Mais mencionados:</p>
                    <div className="flex flex-wrap gap-2">
                      {topHashtags.map(tag => (
                        <button key={tag} onClick={() => setBuscaMural(tag)} className="text-xs px-3 py-1 bg-calm-100 text-calm-600 rounded-full hover:bg-calm-200 transition">#{tag}</button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <button onClick={() => setTela('escrever')} className="w-full mb-6 py-4 bg-white border-2 border-dashed border-calm-300 rounded-xl text-calm-500 hover:border-calm-400 hover:text-calm-600 transition">+ Escrever meu desabafo</button>
              <div className="space-y-4">
                {desabafosFiltrados.length === 0? (
                  <div className="bg-white p-8 rounded-2xl text-center text-calm-400">Nenhum desabafo encontrado</div>
                ) : (
                  desabafosFiltrados.map((desabafo, index) => {
                    const jaVotou = getOracoesVotadas().includes(desabafo.id)
                    return (
                      <motion.div key={desabafo.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="bg-white p-6 rounded-2xl shadow-md relative">
                        {pastorLogado && (<button onClick={() => deletarDesabafo(desabafo.id)} className="absolute top-3 right-3 text-red-400 hover:text-red-600 text-xs px-2 py-1 rounded hover:bg-red-50 transition" title="Apagar desabafo">✕ Apagar</button>)}
                        <p className="text-calm-800 leading-relaxed mb-4 font-inter pr-16">{desabafo.mensagem}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-calm-400">{formatarTempo(desabafo.created_at)}</span>
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleOrar(desabafo.id)}
                            disabled={jaVotou}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                              jaVotou
                             ? 'bg-green-100 text-green-700 cursor-not-allowed'
                                : 'bg-calm-500 text-white hover:bg-calm-600'
                            }`}
                          >
                            <span>{jaVotou? '🙏 Orando' : '🙏 Eu oro por você'}</span>
                            <span className="font-bold">{desabafo.oracoes}</span>
                          </motion.button>
                        </div>
                      </motion.div>
                    )
                  })
                )}
              </div>
            </div>
          </motion.div>
        )}
        {tela === 'escrever' && (
          <motion.div key="escrever" initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -100 }} className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-2xl">
              <button onClick={() => setTela('mural')} className="mb-6 text-calm-600 hover:text-calm-700">← Voltar ao mural</button>
              <h2 className="text-3xl font-playfair text-calm-600 mb-6">Desabafe aqui. Oração da confidencialidade.</h2>
              <textarea value={novoDesabafo} onChange={(e) => setNovoDesabafo(e.target.value)} placeholder="Escreva o que está no seu coração..." className="w-full h-48 p-4 bg-white rounded-xl border-2 border-calm-200 focus:border-calm-400 focus:outline-none text-calm-800 font-inter resize-none" maxLength={500} />
              <div className="flex items-center justify-between mt-4">
                <span className="text-sm text-calm-400">{novoDesabafo.length}/500 caracteres</span>
                <span className="text-sm text-calm-500">100% anônimo</span>
              </div>
              <button onClick={enviarDesabafo} disabled={novoDesabafo.trim().length < 10} className="w-full mt-6 py-4 bg-calm-500 text-white text-lg rounded-xl hover:bg-calm-600 transition disabled:bg-calm-200 disabled:cursor-not-allowed">Enviar anonimamente</button>
            </div>
          </motion.div>
        )}
        {tela === 'pastor' && (
  <motion.div key="pastor" initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -100 }} className="min-h-screen flex items-center justify-center px-4 py-8">
    <div className="w-full max-w-2xl">
      <button onClick={() => { setTela('home'); setTelaPastor('login'); setMensagemEncontrada(null); setCodigoAcompanhamento('') }} className="mb-6 text-calm-600 hover:text-calm-700">← Voltar</button>

      {!pastorLogado && telaPastor === 'login' && (
        <div className="bg-white p-8 rounded-2xl shadow-xl">
          <h2 className="text-3xl font-playfair text-calm-600 mb-2 text-center">Área do Pastor</h2>
          <p className="text-calm-500 mb-6 text-center text-sm">Acesso restrito</p>
          <input type="password" value={senhaPastor} onChange={(e) => setSenhaPastor(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && loginPastor()} placeholder="Digite a senha" className="w-full p-4 bg-calm-50 rounded-xl border-2 border-calm-200 focus:border-amber-400 focus:outline-none text-calm-800 mb-4" />
          <button onClick={loginPastor} className="w-full py-4 bg-amber-500 text-white text-lg rounded-xl hover:bg-amber-600 transition mb-4">Entrar</button>
          <button onClick={() => setTelaPastor('escrever')} className="w-full py-3 text-amber-600 hover:text-amber-700 text-sm">Sou membro e quero enviar uma mensagem →</button>
        </div>
      )}

      {telaPastor === 'escrever' && (
        <div>
          <h2 className="text-3xl font-playfair text-calm-600 mb-2">Fale com o Pastor</h2>
          <p className="text-calm-500 mb-6 text-sm">Sua mensagem é privada. Apenas o pastor terá acesso. Você receberá um código para acompanhar a resposta.</p>
          <textarea value={textoMensagemPastor} onChange={(e) => setTextoMensagemPastor(e.target.value)} placeholder="Escreva sua confissão, pedido de oração ou desabafo..." className="w-full h-48 p-4 bg-white rounded-xl border-2 border-calm-200 focus:border-amber-400 focus:outline-none text-calm-800 font-inter resize-none" maxLength={1000} />
          <div className="flex items-center justify-between mt-4">
            <span className="text-sm text-calm-400">{textoMensagemPastor.length}/1000 caracteres</span>
            <span className="text-sm text-amber-600 font-medium">🔒 Confidencial</span>
          </div>
          <button onClick={enviarMensagemPastor} disabled={textoMensagemPastor.trim().length < 10} className="w-full mt-6 py-4 bg-amber-500 text-white text-lg rounded-xl hover:bg-amber-600 transition disabled:bg-calm-200 disabled:cursor-not-allowed">Enviar ao Pastor</button>
          <button onClick={() => setTelaPastor('verResposta')} className="w-full mt-3 py-3 text-amber-600 hover:text-amber-700 text-sm border border-amber-200 rounded-xl">Já tenho um código - Ver resposta →</button>
          {pastorLogado && (<button onClick={() => setTelaPastor('mensagens')} className="w-full mt-3 py-2 text-calm-500 hover:text-calm-600 text-sm">← Voltar para mensagens</button>)}
        </div>
      )}

      {telaPastor === 'codigo' && (
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
          <div className="text-5xl mb-4">✉️</div>
          <h2 className="text-2xl font-playfair text-calm-600 mb-4">Mensagem enviada!</h2>
          <p className="text-calm-600 mb-6">Anote seu código de acompanhamento:</p>
          <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6 mb-6">
            <p className="text-3xl font-mono font-bold text-amber-700 tracking-wider">{codigoAcompanhamento}</p>
          </div>
          <p className="text-sm text-calm-500 mb-6">Use esse código em "Ver resposta do Pastor" para ler quando o pastor responder. Guarde com segurança.</p>
          <button onClick={() => { setTelaPastor('escrever'); setCodigoAcompanhamento('') }} className="w-full py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition">Entendi, anotei o código</button>
        </div>
      )}

      {telaPastor === 'verResposta' && (
        <div>
          <h2 className="text-3xl font-playfair text-calm-600 mb-6 text-center">Ver Resposta do Pastor</h2>
          {!mensagemEncontrada? (
            <div className="bg-white p-8 rounded-2xl shadow-xl">
              <input type="text" value={codigoAcompanhamento} onChange={(e) => setCodigoAcompanhamento(e.target.value.toUpperCase())} onKeyDown={(e) => e.key === 'Enter' && buscarResposta()} placeholder="Digite seu código: REFUGIO-XXXXXX" className="w-full p-4 bg-calm-50 rounded-xl border-2 border-calm-200 focus:border-amber-400 focus:outline-none text-calm-800 mb-4 text-center font-mono text-lg tracking-wider" />
              <button onClick={buscarResposta} className="w-full py-4 bg-amber-500 text-white text-lg rounded-xl hover:bg-amber-600 transition mb-4">Buscar Resposta</button>
              <button onClick={() => setTelaPastor('escrever')} className="w-full py-2 text-calm-500 hover:text-calm-600 text-sm">← Voltar</button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-calm-300">
                <p className="text-xs text-calm-400 mb-2">Sua mensagem - {mensagemEncontrada.data}</p>
                <p className="text-calm-800 leading-relaxed">{mensagemEncontrada.texto}</p>
              </div>
              {mensagemEncontrada.resposta? (
                <div className="bg-amber-50 p-6 rounded-2xl shadow-md border-l-4 border-amber-400">
                  <p className="text-xs text-amber-600 mb-2 font-medium">Resposta do Pastor - {mensagemEncontrada.dataResposta}</p>
                  <p className="text-calm-800 leading-relaxed whitespace-pre-wrap">{mensagemEncontrada.resposta}</p>
                </div>
              ) : (
                <div className="bg-white p-6 rounded-2xl text-center text-calm-400 border-2 border-dashed border-calm-200">O pastor ainda não respondeu. Ore e volte mais tarde 🙏</div>
              )}
              <button onClick={() => { setMensagemEncontrada(null); setCodigoAcompanhamento(''); setTelaPastor('escrever') }} className="w-full py-3 text-calm-500 hover:text-calm-600">← Voltar</button>
            </div>
          )}
        </div>
      )}

      {pastorLogado && telaPastor === 'mensagens' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-playfair text-calm-600">Mensagens Recebidas</h2>
            <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">{mensagensPastor.filter(m =>!m.lida &&!m.resposta).length} novas</span>
          </div>
          {mensagensPastor.length === 0? (
            <div className="bg-white p-8 rounded-2xl text-center text-calm-400">Nenhuma mensagem ainda. O Senhor está preparando corações.</div>
          ) : (
            <div className="space-y-4">
              {mensagensPastor.map((msg) => (
                <motion.div key={msg.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`bg-white p-6 rounded-2xl shadow-md border-l-4 ${ msg.lida? 'border-calm-200' : 'border-amber-400' }`}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="text-xs text-calm-400">{msg.data}</span>
                      <p className="text-xs text-amber-600 font-mono mt-1">Código: {msg.codigo}</p>
                    </div>
                    {!msg.lida &&!msg.resposta && (<span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">Nova</span>)}
                  </div>
                  <p className="text-calm-800 leading-relaxed whitespace-pre-wrap mb-4">{msg.texto}</p>
                  {msg.resposta? (
                    <div className="bg-amber-50 p-4 rounded-xl border-l-2 border-amber-300">
                      <p className="text-xs text-amber-600 mb-2">Sua resposta - {msg.dataResposta}</p>
                      <p className="text-calm-700 text-sm whitespace-pre-wrap">{msg.resposta}</p>
                    </div>
                  ) : (
                    <RespostaMensagem msgId={msg.id} onEnviar={enviarRespostaPastor} />
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  </motion.div>
)}
      </AnimatePresence>


      {mostrarModalLogin && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center px-4 z-50 overflow-y-auto py-8">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md bg-white p-6 sm:p-8 rounded-2xl shadow-xl text-center relative my-auto"
          >
            <button
              onClick={() => setMostrarModalLogin(false)}
              className="absolute top-4 right-4 text-calm-400 hover:text-calm-600 text-xl"
            >
              ✕
            </button>

            <h2 className="text-2xl sm:text-3xl font-playfair text-calm-600 mb-2">Crie seu nome</h2>
            <p className="text-calm-500 mb-6 text-sm sm:text-base">Seu anonimato bíblico</p>

            <p className="text-sm font-medium mb-3">Você é:</p>
            <div className="flex gap-3 mb-6">
              <button
                onClick={() => handleGerarNome('homem')}
                className={`flex-1 py-3 rounded-xl border-2 text-sm sm:text-base ${genero === 'homem' ? 'bg-calm-500 text-white border-calm-500' : 'bg-white border-calm-200 text-calm-600'}`}
              >
                Homem
              </button>
              <button
                onClick={() => handleGerarNome('mulher')}
                className={`flex-1 py-3 rounded-xl border-2 text-sm sm:text-base ${genero === 'mulher' ? 'bg-calm-500 text-white border-calm-500' : 'bg-white border-calm-200 text-calm-600'}`}
              >
                Mulher
              </button>
            </div>

            {nomeBiblico && (
              <>
                <p className="text-sm text-calm-500 mb-2">Seu nome será:</p>
                <h3 className="text-xl sm:text-2xl font-playfair text-calm-600 mb-3">{nomeBiblico}</h3>
                <button
                  onClick={() => genero && handleGerarNome(genero)}
                  className="text-sm text-calm-500 hover:text-calm-700 mb-4"
                >
                  Gerar outro 🎲
                </button>

                <input
                  type="password"
                  value={senhaRefugio}
                  onChange={(e) => setSenhaRefugio(e.target.value)}
                  placeholder="Crie uma senha pra voltar"
                  className="w-full mt-2 p-3 bg-calm-50 rounded-xl border-2 border-calm-200 focus:border-calm-400 focus:outline-none text-sm sm:text-base"
                />

                <button
                  onClick={fazerLoginRefugio}
                  className="w-full mt-4 py-4 bg-calm-500 text-white text-base sm:text-lg rounded-xl hover:bg-calm-600"
                >
                  Entrar no Refúgio
                </button>

                <button
                  onClick={async () => {
                    const nomeRecuperar = prompt('Digite seu nome bíblico pra recuperar:')
                    if (!nomeRecuperar) return
                    
                    const { data } = await supabase
                      .from('usuarios_refugio')
                      .select('senha')
                      .eq('nome_biblico', nomeRecuperar)
                      .maybeSingle()
                    
                    if (data) {
                      alert(`Sua senha é: ${data.senha}\n\nAnota aí e guarda bem!`)
                    } else {
                      alert('Nome não encontrado')
                    }
                  }}
                  className="w-full mt-2 text-xs text-calm-400 hover:text-calm-600"
                >
                  Esqueci minha senha
                </button>
              </>
            )}
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default App