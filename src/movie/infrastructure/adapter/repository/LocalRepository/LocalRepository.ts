
import LocalRepositoryPort from '../../../../domain/port/driven/adapter/repository/LocalRepositoryPort'
import Movie from '../../../../domain/model/Movie/Movie'
import Classification from '../../../../domain/model/Movie/Classification'
import Genre from '../../../../domain/model/Movie/Genre'
import NullStudio from '../../../../domain/model/studio/NullStudio'
import Director from '../../../../domain/model/director/Director'
import NullMovie from '../../../../domain/model/Movie/NullMovie'




export default class LocalRepository implements LocalRepositoryPort {



    readonly  findByTitle = async (title: string):Promise<Movie[]> =>{
        const films = await import('../../../../../../database/local.json')
        

        return Promise.all(
        films.map(async (film) => {
        if (film.title.toLowerCase().includes(title.toLowerCase())) {
            return new Movie({
            id: String(film.episode_id),
            title: film.title,
            synopsis: film.opening_crawl,
            release: new Date(film.release_date),
            classification: Classification.UNKNOWN,
            genre: Genre.UNKNOWN,
            characters,
            director,
            producers,
            studio: new NullStudio(),
            images: [],
            trailer: [],
          })       
        }
    }))  
    }

    readonly  findById = async (id: number):Promise<Movie>{

         return Promise.resolve([new NullMovie()])
        }

    //readonly  findByIdList: (ids: string[]) => Promise<Movie[]>




}

