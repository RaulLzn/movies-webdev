import MovieServiceInterface from '../../domain/interfaces/MovieServiceInterface'
import Movie from '../../domain/model/Movie/Movie'
// import RapidRepositoryPort from '../../domain/port/driven/adapter/repository/RapidRepositoryPort'
import SwapiRepositoryPort from '../../domain/port/driven/adapter/repository/SwapiRepositoryPort'
import LocalRepositoryPort from '../../domain/port/driven/adapter/repository/LocalRepositoryPort'


export default class MovieService implements MovieServiceInterface {
  constructor(
    // private readonly rapidRepository: RapidRepositoryPort,
    private readonly swapiRepository: SwapiRepositoryPort,
    private readonly localRepository: LocalRepositoryPort
  ) {}

  readonly findByTitle = async (title: string): Promise<Movie[]> => {
    const movies: Movie[] = []
    // const rapidMovies = await this.rapidRepository.findByTitle(title)
    const swapiMovies = await this.swapiRepository.findByTitle(title)
    const localMovies = await this.localRepository.findByTitle(title)

    // movies.push(...rapidMovies, ...swapiMovies, ...localMovies)
    movies.push(...swapiMovies, ...localMovies)
    return movies
  }

  readonly findById = async (id: number): Promise<Movie> => {
    const swapiMovie = await this.swapiRepository.findById(id)
    const localMovie = await this.localRepository.findById(String(id))

    // return rapidMovie ?? swapiMovie ?? localMovie ?? null
    return swapiMovie.isNull ? localMovie : swapiMovie

  }
  readonly findByIdList = async (ids: number[]): Promise<Movie[]> => {
    const movies: Movie[] = []

    const swapiMovies = await this.swapiRepository.findByIdList(ids)
    const localMovies = await this.localRepository.findByIdList(ids.map(String))
    movies.push(...swapiMovies, ...localMovies)
    return movies
  }

}
