let transactions = [];
document.getElementById("date").valueAsDate = new Date();

document
  .getElementById("transactionForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const description = document.getElementById("description").value;
    const amount = parseFloat(document.getElementById("amount").value);
    const category = document.getElementById("category").value;

    const date = document.getElementById("date").value;

    const type = document.querySelector('input[name="type"]:checked').value;

    const newTransaction = {
      id: Date.now(),
      description: description,
      amount: amount,
      category: category,
      date: date,
      type: type,
    };

    transactions.push(newTransaction);

    document.getElementById("transactionForm").reset();
    document.getElementById("date").valueAsDate = new Date();

    renderTransactions();

    updateBalance();
  });

function renderTransactions() {
  const list = document.getElementById("transactionsList");
  const emptyState = document.getElementById("emptyState");
  const filterType = document.getElementById("filterType").value;

  list.innerHTML = "";

  let filteredTransactions = transactions;

  if (filterType !== "all") {
    filteredTransactions = transactions.filter((t) => t.type === filterType);
  }

  if (filteredTransactions.length === 0) {
    emptyState.style.display = "block";
    return;
  } else {
    emptyState.style.display = "none";
  }

  filteredTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

  filteredTransactions.forEach((transaction) => {
    const item = document.createElement("div");

    item.className = `transaction-item ${transaction.type}`;

    const formattedDate = new Date(transaction.date).toLocaleDateString(
      "en-US",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );

    const sign = transaction.type === "income" ? "+" : "-";

    item.innerHTML = `
            <div class="transaction-info">
                <h4>${transaction.description}</h4>
                <p>${transaction.category} • ${formattedDate}</p>
            </div>
            <div class="transaction-amount ${transaction.type}">
                ${sign}$${transaction.amount.toFixed(2)}
            </div>
            <button class="btn-delete" onclick="deleteTransaction(${
              transaction.id
            })">
                Delete
            </button>
        `;

    list.appendChild(item);
  });
}

function updateBalance() {
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  document.getElementById("totalBalance").textContent = `$${balance.toFixed(
    2
  )}`;
  document.getElementById("totalIncome").textContent = `$${totalIncome.toFixed(
    2
  )}`;
  document.getElementById(
    "totalExpense"
  ).textContent = `$${totalExpense.toFixed(2)}`;
}

function deleteTransaction(id) {
  if (confirm("Are you sure you want to delete this transaction?")) {
    transactions = transactions.filter((t) => t.id !== id);
    renderTransactions();

    updateBalance();
  }
}

function filterTransactions() {
  renderTransactions();
}
