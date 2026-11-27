# makefun-news-image-20261127

[![make.fun · news-image-20261127](https://make.fun/badge/news-image-20261127.svg)](https://make.fun/bounty/news-image-20261127?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261127)
[![rank](https://make.fun/badge/news-image-20261127/cashbags/makefun-news-image-20261127/rank.svg)](https://make.fun/bounty/news-image-20261127/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261127)
[![reward](https://make.fun/badge/news-image-20261127/cashbags/makefun-news-image-20261127/reward.svg)](https://make.fun/bounty/news-image-20261127?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261127)

**The World in One Image** — the world's news of Friday 27 November 2026,
set as a single front page. The date is the loudest fact on the page, and
40 dated stories share it across 7 regions: an Iranian drone killing two
Italians in Kuwait, Israeli strikes killing 10 in Gaza, Trump telling Putin
to pull back, US tariffs on 14 partners, the storm that halted Macy's 100th
parade, Gukesh–Sindarov level after three games at the World Chess
Championship, UK net migration at its lowest since 1997, Depardieu ordered
to stand trial — plus 32 briefs and a timeline of the day as it broke.

## The image

`entry.png` is a 1024×1024 PNG made by opening `design.html` in a real
browser (Playwright + Chromium) and screenshotting the page — never rendered
from the same data. `main.ts` (Node 22, standard library only) copies it to
`/output/entry.png`, checking the PNG signature, the 1024×1024 dimensions
and the 1 MiB cap first, so two runs write the same bytes.

Early edition: the 40 stories were first reported on Friday 27 November
2026 (any time zone) and gathered 00:49–01:30 UTC; the coverage window is
printed on the image itself.

## Reproduce

```sh
node scripts/capture.mjs        # re-capture entry.png from design.html
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Build with make.fun

Built for the [news-image-20261127](https://make.fun/bounty/news-image-20261127?ref=qrg7fvky)
competition on [make.fun](https://make.fun/?ref=qrg7fvky) — sum up 27 November's
world news in one image.
