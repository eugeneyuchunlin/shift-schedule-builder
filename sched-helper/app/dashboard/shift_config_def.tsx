interface Parameter{
    parameter_name: string;
    parameter_value: number;
}

export interface Constraint{
    name : string;
    parameters: Parameter[];
}

export interface ShiftConfig {
    days: number;
    number_of_workers: number;
    computation_time: number;
    constraints: Constraint[];
}