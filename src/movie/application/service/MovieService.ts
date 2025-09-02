import MovieServiceInterface from '../../domain/interfaces/MovieServiceInterface'
import Movie from '../../domain/model/Movie/Movie'
// import LocalRepositoryPort from '../../domain/port/driven/adapter/repository/LocalRepositoryPort'
// import RapidRepositoryPort from '../../domain/port/driven/adapter/repository/RapidRepositoryPort'
import SwapiRepositoryPort from '../../domain/port/driven/adapter/repository/SwapiRepositoryPort'
import PotterRepositoryPort from '../../domain/port/driven/adapter/repository/PotterdbRepositoryPort'


export default class MovieService implements MovieServiceInterface {
  constructor(
    // private readonly rapidRepository: RapidRepositoryPort,
    private readonly swapiRepository: SwapiRepositoryPort,
    private readonly potterRepository: PotterRepositoryPort
  ) // private readonly localRepository: LocalRepositoryPort
  {}

  readonly findByTitle = async (title: string): Promise<Movie[]> => {
    const movies: Movie[] = []
    
    try {
      // Intentar obtener películas de ambas fuentes de forma concurrente pero con manejo de errores individual
      const [swapiMovies, potterMovies] = await Promise.allSettled([
        this.swapiRepository.findByTitle(title),
        this.potterRepository.findByTitle(title)
      ])

      if (swapiMovies.status === 'fulfilled') {
        movies.push(...swapiMovies.value)
      } else {
        console.error('Error fetching SWAPI movies:', swapiMovies.reason)
      }

      if (potterMovies.status === 'fulfilled') {
        movies.push(...potterMovies.value)
      } else {
        console.error('Error fetching Potter movies:', potterMovies.reason)
      }

    } catch (error) {
      console.error('Unexpected error in findByTitle:', error)
    }

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
