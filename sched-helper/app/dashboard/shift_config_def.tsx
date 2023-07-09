
export interface Constraint{
    name : string;
    parameters: {};
}

export interface ShiftConfig {
    name: string,
    shift_id : string,
    days: number;
    number_of_workers: number;
    computation_time: number;
    constraints: Constraint[];
}