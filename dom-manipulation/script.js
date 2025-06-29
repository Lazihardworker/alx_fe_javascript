const STORAGE_KEY = "quotes";
const SELECTED_CATEGORY_KEY = "selectedCategory";
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";

let quotes = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Be yourself; everyone else is already taken.", category: "Inspiration" }
];

const quoteDisplay = document.getElementById("quoteDisplay");
const categoryFilter = document.getElementById("categoryFilter");
const newQuoteBtn = document.getElementById("newQuote");
const exportQuotesBtn = document.getElementById("exportQuotesBtn");
const importFileInput = document.getElementById("importFile");

function saveQuotes() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes));
}

function populateCategories() {
  const uniqueCategories = [...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  uniqueCategories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });
}

function filterQuotes() {
  const selectedCategory = categoryFilter.value;
  localStorage.setItem(SELECTED_CATEGORY_KEY, selectedCategory);

  let filtered = quotes;
  if (selectedCategory !== "all") {
    filtered = quotes.filter(q => q.category === selectedCategory);
  }

  if (filtered.length === 0) {
    quoteDisplay.textContent = "No quotes available for this category.";
  } else {
    const randomQuote = filtered[Math.floor(Math.random() * filtered.length)];
    quoteDisplay.textContent = `"${randomQuote.text}" — ${randomQuote.category}`;
  }
}

function showRandomQuote() {
  filterQuotes();
}

function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText");
  const newQuoteCategory = document.getElementById("newQuoteCategory");

  const text = newQuoteText.value.trim();
  const category = newQuoteCategory.value.trim();

  if (!text || !category) {
    alert("Please enter both a quote and a category.");
    return;
  }

  quotes.push({ text, category });
  saveQuotes();
  populateCategories();

  newQuoteText.value = "";
  newQuoteCategory.value = "";

  alert("Quote added successfully!");

  categoryFilter.value = category;
  filterQuotes();
}

function createAddQuoteForm() {
  const formContainer = document.getElementById("formContainer");

  const quoteLabel = document.createElement("label");
  quoteLabel.htmlFor = "newQuoteText";
  quoteLabel.textContent = "Quote Text:";

  const quoteInput = document.createElement("input");
  quoteInput.id = "newQuoteText";
  quoteInput.type = "text";
  quoteInput.placeholder = "Enter a new quote";

  const categoryLabel = document.createElement("label");
  categoryLabel.htmlFor = "newQuoteCategory";
  categoryLabel.textContent = "Category:";

  const categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter quote category";

  const addButton = document.createElement("button");
  addButton.id = "addQuoteBtn";
  addButton.textContent = "Add Quote";

  formContainer.appendChild(quoteLabel);
}
