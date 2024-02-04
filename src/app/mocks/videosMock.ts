import { type Prisma } from '@prisma/client'

export function getInitialVideos (userId: string): Prisma.VideoUncheckedCreateInput[] {
  return [
    {
      title: 'Cats Video 1',
      description: 'miua miua 1',
      creditos: 'Michis',
      isPublic: true,
      url: 'https://www.youtube.com/watch?v=uHKfrz65KSU',
      userId
    },
    {
      title: 'Cats Video 2',
      description: 'miua miua 2',
      creditos: 'Michis',
      isPublic: true,
      url: 'https://www.youtube.com/watch?v=uHKfrz65KSU',
      userId
    },
    {
      title: 'Cats Video 3',
      description: 'miua miua 3',
      creditos: 'Michis',
      isPublic: true,
      url: 'https://www.youtube.com/watch?v=uHKfrz65KSU',
      userId
    }
  ]
}
