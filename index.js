const cheerio = require('cheerio')
const fetch = require('node-fetch')
const ms = require('ms')
const qs = require('qs')
const urlRegex = require('url-regex')

function getVideos(group, {cookie: {c_user, xs}}) {
  const params = {
    path: `/groups/${group}/videos/`,
    ajaxpipe: '1',
    __a: '1',
    __req: 'fetchstream_1',
    ajaxpipe_fetch_stream: '1'
  }

  return fetch(
    `https://www.facebook.com/ajax/home/generic.php?${qs.stringify(params)}`,
    {
      headers: {
        cookie: qs.stringify({c_user, xs}, {delimiter: ';', encode: false})
      }
    }
  )
    .then(res => res.text())
    .then(res => res.split('/*<!-- fetch-stream -->*/'))
    .then(res => JSON.parse(res[2]))
    .then(res => res.content.payload.content.group_photoset)
    .then(html => cheerio.load(html))
    .then($ =>
      $('table a')
        .map((i, el) => {
          // Hyperlink
          const a = $(el)

          const title = a.attr('title')
          const id = a.attr('name')
          // Duration of video
          const minutes = $('.playtime', a).text().replace(':', '.')
          const duration = ms(`${minutes}m`)
          // Get thumbnail from "background-image" style
          const thumbnail = /url\('(.*)'\)/.exec($('i', a).attr('style'))[1]
          // Get author from href
          const author = a.attr('href').split('/')[1]

          return {title, id, duration, thumbnail, author}
        })
        .get()
    )
}

function getVideoById(id, {cookie: {c_user, xs}}) {
  return fetch(`https://www.facebook.com/${id}/`, {
    headers: {
      cookie: qs.stringify({c_user, xs}, {delimiter: ';', encode: false})
    }
  })
    .then(res => res.text())
    .then(res => {
      const URLs = res.match(urlRegex())
      // Filter mp4 URLs and remove duplicates
      const files = [...new Set(URLs.filter(url => /.mp4/.test(url)))]

      // Get Date
      let date = /data-utime="(\d+)"/.exec(res)[1]
      date = parseInt(date, 10)

      return {files, date}
    })
}

module.exports = {getVideos, getVideoById}
