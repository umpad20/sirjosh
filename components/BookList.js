import React from 'react';
import BookCard from './BookCard';
import EmptyState from './EmptyState';

export default function BookList({ books }) {
  if (!books.length) {
    return <EmptyState message="No books found." />;
  }
  return (
    <section aria-label="Book list" className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {books.map(book => (
        <BookCard key={book.id} book={book} />
      ))}
    </section>
  );
}
