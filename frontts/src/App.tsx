import classes from "./App.module.scss";

// React
import React, { useEffect, useRef, useState } from "react";
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
import Home from "./Molecules/Home/Home";
import CandidateCard from "./Molecules/CandidateCard/CandidateCard";
import TicketCard from "./Molecules/TicketCard/TicketCard";

// Types
import {
	StateType,
	FilterStateType,
	ActiveCandidate,
	CategoryType,
	CandidateType,
	TicketType,
	PoolType,
} from "./Utilites/Types";
import FileInput from "./Atoms/File/FileInput";
import TableContainer from "./Organisms/TableContainer/TableContainer";
import ButtonCandidate from "./Atoms/ButtonCandidate/ButtonCandidate";
import Dialog from "./Atoms/Dialog/Dialog";

function App() {
	const [state, setState] = useState<StateType>([]);
	const [activeCategory, setActiveCategory] = useState<
		CategoryType | undefined
	>();
	const [logs, setLogs] = useState<string[]>(["..."]);
	const [categoryFilter, setCategoryFilter] = useState<FilterStateType>("all");
	let filteredState: StateType = state;
	const [modalState, setModalState] = useState<boolean | undefined>(false);
	const [delIdCategory, setDelIdCategory] = useState<string>('');
	const [delIdCandidate, setDelIdCandidate] = useState<string>('');

	useEffect(() => {
		console.log("useEffect");
		let promise = axios.get("/api/getData");
		promise
			.then((res: AxiosResponse<any>) => {
				if (res.data) {
					setState(res.data);
					setActiveCategory(res.data[0] ? res.data[0] : undefined);
				}
			})
			.then(() => setLogs([...logs, "Data loaded"]))
			.then(() => console.log("axios done"));
	}, []);

    useEffect(() => {
        setState(state);
        const newCategory = state.find((category) => category._id === activeCategory?._id);
        setActiveCategory(newCategory);
    }, [state]);

    function addCategory(category: CategoryType) {
		console.log("addCategory");
		axios
			.post("/api/addCategory", category)
			.then((res) => (category = { ...category, _id: res.data._id }))
			.then(() => setState([...state, category]))
			.then(() => setActiveCategory(category))
			.then(() => setLogs([...logs, "Added category " + category.title]))
			.then(() => console.log("add done id=" + category._id))
			.catch((err) => setLogs([...logs, "Error: " + err]));
	}
	function removeCategory(id: string) {
		console.log("removeCategory");
		const rem = state.find((category) => id === category._id);
		const s = state.filter((category) => id !== category._id);
		axios
			.delete("/api/deleteCategory", { data: { id: id } })
			.then(() => setLogs([...logs, "Removed category " + rem?.title]))
			.then(() => setState(s))
			.then(() => console.log("rem done id=" + id))
			.catch((err) => setLogs([...logs, "Error: " + err]));
		setState(s);
		setActiveCategory(s[s.length - 1] ? s[s.length - 1] : undefined);
	}

	function changeActiveCategory(e: any) {
		console.log("changeActiveCategory");
		const active = state.find((category) => category._id === e.target.value);
		if (active) {
			setActiveCategory(active);
		} else {
			console.log("Категория не найдена");
		}
	}

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
			.then(() => setLogs([...logs, "Added candidate " + candidate.name]))
			.catch((err) => console.log(err));
	}
	async function addPool(pool: PoolType) {
		console.log("addPool");
		axios
			.post("/api/addPool", pool)
			.then((res) => {
				const s = state.filter(
					(category) => category._id !== pool.categoryId
				);
				s.push(res.data! as CategoryType);
				setState(s);
			})
			.then(() =>
				setLogs([...logs, "Added tickets from " + pool.min + " to " + pool.max])
			)
			.catch((err) => console.log(err));
	}
	function deleteCandidate(categoryId: string, id: string) {
		console.log("deleteCandidate");

		axios
			.delete("/api/deleteCandidate", {
				data: { categoryId: categoryId, id: id },
			})
			.then((res) => {
				const rem = state
					.find((category) => category._id === res.data._id)!
					.candidates.find((candidate) => candidate._id === id);
				const s = state.filter((category) => category._id !== res.data._id);
				s.push(res.data! as CategoryType);
				setLogs([...logs, "Removed candidate " + rem?.name]);
				setState(s);
			})
			.catch((err) => console.log(err));
	}
	function getCandidateName(candidateId: string) {
		const candidate = state
			.map((category) => category.candidates)
			.flat()
			.find((candidate) => candidate._id === candidateId);
		return candidate ? candidate.name : undefined;
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
				const name = getCandidateName(ticket.candidateId);
				setLogs([
					...logs,
					"Added vote " + ticket.ticket + " for " + name,
				]);
			})
			.catch((err) => alert(err.response.data.message));
	}

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, state: CategoryType | undefined) => {
        setActiveCategory(state)
    };
	return (
		<div className={classes.App}>
			<Header title="2D PARTY VOTING SYSTEM" />
			<Main>
				<Menu>
					<hr />
					<Link className={classes.Link} to="/categories" onClick={(e) => {handleClick(e, undefined)}}>
						Categories
					</Link>
                    {state[0] && <Link className={classes.Link} to="/candidates" onClick={(e) => {
                        handleClick(e, state[0])
                    }}>
                        Candidates
                    </Link>}
					<Link className={classes.Link} to="/votes">
						Votes
					</Link>
					<Link className={classes.Link} to="/tickets">
						Tickets
					</Link>
					<Link className={classes.Link} to="/results">
						Results
					</Link>
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

				<Routes>
					<Route
						path="/"
						element={
							<Center>
								<Home />
							</Center>
						}
					/>
					<Route
						path="/categories"
						element={
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
									<Input
										typeInput="date"
										name="date"
										value=""
										required
									/>
									<Button>Add</Button>
								</Form>
								<CategoriesContainer>
									{filteredState.map((category) => (
										<CategoryCard key={v4()} category={category}>
											<Button
												click={() => {
													setModalState(true);
													setDelIdCategory(category._id!)
												}}
											>
												Delete
											</Button>
										</CategoryCard>
									))}
								</CategoriesContainer>
                                {modalState && (
                                    <Dialog
                                        title={
                                            "Are you sure you want to delete category " +
                                            state.find((category) => category._id === delIdCategory)?.title +
                                            "?"
                                        }
                                        cancel={() => setModalState(false)}
                                        ok={() => {
                                            removeCategory(delIdCategory);
                                            setModalState(false);
                                        }}
                                    />
                                )}
							</Center>
						}
					/>

					<Route
						path="/candidates"
						element={
							<Center>
								<Form submit={addCandidate}>
									<Select
										name="categoryId"
										change={changeActiveCategory}
									>
										<Option title="Select category" value="" />
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
									<FileInput name="file" value="" />
									<Button>Add</Button>
								</Form>
								<CandidatesContainer>
									{activeCategory && activeCategory.candidates
										? activeCategory.candidates.map((с) => (
												<CandidateCard key={v4()} candidate={с}>
													<Button
														click={() =>
														{
															setModalState(true);
															setDelIdCandidate(с._id!)
														}}
													>
														Delete
													</Button>
												</CandidateCard>
										  ))
										: null}
								</CandidatesContainer>
                                {modalState && (
								<Dialog
									title={"Are you sure you want to delete " + activeCategory?.candidates.find((c) => c._id === delIdCandidate)!.name + "?"}
								    cancel={() => setModalState(false)}
                                    ok={() => {
                                        deleteCandidate(activeCategory!._id!, delIdCandidate);
                                        setModalState(false);
                                    }}
                                    />
                                )}
							</Center>
						}
					/>

					<Route
						path="/votes"
						element={
							<Center>
								<Form
									submit={addTicket}
									className={classes.FormTickets}
								>
									<div>
										<Select
											name="categoryId"
											change={changeActiveCategory}
										>
											<Option title="Select category" value="" />
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
											name="ticket"
											placeholder="Ticket"
											value=""
											required
										/>
									</div>
									<hr />
									<div>
										{activeCategory && activeCategory.candidates
											? activeCategory.candidates.map((c) => (
													<Button
														key={v4()}
														name="candidateId"
														value={c._id}
													>
														<img src="" />
														<p>{c.name}</p>
													</Button>
											  ))
											: null}
									</div>
								</Form>
							</Center>
						}
					/>
					<Route
						path="/results"
						element={<TableContainer state={state} />}
					/>
					<Route
						path="/tickets"
						element={
							<Center>
								<Form submit={addPool}>
									<Select
										name="categoryId"
										change={changeActiveCategory}
									>
										<Option title="Select category" value="" />
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
										name="min"
										placeholder="min"
										value=""
										required
									/>
									<Input
										typeInput="text"
										name="max"
										placeholder="max"
										value=""
										required
									/>
									<Button>Add</Button>
								</Form>
								visitors
							</Center>
						}
					/>
				</Routes>
				<Sidebar logs={logs} setLogs={setLogs} />
			</Main>
			<Footer />
		</div>
	);
}

export default App;
