import Movie from '../model/Movie/Movie'

export default interface MovieServiceInterface {
  findByTitle(title: string): Promise<Movie[]>
  findById(id: number): Promise<Movie>
  findByIdList(ids: number[]): Promise<Movie[]>
}
