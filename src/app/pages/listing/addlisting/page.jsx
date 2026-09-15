// pages/listing/addlisting/page.jsx (Main Categories Page)
import React from "react";
import Link from "next/link";
import BackButton from "@/app/components/BackButton";

const categories = [
  { name: "Vehicles", slug: "Vehicles", endpoint: "vehicle",category: "Vehicles" },
  { name: "Real Estate", slug: "realestate", endpoint: "realestate", category:"Real Estate" },
  // { name: "Services", slug: "services", endpoint: "services" },
  { name: "Events", slug: "events", endpoint: "events", category:"Events" },
  { name: "Jobs", slug: "jobs", endpoint: "jobs", category:"jobs" },
  { name: "Electronics", slug: "electronics", endpoint: "electronics", category:"Electronics" },
  { name: "Furniture", slug: "furniture", endpoint: "furniture", category:"Furniture" },
  { name: "Fashion", slug: "fashion", endpoint: "fashion", category:"Fashion" },
  { name: "Kids", slug: "kids", endpoint: "kids",category:"Kids" },
  { name: "Sports & Hobby", slug: "sportsandhobby", endpoint: "sportshobby", category:"Sports & Hobby" },
];

const Categories = () => {
  return (
    <div>
      <div className="page-header">
        <div className="flex min-w-0 items-center gap-2">
        <BackButton />
        <h1 className="page-title">
          All Categories
        </h1>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {categories.map((category) => (
          <Link 
            key={category.slug} 
            href={{
              pathname: `/pages/listing/addlisting/${category.slug}`,
              query: { endpoint: category.endpoint , category: category.category }, // Pass the endpoint and category as query parameters
            }}
          >
            <div className="flex items-center rounded-xl bg-[#ffcc35] px-5 py-4 transition-all duration-300 hover:bg-[#D8B039]">
              <span className="text-white hover:text-black flex items-center space-x-2 text-md">
                <span>{category.name}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Categories;



// import React from "react";
// import Link from "next/link";
// import BackButton from "@/app/components/BackButton";

// const categories = [
//   { name: "Vehicle", slug: "vehicle" },
//   { name: "Real Estate", slug: "realestate" },
//   { name: "Services", slug: "services" },
//   { name: "Events", slug: "events" },
//   { name: "Jobs", slug: "jobs" },
//   { name: "Electronics", slug: "electronics" },
//   { name: "Furniture", slug: "furniture" },
//   { name: "Fashion", slug: "fashion" },
//   { name: "Kids", slug: "kids" },
//   { name: "Sports & Hobby", slug: "sportsandhobby" },
// ];

// const Categories = () => {
//   return (
//     <div>
//       <div className="flex items-center gap-2">
//         <BackButton />
//         <h1 className="text-[#78828A] text-[24px] font-[500]">
//           All Categories
//         </h1>
//       </div>
//       <div className="grid grid-cols-5 gap-5 mt-8">
//         {categories.map((category) => (
//           <Link key={category.slug} href={`/pages/listing/addlisting/${category.slug}`}>
//           <div
//               className="bg-[#ffcc35] px-6 py-4 hover:bg-gray-300 transition-all duration-300 rounded-md flex items-center"
//             >
//               <span className="text-white hover:text-black flex items-center space-x-2 text-md">
//                 <span>{category.name}</span>
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   strokeWidth={2}
//                   stroke="currentColor"
//                   className="w-5 h-5"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     d="M9 5l7 7-7 7"
//                   />
//                 </svg>
//               </span>
//             </div>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Categories;
