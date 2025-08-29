const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Static user details
const FULL_NAME = "john_doe"; // use lowercase
const DOB = "17091999";
const EMAIL = "john@xyz.com";
const ROLL_NUMBER = "ABCD123";

// POST /bfhl
app.post("/bfhl", (req, res) => {
  try {
    const inputArray = req.body.data;

    if (!Array.isArray(inputArray)) {
      return res.status(400).json({
        is_success: false,
        message: "'data' must be an array",
      });
    }

    let evenNumbers = [];
    let oddNumbers = [];
    let alphabets = [];
    let specialChars = [];
    let sum = 0;
    let allLetters = []; // keep original characters for concat_string

    inputArray.forEach((item) => {
      if (!isNaN(item)) {
        // Numeric
        let num = parseInt(item, 10);
        sum += num;
        if (num % 2 === 0) {
          evenNumbers.push(item.toString());
        } else {
          oddNumbers.push(item.toString());
        }
      } else if (/^[a-zA-Z]+$/.test(item)) {
        // Alphabets
        alphabets.push(item.toUpperCase());
        allLetters.push(...item.split("")); // store raw letters
      } else {
        // Special chars
        specialChars.push(item);
      }
    });

    // Build alternating caps string from reversed raw letters
    let concatString = allLetters
      .reverse()
      .map((ch, i) => (i % 2 === 0 ? ch.toUpperCase() : ch.toLowerCase()))
      .join("");

    res.status(200).json({
      is_success: true,
      user_id: `${FULL_NAME}_${DOB}`,
      email: EMAIL,
      roll_number: ROLL_NUMBER,
      odd_numbers: oddNumbers,
      even_numbers: evenNumbers,
      alphabets: alphabets,
      special_characters: specialChars,
      sum: sum.toString(),
      concat_string: concatString,
    });
  } catch (error) {
    res.status(500).json({
      is_success: false,
      message: error.message,
    });
  }
});

// Root test route
app.get("/", (req, res) => res.send("BFHL API running"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
