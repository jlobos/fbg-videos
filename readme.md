# fbg-videos

[![Build Status](https://travis-ci.org/jlobos/fbg-videos.svg?branch=master)](https://travis-ci.org/jlobos/fbg-videos)
[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)

> Get last videos of Facebook Group

## Install

```bash
npm install --save fbg-videos
```

## Usage 

```js
const {getVideos, getVideoById} = require('fbg-videos')

// Facebook Group ID
const group = '613603098840735'
// Cookie of User
const cookie = {c_user: '', xs: ''}

getVideos(group, {cookie})
  .then(async videos => {
    const {id} = videos[0]
    
    const {files} = await getVideoById(id, {cookie})
    console.log(files)
  })
```

## License

MIT © [Jesus Lobos](https://jlobos.com/)
