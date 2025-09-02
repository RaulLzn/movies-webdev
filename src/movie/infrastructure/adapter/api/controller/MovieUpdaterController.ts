import { Request, Response } from 'express'

import AbstractMovieController from '../../../../domain/api/AbstractMovieController'
import Movie from '../../../../domain/model/Movie/Movie'
import MovieUseCasePort from '../../../../domain/port/driver/usecase/MovieUseCasePort'
import Character from '../../../../domain/model/character/Character'
import Director from '../../../../domain/model/director/Director'
import Producer from '../../../../domain/model/producer/Producer'
import Studio from '../../../../domain/model/studio/Studio'
import Image from '../../../../domain/model/image/Image'
import Trailer from '../../../../domain/model/trailer/Trailer'
import Classification from '../../../../domain/model/Movie/Classification'
import Genre from '../../../../domain/model/Movie/Genre'
import Category from '../../../../domain/model/character/Category'
import Role from '../../../../domain/model/producer/Role'

export default class MovieUpdaterController extends AbstractMovieController {
  constructor(private readonly movieUseCase: MovieUseCasePort) {
    super()
  }

  readonly update = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    const movieData = req.body

    if (!id) {
      res.status(this.HTTPStatusCode.BAD_REQUEST).json({
        error: 'Movie ID is required'
      })
      return
    }

    const requiredFields = [
      'title',
      'synopsis',
      'release',
      'classification',
      'genre',
      'characters',
      'director',
      'producers',
      'studio',
    ]

    for (const field of requiredFields) {
      if (!movieData[field]) {
        res.status(this.HTTPStatusCode.BAD_REQUEST).json({
          error: `${
            field.charAt(0).toUpperCase() + field.slice(1)
          } is required`,
        })
        return
      }
    }

    try {
      // Crear los objetos del dominio correctamente
      const characters = movieData.characters.map((char: any) => new Character({
        id: char.id,
        names: char.names,
        surnames: char.surnames,
        category: Category[char.category as keyof typeof Category] || Category.UNKNOWN
      }))

      const director = new Director({
        id: movieData.director.id,
        names: movieData.director.names,
        surnames: movieData.director.surnames,
        reputation: movieData.director.reputation
      })

      const producers = movieData.producers.map((prod: any) => new Producer({
        id: prod.id,
        names: prod.names,
        surnames: prod.surnames,
        role: Role[prod.role as keyof typeof Role] || Role.UNKNOWN
      }))

      const studio = new Studio({
        id: movieData.studio.id,
        name: movieData.studio.name
      })

      const images = movieData.images.map((img: any) => new Image({
        id: img.id,
        thumbnails: img.thumbnails || '',
        source: img.source || ''
      }))

      const trailers = movieData.trailer.map((trail: any) => new Trailer({
        id: trail.id,
        source: trail.source
      }))

      const movieDomain = new Movie({
        id: id, // Usar el ID de la URL
        title: movieData.title,
        synopsis: movieData.synopsis,
        release: new Date(movieData.release),
        classification: Classification[movieData.classification as keyof typeof Classification] || Classification.UNKNOWN,
        genre: Genre[movieData.genre as keyof typeof Genre] || Genre.UNKNOWN,
        characters,
        director,
        producers,
        studio,
        images,
        trailer: trailers
      })

      const movieUpdated = await this.movieUseCase.update(movieDomain)

      if (movieUpdated.isNull) {
        res.status(this.HTTPStatusCode.NOT_FOUND).json({
          error: 'Movie not found or could not be updated'
        })
        return
      }

      res.status(this.HTTPStatusCode.OK).json(movieUpdated)
    } catch (error) {
      console.error('Internal Server Error: update ', error)
      res
        .status(this.HTTPStatusCode.INTERNAL_SERVER_ERROR)
        .json({ error: 'Internal Server Error' })
    }
  }

  readonly patch = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    const updates = req.body

    if (!id) {
      res.status(this.HTTPStatusCode.BAD_REQUEST).json({
        error: 'Movie ID is required'
      })
      return
    }

    if (!updates || Object.keys(updates).length === 0) {
      res.status(this.HTTPStatusCode.BAD_REQUEST).json({
        error: 'At least one field must be provided for update'
      })
      return
    }

    try {
      // Para PATCH, creamos un objeto Movie parcial con solo los campos que se van a actualizar
      // Nota: Esta implementación es simplificada. En una implementación más robusta,
      // necesitarías manejar cada campo individualmente
      
      const movieUpdated = await this.movieUseCase.patch(id, updates)

      if (movieUpdated.isNull) {
        res.status(this.HTTPStatusCode.NOT_FOUND).json({
          error: 'Movie not found or could not be updated'
        })
        return
      }

      res.status(this.HTTPStatusCode.OK).json(movieUpdated)
    } catch (error) {
      console.error('Internal Server Error: patch ', error)
      res
        .status(this.HTTPStatusCode.INTERNAL_SERVER_ERROR)
        .json({ error: 'Internal Server Error' })
    }
  }

  readonly delete = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params

    if (!id) {
      res.status(this.HTTPStatusCode.BAD_REQUEST).json({
        error: 'Movie ID is required'
      })
      return
    }

    try {
      const deleted = await this.movieUseCase.delete(id)

      if (!deleted) {
        res.status(this.HTTPStatusCode.NOT_FOUND).json({
          error: 'Movie not found or could not be deleted'
        })
        return
      }

      res.status(this.HTTPStatusCode.OK).json({
        message: 'Movie deleted successfully',
        id: id
      })
    } catch (error) {
      console.error('Internal Server Error: delete ', error)
      res
        .status(this.HTTPStatusCode.INTERNAL_SERVER_ERROR)
        .json({ error: 'Internal Server Error' })
    }
  }
}
