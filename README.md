# Developers' Guild Forums

**How to Install**

1. If you don't have Node.js, download it at [http://nodejs.org/](http://nodejs.org/) and install it.
2. If you don't have MongoDB, download it at [https://www.mongodb.org/](https://www.mongodb.org/) and unzip the folder anywhere.
3. Clone the repo.
4. Navigate to the 'DG-forum' folder in terminal/cmd/bash.
5. Run *npm install*. This will install all the packages used in the site.
6. Run *mkdir data*. This will create the folder that we'll store DB data.
7. Open a second terminal/cmd/bash and navigate to your MongoDB folder.
8. Run *mongod --dbpath (Path of DG-forum/data)*. For example, I would run *./mongod --dbpath /Users/chrisbanh/Workspace/DG-forum/data*. IMPORTANT: Make sure you leave this window open, otherwise the database won't be running.
9. Go back to your first terminal/cmd/bash and run *node index.js* to start up the server.
10. Open [http://localhost:3000/](http://localhost:3000/) and you should be at the site. 

**Other Info**
- HTML templates go in the "views" folder
- CSS, Non-Node JS, and IMG files go in the "public" folder in their respective folders
- Starting up the MongoDB might be a bit complicated, so refer to the "Dead Simple Guide to Node.js, Express, and MongoDB" link below.
- If we can host the DB on a server, like DG's website, then we can cut out a huge chunk of the requirement for getting the server to run, plus we'd all be working with the same data instead of having to create makeshift data.

**Node Packages Used**
- Express
- MongoDB
- Mongoose
- Nunjucks
- Body-Parser
- Cookie-Parser
- Validator
- Bcrypt

**Good Links to Check Out**
- [Express' Website](http://expressjs.com/)
- [npm's Website](https://www.npmjs.com/)
- [Dead Simple Guide to Node.js, Express, and MongoDB](http://cwbuecheler.com/web/tutorials/2013/node-express-mongo/)
- [Javascript Style Guide](https://github.com/airbnb/javascript)

**Group Members**
- Alex - Project Lead, Frontend Developer
- Brandon - Frontend Developer
- Ben - Frontend Developer
- Chris - Backend Developer
- Kareem - Backend Developer

**License (MIT)**

Copyright (c) 2015 Developers' Guild [http://developersguild.net/](http://developersguild.net/)

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
