/// <reference types="cypress" />

const adminCredentials = { email: 'test_admin@mail.com', password: '123456' }
const profeCredentials = { email: 'test_profesor@mail.com', password: '123456' }
const sinPerfilCredentials = { email: 'test_no_profile@mail.com', password: '123456' }

describe('probar pagina matriculas', () => {
  beforeEach(() => {
    cy.login(profeCredentials.email, profeCredentials.password)
    cy.url().should('include', '/dashboard/resumen')
    cy.visit('http://127.0.0.1:5173/dashboard/matriculas')
    cy.url().should('include', '/dashboard/matriculas')

    // cy.visit('http://127.0.0.1:5173/login')
    // cy.get('input[id="email"]').type(profeCredentials.email)
    // cy.get('input[id="password"]').type(profeCredentials.password)
    // cy.contains('button', 'Ingresar').click({ force: true })
    // cy.url().should('include', '/dashboard/resumen')
    // cy.visit('http://127.0.0.1:5173/dashboard/matriculas')
    // cy.url().should('include', '/dashboard/matriculas')
  })

  it.only('deberia mostrar la pagina matriculas', () => {
    cy.get('main').should('exist').should('contain', 'Matriculas')
  })

  it('deberia mostrar una tabla de alumnos', () => {
    cy.url().should('include', '/dashboard/matriculas')
    cy.get('table').should('exist')
  })
})

describe('probar funcionalidades como admin', () => {
  beforeEach(() => {
    cy.visit('http://127.0.0.1:5173/login')
    cy.get('input[id="email"]').type(adminCredentials.email)
    cy.get('input[id="password"]').type(adminCredentials.password)
    cy.contains('button', 'Ingresar').click()
    cy.url().should('include', '/dashboard/resumen')
    cy.visit('http://127.0.0.1:5173/dashboard/matriculas')
    cy.url().should('include', '/dashboard/matriculas')
  })

  it('deberia mostrar 2 botones si es admin', () => {
    cy.get('button').contains('Nuevo alumno').should('exist')
    cy.get('button').contains('Descargar').should('exist')
  })
})

describe('probar funcionalidades como usuario', () => {
  beforeEach(() => {
    cy.visit('http://127.0.0.1:5173/login')
    cy.get('input[id="email"]').type(profeCredentials.email)
    cy.get('input[id="password"]').type(profeCredentials.password)
    cy.contains('button', 'Ingresar').click()
    cy.url().should('include', '/dashboard/resumen')
    cy.visit('http://127.0.0.1:5173/dashboard/matriculas')
    cy.url().should('include', '/dashboard/matriculas')
  })

  it('deberia mostrar un mensaje si es que no hay alumnos', () => {
    cy.get('main').should('exist').should('contain', 'No hay alumnos matriculados.') // Check message
  })

  it('deberia mostrar solo 1 boton si es usuario', () => {
    cy.get('button').contains('Nuevo alumno').should('exist')
    cy.get('button').contains('Descargar').should('not.exist')
  })
})
