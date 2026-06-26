# Desafio Mobato — QA Pleno

Automação web (Playwright) e mobile (Maestro). Pastas independentes, sem código compartilhado.

## Pré-requisitos

- Node.js 18+
- Android Studio + emulador + [My Demo App APK](https://github.com/saucelabs/my-demo-app-android/releases)
- [Maestro CLI](https://docs.maestro.dev/getting-started/installing-maestro)

## Web

```powershell
cd web
npm install
npx playwright install chromium
Copy-Item .env.example .env
npm test
```

| Teste | Fluxo |
|-------|-------|
| Login | Registro via API → login UI |
| Busca de produto | Hammer e Pliers |
| Carrinho/checkout | Add to cart → checkout completo |

Todos com tag `@smoke` — validam os fluxos principais da aplicação.

Relatório: `npx playwright show-report`

## Mobile

Detalhes em [mobile/README.md](mobile/README.md).

```powershell
cd mobile
Copy-Item .env.example .env
.\scripts\run-tests.ps1
.\scripts\show-report.ps1   # abre report.html
```

| Flow | Fluxo |
|------|-------|
| login | Login válido + inválido (detecta bug do app) |
| add-product-to-cart | Produto → carrinho → quantidade → remover |
| checkout-journey | Carrinho → shipping → pagamento → confirmação |

Todos com tag `smoke`.

Relatórios: `mobile/reports/junit.xml` e `report.html`

## CI (GitHub Actions)

Workflow em `.github/workflows/tests.yml` — roda web e mobile em push/PR.

- **Web:** Ubuntu + Playwright (headless)
- **Mobile:** emulador Android API 30 + Maestro + APK do My Demo App

Relatórios ficam disponíveis como **Artifacts** na run do Actions.

- **Web:** Ubuntu + Playwright headless
- **Mobile:** `macos-latest` + emulador Android API 29 + Maestro (mais estável que Ubuntu sem KVM)
- No CI mobile rodam só `add-product-to-cart` e `checkout-journey` — o flow `login` (cenário inválido) roda localmente e documenta bug do app

## Decisões técnicas

**Fluxos escolhidos** — login, busca/carrinho (web) e login, carrinho, checkout (mobile): cobrem autenticação, navegação e jornada de compra, que são os fluxos de maior risco e retorno.

**Organização** — web com Page Objects, factories e setup via API; mobile com flows + subflows reutilizáveis (`login`, `fill-shipping`, `fill-payment`).

**Dados** — centralizados em `web/.env` + constants e `mobile/constants/variables.env`; injetados nos testes via env vars.

**Estabilidade** — testes independentes (`clearState` no mobile, usuário novo via API no web); seletores por `data-test` (web) e resource-id (mobile); scroll condicional onde o teclado/botões ficam fora da tela.

**IA** — usada para bootstrap do projeto, exploração de seletores e debug de flows instáveis. Decisões de escopo, priorização e asserções foram revisadas manualmente.
