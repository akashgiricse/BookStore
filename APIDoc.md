# BookStore API Documentation

### 1. Users

| Method/URI                | Description                                                                               | Access |
| ------------------------- | ----------------------------------------------------------------------------------------- | ------ |
| `POST` api/users/register | Register a user <br> **Body**: name, email, password                                      | Public |
| `POST` api/users/register | Register an admin <br> **Body**: name, email, password <br> **Headers**: admin-signup-key | Public |
| `POST` api/users/login    | Login user and get token <br> **Body**: email, password                                   | Public |

### 2. Books

| Method/URI                 | Description                                                                                                              | Access               |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------ | -------------------- |
| `GET` api/books            | Get list of book which are in stock                                                                                      | Public               |
| `GET` api/books/:bookId    | Get a book with ID <br> **Parameters**: bookId                                                                           | Public               |
| `POST` api/books           | Create a book <br> **Body**: title, description, price, stock <br> **Headers**: x-auth-token                             | Private (admin only) |
| `PATCH` api/books/:bookId  | Update a book <br> **Body**: title, description, price, stock <br> **Parameters**: bookId <br> **Headers**: x-auth-token | Private (admin only) |
| `DELETE` api/books/:bookId | Delete a book <br> **Parameters**: bookId <br> **Headers**: x-auth-token                                                 | Private (admin only) |

### 3. Purchases

| Method/URI                         | Description                                                                              | Access  |
| ---------------------------------- | ---------------------------------------------------------------------------------------- | ------- |
| `GET` api/purchases                | Get list of purchase for the user <br> **Headers**: x-auth-token                         | Private |
| `GET` api/purchases/:purchaseId    | Get a single purchase for the user <br> **Parameters**: purchaseId                       | Private |
| `POST` api/purchases               | Make a purchase <br> **Body**: bookId <br> **Headers**: x-auth-token                     | Private |
| `DELETE` api/purchases/:purchaseId | Delete/ Cancel a purchase <br> **Parameters**: purchaseId <br> **Headers**: x-auth-token | Private |
