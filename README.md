# Developers' Guild Forums

**How to Install**

1. If you don't have Node.js, download it at [http://nodejs.org/](http://nodejs.org/) and install it.
2. Clone the repo.
3. Navigate to the 'DG-forum' folder in terminal/cmd/bash.
4. Run *npm install*. This will install all the packages used in the site.
5. If you have Windows, run *export MONGO_ADDRESS=(addressintheskypechat)* to set the environment variable to connect to the DB in the code.
6. If you have Mac, run *MONGO_ADDRESS=(addressintheskypechat)* to set the environment variable to connect to the DB in the code.
7. If you have Linux, run *MONGO_ADDRESS='(addressintheskypechat)'* node index.js. This is similar to the Mac method, but with single quotes.
8. Go back to your first terminal/cmd/bash and run *npm start* to start up the server.
9. Open [http://localhost:3000/](http://localhost:3000/) and you should be at the site.

**Other Info**

- HTML templates go in the "views" folder
- Untemplated HTML files go in the "frontend-views" folder
- CSS, Non-Node JS, and IMG files go in the "public" folder in their respective folders
- Do not push directly to master. Work on a branch (or fork), and make Pull Requests. Any commits pushed directly onto master will be reverted.

**Node Packages Used**

- Express
- Mongoose
- Nunjucks
- Body-Parser
- Cookie-Parser
- Validator
- Bcrypt
- Express-Session
- Connect-Mongo
- Async
- Multer

**Coding Style**

We'll be using [Airbnb's Javascript Style Guide](https://github.com/airbnb/javascript)

**Good Links to Check Out**

- [Express' Website](http://expressjs.com/)
- [npm's Website](https://www.npmjs.com/)
- [Dead Simple Guide to Node.js, Express, and MongoDB](http://cwbuecheler.com/web/tutorials/2013/node-express-mongo/)
- [Javascript Style Guide](https://github.com/airbnb/javascript)

**Group Members**

- Alex - Project Lead, Frontend Developer
- Brandon - Frontend Developer
- Chris - Backend Developer
- Kareem - Backend Developer

**License (MIT)**

Copyright (c) 2015 Developers' Guild ([http://developersguild.net/](http://developersguild.net/))

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
