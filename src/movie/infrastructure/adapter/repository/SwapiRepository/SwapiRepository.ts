import { SwapiDBC } from '../../../../../shared/Shared'
import { SwapiFilmInterface } from '../../../../domain/interfaces/MovieSwapiInterface'
import Classification from '../../../../domain/model/Movie/Classification'
import Genre from '../../../../domain/model/Movie/Genre'
import Movie from '../../../../domain/model/Movie/Movie'
import NullMovie from '../../../../domain/model/Movie/NullMovie'
import NullStudio from '../../../../domain/model/studio/NullStudio'
import SwapiRepositoryPort from '../../../../domain/port/driven/adapter/repository/SwapiRepositoryPort'
import MakerProducersSwapi from './MakerProducersSwapi'
import MakerCharactersSwapi from './MakerCharactersSwapi'
import MakerDirectorSwapi from './MakerDirectorSwapi'

export default class SwapiRepository implements SwapiRepositoryPort {
  private readonly makerCharactersSwapi: MakerCharactersSwapi
  private readonly makerDirectorSwapi: MakerDirectorSwapi
  private readonly makerProducersSwapi: MakerProducersSwapi

  constructor(private readonly swapiDBC: SwapiDBC) {
    this.makerCharactersSwapi = new MakerCharactersSwapi(this.swapiDBC)
    this.makerDirectorSwapi = new MakerDirectorSwapi()
    this.makerProducersSwapi = new MakerProducersSwapi()
  }

  readonly findByIdList = async (ids: number[] ): Promise<Movie[]> =>{
    const films: SwapiFilmInterface[] = await this.swapiDBC.films()
    
     return Promise.all(
      films.map(async (film) => {
        if (ids.includes(film.episode_id)) {
          const characters = await this.makerCharactersSwapi.make(film.characters)

          const director = this.makerDirectorSwapi.make(film.director)

          const producers = this.makerProducersSwapi.make(film.producer)

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
        return new NullMovie()
      }))
     
  }


  readonly findById = async (id: number): Promise<Movie> => {
    const films: SwapiFilmInterface[] = await this.swapiDBC.films()

    const film = films.find((f) => f.episode_id === id)
    if (!film) return new NullMovie()

    const characters = await this.makerCharactersSwapi.make(film.characters)

    const director = this.makerDirectorSwapi.make(film.director)

    const producers = this.makerProducersSwapi.make(film.producer)

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
  


  readonly findByTitle = async (title: string): Promise<Movie[]> => {
    const films: SwapiFilmInterface[] = await this.swapiDBC.films()

    return Promise.all(
      films.map(async (film) => {
        if (film.title.toLowerCase().includes(title.toLowerCase())) {
          const characters = await this.makerCharactersSwapi.make(film.characters)

          const director = this.makerDirectorSwapi.make(film.director)

          const producers = this.makerProducersSwapi.make(film.producer)

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
        return new NullMovie()
      })
    )
  }
}
  