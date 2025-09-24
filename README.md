# Free Online UUID Generator - Create UUIDs & GUIDs Instantly | Easy UUID Generator

![Status](https://img.shields.io/badge/status-active-brightgreen) ![License](https://img.shields.io/badge/cc-by-nc) ![Made%20with-Python-3776AB?logo=python&logoColor=white](https://img.shields.io/badge/Made%20with-Python-3776AB?logo=python&logoColor=white)

A fast, free, and open-source UUID/GUID generator with a simple web UI and a public API. Live at `https://easyuuidgenerator.com`. Built with Flask.

---

## What is Easy UUID Generator?

Easy UUID Generator helps developers create Universally Unique Identifiers quickly and safely. It supports RFC 4122 UUIDs and modern RFC 9562 UUIDv7.

- Supported: UUID v1 (time-based), v4 (random), v5 (name-based), v7 (time-ordered), GUID format
- Extras: bulk generation, prefix/suffix, UUID decoder, QR code, hashing (MD5, SHA-1, SHA-256, SHA-512)
- Free API

---

## Production
- Website: `https://easyuuidgenerator.com`

---

## Why Use Our Generator?

- **User-Friendly Interface**: Clean, intuitive design that anyone can use
- **No Registration Required**: Start generating UUIDs instantly
- **100% Free & Open Source**: No hidden costs or premium features
- **Privacy Focused**: We don't store your generated UUIDs
- **Developer Friendly**: Comprehensive API documentation and examples
- **Multiple Format Support**: Generate exactly what you need
- **Cross-Platform**: Works on any device with a web browser

## Perfect For:

- Database Primary Keys
- Distributed Systems
- Mobile App Development
- Testing & QA
- Cloud Applications
- IoT Device IDs
- Gaming Applications
- Content Management Systems

## Why UUIDs Matter

Unique identifiers are crucial in modern software development. They help:
- Prevent data conflicts in distributed systems
- Enable reliable data synchronization
- Create globally unique database keys
- Ensure unique identification across different systems
- Support scalable application architecture

---

## Quick Start (Local)

Requirements: Python 3.10+

```bash
git clone https://github.com/<your-user>/easyuuidgenerator.git
cd easyuuidgenerator
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
export FLASK_DEBUG=1  # optional
python app.py
```

App runs on `http://localhost:5002`.


#### Configuration

All SEO and API options live in `config.py`:
- `API_RATE_LIMIT = "100 per day"`
- `SITE_TITLE`, `SITE_DESCRIPTION`, `SITE_KEYWORDS`
- OpenGraph/Twitter image: `SITE_IMAGE`


#### UI Routes

- `/` UUID generator (v1, v4, v5, v7 + options)
- `/bulk` Bulk generation
- `/decoder` UUID decoder
- `/api` API documentation
- `/uuidguide` UUID guide
- `/developer` Developer corner


#### Public API

Base: `https://easyuuidgenerator.com`

- Generate 1..100 UUIDs
  - `GET /api/v1/uuid?type=v4&count=10`
  - Types: `v1`, `v4`, `v5`, `v7`, `guid`
  - Response example:

```json
{
  "success": true,
  "count": 3,
  "uuids": ["...", "...", "..."]
}
```

- Decode a UUID
  - `GET /api/v1/decode?uuid=<uuid>`
  - Response excerpt:

```json
{
  "uuid": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "uuid_version": 4,
  "type": "UUID version 4 (random)",
  "is_valid": true
}
```

- Rate limits: default `100/day` per IP. Adjust via `config.API_RATE_LIMIT`.

#### Usage Examples

- cURL
```bash
curl "https://easyuuidgenerator.com/api/v1/uuid?type=v7&count=5"
```

- Python
```python
import requests
r = requests.get("https://easyuuidgenerator.com/api/v1/uuid", params={"type": "v4", "count": 3})
print(r.json())
```

- JavaScript (fetch)
```javascript
const res = await fetch("https://easyuuidgenerator.com/api/v1/uuid?type=v5&count=2");
const data = await res.json();
console.log(data);
```

#### Internals

- `modules/uuid_generator.py`: v1/v4/v5/v7, GUID (Windows style), bulk, custom prefix/suffix
- `modules/qr_generator.py`: QR code PNG
- `modules/hash_generator.py`: MD5/SHA-1/SHA-256/SHA-512
- `modules/sitemap_generator.py`: dynamic sitemap XML
- `app.py`: UI and API routes, rate limiting (Flask-Limiter)

---


## FAQ

- What is the difference between UUID and GUID?
  - GUID is Microsoft’s term for a UUID. Functionally equivalent for most use cases.

- Which UUID version should I use?
  - v4 for random IDs; v7 for time-ordered IDs that sort well in databases; v5 for stable name-based IDs.

- Is UUIDv7 supported?
  - Yes. Uses stdlib when available, with a compliant fallback per RFC 9562.

- Can I generate multiple UUIDs at once?
  - Yes, use `count` in `GET /api/v1/uuid` (up to 100 per request).

- Do you have an API rate limit?
  - Yes, default `100/day` per IP (configurable).

---

## Contributing

Contributions are welcome.
1. Create a branch: `git checkout -b feat/<your-feature>`
2. Run locally and add tests if possible
3. Open a PR with a clear description

---

## License

MIT. See `LICENSE`.
