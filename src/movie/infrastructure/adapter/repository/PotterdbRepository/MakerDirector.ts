import NullDirector from '../../../../domain/model/director/NullDirector'
import Director from '../../../../domain/model/director/Director'

export default class MakerDirector {
  readonly make = (director: string): Director => {
    try {
      if (!director || director.trim() === '') {
        return new NullDirector()
      }

      const id = this.generateDirectorId(director)
      const { names, surnames } = this.parseDirectorName(director)

      return new Director({
        id,
        names,
        surnames,
        reputation: 0, // Default reputation for Potter DB directors
      })
    } catch (error) {
      console.error('Error parsing director:', error)
      return new NullDirector()
    }
  }

  private parseDirectorName = (fullName: string): { names: string; surnames: string } => {
    const nameParts = fullName.split(' ')
    if (nameParts.length === 0 || !nameParts[0]) {
      return { names: '', surnames: '' }
    }

    if (nameParts.length === 1) {
      return { names: nameParts[0], surnames: '' }
    }

    const names = nameParts[0]
    const surnames = nameParts.slice(1).join(' ')
    return { names, surnames }
  }

  private generateDirectorId = (directorName: string): string => {
    return directorName
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
  }
}
