import { createSlice } from "@reduxjs/toolkit";
import { TFilterSliceState } from "../../types/productTypes";
import { RootState } from "../store";

const initialState : TFilterSliceState = {
  categoryId: 0,
  sort: {
    name: "популярности ↓",
    sortProperty: "rating",
  },
  sortOpened: false,
  categoryOpened: false,
  searchValue: "",
};

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    changeCategory: (state, action) => {
      state.categoryId = action.payload;
    },
    changeSortType: (state, action) => {
      state.sort = action.payload;
    },
    setFilters: (state, action) => {
      state.categoryId = Number(action.payload.categoryId);
      state.sort = action.payload.sort;
    },
    toggleSortPopup: (state) => {
      state.sortOpened = !state.sortOpened;
      state.categoryOpened = false;
    },
    toggleCategoryPopup: (state) => {
      state.categoryOpened = !state.categoryOpened;
      state.sortOpened = false;
    },
    setSearchValue: (state, action) => {
      state.searchValue = action.payload;
    },
  },
});

export const selectFilter = (state: RootState) => state.filter;

export const {
  changeCategory,
  changeSortType,
  setFilters,
  toggleSortPopup,
  toggleCategoryPopup,
  setSearchValue,
} = filterSlice.actions;

export default filterSlice.reducer;
