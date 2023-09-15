enum DepartmentAreasEnum {
  ACCOUNTING = 'Acounting',
  DEVELOPMENT = 'Development',
  HR = 'Hr',
}

enum EmployeeStatusEnum {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  PAUSED = 'Paused',
}

type Budget = {
  debit: number;
  credit: number;
};

type PaymentInfo = {
  iban: string;
  bankCard: number;
};

class Company {
  name: string = 'CompanyFirst';
  departments: Department[] = [];
  preEmploees: PreEmployee[] = [];

  get staff(): (PreEmployee | Employee)[] {
    return [...this.departments.flatMap(item => item.depEmployees), ...this.preEmploees];
  }
}

class Department {
  name: string;
  area: DepartmentAreasEnum;
  depEmployees: Employee[] = [];
  budget: Budget = {
    debit: 0,
    credit: 0,
  };

  get balance(): number {
    return this.budget.debit - this.budget.credit;
  }

  constructor(name: string, area: DepartmentAreasEnum) {
    this.name = name;
    this.area = area;
  }

  addEmployee(employee: Employee | PreEmployee): void {
    if (employee instanceof Employee) {
      employee.departament.removeEmploee(employee);
      this.depEmployees = [...this.depEmployees, employee];
      this.budget.credit += employee.salary;
    } else {
      const firstName = employee.firstName,
        lastName = employee.lastName,
        salary = employee.salary,
        bankAccNumber = employee.bankAccNumber,
        paymentInfo = { iban: '', bankCard: 0 };
      this.depEmployees = [
        ...this.depEmployees,
        new Employee(firstName, lastName, salary, bankAccNumber, paymentInfo, this),
      ];
    }
  }

  removeEmploee(employee: Employee | PreEmployee): void {
    if (employee instanceof Employee) {
      employee.departament.depEmployees.filter(
        item => item.firstName === employee.firstName && item.lastName === employee.lastName
      );
      employee.departament.budget.credit = employee.departament.budget.credit - employee.salary;
    }
  }
}
class PreEmployee {
  firstName: string;
  lastName: string;
  salary: number;
  bankAccNumber: string;

  constructor(firstName: string, lastName: string, salary: number, bankAccNumber: string) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.salary = salary;
    this.bankAccNumber = bankAccNumber;
  }
}

class Employee {
  firstName: string;
  lastName: string;
  salary: number;
  bankAccNumber: string;
  status: EmployeeStatusEnum;
  departament: Department;
  paymentInfo: PaymentInfo;

  constructor(
    firstName: string,
    lastName: string,
    salary: number,
    bankAccNumber: string,
    paymentInfo: PaymentInfo,
    department: Department
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.salary = salary;
    this.bankAccNumber = bankAccNumber;
    this.paymentInfo = paymentInfo;
    this.departament = department;
    this.status = EmployeeStatusEnum.ACTIVE;
  }
}

class Accounting extends Department {
  salaryBalance: (Employee | PreEmployee | Department)[] = [];

  constructor(name: string = 'accounting', area: DepartmentAreasEnum) {
    super(name, area);
  }

  addToBalance(item: Department | Employee): void {
    isDepartment(item) ? this.salaryBalance.push(...item.depEmployees) : this.salaryBalance.push(item);
  }

  removeFromBalance(item: Department | Employee | PreEmployee): void {
    if (isDepartment(item)) {
      for (const employee of item.depEmployees) {
        this.salaryBalance.filter(entity => entity != employee);
      }
    } else {
      this.salaryBalance.filter(entity => entity != item);
    }
  }

  salaryPayment(): void {
    for (const entity of this.salaryBalance) {
      if (isPreEmployee(entity)) {
        this.externalPayment(entity);
      } else if (isEmployee(entity)) {
        this.internalPayment(entity);
      } else {
        for (const employee of entity.depEmployees) {
          this.internalPayment(employee);
        }
      }
    }
  }

  internalPayment(employee: Employee): void {}

  externalPayment(preEmploee: PreEmployee): void {}
}

function isEmployee(item: unknown): item is Employee {
  return item instanceof Employee;
}

function isPreEmployee(item: unknown): item is PreEmployee {
  return item instanceof Employee;
}

function isDepartment(item: unknown): item is Department {
  return item instanceof Employee;
}

console.log("ok")