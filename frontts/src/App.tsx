import classes from "./App.module.scss";

// React
import { useEffect, useRef, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import axios, { AxiosResponse } from "axios";
import { v4 } from "uuid";

// Types
import { CategoryType, CandidateType, logsType } from "./Utilites/Types";

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
import Dialog from "./Atoms/Dialog/Dialog";
import TableContainer from "./Organisms/TableContainer/TableContainer";
import VoteContainer from "./Organisms/VoteContainer/VoteContainer";
import { useDispatch, useSelector } from "react-redux";
import AdminContainer from "./Organisms/AdminContainer/AdminContainer";
import ResultContainer from "./Organisms/ResultContainer/ResultContainer";

function App() {
	// Base state
	const [stateCategory, setStateCategory] = useState<Array<CategoryType>>([]);
	const [stateCandidate, setStateCandidate] = useState<Array<CandidateType>>(
		[]
	);
	// const store = useSelector((state: any) => state);
	// const dispatch = useDispatch();

	// Support state
	const [activeCategory, setActiveCategory] = useState<string | null>(null);
	const [logs, setLogs] = useState<logsType[]>([
		{ msg: "Test message", err: "Test error" },
	]);
	const [stateFilter, setStateFilter] = useState<string>("");
	// Modal state
	const [modalState, setModalState] = useState<boolean>(false);
	const [title, setTitle] = useState("");
	const [delIdCategory, setDelIdCategory] = useState<string>("");
	const [delIdCandidate, setDelIdCandidate] = useState<string>("");
	const [adminMode, setAdminMode] = useState<boolean>(false);

	useEffect(() => {
		let category = axios.get("/api/getCategory");
		category
			.then((res: AxiosResponse<any>) => {
				if (res.data) {
					setStateCategory(res.data);
					setLogs([...logs, { msg: "Data loaded" }]);
				}
			})
			.catch((err) => {
				setLogs([...logs, { err: err.response.data.message }]);
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
				setLogs([...logs, { err: err.response.data.message }]);
			});
	}, []);
	function initCatagory() {
		if (stateCategory.length > 0) setActiveCategory(stateCategory[0]._id!);
	}
	type logsType = {
		msg?: string;
		err?: string;
	};
	function saveLogsToFile(str: logsType) {
		const promise = axios.post("/api/setLogs", str);
		promise
			.then((res: AxiosResponse<any>) => {
				if (res.data) {
					console.log(res.data.message);
				}
			})
			.catch((err) => {
				console.log("Error: " + err.response.data.message);
			});
	}
	function addLogs(log: logsType) {
		setLogs([...logs, log]);
		saveLogsToFile(log);
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
				.then(() => {
					addLogs({ msg: "getCategory with ID done" });
				})
				.catch((err) => {
					addLogs({ err: err.response.data.message });
				});
		} else {
			let promise = axios.get("/api/getCategory");
			promise
				.then((res: AxiosResponse<any>) => {
					if (res.data) {
						setStateCategory(res.data);
					}
				})
				.then(() => addLogs({ msg: "getCategory done" }))
				.catch((err) => {
					addLogs({ err: err.response.data.message });
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
						{ err: err.response.data.message },
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
						{ err: err.response.data.message },
					]);
				});
		}
	}
	function getCandidateName(candidateId: string) {
		return stateCandidate.find((c) => c._id === candidateId)?.name;
	}
	function addCategory(c: CategoryType) {
		// dispatch({ type: "ADD_APPLE", apple: 3 });
		axios
			.post("/api/addCategory", c)
			.then((res) => {
				setStateCategory([...stateCategory, res.data]);
				setActiveCategory(res.data._id);
				addLogs({ msg: "Added category " + res.data.title });
			})
			.catch((err) => {
				addLogs({ err: err.response.data.message });
			});
	}

	function rmCategory(id: string) {
		const rem = stateCategory.find((c) => id === c._id);
		const s = stateCategory.filter((c) => id !== c._id);
		axios
			.delete("/api/rmCategory", { data: { id: id } })
			.then(() => {
				setStateCategory(s);
				addLogs({ msg: "Removed category " + rem?.title });
				setActiveCategory(null);
				getCandidate();
			})
			.catch((err) => {
				addLogs({ err: err.response.data.message });
			});
	}

	function changeActiveCategory(e: any) {
		setActiveCategory(e.target.value);
	}

	function addCandidate(candidate: CandidateType) {
		axios
			.post("/api/addCandidate", candidate, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			})
			.then((res) => {
				getCandidate();
				addLogs({ msg: "Added candidate " + candidate.name });
			})
			.catch((err) => {
				addLogs({ err: err.response.data.message });
			});
	}

	function rmCandidate(categoryId: string, id: string) {
		axios
			.delete("/api/rmCandidate", {
				data: { categoryId: categoryId, id: id },
			})
			.then((res) => {
				const s = stateCandidate.filter((c) => c._id !== res.data._id);
				addLogs({ msg: "Removed candidate " + res.data.name });
				setStateCandidate(s);
			})
			.catch((err) => {
				addLogs({ err: err.response.data.message });
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
				addLogs({
					msg:
						"Added vote " +
						ticket.prefix.toUpperCase() +
						ticket.ticket.toUpperCase() +
						" for " +
						getCandidateName(ticket.candidateId),
				});
				return res;
			})
			.catch((err) => {
				addLogs({ err: err.response.data.message });
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
					{adminMode && (
						<Link className={classes.Link} to="/categories">
							Categories
						</Link>
					)}
					{stateCategory[0] && adminMode && (
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
						Admin Panel
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
										type="text"
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
										type="text"
										name="name"
										placeholder="candidate"
										value=""
										required
									/>
									<Input
										type="file"
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
													title={category.title}
													value={category._id}
													key={v4()}
												/>
											))}
										</Select>
										<Input
											type="text"
											name="filter"
											placeholder="Filter"
											value={stateFilter}
											onChange={setStateFilter}
										/>
										<Input
											type="text"
											name="prefix"
											placeholder="Prefix"
										/>
										<Input
											type="text"
											name="ticket"
											placeholder="Ticket"
											required
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
															candidate={c._id}
															stateCandidate={stateCandidate}
															key={v4()}
														>
															<Button
																name="candidateId"
																value={c._id}
																key={v4()}
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
							<AdminContainer
								adminMode={adminMode}
								setAdminMode={setAdminMode}
								logs={logs}
								addLogs={addLogs}
							/>
						}
					/>
					<Route
						path="/results"
						element={
							<ResultContainer
								stateCandidate={stateCandidate}
								stateCategory={stateCategory}
								changeActiveCategory={changeActiveCategory}
							/>
						}
					/>
				</Routes>
				<Sidebar adminMode={adminMode} logs={logs} setLogs={setLogs} />
			</Main>
			<Footer />
		</div>
	);
}

export default App;
