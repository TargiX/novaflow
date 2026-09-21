# Website traffic

Self-hosted Umami: https://stats.phosphene.cc. Website: NovaFlow; ID `875d6c8f-57a4-4064-a099-2e46efeb20ab`.

Production hostname: `novaflow.signalops.cc`. No analytics token is needed in application environment variables. Only pageviews are sent. Known static paths are retained; other paths become `/other`. Titles are fixed product names, referrers contain origins only, and URL queries/fragments are omitted. No identities, form values, wallet addresses, chat content, custom events, replay, or performance capture. DNT/GPC, recovery links, localhost and preview hosts prevent tracking.

PostHog client and server sending paths have been removed. Existing history in the Websites PostHog project (572099) is retained; unused ingestion tokens are not revoked because other clients may share them. Historical events are not imported into Umami. Contact delivery behavior is unchanged; former contact-form analytics are not collected.

Run privacy checks with `node --test tests/umami-traffic.check.mjs` and build before deployment. After deployment verify a tagged production browser pageview appears in Umami and no PostHog request is sent. Remove the traffic loader and redeploy to disable.
