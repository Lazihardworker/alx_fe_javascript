const quotes = [
      { text: "Success is not final; failure is not fatal.", category: "Motivation" },
      { text: "Imagination is more important than knowledge.", category: "Inspiration" },
      { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    ];

    const quoteDisplay = document.getElementById("quoteDisplay");
    const categorySelect = document.getElementById("categorySelect");

    function populateCategories() {
      const categories = [...new Set(quotes.map(q => q.category))];
      categories.forEach(cat => {
        if (![...categorySelect.options].some(opt => opt.value === cat)) {
          const option = document.createElement("option");
          option.value = cat;
          option.textContent = cat;
          categorySelect.appendChild(option);
        }
      });
    }

    function showRandomQuote() {
      const selectedCategory = categorySelect.value;
      const filteredQuotes = selectedCategory === "all" ? quotes : quotes.filter(q => q.category === selectedCategory);
      if (filteredQuotes.length === 0) {
        quoteDisplay.textContent = "No quotes found for this category.";
        return;
      }
      const randomQuote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
      quoteDisplay.textContent = `"${randomQuote.text}" - ${randomQuote.category}`;
    }

    function addQuote() {
      const newText = document.getElementById("newQuoteText").value.trim();
      const newCategory = document.getElementById("newQuoteCategory").value.trim();

      if (!newText || !newCategory) {
        alert("Please fill out both fields.");
        return;
      }

      quotes.push({ text: newText, category: newCategory });
      populateCategories();
      document.getElementById("newQuoteText").value = "";
      document.getElementById("newQuoteCategory").value = "";
      alert("Quote added successfully!");
    }

    document.getElementById("newQuote").addEventListener("click", showRandomQuote);

    populateCategories();