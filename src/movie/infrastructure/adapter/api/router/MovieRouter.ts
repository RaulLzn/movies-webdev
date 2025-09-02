import AbstractMovieRouter from '../../../../domain/api/AbstractMovieRouter'
import MovieController from '../controller/MovieController'
import MovieRecorderController from '../controller/MovieRecorderController'
import MovieSeekerController from '../controller/MovieSeekerController'
import MovieUpdaterController from '../controller/MovieUpdaterController'

export default class MovieRouter extends AbstractMovieRouter {
  constructor(
    private readonly movieController: MovieController,
    private readonly movieSeekerController: MovieSeekerController,
    private readonly movieRecorderController: MovieRecorderController,
    private readonly movieUpdaterController: MovieUpdaterController
  ) {
    super('/movies-data')
    this.routes()
  }

  protected override routes = (): void => {
    this.movieRoutes()
    this.listRoutes()
  }

  private readonly movieRoutes = (): void => {
    this.router.get('/movie/search', this.movieSeekerController.search)
    this.router.get('/movie/:id', this.movieController.getById)
    this.router.post('/movie', this.movieRecorderController.create)
    this.router.put('/movie/:id', this.movieUpdaterController.update)
    this.router.patch('/movie/:id', this.movieUpdaterController.patch)
    this.router.delete('/movie/:id', this.movieUpdaterController.delete)
    //this.router.get('/movie/', this.movieSeekerController.search)
  }

  private readonly listRoutes = (): void => {
    this.router.get('/list/:idList', this.movieController.getByIdList)
    this.router.get('/list/', this.movieSeekerController.search)
  }

  
}
