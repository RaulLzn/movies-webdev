import { MovieFilter } from '../../domain/model/Movie/MovieFilter'
import Movie from '../../domain/model/Movie/Movie'
import NullMovie from '../../domain/model/Movie/NullMovie'
import MovieUseCasePort from '../../domain/port/driver/usecase/MovieUseCasePort'
import MovieServiceInterface from '../../domain/interfaces/MovieServiceInterface'

export default class MovieUseCase implements MovieUseCasePort {
  constructor(private readonly movieService: MovieServiceInterface) {}

  // TODO: implement
  readonly register = async (movie: Movie): Promise<Movie> => {
    try {
      // Validar que la película no sea null
      if (movie.isNull) {
        return new NullMovie()
      }

      // Guardar la película usando el servicio
      const savedMovie = await this.movieService.save(movie)
      
      return savedMovie
    } catch (error) {
      console.error('Error registering movie in use case:', error)
      return new NullMovie()
    }
  }

  readonly search = async (filter: MovieFilter): Promise<Movie[]> => {
    const title = filter.title ?? ''

    const movies = await this.movieService.findByTitle(title)

    return movies
  }

  readonly getById = async (_id: string): Promise<Movie> => {
    const id = parseInt(_id, 10)
    if (Number.isNaN(id)) {
      return Promise.resolve(new NullMovie())
    }

    const movie = await this.movieService.findById(id)

    return movie
  }

  readonly getByIdList = async (_list: string[]): Promise<Movie[]> => {
    const ids = _list.map(id => parseInt(id, 10)).filter(id => !Number.isNaN(id))
    if (ids.length === 0) {
      return Promise.resolve([new NullMovie()])
    }
    const moviesById = await this.movieService.findByIdList(ids)
    return moviesById
  }

  readonly update = async (movie: Movie): Promise<Movie> => {
    try {
      // Validar que la película no sea null
      if (movie.isNull) {
        return new NullMovie()
      }

      // Actualizar la película usando el servicio
      const updatedMovie = await this.movieService.update(movie)
      
      return updatedMovie
    } catch (error) {
      console.error('Error updating movie in use case:', error)
      return new NullMovie()
    }
  }

  readonly patch = async (id: string, updates: Partial<Movie>): Promise<Movie> => {
    try {
      // Validar que el ID sea válido
      if (!id || id.trim() === '') {
        return new NullMovie()
      }

      // Actualizar parcialmente la película usando el servicio
      const patchedMovie = await this.movieService.patch(id, updates)
      
      return patchedMovie
    } catch (error) {
      console.error('Error patching movie in use case:', error)
      return new NullMovie()
    }
  }

  readonly delete = async (id: string): Promise<boolean> => {
    try {
      // Validar que el ID sea válido
      if (!id || id.trim() === '') {
        return false
      }

      // Eliminar la película usando el servicio
      const deleted = await this.movieService.delete(id)
      
      return deleted
    } catch (error) {
      console.error('Error deleting movie in use case:', error)
      return false
    }
  }
}
