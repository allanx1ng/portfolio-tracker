"use client"

// Generate dates for the past year
const generateDates = (days) => {
  const dates = []
  const today = new Date()
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    dates.push(date.toISOString().split('T')[0])
  }
  
  return dates
}

// Generate random balance data with a general upward trend
const generateBalanceData = (dates, startBalance, volatility) => {
  let balance = startBalance
  
  return dates.map(date => {
    // Random change with slight upward bias
    const change = (Math.random() * 2 - 0.8) * volatility
    balance += change
    
    // Ensure balance doesn't go below 1000
    balance = Math.max(1000, balance)
    
    return {
      date,
      balance: Math.round(balance * 100) / 100
    }
  })
}

// Generate dates and balance data for different timeframes
const weekDates = generateDates(7)
const monthDates = generateDates(30)
const threeMonthDates = generateDates(90)
const yearDates = generateDates(365)

export const balanceHistory = {
  week: generateBalanceData(weekDates, 12500, 200),
  month: generateBalanceData(monthDates, 12000, 200),
  threeMonths: generateBalanceData(threeMonthDates, 11000, 300),
  year: generateBalanceData(yearDates, 10000, 400)
}

// Categories for transactions
const categories = [
  "Groceries",
  "Dining",
  "Entertainment",
  "Shopping",
  "Transportation",
  "Utilities",
  "Housing",
  "Healthcare",
  "Travel",
  "Income"
]

// Transaction descriptions by category
const descriptionsByCategory = {
  Groceries: ["Supermarket", "Grocery Store", "Whole Foods", "Trader Joe's", "Farmers Market"],
  Dining: ["Restaurant", "Cafe", "Coffee Shop", "Fast Food", "Food Delivery"],
  Entertainment: ["Movie Theater", "Concert Tickets", "Streaming Service", "Gaming", "Sports Event"],
  Shopping: ["Online Store", "Department Store", "Electronics", "Clothing Store", "Bookstore"],
  Transportation: ["Gas Station", "Ride Share", "Public Transit", "Car Maintenance", "Parking"],
  Utilities: ["Electric Bill", "Water Bill", "Internet Service", "Phone Bill", "Gas Bill"],
  Housing: ["Rent Payment", "Mortgage", "Home Insurance", "Property Tax", "Home Repair"],
  Healthcare: ["Doctor Visit", "Pharmacy", "Health Insurance", "Dental Care", "Vision Care"],
  Travel: ["Flight Tickets", "Hotel Booking", "Car Rental", "Travel Insurance", "Vacation Package"],
  Income: ["Salary", "Freelance Payment", "Investment Dividend", "Tax Refund", "Gift"]
}

// Bank accounts and cards
const accounts = [
  { name: "Chase Checking", type: "Bank Account" },
  { name: "Bank of America Savings", type: "Bank Account" },
  { name: "Wells Fargo Checking", type: "Bank Account" },
  { name: "Citi Credit Card", type: "Credit Card" },
  { name: "Amex Gold Card", type: "Credit Card" },
  { name: "Discover Card", type: "Credit Card" },
  { name: "Capital One Venture", type: "Credit Card" }
]

// Generate a random transaction
const generateTransaction = (id, date) => {
  const category = categories[Math.floor(Math.random() * categories.length)]
  const descriptions = descriptionsByCategory[category]
  const description = descriptions[Math.floor(Math.random() * descriptions.length)]
  
  // Income is positive, expenses are negative
  const isIncome = category === "Income"
  const amount = isIncome 
    ? Math.round(Math.random() * 3000 + 1000) 
    : -Math.round(Math.random() * 200 + 10)
  
  const paymentMethods = ["Credit Card", "Debit Card", "Bank Transfer", "Cash", "Mobile Payment"]
  const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)]
  
  // Assign a random account based on payment method
  let account
  if (paymentMethod === "Credit Card") {
    account = accounts.filter(a => a.type === "Credit Card")[Math.floor(Math.random() * 4)]
  } else if (paymentMethod === "Debit Card" || paymentMethod === "Bank Transfer") {
    account = accounts.filter(a => a.type === "Bank Account")[Math.floor(Math.random() * 3)]
  } else {
    account = null // Cash or Mobile Payment doesn't have an associated account
  }
  
  return {
    id,
    date,
    description,
    amount,
    category,
    paymentMethod,
    account: account ? account.name : null
  }
}

