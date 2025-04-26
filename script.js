// 책 검색을 위한 함수
function searchBooks() {
    const bookTitle = document.getElementById("book-title").value;
    if (!bookTitle) {
        alert("책 제목을 입력하세요!");
        return;
    }

    const googleBooksApiUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(bookTitle)}`;

    // 1. Google Books API로 한국어 책 검색
    fetch(googleBooksApiUrl)
        .then(response => response.json())
        .then(data => {
            const koreanBooks = [];
            const englishBooks = [];

            data.items.forEach(item => {
                const title = item.volumeInfo.title;
                const authors = item.volumeInfo.authors ? item.volumeInfo.authors.join(", ") : "저자 없음";
                const language = item.volumeInfo.language;

                // 한국어 책 목록 추가
                if (language === "ko") {
                    koreanBooks.push({ title, authors });
                } else if (language === "en") {
                    englishBooks.push({ title, authors });
                }
            });

            // 2. LibreTranslate API로 한국어 제목을 영어로 번역
            translateToEnglish(bookTitle)
                .then(translatedTitle => {
                    // 3. 번역된 영어 제목으로 영어 책 검색
                    const translatedApiUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(translatedTitle)}`;
                    return fetch(translatedApiUrl);
                })
                .then(response => response.json())
                .then(data => {
                    data.items.forEach(item => {
                        const title = item.volumeInfo.title;
                        const authors = item.volumeInfo.authors ? item.volumeInfo.authors.join(", ") : "저자 없음";
                        const language = item.volumeInfo.language;

                        // 번역된 영어 책 목록 추가
                        if (language === "en") {
                            englishBooks.push({ title, authors });
                        }
                    });

                    // 결과 표시
                    displayBooks(koreanBooks, "korean-list");
                    displayBooks(englishBooks, "english-list");
                });
        })
        .catch(error => console.error("Error fetching books:", error));
}

// LibreTranslate API로 한국어 제목을 영어로 번역
function translateToEnglish(text) {
    const url = "https://libretranslate.de/translate";  // LibreTranslate 서버 주소

    const body = {
        q: text,
        source: "ko",  // 번역할 원본 언어 (한국어)
        target: "en",  // 번역할 대상 언어 (영어)
        format: "text"
    };

    return fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    })
    .then(response => response.json())
    .then(data => data.translatedText)
    .catch(error => {
        console.error("Error translating text:", error);
        return text;  // 번역 실패 시 원본 텍스트 반환
    });
}

// 책 목록을 화면에 표시하는 함수
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
