import EnvLocalInterface from "../../../domain/interfaces/EnvLocalInterface";
import env_json from '../../../../../../env/.dbc.json'

export default class LocalProvider {

  private readonly env: EnvLocalInterface

  constructor(){
    this.env = env_json as EnvLocalInterface

    if (!this.env) {
      throw new Error('Invalid loca configuration')
    }
  }

    readonly PATH = () => this.env.Local.PATH
}