'use strict'

let itemDesc = document.getElementById("itemdesc");
let income = document.getElementById("income");
let expense = document.getElementById("expense");
let btn = document.querySelector("button");
let totalIncome = document.querySelector(".totalincome");
let totalExpenses = document.querySelector(".totalexpenses");
let incomeArr = [];
let expenseArr = [];
let itemArr = [];
let list = document.querySelector(".list");
let incomeSum = 0;
let expenseSum = 0;
let currencyForm = document.querySelector(".currency_form");


let deletedvalue;
let undeletedvalue = 0;

let currency = "USD";
let prevCurrency = currency;
let currencyFormatter = new Intl.NumberFormat(
    'en-US', {
        style: "currency",
        currency:  `${currency}`,
        maximumFractionDigits: 2
    }
);

totalIncome.innerHTML = `${currencyFormatter.format(0)}`;
totalExpenses.innerHTML = `${currencyFormatter.format(0)}`;

class Item {
    constructor(desc, income, expense) {
        this.description = desc;
        this.income = income;
        this.expense = expense;
    }
}

currencyForm.addEventListener('change', (e) => {
    console.log(e.target.value);
    currency = e.target.value;
    currencyChanged(currency);
})

let currencyChanged = (currency) => {
    currencyFormatter = new Intl.NumberFormat(
        'en-US', {
            currencyDisplay: "narrowSymbol",
            style: "currency",
            currency: currency,
            maximumFractionDigits: 2
        }
    );
    let newTotalIncome = totalIncome.textContent.slice(1);
    let newTotalExpense = totalExpenses.textContent.slice(1);
    totalIncome.innerHTML = `${currencyFormatter.format(newTotalIncome)} `;
    totalExpenses.innerHTML = `${currencyFormatter.format(myExpenseTotal(newTotalExpense))} `;

    if (currency !== prevCurrency) {
        console.log(list.children);
        prevCurrency = currency;
        if (list.children.length < 1)
            return ;
        let index = 0;
        list.childNodes.forEach((item) => {
            // console.log(item.innerText);
            let dupItemValue = item.innerText;
            // console.log(dupItemValue);
            console.log(item, item.innerText);
            if (dupItemValue) {
                let mod = dupItemValue.split(" ");
                console.log(mod);
                if (itemArr[index].income != "") {
                    mod[1] = `${currencyFormatter.format(itemArr[index].income)}`;            
                    item.innerHTML = `<span class="a">X</span>${mod[0]} ${mod[1]}`;
                }
                else {
                    mod[1] = `${currencyFormatter.format(itemArr[index].expense)}`;            
                    item.innerHTML = `<span class="a">X</span>${mod[0]} ${mod[1]}`;
                }
                console.log(mod);
                index++;
            }
        });
    }
}

btn.addEventListener('click', (x) => {
    let validValue = false;
    // checks if the description field is not empty and at least one of the other fields is not
    if (itemDesc.value != "" && (income.value != "" || expense.value != ""))
    {
        console.log(itemDesc.value, income.value, expense.value);
    //  Checks each field individually and adds to its array values that are not an empty string
        // if (itemDesc.value != "")
        // {
            // items.desc = itemDesc.value;
            // items.income = income.value;
            // items.expense = expense.value;
            // itemArr.push(items);
            // }
        if (income.value != "" && parseFloat(income.value) > 0)
        {
            itemArr.push(new Item(itemDesc.value, income.value, expense.value)); //creates an object for new entries passed to the array of item
            incomeArr.push(income.value); // array of values entered in the income field
            // adds to the list an income
            list.insertAdjacentHTML("beforeend", `<li class="income-li"><span class="a">X</span>${itemDesc.value} ${currencyFormatter.format(income.value)}</li>`);
            validValue = true;
        }
        console.log(expense.value);
        if (expense.value != "" && parseFloat(expense.value) > 0)
        {
            itemArr.push(new Item(itemDesc.value, income.value, expense.value)); //creates an object for new entries passed to the array of item
            expenseArr.push(expense.value); // array of values entered in the expense field
            // adds to the list an expense 
            list.insertAdjacentHTML("beforeend", `<li class="expense-li"><span class="a">X</span>${itemDesc.value} ${currencyFormatter.format(expense.value)}</li>`);
            validValue = true;
        }
        // helper fxns are invoked and total income and total expenses are updated
        if (validValue) {
            totalIncome.innerHTML = `${currencyFormatter.format(myIncomeTotal(income.value, expense.value))} `;
            totalExpenses.innerHTML = `${currencyFormatter.format(myExpenseTotal(expense.value))} `;
            // totalIncome.insertAdjacentHTML("beforeend", `<div>${myIncomeTotal(income.value, expense.value)}</div>`)
            // console.log(itemArr, incomeArr, expenseArr);
            validValue = false;
        }

        // clears either income or expense field after submission
        if((income.value != "") || (expense.value != ""))
        {
            expense.value = "";
            income.value = "";
        }
        expense.removeAttribute("disabled");
        income.removeAttribute("disabled");   
    }
});

