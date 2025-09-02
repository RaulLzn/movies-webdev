
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

    readonly update = async (item: Movie): Promise<Movie> => {
        try {
            const movieId = item.getId()
            
            // Convertir la película de dominio a formato de interfaz local
            const movieLocalData: MovieLocalInterface = {
                id: parseInt(movieId),
                title: item.getTitle(),
                synopsis: item.getSynopsis(),
                release: item.getRelease() instanceof Date 
                    ? item.getRelease().toISOString()
                    : new Date(item.getRelease()).toISOString(),
                classification: item.getClassification(),
                genre: item.getGenre(),
                characters: item.getCharacters().map(char => ({
                    name: `${char.getNames()} ${char.getSurnames()}`.trim(),
                    biography: 'Character biography',
                    category: char.getCategory()
                })),
                director: {
                    name: `${item.getDirector().getNames()} ${item.getDirector().getSurnames()}`.trim(),
                    biography: 'Director biography',
                    reputation: item.getDirector().getReputation()
                },
                producers: item.getProducers().map(prod => ({
                    name: `${prod.getNames()} ${prod.getSurnames()}`.trim(),
                    biography: 'Producer biography',
                    role: prod.getRole()
                })),
                studio: {
                    name: item.getStudio().getName(),
                    country: 'Unknown',
                    foundation: new Date().toISOString()
                },
                images: item.getImages().map(img => ({
                    url: img.getSource(),
                    description: 'Image description'
                })),
                trailer: item.getTrailer().map(trail => ({
                    url: trail.getSource(),
                    description: 'Trailer description',
                    duration: 0
                }))
            }
            
            // Usar el método updateMovie de LocalDBC
            await this.localDBC.updateMovie(movieId, movieLocalData)
            
            // Retornar la película actualizada
            return item
        } catch (error) {
            console.error('Error updating movie in local repository:', error)
            throw new Error('Failed to update movie in local repository')
        }
    }

    readonly patch = async (id: string, item: Partial<Movie>): Promise<Movie> => {
        try {
            // Primero obtenemos la película actual
            const currentMovie = await this.findById(id)
            if (currentMovie.isNull) {
                throw new Error(`Movie with ID ${id} not found`)
            }
            
            // Crear una nueva película con los campos actualizados
            const updatedMovie = new Movie({
                id: currentMovie.getId(),
                title: item.getTitle?.() ?? currentMovie.getTitle(),
                synopsis: item.getSynopsis?.() ?? currentMovie.getSynopsis(),
                release: item.getRelease?.() ?? currentMovie.getRelease(),
                classification: item.getClassification?.() ?? currentMovie.getClassification(),
                genre: item.getGenre?.() ?? currentMovie.getGenre(),
                characters: item.getCharacters?.() ?? currentMovie.getCharacters(),
                director: item.getDirector?.() ?? currentMovie.getDirector(),
                producers: item.getProducers?.() ?? currentMovie.getProducers(),
                studio: item.getStudio?.() ?? currentMovie.getStudio(),
                images: item.getImages?.() ?? currentMovie.getImages(),
                trailer: item.getTrailer?.() ?? currentMovie.getTrailer()
            })
            
            // Usar el método update para guardar los cambios
            return await this.update(updatedMovie)
        } catch (error) {
            console.error('Error patching movie in local repository:', error)
            throw new Error('Failed to patch movie in local repository')
        }
    }

    readonly delete = async (id: string): Promise<boolean> => {
        try {
            // Verificar que la película existe antes de eliminarla
            const movie = await this.findById(id)
            if (movie.isNull) {
                return false // La película no existe
            }
            
            // Usar el método deleteMovie de LocalDBC
            await this.localDBC.deleteMovie(id)
            
            return true // Eliminación exitosa
        } catch (error) {
            console.error('Error deleting movie from local repository:', error)
            throw new Error('Failed to delete movie from local repository')
        }
    }
}

