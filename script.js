function searchBooks() {
    const bookTitle = document.getElementById("book-title").value;
    if (!bookTitle) {
        alert("책 제목을 입력하세요!");
        return;
    }

    const googleBooksApiUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(bookTitle)}`;

    fetch(googleBooksApiUrl)
        .then(response => response.json())
        .then(data => {
            const koreanBooks = [];
            const englishBooks = [];

            data.items.forEach(item => {
                const title = item.volumeInfo.title;
                const authors = item.volumeInfo.authors ? item.volumeInfo.authors.join(", ") : "저자 없음";
                const language = item.volumeInfo.language;

                if (language === "ko") {
                    koreanBooks.push({ title, authors });
                } else if (language === "en") {
                    englishBooks.push({ title, authors });
                }
            });

            displayBooks(koreanBooks, "korean-list");
            displayBooks(englishBooks, "english-list");
        })
        .catch(error => console.error("Error fetching books:", error));
}

function displayBooks(books, listId) {
    const listElement = document.getElementById(listId);
    listElement.innerHTML = "";

    if (books.length === 0) {
        listElement.innerHTML = "<li>결과 없음</li>";
    } else {
        books.forEach(book => {
            const listItem = document.createElement("li");
            listItem.innerHTML = `<strong>${book.title}</strong> by ${book.authors}`;
            listElement.appendChild(listItem);
        });
    }
}
