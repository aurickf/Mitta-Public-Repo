// @ts-nocheck
/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

/**
 * FIXME:
 * Works but no session in next-auth due to bypassing next-auth authentication flow
 * copy from below?
 */
// @ts-ignore
Cypress.Commands.add("loginByGoogleApi", () => {
  cy.log("Logging in to Google");
  cy.request({
    method: "POST",
    url: "https://www.googleapis.com/oauth2/v4/token",
    body: {
      grant_type: "refresh_token",

      client_id: Cypress.env("googleClientId"),
      client_secret: Cypress.env("googleClientSecret"),
      refresh_token: Cypress.env("googleRefreshToken"),
    },
  }).then(({ body }) => {
    /**
     * Authenticate against google
     */
    const { access_token, id_token } = body;
    cy.request({
      method: "GET",
      url: "https://www.googleapis.com/oauth2/v3/userinfo",
      headers: { Authorization: `Bearer ${access_token}` },
    }).then(({ body }) => {
      cy.log(body);
      const userItem = {
        token: id_token,
        user: {
          googleId: body.sub,
          email: body.email,
          givenName: body.given_name,
          familyName: body.family_name,
          imageUrl: body.picture,
        },
      };
      cy.log(userItem);
      window.localStorage.setItem("googleCypress", JSON.stringify(userItem));
      cy.visit("/");
    });
  });
});

/**
 * FIXME: keep stuck at login page,
 * !!!DO NOT DELETE YET!!!
 * if loginSelector is enabled, pupetteer could not found it
 * if loginSelector is disabled, stuck at google's type input email
 */
Cypress.Commands.add("loginByGoogle", () => {
  const username = Cypress.env("GOOGLE_USER");
  const password = Cypress.env("GOOGLE_PW");
  const loginUrl = Cypress.env("SITE_NAME");
  const cookieName = Cypress.env("COOKIE_NAME");
  const socialLoginOptions = {
    username,
    password,
    loginUrl,
    headless: true,
    logs: false,
    isPopup: true,
    loginSelector: "#loginWithGoogle",
    postLoginSelector: "#menuAvatar",
  };

  return cy
    .task("GoogleSocialLogin", socialLoginOptions)
    .then(({ cookies }) => {
      cy.clearCookies();

      const cookie = cookies
        .filter((cookie) => cookie.name === cookieName)
        .pop();
      if (cookie) {
        cy.setCookie(cookie.name, cookie.value, {
          domain: cookie.domain,
          expiry: cookie.expires,
          httpOnly: cookie.httpOnly,
          path: cookie.path,
          secure: cookie.secure,
        });

        Cypress.Cookies.defaults({
          preserve: cookieName,
        });

        // remove the two lines below if you need to stay logged in
        // for your remaining tests
        // cy.visit("/api/auth/signout");
        // cy.get("form").submit();
      }
    });
});

/**
 * Reference : https://github.com/nextauthjs/next-auth/discussions/2053#discussioncomment-1191016
 */
Cypress.Commands.add("_login", () => {
  cy.intercept("/api/auth/session", { fixture: "session.json" }).as("session");

  // Set the cookie for cypress.
  // It has to be a valid cookie so next-auth can decrypt it and confirm its validity.
  // This step can probably/hopefully be improved.
  // We are currently unsure about this part.
  // We need to refresh this cookie once in a while.
  // We are unsure if this is true and if true, when it needs to be refreshed.
  // Cypress.Cookies.preserveOnce("next-auth.session-token");
  // Cypress.session("next-auth.session-token");
  cy.session("next-auth.session-token", () => Cypress.env("COOKIE_SESSION"));
});

Cypress.Commands.add("login", () => {
  // Call your custom cypress command
  cy._login();
  // Visit a route in order to allow cypress to actually set the cookie
  cy.visit("/");
  // Wait until the intercepted request is ready
  cy.wait("@session");
  // This is where you can now add assertions
  // Example: provide a data-test-id on an element.
  // This can be any selector that "always and only" exists when the user is logged in
  cy.get("#menuAvatar")
    .should("exist")
    .then(() => {
      cy.log("Cypress login successful");
    });
});
