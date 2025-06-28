// Local storage key constants
const STORAGE_KEY = "quotes";
const SELECTED_CATEGORY_KEY = "selectedCategory";

// Initial quotes array
let quotes = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Be yourself; everyone else is already taken.", category: "Inspiration" }
];

// DOM references
const quoteDisplay = document.getElementById('quoteDisplay');
const categorySelect = document.getElementById('categorySelect');
const newQuoteBtn = document.getElementById('newQuote');
const addQuoteBtn = document.getElementById('addQuoteBtn');
const newQuoteText = document.getElementById('newQuoteText');
const newQuoteCategory = document.getElementById('newQuoteCategory');

// Save quotes to local storage
function saveQuotes() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes));
}

// Populate categories in dropdown
function populateCategories() {
  const uniqueCategories = [...new Set(quotes.map(q => q.category))];
  categorySelect.innerHTML = "";

  uniqueCategories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categorySelect.appendChild(option);
  });
}

// Filter quotes by category
function filterQuotes(category) {
  return quotes.filter(q => q.category === category);
}

// Show a random quote
function showRandomQuote() {
  const selectedCategory = categorySelect.value;
  const filtered = filterQuotes(selectedCategory);

  if (filtered.length === 0) {
    quoteDisplay.textContent = "No quotes available for this category.";
    return;
  }

  const randomQuote = filtered[Math.floor(Math.random() * filtered.length)];
  quoteDisplay.textContent = `"${randomQuote.text}" — ${randomQuote.category}`;

  // Save selected category to local storage
  localStorage.setItem(SELECTED_CATEGORY_KEY, selectedCategory);
}

// Add a new quote
function addQuote() {
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

  // Optionally, automatically select new category and show new quote
  categorySelect.value = category;
  showRandomQuote();
}

// Restore last selected category
function restoreSelectedCategory() {
  const savedCategory = localStorage.getItem(SELECTED_CATEGORY_KEY);
  if (savedCategory && [...categorySelect.options].some(option => option.value === savedCategory)) {
    categorySelect.value = savedCategory;
  }
}

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
  populateCategories();
  restoreSelectedCategory();
  showRandomQuote();
});

newQuoteBtn.addEventListener("click", showRandomQuote);
addQuoteBtn.addEventListener("click", addQuote);



