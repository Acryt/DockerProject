import axios from "axios";
import { CategoryType } from "../Utilites/Types";

type ActionType = {
	type: string
	[key: string]: any
}

export const categoryReducer = (state: Array<CategoryType> = [], action: ActionType) => {
	switch (action.type) {
	  case "ADD_CATEGORY":
		 return [...state, action.category];
	  case "SET_CATEGORIES":
		 return action.categories;
	  default:
		 return state;
	}
 };
 
 export const fetchCategories = () => {
	return (dispatch: (arg0: ActionType) => void) => {
	  axios
		 .get("/api/getCategory")
		 .then((res) => {
			if (res.data) {
			  dispatch({
				 type: "SET_CATEGORIES",
				 categories: res.data
			  });
			}
		 })
		 .catch((err) => {
			console.error('Error', err.response?.data?.message);
		 });
	}
 };
 
 export const addCategory = (category: CategoryType) => {
	return (dispatch: (arg0: ActionType) => void) => {
	  axios
		 .post("/api/addCategory", category)
		 .then((res) => {
			if (res.data) {
			  dispatch({
				 type: "ADD_CATEGORY",
				 category: res.data
			  });
			} else {
			  console.error("ADD_CATEGORY action did not return data");
			}
		 })
		 .catch((err) => {
			console.error('Error', err.response?.data?.message);
		 });
	}
 };