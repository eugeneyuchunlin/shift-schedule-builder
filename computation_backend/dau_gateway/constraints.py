from pyqubo import Binary, Array, Constraint, Model, And, Or, Not, Num
import numpy as np
import re
# from .utility import *

def convert_hamiltonian_to_binary_polynomial_term(hamiltonian, variables):
    model = hamiltonian.compile()
    qubo, offset = model.to_qubo()
    # variables = model.variables
    binary_polynomial_terms = []

    for key, value in qubo.items():
        # print(key, value)

        binary_polynomial_terms.append({
            'c' : value,
            'p' : [
                variables.index(key[0]),
                variables.index(key[1])
            ]
        })

    binary_polynomial_terms.append({
        'c' : offset,
        'p' : []
    }) 

    return binary_polynomial_terms


class ConstraintFunction(object):
    
    def __init__(self, X:Array, **kwargs):
        self._X = X
        self._weight = float(kwargs['weight'])
        
    def hamiltonian(self) -> Model:
        pass

    def weighted_hamiltonian(self) -> Model:
        return self._weight * self.hamiltonian()
    
    def evaluate(self, table) -> dict:
        pass


class ExpectedWorkingDays(ConstraintFunction):
    
    def __init__(self, X:Array, **kwargs):
        super().__init__(X, **kwargs)
        
        self._expected_working_days = int(kwargs['ewd'])
        
    def hamiltonian(self):
        workers, days = self._X.shape
        H = Num(0)
        for r in range(workers):
            H += (sum([self._X[r][day] for day in range(1, days)], start=self._X[r][0]) - self._expected_working_days)**2
        return H
    
    def evaluate(self, table):
        
        content = table.values
        rows, cols = content.shape
        
        failed_rates = []
        for r in range(rows):
            diff = self._expected_working_days - sum(content[r])
            # if (diff != 0):
            #     print("Worker %d failed => %d" % (r, diff))
            failed_rates.append(abs(diff) / self._expected_working_days)
         
        
        return 1 - np.average(failed_rates)

    def __str__(self):
        return "Expected Number of Working Days"
    
    def __repr__(self):
        return "Expected Number of Working Days"
    
class ExpectedNumberOfWorkersInEachShift(ConstraintFunction):
    
    def __init__(self, X:Array, **kwargs):
        
        super().__init__(X, **kwargs)
        self._expected_workers = int(kwargs['enwps'])
        
    def hamiltonian(self):
        shifts = []
        workers, days = self._X.shape
        H = 0
        for i in range(days):
            shift = 0
            for j in range(workers):
                shift += self._X[j][i]
            H += (shift - self._expected_workers) ** 2
            
        return H
    
    def evaluate(self, table):
        # print("Evaluate on expected number of workers on each shift")
        failed = 0
        for i in table.columns:
            _sum = table[i].sum()
            if _sum != self._expected_workers:
                failed += 1
                # print("\tdate[%d] Failed" % (i))
        correct_rate = failed / len(table.columns)
        
        return 1 - correct_rate
    
    def __str__(self):
        return "Expected Number of Workers per Shift"
    
