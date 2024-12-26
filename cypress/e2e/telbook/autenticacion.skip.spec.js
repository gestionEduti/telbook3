/// <reference types="cypress" />

describe('probar autenticacion', () => {
  beforeEach(() => cy.visit('http://127.0.0.1:5173/logout'))

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
    cy.get('input[id="password"]').type('123456')
    cy.contains('button', 'Ingresar').click()
    cy.get('[data-message-type="validation"]').should('contain', 'Email es requerido')
    cy.get('[data-message-type="ui"]').should(
      'contain',
      'Discúlpe, los campos no fueron completados correctamente.',
    )
  })

  it('deberia mostrar un error si el campo email es invalido') // TODO

  it('deberia mostrar un error si el campo contraseña esta vacio', () => {
    cy.get('input[id="email"]').type('sergrodrig@gmail.com')
    cy.contains('button', 'Ingresar').click()
    cy.get('[data-message-type="validation"]').should('contain', 'Contraseña es requerido')
    cy.get('[data-message-type="ui"]').should(
      'contain',
      'Discúlpe, los campos no fueron completados correctamente.',
    )
  })

  it.only('deberia loguearse exitosamente', () => {
    cy.get('input[id="email"]').type('sergrodrig@gmail.com')
    cy.get('input[id="password"]').type('123456')
    cy.contains('button', 'Ingresar').click()
    cy.url().should('not.include', '/login')
    cy.url().should('include', '/dashboard')
  })

  it.only('deberia mostrar un toast de error si el email ó contraseña es incorrecto', () => {
    cy.get('input[id="email"]').type('sergrodrig@gmail.com')
    cy.get('input[id="password"]').type('wrongpassword')
    cy.contains('button', 'Ingresar').click()
    cy.get('ol>li[role=status]>div') // Select the parent toast container
      .should('be.visible')
      .should('contain', 'Email ó contraseña incorrectos') // Ensure the toast container is visible
    cy.url().should('include', '/login')
    cy.url().should('not.include', '/dashboard')
  })
})