//calculates the total income 
let myIncomeTotal = (myIncome, mySpendings) => {
    incomeSum = incomeSum + (myIncome - mySpendings) ;
    console.log(incomeSum); 
    return incomeSum;  
}

// calculates the total expenses
let myExpenseTotal = (mySpendings) => {
    expenseSum += (mySpendings - 0);
    return expenseSum;
}

// Disables either the income or expense field when entering a value in any.
// and enables both when no value is entered in either
function disableInput() {
    if(income.value != "")
    {
        expense.setAttribute("disabled", "disabled")
    }
    else if(expense.value != "")
    {
        income.setAttribute("disabled", "disabled");
    }
    else {
        expense.removeAttribute("disabled");
        income.removeAttribute("disabled");
    }
}

// list.children
// list.parentElement list.parentNode

// deletes any item on the list and updates the total income
list.addEventListener('click', function (e) {
    console.log(e.target);
    console.log(list.children);
    // console.log(e.target.parentElement)
    //checks the targeted span tag to delete the li element containing it 
    if (e.target.attributes.class.value == "a")
    {
        // e.target.parentNode.remove()
        console.log(e.target.parentNode);
        // if(e.target.parentNode.attributes.class.value =="income-li")
        // {
        //     console.log("Income");
        // }
        // else if (e.target.parentNode.attributes.class.value == "expense-li")
        // {
        //     console.log("Expenditure")
        // }

        let i = 0;
        let myarray = [] // myarray is used as a counter to determine the position of income value targeted in order to delete and deduct this targeted income from the total income
        let myexparray = []; // works the same way to delete and deduct the targeted expense
        while (i < list.children.length)
        {
            // console.log(list.children[i]);
            if (list.children[i].attributes.class.value == "income-li")
            {
                console.log(list.children[i]);
                myarray.push(list.children[i]);
                // to delete item removed from the item arr
                    if(list.children[i] == e.target.parentNode)
                    {
                        itemArr.splice(i,1)
                    }
            }
            i++;
        }
        // loop uses the myarr as a counter to determine position of the deleted income value and to
        // remove the deleted income value from the income arr
        for(let i = 0; i < myarray.length; i++)
        {
            if (myarray[i] == e.target.parentNode)
            {
                console.log(i);
                console.log(incomeArr[i]);
                deletedvalue = incomeArr[i];
                incomeArr.splice(i,1);
                totalIncome.innerHTML = `${currencyFormatter.format(myIncomeTotal(-deletedvalue,undeletedvalue))}`;
            }
        }

        let j = 0;
        while (j < list.children.length)
        {
            // console.log(list.children[i]);
            if (list.children[j].attributes.class.value == "expense-li")
            {
                console.log(list.children[j])
                myexparray.push(list.children[j]);
                if(list.children[j] == e.target.parentNode)
                {
                    itemArr.splice(j,1);
                }
            }
            j++;
        }
        for (let i = 0; i < myexparray.length; i++)
        {
            if (myexparray[i] == e.target.parentNode)
            {
                console.log(i);
                console.log(expenseArr[i]);
                deletedvalue = expenseArr[i];
                expenseArr.splice(i,1);
                totalIncome.innerHTML = `${currencyFormatter.format( myIncomeTotal(undeletedvalue,-deletedvalue) )}`;
                totalExpenses.innerHTML = `${currencyFormatter.format( myExpenseTotal(-deletedvalue) )}`;
            }
        }
        console.log(myarray);
        e.target.parentNode.remove();
    }
});