class MaximumConsecutiveShifts(ConstraintFunction):
    
    def __init__(self, X:Array, **kwargs):
        super().__init__(X, **kwargs)
        
        self._max_consecutive_day = int(kwargs['mcwd'])
        
    
    def hamiltonian(self):
        shift_cycles = []
        row, col = self._X.shape
        for i in range(row):
            shift_cycle = []
            for j in range(col - self._max_consecutive_day):
                shift_cycle.append( sum([self._X[i][p] for p in range(j, j + self._max_consecutive_day)], start=self._X[i][j+self._max_consecutive_day]) )
            shift_cycles.append(shift_cycle)
        
        cycle = col - self._max_consecutive_day
        
        slack_initial = Array.create("slack1", shape=row * cycle * self._max_consecutive_day, vartype="BINARY")
        slack = np.zeros(row * cycle * self._max_consecutive_day).reshape(row, cycle * self._max_consecutive_day)
        slack = slack.tolist()
        print(slack_initial.shape)

        for i in range(row):
            for j in range(cycle * self._max_consecutive_day):
                slack[i][j] = slack_initial[cycle * self._max_consecutive_day * i + j]
        
        H = 0
        for i in range(row):
            for j in range(cycle):
                # To adapt the condition k is not equal to 4, a for-loop needed
                H += (shift_cycles[i][j] - sum(slack[i][l]
                                                for l in range(self._max_consecutive_day * j, self._max_consecutive_day *(j+1))) )**2
                
        return H
    
    def evaluate(self, table):
        # print("Evaluate on the limit of max consecutive shifts:")
        content = table.values
        row, col = content.shape
        failed = 0
        for r in range(row):
            for c in range(col - self._max_consecutive_day - 1):
                if(sum(content[r][c:c+self._max_consecutive_day+1]) > self._max_consecutive_day):
                    failed += 1
                    print("\tworker[%d], date[%d] Failed" % (r+1, c+1))

        correctness_rate = 1 - (failed / (row*(col - self._max_consecutive_day)))
        
        return correctness_rate
    
    def __str__(self):
        return "Maximum Consecutive Working Days"
    
    def __repr__(self):
        return "Maximum Consecutive Working Days"

class MaximumConsecutiveShiftsInequalities(MaximumConsecutiveShifts):
    
    def __init__(self, X, **kwargs):
        super().__init__(X, **kwargs)
    
    def hamiltonian(self):
        
        return Num(0)
    
    
    def inequalities(self, variables: list):
        shift_cycles = []
        row, col = self._X.shape
        for i in range(row):
            shift_cycle = []
            for j in range(col - self._max_consecutive_day):
                shift_cycle.append(sum([self._X[i][p] for p in range(j, j+self._max_consecutive_day+1)], start=Num(-self._max_consecutive_day)))
            shift_cycles.append(shift_cycle) 
        terms = []
        for shift_cycle in shift_cycles:
            for cycle in shift_cycle:
                term = convert_hamiltonian_to_binary_polynomial_term(cycle, variables)
                terms.append(term)
            
        return terms
    
    def __str__(self):
        return super().__str__()
    
    def __repr__(self):
        return super().__repr__()

    
class SuccessiveShiftPair(ConstraintFunction):
    
    def __init__(self, X:Array, **kwargs):
        super().__init__(X, **kwargs)
        
    def hamiltonian(self):
        row, col = self._X.shape
        Hc = 0
        for i in range(row):
            for j in range(col - 2):
                Hc = Hc + And(self._X[i][j + 1], 1 - Or(self._X[i][j], self._X[i][j + 2]))
            Hc = Hc + (And(self._X[i][0], Not(self._X[i][1]))) + (And(self._X[i][col - 1], Not(self._X[i][col - 2])))
        return Hc
        
    def evaluate(self, table):
        
        content = table.values
        row, col = content.shape
        failed = 0
        for r in range(row):
            for c in range(1, col-1):
                if content[r][c] == 1 and content[r][c-1] == 0 and content[r][c+1] == 0:
                    failed += 1
            if (content[r][0] == 1 and content[r][1] == 0) or (content[r][col - 1] == 1 and content[r][col - 2] == 0):
                failed += 1
                    
        possible_outcomes = row * col
        
        return 1 - (failed / possible_outcomes)

    def __str__(self):
        return "Successive Shift Pair"

    def __repr__(self):
        return "Successive Shift Pair"


