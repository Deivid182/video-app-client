export const getVideoId = (url: string) => {
  const urlObj = new URL(url)
  const params = new URLSearchParams(urlObj.search)
  return params.get('v')
}

console.log(getVideoId("https://www.youtube.com/watch?v=NmkY4JgS21A&t=204s"))