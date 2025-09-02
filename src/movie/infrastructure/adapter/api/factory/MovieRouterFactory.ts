import { SwapiDBC, PotterDBC, LocalDBC } from '../../../../../shared/Shared'
import MovieService from '../../../../application/service/MovieService'
import MovieUseCase from '../../../../application/usecase/MovieUseCase'
import AbstractMovieRouter from '../../../../domain/api/AbstractMovieRouter'
import SwapiRepository from '../../repository/SwapiRepository/SwapiRepository'
import LocalRepository from '../../repository/LocalRepository/LocalRepository'
import PotterRepository from '../../repository/PotterdbRepository/PotterdbRepository'
import MovieController from '../controller/MovieController'
import MovieRecorderController from '../controller/MovieRecorderController'
import MovieSeekerController from '../controller/MovieSeekerController'
import MovieUpdaterController from '../controller/MovieUpdaterController'
import MovieRouter from '../router/MovieRouter'

export default class MovieRouterFactory {
  static readonly create = (): AbstractMovieRouter => {

    const swapiDBC = SwapiDBC.getInstance()
    if (!swapiDBC) {
      throw new Error('Failed to create SwapiDBC')
    }

    const swapiRepository = new SwapiRepository(swapiDBC)
    if (!swapiRepository) {
      throw new Error('Failed to create SwapiRepository')
    }

    const localDBC = LocalDBC.getInstance()
    const localRepository = new LocalRepository(localDBC)
    if (!localRepository) {
      throw new Error('Failed to create LocalRepository')
    }

    const potterDBC = PotterDBC.getInstance()
    if (!potterDBC) {
      throw new Error('Failed to create PotterDBC')
    }

    const potterRepository = new PotterRepository(potterDBC)
    if (!potterRepository) {
      throw new Error('Failed to create PotterRepository')
    }

    const movieService = new MovieService(swapiRepository, potterRepository, localRepository)
    if (!movieService) {
      throw new Error('Failed to create MovieService')
    }

    const movieUseCase = new MovieUseCase(movieService)
    if (!movieUseCase) {
      throw new Error('Failed to create MovieUseCase')
    }

    const movieController = new MovieController(movieUseCase)
    if (!movieController) {
      throw new Error('Failed to create MovieController')
    }

    const movieSeekerController = new MovieSeekerController(movieUseCase)
    if (!movieSeekerController) {
      throw new Error('Failed to create MovieSeekerController')
    }

    const movieRecorderController = new MovieRecorderController(movieUseCase)
    if (!movieRecorderController) {
      throw new Error('Failed to create MovieRecorderController')
    }

    const movieUpdaterController = new MovieUpdaterController(movieUseCase)
    if (!movieUpdaterController) {
      throw new Error('Failed to create MovieUpdaterController')
    }

    const movieRouter = new MovieRouter(
      movieController,
      movieSeekerController,
      movieRecorderController,
      movieUpdaterController
    )
    if (!movieRouter) {
      throw new Error('Failed to create MovieRouter')
    }

    return movieRouter
  }
}
