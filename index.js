const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Start the express server
const app = express();

app.get("/ping", (req, res) => {
  res.json({ message: "pong" });
});

// Create a longUrl post route with a shortUrl query parameter
app.post("/longUrl", async (req, res) => {
  const { shortUrl } = req.query;

  // Retrieve the longUrl from the database
  const longUrl = await prisma.link.findUnique({
    where: {
      shortUrl: shortUrl,
    },
  });

  // Return the long url
  res.json({ longUrl: longUrl.shortUrl });
});

// Create a post route with a longUrl parameter which generates a random shortUrl
app.post("/shortUrl", async (req, res) => {
  // Get the longUrl parameter from the request
  const { longUrl } = req.query;

  // Generate a random shortUrl of 5 alphanumeric characters
  const shortUrl = Math.random().toString(36).substring(2, 7);

  // Create a new link in the database
  const link = await prisma.link.create({
    data: {
      longUrl: longUrl,
      shortUrl: shortUrl,
    },
  });

  // Return the short url
  res.json({ shortUrl: link.shortUrl });
});

// Start the server
app.listen(3000, () => {
  console.log("Server started on port 3000");
});
