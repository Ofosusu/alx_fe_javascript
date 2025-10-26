// ============================================
// STEP 1: Initialize quotes array and load from localStorage
// ============================================

let quotes = [];

// Function to load quotes from localStorage
function loadQuotes() {
  const storedQuotes = localStorage.getItem('quotes');
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  } else {
    // Default quotes if none exist in localStorage
    quotes = [
      { text: "The only way to do great work is to love what you do.", category: "Motivation" },
      { text: "Life is what happens when you're busy making other plans.", category: "Life" },
      { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Inspiration" },
      { text: "It is during our darkest moments that we must focus to see the light.", category: "Motivation" },
      { text: "Be yourself; everyone else is already taken.", category: "Life" },
      { text: "You miss 100% of the shots you don't take.", category: "Inspiration" }
    ];
    saveQuotes(); // Save default quotes to localStorage
  }
}

// Function to save quotes to localStorage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// ============================================
// STEP 2: Function to show a random quote (UPDATED)
// ============================================

function showRandomQuote() {
  const categoryFilter = document.getElementById('categoryFilter');
  const selectedCategory = categoryFilter.value;
  
  // 1. Filter the quotes array based on the selected category
  let filteredQuotes;
  if (selectedCategory === 'all') {
    filteredQuotes = quotes;
  } else {
    filteredQuotes = quotes.filter(quote => quote.category === selectedCategory);
  }

  // 2. Check if any quotes match the filter
  if (filteredQuotes.length === 0) {
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = '<p>No quotes found for this category. Try adding some or selecting "All Categories"!</p>';
    // Clear session storage if no quote is shown
    sessionStorage.removeItem('lastViewedQuote');
    return;
  }

  // 3. Select a random quote from the *filtered* list
  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const randomQuote = filteredQuotes[randomIndex];
  const quoteDisplay = document.getElementById('quoteDisplay');
  
  // Save last viewed quote to sessionStorage
  sessionStorage.setItem('lastViewedQuote', JSON.stringify(randomQuote));
  
  quoteDisplay.innerHTML = '';
  
  // Create paragraph element for quote text
  const quoteText = document.createElement('p');
  quoteText.className = 'quote-text';
  quoteText.textContent = `"${randomQuote.text}"`;
  
  // Create paragraph element for category
  const quoteCategory = document.createElement('p');
  quoteCategory.className = 'quote-category';
  quoteCategory.textContent = `Category: ${randomQuote.category}`;
  
  // Add elements to the DOM
  quoteDisplay.appendChild(quoteText);
  quoteDisplay.appendChild(quoteCategory);
}

// ============================================
// STEP 3: Function to create the "Add Quote" form
// ============================================

function createAddQuoteForm() {
  const formContainer = document.getElementById('formContainer');
  
  const formSection = document.createElement('div');
  formSection.className = 'form-section';
  
  const heading = document.createElement('h2');
  heading.textContent = 'Add Your Own Quote';
  formSection.appendChild(heading);
  
  const inputDiv1 = document.createElement('div');
  const quoteInput = document.createElement('input');
  quoteInput.id = 'newQuoteText';
  quoteInput.type = 'text';
  quoteInput.placeholder = 'Enter a new quote';
  inputDiv1.appendChild(quoteInput);
  formSection.appendChild(inputDiv1);
  
  const inputDiv2 = document.createElement('div');
  const categoryInput = document.createElement('input');
  categoryInput.id = 'newQuoteCategory';
  categoryInput.type = 'text';
  categoryInput.placeholder = 'Enter quote category';
  inputDiv2.appendChild(categoryInput);
  formSection.appendChild(inputDiv2);
  
  const submitButton = document.createElement('button');
  submitButton.textContent = 'Add Quote';
  submitButton.onclick = addQuote;
  formSection.appendChild(submitButton);
  
  formContainer.appendChild(formSection);
}

// ============================================
// STEP 4: Function to add a new quote (UPDATED)
// ============================================

function addQuote() {
  const newQuoteText = document.getElementById('newQuoteText');
  const newQuoteCategory = document.getElementById('newQuoteCategory');
  
  const quoteText = newQuoteText.value.trim();
  const quoteCategory = newQuoteCategory.value.trim();
  
  if (quoteText === '' || quoteCategory === '') {
    alert('Please fill in both the quote and category!');
    return;
  }
  
  const newQuote = {
    text: quoteText,
    category: quoteCategory
  };
  
  quotes.push(newQuote);
  saveQuotes();
  
  // == NEW FUNCTIONALITY ==
  // Update the category dropdown with the new category
  populateCategories();
  
  // Automatically select the newly added category in the filter
  document.getElementById('categoryFilter').value = quoteCategory;
  // == END NEW FUNCTIONALITY ==
  
  newQuoteText.value = '';
  newQuoteCategory.value = '';
  
  alert('Quote added successfully!');
  // Show a random quote (which will now respect the new filter)
  showRandomQuote();
}

// ============================================
// STEP 5: JSON Export Function
// ============================================

