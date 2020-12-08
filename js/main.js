'use strict';

let start = document.getElementById('start'), // кнопка старта
    cancel = document.getElementById('cancel'), // кнопка отмены
    incomeAdd = document.querySelector('.income_add'),    
    expensesAdd = document.querySelector('.expenses_add'),    
    checkBox = document.querySelector('#deposit-check'),
    additionalIncomeItem = document.querySelectorAll('.additional_income-item'),
    budgetDayValue = document.getElementsByClassName('budget_day-value')[0],
    expensesMonthValue = document.getElementsByClassName('expenses_month-value')[0],
    additionalIncomeValue = document.getElementsByClassName('additional_income-value')[0],
    additionalExpensesValue = document.getElementsByClassName('additional_expenses-value')[0],
    incomePeriodValue = document.getElementsByClassName('income_period-value')[0],
    targetMonthValue = document.getElementsByClassName('target_month-value')[0],
    salaryAmount = document.querySelector('.salary-amount'), //Месячный доход
    expensesItems = document.querySelectorAll('.expenses-items'),
    additionalExpensesItem = document.querySelector('.additional_expenses-item'), // Возможные расходы
    targetAmount = document.querySelector('.target-amount'), //Сумма депозита
    periodSelect = document.querySelector('.period-select'), //выбор периода
    periodAmount = document.querySelector('.period-amount'),
    budgetMonthValue = document.querySelector('.budget_month-value'),
    incomeItems = document.querySelectorAll('.income-items');


let isNumber = function(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
};

