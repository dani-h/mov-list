module Models {

  export class Movie {
    id: number
    title: string
    votes: number
    url: string
    imdb_id: string
    img_src: string

    constructor(api_params: any) {
      this.id = api_params['id']
      this.title = api_params['title']
      this.votes = api_params['votes']
      this.url = api_params['url']
      this.imdb_id = api_params['imdb_id']
      this.img_src = api_params['img_src']
    }
  }


  export class ApiMovie {
    imdb_id: number
    title: string

    constructor(api_params: any) {
      this.imdb_id = api_params['imdb_id']
      this.title = api_params['title']
    }

    toJSONParams() {
      return {
        imdb_id: this.imdb_id,
        title: this.title
      }
    }
  }

}

export = Models
