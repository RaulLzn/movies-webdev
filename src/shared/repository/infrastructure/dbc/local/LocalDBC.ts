// LocalDBC - Local Database Connection for JSON file operations
import * as fs from 'fs'
import LocalProvider from './LocalProvider'

export default class LocalDBC {
  private static instance: LocalDBC
  private readonly provider: LocalProvider

  private constructor() {
    this.provider = new LocalProvider()
  }

  static readonly getInstance = (): LocalDBC => {
    LocalDBC.instance = LocalDBC.instance ?? new LocalDBC()
    return LocalDBC.instance
  }

  // Generic method to read any JSON file
  readonly readJson = async (filePath?: string): Promise<any> => {
    const targetPath = filePath ?? this.provider.PATH()
    return new Promise((resolve, reject) => {
      fs.readFile(targetPath, 'utf-8', (err, data) => {
        if (err) {
          reject(err)
          return
        }
        try {
          const json = JSON.parse(data)
          resolve(json)
        } catch (parseError) {
          reject(parseError)
        }
      })
    })
  }

  // Generic method to write any JSON file
  readonly writeJson = async (data: any, filePath?: string): Promise<void> => {
    const targetPath = filePath ?? this.provider.PATH()
    return new Promise((resolve, reject) => {
      const json = JSON.stringify(data, null, 2)
      fs.writeFile(targetPath, json, 'utf-8', (err) => {
        if (err) {
          reject(err)
          return
        }
        resolve()
      })
    })
  }

  // Generic method to update JSON file
  readonly updateJson = async (updates: any, filePath?: string): Promise<void> => {
    try {
      const currentData = await this.readJson(filePath)
      const updatedData = { ...currentData, ...updates }
      await this.writeJson(updatedData, filePath)
    } catch (error) {
      throw error
    }
  }

  // Specific method for movies (following SwapiDBC pattern)
  readonly movies = async (): Promise<any> => {
    return await this.readJson()
  }

  // Method to add a new movie
  readonly addMovie = async (movie: any): Promise<void> => {
    try {
      const currentData = await this.movies()
      const updatedData = Array.isArray(currentData) 
        ? [...currentData, movie]
        : { ...currentData, movies: [...(currentData.movies || []), movie] }
      await this.writeJson(updatedData)
    } catch (error) {
      throw error
    }
  }

  // Method to update a movie by ID
  readonly updateMovie = async (movieId: string | number, updatedMovie: any): Promise<void> => {
    try {
      const currentData = await this.movies()
      if (Array.isArray(currentData)) {
        const movieIndex = currentData.findIndex((movie: any) => movie.id == movieId)
        if (movieIndex !== -1) {
          currentData[movieIndex] = { ...currentData[movieIndex], ...updatedMovie }
          await this.writeJson(currentData)
        } else {
          throw new Error(`Movie with ID ${movieId} not found`)
        }
      } else {
        // Handle object structure
        const movies = currentData.movies || []
        const movieIndex = movies.findIndex((movie: any) => movie.id == movieId)
        if (movieIndex !== -1) {
          movies[movieIndex] = { ...movies[movieIndex], ...updatedMovie }
          await this.writeJson({ ...currentData, movies })
        } else {
          throw new Error(`Movie with ID ${movieId} not found`)
        }
      }
    } catch (error) {
      throw error
    }
  }

  // Method to delete a movie by ID
  readonly deleteMovie = async (movieId: string | number): Promise<void> => {
    try {
      const currentData = await this.movies()
      if (Array.isArray(currentData)) {
        const filteredData = currentData.filter((movie: any) => movie.id != movieId)
        await this.writeJson(filteredData)
      } else {
        const movies = currentData.movies || []
        const filteredMovies = movies.filter((movie: any) => movie.id != movieId)
        await this.writeJson({ ...currentData, movies: filteredMovies })
      }
    } catch (error) {
      throw error
    }
  }
}



// // This file contains utility functions for working with JSON data

// import * as fs from 'fs';

// //Leer Json
// export function readJsonFile(filePath: string): Promise<any> {
//     return new Promise((resolve, reject) => {
//         fs.readFile(filePath, 'utf-8', (err, data) => {
//             if (err) {
//                 reject(err);
//                 return;
//             }
//             try {
//                 const json = JSON.parse(data);
//                 resolve(json);
//             } catch (parseError) {
//                 reject(parseError);
//             }
//         });
//     });
// }

// //Actualizar Json
// export function updateJsonFile(filePath: string, updates: any): Promise<void> {
//     return new Promise(async (resolve, reject) => {
//         try {
//             const data = await readJsonFile(filePath);
//             const updatedData = { ...data, ...updates };
//             await writeJsonFile(filePath, updatedData);
//             resolve();
//         } catch (error) {
//             reject(error);
//         }
//     });
// }

// //Escribir Json
// export function writeJsonFile(filePath: string, data: any): Promise<void> {
//     return new Promise((resolve, reject) => {
//         const json = JSON.stringify(data, null, 2);
//         fs.writeFile(filePath, json, 'utf-8', (err) => {
//             if (err) {
//                 reject(err);
//                 return;
//             }
//             resolve();
//         });
//     });
// }