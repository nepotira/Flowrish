// ============================================
// Listas fixas usadas nos formulários e filtros
// ============================================

export const GENEROS = [
  'Romance', 'Ficção Científica', 'Fantasia', 'Suspense', 'Terror',
  'Biografia', 'Autoajuda', 'História', 'Poesia', 'Infantil',
  'Infantojuvenil', 'Young Adult', 'Drama', 'Clássicos', 'Quadrinhos/HQ',
  'Negócios', 'Filosofia', 'Receitas',
  'Romantasia', 'Distopia', 'Thriller Psicológico', 'Mistério e Policial',
  'Ficção Histórica', 'Romance de Época', 'Ação e Aventura',
  'Ficção Contemporânea', 'Ficção Literária', 'Realismo Mágico',
  'Dark Romance', 'Ficção Erótica', 'Cozy Mystery (Mistério Aconchegante)',
  'Faroeste (Western)', 'Sátira e Humor', 'Novo Adulto (New Adult / NA)',
  'Mangá', 'Contos e Antologias', 'Crônicas', 'Memórias (Memoir)',
  'True Crime (Crimes Reais)', 'Espiritualidade e Religião'
];

export const ESTADOS_CONSERVACAO = ['Novo', 'Seminovo', 'Usado'];

// Livros cadastrados antes do suporte a múltiplos gêneros só têm o campo
// "genero" (string); os novos têm "generos" (array). Centraliza a leitura
// para o resto do app não precisar saber da diferença.
export function bookGeneros(book) {
  if (!book) return [];
  return book.generos || (book.genero ? [book.genero] : []);
}
