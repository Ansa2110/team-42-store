# Sprint 4: HTTP, RxJS & Testing

- **What was done:**  
  Implemented a new **About Us** page for the ShopFront application. Created a responsive page with a hero section describing the company, a statistics block highlighting key store metrics, and a developers section introducing the project team with GitHub profile links. Added a new `/about` route, integrated the page into the application's navigation by updating the header, and ensured that it is displayed within the common layout together with the shared header and footer. Built the page using Angular standalone components, Tailwind CSS utility classes.

- **Problems:**  
  While implementing the page, it was necessary to integrate the new route into the existing routing structure without affecting the shared layout. Another challenge was adapting the design mockup to the existing design system while maintaining responsiveness and consistency across different screen sizes. During development, several layout issues appeared due to spacing, borders, and responsive behavior, requiring additional refinement.

- **Solutions:**  
  Configured a dedicated route for the About page and connected it through the application's header navigation. Recreated the design using Tailwind CSS instead of custom component styles to keep the implementation consistent with the project. Reused the existing layout so that the page automatically inherits the common header and footer. Improved responsiveness using Tailwind's breakpoint utilities and organized the component data into typed collections for statistics and developers.

- **What I learned:**  
  Gained more experience working with Angular standalone components, routing configuration, and integrating new pages into an existing application architecture. Improved my understanding of building responsive layouts with Tailwind CSS, organizing static component data using TypeScript interfaces, and using ChangeDetectionStrategy.OnPush to optimize component rendering.

- **Plans:**  
  Continue improving the ShopFront application by implementing additional pages and features, integrating backend functionality where required, improving accessibility, and expanding automated testing coverage for newly added components.

- **Time spent:**  
  ~3–4 hours.

https://github.com/Ansa2110/team-42-store/pull/43

# Code Review — Team Collaboration

Today I reviewed my teammates' Pull Requests and analyzed their implementation from both a functional and code quality perspective. I examined the structure of Angular components, the correct usage of Angular Signals, TypeScript typing, Angular templates, routing, and the organization of styles.

During the review, I identified several issues that could affect maintainability or lead to runtime problems:

- incorrect TypeScript types in filter handlers (`string` used instead of `number`);
- unused imports and methods that increased code complexity;
- incorrect template bindings (using `src="src"` instead of `[src]="src"`);
- invalid CSS properties such as `width: 1fr`;
- duplicated CSS variables and outdated Tailwind directives;
- numerous placeholder links in the footer that pointed to non-existent pages.

For every issue I found, I left review comments explaining both the problem and the reasoning behind the proposed solution. I also investigated IDE warnings to distinguish actual code issues from editor-specific suggestions, helping ensure that only meaningful changes were requested.

## What I learned

- How to perform effective code reviews and evaluate the quality of other developers' code.
- What aspects of Angular components and templates deserve the most attention during review.
- How to identify TypeScript typing issues before they become runtime errors.
- How to analyze IDE warnings and distinguish real problems from less significant recommendations.
- The importance of maintaining a consistent coding style and avoiding temporary placeholders in production-ready Pull Requests.

## Conclusion

Reviewing other developers' code helped me gain a deeper understanding of the project's architecture, recognize common implementation mistakes, and learn from the solutions proposed by my teammates. Code Review proved to be valuable not only for improving the overall quality of the project but also for my own professional growth as a developer.

---

### Personal Reflection

As the sprint was coming to an end, it became noticeable that several teammates gradually stepped away from development. This made the remaining work both more challenging and, honestly, a little discouraging, since the project had started with active collaboration.

Despite that, I continued working on my own tasks, reviewing teammates' code, and helping maintain the overall quality of the project. I hope that the team members who became inactive will be able to return so that we can successfully complete the project together.
