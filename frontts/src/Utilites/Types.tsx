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
export type TicketType = {
	_id?: string;
	ticket: string;
	candidateId: string;
	categoryId: string;
};
export type StatusType = "active" | "inactive";
export type FilterStateType = StatusType | "all";

export type ViewType = 'categories' | 'candidates' | 'tickets';