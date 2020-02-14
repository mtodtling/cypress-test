describe('Smoke tests', () => {
    beforeEach(() => {
        // deletes everything from database before testing; not the most efficient way
        cy.request('GET', '/api/todos')
            .its('body')
            .each(todo => cy.request('DELETE', `/api/todos/${todo.id}`));
    });


    context('with no todos', () => {
        it('saves new todos', () => {
            const items = [
                {text: 'Buy milk', expectedLength: 1},
                {text: 'Buy eggs', expectedLength: 2},
                {text: 'Buy bread', expectedLength: 3}
            ];
            cy.visit('/');
            cy.server();
            cy.route('POST', '/api/todos')
                .as('create');

            cy.wrap(items)
                .each(todo => {
                    cy.focused()
                        .type(todo.text)
                        .type('{enter}');

                    // wait for the response
                    cy.wait('@create');

                    cy.get('.todo-list li')
                        .should('have.length', todo.expectedLength);
                });
        });
    });

    context('with active todos', () => {
        beforeEach(() => {
            cy.fixture('todos')
                .each(todo => {
                    const newTodo = Cypress._.merge(todo, {isComplete: false});
                    cy.request('POST', '/api/todos', newTodo);
                });
            cy.visit('/');
        });

        it('loads existing data from DB', () => {
            cy.get('.todo-list li')
                .should('have.length', 4);
        });

        it('deletes todos', () => {
            cy.server();
            cy.route('DELETE', '/api/todos/*')
                .as('delete');

            cy.get('.todo-list li')
                .each(it => {
                    cy.wrap(it)
                        .find('.destroy')
                        .invoke('show')
                        .click();

                    cy.wait('@delete');
                })
                .should('not.exist');
        });

        it('toggles todos', () => {
            const clickAndWait = it => {
                cy.wrap(it)
                    .as('item')
                    .find('.toggle')
                    .click();

                cy.wait('@update');
            };

            cy.server();
            cy.route('PUT', '/api/todos/*')
                .as('update');

            cy.get('.todo-list li')
                .each(it => {
                    clickAndWait(it);

                    cy.get('@item')
                        .should('have.class', 'completed');
                })
                .each(it => {
                    clickAndWait(it);

                    cy.get('@item')
                        .should('not.have.class', 'completed');
                });
        });
    })
});