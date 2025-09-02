import NullCharacter from '../../../../domain/model/character/NullCharacter'
import Character from '../../../../domain/model/character/Character'
import Category from '../../../../domain/model/character/Category'

export default class MakerCharacters {
  readonly make = async (characters: string[]): Promise<Character[]> => {
    if (!characters || characters.length === 0) {
      return [new NullCharacter()]
    }

    return characters.map((characterName) => {
      try {
        const id = this.generateCharacterId(characterName)
        const names = this.parseCharacterName(characterName).names
        const surnames = this.parseCharacterName(characterName).surnames
        const category = Category.UNKNOWN

        return new Character({
          id,
          names,
          surnames,
          category,
        })
      } catch (error) {
        console.error('Error parsing character:', error)
        return new NullCharacter()
      }
    })
  }

  private parseCharacterName = (fullName: string): { names: string; surnames: string } => {
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

  private generateCharacterId = (characterName: string): string => {
    return characterName
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
  }
}
