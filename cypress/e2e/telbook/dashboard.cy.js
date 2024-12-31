/// <reference types="cypress" />

describe('probar dashboard', () => {
  beforeEach(() => {
    cy.login('sergrodrig@gmail.com', '123456') // logearse
    cy.visit('/') // visitar la pagina
    cy.url().should('include', '/dashboard/resumen')
  })

  it('deberia mostrar informacion correcta del usuario', () => {
    cy.getBySel('dashboard-nombre-establecimiento').should('contain', 'mi mundo en palabras')
    cy.getBySel('dashboard-resumen-saludo').should('contain', 'Hola Sergio!')
    cy.getBySel('dashboard-avatar-button').click()
    cy.getBySel('dashboard-avatar-nombre').should('contain', 'Sergio Rodriguez')
    cy.getBySel('dashboard-avatar-email').should('contain', 'sergrodrig@gmail.com')
  })
})
