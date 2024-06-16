import { PiExport } from "react-icons/pi";
import { FaFacebook, FaLinkedin, FaTwitter } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CSVLink } from "react-csv";
import Navbar from "../components/Navbar";

import { GrNext, GrPrevious } from "react-icons/gr";

const Home = () => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 8;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = companies.slice(firstIndex, lastIndex);
  const npage = Math.ceil(companies.length / recordsPerPage);
  const numbers = [...Array(npage + 1).keys()].slice(1);

  const fetchCompanies = async () => {
    try {
      const response = await fetch("https://web-scraper-backend-b77m.onrender.com/api/companies");
      const data = await response.json();
      setCompanies(data.reverse());
      setLoading(false);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleCompanyClick = (id) => {
    navigate(`/companydetails/${id}`);
  };

  const handleCheckboxChange = (id) => {
    const isSelected = selectedCompanies.includes(id);
    if (isSelected) {
      setSelectedCompanies((prevSelected) =>
        prevSelected.filter((companyId) => companyId !== id)
      );
    } else {
      setSelectedCompanies((prevSelected) => [...prevSelected, id]);
    }
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      const allCompanyIds = companies.map((company) => company._id);
      setSelectedCompanies(allCompanyIds);
    } else {
      setSelectedCompanies([]);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(
        "https://web-scraper-backend-b77m.onrender.com/api/companies/delete",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ids: selectedCompanies }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete companies");
      }

      const updatedCompanies = companies.filter(
        (company) => !selectedCompanies.includes(company._id)
      );
      setCompanies(updatedCompanies);
      setSelectedCompanies([]);
    } catch (error) {
      console.error("Error deleting companies:", error);
    }
  };

  const prevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const changeCPage = (n) => {
    setCurrentPage(n);
  };

  const nextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, npage));
  };

  const processedCompanies = companies.map(({ screenshot, ...rest }) => rest);

  const truncateDescription = (description) => {
    if (description.length > 75) {
      return `${description.substring(0, 75)}...`;
    }
    return description;
  }

  return (
    <main className="bg-white m-2 border rounded-md">
      <Navbar onScrapeSuccess={fetchCompanies} />
      <section className="flex gap-16 items-center p-3 pt-5">
        <p className="text-sm">{selectedCompanies.length} selected</p>
        <div className="flex text-sm text-[#a2a2a2] gap-3">
          <button
            className="border py-2 px-3 rounded-lg  hover:text-gray-500 hover:border-gray-500 transition-all"
            onClick={handleDelete}
            disabled={selectedCompanies.length === 0}
          >
            Delete
          </button>
          <button className="flex gap-2 items-center border py-2 px-3 rounded-lg hover:text-gray-500 hover:border-gray-500 transition-all">
            <PiExport className="text-lg" />
            <CSVLink data={processedCompanies} filename={"companies.csv"}>
              Export as CSV
            </CSVLink>
          </button>
        </div>
      </section>

      {loading ? (
        <p className="p-3">loading...</p>
      ) 
      :<table className="text-sm">
        <thead className="bg-[#F6F6F4] text-xs">
          <tr>
            <td className="w-[2vw] p-3">
              <input
                type="checkbox"
                onChange={handleSelectAll}
                checked={selectAll}
              />
            </td>
            <td className="w-[3vw]"></td>
            <td className="w-[8vw]">COMPANY</td>
            <td className="w-[10vw]">SOCIAL PROFILES</td>
            <td className="w-[40vw]">DESCRIPTION</td>
            <td className="w-[15vw]">ADDRESS</td>
            <td className="w-[10vw]">PHONE NO.</td>
            <td className="w-[12vw]">EMAIL</td>
          </tr>
        </thead>
        <tbody>
          {records.map((company, index) => (
            <tr key={index} className="border-y">
              <td className="py-5 px-3">
                <input
                  type="checkbox"
                  onChange={() => handleCheckboxChange(company._id)}
                  checked={selectedCompanies.includes(company._id)}
                />
              </td>
              <td>
                <img src={company.logo} className="size-8" />
              </td>
              <td onClick={() => handleCompanyClick(company._id)}>
                <span
                  className="cursor-pointer text-[#6c2bd9]"
                >
                  {company.companyName}
                </span>
              </td>
              <td>
                <div className="flex gap-3 text-xl text-[#ececec]">
                  <a href={company.facebook || "#"} target="_blank">
                    <FaFacebook className="cursor-pointer hover:text-gray-500 transition-all" />
                  </a>
                  <a href={company.twitter || "#"} target="_blank">
                    <FaTwitter className="cursor-pointer hover:text-gray-500 transition-all" />
                  </a>
                  <a href={company.linkedin || "#"} target="_blank">
                    <FaLinkedin className="cursor-pointer hover:text-gray-500 transition-all" />
                  </a>
                </div>
              </td>
              <td onClick={() => handleCompanyClick(company._id)} className="cursor-pointer">{truncateDescription(company.description)}</td>
              <td>{company.address}</td>
              <td className="text-[#6c2bd9]">{company.phoneNumber}</td>
              <td className="text-[#6c2bd9]">{company.email}</td>
            </tr>
          ))}
        </tbody>
      </table>}

      {/* Pagination */}
      <nav className="w-fit pt-5 px-5 pb-8">
        <ul className="flex items-center">
          <li
            onClick={prevPage}
            className="cursor-pointer flex justify-center items-center border border-[#d1d5db] size-[2.125rem] rounded-l-md"
          >
            <button className="" disabled={currentPage === 1}>
              <GrPrevious className="text-xs" />
            </button>
          </li>
          {numbers.map((n, i) => (
            <li key={i} className="border-y border-r border-[#d1d5db] text-xs">
              <button
                className={`size-8 ${currentPage === n ? "bg-gray-200" : ""}`}
                onClick={() => changeCPage(n)}
              >
                {n}
              </button>
            </li>
          ))}
          <li
            onClick={nextPage}
            className="cursor-pointer flex justify-center items-center border-y border-r border-[#d1d5db] size-[2.125rem] rounded-r-md"
          >
            <button className="" disabled={currentPage === npage}>
              <GrNext className="text-xs" />
            </button>
          </li>
        </ul>
      </nav>
    </main>
  );
};

export default Home;
