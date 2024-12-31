/// <reference types="cypress" />

const interceptUrl = 'https://*.supabase.co/rest/v1/tp_cursos*'

const niveles = [
  { nombre: 'medio mayor', cursos: 3 },
  { nombre: 'primer nivel de transicion', cursos: 2 },
  { nombre: 'segundo nivel de transicion', cursos: 1 },
]

describe('/cursos', () => {
  beforeEach(() => {
    cy.login('sergrodrig@gmail.com', '123456') // logearse
    cy.visit('/') // visitar la pagina
    cy.getBySel('nav-cursos').click() // hacer click en el menu cursos
    cy.url().should('include', '/dashboard/cursos')
  })

  it('deben haber 3 cursos del mismo nivel', () => {
    cy.intercept('GET', interceptUrl, { fixture: 'cursos.json' }).as('getCursos')
    // se ven 1 nivel solamente
    cy.getBySel('cursos-card-content').children().should('have.length', 1)
    // en cada nivel...
    cy.getBySel('cursos-card-content')
      .children()
      .each(($child, index) => {
        console.log(`nivel ${index} children ${$child}`)
        // tiene el nombre que corresponde
        cy.wrap($child).find('p').should('have.text', niveles[index].nombre)
        // tiene la cantidad de cursos que corresponde
        cy.wrap($child).find('li').children().should('have.length', niveles[index].cursos)
      })
    // dice que hay 3 cursos en total en el footer del Card
    cy.getBySel('cursos-total-cursos').should('includes.text', '3 curso(s) en total')
  })

  it('deben haber 4 cursos de 2 niveles distintos', () => {
    cy.intercept('GET', interceptUrl, { fixture: 'cursos2.json' }).as('getCursos')
    // se ven 2 niveles solamente
    cy.getBySel('cursos-card-content').children().should('have.length', 2)
    // en cada nivel...
    cy.getBySel('cursos-card-content')
      .children()
      .each(($child, index) => {
        // tiene el nombre que corresponde
        cy.wrap($child).find('p').should('have.text', niveles[index].nombre)
        // tiene la cantidad de cursos que corresponde
        cy.wrap($child).find('li').children().should('have.length', niveles[index].cursos)
      })
    // dice que hay 4 cursos en total en el footer del Card
    cy.getBySel('cursos-total-cursos').should('includes.text', '5 curso(s) en total')
  })

  it('deben haber 5 cursos de 3 niveles distintos', () => {
    cy.intercept('GET', interceptUrl, { fixture: 'cursos3.json' }).as('getCursos')
    // se ven 2 niveles solamente
    cy.getBySel('cursos-card-content').children().should('have.length', 3)
    // en cada nivel...
    cy.getBySel('cursos-card-content')
      .children()
      .each(($child, index) => {
        // tiene el nombre que corresponde
        cy.wrap($child).find('p').should('have.text', niveles[index].nombre)
        // tiene la cantidad de cursos que corresponde
        cy.wrap($child).find('li').children().should('have.length', niveles[index].cursos)
      })
    // dice que hay 5 cursos en total en el footer del Card
    cy.getBySel('cursos-total-cursos').should('includes.text', '6 curso(s) en total')
  })

  it('debe decir que no hay cursos', () => {
    cy.intercept('GET', interceptUrl, []).as('getCursos')
    // dice que hay 0 cursos en total en el footer del Card
    cy.getBySel('cursos-card-content').contains('No hay cursos creados')
  })
})
