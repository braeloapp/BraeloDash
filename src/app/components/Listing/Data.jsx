import { getAllEditFieldsForCategory } from "@/lib/listingFormFields";

const vehicles = getAllEditFieldsForCategory("Vehicles");
const realestate = getAllEditFieldsForCategory("Real Estate");
const services = getAllEditFieldsForCategory("Services");
const events = getAllEditFieldsForCategory("Events");
const jobs = getAllEditFieldsForCategory("Jobs");
const electronics = getAllEditFieldsForCategory("Electronics");
const furniture = getAllEditFieldsForCategory("Furniture");
const fashion = getAllEditFieldsForCategory("Fashion");
const kids = getAllEditFieldsForCategory("Kids");
const sports = getAllEditFieldsForCategory("Sports & Hobby");

/**
 * Flat edit-field maps used by Active/Inactive/Total listing tabs.
 * Keys include both API category values and display labels.
 */
export const Update_data = {
  Vehicles: vehicles,
  vehicles: vehicles,
  "Real Estate": realestate,
  realestate: realestate,
  Services: services,
  services: services,
  Events: events,
  events: events,
  Jobs: jobs,
  jobs: jobs,
  Electronics: electronics,
  electronics: electronics,
  Furniture: furniture,
  furniture: furniture,
  Fashion: fashion,
  fashion: fashion,
  Kids: kids,
  kids: kids,
  "Sports & Hobby": sports,
  "Sports & Hobbies": sports,
  sportsandhobby: sports,
  "Sports and Hobby": sports,
};

export default Update_data;
