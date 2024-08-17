import { FormEventHandler, MouseEventHandler } from "react";

export type CandidateType = {
	_id?: string;
	candidateName?: string;
	voteId?: string;
};

export type TicketType = {
	_id?: string;
	ticket?: string;
	vote?: string;
};

export type StatusType = "active" | "inactive";

export type VoteType = {
	_id?: string;
	title: string;
	date: Date;
	status?: StatusType;
	candidates?: [CandidateType];
	tickets?: [TicketType];
};

export type VoteCardPropsType = {
	vote: VoteType;
	children?: any;
}

export type HeaderPropsType = {
	title?: string;
};

export type CenterPropsType = {
	title?: string;
	children?: any;
};

export type FormPropsType = {
	title?: string;
	submit?: any;
	children?: any;
};

export type InputPropsType = {
	name?: string;
	typeInput?: string;
	value?: string;
	placeholder?: string;
	change?: any;
	children?: any;
};

export type MainPropsType = {
	title?: string;
	children?: any;
};

export type SidebarPropsType = {
   children?: any;
}

export type ButtonPropsType = {
	title?: string;
	typeButton?: "submit" | "reset" | "button" | undefined;
	click?: MouseEventHandler<HTMLButtonElement>;
	children?: any;
};

export type OptionPropsType = {
	title: string;
	value?: string;
}