import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { post_api } from "../../helpers/consts";
import { RootState } from "../store";
import { ISeries, IMovie } from "../types/types";

interface GetMovieResponse {
    res: IMovie[];
    totalPages: number;
}

interface GetSeriesResponse {
    res: ISeries[];
    totalPages: number;
}

const getTotalPages = async (
    url: string,
    itemsPerPage: number
): Promise<number> => {
    const res = await axios.get(url);
    return Math.ceil(res.data.length / itemsPerPage);
};

export const getOneMovie = createAsyncThunk<IMovie, string>(
    "products/getOneMovie",
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${post_api}/movies/${id}`);
            return response.data as IMovie;
        } catch (error) {
            return rejectWithValue("Failed to fetch movie data");
        }
    }
);
export const getOneSeries = createAsyncThunk<ISeries, string>(
    "products/getOneSeries",
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${post_api}/series/${id}`);
            return response.data as ISeries;
        } catch (error) {
            return rejectWithValue("Failed to load series");
        }
    }
);

export const getMovie = createAsyncThunk<
    GetMovieResponse,
    { search: string; currentPage: number; itemsPerPage: number },
    { state: RootState }
>("products/getMovies", async ({ search, currentPage, itemsPerPage }) => {
    const searchParams = `q=${search}`;
    const paginationParams = `_start=${
        (currentPage - 1) * itemsPerPage
    }&_limit=${itemsPerPage}`;

    const totalItems = await getTotalPages(
        `${post_api}/movies?${searchParams}`,
        itemsPerPage
    );

    const res = await axios.get<IMovie[]>(
        `${post_api}/movies?${paginationParams}&${searchParams}`
    );

    return {
        res: res.data,
        totalPages: totalItems,
    };
});

export const getSeries = createAsyncThunk<
    GetSeriesResponse,
    { search: string; currentPage: number; itemsPerPage: number },
    { state: RootState }
>("products/getSeries", async ({ search, currentPage, itemsPerPage }) => {
    const searchParams = `q=${search}`;
    const paginationParams = `_start=${
        (currentPage - 1) * itemsPerPage
    }&_limit=${itemsPerPage}`;

    const totalItems = await getTotalPages(
        `${post_api}/series?${searchParams}`,
        itemsPerPage
    );

    const res = await axios.get<ISeries[]>(
        `${post_api}/series?${paginationParams}&${searchParams}`
    );

    return {
        res: res.data,
        totalPages: totalItems,
    };
});
