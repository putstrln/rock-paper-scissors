If you have node and yarn
```
yarn && yarn start
```

If you have docker
```
docker run -it --rm -v $PWD:/app -w /app node:16 yarn
docker run -it --rm -v $PWD:/app -w /app node:16 node index.js
```

### Credits
Adapted the code from https://github.com/arifikhsan/batu-gunting-kertas-nuxt/blob/master/pages/index.vue#L225