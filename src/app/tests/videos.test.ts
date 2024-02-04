import { afterAll, beforeAll, beforeEach, describe, expect, test } from '@jest/globals'
import supertest from 'supertest'
import { type Prisma } from '@prisma/client'

import { app, server } from '../index'
import { prisma } from '../services/db/prisma'
import { type SecureUser } from '../models/userModels'
import { getInitialVideos } from '../mocks/videosMock'

const api = supertest(app)

const VIDEOS_ENDPOINT = '/api/v1/videos'

let login: { user: SecureUser, token: string }

let initialVideos: Prisma.VideoUncheckedCreateInput[]

const initialUser = {
  email: 'thor@gmail.com',
  password: '1234567890',
  name: 'Thor'
}

beforeAll(async () => {
  await prisma.video.deleteMany()
  await prisma.user.deleteMany()
  const res = await api.post('/api/v1/auth/register').send({
    email: initialUser.email,
    pass: initialUser.password,
    name: initialUser.name
  }).expect(201)
  login = res.body.data
  initialVideos = getInitialVideos(login.user.id)
})

beforeEach(async () => {
  await prisma.video.deleteMany()
  await prisma.video.createMany({
    data: initialVideos
  })
})

describe('videos', () => {
  test('videos are json', async () => {
    await api
      .get(VIDEOS_ENDPOINT)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('there are three videos', async () => {
    const res = await api.get(VIDEOS_ENDPOINT)
    expect(res.body.data).toHaveLength(initialVideos.length)
  })

  test('a video is from Thor', async () => {
    const res = await api.get(VIDEOS_ENDPOINT)
    expect(res.body.data[0].userId).toBe(login.user.id)
  })

  test('get one video', async () => {
    const videos = (await api.get(VIDEOS_ENDPOINT)).body.data
    const firstVideo = videos[0]
    await api.get(`${VIDEOS_ENDPOINT}/${firstVideo.id}`).expect(200)
  })

  test('a private video can only be viewed by auth users', async () => {
    const privateVideo = {
      title: 'Cats Video Private',
      description: 'miua miua private',
      creditos: 'Michis',
      isPublic: false
    }

    const video = (await api.post(VIDEOS_ENDPOINT)
      .set('Authorization', 'Bearer ' + login.token)
      .send(privateVideo)
      .expect(201))
      .body.data

    await api.get(`${VIDEOS_ENDPOINT}/${video.id}`).expect(403)
  })

  test('a video can be created', async () => {
    const newVideo = {
      title: 'Cats Video new',
      description: 'miua miua new',
      creditos: 'Michis',
      isPublic: true
    }

    const video = (await api.post(VIDEOS_ENDPOINT)
      .set('Authorization', 'Bearer ' + login.token)
      .send(newVideo)
      .expect(201))
      .body.data

    expect(video.title).toBe(newVideo.title)
    expect(video.description).toBe(newVideo.description)
    expect(video.isPublic).toBe(newVideo.isPublic)
  })

  test('a video can be updated', async () => {
    const videosBefore = (await api.get(VIDEOS_ENDPOINT)).body.data
    const firstVideo = videosBefore[0]
    const newVideoInfo = { title: 'New title' }

    const video = (await api.patch(`${VIDEOS_ENDPOINT}/${firstVideo.id}`)
      .set('Authorization', 'Bearer ' + login.token)
      .send(newVideoInfo)
      .expect(200))
      .body.data

    expect(video.title).toBe(newVideoInfo.title)
  })

  test('a video can be deleted', async () => {
    const videosBefore = (await api.get(VIDEOS_ENDPOINT)).body.data
    const firstVideo = videosBefore[0]

    await api.delete(`${VIDEOS_ENDPOINT}/${firstVideo.id}`)
      .set('Authorization', 'Bearer ' + login.token)
      .expect(200)

    const videosAfter = (await api.get(VIDEOS_ENDPOINT)).body.data
    expect(videosAfter).toHaveLength(videosBefore.length - 1)
  })
})

afterAll(() => {
  server.close()
})
