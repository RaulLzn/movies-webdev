import MovieServiceInterface from '../../domain/interfaces/MovieServiceInterface'
import Movie from '../../domain/model/Movie/Movie'
// import RapidRepositoryPort from '../../domain/port/driven/adapter/repository/RapidRepositoryPort'
import SwapiRepositoryPort from '../../domain/port/driven/adapter/repository/SwapiRepositoryPort'
import LocalRepositoryPort from '../../domain/port/driven/adapter/repository/LocalRepositoryPort'

import PotterRepositoryPort from '../../domain/port/driven/adapter/repository/PotterdbRepositoryPort'


export default class MovieService implements MovieServiceInterface {
  constructor(
    // private readonly rapidRepository: RapidRepositoryPort,
    private readonly swapiRepository: SwapiRepositoryPort,
    private readonly potterRepository: PotterRepositoryPort,
    private readonly localRepository: LocalRepositoryPort
  ) {}

  readonly findByTitle = async (title: string): Promise<Movie[]> => {
    const movies: Movie[] = []
    
    try {
      // Intentar obtener películas de ambas fuentes de forma concurrente pero con manejo de errores individual
      const [swapiMovies, potterMovies, localMovies] = await Promise.allSettled([
        this.swapiRepository.findByTitle(title),
        this.potterRepository.findByTitle(title),
        this.localRepository.findByTitle(title)
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

      if (localMovies.status === 'fulfilled') {
        movies.push(...localMovies.value)
      } else {
        console.error('Error fetching Local movies:', localMovies.reason)
      }

    } catch (error) {
      console.error('Unexpected error in findByTitle:', error)
    }

    return movies
  }

  readonly findById = async (id: number): Promise<Movie> => {
    const swapiMovie = await this.swapiRepository.findById(id)
    const localMovie = await this.localRepository.findById(String(id))

    return swapiMovie.isNull ? localMovie : swapiMovie

  }
  readonly findByIdList = async (ids: number[]): Promise<Movie[]> => {
    const movies: Movie[] = []

    const swapiMovies = await this.swapiRepository.findByIdList(ids)
    const localMovies = await this.localRepository.findByIdList(ids.map(String))
    movies.push(...swapiMovies, ...localMovies)
    return movies
  }

  readonly save = async (movie: Movie): Promise<Movie> => {
    try {
      const savedMovie = await this.localRepository.save(movie)
      return savedMovie
    } catch (error) {
      console.error('Error saving movie in service:', error)
      throw new Error('Failed to save movie')
    }
  }

  readonly update = async (movie: Movie): Promise<Movie> => {
    try {
      // Solo actualizamos en el repositorio local ya que es donde podemos escribir
      const updatedMovie = await this.localRepository.update(movie)
      return updatedMovie
    } catch (error) {
      console.error('Error updating movie in service:', error)
      throw new Error('Failed to update movie')
    }
  }

  readonly patch = async (id: string, updates: Partial<Movie>): Promise<Movie> => {
    try {
      // Solo actualizamos en el repositorio local ya que es donde podemos escribir
      const patchedMovie = await this.localRepository.patch(id, updates)
      return patchedMovie
    } catch (error) {
      console.error('Error patching movie in service:', error)
      throw new Error('Failed to patch movie')
    }
  }

  readonly delete = async (id: string): Promise<boolean> => {
    try {
      // Solo eliminamos del repositorio local ya que es donde podemos escribir
      const deleted = await this.localRepository.delete(id)
      return deleted
    } catch (error) {
      console.error('Error deleting movie in service:', error)
      throw new Error('Failed to delete movie')
    }
  }

}
