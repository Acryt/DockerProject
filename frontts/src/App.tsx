import classes from "./App.module.scss";

// React
import React, { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import axios, { AxiosResponse } from "axios";
import { v4 } from "uuid";

// Components
import Header from "./Organisms/Header/Header";
import Main from "./Organisms/Main/Main";
import Footer from "./Organisms/Footer/Footer";
import Menu from "./Molecules/Menu/Menu";
import Form from "./Molecules/Form/Form";
import Button from "./Atoms/Button/Button";
import Sidebar from "./Molecules/Sidebar/Sidebar";
import Center from "./Organisms/Center/Center";
import CategoryCard from "./Molecules/CategoryCard/CategoryCard";
import TicketsContainer from "./Organisms/TicketsContainer/TicketsContainer";
import CategoriesContainer from "./Organisms/CategoriesContainer/CategoriesContainer";
import CandidatesContainer from "./Organisms/CandidatesContainer/CandidatesContainer";
import Option from "./Atoms/Option/Option";
import Input from "./Atoms/Input/Input";
import Select from "./Atoms/Select/Select";

// Types
import {
	ViewType,
	StateType,
	FilterStateType,
	ActiveCandidate,
	CategoryType,
	CandidateType,
	TicketType,
} from "./Utilites/Types";
import CandidateCard from "./Molecules/CandidateCard/CandidateCard";
import TicketCard from "./Molecules/TicketCard/TicketCard";

function App() {
	const [state, setState] = useState<StateType>([]);
	useEffect(() => {
		console.log("useEffect");
		let promise = axios.get("/api/getData");
		promise.then((res: AxiosResponse<any>) => {
			if (res.data) {
				setState(res.data);
			}
		});
		console.log("axios done");
	}, []);
	function addCategory(category: CategoryType) {
		console.log("addCategory");
		axios
			.post("/api/addCategory", category)
			.then((res) => (category = { ...category, _id: res.data._id }))
			.then(() => setState([...state, category]))
			.then(() => setActiveCategory(category))
			.then(() => console.log("add done id=" + category._id))
			.catch((err) => console.log(err));
	}
	function removeCategory(id: string) {
		console.log("removeCategory");
		let s = state.filter((category) => id !== category._id);
		axios
			.delete("/api/deleteCategory", { data: { id: id } })
			.then(() => setState(s))
			.then(() => console.log("rem done id=" + id));
		setState(s);
	}

	const [view, setView] = useState<ViewType>("categories");
	const [categoryFilter, setCategoryFilter] = useState<FilterStateType>("all");
	let filteredState: StateType = state;
	const [activeCategory, setActiveCategory] = useState<
		CategoryType | undefined
	>(state[0] ? state[state.length - 1] : undefined);

	function changeActiveCategory(e: any) {
		console.log("changeActiveCategory");
		const activeCategory = state.find(
			(category) => category._id === e.target.value
		);
		if (activeCategory) {
			setActiveCategory(activeCategory);
		} else {
			console.log("Голосование не найдено");
		}
	}

	const [activeCandidate, setActiveCandidate] = useState<ActiveCandidate>("");
	async function addCandidate(candidate: CandidateType) {
		console.log("addCandidate");
		axios
			.post("/api/addCandidate", candidate)
			.then((res) => {
				const s = state.filter(
					(category) => category._id !== candidate.categoryId
				);
				s.push(res.data! as CategoryType);
				setState(s);
			})
			.catch((err) => console.log(err));
	}
	function deleteCandidate(categoryId: string, id: string) {
		console.log("deleteCandidate");
		axios
			.delete("/api/deleteCandidate", {
				data: { categoryId: categoryId, id: id },
			})
			.then((res) => {
				const s = state.filter((category) => category._id !== res.data._id);
				s.push(res.data! as CategoryType);
				setState(s);
			})
			.catch((err) => console.log(err));
	}

	function changeActiveCandidate(e: any) {
		console.log(e.target.value);
		setActiveCandidate(e.target.value);
	}
	function changeView(view: ViewType) {
		setView(view);
	}
	if (categoryFilter !== "all") {
		filteredState = state.filter(
			(category) => category.status === categoryFilter
		);
	}
	function filterCategories(status: FilterStateType) {
		setCategoryFilter(status);
		filteredState = state.filter((category) => category.status === status);
	}

	async function addTicket(ticket: TicketType) {
		console.log("addTicket");
		axios
			.post("/api/addTicket", ticket)
			.then((res) => {
				console.log(res.data);
				return res;
			})
			.then((res) => {
				const s = state.filter((category) => category._id !== res.data._id);
				s.push(res.data! as CategoryType);
				console.log(s);
				setState(s);
			})
			.catch((err) => console.log(err));
	}

	function deleteTicket(categoryId: string, id: any) {
		console.log(categoryId);
		console.log(id);
		axios
			.delete("/api/deleteTicket", {
				data: { categoryId: categoryId, id: id },
			})
			.then((res) => {
				const s = state.filter((category) => category._id !== res.data._id);
				s.push(res.data! as CategoryType);
				setState(s);
			})
			.catch((err) => console.log(err));
	}
	useEffect(() => {
		console.log("useEffect без axios");
		setState(state);
		const newCategory = state.find(
			(category) => category._id === activeCategory?._id
		);
		setActiveCategory(newCategory);
	}, [state]);

	return (
		<div className={classes.App}>
			<Header title="App" />
			<Main>
				<Menu view={view}>
					<hr />
					<Button
						title="Categories"
						click={() => changeView("categories")}
					/>
					<Button
						title="Candidates"
						click={() => changeView("candidates")}
					/>
					<Button title="Tickets" click={() => changeView("tickets")} />
					<hr />
					<Link className={classes.Link} to="/categories">Categories</Link>
					<Link className={classes.Link} to="/candidates">Candidates</Link>
					<Link className={classes.Link} to="/tickets">Tickets</Link>
					<hr />
					<Button
						title="All Categories"
						click={() => filterCategories("all")}
					/>
					<Button
						title="Active Categories"
						click={() => filterCategories("active")}
					/>
					<Button
						title="InActive Categories"
						click={() => filterCategories("inactive")}
					/>
				</Menu>

				{view === "categories" && (
					<Center>
						<Form submit={addCategory}>
							<Input
								typeInput="text"
								name="title"
								placeholder="title"
								value=""
							/>
							<Select name="status">
								<Option title="active" value="active" />
								<Option title="inactive" value="inactive" />
							</Select>
							<Input typeInput="date" name="date" value="" required />
							<Button>Add</Button>
						</Form>
						<CategoriesContainer>
							{filteredState.map((category) => (
								<CategoryCard key={v4()} category={category}>
									<Button
										click={() =>
											removeCategory(category._id! as string)
										}
									>
										Delete
									</Button>
								</CategoryCard>
							))}
						</CategoriesContainer>
					</Center>
				)}
				{view === "candidates" && (
					<Center>
						<Form submit={addCandidate}>
							<Select name="categoryId" change={changeActiveCategory}>
								{state.map((category) => (
									<Option
										key={v4()}
										title={category.title}
										value={category._id}
									/>
								))}
							</Select>
							<Input
								typeInput="text"
								name="name"
								placeholder="candidate"
								value=""
								required
							/>
							<Button>Add</Button>
						</Form>
						<CandidatesContainer>
							{activeCategory && activeCategory.candidates
								? activeCategory.candidates.map((с) => (
										<CandidateCard key={v4()} candidate={с}>
											<Button
												click={() =>
													deleteCandidate(
														activeCategory._id!,
														с._id!
													)
												}
											>
												Delete
											</Button>
										</CandidateCard>
								  ))
								: null}
						</CandidatesContainer>
					</Center>
				)}
				{view === "tickets" && (
					<Center>
						<Form submit={addTicket}>
							<Select name="categoryId" change={changeActiveCategory}>
								{state.map((category) => (
									<Option
										key={v4()}
										title={category.title}
										value={category._id}
									/>
								))}
							</Select>
							<Select name="candidateId" change={changeActiveCandidate}>
								{activeCategory && activeCategory.candidates
									? activeCategory.candidates.map((c) => (
											<Option
												key={v4()}
												title={c.name}
												value={c._id}
											/>
									  ))
									: null}
							</Select>
							<Input
								typeInput="text"
								name="ticket"
								placeholder="ticket"
								value=""
								required
							/>
							<Button>Add</Button>
						</Form>
						<TicketsContainer>
							{activeCategory && activeCategory.tickets
								? activeCategory.tickets.map((t) => (
										<TicketCard key={v4()} ticket={t}>
											<Button
												click={() =>
													deleteTicket(activeCategory._id!, t._id)
												}
											>
												Delete
											</Button>
										</TicketCard>
								  ))
								: null}
						</TicketsContainer>
					</Center>
				)}
				<Sidebar />
			</Main>
			<Footer />
		</div>
	);
}

export default App;
