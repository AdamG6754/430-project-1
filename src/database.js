const fs = require('fs'); // pull in the file system module

const books = JSON.parse(fs.readFileSync(`${__dirname}/../books.json`));

const getBibliography = (author) => {
    return books.filter(book => book.author === author);
};

const getBookTitles = (author, language, genre, earliestYear, latestYear) => {
    return books
        .filter(book => (!author || book.author === author) &&
                        (!language || book.language === language) &&
                        (!genre || book.genre === genre) &&
                        (!earliestYear || book.year >= earliestYear) &&
                        (!latestYear || book.year <= latestYear))
        .map(book => book.title);
};

const getBooks = (author, language, genre, earliestYear, latestYear) => {
    return books
        .filter(book => (!author || book.author === author) &&
                        (!language || book.language === language) &&
                        (!genre || book.genre === genre) &&
                        (!earliestYear || book.year >= earliestYear) &&
                        (!latestYear || book.year <= latestYear));
};

const addBook = (book) => {
    books.push(book);
};

const deleteBook = (title) => {
    const index = books.findIndex(book => book.title === title);
    if (index !== -1) {
        books.splice(index, 1);
    }
};

module.exports = {
    getBibliography,
    getBookTitles,
    getBooks,
    addBook,
    deleteBook,
};
