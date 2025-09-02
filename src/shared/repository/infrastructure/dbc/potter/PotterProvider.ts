import env_json from '../../../../../../env/.dbc.json'
import EnvPotterdbInterface from '../../../domain/interfaces/EnvPotterdbInterface'

export default class PotterProvider {
  private readonly env: EnvPotterdbInterface

  constructor() {
    this.env = env_json as EnvPotterdbInterface

    if (!this.env) {
      throw new Error('Invalid POTTER configuration')
    }
  }

  readonly URL = () => this.env.POTTER.URL
}
