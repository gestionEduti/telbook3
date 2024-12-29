/// <reference types="cypress" />

describe('/cursos', () => {
  beforeEach(() => {
    cy.login('sergrodrig@gmail.com', '123456') // logearse
    cy.visit('/') // visitar la pagina
    cy.getBySel('nav-cursos').click() // hacer click en el menu cursos
    cy.url().should('include', '/dashboard/cursos')
  })

  it('debe decir que hay 8 cursos', () => {
    cy.getBySel('cursos-total-cursos').should('includes.text', '8 curso(s) en total')
  })

  it('debe decir que no hay cursos', () => {
    cy.intercept(
      'GET',
      'https://jhzweohhdshzyvjmkhce.supabase.co/rest/v1/tp_cursos?select=*',
      [],
    ).as('getCursos')
    cy.getBySel('cursos-lista').contains('No hay cursos creados')
  })
})
