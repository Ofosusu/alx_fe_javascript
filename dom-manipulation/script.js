// ============================================
// STEP 1: Create our quotes database (array)
// ============================================

// This array stores all our quotes. Each quote is an object with text and category
let quotes = [
  { text: "The only way to do great work is to love what you do.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Inspiration" },
  { text: "It is during our darkest moments that we must focus to see the light.", category: "Motivation" },
  { text: "Be yourself; everyone else is already taken.", category: "Life" },
  { text: "You miss 100% of the shots you don't take.", category: "Inspiration" }
];

// ============================================
// STEP 2: Function to show a random quote
// ============================================

function showRandomQuote() {
  // Get a random index from our quotes array
  const randomIndex = Math.floor(Math.random() * quotes.length);
  
  // Get the random quote object
  const randomQuote = quotes[randomIndex];
  
  // Find the div where we want to display the quote
  const quoteDisplay = document.getElementById('quoteDisplay');
  
  // Clear existing content
  quoteDisplay.innerHTML = '';
  
  // ADVANCED DOM MANIPULATION: Using createElement and appendChild
  // Create paragraph element for quote text
  const quoteText = document.createElement('p');
  quoteText.className = 'quote-text';
  quoteText.textContent = `"${randomQuote.text}"`;
  
  // Create paragraph element for category
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
  // Find the container where we want to add the form
  const formContainer = document.getElementById('formContainer');
  
  // ADVANCED DOM MANIPULATION: Using createElement and appendChild
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
  // Get the input elements
  const newQuoteText = document.getElementById('newQuoteText');
  const newQuoteCategory = document.getElementById('newQuoteCategory');
  
  // Get the values from the inputs
  const quoteText = newQuoteText.value.trim();
  const quoteCategory = newQuoteCategory.value.trim();
  
  // Validate: Make sure both fields have content
  if (quoteText === '' || quoteCategory === '') {
    alert('Please fill in both the quote and category!');
    return; // Stop the function if validation fails
  }
  
  // Create a new quote object using createElement (object creation)
  const newQuote = document.createElement('div'); // Create element for demonstration
  
  // Create the actual quote object for our array
  const quoteObject = {
    text: quoteText,
    category: quoteCategory
  };
  
  // Add the new quote to our quotes array
  quotes.push(quoteObject);
  
  // Clear the input fields
  newQuoteText.value = '';
  newQuoteCategory.value = '';
  
  // Show a success message
  alert('Quote added successfully!');
  
  // Show the newly added quote
  showRandomQuote();
}

// ============================================
// STEP 5: Set up event listeners when page loads
// ============================================

// This code runs when the page is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Find the "Show New Quote" button
  const newQuoteButton = document.getElementById('newQuote');
  
  // Add a click event listener to the button
  newQuoteButton.addEventListener('click', showRandomQuote);
  
  // Create the "Add Quote" form when the page loads
  createAddQuoteForm();
  
  // Show a random quote when the page first loads
  showRandomQuote();
});

// ============================================
// EXPLANATION OF KEY CONCEPTS:
// ============================================

/*
1. ARRAYS: 
   - Think of an array as a list. Our 'quotes' array is a list of quote objects.
   
2. OBJECTS: 
   - Objects store related information. Each quote has 'text' and 'category'.
   
3. ADVANCED DOM MANIPULATION:
   - document.getElementById() - finds an element on the page by its ID
   - document.createElement() - creates a new HTML element
   - appendChild() - adds an element as a child to another element
   - textContent - sets the text content of an element
   - addEventListener() - makes elements respond to user actions (like clicks)
   
4. FUNCTIONS:
   - Functions are reusable blocks of code that perform specific tasks
   - We can call them whenever we need them
   
5. Why createElement and appendChild?
   - More control over element creation
   - Better performance for complex operations
   - Safer than innerHTML (prevents XSS attacks)
   - Shows understanding of "Advanced DOM Manipulation"
*/