// Generate transactions for the past 3 months
export const generateTransactions = () => {
  const transactions = []
  const today = new Date()
  let id = 1
  
  // Generate 100 transactions over the past 90 days
  for (let i = 0; i < 100; i++) {
    const daysAgo = Math.floor(Math.random() * 90)
    const date = new Date(today)
    date.setDate(today.getDate() - daysAgo)
    
    transactions.push(generateTransaction(id++, date.toISOString()))
  }
  
  // Sort by date (newest first)
  return transactions.sort((a, b) => new Date(b.date) - new Date(a.date))
}

export const transactions = generateTransactions()

// Calculate spending by category
export const calculateSpendingByCategory = () => {
  const spending = {}
  
  transactions.forEach(transaction => {
    if (transaction.amount < 0) { // Only include expenses
      const category = transaction.category
      spending[category] = (spending[category] || 0) + Math.abs(transaction.amount)
    }
  })
  
  // Convert to array format for pie chart
  return Object.keys(spending).map(category => ({
    id: category,
    label: category,
    value: Math.round(spending[category] * 100) / 100
  }))
}

export const spendingByCategory = calculateSpendingByCategory()

// Calculate total balance, income, and spending for the current month
export const calculateMonthlyStats = () => {
  const today = new Date()
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString()
  
  let totalIncome = 0
  let totalSpending = 0
  
  transactions.forEach(transaction => {
    if (transaction.date >= firstDayOfMonth) {
      if (transaction.amount > 0) {
        totalIncome += transaction.amount
      } else {
        totalSpending += Math.abs(transaction.amount)
      }
    }
  })
  
  // Get the last balance from the balance history
  const currentBalance = balanceHistory.week[balanceHistory.week.length - 1].balance
  
  return {
    balance: currentBalance,
    income: Math.round(totalIncome * 100) / 100,
    spending: Math.round(totalSpending * 100) / 100
  }
}

export const monthlyStats = calculateMonthlyStats()

// Generate previous month stats for comparison
export const calculatePreviousMonthStats = () => {
  return {
    balance: monthlyStats.balance * 0.97, // 3% less than current
    income: monthlyStats.income * 0.95,   // 5% less than current
    spending: monthlyStats.spending * 1.05 // 5% more than current
  }
}

export const previousMonthStats = calculatePreviousMonthStats()

// Calculate percentage changes
export const percentageChanges = {
  balance: ((monthlyStats.balance - previousMonthStats.balance) / previousMonthStats.balance) * 100,
  income: ((monthlyStats.income - previousMonthStats.income) / previousMonthStats.income) * 100,
  spending: ((monthlyStats.spending - previousMonthStats.spending) / previousMonthStats.spending) * 100
}

// Bank accounts data
export const bankAccounts = [
  {
    id: "chase-checking",
    name: "Chase Checking",
    type: "Checking",
    institution: "Chase Bank",
    balance: 5842.37,
    lastUpdated: new Date().toISOString(),
    accountNumber: "****4567",
    color: "#117ACA", // Chase blue
    linkedCards: ["chase-credit-card", "chase-debit-card"]
  },
  {
    id: "chase-savings",
    name: "Chase Savings",
    type: "Savings",
    institution: "Chase Bank",
    balance: 12500.00,
    lastUpdated: new Date().toISOString(),
    accountNumber: "****7890",
    color: "#117ACA", // Chase blue
    linkedCards: []
  },
  {
    id: "bofa-checking",
    name: "Bank of America Checking",
    type: "Checking",
    institution: "Bank of America",
    balance: 3241.89,
    lastUpdated: new Date().toISOString(),
    accountNumber: "****2345",
    color: "#E11B3C", // Bank of America red
    linkedCards: ["bofa-credit-card", "bofa-debit-card"]
  },
  {
    id: "wells-fargo-checking",
    name: "Wells Fargo Checking",
    type: "Checking",
    institution: "Wells Fargo",
    balance: 1876.42,
    lastUpdated: new Date().toISOString(),
    accountNumber: "****5678",
    color: "#D71E28", // Wells Fargo red
    linkedCards: ["wells-fargo-debit-card"]
  }
]

