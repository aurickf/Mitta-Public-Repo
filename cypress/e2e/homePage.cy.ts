// @ts-nocheck
// @ts-ignore
describe("Test home page", () => {
  before(() => {
    cy.login();
  });
  it("Home page announcement", () => {
    cy.contains("Private announcement").should("be.visible");
    cy.contains("Private and public").should("be.visible");
  });
});
