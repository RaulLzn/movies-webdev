import EnvLocalInterface from "../../../domain/interfaces/EnvLocalInterface";
import env_json from '../../../../../../env/.dbc.json'

/**
 * @class RegisterLocalProvider
 * @description Proveedor de configuración local para registros de estacionamiento.
 * @param env - Objeto que contiene la configuración del entorno.
 */
export default class RegisterLocalProvider {

  private readonly env: EnvLocalInterface

  constructor(){
    this.env = env_json as EnvLocalInterface

    if (!this.env) {
      throw new Error('Invalid register local configuration')
    }
  }

  /**
   * @description Obtiene la ruta de almacenamiento para los registros.
   * @returns {string} - Ruta de almacenamiento.
   */
  readonly PATH = () => this.env.Register.PATH
}
