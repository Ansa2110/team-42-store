# Sprint 1 — Auth pages improvement

Сегодня продолжила работу над страницами авторизации и регистрации.  
После созвона с ментором стало понятнее, какие ошибки нужно исправить и что нужно привести ближе к требованиям проекта.

---

## What was done

В рамках спринта работала над auth-частью проекта:

- `AuthPage`
- `LoginForm`
- `RegisterForm`
- `AuthService`
- auth validators
- auth types
- route guard

---

## Auth pages

Доработала страницы входа и регистрации по макету:

- исправила расположение блоков;
- убрала лишний контейнер справа;
- добавила отступы между заголовками и описанием;
- оформила левую информационную часть;
- оставила место под будущую иллюстрацию;
- добавила Google и GitHub buttons;
- добавила корректные cursor states.

Стилизация сделана через Tailwind.

---

## Reactive Forms

Формы реализованы через Angular Reactive Forms.

Использовала:

- `ReactiveFormsModule`
- `FormBuilder`
- `Validators`
- `[formGroup]`
- `formControlName`
- `(ngSubmit)`
- `markAllAsTouched()`

Добавила клиентскую валидацию и вывод ошибок под полями.

---

## Login form

В форме входа реализовано:

- email;
- password;
- remember me;
- валидация email/password;
- показ ошибок;
- show/hide password;
- redirect на `/main` после успешного входа.

---

## Registration form

Форму регистрации привела к макету:

- name;
- email;
- password;
- confirm password.

Добавила:

- проверку email;
- password validation;
- confirm password validation;
- show/hide password;
- сообщения об ошибках.

---

## AuthService 

Добавила `AuthService` как подготовку под будущую backend integration.  
Сейчас используется mock logic, но позже там можно будет подключить реальные API requests.

---

## What I learned

За этот спринт лучше разобралась:

- как работают Angular Reactive Forms;
- как связываются `.ts` и `.html` через `[formGroup]`;
- как использовать `formControlName`;
- как показывать ошибки через `touched`, `invalid`, `errors`;
- как подключать Angular Material modules;
- как работает `@Output()` и `EventEmitter`;
- зачем нужен `AuthService`;
- как использовать Tailwind в Angular templates.

---

## Problems

Самым сложным было понять:

- где должна быть логика формы;
- какие файлы можно менять, чтобы не затронуть код коллег;
- как лучше организовать auth types и validators.

---

## Plans

Дальше планирую:

- оформить GitHub Project board;
- добавить 404 page;
- подготовить auth flow к подключению backend;
- позже подключить real API для login/register.

---

## Time spent

Примерно 4–5 часов.

https://github.com/Ansa2110/team-42-store/pull/12
