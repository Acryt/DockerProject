import classes from "./App.module.scss";

// React
import React, { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { v4 } from "uuid";

// Components
import Header from "./Organisms/Header/Header";
import Input from "./Atoms/Input/Input";
import Button from "./Atoms/Button/Button";
import Main from "./Organisms/Main/Main";
import Menu from "./Molecules/Menu/Menu";
import Center from "./Organisms/Center/Center";
import Form from "./Molecules/Form/Form";
import Option from "./Atoms/Option/Option";

// Types
import { StatusType, VoteType } from "./Utilites/Types";
import Sidebar from "./Molecules/Sidebar/Sidebar";
import Footer from "./Organisms/Footer/Footer";
import VotesContainer from "./Organisms/VotesContainer/VotesContainer";
import VoteCard from "./Molecules/VoteCard/VoteCard";
import Select from "./Atoms/Select/Select";

// import { VoteType, TicketType, CandidateType } from "./Utilites/Types";
type FilterStateType = StatusType | null;

function App() {
	const [globalState, setStateVotes] = useState<VoteType[]>([]);
	const [filter, setFilter] = useState<FilterStateType>(null);
	useEffect(() => {
		console.log("useEffect");
		let promise = axios.get("/api/getData");
		promise.then((res: AxiosResponse<any>) => {
			if (res.data) {
				setStateVotes(res.data);
			}
		});
		console.log("axios done");
	}, []);

	let filtered = globalState;
	if (filter !== null) {
		filtered = globalState.filter((vote) => vote.status === filter);
	}
	
	function addVote(vote: VoteType) {
		console.log("addVote");
		axios
			.post("/api/postData", vote)
			.then((res) => (vote = { ...vote, _id: res.data._id }))
			.then(() => setStateVotes([...globalState, vote]))
			.then(() => console.log("add done id=" + vote._id))
			.catch((err) => console.log(err));
	}

	function removeVote(id: string) {
		console.log("removeVote");
		let s = globalState.filter((vote) => id !== vote._id);
		axios
			.delete("/api/deleteData", { data: { id: id } })
			.then(() => setStateVotes(s))
			.then(() => console.log("rem done id=" + id));
		setStateVotes(s);
	}

	function editVote(id: string, updatedVote: VoteType) {
		console.log("editVote");
		let s = globalState.map((vote) => (vote._id === id ? updatedVote : vote));
		axios.put("/api/editData", updatedVote);
		setStateVotes(s);
	}

	function filterVotes(status: FilterStateType) {
		setFilter(status);
	}

	return (
		<div className={classes.App}>
			<Header title="App" />
			<Main>
				<Menu>
					<Button title="All Votes" click={() => filterVotes(null)} />
					<Button
						title="Active Votes"
						click={() => filterVotes("active")}
					/>
					<Button
						title="InActive Votes"
						click={() => filterVotes("inactive")}
					/>
				</Menu>
				<Center>
					<Form submit={addVote}>
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
						<Input typeInput="date" name="date" value="" />
						<Button>Add</Button>
					</Form>
					<VotesContainer>
						{filtered.map((vote) => (
							<VoteCard key={v4()} vote={vote}>
								<Button
									click={() => editVote(vote._id! as string, vote)}
								>
									Edit
								</Button>
								<Button click={() => removeVote(vote._id! as string)}>
									Delete
								</Button>
							</VoteCard>
						))}
					</VotesContainer>
				</Center>
				<Sidebar>
					<Form>
						<Select name="vote">
							{globalState.map((vote) => (
								<Option
									key={v4()}
									title={vote.title}
									value={vote.title}
								/>
							))}
						</Select>
						<Input
							typeInput="text"
							name="candidateName"
							placeholder="candidate"
							value=""
						/>
						<Button>Add</Button>
					</Form>
					<Form>
						<Select name="vote">
							{globalState.map((vote) => (
								<Option
									key={v4()}
									title={vote.title}
									value={vote.title}
								/>
							))}
						</Select>
						<Select name="candidate">
							{globalState.map((vote) => (
								<Option
									key={v4()}
									title={vote.title}
									value={vote.title}
								/>
							))}
						</Select>
						<Input
							typeInput="text"
							name="ticket"
							placeholder="ticket number"
							value=""
						/>
						<Button>Add</Button>
					</Form>
				</Sidebar>
			</Main>
			<Footer />
		</div>
	);
}

export default App;
