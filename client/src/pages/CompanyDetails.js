import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import { CiCircleInfo } from "react-icons/ci";
import { MdOutlinePhoneInTalk, MdOutlineAttachEmail } from "react-icons/md";
import { PiGlobeHemisphereEastLight } from "react-icons/pi";
import { FiMapPin } from "react-icons/fi";
import { IoCameraOutline } from "react-icons/io5";
import {
  SlSocialFacebook,
  SlSocialLinkedin,
  SlSocialTwitter,
} from "react-icons/sl";
import Navbar from "../components/Navbar";

const CompanyDetails = () => {
  const { id } = useParams();
  const [company, setCompany] = useState(null);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const response = await fetch(
          `https://web-scraper-backend-b77m.onrender.com/api/companies/${id}`
        );
        const data = await response.json();
        setCompany(data);
      } catch (error) {
        console.error("Error fetching company details:", error);
      }
    };

    fetchCompany();
  }, [id]);

  if (!company) {
    return <div>Loading...</div>;
  }

  return (
    <main>
      <Navbar />
      <div className="flex items-center bg-white pb-2 px-8 text-sm">
        <Link to="/" className="cursor-pointer">
          Home
        </Link>{" "}
        <IoIosArrowForward className="mx-3" /> {company.companyName}
      </div>

      <section className="flex flex-col md:flex-row gap-5 md:gap-20 md:items-center bg-white rounded-md m-2 p-5">
        <div className="md:flex md:gap-5 items-center md:w-[60%]">
          <img src={company.logo} className="size-40 border rounded-md" />
          <div>
            <h1 className="text-3xl font-medium mt-6 mb-2">
              {company.companyName}
            </h1>
            <span className="flex items-center gap-2 text-[#64748b] mb-1">
              <CiCircleInfo className="text-xl" /> Description
            </span>
            <p className="font-light">{company.description}</p>
          </div>
        </div>

        <div className="md:w-[40%]">
          <span className="flex items-center gap-2 text-[#64748b]">
            <MdOutlinePhoneInTalk className="text-xl" /> Phone
          </span>
          <p className="font-light mb-4">(555)-555-5555</p>

          <span className="flex items-center gap-2 text-[#64748b]">
            <MdOutlineAttachEmail className="text-xl" /> Email
          </span>
          <p className="font-light">contact@netflix.com</p>
        </div>
      </section>

      <section className="md:flex">
        <div className="bg-white rounded-md m-2 p-5 h-fit md:w-[35%]">
          <h4 className="font-medium mb-3">Company Details</h4>
          <span className="flex items-center gap-2 text-[#64748b]">
            <PiGlobeHemisphereEastLight className="text-xl" /> Website
          </span>
          <p className="font-light mb-4">{company.companyUrl}</p>
          <span className="flex items-center gap-2 text-[#64748b] mb-1">
            <CiCircleInfo className="text-xl" /> Description
          </span>
          <p className="font-light mb-4">{company.description}</p>
          <span className="flex items-center gap-2 text-[#64748b]">
            <MdOutlineAttachEmail className="text-xl" /> Email
          </span>
          <p className="font-light mb-4">contact@netflix.com</p>

          {/* Social Links */}
          <span className="flex items-center gap-2 text-[#64748b]">
            <SlSocialFacebook className="text-xl" /> Facebook
          </span>
          <p className="font-light mb-4">{company.facebook || "Not found"}</p>
          <span className="flex items-center gap-2 text-[#64748b]">
            <SlSocialTwitter className="text-xl" /> Twitter
          </span>
          <p className="font-light mb-4">{company.twitter || "Not found"}</p>
          <span className="flex items-center gap-2 text-[#64748b]">
            <SlSocialLinkedin className="text-xl" /> Linkedin
          </span>
          <p className="font-light mb-4">{company.linkedin || "Not found"}</p>

          <span className="flex items-center gap-2 text-[#64748b]">
            <FiMapPin className="text-xl" /> Address
          </span>
          <p className="font-light mb-4">{company.address || "Not found"}</p>
        </div>

        <div className="bg-white rounded-md m-2 p-5 md:w-[65%]">
          <h4 className="flex items-center gap-2 font-medium mb-3"><IoCameraOutline className="text-xl"/>Screenshot of Webpage</h4>
          <img src={company.screenshot} className="border mx-auto" />
        </div>
      </section>
    </main>
  );
};

export default CompanyDetails;
