
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

        return Promise.all(
            films.map(async (film) => {
                if (film.title.toLowerCase().includes(title.toLowerCase())) {
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
                return new NullMovie()
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

        return Promise.all(
            films.map(async (film) => {
                if (ids.includes(String(film.id))) {
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
                return new NullMovie()
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

    readonly save = async (_item: Movie): Promise<Movie> => {
        // Para un repositorio local, este método podría no estar implementado
        // o podría escribir al archivo JSON, pero eso sería complejo
        throw new Error('Save method not implemented for LocalRepository')
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

