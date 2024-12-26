/// <reference types="cypress" />

const adminCredentials = { email: 'sergrodrig@gmail.com', password: '123456' }
const profeCredentials = { email: 'alberto@gmail.com', password: '123456' }

describe('probar pagina matriculas', () => {
  beforeEach(() => {
    cy.visit('http://127.0.0.1:5173/login')
    cy.get('input[id="email"]').type(adminCredentials.email)
    cy.get('input[id="password"]').type(adminCredentials.password)
    cy.contains('button', 'Ingresar').click()
    cy.url().should('include', '/dashboard/resumen')
    cy.visit('http://127.0.0.1:5173/dashboard/matriculas')
    cy.url().should('include', '/dashboard/matriculas')
  })

  it('deberia mostrar la pagina matriculas', () => {
    cy.get('main').should('exist').should('contain', 'Matriculas')
  })

  it('deberia mostrar una tabla de alumnos', () => {
    cy.url().should('include', '/dashboard/matriculas')
    cy.get('table').should('exist')
  })
})

describe.only('probar funcionalidades como admin', () => {
  beforeEach(() => {
    cy.visit('http://127.0.0.1:5173/logout')
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
