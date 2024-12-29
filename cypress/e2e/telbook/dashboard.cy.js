/// <reference types="cypress" />

describe('probar dashboard', () => {
  beforeEach(() => cy.login('sergrodrig@gmail.com', '123456'))

  it('deberia mostrar el dashboard', () => {
    cy.visit('/')
    cy.url().should('include', '/dashboard/resumen')
    cy.getBySel('dashboard-nombre-establecimiento').should('contain', 'mi mundo en palabras')
    cy.getBySel('dashboard-resumen-saludo').should('contain', 'Hola Sergio!')
  })
})
