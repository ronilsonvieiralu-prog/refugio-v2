// src/nomesBiblicos.ts
import { supabase } from './lib/supabase'

export const nomesHomem = [
  'Pedro', 'Paulo', 'João', 'Davi', 'Lucas', 'José', 'Moisés', 'Abraão',
  'Isaac', 'Jacó', 'Samuel', 'Daniel', 'Elias', 'Mateus', 'Marcos', 'André',
  'Filipe', 'Tomé', 'Bartolomeu', 'Tiago', 'Simão', 'Tadeu', 'Zaqueu',
  'Jonas', 'Josué', 'Calebe', 'Gideão', 'Sansão', 'Salomão', 'Ezequias',
  'Noé', 'Enoque', 'Abel', 'Seth', 'Melquisedeque', 'Natanael', 'Estevão',
  'Cornélio', 'Timóteo', 'Tito'
];

export const nomesMulher = [
  'Maria', 'Ana', 'Rute', 'Ester', 'Sara', 'Débora', 'Raquel', 'Marta',
  'Rebeca', 'Lia', 'Miriam', 'Noemi', 'Abigail', 'Priscila', 'Joana',
  'Isabel', 'Madalena', 'Eva', 'Dalila', 'Judite', 'Susana', 'Tamar',
  'Dorcas', 'Lídia', 'Febe', 'Cloé', 'Evódia', 'Síntique', 'Rode',
  'Safira', 'Betânia', 'Rosa', 'Oliva', 'Hadassa', 'Séfora'
];

export const cidadesBiblicas = [
  'de Jerusalém', 'de Nazaré', 'de Belém', 'de Cafarnaum', 'de Jericó', 
  'de Betânia', 'de Samaria', 'da Galileia', 'de Corinto', 'de Éfeso',
  'de Antioquia', 'de Damasco', 'de Hebrom', 'de Caná', 'do Egito',
  'de Sião', 'de Betsaida', 'de Jope', 'de Tiberíades', 'de Cesaréia',
  'de Filipos', 'de Tessalônica', 'de Atenas', 'de Roma', 'de Nínive',
  'do Jordão', 'do Monte Sinai', 'do Carmelo', 'de Emaús', 'de Sarom'
];

export const titulosBiblicos = [
  'o Justo', 'o Fiel', 'o Pacífico', 'o Sábio', 'o Forte',
  'o Manso', 'o Servo', 'o Peregrino', 'o Vigilante', 'o Consolado',
  'da Esperança', 'da Fé', 'da Paz', 'da Luz', 'da Verdade', 'da Graça'
];

// GERA UM NOME ALEATÓRIO SEM CHECAR
function sortearNome(genero: 'homem' | 'mulher'): string {
  const listaNomes = genero === 'homem'? nomesHomem : nomesMulher;
  const nome = listaNomes[Math.floor(Math.random() * listaNomes.length)];
  
  // 70% cidade, 20% título, 10% nome composto
  const tipo = Math.random();
  
  if (tipo < 0.1) {
    const nome2 = listaNomes[Math.floor(Math.random() * listaNomes.length)];
    const cidade = cidadesBiblicas[Math.floor(Math.random() * cidadesBiblicas.length)];
    return nome!== nome2 ? `${nome} ${nome2} ${cidade}` : `${nome} ${cidade}`;
  } else if (tipo < 0.3) {
    const titulo = titulosBiblicos[Math.floor(Math.random() * titulosBiblicos.length)];
    return `${nome} ${titulo}`;
  } else {
    const cidade = cidadesBiblicas[Math.floor(Math.random() * cidadesBiblicas.length)];
    return `${nome} ${cidade}`;
  }
}

// GERA NOME ÚNICO - CHECA NO BANCO ANTES
export async function gerarNomeBiblicoUnico(genero: 'homem' | 'mulher'): Promise<string> {
  let tentativas = 0;
  const maxTentativas = 50; // Evita loop infinito
  
  while (tentativas < maxTentativas) {
    const nomeSorteado = sortearNome(genero);
    
    // Checa se já existe no Supabase
    const { data } = await supabase
      .from('usuarios_refugio')
      .select('nome_biblico')
      .eq('nome_biblico', nomeSorteado)
      .single();
    
    // Se não encontrou, pode usar
    if (!data) {
      return nomeSorteado;
    }
    
    tentativas++;
  }
  
  // Se tentou 50x e tudo tá usado, adiciona número no final
  const nomeBase = sortearNome(genero);
  const numero = Math.floor(Math.random() * 999);
  return `${nomeBase} ${numero}`;
}