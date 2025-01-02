/// <reference types="cypress" />

describe('probar autenticacion', () => {
  beforeEach(() => cy.visit('http://127.0.0.1:5173/login'))

  const profeCredentials = { email: 'test_profesor@mail.com', password: '123456' }
  const sinPerfilCredentials = { email: 'test_no_profile@mail.com', password: '123456' }

  it('deberia mostrar un error si los campos estan vacios', () => {
    cy.contains('button', 'Ingresar').click()
    cy.get('[data-message-type="validation"]').should('contain', 'Email es requerido')
    cy.get('[data-message-type="validation"]').should('contain', 'Contraseña es requerido')
    cy.get('[data-message-type="ui"]').should(
      'contain',
      'Discúlpe, los campos no fueron completados correctamente.',
    )
  })

  it('deberia mostrar un error si el campo email esta vacio', () => {
    cy.get('input[id="password"]').type(profeCredentials.password)
    cy.contains('button', 'Ingresar').click()
    cy.get('[data-message-type="validation"]').should('contain', 'Email es requerido')
    cy.get('[data-message-type="ui"]').should(
      'contain',
      'Discúlpe, los campos no fueron completados correctamente.',
    )
  })

  it('deberia mostrar un error si el campo contraseña esta vacio', () => {
    cy.get('input[id="email"]').type(profeCredentials.email)
    cy.contains('button', 'Ingresar').click()
    cy.get('[data-message-type="validation"]').should('contain', 'Contraseña es requerido')
    cy.get('[data-message-type="ui"]').should(
      'contain',
      'Discúlpe, los campos no fueron completados correctamente.',
    )
  })

  it('deberia mostrar un toast de error si el email ó contraseña es incorrecto', () => {
    cy.get('input[id="email"]').type(profeCredentials.email)
    cy.get('input[id="password"]').type(profeCredentials.password + 'wrong')
    cy.contains('button', 'Ingresar').click({ force: true })
    cy.get('ol>li[role=status]>div') // Select the parent toast container
      .should('be.visible')
      .should('contain', 'Email ó contraseña incorrectos') // Ensure the toast container is visible
    cy.url().should('include', '/login')
    cy.url().should('not.include', '/dashboard')
  })

  it('deberia mostrar un toast de error si el usuario existe pero no tiene perfil', () => {
    cy.get('input[id="email"]').type(sinPerfilCredentials.email)
    cy.get('input[id="password"]').type(sinPerfilCredentials.password)
    cy.contains('button', 'Ingresar').click()
    cy.get('ol>li[role=status]>div') // Select the parent toast container
      .should('be.visible')
      .should('contain', 'Tu usuario no esta creado correctamente') // Ensure the toast container is visible
    cy.url().should('include', '/login')
    cy.url().should('not.include', '/dashboard')
  })

  it('deberia loguearse exitosamente', () => {
    cy.get('input[id="email"]').type(profeCredentials.email)
    cy.get('input[id="password"]').type(profeCredentials.password)
    cy.contains('button', 'Ingresar').click({ force: true })
    cy.url().should('not.include', '/login')
    cy.url().should('include', '/dashboard')
  })
})
