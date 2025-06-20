const balance = document.getElementById('balance');
const income = document.getElementById('income');
const expense = document.getElementById('expense');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const type = document.getElementById('type'); // New dropdown

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

function updateSummary() {
  const amounts = transactions.map(t => t.amount);
  const total = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);
  const incomeTotal = amounts.filter(a => a > 0).reduce((acc, val) => acc + val, 0).toFixed(2);
  const expenseTotal = amounts.filter(a => a < 0).reduce((acc, val) => acc + val, 0).toFixed(2);

  balance.innerText = `₹${total}`;
  income.innerText = `+₹${incomeTotal}`;
  expense.innerText = `-₹${Math.abs(expenseTotal)}`;
}

function renderTransactions() {
  list.innerHTML = '';

  transactions.forEach(transaction => {
    const sign = transaction.amount < 0 ? '-' : '+';
    const item = document.createElement('li');
    item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');
    item.innerHTML = `
      ${transaction.text} <span>${sign}₹${Math.abs(transaction.amount)}</span>
      <button onclick="deleteTransaction(${transaction.id})">x</button>
    `;
    list.appendChild(item);
  });

  updateSummary();
}

function addTransaction(e) {
  e.preventDefault();

  if (text.value.trim() === '' || amount.value.trim() === '') {
    alert('Please enter both text and amount');
    return;
  }

  const rawAmount = +amount.value;
  const transactionType = type.value;

  const finalAmount = transactionType === 'expense' ? -rawAmount : rawAmount;

  const transaction = {
    id: Date.now(),
    text: text.value,
    amount: finalAmount
  };

  transactions.push(transaction);
  updateLocalStorage();
  renderTransactions();

  text.value = '';
  amount.value = '';
  type.value = 'income';
}

function deleteTransaction(id) {
  transactions = transactions.filter(transaction => transaction.id !== id);
  updateLocalStorage();
  renderTransactions();
}

form.addEventListener('submit', addTransaction);

// Initial render
renderTransactions();
