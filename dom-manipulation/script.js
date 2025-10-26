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
// STEP 2: Function to show a random quote
// ============================================

function showRandomQuote() {
  if (quotes.length === 0) {
    alert('No quotes available. Please add some quotes first!');
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  const quoteDisplay = document.getElementById('quoteDisplay');
  
  // Save last viewed quote to sessionStorage
  sessionStorage.setItem('lastViewedQuote', JSON.stringify(randomQuote));
  
  quoteDisplay.innerHTML = '';
  
  // Create paragraph element for quote text using createElement
  const quoteText = document.createElement('p');
  quoteText.className = 'quote-text';
  quoteText.textContent = `"${randomQuote.text}"`;
  
  // Create paragraph element for category using createElement
  const quoteCategory = document.createElement('p');
  quoteCategory.className = 'quote-category';
  quoteCategory.textContent = `Category: ${randomQuote.category}`;
  
  // Add elements to the DOM using appendChild
  quoteDisplay.appendChild(quoteText);
  quoteDisplay.appendChild(quoteCategory);
}

// ============================================
// STEP 3: Function to create the "Add Quote" form
// ============================================

function createAddQuoteForm() {
  const formContainer = document.getElementById('formContainer');
  
  // Create the form section div
  const formSection = document.createElement('div');
  formSection.className = 'form-section';
  
  // Create h2 heading
  const heading = document.createElement('h2');
  heading.textContent = 'Add Your Own Quote';
  formSection.appendChild(heading);
  
  // Create input for quote text
  const inputDiv1 = document.createElement('div');
  const quoteInput = document.createElement('input');
  quoteInput.id = 'newQuoteText';
  quoteInput.type = 'text';
  quoteInput.placeholder = 'Enter a new quote';
  inputDiv1.appendChild(quoteInput);
  formSection.appendChild(inputDiv1);
  
  // Create input for category
  const inputDiv2 = document.createElement('div');
  const categoryInput = document.createElement('input');
  categoryInput.id = 'newQuoteCategory';
  categoryInput.type = 'text';
  categoryInput.placeholder = 'Enter quote category';
  inputDiv2.appendChild(categoryInput);
  formSection.appendChild(inputDiv2);
  
  // Create submit button
  const submitButton = document.createElement('button');
  submitButton.textContent = 'Add Quote';
  submitButton.onclick = addQuote;
  formSection.appendChild(submitButton);
  
  // Add the entire form to the container
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
  
  // Add the new quote to our quotes array
  quotes.push(newQuote);
  
  // Save to localStorage
  saveQuotes();
  
  // Clear the input fields
  newQuoteText.value = '';
  newQuoteCategory.value = '';
  
  alert('Quote added successfully!');
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
// STEP 6: JSON Import Function
// ============================================

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      
      // Validate that imported data is an array
      if (!Array.isArray(importedQuotes)) {
        alert('Invalid JSON format. Please upload a valid quotes file.');
        return;
      }
      
      // Validate that each quote has text and category
      const validQuotes = importedQuotes.filter(quote => 
        quote.text && quote.category
      );
      
      if (validQuotes.length === 0) {
        alert('No valid quotes found in the file.');
        return;
      }
      
      // Add imported quotes to existing quotes
      quotes.push(...validQuotes);
      saveQuotes();
      
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
  if (lastQuote) {
    const quote = JSON.parse(lastQuote);
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
}

// ============================================
// STEP 8: Set up event listeners when page loads
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  // Load quotes from localStorage
  loadQuotes();
  
  // Find the "Show New Quote" button
  const newQuoteButton = document.getElementById('newQuote');
  newQuoteButton.addEventListener('click', showRandomQuote);
  
  // Create the "Add Quote" form when the page loads
  createAddQuoteForm();
  
  // Show last viewed quote from session or a random quote
  showLastViewedQuote();
});

// ============================================
// EXPLANATION OF FEATURES:
// ============================================

/*
1. LOCAL STORAGE:
   - localStorage.setItem() saves data
   - localStorage.getItem() retrieves data
   - JSON.stringify() converts objects to strings
   - JSON.parse() converts strings back to objects
   - Data persists even after browser closes

2. SESSION STORAGE:
   - sessionStorage.setItem() saves data for current session
   - Data cleared when tab/window closes
   - Used for temporary data like last viewed quote

3. JSON EXPORT:
   - Blob creates a file from data
   - URL.createObjectURL() creates a download URL
   - User downloads quotes as .json file

4. JSON IMPORT:
   - FileReader reads uploaded files
   - JSON.parse() converts file content to JavaScript
   - Validates data before importing
   - Merges with existing quotes

5. DOM MANIPULATION:
   - createElement() creates new HTML elements
   - appendChild() adds elements to the page
   - All done without page reload
*/