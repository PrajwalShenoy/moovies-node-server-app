import axios from 'axios';
import "dotenv/config";

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

    app.get("/api/movies/newmovies", getNewMovies);
    app.get("/api/movies/genre/action", getActionMovies);
    app.get("/api/movies/genre/comedy", getComedyMovies);
    app.get("/api/movies/genre/thriller", getThrillerMovies);
}

export default MoviesRoutes;


