
import { LocalDBC } from '../../../../../shared/Shared'
import LocalRepositoryPort from '../../../../domain/port/driven/adapter/repository/LocalRepositoryPort'
import Movie from '../../../../domain/model/Movie/Movie'
import Classification from '../../../../domain/model/Movie/Classification'
import Genre from '../../../../domain/model/Movie/Genre'
import NullMovie from '../../../../domain/model/Movie/NullMovie'
import { MovieLocalInterface } from '../../../../domain/interfaces/MovieLocalInterface'
import MakerDirectorLocal from './MakeDirectorLocal'
import MakerCharactersLocal from './MakeCharactersLocal'
import MakerProducersLocal from './MakerProducersLocal'
import MakerStudioLocal from './MakerStudioLocal'

export default class LocalRepository implements LocalRepositoryPort {
    private readonly makerDirectorLocal: MakerDirectorLocal
    private readonly makerCharactersLocal: MakerCharactersLocal
    private readonly makerProducersLocal: MakerProducersLocal
    private readonly makerStudioLocal: MakerStudioLocal

    constructor(private readonly localDBC: LocalDBC) {
        this.makerDirectorLocal = new MakerDirectorLocal()
        this.makerCharactersLocal = new MakerCharactersLocal()
        this.makerProducersLocal = new MakerProducersLocal()
        this.makerStudioLocal = new MakerStudioLocal()
    }

    readonly findByTitle = async (title: string): Promise<Movie[]> => {
        const films: MovieLocalInterface[] = await this.localDBC.movies()

        const matchingFilms = films.filter(film => 
            film.title.toLowerCase().includes(title.toLowerCase())
        )

        return Promise.all(
            matchingFilms.map(async (film) => {
                const characters = await this.makerCharactersLocal.make(film.characters)
                const director = await this.makerDirectorLocal.make(film.director)
                const producers = await this.makerProducersLocal.make(film.producers)
                const studio = await this.makerStudioLocal.make(film.studio)

                return new Movie({
                    id: String(film.id),
                    title: film.title,
                    synopsis: film.synopsis,
                    release: new Date(film.release),
                    classification: Classification[film.classification as keyof typeof Classification] || Classification.UNKNOWN,
                    genre: Genre[film.genre as keyof typeof Genre] || Genre.UNKNOWN,
                    characters,
                    director,
                    producers,
                    studio,
                    images: [],
                    trailer: [],
                })
            })
        )
    }

    readonly findById = async (id: string): Promise<Movie> => {
        const films: MovieLocalInterface[] = await this.localDBC.movies()

        const film = films.find((f) => String(f.id) === id)
        if (!film) return new NullMovie()

        const characters = await this.makerCharactersLocal.make(film.characters)
        const director = await this.makerDirectorLocal.make(film.director)
        const producers = await this.makerProducersLocal.make(film.producers)
        const studio = await this.makerStudioLocal.make(film.studio)

        return new Movie({
            id: String(film.id),
            title: film.title,
            synopsis: film.synopsis,
            release: new Date(film.release),
            classification: Classification[film.classification as keyof typeof Classification] || Classification.UNKNOWN,
            genre: Genre[film.genre as keyof typeof Genre] || Genre.UNKNOWN,
            characters,
            director,
            producers,
            studio,
            images: [],
            trailer: [],
        })
    }

    readonly findByIdList = async (ids: string[]): Promise<Movie[]> => {
        const films: MovieLocalInterface[] = await this.localDBC.movies()

        const matchingFilms = films.filter(film => ids.includes(String(film.id)))

        return Promise.all(
            matchingFilms.map(async (film) => {
                const characters = await this.makerCharactersLocal.make(film.characters)
                const director = await this.makerDirectorLocal.make(film.director)
                const producers = await this.makerProducersLocal.make(film.producers)
                const studio = await this.makerStudioLocal.make(film.studio)

                return new Movie({
                    id: String(film.id),
                    title: film.title,
                    synopsis: film.synopsis,
                    release: new Date(film.release),
                    classification: Classification[film.classification as keyof typeof Classification] || Classification.UNKNOWN,
                    genre: Genre[film.genre as keyof typeof Genre] || Genre.UNKNOWN,
                    characters,
                    director,
                    producers,
                    studio,
                    images: [],
                    trailer: [],
                })
            })
        )
    }

