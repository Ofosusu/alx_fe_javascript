// ============================================
// STEP 1: Initialize quotes array and load from localStorage
// ============================================

let quotes = [];
// NEW (Task 3): Server URL for simulation
const SERVER_URL = 'https://jsonplaceholder.typicode.com/posts?_limit=10';

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
// STEP 2: Function to show a random quote
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

  if (filteredQuotes.length === 0) {
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = '<p>No quotes found for this category. Try adding some or selecting "All Categories"!</p>';
    sessionStorage.removeItem('lastViewedQuote');
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const randomQuote = filteredQuotes[randomIndex];
  const quoteDisplay = document.getElementById('quoteDisplay');
  
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
// STEP 4: Function to add a new quote
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
  populateCategories();
  
  document.getElementById('categoryFilter').value = quoteCategory;
  
  newQuoteText.value = '';
  newQuoteCategory.value = '';
  
  alert('Quote added successfully!');
  showRandomQuote();
  
  // NEW (Task 3): Optionally, we could simulate POSTing the new quote to the server here.
  // For this task, we focus on fetching/merging.
  // console.log("New quote added locally. Ready to be synced to server.");
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
// STEP 6: JSON Import Function
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
      populateCategories();
      
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

// ============================================
// STEP 8: Populate Category Filter
// ============================================

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

// ============================================
// STEP 9: Filter Quotes Function
// ============================================

function filterQuotes() {
  const categoryFilter = document.getElementById('categoryFilter');
  const selectedCategory = categoryFilter.value;
  
  localStorage.setItem('selectedCategory', selectedCategory);
  showRandomQuote();
}

// ===================================================
// NEW (TASK 3): SERVER SYNC AND CONFLICT RESOLUTION
// ===================================================

// ============================================
// STEP 10: Show Notification Function
// ============================================

/**
 * Displays a message in the notification bar for 5 seconds.
 * @param {string} message - The message to display.
 */
function showNotification(message) {
  const notificationBar = document.getElementById('syncNotification');
  notificationBar.textContent = message;
  notificationBar.style.display = 'block';
  
  // Hide the notification after 5 seconds
  setTimeout(() => {
    notificationBar.style.display = 'none';
  }, 5000);
}

// ============================================
// STEP 11: Merge Server Data & Handle Conflicts
// ============================================

/**
 * Merges quotes from the server with local quotes.
 * Conflict Strategy: Server's data (category) wins.
 * @param {Array} serverQuotes - An array of quote objects from the server.
 */
function mergeServerQuotes(serverQuotes) {
  let newQuotesCount = 0;
  let conflictsResolvedCount = 0;

  serverQuotes.forEach(serverQuote => {
    // Find a local quote with the *same text*
    const localQuote = quotes.find(q => q.text === serverQuote.text);
    
    if (localQuote) {
      // Quote exists. Check for conflict (different category).
      if (localQuote.category !== serverQuote.category) {
        // CONFLICT FOUND!
        // Resolution: Server wins. Update local category.
        localQuote.category = serverQuote.category;
        conflictsResolvedCount++;
      }
    } else {
      // Quote does not exist locally. It's a new quote.
      quotes.push(serverQuote);
      newQuotesCount++;
    }
  });

  // If any changes were made, update storage, UI, and notify user.
  if (newQuotesCount > 0 || conflictsResolvedCount > 0) {
    console.log('Data synced from server.');
    
    // 1. Save the updated quotes array to localStorage
    saveQuotes();
    
    // 2. Repopulate the category filter with any new categories
    populateCategories();
    
    // 3. Inform the user
    showNotification(`Sync complete! ${newQuotesCount} new quotes added, ${conflictsResolvedCount} conflicts resolved (server data applied).`);
  }
}

// ============================================
// STEP 12: Fetch Quotes From Server (Simulation)
// ============================================

/**
 * Fetches "quotes" from the mock API server.
 */
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(SERVER_URL);
    if (!response.ok) throw new Error('Server sync failed');
    
    const serverData = await response.json();
    
    // Adapt JSONPlaceholder data to our quote format
    // We use post.title for text and first 30 chars of post.body for category
    const serverQuotes = serverData.map(post => ({
      text: post.title,
      category: post.body.split('\n')[0].substring(0, 30) // Use first line of body as category
    }));
    
    // Now, merge the fetched quotes with our local data
    mergeServerQuotes(serverQuotes);
    
  } catch (error) {
    console.error('Error fetching from server:', error);
    showNotification('Could not sync with server. Check console.');
  }
}

// ============================================
// STEP 13: Set up event listeners (UPDATED)
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  // 1. Load quotes from localStorage
  loadQuotes();
  
  // 2. Populate the categories dropdown
  populateCategories();
  
  // 3. Restore the last selected filter from localStorage
  const savedCategory = localStorage.getItem('selectedCategory');
  if (savedCategory) {
    const filterDropdown = document.getElementById('categoryFilter');
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
  showLastViewedQuote();

  // ==========================================
  // NEW (TASK 3): Setup Server Sync
  // ==========================================
  
  // 7. Initial sync with server on page load
  // We use a small delay (1s) to let the page render first
  setTimeout(fetchQuotesFromServer, 1000);
  
  // 8. Set up periodic syncing (e.g., every 60 seconds)
  // This simulates receiving updates from a server
  setInterval(fetchQuotesFromServer, 60000); 
  // ==========================================
});