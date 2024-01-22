import { Average } from "next/font/google";
import { number } from "zod";

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
    evaluate: (shift: number[][], parameters: {}) => Promise<number>;
}

type Parameters = {
    [key: string]: any;
  };

function average(arr: number[]){
    let sum = 0;
    for(const num of arr){
        sum += num;
    }
    return sum / arr.length;
}

function sum_range(arr: number[], start: number, end: number){
    let sum = Number(0);
    for(let i = start; i < end; ++i){
        sum += arr[i];
    }
    return sum;
}

function sum(arr: number[]){
    let sum = 0;
    for(const num of arr){
        sum += Number(num);
    }
    return sum;
}

export const TagsDefinition : TagProps[] = [
    {
        text: 'Expected number of working days',
        key: 'expected_working_days',
        description: `The number of working days that the employee is expected to work in a month.`,
        parameters: [
            {
                parameter_name: 'Expected number of working days',
                parameter_alias: 'ewd',
                parameter_description: 'Expected number of working days'
            },
        ],
        evaluate: (shift: number[][], parameters: Parameters) => {
            return new Promise((resolve, reject) => {
              const enwd = Number(parameters['ewd']);
              let failed_rates = [];
          
              for (let i = 0; i < shift.length; ++i) {
                failed_rates.push(
                  Math.abs(enwd - sum(shift[i]) ) / enwd
                );
              }
          
              const score = 1 - average(failed_rates);
              resolve(score);
            });
          }
    },
    {
        text: 'Customized leave',
        key: 'customize_leave',
        description: `You are able to customize the leave for each employee, please edit the shift for each employee. 
                      1 is denoted as a working day, 0 is denoted as a leave day.`,
        parameters: [],
        evaluate: (shift: number[][], parameters: Parameters) => {
            return new Promise((resolve, reject) => {
                // console.log(parameters)
                const reserved_leave = parameters['reserved_leave'];
                // console.log(reserved_leave)
                let failed = 0;
                let amount_of_reserved_leave = 0;
                Object.entries(reserved_leave).forEach(([key, value]) => {
                    const row = Number(key);
                    for (const col of value as number[]) {
                      if (col < shift[row].length && shift[row][col] !== 0) {
                        failed += 1;
                      }
                      amount_of_reserved_leave += 1;
                    }
                  });
                  
                resolve(amount_of_reserved_leave ? 1 - (failed / amount_of_reserved_leave): 1);
                // resolve(0.1)
            })
        }
    },
    {
        text: 'Expected number of workers per shift',
        key: 'expected_number_of_workers_per_shift',
        description: `The number of workers that are expected to work in a shift.`,
        parameters: [
            {
                parameter_name: 'Expected number of workers per shift',
                parameter_alias: 'enwps',
                parameter_description: 'Expected number of workers per shift'
            }
        ],
        evaluate: (shift: number[][], parameters: Parameters) => {
            return new Promise((resolve, reject) => {
                let failed = 0;
                let number_of_days = 0;
                if(shift.length > 0 && shift[0]){
                    number_of_days = shift[0].length;
                }

                for(let i = 0; i < number_of_days; ++i){
                    let sum = 0;
                    for(let j = 0; j < shift.length; ++j){
                        sum += Number(shift[j][i]);
                    }
                    if(sum !== Number(parameters['enwps'])){
                        failed += 1;
                    }
                }
                resolve(number_of_days !== 0 ?  1 - failed / number_of_days : 0);

            })
            
        }
    },
    {
        text: 'Maximum consecutive working days',
        key: 'maximum_consecutive_working_days',
        description: `The maximum number of consecutive working days. 
        For example, set the maximum consecutive working days is 5. 
        The algorithm would try to avoid arranging the employee to work for more than 5 consecutive days.`,
        parameters: [
            {
                parameter_name: 'Maximum consecutive working days',
                parameter_alias: 'mcwd',
                parameter_description: 'Maximum consecutive working days'
            }
        ],
        evaluate: (shift: number[][], parameters: Parameters) => {
            return new Promise((resolve, reject) => {
                let maximum_consecutive_working_days = Number(parameters['mcwd']) + 1;
                let nrows = shift.length;
                let ncols = 0;
                if(shift.length > 0 && shift[0]){
                    ncols = shift[0].length; 
                }

                let failed = 0;
                for(let i = 0; i < nrows; ++i){
                    for(let j = 0; j < ncols - maximum_consecutive_working_days; ++j){
                        if(sum_range(shift[i], j, j+maximum_consecutive_working_days) >= maximum_consecutive_working_days){
                            failed += 1;
                        }
                    }
                }
                // console.log("maximum consecutive working days", failed, ncols, nrows)
                resolve(1 - (failed / (nrows * (ncols - maximum_consecutive_working_days))))
            })

        }
    },
    {
        text: 'Minimum n-days leave within 7-days',
        key: 'minimum_n_days_leave_within_7_days',
        description: `The minimum number of days that the employee is expected to take leave within 7 days.
        For example, set the minimum n-days leave within 7-days is 2. The employee would have at least 2 leave days within 7 days.`,
        parameters: [
            {
                parameter_name: 'Minimum n-days leave within 7-days',
                parameter_alias: 'mndlw7d',
                parameter_description: 'Minimum n-days leave within 7-days'
            }
        ],
        evaluate: (shift: number[][], parameters: Parameters) => {
            return new Promise((resolve, reject) => {
                const n = Number(parameters['mndlw7d']);
                let nrows = shift.length;
                let ncols = 0;
                if(shift.length > 0 && shift[0]){
                    ncols = shift[0].length; 
                }

                let failed = 0;
                let weekend = []
                for(let i = 0; i + 7 < ncols; i += 7){
                    weekend.push(i);
                }
                // console.log("weekend : ", weekend)

                for(let i = 0; i < nrows; ++i){
                    for(let j = 0; j < weekend.length; ++j){
                        let sum = 0;
                        if (weekend[j] + 7 < ncols){
                            sum = sum_range(shift[i], weekend[j], weekend[j] + 7);
                            if(sum > 7-n)
                                failed += 1;
                        }
                        // if (weekend[j] + n < ncols && weekend[j] + 7 > ncols){
                        //     sum = sum_range(shift[i], weekend[j], shift[i].length);
                        //     if(sum > 7-n)
                        //         failed += 1;
                        // }
                    }
                }
                resolve(1-(failed / (nrows * weekend.length)))
            })
        }
    },
    {
        text: 'Successive shift pair',
        key: 'successive_shift_pair',
        description: `The successive shift pair constraint is for the employee who likes to work on consecutive days`,
        parameters: [],
        evaluate: (shift: number[][], parameters: {}) => {
            return new Promise((resolve, reject) => {
                let nrows = shift.length;
                let ncols = 0;
                if(shift.length > 0 && shift[0]){
                    ncols = shift[0].length; 
                }
                let failed = 0;
                for(let i = 0; i < nrows; ++i){
                    for(let j = 1; j < ncols - 1; ++j){
                        if(shift[i][j-1] === 0 && shift[i][j] === 1 && shift[i][j+1] === 0){
                            failed += 1;
                        }
                    }
                    if((shift[i][0] === 1 && shift[i][1] === 0) || (shift[i][ncols-1] === 1 && shift[i][ncols-2] === 0)){
                        failed += 1;
                    }
                }

                resolve(1 - (failed / (nrows * ncols)));
            })
        }
    },
    {
        text: 'Consecutive leave',
        key: 'consecutive_2_days_leave',
        description: `The algorithm would try to arrange the employee to take consecutive days leave.`,
        parameters: [],
        evaluate: (shift: number[][], parameters: {}) => {
            return new Promise((resolve, reject) => {
                let nrows = shift.length;
                let ncols = 0;
                if(shift.length > 0 && shift[0]){
                    ncols = shift[0].length; 
                }
                
                let failed = 0;
                let all_leave = 0
                let all_consecutive_shift_pair = 0
                const leave_re = /0+/g;
                const consecutive_leave_re = /(?:00)+0*/g;
                for(let i = 0; i < nrows; ++i){
                    const row = shift[i].join('');
                    all_consecutive_shift_pair += [...row.matchAll(consecutive_leave_re)].length
                    all_leave += [...row.matchAll(leave_re)].length
                }
                resolve(all_leave > 0 ? all_consecutive_shift_pair / all_leave : 0)
            })
        }
    },
    {
        text: 'No consecutive leave',
        key: 'no_consecutive_leave',
        description: `The shift would try not to arange the employee to take consecutive leave days. `,
        parameters: [],
        evaluate: (shift: number[][], parameters: {}) => {
            return new Promise((resolve, reject) => {
                let nrows = shift.length;
                let ncols = 0;
                if(shift.length > 0 && shift[0]){
                    ncols = shift[0].length; 
                }

                let failed = 0;
                let amount_of_leave = 0;

                for(let i = 0; i < nrows; ++i){
                    for(let j = 0; j < ncols - 1; ++j){
                        if(shift[i][j] === 0){
                            amount_of_leave += 1;
                        }

                        if(shift[i][j] === 0 && shift[i][j+1] === 0){
                            failed += 1;
                        }
                    }
                }
                // console.log(failed)
                resolve(amount_of_leave === 0 ? 1 : 1 - (failed / amount_of_leave));
            })
        }
    }
    
]

