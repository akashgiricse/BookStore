# Online Book Store API

Book store API made using Node.js, Express.js, and MongoDB

### API Features:

1. **Books**
   - Show a list of books to buy
   - In book list, only show books which are in stock
   - Show individual book details
2. **Purchase**
   - Books can be purchased only by logged in user
   - Purchase is allowed only if the book is in stock
   - Book's stock decrease/increase based on how many purchases have been made or canceled respectively
   - Users can see their respective purchase list or individual purchase
   - User can cancel their purchase (or order)
3. **User**
   - User signup / login feature available
   - User has 2 roles
     - Normal user
     - Admin user
   - A normal user can signup by _Name_, _Email_ and _Password_
   - For login, _Email_ and _Password_ is required
   - To register/signup as an **ADMIN**, an extra **admin-signup-key** is required which is not public
   - Authentication is done by JWT tokens
   - A normal user can see and purchase books but he/she can not add/modify a book
   - A norma user can also cancel a purchase
4. **Admin features**
   - Only Admin can add/delete a book
   - Admin can increase or decrease a book's stock
   - Admin can update a book's data, such as title, description

### Guide to local setup

1. Clone this repository
   ```bash
   git clone https://github.com/akashgiricse/BookStore.git
   ```
2. Install node packages (from root directory)
   ```bash
   npm install
   ```
3. Setup a database on [MongoDB cloud database](https://www.mongodb.com/cloud) and get a _"Connection String"_
4. Add the _"Connection String"_ to **mongoURI** key in `default.json` file which is in `config` folder
5. Add **"jwtSecret"** and **"admin-signup-key"** key's value of your choice in `default.json`
6. Run development server
   ```bash
   npm run server
   ```
7. Use the API in Postman or any other API testing tool

### Please refere [here](https://github.com/akashgiricse/BookStore/blob/master/APIDoc.md) for API documentation

### Contributors

- [Akash Giri](https://github.com/akashgiricse)

### License

MIT License <br>
Copyright (c) 2019 Akash Giri.
