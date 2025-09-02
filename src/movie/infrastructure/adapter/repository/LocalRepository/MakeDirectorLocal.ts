import { MovieLocalInterface } from '../../../../domain/interfaces/MovieLocalInterface'
import Director from '../../../../domain/model/director/Director'
import NullDirector from '../../../../domain/model/director/NullDirector'

export default class MakerDirectorLocal{
  readonly make = async (directorData: MovieLocalInterface['director']): Promise<Director> => {
    try {
      if (!directorData || !directorData.name) {
        return new NullDirector()
      }

      // Split the name into names and surnames (assuming single name for simplicity)
      const nameParts = directorData.name.split(' ')
      const names = nameParts[0] || ''
      const surnames = nameParts.slice(1).join(' ') || ''

      return new Director({
        id: this.generateDirectorId(directorData.name),
        names: names,
        surnames: surnames,
        reputation: directorData.reputation
      })
    } catch (error) {
      console.error('Error creating director:', error)
      return new NullDirector()
    }
  }

  private generateDirectorId(name: string): string {
    return `dir_${name.toLowerCase().replace(/\s+/g, '_')}`
  }
}
