# GMP Launcher

## Project setup
Install [Node.js 20.x](https://nodejs.org/en)
```shell
npm install
```

## Publish release
```shell
npm version patch
git push --follow-tags
```
After a new tag has been pushed, a build is automatically created and published as a draft. After the draft is published manually, the release is rolled out to all users.