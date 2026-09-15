import React from "react";
import ListingCard from './LisitngCard'

const data = [
  {
    image: "/img1.png",
    icons: ["/g1.png", "/g2.png", "/g3.png"],
    title: "Landscaping Palm Bech",
    description: "Lisitng ID BRLO20230915 October 12, 2023  at 2:43 pm",
    price: "$ 180.00",
  },
  {
    image: "/img2.png",
    icons: ["/g1.png", "/g2.png", "/g3.png"],
    title: "Landscaping Palm Bech",
    description: "Lisitng ID BRLO20230915 October 12, 2023  at 2:43 pm",
    price: "$ 180.00",
  },
  {
    image: "/img3.png",
    icons: ["/g1.png", "/g2.png", "/g3.png"],
    title: "Landscaping Palm Bech",
    description: "Lisitng ID BRLO20230915 October 12, 2023  at 2:43 pm",
    price: "$ 180.00",
  },
  {
    image: "/img4.png",
    icons: ["/g1.png", "/g2.png", "/g3.png"],
    title: "Landscaping Palm Bech",
    description: "Lisitng ID BRLO20230915 October 12, 2023  at 2:43 pm",
    price: "$ 180.00",
  },
  {
    image: "/img1.png",
    icons: ["/g1.png", "/g2.png", "/g3.png"],
    title: "Landscaping Palm Bech",
    description: "Lisitng ID BRLO20230915 October 12, 2023  at 2:43 pm",
    price: "$ 180.00",
  },
  {
    image: "/img2.png",
    icons: ["/g1.png", "/g2.png", "/g3.png"],
    title: "Landscaping Palm Bech",
    description: "Lisitng ID BRLO20230915 October 12, 2023  at 2:43 pm",
    price: "$ 180.00",
  },
  {
    image: "/img3.png",
    icons: ["/g1.png", "/g2.png", "/g3.png"],
    title: "Landscaping Palm Bech",
    description: "Lisitng ID BRLO20230915 October 12, 2023  at 2:43 pm",
    price: "$ 180.00",
  },
  {
    image: "/img4.png",
    icons: ["/g1.png", "/g2.png", "/g3.png"],
    title: "Landscaping Palm Bech",
    description: "Lisitng ID BRLO20230915 October 12, 2023  at 2:43 pm",
    price: "$ 180.00",
  },
];

const DeletedListing = () => {
  return (
    <div className="opacity-50">
    <div className="listing-card-grid p-5">
      {data.map((card, index) => (
        <ListingCard
          key={index}
          image={card.image}
          icons={card.icons}
          price={card.price}
          title={card.title}
          description={card.description}
        />
      ))}
    </div>
    </div>
  );
};

export default DeletedListing;