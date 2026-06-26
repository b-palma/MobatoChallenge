# Mobile — Maestro

Flows YAML para o [Sauce Labs My Demo App](https://github.com/saucelabs/my-demo-app-android). Isolado da pasta `web/`.

## Setup

1. Emulador ou device com USB debugging
2. APK instalado: `adb install my-demo-app.apk`
3. Maestro CLI no PATH ([instalação](https://docs.maestro.dev/getting-started/installing-maestro))
4. `Copy-Item .env.example .env`

## Rodar

```powershell
.\scripts\run-tests.ps1                  # suíte completa
.\scripts\run-tests.ps1 -Flow login.yaml # um flow
.\scripts\run-tests.ps1 -Tag smoke       # por tag
.\scripts\show-report.ps1                # abre report.html
```

## Relatórios (`reports/`)

| Arquivo | Uso |
|---------|-----|
| `junit.xml` | CI/CD |
| `report.html` | visual (steps + screenshots de falha) |

`-Report html` ou `-Report junit` gera só um formato (mais rápido).

## Estrutura

```
flows/       → jornadas (login, carrinho, checkout)
subflows/    → login, shipping, payment (reuso)
constants/   → variables.env (labels, credenciais, checkout)
scripts/     → run-tests.ps1, show-report.ps1
```

Cada flow usa `launchApp: clearState: true` — estado limpo a cada execução.

## Flows

| Flow | Valida |
|------|--------|
| `login` | Login válido + inválido (falha se app aceitar credencial falsa) |
| `add-product-to-cart` | Adicionar, alterar quantidade, remover item |
| `checkout-journey` | Shipping → pagamento → pedido confirmado |

Tag: `smoke` em todos os flows.

Variáveis: `constants/variables.env` (fonte) + `.env` (overrides locais).