// Credit and debit cards data
export const cards = [
  {
    id: "chase-credit-card",
    name: "Chase Freedom Unlimited",
    type: "Credit Card",
    institution: "Chase Bank",
    balance: -1250.75, // Negative for credit card debt
    limit: 10000.00,
    lastUpdated: new Date().toISOString(),
    accountNumber: "****1234",
    expiryDate: "05/27",
    color: "#117ACA", // Chase blue
    linkedAccount: "chase-checking"
  },
  {
    id: "chase-debit-card",
    name: "Chase Debit Card",
    type: "Debit Card",
    institution: "Chase Bank",
    balance: 5842.37, // Same as checking account
    lastUpdated: new Date().toISOString(),
    accountNumber: "****4567",
    expiryDate: "09/26",
    color: "#117ACA", // Chase blue
    linkedAccount: "chase-checking"
  },
  {
    id: "bofa-credit-card",
    name: "Bank of America Cash Rewards",
    type: "Credit Card",
    institution: "Bank of America",
    balance: -3750.25, // Negative for credit card debt
    limit: 7500.00,
    lastUpdated: new Date().toISOString(),
    accountNumber: "****9012",
    expiryDate: "11/25",
    color: "#E11B3C", // Bank of America red
    linkedAccount: "bofa-checking"
  },
  {
    id: "bofa-debit-card",
    name: "Bank of America Debit Card",
    type: "Debit Card",
    institution: "Bank of America",
    balance: 3241.89, // Same as checking account
    lastUpdated: new Date().toISOString(),
    accountNumber: "****2345",
    expiryDate: "03/27",
    color: "#E11B3C", // Bank of America red
    linkedAccount: "bofa-checking"
  },
  {
    id: "wells-fargo-debit-card",
    name: "Wells Fargo Debit Card",
    type: "Debit Card",
    institution: "Wells Fargo",
    balance: 1876.42, // Same as checking account
    lastUpdated: new Date().toISOString(),
    accountNumber: "****5678",
    expiryDate: "07/26",
    color: "#D71E28", // Wells Fargo red
    linkedAccount: "wells-fargo-checking"
  }
]

// Generate transactions for a specific account
export const getAccountTransactions = (accountId) => {
  // Filter transactions by account
  return transactions.filter(t => {
    // For credit/debit cards, match by card name
    const card = cards.find(c => c.id === accountId);
    if (card) {
      return t.account === card.name;
    }
    
    // For bank accounts, match by account name or linked cards
    const account = bankAccounts.find(a => a.id === accountId);
    if (account) {
      // Check if transaction is from this account or any of its linked cards
      if (t.account === account.name) {
        return true;
      }
      
      // Check linked cards
      const linkedCardNames = account.linkedCards
        .map(cardId => cards.find(c => c.id === cardId)?.name)
        .filter(Boolean);
      
      return linkedCardNames.includes(t.account);
    }
    
    return false;
  });
}

// Get account balance history (reuse the existing balance history but scale it)
export const getAccountBalanceHistory = (accountId) => {
  const account = bankAccounts.find(a => a.id === accountId) || 
                 cards.find(c => c.id === accountId);
  
  if (!account) return {};
  
  // Scale factor based on current balance
  const scaleFactor = Math.abs(account.balance) / 15000;
  
  // Create a copy of the balance history with scaled values
  const result = {};
  
  for (const timeframe in balanceHistory) {
    result[timeframe] = balanceHistory[timeframe].map(item => ({
      date: item.date,
      balance: item.balance * scaleFactor
    }));
  }
  
  return result;
}