function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  
  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  downloadLink.download = 'quotes.json';
  downloadLink.click();
  
  URL.revokeObjectURL(url);
  alert('Quotes exported successfully!');
}

// ============================================
// STEP 6: JSON Import Function (UPDATED)
// ============================================

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      
      if (!Array.isArray(importedQuotes)) {
        alert('Invalid JSON format. Please upload a valid quotes file.');
        return;
      }
      
      const validQuotes = importedQuotes.filter(quote => 
        quote.text && quote.category
      );
      
      if (validQuotes.length === 0) {
        alert('No valid quotes found in the file.');
        return;
      }
      
      quotes.push(...validQuotes);
      saveQuotes();
      
      // == NEW FUNCTIONALITY ==
      // Update categories after importing
      populateCategories();
      // == END NEW FUNCTIONALITY ==
      
      alert(`${validQuotes.length} quote(s) imported successfully!`);
      showRandomQuote();
    } catch (error) {
      alert('Error reading file. Please make sure it is a valid JSON file.');
    }
  };
  
  fileReader.readAsText(event.target.files[0]);
}

// ============================================
// STEP 7: Display Last Viewed Quote (Session Storage)
// ============================================

function showLastViewedQuote() {
  const lastQuote = sessionStorage.getItem('lastViewedQuote');
  
  // Get the current filter
  const selectedCategory = document.getElementById('categoryFilter').value;
  
  if (lastQuote) {
    const quote = JSON.parse(lastQuote);
    
    // Check if the last viewed quote matches the current filter
    // If it does, or if the filter is 'all', show it.
    if (selectedCategory === 'all' || quote.category === selectedCategory) {
      const quoteDisplay = document.getElementById('quoteDisplay');
      quoteDisplay.innerHTML = '';
      
      const quoteText = document.createElement('p');
      quoteText.className = 'quote-text';
      quoteText.textContent = `"${quote.text}"`;
      
      const quoteCategory = document.createElement('p');
      quoteCategory.className = 'quote-category';
      quoteCategory.textContent = `Category: ${quote.category}`;
      
      const lastViewedNote = document.createElement('p');
      lastViewedNote.style.fontSize = '0.9em';
      lastViewedNote.style.color = '#888';
      lastViewedNote.textContent = '(Last viewed in this session)';
      
      quoteDisplay.appendChild(quoteText);
      quoteDisplay.appendChild(quoteCategory);
      quoteDisplay.appendChild(lastViewedNote);
    } else {
      // If last quote doesn't match filter, show a new random one
      showRandomQuote();
    }
  } else {
    // If no last viewed quote, show a random one
    showRandomQuote();
  }
}

// ============================================
// STEP 8: NEW - Populate Category Filter
// ============================================

function populateCategories() {
  const categoryFilter = document.getElementById('categoryFilter');
  
  // Get all unique categories from the quotes array
  // Use a Set to automatically handle duplicates
  const categories = [...new Set(quotes.map(quote => quote.category))];
  
  // Save the currently selected value to restore it later
  const currentSelection = categoryFilter.value;
  
  // Clear existing options (except the first "All Categories" option)
  while (categoryFilter.options.length > 1) {
    categoryFilter.remove(1);
  }
  
  // Add an <option> for each unique category
  categories.sort().forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
  
  // Restore the previous selection, if it still exists
  // This handles cases where we're just adding a new quote
  if (Array.from(categoryFilter.options).some(opt => opt.value === currentSelection)) {
    categoryFilter.value = currentSelection;
  }
}

// ============================================
// STEP 9: NEW - Filter Quotes Function
// ============================================

function filterQuotes() {
  const categoryFilter = document.getElementById('categoryFilter');
  const selectedCategory = categoryFilter.value;
  
  // Save the user's filter preference to localStorage
  // This ensures it persists across sessions
  localStorage.setItem('selectedCategory', selectedCategory);
  
  // Show a new random quote that matches the selected filter
  showRandomQuote();
}

// ============================================
// STEP 10: Set up event listeners (UPDATED)
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  // 1. Load quotes from localStorage
  loadQuotes();
  
  // 2. NEW: Populate the categories dropdown
  populateCategories();
  
  // 3. NEW: Restore the last selected filter from localStorage
  const savedCategory = localStorage.getItem('selectedCategory');
  if (savedCategory) {
    const filterDropdown = document.getElementById('categoryFilter');
    // Check if the saved category still exists in the options
    if (Array.from(filterDropdown.options).some(opt => opt.value === savedCategory)) {
      filterDropdown.value = savedCategory;
    }
  }
  
  // 4. Find the "Show New Quote" button and add listener
  const newQuoteButton = document.getElementById('newQuote');
  newQuoteButton.addEventListener('click', showRandomQuote);
  
  // 5. Create the "Add Quote" form
  createAddQuoteForm();
  
  // 6. Show last viewed quote or a new random quote
  // This will now respect the loaded filter
  showLastViewedQuote();
});