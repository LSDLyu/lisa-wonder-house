# Lisa’s Wonder House · Lisa 的奇妙大楼

A bilingual, browser-based dollhouse designed by Lisa, with 13 activities, guest stories, room decoration, a six-floor slide and gentle synthesized sound effects. No account, server database or paid assets are required to play.

- [中文版](https://edu.alading.org/games/lisa-wonder-house/)
- [English edition](https://edu.alading.org/en/games/lisa-wonder-house/)
- [游戏目录](https://edu.alading.org/games/) · [Game directory](https://edu.alading.org/en/games/)

## Play

Use the elevator to explore nine activity floors and upstairs rooms. Tap the scene to walk, tap activity buttons to play, or move with arrow keys. Welcome guests, choose a room, complete their wishes and check out for play coins. Spend coins on reusable decorations.

The six-floor slide has gentle and fast rides, optional automatic star collection, manual star tapping, pause/resume and sound controls. Sound is off initially; speech is optional and uses an English or Chinese browser voice. Reduced motion moves the rider one floor at a time.

Progress is stored in the current browser under `lisa-house-v1`. Chinese and English share progress on the same origin. The original ChatGPT site and edu.alading.org are different origins and do not automatically share saves.

## Develop

Node.js 22 or newer; the game itself has no runtime dependencies.

```sh
npm run build
npm test
npm run preview
# http://localhost:4180/zh/ and http://localhost:4180/en/
```

`source/` contains the Chinese game and shared assets. `source/en.tsv` is the reviewed English translation catalog. `scripts/build.mjs` produces both static editions, checks translation coverage and adjusts English sentence structure. `source/locale.js` switches languages and localizes names from existing saves. `tests/` checks syntax, 13-activity coverage, saved-name translation and public routes.

## Publish

```sh
npm install
npm run build
npm test
npm run deploy
```

The Cloudflare Worker serves only the two game paths and their known assets, using `wrangler.jsonc`. It does not modify the education application or its database. The two more-specific routes coexist with the existing games-directory Worker. Keep Cloudflare and GitHub credentials in your CLI credential store, never in this repository.

`directory-extension.js` adds one localized card to each games directory. Append it to a **fresh export** of the complete `lisa-games-router` production source, check all existing cards, then deploy that router through its existing configuration. Do not replace the full router with this extension.

The included source and illustrations originate from the owner’s Lisa Wonder House project. No additional license is granted here.


## Shared game navigation

Both languages load `source/game-shell.js`, copied byte-for-byte from edu-site/public/game-shell.js. The common header becomes compact on scroll, and the shared footer keeps the game pages consistent. The dollhouse toolbar, activities, saved progress and game controls stay inside the existing app. `npm run build` includes the navigation in both language folders; the Worker explicitly serves it.

## 2026-10-25 加载与共用声音

界面图片优先使用 WebP 无损版本；原始 PNG 保留。全景图仅在打开时请求，首次所需图片由约 8.08 MB 降至 3.13 MB。全站静音、音效/语音偏好与本游戏开关同时生效，关闭时停止滑梯风声，解除静音不会恢复旧的循环。页首统一语言入口，增加 canonical 和中英文替代链接。共用 `game-shell.js`、`site-audio.mjs` 由 edu-site 同步。
