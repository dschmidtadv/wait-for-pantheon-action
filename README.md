# Wait for Pantheon — A GitHub Action ⏱

Do you have other Github actions (Lighthouse, Cypress, etc) that depend on the Pantheon Preview URL? This action will wait until the url is available before running the next task.

## Inputs

### `site_name`

**Required** The name of the Pantheon site to reach `https://{site_name}.Pantheon.app`

### `request_headers`

Optional — Stringified HTTP Header object key/value pairs to send in requests (eg. `'{ "Authorization": "Basic YWxhZGRpbjpvcGVuc2VzYW1l }'`)

### `max_timeout`

Optional — The amount of time to spend waiting on Pantheon. Defaults to `60` seconds

### `base_path`

Optional — The page that needs to be tested for 200. Defaults to "/" (eg: `https://{site_name}.Pantheon.app{base_path}`)

## Outputs

### `url`

The Pantheon deploy preview url that was deployed.

## Example usage

Basic Usage

```yaml
steps:
  - name: Waiting for 200 from the Pantheon Preview
    uses: jakepartusch/wait-for-pantheon-action@v1.3
    id: waitFor200
    with:
      site_name: "jakepartusch"
      max_timeout: 60
```

<details>
<summary>Complete example with Lighthouse</summary>
<br />

```yaml
name: Lighthouse

on: [pull_request]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v1
      - name: Use Node.js 12.x
        uses: actions/setup-node@v1
        with:
          node-version: 12.x
      - name: Install
        run: |
          npm ci
      - name: Build
        run: |
          npm run build
      - name: Waiting for 200 from the Pantheon Preview
        uses: jakepartusch/wait-for-pantheon-action@v1.3
        id: waitFor200
        with:
          site_name: "jakepartusch"
      - name: Lighthouse CI
        run: |
          npm install -g @lhci/cli@0.3.x
          lhci autorun --upload.target=temporary-public-storage --collect.url=${{ steps.waitFor200.outputs.url }} || echo "LHCI failed!"
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}
```

</details>
