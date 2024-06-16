const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./connections/connection");
const Company = require("./models/company.model.js");

const { scrapeWebsite } = require("./scraper.js");

connection();

app.use(cors());

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/scrape", async (req, res) => {
  const { url } = req.body;
  try {
    const scrapedData = await scrapeWebsite(url);
    await Company.create({
      companyName: scrapedData.companyName,
      description: scrapedData.description,
      logo: scrapedData.logo,
      companyUrl: scrapedData.companyUrl,
      screenshot: scrapedData.screenshot,
      facebook: scrapedData.socialLinks.facebook,
      twitter: scrapedData.socialLinks.twitter,
      linkedin: scrapedData.socialLinks.linkedin,
      address: scrapedData.address || "Can't find address",
      phoneNumber: scrapedData.address || "Can't find phone no.",
      email: scrapedData.address || "Can't find email",
    });
    res.status(201).json({ message: "Company List Updated" });
  } catch (error) {
    res.status(500).json({ message: "why" + error.message });
  }
});

app.delete("/api/companies/delete", async (req, res) => {
  const { ids } = req.body;
  try {
    await Company.deleteMany({ _id: { $in: ids } });
    res.status(200).json({ message: "Companies deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting companies: " + error.message });
  }
});

app.get("/api/companies", async (req, res) => {
  try {
    const companies = await Company.find({});
    res.status(200).json(companies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/companies/:id", async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    res.status(200).json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(4000, function () {
  console.log("Web server listening on port 4000");
});
