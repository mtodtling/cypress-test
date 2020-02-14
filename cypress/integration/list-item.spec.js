describe('List items', () => {
    beforeEach(() => {
        cy.seedAndVisit();
    });

    it('properly displays completed items', () => {
        cy.get('.todo-list li')
            .filter('.completed')
            .should('have.length', 1)
            .and('contain', 'Eggs')
            .find('.toggle')
            .should('be.checked');
    });

    it('shows remaining todos in the footer', () => {
        cy.get('.todo-count')
            .should('contain', 3);
    });

    it('removes a todo', () => {
        cy.route({
            url: '/api/todos/1',
            method: 'DELETE',
            status: 200,
            response: {},
        });

        cy.get('.todo-list li')
            // alias which we need because cypress API calls are done asynchronously
            .as('list');

        cy.get('@list')
            .first()
            .find('.destroy')
            // we have to mock hover event
            .invoke('show')
            .click();

        cy.get('@list')
            .should('have.length', 3)
            .and('not.contain', 'Milk');
    });

    it.only('marks an incomplete item complete', () => {
        cy.fixture('todos')
            .then(todos => {
                // cypress comes with Lodash which can be accessed with Cypress._
                const target = Cypress._.head(todos);
                cy.route('PUT', `/api/todos/${target.id}`, Cypress._.merge(target, {isComplete: true}));
            });

        cy.get('.todo-list li')
            .first()
            .as('first-todo');

        cy.get('@first-todo')
            .find('.toggle')
            .click()
            .should('be.checked');

        cy.get('@first-todo')
            .should('have.class', 'completed');

        cy.get('.todo-count')
            .should('contain', 2);
    });
});