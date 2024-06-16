import { useState } from "react";
import { IoSearchSharp } from "react-icons/io5";

const Navbar = ({ onScrapeSuccess }) => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleScrape = async () => {
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("https://web-scraper-server.vercel.app/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage("Success! Company details fetched and saved.");
        onScrapeSuccess();
      } else {
        setMessage(`Please check the URL or try a different URL`);
      }
    } catch (error) {
      setMessage(`Error scraping website: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <nav className="flex flex-wrap gap-5 p-5 bg-white">
      <div className="flex items-center border bg-[#F9FAFB] rounded-lg">
        <IoSearchSharp className="text-xl text-[#6c7280] ml-3" />
        <input
          placeholder="Enter Domain Name"
          className="p-3 text-sm bg-[#F9FAFB] w-[75vw] md:w-[20rem] lg:w-[25rem] outline-none"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </div>
      <button
        className="text-[#6C2BD9] bg-[#EDE6FF] p-3 w-full md:w-fit rounded-lg text-sm"
        onClick={handleScrape}
        disabled={loading}
      >
        {loading ? "Loading..." : "Fetch & Save Details"}
      </button>
      {message && <p className="text-sm mt-2">{message}</p>}
    </nav>
  );
};

export default Navbar;
