let nameField = document.querySelector("#name");
let authorField = document.querySelector("#author");
let isbnField = document.querySelector("#isbn");

class Book {
    constructor(name, author, isbn) {
        this.name = name;
        this.author = author;
        this.isbn = isbn;
    }
}

class UI {
    showMessage(message,type){
        document.querySelector('#message').innerHTML = `<p class = "${type}">${message}</p>`;

        setTimeout(function(){
            document.querySelector('#message').innerHTML = '';
        },2000);
    }
    addbook(book) {

        let display = document.querySelector("#display");

        let newRow = document.createElement("tr");

        newRow.innerHTML = `
        <td>${book.name}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="delete-item">X</a></td>
        `;

        display.appendChild(newRow);

    }

    removeBook(target){
        if(target.className === "delete-item"){
            // Also remove from storage
            let isbn = target.parentElement.previousElementSibling.textContent;
            Storage.removeBookFromMemory(isbn);
            target.parentElement.parentElement.remove();
        }
    }

    clear(name,author,isbn){
        name.value = "";
        author.value = "";
        isbn.value = "";
    }
}

class Storage {
    static getCurrentBooks(){
        let books = [];

        if (localStorage.getItem("meriBooks") === null){
            return books;
        }else{
            books = JSON.parse(localStorage.getItem("meriBooks"));
            return books;
        }
    }
    static addBookToMemory(book){
        let books = Storage.getCurrentBooks();
        books.push(book);
        localStorage.setItem("meriBooks",JSON.stringify(books));
        console.log(books);
    }

    static removeBookFromMemory(isbn){
        let books = this.getCurrentBooks();

        books.forEach(function(book,index){
            if(book.isbn === isbn){
                books.splice(index,1);
            }
        })

        localStorage.setItem("meriBooks",JSON.stringify(books));
    }

    static displayBookFromMemory(){
        let books = Storage.getCurrentBooks();
        let ui = new UI();

        books.forEach(function(book){
            ui.addbook(book);
        })
    }
}

Storage.displayBookFromMemory();


// To add a book

const form = document.querySelector("#form");

form.addEventListener("submit", function (e) {

    let book = new Book(nameField.value, authorField.value, isbnField.value);

    let ui = new UI();

    if (nameField.value === ''|| authorField.value === ''|| isbnField.value === ''){
        ui.showMessage("Fill up all the fields","error");
    }else{       

        ui.addbook(book);
        Storage.addBookToMemory(book);
        ui.clear(nameField,authorField,isbnField);
        ui.showMessage("Book added successfully","success");
    }
    
    
    e.preventDefault();
})

// To remove a book

document.querySelector("#display").addEventListener("click",function(e){
    let ui = new UI()
    ui.removeBook(e.target);
    ui.showMessage("Book deleted succesfully","success");
})