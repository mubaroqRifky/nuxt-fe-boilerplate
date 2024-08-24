This will help you start developing App with <b>Nuxt 3</b>.

<a href="https://www.npmjs.com/package/nuxt" rel="nofollow"><img src="https://camo.githubusercontent.com/bdd047bafa07189a121d87924b26eb80294a3d796ef5c48eb14d19397c621432/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f762f6e7578742e7376673f7374796c653d666c617426636f6c6f72413d31383138314226636f6c6f72423d323843463844" alt="Version" data-canonical-src="https://img.shields.io/npm/v/nuxt.svg?style=flat&amp;colorA=18181B&amp;colorB=28CF8D" style="max-width: 100%;"></a>
<a href="https://www.npmjs.com/package/nuxt" rel="nofollow"><img src="https://camo.githubusercontent.com/5c65ba68298f89c5424c2ae4f192b21ccfae8fadec3087820b93fb11ccfe6d86/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f646d2f6e7578742e7376673f7374796c653d666c617426636f6c6f72413d31383138314226636f6c6f72423d323843463844" alt="Downloads" data-canonical-src="https://img.shields.io/npm/dm/nuxt.svg?style=flat&amp;colorA=18181B&amp;colorB=28CF8D" style="max-width: 100%;"></a>
<a href="https://github.com/nuxt/nuxt/tree/main/LICENSE"><img src="https://camo.githubusercontent.com/ea5158159fa70267ea96fa7ac74ef4c068b1bbaa24d73f2f13a131692b1458b2/68747470733a2f2f696d672e736869656c64732e696f2f6769746875622f6c6963656e73652f6e7578742f6e7578742e7376673f7374796c653d666c617426636f6c6f72413d31383138314226636f6c6f72423d323843463844" alt="License" data-canonical-src="https://img.shields.io/github/license/nuxt/nuxt.svg?style=flat&amp;colorA=18181B&amp;colorB=28CF8D" style="max-width: 100%;"></a>
<a href="https://nuxt.com" rel="nofollow"><img src="https://camo.githubusercontent.com/933378573ee0587332dfff9ac0e41f2857b506f21cf675eb962f925d7ad88b38/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f4e757874253230446f63732d3138313831423f6c6f676f3d6e7578742e6a73" alt="Website" data-canonical-src="https://img.shields.io/badge/Nuxt%20Docs-18181B?logo=nuxt.js" style="max-width: 100%;"></a>

## Nuxt 3 Minimal Starter

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Project Setup

Make sure to install the dependencies:
copy & rename env.example to .env
adjust .env config

copy & rename nuxt.config.ts.example to nuxt.config.ts

This project is use node version ^20 with npm 10.2.4

```bash
cp .env.example .env
```

```bash
cp nuxt.config.ts.example nuxt.config.ts
```

```bash
#npm
npm install
```

### Compile and Hot-Reload for Local Development

Start the local development server on `http://localhost:5173`:

```bash
# npm
npm run dev
```

Locally preview production build:

```bash
# npm
npm run preview
```

## Build Production for Client Side Rendering

Build the application for production:

```bash
# npm
npm run build
```

The nuxi generate command will then output an /.output/public/index.html and /dist/index.html

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

### Handle route not found in SPA App

For nginx server you must add this line in file configuration to handle route not found

root /PROJECT_PATH/dist;

location / {
...
try_files $uri $uri/ /index.html;
}
