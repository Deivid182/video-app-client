
export interface Video {
  title: string
  description: string
  isPublished: boolean
  userId: string
  url: string
  likes: string[]
}

export interface VideoWithId extends Video {
  _id: string
  createdAt: string
}
