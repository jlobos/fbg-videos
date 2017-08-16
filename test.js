import test from 'ava'
import {getVideos, getVideoById} from './index'

const group = '613603098840735'
const cookie = {
  c_user: process.env.C_USER || '',
  xs: process.env.XS || ''
}

test('Get List of Videos', async t => {
  const videos = await getVideos(group, {cookie})
  const video = videos[0]

  t.true(Array.isArray(videos))

  t.true('title' in video)
  t.true('id' in video)
  t.true('duration' in video)
  t.true('thumbnail' in video)
  t.true('author' in video)

  t.is(typeof video.title, 'string')
  t.is(typeof video.duration, 'number')
})

test('Get Video', async t => {
  const {id} = (await getVideos(group, {cookie}))[0]
  const video = await getVideoById(id, {cookie})

  t.true(Array.isArray(video.files))

  t.true('files' in video)
  t.true('date' in video)
})
