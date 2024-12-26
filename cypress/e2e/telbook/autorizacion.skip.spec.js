/// <reference types="cypress" />

describe('probar autenticacion', () => {
  beforeEach(() => cy.visit('http://127.0.0.1:5173/logout'))

  const adminUser = { email: 'sergrodrig@gmail.com', password: '123456' }
  const profeUser = { email: 'alberto@gmail.com', password: '123456' }

  it('deberia mostrar el menu de admin si el usuario es admin', () => {
    cy.get('input[id="email"]').type(adminUser.email)
    cy.get('input[id="password"]').type(adminUser.password)
    cy.contains('button', 'Ingresar').click()
    cy.url().should('include', '/dashboard')
    cy.get('nav').children().should('have.length', 3)
    cy.get('nav').within(() => {
      cy.get('a[href="/dashboard/cursos"]').should('exist')
      cy.get('a[href="/dashboard/matriculas"]').should('exist')
      cy.get('a[href="/dashboard/prematricula"]').should('exist')
    })
  })

  it('deberia mostrar el menu de profesores si el usuario es un profesor', () => {
    cy.get('input[id="email"]').type(profeUser.email)
    cy.get('input[id="password"]').type(profeUser.password)
    cy.contains('button', 'Ingresar').click()
    cy.url().should('include', '/dashboard')

    cy.get('nav').children().should('have.length', 2)
    cy.get('nav').within(() => {
      cy.get('a[href="/dashboard/cursos"]').should('exist')
      cy.get('a[href="/dashboard/matriculas"]').should('exist')
      cy.get('a[href="/dashboard/prematricula"]').should('not.exist')
    })
  })
})
