// Book Class: Represents a Book
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

// UI Class: Handle UI Tasks 
class UI {
    static displayBooks() {
        const books = Storage.getBooks(); // Grabbing each book in the local storage

        books.forEach((book) => UI.addBookToList(book)); // Looping thru the array of books and adding them to UI 
    }

    static addBookToList(book) {
        const list = document.querySelector('#book-list'); // Grabbing the table body elements 
        const row = document.createElement('tr'); // Creating a row for each new book added

        row.innerHTML = ` 
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `; // Adding the HTML(book information) for each row  along with a delete button

        list.appendChild(row); // Append a row to the list
    }

    static deleteBook(el) {
        if (el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className) {
        const div = document.createElement('div'); // Create a div element for the alert
        div.className = `alert alert-${className}`; // Attach an alert class to the div
        div.appendChild(document.createTextNode(message)); // Add a message within the div

        const container = document.querySelector('.container'); // Grabs the container class
        const form = document.querySelector('#book-form'); // Grabs the book form

        container.insertBefore(div, form); // Inserts the new div element before the form

        // Vanish in 3 seconds 
        setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }

    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }
}

// Store Class: Handles local Storage
class Storage {
    static getBooks() {
        let books;
        if(localStorage.getItem('books') === null) { 
            books = []; // If there are no books, in the local storage, return an empty array
        } else {
            books = JSON.parse(localStorage.getItem('books')); // If there are books in the local storage, parse the books into key/value pairs(JSON)
        }
        return books;
    }

    static addBook(book) {
        const books = Storage.getBooks(); // Grabs the books from the local storage
        books.push(book); // Pushes books into the book array
        localStorage.setItem('books', JSON.stringify(books)); // Resets the local storage with the new book in JSON form
    }

    static removeBook(isbn) {
        const books = Storage.getBooks(); // Grabs the books from the local storage
        books.forEach((book, index) => {
            if(book.isbn === isbn) {
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}

// Event: Add a Book
document.querySelector('#book-form').addEventListener('submit', (e) => {
    // Prevent actual submit
    e.preventDefault();

    // Get form values 
    const title = document.querySelector('#title').value
    const author = document.querySelector('#author').value
    const isbn = document.querySelector('#isbn').value

    // Validation 
    if (title === '' || author === '' || isbn === '') { // Checks if each form is filled
        UI.showAlert('Please fill in all fields.', 'danger')
    } else {
        // Instatiate book 
        const book = new Book(title, author, isbn);

        // Add book to UI
        UI.addBookToList(book);

        // Add book to storage
        Storage.addBook(book);

        // Show success message
        UI.showAlert('Book Added', 'success')

        // Clear fields 
        UI.clearFields();
    }
})

// Event: Display Books
document.addEventListener('DOMContentLoaded', UI.displayBooks); // Displays books from local local storage

// Event: Remove a Book
document.querySelector('#book-list').addEventListener('click', (e) => { // Listens for a click event within the book list
    // Remove book from UI
    UI.deleteBook(e.target);

    // Remove book from local storage
    Storage.removeBook(e.target.parentElement.previousElementSibling.textContent); // Tranversing the DOM to get the ISBN

    // Message that book has been removed
    UI.showAlert('Removed Book', 'info'); 
});
