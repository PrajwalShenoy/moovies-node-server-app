import axios from 'axios';
import "dotenv/config";
import * as dao from "../Users/dao.js";

function MoviesRoutes(app) {

    const BASE_URL = process.env.BASE_URL;
    const API_KEY = process.env.API_KEY;
    const headers = {
        Authorization: `Bearer ${API_KEY}`,
    };

    const getCurrentDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    };

    const getNewMovies = async (req, res) => {
        let params = {
            include_adult: false,
            include_video: false,
            language: "en-US",
            page: 1,
            "primary_release_date.lte": getCurrentDate(),
            region: "US",
            sort_by: "primary_release_date.desc",
            "vote_count.gte": 100,
        };
        const response = await axios.get(`${BASE_URL}/discover/movie`, {
            headers,
            params
        });
        res.json(response.data);
    };

    const getActionMovies = async (req, res) => {
        let params = {
            include_adult: false,
            include_video: false,
            language: "en-US",
            page: 1,
            "primary_release_date.lte": getCurrentDate(),
            region: "US",
            sort_by: "primary_release_date.desc",
            "vote_count.gte": 100,
            with_genres: 28
        };
        const response = await axios.get(`${BASE_URL}/discover/movie`, {
            headers,
            params
        });
        res.json(response.data);
    };

    const getComedyMovies = async (req, res) => {
        let params = {
            include_adult: false,
            include_video: false,
            language: "en-US",
            page: 1,
            "primary_release_date.lte": getCurrentDate(),
            region: "US",
            sort_by: "primary_release_date.desc",
            "vote_count.gte": 100,
            with_genres: 35
        };
        const response = await axios.get(`${BASE_URL}/discover/movie`, {
            headers,
            params
        });
        res.json(response.data);
    };

    const getThrillerMovies = async (req, res) => {
        let params = {
            include_adult: false,
            include_video: false,
            language: "en-US",
            page: 1,
            "primary_release_date.lte": getCurrentDate(),
            region: "US",
            sort_by: "primary_release_date.desc",
            "vote_count.gte": 100,
            with_genres: 53
        };
        const response = await axios.get(`${BASE_URL}/discover/movie`, {
            headers,
            params
        });
        res.json(response.data);
    };

    // const getMovieById = async (req, res) => {
    //     const { id } = req.params;
    //     const response = await axios.get(`${BASE_URL}/movie/${id}`, {
    //         headers
    //     });
    //     res.json(response.data);
    // }

    const getMovieById = async (req, res) => {
        const { id } = req.params;
        const response = await helperGetMovieById(id);
        res.json(response.data);
    }

    const helperGetMovieById = async (id) => {
        const response = await axios.get(`${BASE_URL}/movie/${id}`, {
            headers
        });
        return response;
    };

    const addMovieToPlaylist = async (req, res) => {
        const { movieId } = req.body;
        const { id } = req.session['currentUser'];
        await dao.addToWatchlist(id, movieId);
        req.session['currentUser'].watchlist.push(movieId);
        res.status(200).send("Movie added to watchlist");
    };

    const removeMovieFromPlaylist = async (req, res) => {
        console.log(req.params);
        const { movieId } = req.params;
        const { id } = req.session['currentUser'];
        await dao.removeFromWatchlist(id, movieId);
        req.session['currentUser'].watchlist = req.session['currentUser'].watchlist.filter((m) => m !== movieId);
        res.status(200).send("Movie removed from watchlist");
    }

    const getWatchlist = async (req, res) => {
        const { id } = req.session['currentUser'];
        const response = await dao.getWatchlist(id);
        res.json(response);
    };

    const getWatchlistDetails = async (req, res) => {
        const list = await dao.getWatchlist(req.params.id);
        const response = [];
        for (let i = 0; i < list['watchlist'].length; i++) {
            const movie = await helperGetMovieById(list['watchlist'][i]);
            response.push(movie.data);
        }
        res.json(response);
    };

    const searchMovieRequest = async (req, res) => {
        const { query } = req.query;
        let params = {
            include_adult: false,
            language: "en-US",
            page: 1,
            query: query,
        };
        const response = await axios.get(`${BASE_URL}/search/movie`, {
            headers,
            params
        });
        console.log(response.data);
        res.json(response.data);
    };


    app.get("/api/search", searchMovieRequest);
    app.post("/api/watchlist", addMovieToPlaylist);
    app.delete("/api/watchlist/:movieId", removeMovieFromPlaylist);
    app.get("/api/watchlist", getWatchlist);
    app.get("/api/watchlist/:id", getWatchlistDetails);
    app.get("/api/movies/newmovies", getNewMovies);
    app.get("/api/movies/:id", getMovieById);
    app.get("/api/movies/genre/action", getActionMovies);
    app.get("/api/movies/genre/comedy", getComedyMovies);
    app.get("/api/movies/genre/thriller", getThrillerMovies);
}

export default MoviesRoutes;


