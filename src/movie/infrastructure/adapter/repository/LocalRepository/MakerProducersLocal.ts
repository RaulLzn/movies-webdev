import { MovieLocalInterface } from '../../../../domain/interfaces/MovieLocalInterface'
import NullProducer from '../../../../domain/model/producer/NullProducer'
import Producer from '../../../../domain/model/producer/Producer'
import Role from '../../../../domain/model/producer/Role'


export default class MakerProducersLocal {

  readonly make = async (producers: MovieLocalInterface['producers']): Promise<Producer[]> => {

        return Promise.all(
            producers.map(async (producerData) => {
                try {
                    if (!producerData || !producerData.name) {
                        return new NullProducer()
                    }
                    // Split name into names and surnames
                    const nameParts = producerData.name.split(' ')
                    const names = nameParts[0] ?? ''
                    const surnames = nameParts.slice(1).join(' ') ?? ''
                    
                    // Get role from the producerData.role property
                    const role = producerData.role && Role[producerData.role as keyof typeof Role]
                        ? Role[producerData.role as keyof typeof Role]
                        : Role.UNKNOWN

                    return new Producer({
                        id: this.generateProducerId(producerData.name),
                        names,
                        surnames,
                        role,
                    })
                } catch (error) {
                    console.error('Error creating producer:', error)
                    return new NullProducer()
                }
            })
        )
    }

    private generateProducerId(name: string): string {
        return `prod_${name.toLowerCase().replace(/\s+/g, '_')}`
    }
}