    readonly findAll = async (): Promise<Movie[]> => {
        const films: MovieLocalInterface[] = await this.localDBC.movies()

        return Promise.all(
            films.map(async (film) => {
                const characters = await this.makerCharactersLocal.make(film.characters)
                const director = await this.makerDirectorLocal.make(film.director)
                const producers = await this.makerProducersLocal.make(film.producers)
                const studio = await this.makerStudioLocal.make(film.studio)

                return new Movie({
                    id: String(film.id),
                    title: film.title,
                    synopsis: film.synopsis,
                    release: new Date(film.release),
                    classification: Classification[film.classification as keyof typeof Classification] || Classification.UNKNOWN,
                    genre: Genre[film.genre as keyof typeof Genre] || Genre.UNKNOWN,
                    characters,
                    director,
                    producers,
                    studio,
                    images: [],
                    trailer: [],
                })
            })
        )
    }

    readonly save = async (item: Movie): Promise<Movie> => {
        try {
            const films: MovieLocalInterface[] = await this.localDBC.movies()
            
            const maxId = films.length > 0 ? Math.max(...films.map(f => f.id)) : 0
            const newId = maxId + 1
            
            const movieLocalData: MovieLocalInterface = {
                id: newId,
                title: item.getTitle(),
                synopsis: item.getSynopsis(),
                release: item.getRelease() instanceof Date 
                    ? item.getRelease().toISOString()
                    : new Date(item.getRelease()).toISOString(),
                classification: item.getClassification(),
                genre: item.getGenre(),
                characters: item.getCharacters().map(char => ({
                    name: `${char.getNames()} ${char.getSurnames()}`.trim(),
                    biography: 'Character biography', // Placeholder ya que Character no tiene biography
                    category: char.getCategory()
                })),
                director: {
                    name: `${item.getDirector().getNames()} ${item.getDirector().getSurnames()}`.trim(),
                    biography: 'Director biography', // Placeholder ya que Director no tiene biography
                    reputation: item.getDirector().getReputation()
                },
                producers: item.getProducers().map(prod => ({
                    name: `${prod.getNames()} ${prod.getSurnames()}`.trim(),
                    biography: 'Producer biography', // Placeholder ya que Producer no tiene biography
                    role: prod.getRole()
                })),
                studio: {
                    name: item.getStudio().getName(),
                    country: 'Unknown', // Placeholder ya que Studio no tiene country en el dominio
                    foundation: new Date().toISOString() // Placeholder ya que Studio no tiene foundation en el dominio
                },
                images: item.getImages().map(img => ({
                    url: img.getSource(), // Usar source como url
                    description: 'Image description' // Placeholder ya que Image no tiene description
                })),
                trailer: item.getTrailer().map(trail => ({
                    url: trail.getSource(), // Usar source como url
                    description: 'Trailer description', // Placeholder ya que Trailer no tiene description
                    duration: 0 // Placeholder ya que Trailer no tiene duration
                }))
            }
            
            // Usar el método addMovie de LocalDBC para agregar la nueva película
            await this.localDBC.addMovie(movieLocalData)
            
            // Retornar la película guardada con el nuevo ID
            return new Movie({
                id: String(newId),
                title: item.getTitle(),
                synopsis: item.getSynopsis(),
                release: item.getRelease(),
                classification: item.getClassification(),
                genre: item.getGenre(),
                characters: item.getCharacters(),
                director: item.getDirector(),
                producers: item.getProducers(),
                studio: item.getStudio(),
                images: item.getImages(),
                trailer: item.getTrailer()
            })
        } catch (error) {
            console.error('Error saving movie to local repository:', error)
            throw new Error('Failed to save movie to local repository')
        }
    }

    readonly update = async (_item: Movie): Promise<Movie> => {
        // Para un repositorio local, este método podría no estar implementado
        throw new Error('Update method not implemented for LocalRepository')
    }

    readonly patch = async (_id: string, _item: Partial<Movie>): Promise<Movie> => {
        // Para un repositorio local, este método podría no estar implementado
        throw new Error('Patch method not implemented for LocalRepository')
    }

    readonly delete = async (_id: string): Promise<boolean> => {
        // Para un repositorio local, este método podría no estar implementado
        throw new Error('Delete method not implemented for LocalRepository')
    }
}

