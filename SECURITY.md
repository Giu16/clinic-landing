# Segurança

Este documento descreve as decisões de segurança aplicadas neste projeto — um site
**estático** (HTML, CSS e JavaScript vanilla), sem back-end, banco de dados ou
autenticação. O modelo de ameaça é, portanto, focado em: proteção contra XSS,
clickjacking, vazamento de dados para terceiros e forçar transporte seguro (HTTPS).

## Cabeçalhos de segurança

Configurados em [`vercel.json`](vercel.json) e aplicados a todas as respostas.

| Cabeçalho | Função |
| --- | --- |
| **Content-Security-Policy** | Restringe a origem de cada tipo de recurso. É a principal defesa contra XSS. |
| **Strict-Transport-Security** | Força HTTPS por 2 anos (`max-age=63072000; includeSubDomains`). Impede downgrade para HTTP e ataques man-in-the-middle. |
| **X-Content-Type-Options: nosniff** | Impede o navegador de "adivinhar" o tipo de um arquivo (MIME sniffing). |
| **X-Frame-Options: DENY** | Anti-clickjacking (compatibilidade com navegadores antigos; reforça o `frame-ancestors`). |
| **Referrer-Policy: strict-origin-when-cross-origin** | Não vaza a URL completa para sites de terceiros. |
| **Permissions-Policy** | Desliga APIs que o site não usa: câmera, microfone, geolocalização, pagamento, USB. Inclui opt-out de rastreamento (`interest-cohort=()`). |
| **Cross-Origin-Opener-Policy: same-origin** | Isola o contexto de navegação de outras janelas. |

## Content-Security-Policy

```
default-src 'self';
script-src 'self';
style-src 'self';
font-src 'self';
img-src 'self' data:;
connect-src 'self';
object-src 'none';
base-uri 'self';
form-action 'self';
frame-ancestors 'none';
upgrade-insecure-requests
```

Pontos-chave:

- **Sem `'unsafe-inline'` e sem `'unsafe-eval'`** em nenhuma diretiva. Mesmo que um
  atacante conseguisse injetar HTML, o navegador se recusa a executar script inline,
  aplicar estilo inline ou carregar recursos de origens externas.
- **`default-src 'self'` — nenhuma origem de terceiros.** Todos os recursos
  (scripts, estilos, fontes, imagens) são servidos pelo próprio domínio.
- **`frame-ancestors 'none'`** — o site não pode ser embutido em `<iframe>`
  (proteção contra clickjacking).
- **`img-src 'self' data:`** — o `data:` cobre uma textura de grão embutida via
  CSS (SVG em data URI); nenhuma imagem externa é carregada.

## Código compatível com CSP rígida

Para permitir `script-src 'self'` e `style-src 'self'` sem exceções:

- **Nenhum script inline.** Toda a lógica fica em [`js/main.js`](js/main.js).
- **Nenhum handler de evento inline** (`onerror`, `onclick`, etc.). O fallback de
  imagem é feito por um único listener global na fase de captura, em `main.js`.
- **Nenhum `style="..."` no HTML.** Todos os estilos foram movidos para classes CSS.
  Estilos dinâmicos definidos por JavaScript usam a CSSOM (`element.style.*`), que a
  CSP permite.

## Fontes auto-hospedadas

As fontes (Cormorant Garamond e DM Sans) são servidas localmente a partir de
[`assets/fonts/`](assets/fonts) via [`css/fonts.css`](css/fonts.css), em vez do
Google Fonts. Benefícios:

- **Privacidade:** nenhum dado dos visitantes (IP, User-Agent, referer) é enviado a
  terceiros — relevante inclusive para conformidade com a LGPD.
- **Segurança:** remove a dependência de um CDN externo da CSP (`font-src 'self'`).
- **Desempenho:** elimina a conexão a domínios externos; as duas fontes acima da
  dobra usam `<link rel="preload">` para evitar "piscada" de texto (FOUT).

## Links externos

Todos os links com `target="_blank"` usam `rel="noopener noreferrer"`, evitando o
ataque de *reverse tabnabbing* e o vazamento de referer.

## Como verificar

Após o deploy, o site pode ser auditado em:

- [securityheaders.com](https://securityheaders.com)
- [Mozilla Observatory](https://developer.mozilla.org/en-US/observatory)

## Reportar uma vulnerabilidade

Encontrou um problema de segurança? Entre em contato de forma responsável em
**contato@helenabellini.com.br** (ajuste para o canal real do projeto). Por favor,
não abra issues públicas com detalhes de vulnerabilidades.
