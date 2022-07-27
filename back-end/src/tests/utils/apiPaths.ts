export const paths = {
  recommendations: {
    create: "/recommendations",
    upVote(id: number) {
      return `/recommendations/${id}/upvote`
    },
    downVote(id: number) {
      return `/recommendations/${id}/downvote`
    },
    getAll: "/recommendations",
    getById(id: number) {
      return `/recommendations/${id}`
    },
    getRandom: "/recommendations/random",
    getTop(amount: number) {
      return `/recommendations/top/${amount}`
    },
  },
}
