const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Static user details
const FULL_NAME = "john_doe";
const DOB = "17091999";
const EMAIL = "john@xyz.com";
const ROLL_NUMBER = "ABCD123";

// Helper: alternating caps
function toAlternatingCaps(str) {
  return str
    .split("")
    .map((ch, i) => (i % 2 === 0 ? ch.toUpperCase() : ch.toLowerCase()))
    .join("");
}

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

    inputArray.forEach((item) => {
      if (!isNaN(item)) {
        let num = parseInt(item, 10);
        sum += num;
        if (num % 2 === 0) evenNumbers.push(item.toString());
        else oddNumbers.push(item.toString());
      } else if (/^[a-zA-Z]+$/.test(item)) {
        alphabets.push(item.toUpperCase());
      } else {
        specialChars.push(item);
      }
    });

    // Concatenation string: reverse + alternating caps
    let concatString = toAlternatingCaps(alphabets.join("").split("").reverse().join(""));

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

// Test route
app.get("/", (req, res) => res.send("BFHL API running"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
