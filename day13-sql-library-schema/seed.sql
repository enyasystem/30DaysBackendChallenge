INSERT INTO authors (name, country) VALUES
('Chinua Achebe', 'Nigeria'),
('Margaret Atwood', 'Canada'),
('J.K. Rowling', 'United Kingdom'),
('Haruki Murakami', 'Japan'),
('Isabel Allende', 'Chile');

INSERT INTO publishers (name) VALUES
('Penguin Random House'),
('HarperCollins'),
('Simon & Schuster'),
('Hachette Book Group'),
('Macmillan Publishers');

INSERT INTO categories (name) VALUES
('Fiction'),
('Non-Fiction'),
('Science Fiction'),
('Fantasy'),
('Biography');

INSERT INTO books (title, publisher_id, published_date, pages) VALUES
('Things Fall Apart', 1, '1958-06-17', 209),
('The Handmaid''s Tale', 2, '1985-08-17', 311),
('Harry Potter and the Sorcerer''s Stone', 3, '1997-06-26', 309),
('Norwegian Wood', 4, '1987-09-04', 296),
('The House of the Spirits', 5, '1982-01-01', 433);

INSERT INTO copies (book_id, barcode, status) VALUES
(1, 'BC001', 'available'),
(1, 'BC002', 'loaned'),
(2, 'BC003', 'available'),
(3, 'BC004', 'reserved'),
(4, 'BC005', 'lost'),
(5, 'BC006', 'available');

-- Insert members
INSERT INTO members (name, email, phone) VALUES
('Enya Elvis', 'enya.elvis@example.com', '555-1111'),
('Wole Soyinka', 'wole.soyinka@example.com', '555-2222'),
('Buchi Emecheta', 'buchi.emecheta@example.com', '555-3333'),
('Sefi Atta', 'sefi.atta@example.com', '555-4444'),
('Teju Cole', 'teju.cole@example.com', '555-5555');