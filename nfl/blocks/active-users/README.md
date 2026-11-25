# Active users POC

This block currently shows a **synthetic test value**, not real visitor data.
It calls a public Adobe I/O Runtime web action which selects a random
JSONPlaceholder post and returns `{ "value": <body.length> }`.

Author an **Active Users** table with a heading in its first content row and
a link to the public HTTPS endpoint in its second content row:

| Active Users |
| --- |
| **Valor actual de prueba** (format as H2) |
| https://654713-946blackhorse-stage.adobeioruntime.net/api/v1/web/default/eds-counter-poc-20261125 |

The block fetches immediately and every five seconds while visible and not
paused. Slow requests do not overlap. It accepts nonnegative safe integers,
including zero; failures display "No disponible" and are retried.

The endpoint caches successful responses for ten seconds. Browser caching may
serve intervening polls locally. Equal values do not prove a cache hit:
different posts can have the same body length. Do not append timestamps or
set request cache-bypass options. No credentials are needed in the browser.
When inspecting requests, leave DevTools **Disable cache** unchecked.
`Cache-Control: no-cache` or `Pragma: no-cache` request headers bypass
Runtime's cache (`X-GW-Cache: BYPASS`). Check `X-Poc-Execution-Id` as well:
a browser-cached response retains the gateway header from its original fetch.

Local test content: `/drafts/tmp/active-users` using AEM CLI with
`--html-folder drafts`. The site loads code from `/nfl/blocks/`, not `/blocks/`.
