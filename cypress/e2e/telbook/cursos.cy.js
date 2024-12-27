/// <reference types="cypress" />

describe('CursosView', () => {
  beforeEach(() => {
    cy.login('sergrodrig@gmail.com', '123456')
    cy.getBySel('nav-cursos').click()
    cy.url().should('include', '/dashboard/cursos')
  })

  it('debe mostrar los 12 cursos de 26005', () => {
    cy.getBySel('cursos-lista').within(() => {
      cy.get('ul').children().should('have.length', 12)
    })
  })

  it('debe mostrar una lista con 3 cursos', () => {
    cy.intercept('GET', 'https://jhzweohhdshzyvjmkhce.supabase.co/rest/v1/tp_cursos?select=*', {
      fixture: 'cursos.json',
    }).as('getCursos')
    cy.getBySel('cursos-lista').within(() => {
      cy.get('ul').children().should('have.length', 3)
    })
  })

  it('debe mostrar un mensaje de que no hay cursos', () => {
    cy.intercept(
      'GET',
      'https://jhzweohhdshzyvjmkhce.supabase.co/rest/v1/tp_cursos?select=*',
      [],
    ).as('getCursos')
    cy.getBySel('cursos-lista').contains('No hay cursos creados')
  })
})
