# Mobile Responsiveness

This fork adds full mobile responsiveness to Postiz via nginx `sub_filter` injection —
no image rebuild required.

## What's injected

| Area | What changes |
|---|---|
| Foundation | `overflow-x: hidden`, remove forced horizontal scroll |
| Bottom nav | Fixed bottom bar with Calendar / Analytics / Media / Channels / Settings |
| Header | Shrinks to 56 px height, tighter icon spacing |
| Calendar | Horizontal scroll container, `min-width` on 7-column grid |
| UX polish | 44 px touch targets, full-screen modals, `font-size: 16px` on inputs (iOS zoom fix) |

## Setup

The `nginx.conf` and `custom/` directory are volume-mounted into the container:

```yaml
volumes:
  - ./nginx.conf:/etc/nginx/nginx.conf
  - ./custom:/app/custom
```

No other changes to the image are needed.
