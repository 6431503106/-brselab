import { apiSlice } from './apiSlice';
import { CATEGORIES_URL } from '../constants';

export const categoriesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: () => ({
        url: CATEGORIES_URL,
        method: 'GET',
      }),
      providesTags: ['Category'],
    }),
    createCategory: builder.mutation({
      query: (category) => ({
        url: CATEGORIES_URL,
        method: 'POST',
        body: category,
      }),
      invalidatesTags: ['Category'],
    }),
    deleteCategory: builder.mutation({
      query: (category) => ({
        url: CATEGORIES_URL,
        method: 'DELETE',
        body: category,
      }),
      invalidatesTags: ['Category'],
    }),
  }),
});

export const { useGetCategoriesQuery, useCreateCategoryMutation, useDeleteCategoryMutation } = categoriesApiSlice;
