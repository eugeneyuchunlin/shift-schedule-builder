export interface TagParameter{
    parameter_name: string;
    parameter_alias: string;
    parameter_description: string;
}

export interface TagProps{
    text: string;
    key: string;
    description: string;
    parameters: TagParameter[];
    evaluate: (shift: number[][], parameters: {}) => Number;
}

export const TagsDefinition : TagProps[] = [
    {
        text: 'Expected number of working days',
        key: 'expected_working_days',
        description: `The number of working days that the employee is expected to work in a month`,
        parameters: [
            {
                parameter_name: 'Expected working days',
                parameter_alias: 'ewd',
                parameter_description: 'Expected working days'
            },
        ],
        evaluate: (shift: number[][], parameters: {}) => {
            return 0.1;
        }
    },
    {
        text: 'Customize leave',
        key: 'customize_leave',
        description: `You are able to customize the leave for each employee, please edit the shift for each employee`,
        parameters: [],
        evaluate: (shift: number[][], parameters: {}) => {
            return 0.1;
        }
    },
    {
        text: 'Expected number of workers per shift',
        key: 'expected_number_of_workers_per_shift',
        description: `The number of workers that the employee is expected to work in a shift`,
        parameters: [
            {
                parameter_name: 'Expected number of workers per shift',
                parameter_alias: 'enwps',
                parameter_description: 'Expected number of workers per shift'
            }
        ],
        evaluate: (shift: number[][], parameters: {}) => {
            return 0.1;
        }
    },
    {
        text: 'Maximum consecutive working days',
        key: 'maximum_consecutive_working_days',
        description: `The maximum number of consecutive working days that the employee is expected to work`,
        parameters: [
            {
                parameter_name: 'Maximum consecutive working days',
                parameter_alias: 'mcwd',
                parameter_description: 'Maximum consecutive working days'
            }
        ],
        evaluate: (shift: number[][], parameters: {}) => {
            return 0.1;
        }
    },
    {
        text: 'Minimum n-days leave within 7-days',
        key: 'minimum_n_days_leave_within_7_days',
        description: `The minimum number of days that the employee is expected to take leave within 7 days`,
        parameters: [
            {
                parameter_name: 'Minimum n-days leave within 7-days',
                parameter_alias: 'mndlw7d',
                parameter_description: 'Minimum n-days leave within 7-days'
            }
        ],
        evaluate: (shift: number[][], parameters: {}) => {
            return 0.1;
        }
    },
    {
        text: 'Successive shift pair',
        key: 'successive_shift_pair',
        description: `The number of successive shift pair that the employee is expected to work`,
        parameters: [],
        evaluate: (shift: number[][], parameters: {}) => {
            return 0.1;
        }
    },
    {
        text: 'Consecutive 2 days leave',
        key: 'consecutive_2_days_leave',
        description: `The number of consecutive 2 days leave that the employee is expected to take`,
        parameters: [],
        evaluate: (shift: number[][], parameters: {}) => {
            return 0.1;
        }
    },
    {
        text: 'No leave on consecutive working days',
        key: 'no_consecutive_leave',
        description: `The employee is not allowed to take leave on consecutive working days`,
        parameters: [],
        evaluate: (shift: number[][], parameters: {}) => {
            return 0.1;
        }
    }
    
]

