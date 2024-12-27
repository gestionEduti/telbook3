/// <reference types="cypress" />

describe('probar dashboard', () => {
  beforeEach(() => cy.login('test_profesor@mail.com', '123456'))

  it('deberia mostrar el dashboard', () => {
    cy.url().should('include', '/dashboard/resumen')
    cy.getBySel('resumen-h1').should('contain', 'Hola')
  })
})
