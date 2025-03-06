/// <reference types="cypress" />
import produtosPage from "../support/page_objects/produtos.page"

context('Exercicio - Testes End-to-end - Fluxo de pedido', () => {
    /*  Como cliente 
        Quero acessar a Loja EBAC 
        Para fazer um pedido de 4 produtos 
        Fazendo a escolha dos produtos
        Adicionando ao carrinho
        Preenchendo todas opções no checkout
        E validando minha compra ao final */

    beforeEach(() => {
        cy.visit('/minha-conta')
    })

    it('Deve fazer um pedido na loja Ebac Shop de ponta a ponta', () => {
        let produto = 'Ajax Full-Zip Sweatshirt'
        let cor = 'Red', tamanho = 'M', quantidade = '4'
        
        //Quero acessar a Loja EBAC
        cy.fixture('perfil').then(login => {
            cy.login(login.usuario, login.senha)
        })
        cy.contains('aluno_ebac').should('be.visible')

        //Para fazer um pedido de 4 produtos
        produtosPage.visitarUrlProdutos()
        produtosPage.buscarProduto(produto)

        //Fazendo a escolha dos produtos
        //Adicionando ao carrinho
        produtosPage.addProdutoCarrinho(tamanho, cor, quantidade)
        cy.get('.woocommerce-message').should('contain', ' foram adicionados no seu carrinho.')    

        //*Conferindo os dados do pedido no cart
        cy.get('.woocommerce-message > .button').click()
        cy.get('[title="Qty"]').should('have.value', '4')
        cy.get('[data-title="Total"]').should('contain', '276,00')

        //Preenchendo todas opções no checkout
        cy.preencherDadosCheckOut()

        //E validando minha compra ao final
        cy.get('.page-title').should('have.text', 'Pedido recebido')
        cy.contains('a', 'Ajax Full-Zip Sweatshirt - M, Red').should('be.visible')
        cy.contains('td', 'Pagamento na entrega').should('be.visible')
        cy.get('.woocommerce-order-overview__total').should('contain', '276,00')
    })
})