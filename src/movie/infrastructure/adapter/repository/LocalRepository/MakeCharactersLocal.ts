import LocalDBC from '../../../../../shared/repository/infrastructure/dbc/local/LocalDBC'
import { LocalCharacterInterface } from '../../../../domain/interfaces/MovieLocalInterface'
import Category from '../../../../domain/model/character/Category'
import Character from '../../../../domain/model/character/Character'
import NullCharacter from '../../../../domain/model/character/NullCharacter'

export default class MakerCharactersLocal {
  // LocalDBC no es necesario en este caso porque los datos ya están completos
  //constructor(_localDBC: LocalDBC) {}

  readonly make = async (characters: LocalCharacterInterface[]): Promise<Character[]> => {
    return Promise.all(
      characters.map(async (characterData) => {
        try {
          // Los datos ya están completos en local.json, no necesitamos fetch adicional
          if (!characterData || !characterData.name) {
            return new NullCharacter()
          }

          // Dividir el nombre en nombres y apellidos
          const nameParts = characterData.name.trim().split(' ')
          const names = nameParts[0] || ''
          const surnames = nameParts.slice(1).join(' ') || '' // Maneja múltiples apellidos

          // Mapear la categoría del JSON a nuestro enum
          const category = this.mapCategory(characterData.category)

          return new Character({
            id: this.generateCharacterId(characterData.name),
            names,
            surnames,
            category
          })
        } catch (error) {
          console.error('Error creating character:', error)
          return new NullCharacter()
        }
      })
    )
  }

  private mapCategory(categoryString: string): Category {
    switch (categoryString?.toUpperCase()) {
      case 'MAIN':
      case 'PROTAGONIST':
        return Category.PROTAGONIST
      case 'ANTAGONIST':
        return Category.ANTAGONIST
      case 'SECONDARY':
        return Category.UNKNOWN // Podrías agregar SECONDARY al enum si lo necesitas
      default:
        return Category.UNKNOWN
    }
  }

  private generateCharacterId(name: string): string {
    // Genera un ID único basado en el nombre
    // Podrías usar una función hash más sofisticada si es necesario
    return `char_${name.toLowerCase().replace(/\s+/g, '_')}`
  }
}