//-------------------------------
const AppData = function() {

    this.income = {}; // дополнительный источник дохода
    this.addIncome = [];
    this.expenses = {}; // расходы
    this.addExpenses = [];
    this.incomeMonth = 0;
    this.deposit = false;
    this.percentDeposit = 0; // процент депозита
    this.moneyDeposit = 0; // сколько человек заложил  
    this.budget = 0; // доход
    this.budgetDay = 0; // budgetMonth / 30
    this.budgetMonth = 0; // доходы минус сумма расходов в месяц
    this.expensesMonth = 0;  // сумма расходов 
};
AppData.prototype.check = function() {
    if (salaryAmount.value !== '') {
        start.removeAttribute('disabled');
    }
};
AppData.prototype.start = function() {  
    if (salaryAmount.value === '') {
        start.setAttribute('disabled', 'true');
        return;
    }
    let allInput = document.querySelectorAll('.data input[type = text]');
    allInput.forEach(function(item) {
        item.setAttribute('disabled', 'true');
    });
    expensesAdd.setAttribute('disabled', 'true');
    incomeAdd.setAttribute('disabled', 'true');
    cancel.style.display = "block";
    start.style.display = "none";        

    this.budget = +salaryAmount.value;        
    this.getExpenses();
    this.getIncome(); 
    this.getExpensesMonth();
    this.getAddExpenses();
    this.getAddIncome();         
    this.getBudget();          
    this.getInfoDeposit();
    this.getStatusIncome();    
    this.showResult();
    /* this.blocked();  */
};
AppData.prototype.showResult = function() {
    const _this = this;
    budgetMonthValue.value = this.budgetMonth;
    budgetDayValue.value = this.budgetDay;
    expensesMonthValue.value = this.expensesMonth;
    additionalExpensesValue.value = this.addExpenses.join(', ');
    additionalIncomeValue.value = this.addIncome.join(', ');
    targetMonthValue.value = Math.ceil(this.getTargetMonth());
    incomePeriodValue.value = this.calcSavedMoney();       
    periodSelect.addEventListener('change', function() {
        incomePeriodValue.value = _this.calcSavedMoney();
    }); 
};
AppData.prototype.addExpensesBlock = function() {
    let expensesItems = document.querySelectorAll('.expenses-items');       
    let cloneExpensesItem = expensesItems[0].cloneNode(true);
    expensesItems[0].parentNode.insertBefore(cloneExpensesItem, expensesAdd);

    if (expensesItems.length === 2) {
        expensesAdd.style.display = 'none';
    }
};
AppData.prototype.getExpenses = function() {
    const _this = this;
    expensesItems.forEach(function(item) {
        let itemExpenses = item.querySelector('.expenses-title').value;
        let cashExpenses = item.querySelector('.expenses-amount').value;
        if(itemExpenses !== '' && cashExpenses !== '') {
            _this.expenses[itemExpenses] = cashExpenses;
        }
    }); 
};
AppData.prototype.addIncomeBlock = function() {
    let incomeItems = document.querySelectorAll('.income-items');        
    let cloneIncomeItem = incomeItems[0].cloneNode(true);
    incomeItems[0].parentNode.insertBefore(cloneIncomeItem, incomeAdd);

    if (incomeItems.length === 2) {
        incomeAdd.style.display = 'none';
    }
};
AppData.prototype.getIncome = function() {
    const _this = this;
    incomeItems.forEach(function(item) {
        let itemIncome = item.querySelector('.income-title').value;
        let cashIncome = item.querySelector('.income-amount').value;
        if(itemIncome !== '' && cashIncome !== '') {
            _this.income[itemIncome] = cashIncome;
        }
    });

    for (let key in this.income) {
        this.incomeMonth += +this.income[key];
    }
};
AppData.prototype.getAddExpenses = function() {    
    let addExpenses = additionalExpensesItem.value.split(', ');
    const _this = this;
    addExpenses.forEach(function(item) {
        item = item.trim();
        if (item !== '') {
            _this.addExpenses.push(item);
        }
    });  
};
AppData.prototype.getAddIncome = function() {
    const _this = this;
    additionalIncomeItem.forEach(function(item) {
        let itemValue = item.value.trim();
        if (itemValue !== '') {
            _this.addIncome.push(itemValue);
        }
    });
};
AppData.prototype.getExpensesMonth = function() {
    for (let key in this.expenses) {
        this.expensesMonth += +this.expenses[key];
    } 
};
AppData.prototype.getBudget = function() {
    this.budgetMonth = this.budget + this.incomeMonth - this.expensesMonth;
    this.budgetDay = Math.floor(this.budgetMonth / 30); 
};
AppData.prototype.getTargetMonth = function() {
    return targetAmount.value / this.budgetMonth;  
};
AppData.prototype.getStatusIncome = function() {
    if (this.budgetDay >= 1200) {
        return('У вас высокий уровень дохода');
    } else if (this.budgetDay > 600 && this.budgetDay < 1200) {
        return('У вас средний уровень дохода');
    } else if (this.budgetDay > 0 && this.budgetDay < 600) {
        return('К сожалению у вас уровень дохода ниже среднего');
    } else {
        return('Что то пошло не так');
    }
};
AppData.prototype.getInfoDeposit = function() {
    if (this.deposit) {
        this.percentDeposit = prompt('Какой годовой процент?', '10');
        while (isNumber(this.percentDeposit) || this.percentDeposit.trim() === '' || this.percentDeposit === null) {
            this.percentDeposit = prompt('Какой годовой процент?', '10');
        }
        this.moneyDeposit = prompt('Какая сумма заложена?', 1000);   
        while (isNaN(this.moneyDeposit) || this.moneyDeposit.trim() === '' || this.moneyDeposit === null) {
            this.moneyDeposit = prompt('Какая сумма заложена?', 1000);
        }
    }  
};
AppData.prototype.calcSavedMoney = function() {
    return this.budgetMonth * periodSelect.value;
};
AppData.prototype.reset = function() {
    let inputTextData = document.querySelectorAll('.data input[type = text]'),
    resultInputAll = document.querySelectorAll('.result input[type = text]');

    inputTextData.forEach(function(elem) {
        elem.value = '';
        elem.removeAttribute('disabled');
        periodSelect.value = '0';
        periodAmount.innerHTML = periodSelect.value;
    });
    resultInputAll.forEach(function(elem) {
        elem.value = '';
    });

    for(let i = 1; i < incomeItems.length; i++) {
        incomeItems[i].parentNode.removeChild(incomeItems[i]);
        incomeAdd.style.display = 'block';
    }

    for(let i = 1; i < expensesItems.length; i++) {
        expensesItems[i].parentNode.removeChild(expensesItems[i]);
        expensesAdd.style.display = 'block';
    }

    this.budget = 0;
    this.budgetDay = 0;
    this.budgetMonth = 0;
    this.income = {};
    this.incomeMonth = 0;
    this.addIncome = [];
    this.expenses = {};
    this.expensesMonth = 0;
    this.deposit = false;
    this.percentDeposit = 0;
    this.moneyDeposit = 0;
    this.addExpenses = [];

    cancel.style.display = "none";
    start.style.display = "block";
    expensesAdd.removeAttribute('disabled');
    incomeAdd.removeAttribute('disabled');
    checkBox.checked = false;
};
AppData.prototype.blocked = function() {
    document.querySelectorAll('.data input[type = text]').forEach(function(item) {
        item.disabled = true;
    });
    start.style.display = 'none';
    cancel.style.display = 'block';
};
/* AppData.prototype.eventListeners = function() {
    const _this = this;
    start.addEventListener('click', _this.start.bind(_this));
    cancel.addEventListener('click', _this.reset.bind(_this));
    expensesAdd.addEventListener('click', _this.addExpensesBlock);
    incomeAdd.addEventListener('click', _this.addIncomeBlock);
    salaryAmount.addEventListener('keyup', _this.check);

    periodSelect.addEventListener('change', function() {
        periodAmount.innerHTML = periodSelect.value;               
    });
}; */

const appData = new AppData();
/* AppData.prototype.eventListeners(); */
console.log(appData);

periodSelect.addEventListener('change', function() {
    periodAmount.innerHTML = periodSelect.value;               
});

start.addEventListener('click', appData.start.bind(appData));
cancel.addEventListener('click', appData.reset.bind(appData));
expensesAdd.addEventListener('click', appData.addExpensesBlock);
incomeAdd.addEventListener('click', appData.addIncomeBlock);
salaryAmount.addEventListener('keyup', appData.check);


let addExp = [];
for(let i = 0; i < appData.addExpenses.length; i++) {
    let element = appData.addExpenses[i].trim();
    element = element.charAt(0).toUpperCase() + element.substring(1).toLowerCase();
    addExp.push(element);
} 