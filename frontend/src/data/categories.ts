export interface SubCategory {
  name: string
}

export interface MainCategory {
  name: string
  sub: SubCategory[]
}

export const CATEGORIES: MainCategory[] = [
  {
    name: 'Brincos',
    sub: [
      { name: 'BRINCOS COM ZIRCÔNIA' },
      { name: 'BRINCOS INFANTIS' },
      { name: 'BRINCOS DE BOLA' },
      { name: 'PIERCING FAKE/PRESSÃO' },
      { name: 'BRINCOS FORMATO CORAÇÃO' },
      { name: 'BRINCOS EAR CUFF' },
      { name: 'BRINCO PÉROLA' },
      { name: 'BRINCO INFINITO' },
      { name: 'BRINCO SEGUNDO OU TERCEIRO FURO' },
      { name: 'KIT DE BRINCOS' },
      { name: 'BRINCO RELIGIOSO' },
      { name: 'COLEÇÃO REENCONTRO' },
    ],
  },
  {
    name: 'Argolas',
    sub: [
      { name: 'ARGOLAS PARA CARTILAGEM' },
      { name: 'ARGOLA CORAÇÃO' },
      { name: 'ARGOLA INFANTIL' },
      { name: 'ARGOLA COM RHODIUM' },
    ],
  },
  {
    name: 'Anéis',
    sub: [
      { name: 'ANEL SOLITÁRIO' },
      { name: 'ANEL DE CORAÇÃO' },
      { name: 'ANEL INFINITO' },
      { name: 'ANEL APARADOR' },
      { name: 'ANEL INFANTIL' },
      { name: 'ANEL PEDRA VERDE' },
      { name: 'ANEL RELIGIOSO' },
      { name: 'ALIANÇA' },
    ],
  },
  {
    name: 'Correntes',
    sub: [
      { name: 'Correntes Femininas' },
      { name: 'Correntes Masculinas' },
      { name: 'Correntes Unissex' },
    ],
  },
  {
    name: 'Pulseiras',
    sub: [
      { name: 'Pulseiras Femininas' },
      { name: 'Pulseiras Masculinas' },
      { name: 'Pulseiras Unissex' },
    ],
  },
  {
    name: 'Alianças',
    sub: [],
  },
  {
    name: 'Kits Brincos',
    sub: [],
  },
]
