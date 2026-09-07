# Vacuum Compression Travel Backpack — Content Contract

The storefront may render these fields only when approved in commerce data.

```text
identity.name
identity.slug
identity.collection
content.eyebrow
content.headline
content.subheadline
content.short_description
content.story
content.benefit_blocks[]
content.feature_blocks[]
specs[]
included_items[]
usage_steps[]
faq[]
policies.shipping
policies.returns
seo.title
seo.description
```

Every supplier-dependent field carries verification state in the commerce model. Missing or unverified values must be omitted from public UI; never substitute invented placeholders.

Public purchase state is derived from the authoritative catalog/launch gate rather than client-side product configuration.