class MinimumNDaysLeaveWithin7Days(ConstraintFunction):
    
    def __init__(self, X:Array, **kwargs):
        
        super().__init__(X, **kwargs)
        days = X.shape[1]
        month_days = [i for i in range(1, days + 1)]
        self._weekend = month_days[::7]

        self._n = int(kwargs['mndlw7d'])
        
    def hamiltonian(self):
        row, col = self._X.shape
        
        days = col
        week_slack = Array.create("slack2", shape=(row, col), vartype="BINARY")
        print(self._X.shape)
        H = 0
        for j in range(row):
            for i in self._weekend:
                if i + 7 < days:
                    H = H + (sum(self._X[j][l] for l in range(i, i + 7)) -
                               sum(week_slack[j][l] for l in range(i, i + 5)))**2
                elif i + 5 < days and i + 7 > days:
                    H = H + (sum(self._X[j][l] for l in range(i, days)) -
                               sum(week_slack[j][l] for l in range(i, i + 5)))**2
        return H
    
    def evaluate(self, table):
        content = table.values
        rows, cols = content.shape
        failed = 0
        
        days = cols
        for r in range(rows):
            for i in self._weekend:
                if i + 7 < days:
                    if sum(content[r][i:i+7]) > 5:
                        failed += 1
                if i + 5 < days and i + 7 > days:
                    if sum(content[r][i:]) > 5:
                        failed += 1
        return 1 - (failed / (len(self._weekend)*rows))

    def __str__(self):
        return "Minimum N Days Leave Within 7 Days"
    
    def __repr__(self):
        return "Minimum N Days Leave Within 7 Days"

class MinimumNDaysLeaveWithin7DaysInequalities(MinimumNDaysLeaveWithin7Days):
    
    def __init__(self, X:Array, **kwargs):
        super().__init__(X, **kwargs)
        self._n = int(kwargs['mndlw7d'])
        
    def inequalities(self, variables):
        nrows, ndays = self._X.shape
        hamiltonians = []
        for j in range(nrows):
            for i in self._weekend:
                if i + 7 < ndays:
                    hamiltonians.append(sum([self._X[j][l] for l in range(i, i + 7)], start=-Num(7-self._n)))
                # elif i + 5 < ndays and i + 7 > ndays:
                #     hamiltonians.append(sum([self._X[j][l] for l in range(i, ndays)], start=-Num(7-self._n)))
        
        terms = []
        
        for i in range(len(hamiltonians)):
            terms.append(convert_hamiltonian_to_binary_polynomial_term(hamiltonians[i], variables))
            
        return terms

    def __str__(self):
        return super().__str__()
    
    def __repr__(self):
        return super().__repr__()


class Consecutive2DaysLeaves(ConstraintFunction):
    
    def __init__(self, X, **kwargs):
        super().__init__(X, **kwargs)
        
    def hamiltonian(self):
        row, col = self._X.shape
        H = Num(0)
        for i in range(row):
            for j in range(col - 1):
                H += (1 - self._X[i][j] * self._X[i][j + 1])
                
        return H
    
    
    def evaluate(self, table):
        content = table.values
        rows, cols = content.shape
        
        all_leaves = 0
        all_consecutive_2days_leave = 0
        for r in range(rows):
            row = ''.join([str(shift) for shift in content[r]])
            all_leaves += len(re.findall(r'0+', row))
            
            consecutive_days_off = re.findall(r'(00)+0*', row)
            single_day_off = re.findall(r'0+', row)
#             print("\trow : ", row, end='=>')
#             print("\t cons days off", consecutive_days_off, end='====>')
#             print("\t single day off", single_day_off)
            
            all_consecutive_2days_leave += len(consecutive_days_off)
            
        return (all_consecutive_2days_leave / all_leaves)

    def __str__(self):
        return "Consecutive 2 Days Leave"

    def __repr__(self):
        return "Consecutive 2 Days Leave"

