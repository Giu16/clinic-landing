<h1 align="center">Clinic Landing</h1>

<p align="center">
  Landing page conceito para uma clínica de medicina estética.<br>
  Design editorial de luxo, responsivo, acessível e com segurança de nível profissional.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white" alt="HTML5">
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white" alt="CSS3">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel&logoColor=white" alt="Vercel">
  <img src="https://img.shields.io/badge/CSP-A%2B-2E7D32?style=flat&logo=letsencrypt&logoColor=white" alt="CSP A+">
</p>

---

## 🔗 Demo

**[clinic-landing.vercel.app](https://clinic-landing.vercel.app)** &nbsp;·&nbsp; _(atualize com a URL real após o deploy)_

## ✨ Funcionalidades

- **Layout responsivo** — desktop, tablet e mobile
- **Menu mobile** (hambúrguer) com destaque da seção atual (scroll-spy)
- **Catálogo de procedimentos** por categoria (abas) com página de detalhe e transições suaves
- **FAQ interativo** (acordeão)
- **Carrossel da equipe** no mobile
- **Contadores animados** e animações de entrada no scroll
- **Botão de WhatsApp** e "voltar ao topo"

## 🛠️ Tecnologias

- **HTML5** semântico
- **CSS3** modular com design tokens (custom properties)
- **JavaScript** vanilla (zero dependências, zero build)
- **Fontes auto-hospedadas** (Cormorant Garamond + DM Sans)
- **Vercel** para hospedagem e deploy contínuo

## 🔒 Segurança

Este projeto leva segurança a sério — mais do que a maioria dos sites em produção:

- **Content-Security-Policy** rígida (`default-src 'self'`, sem `unsafe-inline`/`unsafe-eval`)
- Suíte completa de **security headers** (HSTS, X-Frame-Options, Permissions-Policy, etc.)
- **Zero terceiros** — fontes locais, sem Google Fonts (privacidade + LGPD)
- Código sem scripts ou estilos inline (compatível com CSP rígida)

📄 Detalhes em **[SECURITY.md](SECURITY.md)**.

## 📁 Estrutura

```
index.html            → página única
robots.txt
vercel.json           → security headers
css/                  → estilos modulares (variables, reset, global, header,
                        hero, sections, footer, responsive, fonts)
js/main.js            → toda a interatividade
assets/
  fonts/              → fontes .woff2 auto-hospedadas
  images/             → imagens .webp otimizadas
```

## 🚀 Rodando localmente

Como é um site 100% estático, basta um servidor local qualquer:

```bash
# Opção 1 — Python
python -m http.server 8000

# Opção 2 — Node (npx)
npx serve
```

Depois abra `http://localhost:8000` no navegador.

> Os security headers do `vercel.json` só são aplicados no ambiente da Vercel —
> localmente o site funciona, mas sem os cabeçalhos.

## 📦 Deploy

Hospedado na **Vercel** com deploy contínuo: cada `git push` na branch principal
publica automaticamente a nova versão.

## 👩‍💻 Autora

**Giulia Carneiro**
