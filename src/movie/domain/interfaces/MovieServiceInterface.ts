import Movie from '../model/Movie/Movie'

export default interface MovieServiceInterface {
  findByTitle(title: string): Promise<Movie[]>
  findById(id: number): Promise<Movie>
  findByIdList(ids: number[]): Promise<Movie[]>
  save(movie: Movie): Promise<Movie>
  update(movie: Movie): Promise<Movie>
  patch(id: string, updates: Partial<Movie>): Promise<Movie>
  delete(id: string): Promise<boolean>
}
