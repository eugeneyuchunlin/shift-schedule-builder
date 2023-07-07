export interface TagParameter{
    parameter_name: string;
    parameter_alias?: string;
    parameter_description: string;
}

export interface TagProps{
    text: string;
    description: string;
    parameters: TagParameter[];
}

export const TagsDefinition : TagProps[] = [
    {
        text: 'Expected working days',
        description: `The number of working days that the employee is expected to work in a month`,
        parameters: [
            {
                parameter_name: 'Expected working days',
                parameter_alias: 'ewd',
                parameter_description: 'Expected working days'
            },
        ]
    },
    {
        text: 'Customize leave',
        description: `You are able to customize the leave for each employee, please edit the shift for each employee`,
        parameters: []
    },
    {
        text: 'Expected number of workers per shift',
        description: `The number of workers that the employee is expected to work in a shift`,
        parameters: [
            {
                parameter_name: 'Expected number of workers per shift',
                parameter_alias: 'enwps',
                parameter_description: 'Expected number of workers per shift'
            }
        ]
    },
    {
        text: 'Maximum consecutive working days',
        description: `The maximum number of consecutive working days that the employee is expected to work`,
        parameters: [
            {
                parameter_name: 'Maximum consecutive working days',
                parameter_alias: 'mcwd',
                parameter_description: 'Maximum consecutive working days'
            }
        ]
    },
    {
        text: 'Minimum n-days leave within 7-days',
        description: `The minimum number of days that the employee is expected to take leave within 7 days`,
        parameters: [
            {
                parameter_name: 'Minimum n-days leave within 7-days',
                parameter_alias: 'mndlw7d',
                parameter_description: 'Minimum n-days leave within 7-days'
            }
        ]
    },
    {
        text: 'Successive shift pair',
        description: `The number of successive shift pair that the employee is expected to work`,
        parameters: []
    },
    {
        text: 'Consecutive 2 days leave',
        description: `The number of consecutive 2 days leave that the employee is expected to take`,
        parameters: []
    },
    
]

