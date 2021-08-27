const express = require("express");
const MoviesService = require("../services/movies");
const {
    movieIdSchema,
    createMovieSchema,
    updateMovieSchema
} = require("../utils/schemas/movies");
const validationHandler = require("../utils/middleware/validationHandler");
const cache = require("../utils/cacheResponse");
const { FIVE_MINUTES_IN_SECONDS, SIXTY_MINUTES_IN_SECONDS } = require("../utils/time");
const cacheResponse = require("../utils/cacheResponse");


function moviesApi(app) {
    const router = express.Router({
        caseSensitive: app.get('case sensitive routing'),
        strict: app.get('strict routing')
    });
    app.use("/api/movies/", router);

    const moviesService = new MoviesService();

    router.get("/", async function (req, res, next) {
        cacheResponse(res, FIVE_MINUTES_IN_SECONDS);
        const { tags } = req.query;


        try {
            const movies = await moviesService.getMovies({ tags });

            res.status(200).json({
                data: movies,
                message: "movies listed"
            })
        } catch (err) {
            next(err);
        }
    });

    router.get('/:MovieId', validationHandler({ MovieId: movieIdSchema }, "params"), async function (req, res, next) {
        cacheResponse(res, SIXTY_MINUTES_IN_SECONDS);
        const MovieId = req.params.MovieId.toString();

        try {
            const movies = await moviesService.getMovie(MovieId);

            res.status(200).json({
                data: movies,
                message: "movie retrieved"
            })
        } catch (err) {
            next(err);
        }
    });

    router.post("/", validationHandler(createMovieSchema), async function (req, res, next) {
        const { body: movie } = req;
        try {
            const createdMovieId = await moviesService.createMovie({ movie });

            res.status(201).json({
                data: createdMovieId,
                message: "movie created"
            })
        } catch (err) {
            next(err);
        }
    });

    router.put("/:MovieId", validationHandler({ MovieId: movieIdSchema }, "params"), validationHandler(updateMovieSchema), async function (req, res, next) {
        const { body: movie } = req;
        const MovieId = req.params.MovieId.toString();
        console.log(MovieId);
        console.log(movie);
        try {
            const updatedMovieId = await moviesService.updateMovie(MovieId, { movie });

            res.status(200).json({
                data: updatedMovieId,
                message: "movie updated"
            })
        } catch (err) {
            next(err);
        }
    });
    router.delete("/:MovieId", validationHandler({ MovieId: movieIdSchema }, "params"), async function (req, res, next) {
        const movieId = req.params.MovieId.toString();
        try {
            const deletedMovieId = await moviesService.deleteMovie(movieId);

            res.status(200).json({
                data: deletedMovieId,
                message: "movie deleted"
            })
        } catch (err) {
            next(err);
        }
    });


}

module.exports = moviesApi;
