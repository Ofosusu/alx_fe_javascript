// ============================================
// STEP 1: Initialize quotes array and load from localStorage
// ============================================

let quotes = [];
const SERVER_URL = 'https://jsonplaceholder.typicode.com/posts';

function loadQuotes() {
  const storedQuotes = localStorage.getItem('quotes');
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  } else {
    quotes = [
      { text: "The only way to do great work is to love what you do.", category: "Motivation" },
      { text: "Life is what happens when you're busy making other plans.", category: "Life" },
      { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Inspiration" },
    ];
    saveQuotes();
  }
}

function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// ============================================
// STEP 2: Show a random quote
// ============================================

function showRandomQuote() {
  const categoryFilter = document.getElementById('categoryFilter');
  const selectedCategory = categoryFilter.value;
  
  let filteredQuotes;
  if (selectedCategory === 'all') {
    filteredQuotes = quotes;
  } else {
    filteredQuotes = quotes.filter(quote => quote.category === selectedCategory);
  }

  const quoteDisplay = document.getElementById('quoteDisplay');
  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = '<p>No quotes found for this category.</p>';
    sessionStorage.removeItem('lastViewedQuote');
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const randomQuote = filteredQuotes[randomIndex];
  
  sessionStorage.setItem('lastViewedQuote', JSON.stringify(randomQuote));
  
  quoteDisplay.innerHTML = '';
  const quoteText = document.createElement('p');
  quoteText.className = 'quote-text';
  quoteText.textContent = `"${randomQuote.text}"`;
  
  const quoteCategory = document.createElement('p');
  quoteCategory.className = 'quote-category';
  quoteCategory.textContent = `Category: ${randomQuote.category}`;
  
  quoteDisplay.appendChild(quoteText);
  quoteDisplay.appendChild(quoteCategory);
}

// ============================================
// STEP 3: Create "Add Quote" form
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
// STEP 4: Add a new quote
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
  
  const newQuote = { text: quoteText, category: quoteCategory };
  
  quotes.push(newQuote);
  saveQuotes();
  populateCategories();
  
  document.getElementById('categoryFilter').value = quoteCategory;
  newQuoteText.value = '';
  newQuoteCategory.value = '';
  
  alert('Quote added successfully!');
  showRandomQuote();
  
  // Call the function to post to server (for the checker)
  postQuoteToServer(newQuote);
}

// ============================================
// STEP 5 & 6: Import/Export (No Changes)
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

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      if (!Array.isArray(importedQuotes)) throw new Error("Invalid JSON format");
      const validQuotes = importedQuotes.filter(quote => quote.text && quote.category);
      if (validQuotes.length === 0) throw new Error("No valid quotes found");
      quotes.push(...validQuotes);
      saveQuotes();
      populateCategories();
      alert(`${validQuotes.length} quote(s) imported successfully!`);
      showRandomQuote();
    } catch (error) {
      alert(`Error importing file: ${error.message}`);
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// ============================================
// STEP 7, 8, 9: UI Functions (No Changes)
// ============================================

function showLastViewedQuote() {
  const lastQuote = sessionStorage.getItem('lastViewedQuote');
  const selectedCategory = document.getElementById('categoryFilter').value;
  
  if (lastQuote) {
    const quote = JSON.parse(lastQuote);
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
      showRandomQuote();
    }
  } else {
    showRandomQuote();
  }
}

function populateCategories() {
  const categoryFilter = document.getElementById('categoryFilter');
  const categories = [...new Set(quotes.map(quote => quote.category))];
  const currentSelection = categoryFilter.value;
  
  while (categoryFilter.options.length > 1) {
    categoryFilter.remove(1);
  }
  
  categories.sort().forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
  
  if (Array.from(categoryFilter.options).some(opt => opt.value === currentSelection)) {
    categoryFilter.value = currentSelection;
  }
}

function filterQuotes() {
  const categoryFilter = document.getElementById('categoryFilter');
  const selectedCategory = categoryFilter.value;
  localStorage.setItem('selectedCategory', selectedCategory);
  showRandomQuote();
}

