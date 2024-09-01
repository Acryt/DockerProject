import { FormEventHandler, MouseEventHandler } from "react";

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
	className?: string;
};
export type InputPropsType = {
	name?: string;
	typeInput?: string;
	value?: string;
	placeholder?: string;
	change?: any
	required?: boolean;
	children?: any;
};
export type MainPropsType = {
	title?: string;
	children?: any;
};
export type SidebarPropsType = {
   children?: any;
	logs: Array<string>;
	setLogs: Function;
}
export type ButtonPropsType = {
	title?: string;
	typeButton?: "submit" | "reset" | "button" | undefined;
	click?: MouseEventHandler<HTMLButtonElement>;
	children?: any;
	name?: string;
	value?: string;
};
export type OptionPropsType = {
	title: string;
	value?: string;
}

export type CategoryType = {
	_id?: string;
	title: string;
	date: Date;
	status?: StatusType;
	candidates: [CandidateType];
	tickets: [TicketType];
}

export type ActiveCandidate = string | undefined;

export type StateType = Array<CategoryType>;
export type CandidateType = {
	_id?: string;
	categoryId: string;
	name: string;
};
export type PoolType = {
	_id?: string;
	categoryId: string;
	min: string;
	max: string;
}
export type TicketType = {
	_id?: string;
	ticket: string;
	candidateId: string;
	categoryId: string;
};
export type StatusType = "active" | "inactive";
export type FilterStateType = StatusType | "all";