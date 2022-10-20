# Wait for Pantheon — A GitHub Action ⏱

Do you have other Github actions (Lighthouse, Cypress, etc) that depend on the Pantheon Multidev Environment being available? This action will wait until the url is available before running the next task. Most of it was "borrowed" from JakePartusch/wait-for-netlify-action.

## Inputs

### `site_name`

**Required** The name of the Pantheon site to reach `https://$GITHUB_REF_NAME-{site_name}.pantheonsite.io/`

### `request_headers`

Optional — Stringified HTTP Header object key/value pairs to send in requests (eg. `'{ "Authorization": "Basic YWxhZGRpbjpvcGVuc2VzYW1l }'`)

### `max_timeout`

Optional — The amount of time to spend waiting on Pantheon. Defaults to `500` seconds

### `base_path`

Optional — The page that needs to be tested for 200. Defaults to "/" (eg: `https://{site_name}.Pantheon.app{base_path}`)

## Outputs

### `url`

The Pantheon deploy preview url that was deployed.

## Example usage

Basic Usage

```yaml
name: Deploy to Pantheon w Multisite
on:
  push:
    branches-ignore:
      - 'master'
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v1
    - uses: shimataro/ssh-key-action@v2
      with:
        key: ${{ secrets.PANTHEON_SSH_KEY }}
        config: ${{ secrets.SSH_CONFIG }}
        known_hosts: ${{ secrets.KNOWN_HOSTS }} 
    - name: Setup Terminus
      uses: kopepasah/setup-pantheon-terminus@2

    - name: Login to Pantheon
      run: terminus auth:login -q --machine-token=${{ secrets.PANTHEON_MACHINE_TOKEN }}
    - name: Create Pantheon MultiDev        
      run: terminus multidev:create   --quiet --no-files -- ${{ secrets.pantheon_site_name }}.dev $GITHUB_REF_NAME
        
    - name: Waiting for 200 from the Pantheon Preview
      uses: dschmidtadv/wait-for-pantheon-action@1.4
      id: waitFor200
      with:
          branch_name: ${{ github.ref_name }}
          site_name: ${{ secrets.pantheon_site_name }}

    - name: deployer
      env:
        pantheon_repo: '${{ secrets.PANTHEON_REPO }}'
        pantheon_site_name: '${{ secrets.PANTHEON_SITE_NAME }}'
      run: |
        git remote add pantheon $pantheon_repo
        git remote -v
        git push -f pantheon HEAD:$GITHUB_REF -vvv

    - name: Import Config
      run: terminus remote:drush ${{ secrets.pantheon_site_name }}.$GITHUB_REF_NAME cim -y

         
    - name: Clear Pantheon Cache        
      if: ${{ always() }}
      run: terminus env:clear-cache ${{ secrets.pantheon_site_name }}.$GITHUB_REF_NAME



```yaml

```

</details>
