import MovieServiceInterface from '../../domain/interfaces/MovieServiceInterface'
import Movie from '../../domain/model/Movie/Movie'
// import LocalRepositoryPort from '../../domain/port/driven/adapter/repository/LocalRepositoryPort'
// import RapidRepositoryPort from '../../domain/port/driven/adapter/repository/RapidRepositoryPort'
import SwapiRepositoryPort from '../../domain/port/driven/adapter/repository/SwapiRepositoryPort'

export default class MovieService implements MovieServiceInterface {
  constructor(
    // private readonly rapidRepository: RapidRepositoryPort,
    private readonly swapiRepository: SwapiRepositoryPort
  ) // private readonly localRepository: LocalRepositoryPort
  {}

  readonly findByTitle = async (title: string): Promise<Movie[]> => {
    const movies: Movie[] = []
    // const rapidMovies = await this.rapidRepository.findByTitle(title)
    const swapiMovies = await this.swapiRepository.findByTitle(title)
    // const localMovies = await this.localRepository.findByTitle(title)

    // movies.push(...rapidMovies, ...swapiMovies, ...localMovies)
    movies.push(...swapiMovies)
    return movies
  }

  readonly findById = async (id: number): Promise<Movie> => {
    const swapiMovie = await this.swapiRepository.findById(id)
    // const localMovie = await this.localRepository.findById(id)

    // return rapidMovie ?? swapiMovie ?? localMovie ?? null
    return swapiMovie
  }
  readonly findByIdList = async (ids: number[]): Promise<Movie[]> => {
    const movies: Movie[] = []

    const swapiMovies = await this.swapiRepository.findByIdList(ids)
    movies.push(...swapiMovies)
    return movies
  }

}
