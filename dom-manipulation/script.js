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

  postQuoteToServer({ text, category });
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
  formContainer.appendChild(quoteInput);
  formContainer.appendChild(categoryLabel);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);

  addButton.addEventListener("click", addQuote);
}

function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function importFromJsonFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid JSON format.");
      }
    } catch (err) {
      alert("Error parsing JSON file.");
    }
  };
  reader.readAsText(file);
}

function restoreSelectedCategory() {
  const savedCategory = localStorage.getItem(SELECTED_CATEGORY_KEY);
  if (savedCategory && [...categoryFilter.options].some(option => option.value === savedCategory)) {
    categoryFilter.value = savedCategory;
  } else {
    categoryFilter.value = "all";
  }
}

async function fetchQuotesFromServer() {
  try {
    const response = await fetch(SERVER_URL);
    const data = await response.json();
    // Simulate using first 5 posts
    return data.slice(0, 5).map(post => ({
      text: post.title,
      category: post.body.substring(0, 20) || "General"
    }));
  } catch (error) {
    console.error("Error fetching from server:", error);
    return [];
  }
}

async function postQuoteToServer(quote) {
  try {
    await fetch(SERVER_URL, {
      method: "POST",
      body: JSON.stringify({
        title: quote.text,
        body: quote.category,
        userId: 1
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    });
  } catch (error) {
    console.error("Error posting to server:", error);
  }
}

async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();

  const localDataString = JSON.stringify(quotes.map(q => q.text + q.category).sort());
  const serverDataString = JSON.stringify(serverQuotes.map(q => q.text + q.category).sort());

  if (localDataString !== serverDataString) {
    quotes = serverQuotes;
    saveQuotes();
    populateCategories();
    filterQuotes();
    showNotification("Local data updated from server (conflict resolved).");
  }
}

function showNotification(message) {
  alert(message);
}

document.addEventListener("DOMContentLoaded", () => {
  populateCategories();
  restoreSelectedCategory();
  createAddQuoteForm();
  filterQuotes();
  setInterval(syncQuotes, 30000);
});

categoryFilter.addEventListener("change", filterQuotes);
newQuoteBtn.addEventListener("click", showRandomQuote);
exportQuotesBtn.addEventListener("click", exportToJsonFile);
importFileInput.addEventListener("change", importFromJsonFile);
