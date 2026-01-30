import React, { useState, useEffect } from "react";
export default SearchWeather;
import axios from "axios";
import WeatherAnimation from "./WeatherAnimation.jsx";

function SearchWeather() {

    const [city, setCity] = useState("");
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState(null);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isCitySelected, setIsCitySelected] = useState(false);

    // Helper function to capitalize first letter of each word
    const capitalizeCity = (cityName) => {
        return cityName.split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ');
    };

    // Fetch city suggestions
    const fetchSuggestions = (query) => {
        if (query.length < 2 || isCitySelected) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        // Comprehensive list of major cities worldwide
        const allCities = [
            // Sri Lankan cities (district capitals, major towns, and smaller towns)
            'Colombo, Sri Lanka', 'Dehiwala-Mount Lavinia, Sri Lanka', 'Moratuwa, Sri Lanka', 'Sri Jayawardenepura Kotte, Sri Lanka',
            'Negombo, Sri Lanka', 'Kandy, Sri Lanka', 'Galle, Sri Lanka', 'Jaffna, Sri Lanka', 'Trincomalee, Sri Lanka',
            'Batticaloa, Sri Lanka', 'Anuradhapura, Sri Lanka', 'Ratnapura, Sri Lanka', 'Badulla, Sri Lanka', 'Matara, Sri Lanka',
            'Kalutara, Sri Lanka', 'Mannar, Sri Lanka', 'Puttalam, Sri Lanka', 'Kurunegala, Sri Lanka', 'Gampaha, Sri Lanka',
            'Chilaw, Sri Lanka', 'Panadura, Sri Lanka', 'Kegalle, Sri Lanka', 'Point Pedro, Sri Lanka', 'Valvettithurai, Sri Lanka',
            'Ampara, Sri Lanka', 'Polonnaruwa, Sri Lanka', 'Matale, Sri Lanka', 'Nuwara Eliya, Sri Lanka', 'Hambantota, Sri Lanka',
            'Monaragala, Sri Lanka', 'Kilinochchi, Sri Lanka', 'Mullaitivu, Sri Lanka', 'Vavuniya, Sri Lanka', 'Dambulla, Sri Lanka',
            'Hatton, Sri Lanka', 'Wattala, Sri Lanka', 'Katunayake, Sri Lanka', 'Beruwala, Sri Lanka', 'Kalmunai, Sri Lanka',
            'Eravur, Sri Lanka', 'Kotikawatta, Sri Lanka', 'Homagama, Sri Lanka', 'Ja-Ela, Sri Lanka', 'Nawalapitiya, Sri Lanka',
            'Ambalangoda, Sri Lanka', 'Gampola, Sri Lanka', 'Horana, Sri Lanka', 'Kegalle, Sri Lanka', 'Kuliyapitiya, Sri Lanka',
            'Maharagama, Sri Lanka', 'Minuwangoda, Sri Lanka', 'Mount Lavinia, Sri Lanka', 'Nuwara Eliya, Sri Lanka', 'Peliyagoda, Sri Lanka',
            'Ratnapura, Sri Lanka', 'Tangalle, Sri Lanka', 'Weligama, Sri Lanka', 'Wennappuwa, Sri Lanka', 'Kilinochchi, Sri Lanka',
            'Mawanella, Sri Lanka', 'Balangoda, Sri Lanka', 'Bandarawela, Sri Lanka', 'Chavakachcheri, Sri Lanka', 'Deniyaya, Sri Lanka',
            'Embilipitiya, Sri Lanka', 'Galgamuwa, Sri Lanka', 'Haputale, Sri Lanka', 'Hatton, Sri Lanka', 'Hikkaduwa, Sri Lanka',
            'Kandana, Sri Lanka', 'Kantale, Sri Lanka', 'Kegalle, Sri Lanka', 'Kilinochchi, Sri Lanka', 'Kinniya, Sri Lanka',
            'Kuliyapitiya, Sri Lanka', 'Kurunegala, Sri Lanka', 'Mannar, Sri Lanka', 'Matale, Sri Lanka', 'Matara, Sri Lanka',
            'Monaragala, Sri Lanka', 'Mullaitivu, Sri Lanka', 'Nawalapitiya, Sri Lanka', 'Nuwara Eliya, Sri Lanka', 'Piliyandala, Sri Lanka',
            'Polonnaruwa, Sri Lanka', 'Puttalam, Sri Lanka', 'Ratnapura, Sri Lanka', 'Tangalle, Sri Lanka', 'Trincomalee, Sri Lanka',
            'Vavuniya, Sri Lanka', 'Wattala, Sri Lanka', 'Wellawaya, Sri Lanka', 'Weligama, Sri Lanka',
            // More smaller towns
            'Akkaraipattu, Sri Lanka', 'Aluthgama, Sri Lanka', 'Ambalantota, Sri Lanka', 'Ambanpola, Sri Lanka', 'Ambewela, Sri Lanka',
            'Ampara, Sri Lanka', 'Anamaduwa, Sri Lanka', 'Angoda, Sri Lanka', 'Angunakolapelessa, Sri Lanka', 'Arachchikattuwa, Sri Lanka',
            'Athurugiriya, Sri Lanka', 'Avissawella, Sri Lanka', 'Baddegama, Sri Lanka', 'Badulla, Sri Lanka', 'Balapitiya, Sri Lanka',
            'Beliatta, Sri Lanka', 'Bentota, Sri Lanka', 'Boralesgamuwa, Sri Lanka', 'Bulathsinhala, Sri Lanka', 'Chenkalady, Sri Lanka',
            'Chilaw, Sri Lanka', 'Chunnakam, Sri Lanka', 'Dikwella, Sri Lanka', 'Divulapitiya, Sri Lanka', 'Dompe, Sri Lanka',
            'Eheliyagoda, Sri Lanka', 'Elpitiya, Sri Lanka', 'Galagedara, Sri Lanka', 'Galenbindunuwewa, Sri Lanka', 'Gallella, Sri Lanka',
            'Gampaha, Sri Lanka', 'Giriulla, Sri Lanka', 'Godakawela, Sri Lanka', 'Gonapola, Sri Lanka', 'Habarana, Sri Lanka',
            'Hali-Ela, Sri Lanka', 'Hambegamuwa, Sri Lanka', 'Hanwella, Sri Lanka', 'Hapugastalawa, Sri Lanka', 'Hingurakgoda, Sri Lanka',
            'Hingurana, Sri Lanka', 'Horowpathana, Sri Lanka', 'Ibbagamuwa, Sri Lanka', 'Ingiriya, Sri Lanka', 'Ja-Ela, Sri Lanka',
            'Kadawatha, Sri Lanka', 'Kahatagasdigiliya, Sri Lanka', 'Kakkapalliya, Sri Lanka', 'Kalawana, Sri Lanka', 'Kamburupitiya, Sri Lanka',
            'Kandana, Sri Lanka', 'Kandapola, Sri Lanka', 'Kantale, Sri Lanka', 'Karainagar, Sri Lanka', 'Karapitiya, Sri Lanka',
            'Kattankudy, Sri Lanka', 'Kebithigollewa, Sri Lanka', 'Kelaniya, Sri Lanka', 'Kesbewa, Sri Lanka', 'Kilinochchi, Sri Lanka',
            'Kiribathgoda, Sri Lanka', 'Kiriella, Sri Lanka', 'Kithulgala, Sri Lanka', 'Kochchikade, Sri Lanka', 'Koggala, Sri Lanka',
            'Kolonnawa, Sri Lanka', 'Kosgama, Sri Lanka', 'Kuliyapitiya, Sri Lanka', 'Kundasale, Sri Lanka', 'Kurunegala, Sri Lanka',
            'Madampe, Sri Lanka', 'Maddawala, Sri Lanka', 'Madhu, Sri Lanka', 'Madurankuliya, Sri Lanka', 'Mahiyanganaya, Sri Lanka',
            'Makandura, Sri Lanka', 'Mannar, Sri Lanka', 'Maradana, Sri Lanka', 'Marawila, Sri Lanka', 'Matugama, Sri Lanka',
            'Medawachchiya, Sri Lanka', 'Melsiripura, Sri Lanka', 'Mihintale, Sri Lanka', 'Minuwangoda, Sri Lanka', 'Mirigama, Sri Lanka',
            'Mirissa, Sri Lanka', 'Monaragala, Sri Lanka', 'Moragahahena, Sri Lanka', 'Moratuwa, Sri Lanka', 'Mount Lavinia, Sri Lanka',
            'Mullaitivu, Sri Lanka', 'Muruthawela, Sri Lanka', 'Nattandiya, Sri Lanka', 'Nawalapitiya, Sri Lanka', 'Nawinna, Sri Lanka',
            'Neluwa, Sri Lanka', 'Nittambuwa, Sri Lanka', 'Nochchiyagama, Sri Lanka', 'Nugegoda, Sri Lanka', 'Nuwara Eliya, Sri Lanka',
            'Padukka, Sri Lanka', 'Pannala, Sri Lanka', 'Panadura, Sri Lanka', 'Pannipitiya, Sri Lanka', 'Passara, Sri Lanka',
            'Pelmadulla, Sri Lanka', 'Peliyagoda, Sri Lanka', 'Peradeniya, Sri Lanka', 'Pilimathalawa, Sri Lanka', 'Piliyandala, Sri Lanka',
            'Pitigala, Sri Lanka', 'Polgahawela, Sri Lanka', 'Polonnaruwa, Sri Lanka', 'Pothuhera, Sri Lanka', 'Pugoda, Sri Lanka',
            'Puttalam, Sri Lanka', 'Ragama, Sri Lanka', 'Rambukkana, Sri Lanka', 'Rathgama, Sri Lanka', 'Ratnapura, Sri Lanka',
            'Ruwanwella, Sri Lanka', 'Seeduwa, Sri Lanka', 'Siyambalanduwa, Sri Lanka', 'Talawakelle, Sri Lanka', 'Teldeniya, Sri Lanka',
            'Thalawathugoda, Sri Lanka', 'Thambuththegama, Sri Lanka', 'Thihagoda, Sri Lanka', 'Thirappane, Sri Lanka', 'Thissamaharama, Sri Lanka',
            'Tissamaharama, Sri Lanka', 'Trincomalee, Sri Lanka', 'Udawalawe, Sri Lanka', 'Uhana, Sri Lanka', 'Ukuwela, Sri Lanka',
            'Uragasmanhandiya, Sri Lanka', 'Vakarai, Sri Lanka', 'Valachchenai, Sri Lanka', 'Vavuniya, Sri Lanka', 'Wadduwa, Sri Lanka',
            'Wadduwa, Sri Lanka', 'Wariyapola, Sri Lanka', 'Warakapola, Sri Lanka', 'Wattala, Sri Lanka', 'Weligama, Sri Lanka',
            'Wellawaya, Sri Lanka', 'Wennappuwa, Sri Lanka', 'Yakkala, Sri Lanka',
            // United States cities
            'New York, United States', 'Los Angeles, United States', 'Chicago, United States', 'Houston, United States',
            'Phoenix, United States', 'Philadelphia, United States', 'San Antonio, United States', 'San Diego, United States',
            'Dallas, United States', 'San Jose, United States', 'Austin, United States', 'Jacksonville, United States',
            'Fort Worth, United States', 'Columbus, United States', 'Charlotte, United States', 'San Francisco, United States',
            'Indianapolis, United States', 'Seattle, United States', 'Denver, United States', 'Washington, United States',
            'Boston, United States', 'El Paso, United States', 'Nashville, United States', 'Detroit, United States',
            'Oklahoma City, United States', 'Portland, United States', 'Las Vegas, United States', 'Memphis, United States',
            'Louisville, United States', 'Baltimore, United States', 'Milwaukee, United States', 'Albuquerque, United States',
            'Tucson, United States', 'Fresno, United States', 'Sacramento, United States', 'Mesa, United States',
            'Kansas City, United States', 'Atlanta, United States', 'Long Beach, United States', 'Colorado Springs, United States',
            'Raleigh, United States', 'Miami, United States', 'Virginia Beach, United States', 'Omaha, United States',
            'Oakland, United States', 'Minneapolis, United States', 'Tulsa, United States', 'Arlington, United States',
            'Tampa, United States', 'New Orleans, United States', 'Wichita, United States', 'Cleveland, United States',
            'Bakersfield, United States', 'Aurora, United States', 'Anaheim, United States', 'Honolulu, United States',
            'Santa Ana, United States', 'Corpus Christi, United States', 'Riverside, United States', 'Lexington, United States',
            'Stockton, United States', 'Henderson, United States', 'Saint Paul, United States', 'St. Louis, United States',
            'St. Petersburg, United States', 'Cincinnati, United States', 'Pittsburgh, United States', 'Anchorage, United States',
            'Greensboro, United States', 'Plano, United States', 'Newark, United States', 'Lincoln, United States',
            'Orlando, United States', 'Irvine, United States', 'Durham, United States', 'Chula Vista, United States',
            'Jersey City, United States', 'Chandler, United States', 'Madison, United States', 'Laredo, United States',
            'Lubbock, United States', 'Scottsdale, United States', 'Reno, United States', 'Buffalo, United States',
            'Gilbert, United States', 'Glendale, United States', 'North Las Vegas, United States', 'Winston-Salem, United States',
            'Chesapeake, United States', 'Norfolk, United States', 'Fremont, United States', 'Garland, United States',
            'Irving, United States', 'Hialeah, United States', 'Richmond, United States', 'Boise, United States',
            'Spokane, United States', 'Baton Rouge, United States', 'Tacoma, United States', 'San Bernardino, United States',
            'Grand Rapids, United States', 'Huntsville, United States', 'Salt Lake City, United States', 'Yonkers, United States',
            // American State Towns
            'Montgomery, Alabama', 'Birmingham, Alabama', 'Huntsville, Alabama', 'Mobile, Alabama', 'Tuscaloosa, Alabama', 'Auburn, Alabama', 'Dothan, Alabama', 'Decatur, Alabama', 'Madison, Alabama', 'Florence, Alabama',
            'Anchorage, Alaska', 'Fairbanks, Alaska', 'Juneau, Alaska', 'Sitka, Alaska', 'Ketchikan, Alaska', 'Kodiak, Alaska', 'Bethel, Alaska', 'Palmer, Alaska', 'Kenai, Alaska', 'Kodiak, Alaska',
            'Phoenix, Arizona', 'Tucson, Arizona', 'Mesa, Arizona', 'Chandler, Arizona', 'Scottsdale, Arizona', 'Glendale, Arizona', 'Gilbert, Arizona', 'Tempe, Arizona', 'Peoria, Arizona', 'Surprise, Arizona',
            'Little Rock, Arkansas', 'Fort Smith, Arkansas', 'Fayetteville, Arkansas', 'Springdale, Arkansas', 'Jonesboro, Arkansas', 'North Little Rock, Arkansas', 'Conway, Arkansas', 'Rogers, Arkansas', 'Pine Bluff, Arkansas', 'Bentonville, Arkansas',
            'Sacramento, California', 'Los Angeles, California', 'San Diego, California', 'San Jose, California', 'San Francisco, California', 'Fresno, California', 'Long Beach, California', 'Oakland, California', 'Bakersfield, California', 'Anaheim, California',
            'Denver, Colorado', 'Colorado Springs, Colorado', 'Aurora, Colorado', 'Fort Collins, Colorado', 'Lakewood, Colorado', 'Thornton, Colorado', 'Arvada, Colorado', 'Westminster, Colorado', 'Pueblo, Colorado', 'Boulder, Colorado',
            'Hartford, Connecticut', 'Bridgeport, Connecticut', 'Stamford, Connecticut', 'New Haven, Connecticut', 'Waterbury, Connecticut', 'Norwalk, Connecticut', 'Danbury, Connecticut', 'New Britain, Connecticut', 'Bristol, Connecticut', 'Meriden, Connecticut',
            'Dover, Delaware', 'Wilmington, Delaware', 'Newark, Delaware', 'Middletown, Delaware', 'Smyrna, Delaware', 'Milford, Delaware', 'Seaford, Delaware', 'Georgetown, Delaware', 'Elsmere, Delaware', 'New Castle, Delaware',
            'Tallahassee, Florida', 'Jacksonville, Florida', 'Miami, Florida', 'Tampa, Florida', 'Orlando, Florida', 'St. Petersburg, Florida', 'Hialeah, Florida', 'Tampa, Florida', 'Fort Lauderdale, Florida', 'Port St. Lucie, Florida',
            'Atlanta, Georgia', 'Augusta, Georgia', 'Columbus, Georgia', 'Macon, Georgia', 'Savannah, Georgia', 'Athens, Georgia', 'Sandy Springs, Georgia', 'Roswell, Georgia', 'Albany, Georgia', 'Warner Robins, Georgia',
            'Honolulu, Hawaii', 'Hilo, Hawaii', 'Kailua, Hawaii', 'Kapolei, Hawaii', 'Kaneohe, Hawaii', 'Mililani Town, Hawaii', 'Ewa Gentry, Hawaii', 'Kihei, Hawaii', 'Makakilo, Hawaii', 'Wahiawa, Hawaii',
            'Boise, Idaho', 'Meridian, Idaho', 'Nampa, Idaho', 'Idaho Falls, Idaho', 'Pocatello, Idaho', 'Caldwell, Idaho', 'Coeur d\'Alene, Idaho', 'Twin Falls, Idaho', 'Lewiston, Idaho', 'Post Falls, Idaho',
            'Springfield, Illinois', 'Chicago, Illinois', 'Aurora, Illinois', 'Rockford, Illinois', 'Joliet, Illinois', 'Naperville, Illinois', 'Springfield, Illinois', 'Peoria, Illinois', 'Elgin, Illinois', 'Waukegan, Illinois',
            'Indianapolis, Indiana', 'Fort Wayne, Indiana', 'Evansville, Indiana', 'South Bend, Indiana', 'Carmel, Indiana', 'Bloomington, Indiana', 'Fishers, Indiana', 'Hammond, Indiana', 'Gary, Indiana', 'Lafayette, Indiana',
            'Des Moines, Iowa', 'Cedar Rapids, Iowa', 'Davenport, Iowa', 'Sioux City, Iowa', 'Iowa City, Iowa', 'Waterloo, Iowa', 'Ames, Iowa', 'West Des Moines, Iowa', 'Council Bluffs, Iowa', 'Dubuque, Iowa',
            'Topeka, Kansas', 'Wichita, Kansas', 'Overland Park, Kansas', 'Kansas City, Kansas', 'Olathe, Kansas', 'Lawrence, Kansas', 'Shawnee, Kansas', 'Manhattan, Kansas', 'Lenexa, Kansas', 'Salina, Kansas',
            'Frankfort, Kentucky', 'Louisville, Kentucky', 'Lexington, Kentucky', 'Bowling Green, Kentucky', 'Owensboro, Kentucky', 'Covington, Kentucky', 'Richmond, Kentucky', 'Georgetown, Kentucky', 'Florence, Kentucky', 'Elizabethtown, Kentucky',
            'Baton Rouge, Louisiana', 'New Orleans, Louisiana', 'Shreveport, Louisiana', 'Lafayette, Louisiana', 'Lake Charles, Louisiana', 'Kenner, Louisiana', 'Bossier City, Louisiana', 'Monroe, Louisiana', 'Alexandria, Louisiana', 'Houma, Louisiana',
            'Augusta, Maine', 'Portland, Maine', 'Lewiston, Maine', 'Bangor, Maine', 'Auburn, Maine', 'Biddeford, Maine', 'Sanford, Maine', 'Brunswick, Maine', 'Westbrook, Maine', 'Waterville, Maine',
            'Annapolis, Maryland', 'Baltimore, Maryland', 'Frederick, Maryland', 'Rockville, Maryland', 'Gaithersburg, Maryland', 'Bowie, Maryland', 'Hagerstown, Maryland', 'Annapolis, Maryland', 'College Park, Maryland', 'Salisbury, Maryland',
            'Boston, Massachusetts', 'Worcester, Massachusetts', 'Springfield, Massachusetts', 'Lowell, Massachusetts', 'Cambridge, Massachusetts', 'New Bedford, Massachusetts', 'Brockton, Massachusetts', 'Quincy, Massachusetts', 'Lynn, Massachusetts', 'Fall River, Massachusetts',
            'Lansing, Michigan', 'Detroit, Michigan', 'Grand Rapids, Michigan', 'Warren, Michigan', 'Sterling Heights, Michigan', 'Ann Arbor, Michigan', 'Lansing, Michigan', 'Flint, Michigan', 'Dearborn, Michigan', 'Livonia, Michigan',
            'Saint Paul, Minnesota', 'Minneapolis, Minnesota', 'Rochester, Minnesota', 'Duluth, Minnesota', 'Bloomington, Minnesota', 'Brooklyn Park, Minnesota', 'Plymouth, Minnesota', 'St. Cloud, Minnesota', 'Eagan, Minnesota', 'Woodbury, Minnesota',
            'Jackson, Mississippi', 'Jackson, Mississippi', 'Gulfport, Mississippi', 'Southaven, Mississippi', 'Hattiesburg, Mississippi', 'Biloxi, Mississippi', 'Meridian, Mississippi', 'Tupelo, Mississippi', 'Greenville, Mississippi', 'Horn Lake, Mississippi',
            'Jefferson City, Missouri', 'Kansas City, Missouri', 'St. Louis, Missouri', 'Springfield, Missouri', 'Columbia, Missouri', 'Independence, Missouri', 'Lee\'s Summit, Missouri', 'O\'Fallon, Missouri', 'St. Joseph, Missouri', 'St. Charles, Missouri',
            'Helena, Montana', 'Billings, Montana', 'Missoula, Montana', 'Great Falls, Montana', 'Bozeman, Montana', 'Butte, Montana', 'Helena, Montana', 'Kalispell, Montana', 'Havre, Montana', 'Anaconda, Montana',
            'Lincoln, Nebraska', 'Omaha, Nebraska', 'Lincoln, Nebraska', 'Bellevue, Nebraska', 'Grand Island, Nebraska', 'Kearney, Nebraska', 'Fremont, Nebraska', 'Hastings, Nebraska', 'Norfolk, Nebraska', 'Columbus, Nebraska',
            'Carson City, Nevada', 'Las Vegas, Nevada', 'Henderson, Nevada', 'Reno, Nevada', 'North Las Vegas, Nevada', 'Sparks, Nevada', 'Carson City, Nevada', 'Fernley, Nevada', 'Elko, Nevada', 'Mesquite, Nevada',
            'Concord, New Hampshire', 'Manchester, New Hampshire', 'Nashua, New Hampshire', 'Concord, New Hampshire', 'Dover, New Hampshire', 'Rochester, New Hampshire', 'Keene, New Hampshire', 'Derry, New Hampshire', 'Portsmouth, New Hampshire', 'Laconia, New Hampshire',
            'Trenton, New Jersey', 'Newark, New Jersey', 'Jersey City, New Jersey', 'Paterson, New Jersey', 'Elizabeth, New Jersey', 'Edison, New Jersey', 'Woodbridge, New Jersey', 'Lakewood, New Jersey', 'Toms River, New Jersey', 'Hamilton, New Jersey',
            'Santa Fe, New Mexico', 'Albuquerque, New Mexico', 'Las Cruces, New Mexico', 'Rio Rancho, New Mexico', 'Santa Fe, New Mexico', 'Roswell, New Mexico', 'Farmington, New Mexico', 'South Valley, New Mexico', 'Clovis, New Mexico', 'Hobbs, New Mexico',
            'Albany, New York', 'New York, New York', 'Buffalo, New York', 'Rochester, New York', 'Yonkers, New York', 'Syracuse, New York', 'Albany, New York', 'New Rochelle, New York', 'Mount Vernon, New York', 'Schenectady, New York',
            'Raleigh, North Carolina', 'Charlotte, North Carolina', 'Raleigh, North Carolina', 'Greensboro, North Carolina', 'Durham, North Carolina', 'Winston-Salem, North Carolina', 'Fayetteville, North Carolina', 'Cary, North Carolina', 'Wilmington, North Carolina', 'High Point, North Carolina',
            'Bismarck, North Dakota', 'Fargo, North Dakota', 'Bismarck, North Dakota', 'Grand Forks, North Dakota', 'Minot, North Dakota', 'West Fargo, North Dakota', 'Williston, North Dakota', 'Dickinson, North Dakota', 'Mandan, North Dakota', 'Jamestown, North Dakota',
            'Columbus, Ohio', 'Columbus, Ohio', 'Cleveland, Ohio', 'Cincinnati, Ohio', 'Toledo, Ohio', 'Akron, Ohio', 'Dayton, Ohio', 'Parma, Ohio', 'Canton, Ohio', 'Lorain, Ohio',
            'Oklahoma City, Oklahoma', 'Oklahoma City, Oklahoma', 'Tulsa, Oklahoma', 'Norman, Oklahoma', 'Broken Arrow, Oklahoma', 'Lawton, Oklahoma', 'Edmond, Oklahoma', 'Moore, Oklahoma', 'Midwest City, Oklahoma', 'Enid, Oklahoma',
            'Salem, Oregon', 'Portland, Oregon', 'Salem, Oregon', 'Eugene, Oregon', 'Gresham, Oregon', 'Hillsboro, Oregon', 'Beaverton, Oregon', 'Bend, Oregon', 'Medford, Oregon', 'Springfield, Oregon',
            'Harrisburg, Pennsylvania', 'Philadelphia, Pennsylvania', 'Pittsburgh, Pennsylvania', 'Allentown, Pennsylvania', 'Erie, Pennsylvania', 'Reading, Pennsylvania', 'Scranton, Pennsylvania', 'Bethlehem, Pennsylvania', 'Lancaster, Pennsylvania', 'Harrisburg, Pennsylvania',
            'Providence, Rhode Island', 'Providence, Rhode Island', 'Warwick, Rhode Island', 'Cranston, Rhode Island', 'Pawtucket, Rhode Island', 'East Providence, Rhode Island', 'Woonsocket, Rhode Island', 'Coventry, Rhode Island', 'Cumberland, Rhode Island', 'North Providence, Rhode Island',
            'Columbia, South Carolina', 'Columbia, South Carolina', 'Charleston, South Carolina', 'North Charleston, South Carolina', 'Mount Pleasant, South Carolina', 'Rock Hill, South Carolina', 'Greenville, South Carolina', 'Summerville, South Carolina', 'Sumter, South Carolina', 'Hilton Head Island, South Carolina',
            'Pierre, South Dakota', 'Sioux Falls, South Dakota', 'Rapid City, South Dakota', 'Aberdeen, South Dakota', 'Brookings, South Dakota', 'Watertown, South Dakota', 'Mitchell, South Dakota', 'Yankton, South Dakota', 'Pierre, South Dakota', 'Huron, South Dakota',
            'Nashville, Tennessee', 'Nashville, Tennessee', 'Memphis, Tennessee', 'Knoxville, Tennessee', 'Chattanooga, Tennessee', 'Clarksville, Tennessee', 'Murfreesboro, Tennessee', 'Franklin, Tennessee', 'Jackson, Tennessee', 'Johnson City, Tennessee',
            'Austin, Texas', 'Houston, Texas', 'San Antonio, Texas', 'Dallas, Texas', 'Austin, Texas', 'Fort Worth, Texas', 'El Paso, Texas', 'Arlington, Texas', 'Corpus Christi, Texas', 'Plano, Texas',
            'Salt Lake City, Utah', 'Salt Lake City, Utah', 'West Valley City, Utah', 'Provo, Utah', 'West Jordan, Utah', 'Orem, Utah', 'Sandy, Utah', 'Ogden, Utah', 'St. George, Utah', 'Layton, Utah',
            'Montpelier, Vermont', 'Burlington, Vermont', 'South Burlington, Vermont', 'Rutland, Vermont', 'Barre, Vermont', 'Montpelier, Vermont', 'Winooski, Vermont', 'St. Albans, Vermont', 'Newport, Vermont', 'Vergennes, Vermont',
            'Richmond, Virginia', 'Virginia Beach, Virginia', 'Norfolk, Virginia', 'Chesapeake, Virginia', 'Richmond, Virginia', 'Arlington, Virginia', 'Newport News, Virginia', 'Alexandria, Virginia', 'Hampton, Virginia', 'Roanoke, Virginia',
            'Olympia, Washington', 'Seattle, Washington', 'Spokane, Washington', 'Tacoma, Washington', 'Vancouver, Washington', 'Bellevue, Washington', 'Kent, Washington', 'Everett, Washington', 'Renton, Washington', 'Yakima, Washington',
            'Charleston, West Virginia', 'Charleston, West Virginia', 'Huntington, West Virginia', 'Parkersburg, West Virginia', 'Morgantown, West Virginia', 'Wheeling, West Virginia', 'Weirton, West Virginia', 'Fairmont, West Virginia', 'Martinsburg, West Virginia', 'Beckley, West Virginia',
            'Madison, Wisconsin', 'Milwaukee, Wisconsin', 'Madison, Wisconsin', 'Green Bay, Wisconsin', 'Kenosha, Wisconsin', 'Racine, Wisconsin', 'Appleton, Wisconsin', 'Waukesha, Wisconsin', 'Oshkosh, Wisconsin', 'Eau Claire, Wisconsin',
            'Cheyenne, Wyoming', 'Cheyenne, Wyoming', 'Casper, Wyoming', 'Laramie, Wyoming', 'Gillette, Wyoming', 'Rock Springs, Wyoming', 'Sheridan, Wyoming', 'Green River, Wyoming', 'Evanston, Wyoming', 'Riverton, Wyoming',
            'London, United Kingdom', 'Birmingham, United Kingdom', 'Leeds, United Kingdom', 'Glasgow, United Kingdom',
            'Sheffield, United Kingdom', 'Bradford, United Kingdom', 'Edinburgh, United Kingdom', 'Liverpool, United Kingdom',
            'Manchester, United Kingdom', 'Bristol, United Kingdom', 'Wakefield, United Kingdom', 'Cardiff, United Kingdom',
            'Coventry, United Kingdom', 'Nottingham, United Kingdom', 'Leicester, United Kingdom', 'Sunderland, United Kingdom',
            'Belfast, United Kingdom', 'Newcastle upon Tyne, United Kingdom', 'Brighton, United Kingdom', 'Hull, United Kingdom',
            'Plymouth, United Kingdom', 'Stoke-on-Trent, United Kingdom', 'Wolverhampton, United Kingdom', 'Derby, United Kingdom',
            'Swansea, United Kingdom', 'Southampton, United Kingdom', 'Aberdeen, United Kingdom', 'Westminster, United Kingdom',
            'Portsmouth, United Kingdom', 'York, United Kingdom', 'Peterborough, United Kingdom', 'Dundee, United Kingdom',
            'Lancaster, United Kingdom', 'Oxford, United Kingdom', 'Newport, United Kingdom', 'Preston, United Kingdom',
            'Salisbury, United Kingdom', 'Bath, United Kingdom', 'Cambridge, United Kingdom', 'Canterbury, United Kingdom',
            'Chester, United Kingdom', 'Durham, United Kingdom', 'Exeter, United Kingdom', 'Gloucester, United Kingdom',
            'Hereford, United Kingdom', 'Kingston upon Hull, United Kingdom', 'Lincoln, United Kingdom', 'Norwich, United Kingdom',
            'Ripon, United Kingdom', 'Salford, United Kingdom', 'St Albans, United Kingdom', 'Truro, United Kingdom',
            'Wells, United Kingdom', 'Winchester, United Kingdom', 'Worcester, United Kingdom', 'Paris, France',
            'Marseille, France', 'Lyon, France', 'Toulouse, France', 'Nice, France', 'Nantes, France',
            'Strasbourg, France', 'Montpellier, France', 'Bordeaux, France', 'Lille, France', 'Rennes, France',
            'Reims, France', 'Le Havre, France', 'Saint-Étienne, France', 'Toulon, France', 'Angers, France',
            'Grenoble, France', 'Dijon, France', 'Nîmes, France', 'Saint-Denis, France', 'Villeurbanne, France',
            'Le Mans, France', 'Aix-en-Provence, France', 'Brest, France',
            // Italy cities
            'Rome, Italy', 'Milan, Italy', 'Naples, Italy', 'Turin, Italy', 'Palermo, Italy', 'Genoa, Italy', 'Bologna, Italy', 'Florence, Italy', 'Bari, Italy', 'Catania, Italy', 'Venice, Italy', 'Verona, Italy', 'Messina, Italy', 'Padua, Italy', 'Trieste, Italy', 'Taranto, Italy', 'Brescia, Italy', 'Prato, Italy', 'Parma, Italy', 'Modena, Italy', 'Reggio Calabria, Italy', 'Reggio Emilia, Italy', 'Perugia, Italy', 'Livorno, Italy', 'Ravenna, Italy', 'Cagliari, Italy', 'Foggia, Italy', 'Rimini, Italy', 'Salerno, Italy', 'Ferrara, Italy', 'Sassari, Italy', 'Latina, Italy', 'Giugliano in Campania, Italy', 'Monza, Italy', 'Siracusa, Italy', 'Pescara, Italy', 'Bergamo, Italy', 'Forlì, Italy', 'Trento, Italy', 'Vicenza, Italy', 'Terni, Italy', 'Bolzano, Italy', 'Novara, Italy', 'Piacenza, Italy', 'Ancona, Italy', 'Andria, Italy', 'Udine, Italy', 'Arezzo, Italy', 'Cesena, Italy', 'Lecce, Italy', 'Pesaro, Italy', 'Barletta, Italy', 'Alessandria, Italy', 'La Spezia, Italy', 'Pistoia, Italy', 'Pisa, Italy', 'Catanzaro, Italy', 'Lucca, Italy', 'Brindisi, Italy', 'Torre del Greco, Italy', 'Como, Italy', 'Treviso, Italy', 'Busto Arsizio, Italy', 'Marsala, Italy', 'Varese, Italy', 'Sesto San Giovanni, Italy', 'Guidonia Montecelio, Italy', 'Altamura, Italy', 'Cosenza, Italy', 'Potenza, Italy', 'Castellammare di Stabia, Italy', 'Afragola, Italy', 'Casoria, Italy', 'Vittoria, Italy', 'Crotone, Italy', 'Ragusa, Italy', 'Caltanissetta, Italy', 'Vigevano, Italy', 'Cava de\' Tirreni, Italy', 'Massa, Italy', 'Carrara, Italy', 'Trapani, Italy', 'L\'Aquila, Italy', 'Cinisello Balsamo, Italy', 'Carpi, Italy', 'Imola, Italy', 'Pavia, Italy', 'Cremona, Italy', 'Altamura, Italy', 'Molfetta, Italy', 'Lamezia Terme, Italy', 'Bitonto, Italy', 'Vercelli, Italy', 'Scafati, Italy', 'Sanremo, Italy', 'Acerra, Italy', 'San Severo, Italy', 'Collegno, Italy', 'Campobasso, Italy', 'Gela, Italy', 'Quartu Sant\'Elena, Italy', 'Asti, Italy', 'Civitavecchia, Italy', 'Rho, Italy', 'Avezzano, Italy', 'Cosenza, Italy', 'Crotone, Italy', 'Viterbo, Italy', 'Ercolano, Italy', 'Portici, Italy', 'Modica, Italy', 'Moncalieri, Italy', 'Cerignola, Italy', 'Faenza, Italy', 'Manfredonia, Italy', 'Acireale, Italy', 'Bagheria, Italy', 'Castrovillari, Italy', 'Cecina, Italy', 'Cerveteri, Italy', 'Chieti, Italy', 'Civitanova Marche, Italy', 'Corigliano-Rossano, Italy', 'Empoli, Italy', 'Fano, Italy', 'Fasano, Italy', 'Foligno, Italy', 'Formia, Italy', 'Gallarate, Italy', 'Giarre, Italy', 'Grosseto, Italy', 'Ivrea, Italy', 'Lodi, Italy', 'Matera, Italy', 'Mira, Italy', 'Misterbianco, Italy', 'Montesilvano, Italy', 'Nettuno, Italy', 'Olbia, Italy', 'Oristano, Italy', 'Pomezia, Italy', 'Pozzuoli, Italy', 'Rieti, Italy', 'Rosignano Marittimo, Italy', 'San Benedetto del Tronto, Italy', 'San Giovanni Rotondo, Italy', 'San Giuliano Milanese, Italy', 'Sanluri, Italy', 'Sassuolo, Italy', 'Savigliano, Italy', 'Schio, Italy', 'Senigallia, Italy', 'Siena, Italy', 'Sora, Italy', 'Sorrento, Italy', 'Sulmona, Italy', 'Termoli, Italy', 'Tivoli, Italy', 'Torre Annunziata, Italy', 'Tortona, Italy', 'Vasto, Italy', 'Velletri, Italy', 'Verbania, Italy', 'Vibo Valentia, Italy', 'Vignola, Italy', 'Villafranca di Verona, Italy', 'Villaricca, Italy', 'Vittorio Veneto, Italy',
            // Kuwait cities
            'Kuwait City, Kuwait', 'Al Ahmadi, Kuwait', 'Hawalli, Kuwait', 'Salmiya, Kuwait', 'Al Farwaniyah, Kuwait', 'Mubarak Al-Kabeer, Kuwait', 'Al Jahra, Kuwait', 'Fahaheel, Kuwait', 'Mangaf, Kuwait', 'Abu Halifa, Kuwait', 'Sabah Al Salem, Kuwait', 'Al Fintas, Kuwait', 'Al Mahboula, Kuwait', 'Al Riggae, Kuwait', 'Al Shuwaikh, Kuwait', 'Al Salwa, Kuwait', 'Al Jabriya, Kuwait', 'Al Ardhiya, Kuwait', 'Al Egaila, Kuwait', 'Al Sulaibikhat, Kuwait',
            // Japan cities
            'Tokyo, Japan', 'Yokohama, Japan', 'Osaka, Japan', 'Nagoya, Japan', 'Sapporo, Japan', 'Fukuoka, Japan', 'Kobe, Japan', 'Kyoto, Japan',
            'Kawasaki, Japan', 'Saitama, Japan', 'Hiroshima, Japan', 'Sendai, Japan', 'Chiba, Japan',
            'Kitakyushu, Japan', 'Sakai, Japan', 'Niigata, Japan', 'Hamamatsu, Japan', 'Kumamoto, Japan',
            'Sagamihara, Japan', 'Shizuoka, Japan', 'Okayama, Japan', 'Kagoshima, Japan', 'Funabashi, Japan',
            'Matsuyama, Japan', 'Hachinohe, Japan', 'Kawaguchi, Japan', 'Ichikawa, Japan', 'Oita, Japan',
            'Fukuyama, Japan', 'Amagasaki, Japan', 'Kurashiki, Japan', 'Yokosuka, Japan', 'Nagasaki, Japan',
            'Hirakata, Japan', 'Machida, Japan', 'Gifu, Japan', 'Fujisawa, Japan', 'Toyonaka, Japan',
            'Toyohashi, Japan', 'Takamatsu, Japan', 'Shinjuku, Japan', 'Himeji, Japan', 'Asahikawa, Japan',
            'Nishinomiya, Japan', 'Utsunomiya, Japan', 'Matsudo, Japan', 'Wakayama, Japan', 'Kawagoe, Japan',
            'Koriyama, Japan', 'Tokorozawa, Japan', 'Kashiwa, Japan', 'Akita, Japan', 'Miyazaki, Japan',
            'Kochi, Japan', 'Koshigaya, Japan', 'Aomori, Japan', 'Kakogawa, Japan', 'Akashi, Japan',
            'Yokkaichi, Japan', 'Morioka, Japan', 'Yamagata, Japan', 'Maebashi, Japan', 'Fukushima, Japan',
            'Ibaraki, Japan', 'Mito, Japan', 'Sydney, Australia', 'Melbourne, Australia', 'Brisbane, Australia',
            'Perth, Australia', 'Adelaide, Australia', 'Gold Coast, Australia', 'Newcastle, Australia', 'Canberra, Australia',
            'Sunshine Coast, Australia', 'Wollongong, Australia', 'Hobart, Australia', 'Geelong, Australia',
            'Townsville, Australia', 'Cairns, Australia', 'Toowoomba, Australia', 'Darwin, Australia',
            'Ballarat, Australia', 'Bendigo, Australia', 'Albury, Australia', 'Maitland, Australia',
            'Mackay, Australia', 'Rockhampton, Australia', 'Launceston, Australia', 'Bunbury, Australia',
            'Coffs Harbour, Australia', 'Wagga Wagga, Australia', 'Hervey Bay, Australia', 'Toronto, Canada',
            'Montreal, Canada', 'Vancouver, Canada', 'Calgary, Canada', 'Edmonton, Canada', 'Ottawa, Canada',
            'Winnipeg, Canada', 'Quebec City, Canada', 'Hamilton, Canada', 'Kitchener, Canada', 'London, Canada',
            'Victoria, Canada', 'Halifax, Canada', 'Oshawa, Canada', 'Windsor, Canada', 'Saskatoon, Canada',
            'St. Catharines, Canada', 'Regina, Canada', 'St. John\'s, Canada', 'Kelowna, Canada', 'Barrie, Canada',
            'Sherbrooke, Canada', 'Guelph, Canada', 'Abbotsford, Canada', 'Kingston, Canada', 'Kanata, Canada',
            'Trois-Rivières, Canada', 'Moncton, Canada', 'Chicoutimi, Canada', 'Milton, Canada', 'Red Deer, Canada',
            'Brantford, Canada', 'Thunder Bay, Canada', 'Whitehorse, Canada', 'Nanaimo, Canada', 'Sudbury, Canada',
            'Lethbridge, Canada', 'Saint-Jean-sur-Richelieu, Canada', 'Peterborough, Canada', 'Kamloops, Canada',
            'Saint-Jérôme, Canada', 'Chilliwack, Canada', 'Sault Ste. Marie, Canada', 'Prince George, Canada',
            'Medicine Hat, Canada', 'Drummondville, Canada', 'Saint John, Canada', 'Fredericton, Canada',
            'Grande Prairie, Canada', 'Saint-Georges, Canada', 'Berlin, Germany', 'Hamburg, Germany',
            'Munich, Germany', 'Cologne, Germany', 'Frankfurt, Germany', 'Stuttgart, Germany', 'Düsseldorf, Germany',
            'Dortmund, Germany', 'Essen, Germany', 'Leipzig, Germany', 'Bremen, Germany', 'Dresden, Germany',
            'Hannover, Germany', 'Nuremberg, Germany', 'Duisburg, Germany', 'Bochum, Germany', 'Wuppertal, Germany',
            'Bielefeld, Germany', 'Bonn, Germany', 'Mannheim, Germany', 'Karlsruhe, Germany', 'Wiesbaden, Germany',
            'Münster, Germany', 'Gelsenkirchen, Germany', 'Aachen, Germany', 'Braunschweig, Germany', 'Chemnitz, Germany',
            'Kiel, Germany', 'Halle, Germany', 'Magdeburg, Germany', 'Freiburg, Germany', 'Krefeld, Germany',
            'Mainz, Germany', 'Lübeck, Germany', 'Erfurt, Germany', 'Oberhausen, Germany', 'Rostock, Germany',
            'Kassel, Germany', 'Potsdam, Germany', 'Saarbrücken, Germany', 'Mülheim, Germany', 'Ludwigshafen, Germany',
            'Leverkusen, Germany', 'Oldenburg, Germany', 'Osnabrück, Germany', 'Solingen, Germany', 'Herne, Germany',
            'Neuss, Germany', 'Darmstadt, Germany', 'Paderborn, Germany', 'Regensburg, Germany',
            'Ingolstadt, Germany', 'Würzburg, Germany', 'Fürth, Germany', 'Moscow, Russia', 'Saint Petersburg, Russia',
            'Novosibirsk, Russia', 'Yekaterinburg, Russia', 'Kazan, Russia', 'Nizhny Novgorod, Russia', 'Chelyabinsk, Russia',
            'Samara, Russia', 'Omsk, Russia', 'Rostov-on-Don, Russia', 'Ufa, Russia', 'Krasnoyarsk, Russia',
            'Perm, Russia', 'Voronezh, Russia', 'Volgograd, Russia', 'Krasnodar, Russia', 'Saratov, Russia',
            'Tyumen, Russia', 'Tolyatti, Russia', 'Izhevsk, Russia', 'Barnaul, Russia', 'Ulyanovsk, Russia',
            'Irkutsk, Russia', 'Khabarovsk, Russia', 'Yaroslavl, Russia', 'Vladivostok, Russia', 'Makhachkala, Russia',
            'Tomsk, Russia', 'Orenburg, Russia', 'Kemerovo, Russia', 'Novokuznetsk, Russia', 'Ryazan, Russia',
            'Astrakhan, Russia', 'Naberezhnye Chelny, Russia', 'Penza, Russia', 'Lipetsk, Russia', 'Kirov, Russia',
            'Cheboksary, Russia', 'Tula, Russia', 'Kaliningrad, Russia', 'Balashikha, Russia', 'Ulan-Ude, Russia',
            'Arkhangelsk, Russia', 'Stavropol, Russia', 'Kurgan, Russia', 'Sochi, Russia', 'Vladikavkaz, Russia',
            'Grozny, Russia', 'Kaluga, Russia', 'Smolensk, Russia', 'Vladimir, Russia', 'Chita, Russia',
            'Saransk, Russia', 'Vologda, Russia'
        ];

        const filteredCities = allCities
            .filter(city => city.toLowerCase().includes(query.toLowerCase()))
            .slice(0, 8);
        
        setSuggestions(filteredCities);
        setShowSuggestions(filteredCities.length > 0);
    };

    // Debounced search for suggestions
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchSuggestions(city);
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [city]);

    const handleCitySelect = (selectedCity) => {
        setCity(selectedCity);
        setShowSuggestions(false);
        setSuggestions([]);
        setIsCitySelected(true);
        // Automatically search for the selected city
        searchCity(selectedCity);
    };

    // Reset the selected flag when user starts typing
    const handleInputChange = (e) => {
        const value = e.target.value;
        setCity(value);
        if (isCitySelected) {
            setIsCitySelected(false);
        }
    };

    const handleClear = () => {
        setCity("");
        setWeather(null);
        setError(null);
        setSuggestions([]);
        setShowSuggestions(false);
        setIsCitySelected(false);
    };

    const searchCity = async (cityName) => {
        try {
            // Txchis will use the Railway URL on Vercel, and fallback to localhost for your local testing
            const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
            const response = await axios.get(`${API_BASE_URL}/api/weather/${cityName}`);
            setWeather(response.data);
            setError(null);
        } catch (error) {
            console.log("Error fetching weather: ", error);
            setWeather(null);
            setError("City not found. Please enter a valid city.");
        }
    };

    const handleSearch = async () => {
        searchCity(city);
    };

    // ✅ Only show alert when error is set
    useEffect(() => {
        if (error) {
            alert(error);
            setError(null);
        }
    }, [error]);

    return (
        <div style={{ textAlign: "center", padding: "2rem" }}>

            <h1 style={{ marginBottom: "3rem" }}>Weather Search</h1>

            <div style={{ 
                maxWidth: "300px", 
                margin: "0 auto",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}>
                <WeatherAnimation condition={weather ? weather.condition : "idle"} />
                </div>

            {weather && (
                <div style={{marginTop: "1rem", marginBottom: "4rem"}}>
                    <h3>{capitalizeCity(weather.city)}</h3>
                    <p>Condition: {weather.condition}</p>
                    <p>Temperature: {weather.temperature}°C</p>
                    <p style={{fontSize: "0.95rem"}}>
                        H: {weather.tempMax}°C &nbsp;&nbsp; L: {weather.tempMin}°C
                    </p>
                </div>
            )}

            <div style={{position: "relative", display: "inline-block"}}>
                <input
                    type="text"
                    placeholder="Enter city"
                    value={city}
                    onChange={handleInputChange}
                    onFocus={e => e.target.select()}
                    onKeyDown={e => { if (e.key === 'Enter') handleSearch(); }}
                    style={{ 
                        height: "32px", 
                        padding: "0 12px",
                        marginRight: "8px",
                        width: "200px",
                        outline: "none",
                        boxSizing: "border-box",
                        fontSize: "1em",
                        lineHeight: "1.5",
                        verticalAlign: "top"
                    }}
                />
            
            {city && (
                <button
                    onClick={handleClear}
                    style={{
                        position: "absolute",
                        right: "8px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "16px",
                        color: "#666",
                        padding: "4px",
                        width: "20px",
                        height: "20px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = "#e0e0e0"}
                    onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
                >
                    ×
                </button>
            )}
            
            {showSuggestions && (
                <div style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    width: "224px",
                    backgroundColor: "#2b2b2b",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    maxHeight: "200px",
                    overflowY: "auto",
                    zIndex: 1000,
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                }}>
                    {suggestions.map((suggestion, index) => (
                        <div
                            key={index}
                            onClick={() => handleCitySelect(suggestion)}
                            style={{
                                padding: "8px 12px",
                                cursor: "pointer",
                                borderBottom: "1px solid #444",
                                textAlign: "left",
                                color: "#ffffff",
                                backgroundColor: "#2b2b2b"
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = "#404040"}
                            onMouseLeave={(e) => e.target.style.backgroundColor = "#2b2b2b"}
                        >
                            {capitalizeCity(suggestion)}
                        </div>
                    ))}
                </div>
            )}
            </div>
            
            <button 
                onClick={handleSearch}
                style={{
                    height: "32px",
                    padding: "0 16px",
                    margin: 0,
                    verticalAlign: "top",
                    transition: "all 0.2s ease-in-out",
                    cursor: "pointer",
                    outline: "none",
                    backgroundColor: "#2b2b2b",
                    color: "#e0e0e0",
                    border: "1px solid #444",
                    boxSizing: "border-box",
                    fontSize: "1em",
                    lineHeight: "1.5"
                }}
                onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#404040";
                    e.target.style.transform = "scale(1.05)";
                    e.target.style.boxShadow = "0 2px 8px rgba(0,0,0,0.2)";
                }}
                onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "#2b2b2b";
                    e.target.style.transform = "scale(1)";
                    e.target.style.boxShadow = "";
                }}
            >
                Search
            </button>

        </div>
    );
}
