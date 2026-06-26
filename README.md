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

Workflow: `.github/workflows/tests.yml` — execução **manual** (Actions → Run workflow).

| Job | Quando roda | Ambiente |
|-----|-------------|----------|
| **Web** | Manual | Ubuntu + Playwright headless |
| **Mobile** | Manual | macOS + emulador Android |

**Por que não roda automaticamente no push/PR?**

- **Web:** o site `practicesoftwaretesting.com` usa Cloudflare Turnstile. Runners do GitHub Actions (IPs de datacenter) são bloqueados na tela "Performing security verification", impedindo qualquer interação com a UI — inclusive busca e checkout. A suíte web foi validada **localmente** (`cd web && npm test`).
- **Mobile:** emulador Android no GitHub Actions é instável (`device not found`, boot infinito). Validado **localmente** (`cd mobile && .\scripts\run-tests.ps1`).

Relatório web (quando rodar manualmente): artifact `playwright-report`.

## Decisões técnicas

**Fluxos escolhidos** — login, busca/carrinho (web) e login, carrinho, checkout (mobile): cobrem autenticação, navegação e jornada de compra, que são os fluxos de maior risco e retorno.

**Organização** — web com Page Objects, factories e setup via API; mobile com flows + subflows reutilizáveis (`login`, `fill-shipping`, `fill-payment`).

**Dados** — centralizados em `web/.env` + constants e `mobile/constants/variables.env`; injetados nos testes via env vars.

**Estabilidade** — testes independentes (`clearState` no mobile, usuário novo via API no web); seletores por `data-test` (web) e resource-id (mobile); scroll condicional onde o teclado/botões ficam fora da tela.

**CI** — web e mobile executados localmente; workflow no GitHub Actions disponível apenas via `workflow_dispatch` (manual). Cloudflare bloqueia runners cloud no site de prática; emulador Android no runner é instável.

**Cloudflare** — o site usa proteção Cloudflare Turnstile. IPs de datacenter (GitHub Actions) recebem o desafio "Performing security verification" e o Playwright não consegue acessar a aplicação. Tentamos fallback via API + injeção de token, mas o bloqueio ocorre em todas as rotas do browser. Testes web validados localmente com sucesso.

**IA** — usada para bootstrap do projeto, exploração de seletores e debug de flows instáveis. Decisões de escopo, priorização e asserções foram revisadas manualmente.
