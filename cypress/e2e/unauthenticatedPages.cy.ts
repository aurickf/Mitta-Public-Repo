// @ts-nocheck
// @ts-ignore
describe("Test login page", () => {
  beforeEach(() => {
    cy.visit("/");
  });
  it("Login page announcement", () => {
    cy.contains("Public announcement").should("be.visible");
    cy.contains("Private and public").should("be.visible");
  });
  it("Sign in with google button", () => {
    cy.get("#loginWithGoogle").click();
    cy.url().should("contains", "/auth/google");
  });
  it("Sign in with facebook button", () => {
    cy.get("#loginWithFacebook").click();
    cy.url().should("contains", "/auth/facebook");
  });
});
