describe('Input form', () => {
    beforeEach(() => {
        cy.seedAndVisit([]);
    });

    it('focuses input on load', () => {
        cy.focused()
            .should('have.class', 'new-todo');
    });

    it('accepts input', () => {
        const input = 'Buy milk';

        cy.get('.new-todo')
            .type(input)
            .should('have.value', input);
    });

    // used to group tests together
    context('Form submission', () => {
        beforeEach(() => {
            // starts a server that allows us to stub responses
            cy.server();
        });

        it('adds a new todo on submit', () => {
            const input = 'Buy eggs';

            // defines the request we want to handle and mocked response
            cy.route('POST', '/api/todos', {
                id: 1,
                name: input,
                isComplete: false,
            });

            cy.get('.new-todo')
                .type(input)
                .type('{enter}')
                .should('have.value', '');
            cy.get('.todo-list li')
                .should('have.length', 1)
                // and = another should
                .and('contain', input);
        });

        it('shows an error message on a failed submission', () => {
            cy.route({
                url: '/api/todos',
                method: 'POST',
                status: 500,
                response: {},
            });
            cy.get('.new-todo')
                .type('test{enter}');

            cy.get('.todo-list li')
                .should('not.exist');
            cy.get('.error')
                .should('be.visible');
        });
    });
});