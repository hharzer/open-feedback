import { stringGenerator } from '../../utils/generateString'

describe('Single talk', function() {
    it('Check that detail & vote item are displayed correctly', function() {
        cy.visitFeedbackProject('2019-06-28/0')

        cy.get('h2')
            .parent()
            .should('contain', 'Un talk super bien')
            .should('contain', 'Friday, June 28')
            .should('contain', '9:00')
            .should('contain', '9:50')
            .should('contain', 'Pierre')

        cy.get('img[alt="Pierre"]').should(
            'have.attr',
            'src',
            'https://randomuser.me/api/portraits/men/32.jpg'
        )

        cy.get('.MuiGrid-root')
            .first()
            .children()
            .should('have.length', 4)

        cy.get('.MuiGrid-root')
            .first()
            .children()
            .should('contain', 'Trop de code')
            .should('contain', 'Super intéressant')
            .should('contain', 'Une petite pépite')
    })

    it('Check that boolean vote does work (increment/decrement count)', function() {
        cy.visitFeedbackProject('2019-06-28/0', {
            clearUserSession: true,
        })

        // to test if this help fixing this random test
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(3000)
        const voteButtonText = 'Trop de code'

        cy.getVoteCountData(voteButtonText).then(originalVoteCount => {
            cy.contains(voteButtonText)
                .parent()
                .click()

            cy.getVoteCountData(voteButtonText).should(voteCount => {
                expect(voteCount, 'Vote count incremented').to.equal(
                    originalVoteCount + 1
                )
            })

            // eslint-disable-next-line cypress/no-unnecessary-waiting
            cy.wait(3000)
            cy.contains(voteButtonText)
                .parent()
                .click()

            cy.getVoteCountData(voteButtonText).should(voteCount => {
                expect(voteCount, 'Vote count decremented').to.equal(
                    originalVoteCount
                )
            })
        })
    })

    it('Check that text vote does work (post, edit and delete)', function() {
        cy.visitFeedbackProject('2019-06-28/0', {
            clearUserSession: true,
        })

        const inputText = stringGenerator()
        const textEdited = stringGenerator()
        const voteTextAreaSelector = 'textarea[placeholder="Your answer"]'

        cy.get(voteTextAreaSelector).type(inputText)
        cy.contains('Save').click()
        cy.get('.comments').should('contain', inputText)

        cy.get(voteTextAreaSelector).type(textEdited)
        cy.contains('Update').click()
        cy.get('.comments').should('contain', inputText + textEdited)

        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(500)
        cy.contains('Delete').click()
        cy.get('.comments').should('not.contain', inputText + textEdited)
    })
})
