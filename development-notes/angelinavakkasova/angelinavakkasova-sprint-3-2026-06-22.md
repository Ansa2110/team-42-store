# Sprint 3 — Directives, Pipes & Forms

- **What was done:**
  Completed the authentication module for the ShopFront application. Implemented login and registration using Angular Reactive Forms with validation, integrated authentication with the DummyJSON backend through Angular HttpClient, added API error handling, authentication state management, token storage in localStorage, automatic login after successful registration, and route protection with automatic redirects. Improved the application architecture by introducing Angular InjectionToken for configuration, implementing an HTTP interceptor for authorization headers, and applying the OnPush change detection strategy to authentication components. Refined the authentication UI using Angular Material and Tailwind CSS, fixed accessibility issues by assigning unique IDs to form inputs and correctly linking labels, optimized assets, configured Google and GitHub OAuth applications, and prepared environment configuration for future production OAuth integration.

- **Problems:**
  DummyJSON does not persist registered users, making registration suitable only for demonstration purposes. GitHub OAuth cannot be fully implemented on the frontend because the OAuth token exchange requires a secure backend service and client secret. Additional work was also required to correctly configure OAuth applications, redirects, routing, and authentication flow.

- **Solutions:**
  Replaced the mock authentication logic with real HTTP requests using Angular HttpClient, implemented centralized configuration with InjectionToken, added an HTTP interceptor for authorization, improved validation and API error handling, configured Google and GitHub OAuth applications, prepared environment-based configuration, and fixed accessibility issues by assigning dedicated IDs to every form control.

- **What I learned:**
  Learned how to build a complete authentication flow in Angular using Reactive Forms, HttpClient, InjectionToken, HTTP Interceptors, OnPush change detection, route protection, token-based authentication, local storage, and centralized configuration. Also gained a deeper understanding of OAuth architecture, frontend security limitations, and the differences between Google and GitHub authentication flows.

- **Plans:**
  Continue developing the About Us page and the remaining store functionality.

- **Time spent:**
  7–9 hours

https://github.com/Ansa2110/team-42-store/pull/40