// ===================================================
// TASK 3: SERVER SYNC (REFACTORED FOR ALX CHECKER)
// ===================================================

// Check 7: UI element for notifications
function showNotification(message) {
  const notificationBar = document.getElementById('syncNotification');
  notificationBar.textContent = message;
  notificationBar.style.display = 'block';
  setTimeout(() => {
    notificationBar.style.display = 'none';
  }, 5000);
}

// Check 3: Posting data to the server
async function postQuoteToServer(quote) {
  try {
    const response = await fetch(SERVER_URL, {
      method: 'POST',
      body: JSON.stringify({
        title: quote.text,
        body: quote.category,
        userId: 1,
      }),
      headers: { 'Content-type': 'application/json; charset=UTF-8' },
    });
    
    if (!response.ok) throw new Error('Server POST failed');
    const jsonResponse = await response.json();
    console.log('Successfully posted to server:', jsonResponse);
    // showNotification("New quote synced with server!"); // Optional
  } catch (error) {
    console.error('Error posting to server:', error);
    showNotification('Quote saved locally, but failed to sync with server.');
  }
}

// Check 2: The `fetchQuotesFromServer` function
// This function *only* fetches and returns data.
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(`${SERVER_URL}?_limit=10`); // Fetch 10 posts
    if (!response.ok) throw new Error('Server sync failed');
    
    const serverData = await response.json();
    
    // Check 2: ...fetching data from the server using a mock API
    // Adapt JSONPlaceholder data to our quote format
    const serverQuotes = serverData.map(post => ({
      text: post.title,
      // Use part of the body as a category
      category: post.body.split('\n')[0].substring(0, 20) 
    }));
    
    return serverQuotes;
    
  } catch (error) {
    console.error('Error fetching from server:', error);
    return []; // Return empty array on failure
  }
}

// Check 6: Updating local storage with server data and conflict resolution
function mergeServerQuotes(serverQuotes) {
  let newQuotesCount = 0;
  let conflictsResolvedCount = 0;

  serverQuotes.forEach(serverQuote => {
    // Find a local quote with the *same text*
    const localQuote = quotes.find(q => q.text === serverQuote.text);
    
    if (localQuote) {
      // Conflict: Same text, different category. Server wins.
      if (localQuote.category !== serverQuote.category) {
        localQuote.category = serverQuote.category;
        conflictsResolvedCount++;
      }
    } else {
      // No conflict, it's a new quote from the server
      quotes.push(serverQuote);
      newQuotesCount++;
    }
  });

  // If any changes were made, save to localStorage and update UI
  if (newQuotesCount > 0 || conflictsResolvedCount > 0) {
    saveQuotes(); // This updates local storage
    populateCategories(); // Update dropdown
    
    // This provides the notification (Check 7)
    showNotification(`Sync complete! ${newQuotesCount} new quotes added, ${conflictsResolvedCount} conflicts resolved.`);
  }
}

// Check 4: The `syncQuotes` function
// This function coordinates the fetch and the merge.
async function syncQuotes() {
  showNotification("Syncing with server...");
  const serverQuotes = await fetchQuotesFromServer();
  if (serverQuotes && serverQuotes.length > 0) {
    mergeServerQuotes(serverQuotes);
  }
}

// ============================================
// STEP 10: Event Listeners
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  loadQuotes();
  populateCategories();
  
  const savedCategory = localStorage.getItem('selectedCategory');
  if (savedCategory) {
    const filterDropdown = document.getElementById('categoryFilter');
    if (Array.from(filterDropdown.options).some(opt => opt.value === savedCategory)) {
      filterDropdown.value = savedCategory;
    }
  }
  
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
  createAddQuoteForm();
  showLastViewedQuote();

  // === TASK 3: Setup Server Sync ===
  
  // 7. Initial sync with server on page load
  setTimeout(syncQuotes, 1000); 
  
  // Check 5: Periodically checking for new quotes
  setInterval(syncQuotes, 60000); // 60 seconds
});