/**
 * Fake slow data source to simulate database latency.
 * getItem returns an object after a short delay.
 */

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Create a small catalog of 50 items. Most are located in Africa / Nigeria for demo purposes.
const FAKE_ITEMS = [
  { id: '1', name: 'Lagos Handcrafted Vase (NG)', country: 'Nigeria' },
  { id: '2', name: 'Abuja Leather Satchel (NG)', country: 'Nigeria' },
  { id: '3', name: 'Kano Woven Basket (NG)', country: 'Nigeria' },
  { id: '4', name: 'Port Harcourt Metal Sculpture (NG)', country: 'Nigeria' },
  { id: '5', name: 'Kaduna Ceramic Bowl (NG)', country: 'Nigeria' },
  { id: '6', name: 'Ibadan Beaded Necklace (NG)', country: 'Nigeria' },
  { id: '7', name: 'Jos Stoneware (NG)', country: 'Nigeria' },
  { id: '8', name: 'Enugu Textile (NG)', country: 'Nigeria' },
  { id: '9', name: 'Benin Bronze Miniature (NG)', country: 'Nigeria' },
  { id: '10', name: 'Calabar Carving (NG)', country: 'Nigeria' },

  { id: '11', name: 'Nairobi Coffee Beans (KE)', country: 'Kenya' },
  { id: '12', name: 'Accra Kente Cloth (GH)', country: 'Ghana' },
  { id: '13', name: 'Cape Town Wine (ZA)', country: 'South Africa' },
  { id: '14', name: 'Casablanca Spice Mix (MA)', country: 'Morocco' },
  { id: '15', name: 'Cairo Papyrus Print (EG)', country: 'Egypt' },

  { id: '16', name: 'Dakar Beadwork (SN)', country: 'Senegal' },
  { id: '17', name: 'Kigali Handbag (RW)', country: 'Rwanda' },
  { id: '18', name: 'Lome Carving (TG)', country: 'Togo' },
  { id: '19', name: 'Harare Textile (ZW)', country: 'Zimbabwe' },
  { id: '20', name: 'Maputo Basket (MZ)', country: 'Mozambique' },

  { id: '21', name: 'Freetown Shell Craft (SL)', country: 'Sierra Leone' },
  { id: '22', name: 'Libreville Woodwork (GA)', country: 'Gabon' },
  { id: '23', name: 'Bamako Pottery (ML)', country: 'Mali' },
  { id: '24', name: 'Conakry Textile (GN)', country: 'Guinea' },
  { id: '25', name: 'Monrovia Craft (LR)', country: 'Liberia' },

  { id: '26', name: 'Tripoli Rug (LY)', country: 'Libya' },
  { id: '27', name: 'Tunis Mosaic (TN)', country: 'Tunisia' },
  { id: '28', name: 'Algiers Ceramic (DZ)', country: 'Algeria' },
  { id: '29', name: 'Windhoek Metalwork (NA)', country: 'Namibia' },
  { id: '30', name: 'Gaborone Handmade Toy (BW)', country: 'Botswana' },

  // More Nigeria / West Africa focused items to push the dataset toward "mostly Nigeria/Africa"
  { id: '31', name: 'Sapele Wood Bowl (NG)', country: 'Nigeria' },
  { id: '32', name: 'Ife Bronze Pendant (NG)', country: 'Nigeria' },
  { id: '33', name: 'Awka Copper Work (NG)', country: 'Nigeria' },
  { id: '34', name: 'Uyo Raffia Mat (NG)', country: 'Nigeria' },
  { id: '35', name: 'Zaria Wool Shawl (NG)', country: 'Nigeria' },

  { id: '36', name: 'Sokoto Leather Boots (NG)', country: 'Nigeria' },
  { id: '37', name: 'Makurdi Beaded Cap (NG)', country: 'Nigeria' },
  { id: '38', name: 'Abeokuta Woodblock Print (NG)', country: 'Nigeria' },
  { id: '39', name: 'Ondo Pottery Set (NG)', country: 'Nigeria' },
  { id: '40', name: 'Ilorin Tie-Dye (NG)', country: 'Nigeria' },

  { id: '41', name: 'Marrakesh Lantern (MA)', country: 'Morocco' },
  { id: '42', name: 'Essaouira Jewelry (MA)', country: 'Morocco' },
  { id: '43', name: 'Zanzibar Spice Box (TZ)', country: 'Tanzania' },
  { id: '44', name: 'Mombasa Shell Necklace (KE)', country: 'Kenya' },
  { id: '45', name: 'Cape Verde Textile (CV)', country: 'Cape Verde' },

  { id: '46', name: 'Nouakchott Weave (MR)', country: 'Mauritania' },
  { id: '47', name: 'Lilongwe Basket (MW)', country: 'Malawi' },
  { id: '48', name: 'Bujumbura Wood Toy (BI)', country: 'Burundi' },
  { id: '49', name: 'Saint-Louis Print (SN)', country: 'Senegal' },
  { id: '50', name: 'Kano Indigo Cloth (NG)', country: 'Nigeria' }
];

async function getItem(id) {
  // simulate latency
  await sleep(300);
  // find by id in array
  return FAKE_ITEMS.find((it) => it.id === String(id)) || null;
}

async function listItems(limit = 50) {
  await sleep(200);
  const n = Math.max(0, Math.min(Number(limit) || 50, 50));
  return FAKE_ITEMS.slice(0, n);
}

module.exports = { getItem, listItems };