class NoConsecutive2DaysOff(ConstraintFunction):
    
    def __init__(self, X, **kwargs):
        super().__init__(X, **kwargs)
        
    def hamiltonian(self):
        number_of_workers, days = self._X.shape
        H = Num(0)
        for i in range(number_of_workers):
            for j in range(days - 1):
                H += ((1-self._X[i][j])*(1-self._X[i][j+1]))
            
        return H
    
    
    def evaluate(self, table):
        content = table.values
        number_of_workers, days = content.shape
        
        number_of_days_off = 0
        failed = 0
        for i in range(number_of_workers):
            for j in range(days-1):
                if content[i][j] == 0:
                    number_of_days_off += 1
                
                if content[i][j] == 0 and content[i][j+1] == 0:
                    failed += 1
        
        return 1 - failed / number_of_days_off

    def __str__(self):
        return "No Consecutive 2 Days Off"
        
    def __repr__(self):
        return "No Consecutive 2 Days Off"

class PreferenceDayOff(ConstraintFunction):
    
    def __init__(self, X, **kwargs):
        """
        The initialization function of the class PreferenceDayOff
        
        The days_off_config should be in the following structure
        {
            ...
            
            i : [1, 2, 3 ... 31]
        }
        
        For example, the user want to set [0, 1, 2] three consecutive days off to worker 0,
        it can be achieved by passed
        {
            0 : [0, 1 2]
        }
        """
        super().__init__(X, **kwargs)


        self._days_off_config = kwargs['days_off_index']
        
    def hamiltonian(self):
        hamiltonian = Num(0)
        for key, array in self._days_off_config.items():
            for i in range(len(array)):
                date = array[i]
                hamiltonian += self._X[key][date]
        
        return hamiltonian
    
    def evaluate(self, table):
        # print("Prefered Days Off evaluation")
        all_settings = 0
        failed = 0
        for key, array in self._days_off_config.items():
            for i in range(len(array)):
                date = array[i]
                if table.values[key][date] == 1:
                    print(f"\tWorker[{key}] has to work on date {date}")
                    failed += 1
                all_settings += 1
                
        return 1 - (failed / all_settings)    

    def __str__(self):
        return "Customize Leave"
    
    def __repr__(self):
        return "Customize Leave"

CONSTRAINTS = {
    'expected_working_days' : {
        "type" : "binomial_polynomial",
        "function" : ExpectedWorkingDays
    },
    'expected_number_of_workers_per_shift' : {
        "type" : "binomial_polynomial",
        "function" : ExpectedNumberOfWorkersInEachShift
    },
    'successive_shift_pair' : {
        "type" : "binomial_polynomial",
        "function" : SuccessiveShiftPair
    },
    'consecutive_2_days_leave' : {
        "type" : "binomial_polynomial",
        "function" : Consecutive2DaysLeaves
    },
    'no_consecutive_leave' : {
        "type" : "binomial_polynomial",
        "function" : NoConsecutive2DaysOff
    },
    'customize_leave' : {
        "type" : "binomial_polynomial",
        "function" : PreferenceDayOff
    },
    'minimum_n_days_leave_within_7_days' : {
        "type" : "inequalities",
        "function" : MinimumNDaysLeaveWithin7DaysInequalities
    },
    'maximum_consecutive_working_days' : {
        "type" : "inequalities",
        "function" : MaximumConsecutiveShiftsInequalities
    },
}

if __name__ == '__main__':
    print("constraints")

    number_of_workers = 10
    days = 31

    X = Array.create("X", shape=(number_of_workers, days), vartype="BINARY")

    exp_working_constraint = ExpectedWorkingDays(X, 20)
    exp_workers_constraint = ExpectedNumberOfWorkersInEachShift(X, 7)
    successive_shift_constraint = SuccessiveShiftPair(X)
    consecutive_2days_leave_constraint = Consecutive2DaysLeaves(X)
    # min_leave_constraint = MinimumNDaysLeaveWithin7Days(X, days)

    min_leave_constraint = MinimumNDaysLeaveWithin7DaysInequalities(X, days)
    max_consecutive_shift_constraint = MaximumConsecutiveShiftsInequalities(X, 4)

    
