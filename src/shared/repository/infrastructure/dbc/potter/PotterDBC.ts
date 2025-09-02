import PotterProvider from './PotterProvider'

export default class PotterDBC {
  private static instance: PotterDBC
  private readonly provider: PotterProvider

  private constructor() {
    this.provider = new PotterProvider()
  }

  static readonly getInstance = (): PotterDBC => {
    PotterDBC.instance = this.instance ?? new PotterDBC()
    return PotterDBC.instance
  }

  readonly get = async (endpoint: string) => {
    const response = await fetch(endpoint)
    return await response.json()
  }

  readonly queryByPath = async (queryString: string) => {
    const url = `${this.provider.URL()}${queryString}`
    const response = await fetch(url)
    return await response.json()
  }

  readonly movies = async () => {
    const response = await this.queryByPath('/movies')
    return response.data
  }
}
