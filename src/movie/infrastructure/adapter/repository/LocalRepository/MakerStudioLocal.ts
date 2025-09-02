import { MovieLocalInterface } from '../../../../domain/interfaces/MovieLocalInterface'
import Studio from '../../../../domain/model/studio/Studio'
import NullStudio from '../../../../domain/model/studio/NullStudio'

export default class MakerStudioLocal {
  readonly make = async (studioData: MovieLocalInterface['studio']): Promise<Studio> => {
    try {
      if (!studioData || !studioData.name) {
        return new NullStudio()
      }

      return new Studio({
        id: this.generateStudioId(studioData.name),
        name: studioData.name
      })
    } catch (error) {
      console.error('Error creating studio:', error)
      return new NullStudio()
    }
  }

  private generateStudioId(name: string): string {
    return `studio_${name.toLowerCase().replace(/\s+/g, '_')}`
  }
}
