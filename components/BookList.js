import React from 'react';
import BookCard from './BookCard';
import EmptyState from './EmptyState';

// variant: "vertical" | "horizontal"
export default function BookList({ books, variant = 'horizontal' }) {
  if (!books.length) {
    return <EmptyState message="No books found matching your filters." />;
  }

  const isHorizontal = variant === 'horizontal';

  return (
    <section aria-label="Book list" style={{
      display: 'grid',
      gridTemplateColumns: isHorizontal
        ? 'repeat(auto-fill, minmax(360px, 1fr))'
        : 'repeat(auto-fill, minmax(260px, 1fr))',
      gap: isHorizontal ? '1rem' : '1.25rem',
    }}>
      {books.map(book => (
        <BookCard key={book.id} book={book} variant={variant} />
      ))}
    </section>
  );
}
