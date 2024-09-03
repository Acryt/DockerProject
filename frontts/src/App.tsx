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
import CategoriesContainer from "./Organisms/CategoriesContainer/CategoriesContainer";
import CandidatesContainer from "./Organisms/CandidatesContainer/CandidatesContainer";
import Option from "./Atoms/Option/Option";
import Input from "./Atoms/Input/Input";
import Select from "./Atoms/Select/Select";
import Home from "./Molecules/Home/Home";
import CandidateCard from "./Molecules/CandidateCard/CandidateCard";
// import FileInput from "./Atoms/File/FileInput";
// import ButtonCandidate from "./Atoms/ButtonCandidate/ButtonCandidate";
import Dialog from "./Atoms/Dialog/Dialog";
import TableContainer from "./Organisms/TableContainer/TableContainer";

// Types
import {
	// 	StateType,
	// 	FilterStateType,
	// 	ActiveCandidate,
	CategoryType,
	CandidateType,
	TicketType,
	logsType,
	// 	PoolType,
} from "./Utilites/Types";
import VoteContainer from "./Organisms/VoteContainer/VoteContainer";

function App() {
	// Base state
	const [stateCategory, setStateCategory] = useState<Array<CategoryType>>([]);
	const [stateCandidate, setStateCandidate] = useState<Array<CandidateType>>(
		[]
	);
	// Pass state
	const [inputPass, setInputPass] = useState<string>("");
	const pass: string = "2dResults";
	// Support state
	const [activeCategory, setActiveCategory] = useState<string | null>(null);
	const [activeCandidate, setActiveCandidate] = useState<string | null>(null);
	const [logs, setLogs] = useState<logsType[]>([
		{ msg: "Test message", err: "Test error" },
	]);
	const [stateFilter, setStateFilter] = useState<string>("");
	// Modal state
	const [modalState, setModalState] = useState<boolean>(false);
	const [title, setTitle] = useState("");
	const [delIdCategory, setDelIdCategory] = useState<string>("");
	const [delIdCandidate, setDelIdCandidate] = useState<string>("");

	useEffect(() => {
		console.log("First useEffect");
		let category = axios.get("/api/getCategory");
		category
			.then((res: AxiosResponse<any>) => {
				if (res.data) {
					setStateCategory(res.data);
					setLogs([...logs, { msg: "Data loaded" }]);
				}
			})
			.catch((err) => {
				setLogs([...logs, { err: "Error: " + err.response.data.message }]);
			});

		let candidate = axios.get("/api/getCandidate");
		candidate
			.then((res: AxiosResponse<any>) => {
				if (res.data) {
					setStateCandidate(res.data);
					setLogs([...logs, { msg: "Data loaded" }]);
				}
			})
			.catch((err) => {
				setLogs([...logs, { err: "Error: " + err.response.data.message }]);
			});
	}, []);
	function initCatagory() {
		if (stateCategory.length > 0) setActiveCategory(stateCategory[0]._id!);
	}
	function getCategory(id?: string) {
		if (id) {
			let promise = axios.get("/api/getCategory/" + id);
			promise
				.then((res: AxiosResponse<any>) => {
					if (res.data) {
						setActiveCategory(res.data);
					}
				})
				.then(() => setLogs([...logs, { msg: "getCategory with ID done" }]))
				.catch((err) => {
					setLogs([
						...logs,
						{ err: "Error: " + err.response.data.message },
					]);
				});
		} else {
			let promise = axios.get("/api/getCategory");
			promise
				.then((res: AxiosResponse<any>) => {
					if (res.data) {
						setStateCategory(res.data);
					}
				})
				.then(() => setLogs([...logs, { msg: "getCategory done" }]))
				.catch((err) => {
					setLogs([
						...logs,
						{ err: "Error: " + err.response.data.message },
					]);
				});
		}
	}
	function getCandidate(id?: string) {
		if (id) {
			let promise = axios.get("/api/getCandidate/" + id);
			promise
				.then((res: AxiosResponse<any>) => {
					if (res.data) {
						// setStateCandidate(res.data);
					}
				})
				.then(() =>
					setLogs([...logs, { msg: "getCandidate with ID done" }])
				)
				.catch((err) => {
					setLogs([
						...logs,
						{ err: "Error: " + err.response.data.message },
					]);
				});
		} else {
			let promise = axios.get("/api/getCandidate");
			promise
				.then((res: AxiosResponse<any>) => {
					if (res.data) {
						setStateCandidate(res.data);
					}
				})
				.catch((err) => {
					setLogs([
						...logs,
						{ err: "Error: " + err.response.data.message },
					]);
				});
		}
	}
	function getCandidateName(candidateId: string) {
		return stateCandidate.find((c) => c._id === candidateId)?.name;
	}
	function addCategory(c: CategoryType) {
		console.log("addCategory");
		axios
			.post("/api/addCategory", c)
			.then((res) => {
				setStateCategory([...stateCategory, res.data]);
				setActiveCategory(res.data._id);
				setLogs([...logs, { msg: "Added category " + res.data.title }]);
			})
			.catch((err) => {
				setLogs([...logs, { err: "Error: " + err.response.data.message }]);
			});
	}

	function rmCategory(id: string) {
		console.log("removeCategory");
		const rem = stateCategory.find((c) => id === c._id);
		const s = stateCategory.filter((c) => id !== c._id);
		axios
			.delete("/api/rmCategory", { data: { id: id } })
			.then(() => {
				setStateCategory(s);
				setLogs([...logs, { msg: "Removed category " + rem?.title }]);
				setActiveCategory(null);
				getCandidate();
			})
			.catch((err) => {
				setLogs([...logs, { err: "Error: " + err.response.data.message }]);
			});
	}

	function changeActiveCategory(e: any) {
		console.log("changeActiveCategory");
		setActiveCategory(e.target.value);
	}

	function addCandidate(candidate: CandidateType) {
		console.log("addCandidate");

		axios
			.post("/api/addCandidate", candidate, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			})
			.then((res) => {
				getCandidate();
				setLogs([...logs, { msg: "Added candidate " + candidate.name }]);
			})
			.catch((err) => {
				setLogs([...logs, { err: "Error: " + err.response.data.message }]);
			});
	}
	type BatchType = {
		prefix: string;
		min: string;
		max: string;
	};
	function addBatch(b: BatchType) {
		console.log("addBatch");
		axios
			.post("/api/addBatch", b)
			.then(() => {
				setLogs([
					...logs,
					{
						msg:
							"Added tickets from " +
							b.prefix +
							b.min +
							" to " +
							b.prefix +
							b.max,
					},
				]);
			})
			.catch((err) => {
				setLogs([...logs, { err: "Error: " + err.response.data.message }]);
			});
	}

	function rmCandidate(categoryId: string, id: string) {
		axios
			.delete("/api/rmCandidate", {
				data: { categoryId: categoryId, id: id },
			})
			.then((res) => {
				const s = stateCandidate.filter((c) => c._id !== res.data._id);
				setLogs([...logs, { msg: "Removed candidate " + res.data.name }]);
				setStateCandidate(s);
			})
			.catch((err) => {
				setLogs([...logs, { err: "Error: " + err.response.data.message }]);
			});
	}

	function addVote(ticket: {
		prefix: string;
		ticket: string;
		categoryId: string;
		candidateId: string;
	}) {
		axios
			.post("/api/addVote", ticket)
			.then((res) => {
				console.log(res.data);
				setLogs([
					...logs,
					{
						msg:
							"Added vote " +
							ticket.prefix.toUpperCase() +
							ticket.ticket.toUpperCase() +
							" for " +
							getCandidateName(ticket.candidateId),
					},
				]);
				return res;
			})
			.catch((err) => {
				setLogs([...logs, { err: "Error: " + err.response.data.message }]);
			});
	}

	const handleClick = () => {
		setActiveCategory(stateCategory[0]._id! || null);
	};

	return (
		<div className={classes.App}>
			<Header title="2D PARTY VOTING SYSTEM" />
			<Main>
				<Menu>
					<hr />
					<Link className={classes.Link} to="/categories">
						Categories
					</Link>
					{stateCategory[0] && (
						<Link
							className={classes.Link}
							to="/candidates"
							onClick={() => {
								handleClick();
							}}
						>
							Candidates
						</Link>
					)}
					{stateCandidate[0] && (
						<Link
							className={classes.Link}
							to="/votes"
							onClick={() => {
								handleClick();
							}}
						>
							Votes
						</Link>
					)}
					<Link className={classes.Link} to="/tickets">
						Tickets
					</Link>
					<Link className={classes.Link} to="/results">
						Results
					</Link>
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
										required
									/>
									<Select name="status">
										<Option title="active" value="active" />
										<Option title="archived" value="archived" />
									</Select>
									<Button>Add</Button>
								</Form>
								<CategoriesContainer>
									{stateCategory.map((category) => (
										<CategoryCard key={v4()} category={category}>
											<Button
												key={v4()}
												click={() => {
													setModalState(true);
													setDelIdCategory(category._id!);
													setTitle(category.title!);
												}}
											>
												Delete
											</Button>
										</CategoryCard>
									))}
								</CategoriesContainer>
								{modalState && (
									<Dialog
										key={v4()}
										title={
											"Are you sure you want to delete " +
											title +
											"?"
										}
										cancel={() => setModalState(false)}
										ok={() => {
											rmCategory(delIdCategory);
											setModalState(false);
										}}
									/>
								)}
							</Center>
						}
					/>
					<Route
						path="/results"
						element={
							<Center>
								<input
									type="text"
									name="pass"
									placeholder="Password"
									value={inputPass}
									onChange={(e) => setInputPass(e.target.value)}
								/>
								{inputPass === pass ? (
									<TableContainer
										stateCandidate={stateCandidate}
										stateCategory={stateCategory}
										changeActiveCategory={changeActiveCategory}
									/>
								) : (
									<h1>Wrong password</h1>
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
										required
									>
										{stateCategory.map((category) => (
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
									<Input
										typeInput="file"
										name="file"
										placeholder="file"
										value=""
									/>
									<Button>Add</Button>
								</Form>
								<CandidatesContainer>
									{stateCandidate && activeCategory
										? stateCandidate
												.filter(
													(с) => с.categoryId === activeCategory
												)
												.map((с) => (
													<CandidateCard
														key={v4()}
														candidate={с._id}
														stateCandidate={stateCandidate}
													>
														<Button
															key={v4()}
															click={() => {
																setModalState(true);
																setDelIdCandidate(с._id!);
																setTitle(с.name);
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
										key={v4()}
										title={
											"Are you sure you want to delete " +
											title +
											"?"
										}
										cancel={() => setModalState(false)}
										ok={() => {
											rmCandidate(activeCategory!, delIdCandidate);
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
								<Form submit={addVote} className={classes.FormTickets}>
									<div>
										<Select
											name="categoryId"
											change={changeActiveCategory}
										>
											{stateCategory.map((category) => (
												<Option
													key={v4()}
													title={category.title}
													value={category._id}
												/>
											))}
										</Select>
										<input
											type="text"
											name="filter"
											placeholder="Filter"
											value={stateFilter}
											onChange={(e) => {
												setStateFilter(e.target.value);
											}}
										/>
										<Input
											typeInput="text"
											name="prefix"
											placeholder="Prefix"
											value=""
											required
											key={v4()}
										/>
										<Input
											typeInput="text"
											name="ticket"
											placeholder="Ticket"
											value=""
											required
											key={v4()}
										/>
									</div>
									<VoteContainer>
										{stateCandidate && activeCategory
											? stateCandidate
													.filter(
														(c) =>
															c.categoryId === activeCategory &&
															c.name
																.toLowerCase()
																.includes(
																	stateFilter.toLowerCase()
																)
													)
													.map((c) => (
														<CandidateCard
															key={v4()}
															candidate={c._id}
															stateCandidate={stateCandidate}
														>
															<Button
																key={v4()}
																name="candidateId"
																value={c._id}
															>
																<p>Vote!</p>
															</Button>
														</CandidateCard>
													))
											: null}
									</VoteContainer>
								</Form>
							</Center>
						}
					/>

					<Route
						path="/tickets"
						element={
							<Center>
								<input
									type="text"
									name="pass"
									placeholder="Password"
									value={inputPass}
									onChange={(e) => setInputPass(e.target.value)}
								/>
								{inputPass === pass ? (
									<Form submit={addBatch}>
										<Input
											typeInput="text"
											name="prefix"
											placeholder="prefix"
											value=""
											required
										/>
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
								) : (
									<p>Wrong password</p>
								)}
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
