/// <reference types="cypress" />

const interceptUrl = 'https://*.supabase.co/rest/v1/tp_cursos*'

const niveles = [
  { sigla: 'MM', nombre: 'medio mayor', cursos: ['A', 'B', 'C'] },
  { sigla: '1NT', nombre: 'primer nivel de transicion', cursos: ['A', 'B'] },
  { sigla: '2NT', nombre: 'segundo nivel de transicion', cursos: ['A'] },
]

describe('/cursos', () => {
  beforeEach(() => {
    cy.login('sergrodrig@gmail.com', '123456') // logearse
    cy.visit('/') // visitar la pagina
    cy.getBySel('nav-cursos').click() // hacer click en el menu cursos
    cy.url().should('include', '/dashboard/cursos')
  })

  it('deben haber 3 cursos del mismo nivel', () => {
    const assertCursos = 3
    const assertNiveles = 1
    cy.intercept('GET', interceptUrl, { fixture: 'cursos.json' }).as('getCursos')
    // se ven 1 nivel solamente
    cy.getBySel('cursos-card-content').children().should('have.length', assertNiveles)
    // en cada nivel...
    cy.getBySel('cursos-card-content')
      .children()
      .each(($nivel, nivelIndex) => {
        const siglaNivel = niveles[nivelIndex].sigla // MM
        const nombreNivel = niveles[nivelIndex].nombre // medio mayor
        const cursosNivel = niveles[nivelIndex].cursos // ['A', 'B', 'C']
        const cantidadCursosNivel = niveles[nivelIndex].cursos.length // 3
        // tiene el nombre que corresponde
        cy.wrap($nivel).find('p').should('have.text', nombreNivel)
        // tiene la cantidad de cursos que corresponde
        cy.wrap($nivel).find('li').children().should('have.length', cantidadCursosNivel)
        cy.wrap($nivel)
          .find('li')
          .children()
          .each(($curso, cursoIndex) => {
            // tiene el link q corresponde
            cy.wrap($curso).should(
              'have.attr',
              'href',
              `/dashboard/cursos/${siglaNivel}/${cursosNivel[cursoIndex]}`,
            )
            cy.wrap($curso).should('have.text', cursosNivel[cursoIndex])
          })
      })
    // dice que hay 3 cursos en total en el footer del Card
    cy.getBySel('cursos-total-cursos').should('includes.text', `${assertCursos} curso(s) en total`)
  })

  it('deben haber 5 cursos de 2 niveles distintos', () => {
    const assertCursos = 5
    const assertNiveles = 2
    cy.intercept('GET', interceptUrl, { fixture: 'cursos2.json' }).as('getCursos')
    // se ven 1 nivel solamente
    cy.getBySel('cursos-card-content').children().should('have.length', assertNiveles)
    // en cada nivel...
    cy.getBySel('cursos-card-content')
      .children()
      .each(($nivel, nivelIndex) => {
        const siglaNivel = niveles[nivelIndex].sigla // MM
        const nombreNivel = niveles[nivelIndex].nombre // medio mayor
        const cursosNivel = niveles[nivelIndex].cursos // ['A', 'B', 'C']
        const cantidadCursosNivel = niveles[nivelIndex].cursos.length // 3
        // tiene el nombre que corresponde
        cy.wrap($nivel).find('p').should('have.text', nombreNivel)
        // tiene la cantidad de cursos que corresponde
        cy.wrap($nivel).find('li').children().should('have.length', cantidadCursosNivel)
        cy.wrap($nivel)
          .find('li')
          .children()
          .each(($curso, cursoIndex) => {
            // tiene el link q corresponde
            cy.wrap($curso).should(
              'have.attr',
              'href',
              `/dashboard/cursos/${siglaNivel}/${cursosNivel[cursoIndex]}`,
            )
            cy.wrap($curso).should('have.text', cursosNivel[cursoIndex])
          })
      })
    // dice que hay 5 cursos en total en el footer del Card
    cy.getBySel('cursos-total-cursos').should('includes.text', `${assertCursos} curso(s) en total`)
  })

  it('deben haber 6 cursos de 3 niveles distintos', () => {
    const assertCursos = 6
    const assertNiveles = 3
    cy.intercept('GET', interceptUrl, { fixture: 'cursos3.json' }).as('getCursos')
    // se ven 1 nivel solamente
    cy.getBySel('cursos-card-content').children().should('have.length', assertNiveles)
    // en cada nivel...
    cy.getBySel('cursos-card-content')
      .children()
      .each(($nivel, nivelIndex) => {
        const siglaNivel = niveles[nivelIndex].sigla // MM
        const nombreNivel = niveles[nivelIndex].nombre // medio mayor
        const cursosNivel = niveles[nivelIndex].cursos // ['A', 'B', 'C']
        const cantidadCursosNivel = niveles[nivelIndex].cursos.length // 3
        // tiene el nombre que corresponde
        cy.wrap($nivel).find('p').should('have.text', nombreNivel)
        // tiene la cantidad de cursos que corresponde
        cy.wrap($nivel).find('li').children().should('have.length', cantidadCursosNivel)
        cy.wrap($nivel)
          .find('li')
          .children()
          .each(($curso, cursoIndex) => {
            // tiene el link q corresponde
            cy.wrap($curso).should(
              'have.attr',
              'href',
              `/dashboard/cursos/${siglaNivel}/${cursosNivel[cursoIndex]}`,
            )
            cy.wrap($curso).should('have.text', cursosNivel[cursoIndex])
          })
      })
    // dice que hay 6 cursos en total en el footer del Card
    cy.getBySel('cursos-total-cursos').should('includes.text', `${assertCursos} curso(s) en total`)
  })

  it('debe decir que no hay cursos', () => {
    cy.intercept('GET', interceptUrl, []).as('getCursos')
    // dice que hay 0 cursos en total en el footer del Card
    cy.getBySel('cursos-card-content').contains('No hay cursos creados')
  })
})
