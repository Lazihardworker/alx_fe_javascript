const STORAGE_KEY = "quotes";
const SELECTED_CATEGORY_KEY = "selectedCategory";

let quotes = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Be yourself; everyone else is already taken.", category: "Inspiration" }
];

const quoteDisplay = document.getElementById('quoteDisplay');
const categorySelect = document.getElementById('categorySelect');
const newQuoteBtn = document.getElementById('newQuote');

function saveQuotes() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes));
}

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

function filterQuotes(category) {
  return quotes.filter(q => q.category === category);
}

function showRandomQuote() {
  const selectedCategory = categorySelect.value;
  const filtered = filterQuotes(selectedCategory);

  if (filtered.length === 0) {
    quoteDisplay.textContent = "No quotes available for this category.";
    return;
  }

  const randomQuote = filtered[Math.floor(Math.random() * filtered.length)];
  quoteDisplay.textContent = `"${randomQuote.text}" — ${randomQuote.category}`;

  localStorage.setItem(SELECTED_CATEGORY_KEY, selectedCategory);
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

  // Add to array
  quotes.push({ text, category });
  saveQuotes();

  // Update dropdown
  populateCategories();

  // Clear fields
  newQuoteText.value = "";
  newQuoteCategory.value = "";

  alert("Quote added successfully!");

  // Select new category and show quote
  categorySelect.value = category;
  showRandomQuote();
}

function createAddQuoteForm() {
  const formContainer = document.getElementById("formContainer");

  // Create inputs and button
  const quoteInput = document.createElement("input");
  quoteInput.id = "newQuoteText";
  quoteInput.type = "text";
  quoteInput.placeholder = "Enter a new quote";

  const categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter quote category";

  const addButton = document.createElement("button");
  addButton.id = "addQuoteBtn";
  addButton.textContent = "Add Quote";

  // Append
  formContainer.appendChild(quoteInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);

  // Add event listener
  addButton.addEventListener("click", addQuote);
}

function restoreSelectedCategory() {
  const savedCategory = localStorage.getItem(SELECTED_CATEGORY_KEY);
  if (savedCategory && [...categorySelect.options].some(option => option.value === savedCategory)) {
    categorySelect.value = savedCategory;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  populateCategories();
  restoreSelectedCategory();
  showRandomQuote();
  createAddQuoteForm();
});

newQuoteBtn.addEventListener("click", showRandomQuote);



