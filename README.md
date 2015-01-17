# Developers' Guild Forums

**How to Install**

1. If you don't have Node.js, download it at [http://nodejs.org/](http://nodejs.org/) and install it.
2. If you don't have MongoDB, download it at [https://www.mongodb.org/](https://www.mongodb.org/) and unzip the folder anywhere.
3. Clone the repo.
4. Navigate to the 'dg-site' folder in terminal/cmd/bash.
5. Run *npm install*. This will install all the packages used in the site.
6. Run *mkdir data*. This will create the folder that we'll store DB data.
7. Open a second terminal/cmd/bash and navigate to your MongoDB folder.
8. Run *mongod --dbpath (Path of dg-site/data)*. For example, I would run *./mongod --dbpath /Users/chrisbanh/Workspace/dg-site/data*. IMPORTANT: Make sure you leave this window open, otherwise the database won't be running.
9. Go back to your first terminal/cmd/bash and run *node index.js* to start up the server.
10. Open [http://localhost:3000/](http://localhost:3000/) and you should be at the site. 

**Other Info**
- HTML templates go in the "views" folder
- CSS, Non-Node JS, and IMG files go in the "public" folder in their respective folders
- Starting up the MongoDB might be a bit complicated, so refer to the "Dead Simple Guide to Node.js, Express, and MongoDB" link below.
- If we can host the DB on a server, like DG's website, then we can cut out a huge chunk of the requirement for getting the server to run, plus we'd all be working with the same data instead of having to create pseudo data.

**Node Packages Used**
- Express
- MongoDB
- Monk (We'll switch to Mongoose later in development)
- Body-Parser
- Nunjucks

**Good Links to Check Out**
- [How To Make a Basic Node.js App Using Express](https://www.mongodb.org/)
- [Dead Simple Guide to Node.js, Express, and MongoDB](http://cwbuecheler.com/web/tutorials/2013/node-express-mongo/)
- [Javascript Style Guide](https://github.com/airbnb/javascript)
- [npm's Website](https://www.npmjs.com/)

**Group Members**
- Alex - Project Lead, Frontend Developer
- Brandon - Frontend Developer
- Ben - Frontend Developer
- Kareem - Backend Developer
- Wolfgang - Backend Developer
- Chris - Backend Developer

**License**

This software is licensed under the MIT License.