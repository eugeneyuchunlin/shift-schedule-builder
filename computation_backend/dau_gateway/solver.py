import json
import time
import requests
import re
import numpy as np
import pandas as pd
from pyqubo import Array, Num
from constraints import CONSTRAINTS

try:
    from django.conf import settings
    dau_url = settings.DAU_URL
    dma_url = settings.DMA_URL
    api_key = settings.DAU_API_KEY
    dma_api_key = settings.DMA_API_KEY
except:
    import yaml

    with open("config.yml", "r") as f:
        config = yaml.safe_load(f)

    dau_url = config['DAU_URL']
    dma_url = config['DMA_URL']
    api_key = config['DAU_API_KEY']
    dma_api_key = config['DMA_API_KEY']
    pass


class DAUSolver():

    def __init__(self, problem):
        self.problem = problem
        self._number_of_workers = int(problem['number_of_workers'])
        self._days = int(problem['days'])
        self._computation_time = int(problem['computation_time'])
        self._shift_id = problem['shift_id']

        self._X = Array.create('x', shape=(self._number_of_workers, self._days), vartype='BINARY')

        constraints = problem['constraints']

        self._binomial_constraints = []
        self._inequality_constraints = []

        for i in range(len(constraints)):
            name = constraints[i]['name']
            print(constraints[i]['parameters'])
            if CONSTRAINTS[name]['type'] == 'binomial_polynomial':
                self._binomial_constraints.append(
                    CONSTRAINTS[name]['function'](self._X, **constraints[i]['parameters'])
                )
            elif CONSTRAINTS[name]['type'] == 'inequalities':
                self._inequality_constraints.append(
                    CONSTRAINTS[name]['function'](self._X, **constraints[i]['parameters'])
                )

    def _get_matrix_term(self, matrix_element:dict, variables:list) -> list:
        """Get the matrix term from the qubo and variables

        The function is used to get the matrix term from the qubo and variables and encode the matrix term in terms indecies.
        For example, we already have the hamiltonian of the following problem 2x1x2 - 4x2x4 - 3, and the variables are [x1, x2, x4].

        >>> from pyqubo import Binary
        >>> x1 = Binary('x1')
        >>> x2 = Binary('x2')
        >>> x4 = Binary('x4')
        >>> hamiltonian = 2*x1*x2 - 4*x2*x4 - 3
        >>> model = hamiltonian.compile()
        >>> qubo, offset = model.to_qubo()
        >>> get_matrix_term(qubo, model.variables)
        [{'c': 2.0, 'p': [0, 1]}, {'c': -4.0, 'p': [1, 2]}]

        Args:
            matrix_element: dict object that contains the qubo matrix elements.
            variables: list object that contains model's variables.

        Return: list object that contains the matrix term, which is encoded in terms indecies and the coefficients
        """
        matrix_terms = []
        for key, value in matrix_element.items():
            term = {}
            term['c'] = value
            term['p'] = [variables.index(key[0]), variables.index(key[1])]
            matrix_terms.append(term)
        return matrix_terms
    
    def _post_solve(self, problem_body: dict) -> dict:
        """Post and solve the problem using Fujitsu DAU API

        The function posts the problem to Fujitsu DAU API. To post and solve the problem, it requires
        the api_key. Please setup the api_key variables inadvance

        In addition to posting the problem to Fujitsu DAU API, the function also registers the job_id to
        the DAU management app to track the use of DAU. 
        This also requires the dma_api_key. Please setup the dma_api_key variables inadvance.
        For futher information about the DAU management app, please refer to the following link:
            https://dau.emath.tw/

        Args:
            problem_body: dict object that contains the problem. 
                For example, the problem_body for the following problem 2x1x2 - 4x2x4 - 3  is:
                {
                    "fujitsuDA3": {
                        "time_limit_sec": 10,
                        "penalty_coef" : 1000,
                        "num_run" : 16,
                        "num_group" : 16,
                        "gs_level" : 90,
                        "gs_cutoff" : 90000,
                    },
                    "binary_polynomial": {
                        "terms": [
                            {"c": 2, "p": [1, 2] },
                            {"c": -4, "p": [2, 4] },
                            {"c": -3, "p": [] }
                        ] 
                    }
                }
        
        Return: dict object that contains the job_id.
        """
        problem_header = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "X-Api-Key": api_key
        }

        response = requests.post(
            dau_url+"/da/v3/async/qubo/solve", 
            headers=problem_header, 
            data=json.dumps(problem_body,default=int)
            )
        
        job_id = response.json()['job_id']
        
        register_response = requests.post(dma_url + "/api/posts", headers={
            "Content-Type": "application/json",
            "Accept": "application/json"
        }, data=json.dumps({
        "api_key" : dma_api_key,
        "job_id" : job_id,
        "time_limit_sec" : problem_body["fujitsuDA3"]['time_limit_sec']
        }))
        print(register_response.json())
        
        return response.json()
    
    def _delete_job(self, job_id:str) -> dict:
        """Delete the job from the Fujitsu DAU API

        The function deletes the job from the Fujitsu DAU API. To delete the job, it requires
        the api_key. Please setup the api_key variables inadvance and also give the job_id that is returned by the Fujitsu DAU API.

        Args:
            job_id: string object that contains the job_id.

        Return: dict object that contains the response of the delete request. The response would contain the result of
        the computation, if the job is finished. Otherwise, the response would only contain the message. 
        """
        solution_header = {
            "Job_ID": job_id,
            "Accept": "application/json",
            #"X-Access-Token": token
            "X-Api-Key": api_key 
        }
        delete_response = requests.delete(dau_url+"/da/v3/async/jobs/result/"+job_id, headers=solution_header)
        return delete_response.json()
    
    def _get_solution(self, job_id:str) -> dict:
        """Get the solution of the problem using Fujitsu DAU API

        The function gets the solution of the problem from Fujitsu DAU API. To get the solution, it requires
        the api_key. Please setup the api_key variables inadvance and also give the job_id that is returned by the Fujitsu DAU API.

        Args:
            job_id: string object that contains the job_id.
        
        Return: dict object that contains the solution.
        """
        solution_header = {
            "Job_ID": job_id,
            "Accept": "application/json",
            "X-Api-Key": api_key 
        }
        solution = requests.get(dau_url+"/da/v3/async/jobs/result/"+job_id, headers=solution_header)
        return solution.json()

    def _convert_configuration_to_solution(self, config, variables):
        data = {}
        for i in range(len(variables)):
            if config[str(i)]:
                data[variables[i]] = 1
            else:
                data[variables[i]] = 0
        return data
    
    def _generate_shift_from_solution(self, solution_dict):
        table = np.zeros((self._number_of_workers, self._days))
        for key, value in solution_dict.items():
            if "x" in key and "*" not in key:
                indexes = re.findall(r'\[(\d+)\]', key)
                indexes = [int(index) for index in indexes]
                table[indexes[0], indexes[1]] = value
        return table

    def decode(self, solutions):
        decoded_solutions = []
        for i in range(len(solutions)):
            decoded_solutions.append(
                self._convert_configuration_to_solution(solutions[i]['configuration'], self._model.variables)
            )

        shifts = []
        for i in range(len(decoded_solutions)):
            shifts.append(
                self._generate_shift_from_solution(decoded_solutions[i])
            ) 

        return shifts



    def compile(self):
        self._H = Num(0)
        for i in range(len(self._binomial_constraints)):
            self._H += self._binomial_constraints[i].weighted_hamiltonian()

        self._model = self._H.compile()
        qubo, offset = self._model.to_qubo()
        VARIABLES = self._model.variables

        self._binomial_matrix_terms = self._get_matrix_term(qubo, VARIABLES)

        self._inequality_terms = []
        for constraint in self._inequality_constraints:
            constraint_inequalities = constraint.inequalities(VARIABLES)
            
            for term in constraint_inequalities:
                self._inequality_terms.append({
                    "terms" : term
                })

        return self._binomial_matrix_terms, self._inequality_terms


    def solve(self):
        problem_body = {
            "fujitsuDA3": {
                "time_limit_sec": self._computation_time,
                "penalty_coef" : 1000,
                "num_run" : 16,
                "num_group" : 16,
                "gs_level" : 90,
                "gs_cutoff" : 90000,
            },
            "binary_polynomial": {
                "terms": self._binomial_matrix_terms
            },
            "inequalities": self._inequality_terms
        }

        response = self._post_solve(problem_body)
        job_id = response['job_id']
        print(response)
        time.sleep(self._computation_time)
        solution = self._get_solution(job_id)
        while not 'qubo_solution' in solution:
            time.sleep(1)
            solution = self._get_solution(job_id)

        self._delete_job(job_id)  
        # print(solution)

        with open('solution.json', 'w') as f:
            json.dump(solution, f, indent=4)

        tables = self.decode(solution['qubo_solution']['solutions'])
        print(tables[0])
        table = pd.DataFrame(tables[0], dtype=int, columns=range(1, int(self.problem['days'])+1))
        print(table)
        self.evaluate(table)

    def evaluate(self, table):
        for i in range(len(self._binomial_constraints)):
            print(self._binomial_constraints[i].evaluate(table))
        for i in range(len(self._inequality_constraints)):
            print(self._inequality_constraints[i].evaluate(table))

if __name__ == "__main__":

    with open("data.json", 'r') as f:
        data = json.load(f)
    # print(json.dumps(data, indent=4))

    # with open('solution.json', 'r') as f:
    #     solution = json.load(f)

    solver = DAUSolver(data)
    solver.compile()
    solver.solve()
