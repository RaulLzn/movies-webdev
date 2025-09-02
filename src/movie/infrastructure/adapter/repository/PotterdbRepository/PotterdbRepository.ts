import { PotterDBC } from '../../../../../shared/Shared'
import { MoviePotterdbInterface } from '../../../../domain/interfaces/MoviePotterdbInterface'
import NullCharacter from '../../../../domain/model/character/NullCharacter'
import Classification from '../../../../domain/model/Movie/Classification'
import Genre from '../../../../domain/model/Movie/Genre'
import Movie from '../../../../domain/model/Movie/Movie'
import NullMovie from '../../../../domain/model/Movie/NullMovie'
import NullStudio from '../../../../domain/model/studio/NullStudio'
import PotterdbRepositoryPort from '../../../../domain/port/driven/adapter/repository/PotterdbRepositoryPort'
import MakerDirector from './MakerDirector'
import MakerProducers from './MakerProducers'


export default class PotterdbRepository implements PotterdbRepositoryPort {
  private readonly makerDirector: MakerDirector
  private readonly makerProducers: MakerProducers

  constructor(private readonly potterdbDBC: PotterDBC) {
    this.makerDirector = new MakerDirector()
    this.makerProducers = new MakerProducers()
  }

  readonly findByIdList = async (ids: number[]): Promise<Movie[]> => {
    const films: MoviePotterdbInterface[] = await this.potterdbDBC.movies()
    
    return Promise.all(
      films.map(async (film) => {
        if (ids.includes(parseInt(film.id))) {

          const director = this.makerDirector.make(film.attributes.directors[0] || '')

          const producers = this.makerProducers.make(film.attributes.producers)

          return new Movie({
            id: film.id,
            title: film.attributes.title,
            synopsis: film.attributes.summary,
            release: new Date(film.attributes.release_date),
            classification: this.mapClassification(film.attributes.rating),
            genre: Genre.UNKNOWN,
            characters: [new NullCharacter()],
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

  readonly findById = async (id: number): Promise<Movie> => {
    const films: MoviePotterdbInterface[] = await this.potterdbDBC.movies()

    const film = films.find((f) => parseInt(f.id) === id)
    if (!film) return new NullMovie()

    const director = this.makerDirector.make(film.attributes.directors[0] || '')

    const producers = this.makerProducers.make(film.attributes.producers)

    return new Movie({
      id: film.id,
      title: film.attributes.title,
      synopsis: film.attributes.summary,
      release: new Date(film.attributes.release_date),
      classification: this.mapClassification(film.attributes.rating),
      genre: Genre.UNKNOWN,
      characters: [new NullCharacter()],
      director,
      producers,
      studio: new NullStudio(),
      images: [],
      trailer: [],
    })
  }

  readonly findByTitle = async (title: string): Promise<Movie[]> => {
    const films: MoviePotterdbInterface[] = await this.potterdbDBC.movies()

    return Promise.all(
      films.map(async (film) => {
        if (film.attributes.title.toLowerCase().includes(title.toLowerCase())) {

          const director = this.makerDirector.make(film.attributes.directors[0] || '')

          const producers = this.makerProducers.make(film.attributes.producers)

          return new Movie({
            id: film.id,
            title: film.attributes.title,
            synopsis: film.attributes.summary,
            release: new Date(film.attributes.release_date),
            classification: this.mapClassification(film.attributes.rating),
            genre: Genre.UNKNOWN,
            characters: [new NullCharacter()],
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

  private mapClassification = (rating: string): Classification => {
    switch (rating.toUpperCase()) {
      case 'G':
        return Classification.G
      case 'PG':
        return Classification.PG
      case 'PG-13':
        return Classification.PG_13
      case 'R':
        return Classification.R
      default:
        return Classification.UNKNOWN
    }
  }
}