import { MovieFilter } from '../../../model/Movie/MovieFilter'
import Movie from '../../../model/Movie/Movie'

export default interface MovieUseCasePort {
  register: (movie: Movie) => Promise<Movie>
  search: (filter: MovieFilter) => Promise<Movie[]>
  getById: (id: string) => Promise<Movie>
  getByIdList: (list: string[]) => Promise<Movie[]>
  update: (movie: Movie) => Promise<Movie>
  patch: (id: string, updates: Partial<Movie>) => Promise<Movie>
  delete: (id: string) => Promise<boolean>
}
