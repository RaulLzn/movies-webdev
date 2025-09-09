    import ServerFactory from './api/infrastructure/adapter/api/factory/ServerFactory'
    import MovieRouterFactory from './movie/infrastructure/adapter/api/factory/MovieRouterFactory'
    import ParkingRouterFactory from './estacionamiento/infrastructure/adapter/api/factory/ParkingRouterFactory'


    const movieRouter = MovieRouterFactory.create()
    const parkingRouter = ParkingRouterFactory.create()

    const server = ServerFactory.create([movieRouter, parkingRouter])

    server.start()
