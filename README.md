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
After a new tag has been pushed, a release is automatically created and published to GitHub as a draft. The draft must be released manually, which will distribute the release to all users.