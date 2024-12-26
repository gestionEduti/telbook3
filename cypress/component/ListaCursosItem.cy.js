import ListaCursosItem from '../../src/components/views/Cursos/ListaCursosItem.vue'

const curso = {
  id: 1,
  anio_curso: 2025,
  rbd_establecimiento: 26005,
  sigla_nivel_curso: '1NT',
  letra_nivel_curso: 'A',
  nombre_curso: '1NTA',
}

const niveles = [
  {
    id: 1,
    created_at: '2024-11-18T22:20:32.496324+00:00',
    nombre_nivel: 'MEDIO MAYOR',
    numero_nivel: 1,
    sigla_nivel: 'MM',
    nivel_nombre_alternativo: 'MEDIO MAYOR',
  },
  {
    id: 2,
    created_at: '2024-11-18T22:23:09.374742+00:00',
    nombre_nivel: 'PRIMER NIVEL DE TRANSICION',
    numero_nivel: 2,
    sigla_nivel: '1NT',
    nivel_nombre_alternativo: 'PRE KINDER',
  },
  {
    id: 3,
    created_at: '2024-11-18T22:23:09.374742+00:00',
    nombre_nivel: 'SEGUNDO NIVEL DE TRANSICION',
    numero_nivel: 3,
    sigla_nivel: '2NT',
    nivel_nombre_alternativo: 'PRE KINDER',
  },
]

describe('ListaCursosItem.cy.ts', () => {
  it('playground', () => {
    cy.mount(ListaCursosItem, { props: { curso, niveles } })
  })
})
