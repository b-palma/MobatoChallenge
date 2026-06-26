#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
REPORTS="$ROOT/reports"
APK_URL="https://github.com/saucelabs/my-demo-app-android/releases/download/2.2.0/mda-2.2.0-25.apk"

mkdir -p "$REPORTS"

if ! command -v maestro &>/dev/null; then
  curl -Ls "https://get.maestro.mobile.dev" | bash
fi
export PATH="$PATH:$HOME/.maestro/bin"

echo "Instalando APK..."
curl -L -o /tmp/mda.apk "$APK_URL"
adb install -r /tmp/mda.apk

MAESTRO_ARGS=()
for file in "$ROOT/constants/variables.env" "$ROOT/.env"; do
  [[ -f "$file" ]] || continue
  while IFS= read -r line || [[ -n "$line" ]]; do
    line="${line%%#*}"
    line="$(echo "$line" | xargs)"
    [[ -z "$line" || "$line" != *"="* ]] && continue
    key="${line%%=*}"
    value="${line#*=}"
    MAESTRO_ARGS+=("-e" "${key}=${value}")
  done < "$file"
done

# CI: carrinho + checkout (login inválido falha de propósito — bug conhecido do app)
CI_FLOWS=(
  "$ROOT/flows/add-product-to-cart.yaml"
  "$ROOT/flows/checkout-journey.yaml"
)

echo "Rodando testes Maestro (CI)..."
maestro test --format junit --output "$REPORTS/junit.xml" "${MAESTRO_ARGS[@]}" "${CI_FLOWS[@]}"
