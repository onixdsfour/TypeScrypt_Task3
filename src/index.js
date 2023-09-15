var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var DepartmentAreasEnum;
(function (DepartmentAreasEnum) {
    DepartmentAreasEnum["ACCOUNTING"] = "Acounting";
    DepartmentAreasEnum["DEVELOPMENT"] = "Development";
    DepartmentAreasEnum["HR"] = "Hr";
})(DepartmentAreasEnum || (DepartmentAreasEnum = {}));
var EmployeeStatusEnum;
(function (EmployeeStatusEnum) {
    EmployeeStatusEnum["ACTIVE"] = "Active";
    EmployeeStatusEnum["INACTIVE"] = "Inactive";
    EmployeeStatusEnum["PAUSED"] = "Paused";
})(EmployeeStatusEnum || (EmployeeStatusEnum = {}));
var Company = /** @class */ (function () {
    function Company() {
        this.name = 'CompanyFirst';
        this.departments = [];
        this.preEmploees = [];
    }
    Object.defineProperty(Company.prototype, "staff", {
        get: function () {
            return __spreadArray(__spreadArray([], this.departments.flatMap(function (item) { return item.depEmployees; }), true), this.preEmploees, true);
        },
        enumerable: false,
        configurable: true
    });
    return Company;
}());
var Department = /** @class */ (function () {
    function Department(name, area) {
        this.depEmployees = [];
        this.budget = {
            debit: 0,
            credit: 0,
        };
        this.name = name;
        this.area = area;
    }
    Object.defineProperty(Department.prototype, "balance", {
        get: function () {
            return this.budget.debit - this.budget.credit;
        },
        enumerable: false,
        configurable: true
    });
    Department.prototype.addEmployee = function (employee) {
        if (employee instanceof Employee) {
            employee.departament.removeEmploee(employee);
            this.depEmployees = __spreadArray(__spreadArray([], this.depEmployees, true), [employee], false);
            this.budget.credit += employee.salary;
        }
        else {
            var firstName = employee.firstName, lastName = employee.lastName, salary = employee.salary, bankAccNumber = employee.bankAccNumber, paymentInfo = { iban: '', bankCard: 0 };
            this.depEmployees = __spreadArray(__spreadArray([], this.depEmployees, true), [
                new Employee(firstName, lastName, salary, bankAccNumber, paymentInfo, this),
            ], false);
        }
    };
    Department.prototype.removeEmploee = function (employee) {
        if (employee instanceof Employee) {
            employee.departament.depEmployees.filter(function (item) { return item.firstName === employee.firstName && item.lastName === employee.lastName; });
            employee.departament.budget.credit = employee.departament.budget.credit - employee.salary;
        }
    };
    return Department;
}());
var PreEmployee = /** @class */ (function () {
    function PreEmployee(firstName, lastName, salary, bankAccNumber) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.salary = salary;
        this.bankAccNumber = bankAccNumber;
    }
    return PreEmployee;
}());
var Employee = /** @class */ (function () {
    function Employee(firstName, lastName, salary, bankAccNumber, paymentInfo, department) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.salary = salary;
        this.bankAccNumber = bankAccNumber;
        this.paymentInfo = paymentInfo;
        this.departament = department;
        this.status = EmployeeStatusEnum.ACTIVE;
    }
    return Employee;
}());
var Accounting = /** @class */ (function (_super) {
    __extends(Accounting, _super);
    function Accounting(name, area) {
        if (name === void 0) { name = 'accounting'; }
        var _this = _super.call(this, name, area) || this;
        _this.salaryBalance = [];
        return _this;
    }
    Accounting.prototype.addToBalance = function (item) {
        var _a;
        isDepartment(item) ? (_a = this.salaryBalance).push.apply(_a, item.depEmployees) : this.salaryBalance.push(item);
    };
    Accounting.prototype.removeFromBalance = function (item) {
        if (isDepartment(item)) {
            var _loop_1 = function (employee) {
                this_1.salaryBalance.filter(function (entity) { return entity != employee; });
            };
            var this_1 = this;
            for (var _i = 0, _a = item.depEmployees; _i < _a.length; _i++) {
                var employee = _a[_i];
                _loop_1(employee);
            }
        }
        else {
            this.salaryBalance.filter(function (entity) { return entity != item; });
        }
    };
    Accounting.prototype.salaryPayment = function () {
        for (var _i = 0, _a = this.salaryBalance; _i < _a.length; _i++) {
            var entity = _a[_i];
            if (isPreEmployee(entity)) {
                this.externalPayment(entity);
            }
            else if (isEmployee(entity)) {
                this.internalPayment(entity);
            }
            else {
                for (var _b = 0, _c = entity.depEmployees; _b < _c.length; _b++) {
                    var employee = _c[_b];
                    this.internalPayment(employee);
                }
            }
        }
    };
    Accounting.prototype.internalPayment = function (employee) { };
    Accounting.prototype.externalPayment = function (preEmploee) { };
    return Accounting;
}(Department));
function isEmployee(item) {
    return item instanceof Employee;
}
function isPreEmployee(item) {
    return item instanceof Employee;
}
function isDepartment(item) {
    return item instanceof Employee;
}
console.log("ok");
