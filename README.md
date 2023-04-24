## How To Run The Project

git clone https://github.com/caoboyeehaw/cougar-supply-den.git

First, run the development server:

When running locally:
```bash
npm run i
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## Cougar Supply Den Project Details
COSC 3380, Professor Uma Ramamurthy

Group 10:
- Dylan Hoang Cao
- Benjamin Shek
- An Thien Pham
- Damian Barriga
- Sai P. Harihar

# Project Description:
This is a full stack Point Of Sales System web application. This application is 
hosted on Vercel and connected to a MSSQL database on Microsoft Azure. The web 
application demonstrates customer interaction by allowing them add products to cart, 
purchase products, and view order histories. This application also allows Admins to 
add/edit/delete items in their shopping cart through API calls and queries. 
Administrative actions  include add/edit/delete queries to the [dbo].Product, 
[dbo].Supplier, [dbo].User, [dbo].Notifications  and [dbo].SHOPPING_CART in the
database.

----------------------------------------------------------------------------------

# Libraries Used:
- npm install recharts
- npm install swr
- npm install -D tailwindcss
- npm install next.js
- npm install flowbite
- npm install uuidv4
- npm install mssql

----------------------------------------------------------------------------------

Inside the src folder:
    - components folder: consists of UI Typescript files for sale and stock rports,
        sidebar interfaces, Admin and Customer interfaces.

    - context folder:
        - AuthContext.tsx: typescript file that handles user authentication

    - interfaces folder:
        - contains _____ "table properties for the API to use" _____

    - pages folder:
        - API folder: 
            - contains API calls for different functionalities of the application. The API calls the fetchers each corresponding managing file.
                - EXAMPLE: users.ts (location of users api) calls the fetchers inside manageUsers.tsx to access the tables inside the database.
        - The rest of the files are used for fetching data and actions needed to query the data in the database.

    - styles folder:
        - contains error, success css files for visual input warning features.


    The rest of the files are automatically implemented from frameworks we used, Node.js.
