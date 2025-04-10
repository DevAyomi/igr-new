// let HOST = "https://phpclusters-188739-0.cloudclusters.net/development_env/";
// let publitioKey1 = "ksWdvJ3JjfV5JZnHyRqv";
// let publitioKey2 = "ruxLmts4NiupnoddqVi1Z70tnoMmf5yT";

let THE_SESSION = localStorage.getItem("userSession");

// if (THE_SESSION) {
let heeaderr = "";
heeaderr += `
  <a href="index.html" class="flex gap-1 items-center">
  <div class="flex items-center">
    <img src="./assets/img/img/jigawa.png" class="w-[60px]" />
  </div>
  <p class="text-black fontBold">PayJigawa</p>
  </a>
`;
if (THE_SESSION) {
  heeaderr += `
    <div class="md:flex hidden items-center gap-5 text-[#555555]">
      <button 
        type="button" 
        class="btn btn-outline-none search-toggle" 
        data-bs-toggle="modal" 
        data-bs-target="#searchModal">
        <i class="fas fa-search"></i>
      </button>
      <div class="lg:flex gap-3 items-center">
        <a href="index.html" class="home lg:text-sm text-xs">Home</a>
        <a href="about.html" class="about lg:text-sm text-xs">About Us</a>
        <a href="eservices.html" class="eservice lg:text-sm text-xs">E-Services</a>
        <a href="offer.html" class="offer lg:text-sm text-xs">What We Offer</a>
        <a href="howtopay.html" class="howtopay lg:text-sm text-xs">How to pay</a>
        <a href="contact.html" class="contact lg:text-sm text-xs">Contact Us</a>
        <a class="button" href="./users/dashboard.html">Dashboard</a>
      </div>
    </div>
  `;
} else {
  heeaderr += `
    <div class="md:flex hidden items-center gap-3 text-[#555555]">
      <button 
        type="button" 
        class="btn btn-outline-none search-toggle" 
        data-bs-toggle="modal" 
        data-bs-target="#searchModal">
        <i class="fas fa-search"></i>
      </button>
      <div class="lg:flex hidden gap-3">
        <a href="index.html" class="home text-sm">Home</a>
        <a href="about.html" class="about text-sm">About Us</a>
        <a href="eservices.html" class="eservice lg:text-sm text-xs">E-Services</a>
        <a href="offer.html" class="offer text-sm">What We Offer</a>
        <a href="howtopay.html" class="howtopay text-sm">How to pay</a>
        <a href="contact.html" class="contact text-sm">Contact Us</a>
      </div>

      <div class="lg:flex hidden items-center gap-3">
        <a class="outline-btn border-0 login" href="signin.html">Login</a>
        <a class="button fontBold" href="./register/index.html">Register</a>
      </div>

    </div>
  `;
}

if (THE_SESSION) {
  heeaderr += `
  <div class="mobile_nav p-4 mt-4 text-dark lg:mt-7">
    <div class="flex flex-col text-left gap-3">
    <a class="button" href="./users/dashboard.html">Dashboard</a>
        <a href="index.html" class="home">Home</a>
          <a href="about.html" class="about">About Us</a>
          <a href="eservices.html" class="eservice">E-Services</a>
          <a href="offer.html" class="offer">What We Offer</a>
          <a href="howtopay.html" class="howtopay">How to pay</a>
          <a href="contact.html" class="contact">Contact Us</a>
    </div>
    <button 
        type="button" 
        class="btn btn-outline-none search-toggle" 
        data-bs-toggle="modal" 
        data-bs-target="#searchModal">
        <i class="fas fa-search"></i>
      </button>
  </div>`;
} else {
  heeaderr += `
  <div class="mobile_nav text-dark p-4 mt-4 lg:mt-7">
  <div class="flex flex-col text-left gap-3">
    <a href="index.html" class="home1">Home</a>
        <a href="about.html" class="about1">About Us</a>
        <a href="eservices.html" class="eservice">E-Services</a>
        <a href="offer.html" class="offer1">What We Offer</a>
        <a href="howtopay.html" class="howtopay1">How to pay</a>
        <a href="contact.html" class="contact1">Contact Us</a>
  </div>

    <hr class="my-3">

        <div class="flex flex-col gap-4">
          <a href="news.html" class="text-center news flex gap-3 items-center">
                <img src="./assets/img/icons/news.svg" width="20" alt="News" />  
                <p class="text-sm m-0 font-bold text-dark">News</p>
            </a>

            <a href="library.html" class="text-center library flex gap-3 items-center">
                <img src="./assets/img/icons/library.svg" width="20" alt="Library" /> 
                <p class="text-sm m-0 font-bold text-dark">Library</p>
            </a>
            <a href="gallery.html" class="text-center gallery flex gap-3 items-center">
                <img src="./assets/img/icons/gallery.svg" width="20" alt="Gallery" /> 
                <p class="text-sm m-0 font-bold text-dark">Gallery</p>
            </a>
             <a type="button" class="text-center flex gap-3 items-center" data-bs-toggle="modal" data-bs-target="#tax_calc_modal">
              <img src="./assets/img/icons/calculator.svg" width="20" alt="Calculator" /> 
              <p class="text-sm m-0 font-bold text-dark">Tax Calculator</p>
          </a>

          <a href="faqs.html" class="text-center flex gap-3 faq items-center">
              <img src="./assets/img/icons/faq.svg" width="20" alt="Calculator" /> 
              <p class="text-sm m-0 font-bold text-dark">FAQ</p>
          </a>
        </div>

  <div class="flex flex-col gap-3 mt-5">
 <a class="outline-btn border-0 login1" href="signin.html">Login</a>
        <a class="button" href="./register/index.html">Register</a>
        
      </div>

      <button 
        type="button" 
        class="btn btn-outline-none search-toggle" 
        data-bs-toggle="modal" 
        data-bs-target="#searchModal">
        <i class="fas fa-search"></i>
      </button>
</div>
  `;
}

heeaderr += `
  <div class="hamburger lg:hidden block">
    <span class="bar"></span>
    <span class="bar"></span>
    <span class="bar"></span>
  </div>
`;

$("#theHeader").html(heeaderr);

// $("#theHeader").append(`
//   <div
//      class="modal fade"
//      id="searchModal"
//      aria-labelledby="searchModalLabel"
//      aria-hidden="true">
//      <div class="modal-dialog">
//        <div class="modal-content">
//          <div class="modal-header">
//            <h5 class="modal-title" id="searchModalLabel">Search</h5>
//            <button
//              type="button"
//              class="btn-close"
//              data-bs-dismiss="modal"
//              aria-label="Close">
//            </button>
//          </div>
//          <div class="modal-body">
//            <input
//              type="text"
//              class="form-control"
//              id="searchInput"
//              placeholder="Search..." />
//            <div id="searchResults" class="mt-3"></div>
//          </div>
//        </div>
//      </div>
//    </div>
//  `);

const hamburger = document.querySelector(".hamburger");
const mobile_nav = document.querySelector(".mobile_nav");
if (hamburger) {
  hamburger.addEventListener("click", function () {
    mobile_nav.classList.toggle("active");
    hamburger.classList.toggle("active");
  });
}

function showActiveNav(thenav) {
  let navLinks = document.querySelector(`.${thenav}`);
  if (navLinks) {
    navLinks.classList.add("fontBold");
  }
}

const currentYear = new Date().getFullYear();
$("#footer").html(`
    <footer class="bg-white flex lg:flex-row flex-col-reverse gap-4 justify-between items-center md:px-10 px-3 py-2 landingFooter border-t border-gray-200">
      <div class="flex md:w-fit w-full items-center md:flex-row flex-col-reverse gap-2">
          <p class="text-[#555555] md:text-sm text-xs">Copyright ${currentYear} Primeguage Solutions Limited</p>
          <div class="flex items-center gap-1">
            <img src="./assets/img/logo1.png" class="w-[40px] h-[20px] object-contain" alt="">
            <img src="./assets/img/img/jtb.png" class="w-[40px] h-[20px] object-contain" alt="">
            <img src="./assets/img/img/ndpc.png" class="w-[50px] h-[20px] object-contain" alt="">
            <img src="./assets/img/img/pci.png" class="w-[50px] h-[20px] object-contain" alt="">
          </div>
      </div>

      <div class="xl:flex hidden items-center lg:gap-2">
        <p class="text-xs lg:block hidden text-dark font-bold">Follow us on</p>
        <a href="#"><iconify-icon icon="ph:facebook-logo-bold" class="text-sm border-l text-dark border-gray-600 pl-2"></iconify-icon></a>
        <a href="#"><iconify-icon icon="ri:twitter-line" class="text-sm border-l text-dark border-gray-600 pl-2"></iconify-icon></a>
        <a href="#"><iconify-icon icon="bi:instagram" class="text-sm border-l text-dark border-gray-600 pl-2"></iconify-icon></a>
      </div>

      <div class="flex items-center">
        <div class="md:flex hidden items-center gap-3 mr-10">
          <a href="news.html" class="text-center  flex justify-center flex-col items-center">
                <img src="./assets/img/icons/news.svg" width="22" alt="News" />  
                <p class="sm:text-[12px] md:text-sm m-0 font-bold text-dark">News</p>
            </a>

            <a href="library.html" class="text-center  flex justify-center flex-col items-center">
                <img src="./assets/img/icons/library.svg" width="22" alt="Library" /> 
                <p class="sm:text-[12px] md:text-sm m-0 font-bold text-dark">Library</p>
            </a>
            <a href="gallery.html" class="text-center  flex justify-center flex-col items-center">
                <img src="./assets/img/icons/gallery.svg" width="22" alt="Gallery" /> 
                <p class="sm:text-[12px] md:text-sm m-0 font-bold text-dark">Gallery</p>
            </a>

            <a type="button" class="text-center flex justify-center flex-col items-center" data-bs-toggle="modal" data-bs-target="#tax_calc_modal">
                <img src="./assets/img/icons/calculator.svg" width="22" alt="Calculator" /> 
                <p class="sm:text-[12px] md:text-sm m-0 font-bold text-dark">Tax Calculator</p>
            </a>
          
            <a href="faqs.html" class="text-center  flex justify-center flex-col items-center">
              <img src="./assets/img/icons/faq.svg" width="22" alt="FAQs" /> 
              <p class="sm:text-[12px] md:text-sm m-0 font-bold text-dark">FAQs</p>
            </a>
        </div>
      </div>

    </footer>
`);

$("body").append(`
        <div
          class="modal fade"
          id="tax_calc_modal"
          data-bs-backdrop="static"
          data-bs-keyboard="false"
          aria-hidden="true"
        >
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content" style="background: transparent; border: none;">
              <div class="modal-body">
                <div class="calculator-container d-flex">
                  <!-- Left sidebar with tabs -->
                  <div class="calculator-sidebar col-md-4">
                    <div class="calculator-header">Tax Calculator</div>

                    <ul class="calculator-tabs">
                      <li class="calculator-method active-method" id="paye-tab">
                        <a href="#paye"> <i class="fas fa-chess-king"></i> PAYE </a>
                      </li>
                      <li class="calculator-method" id="wht-tab">
                        <a href="#wht"> <i class="fas fa-chess-king"></i> WHT </a>
                      </li>
                    </ul>
                  </div>

                  <!-- Main calculator area -->
                  <div class="calculator-main col-sm-12 col-md-8">
                    <div class="business-header">
                      <div class="business-logo">
                        <img src="./assets/img/img/jigawa.png" width="50" />
                      </div>
                      <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      >
                        
                      </button>
                    </div>

                    <div class="calculator-mobile-sidebar">
                      <ul class="calculator-tabs">
                        <li class="calculator-method active-method" id="paye-tab">
                          <a href="#paye"> <i class="fas fa-chess-king"></i> PAYE </a>
                        </li>
                        <li class="calculator-method" id="wht-tab">
                          <a href="#wht"> <i class="fas fa-chess-king"></i> WHT </a>
                        </li>
                      </ul>
                    </div>

                    <!-- PAYE Calculator -->
                    <div id="paye" class="calculator-tab active">
                      <div class="calculator-form">
                        <div class="calculator-form-title">PAYE Calculator</div>

                        <form id="payeForm">
                          <div class="form-group">
                            <label for="payeMonthlyIncome">Annual Gross Income</label>
                            <input
                              type="number"
                              class="form-control"
                              id="payeMonthlyIncome"
                              required
                            />
                          </div>
                          <button type="submit" class="calculate-button">
                            Calculate PAYE
                          </button>
                        </form>
                        <div class="calcLoader" id="payeLoader" style="display: none"></div>
                        <div class="result" id="payeResult">
                          <div class="result-row">
                            <small>Transaction Amount:</small>
                            <span id="payeGrossIncome">₦0</span>
                          </div>
                          <button class="back-button" onclick="showForm('payeForm')">
                            Back to Form
                          </button>
                        </div>
                      </div>
                    </div>

                    <!-- Withholding Tax Calculator -->
                    <div id="wht" class="calculator-tab">
                      <div class="calculator-form">
                        <div class="calculator-form-title">Withholding Tax Calculator</div>

                        <form id="whtForm">
                          <div class="form-group mb-2">
                            <label for="whtAmount">Transaction Amount</label>
                            <input
                              type="number"
                              class="form-control"
                              id="whtAmount"
                              required
                            />
                          </div>
                          <div class="form-group mb-2">
                            <label for="transaction_type">Transaction Type</label>
                            <select
                              name="transaction_type"
                              id="transaction_type"
                              class="form-select"
                            >
                              <option value="consultancy">Consultancy</option>
                              <option value="rent">Rent</option>
                              <option value="dividends">Dividends</option>
                              <option value="construction">Construction</option>
                              <option value="commissions">Commissions</option>
                              <option value="directors_fees">Directors Fees</option>
                            </select>
                          </div>
                          <div class="form-group mb-2">
                            <label for="recipient_type">Recipient Type</label>
                            <select
                              name="recipient_type"
                              id="recipient_type"
                              class="form-select"
                            >
                              <option value="individual">Individual</option>
                              <option value="company">Company</option>
                            </select>
                          </div>
                          <button type="submit" class="calculate-button">
                            Calculate WHT
                          </button>
                        </form>
                        <div class="calcLoader" id="whtLoader" style="display: none"></div>
                        <div class="result" id="whtResult">
                          <div class="result-row">
                            <small>Transaction Amount:</small>
                            <span id="whtGrossAmount">₦0</span>
                          </div>
                          <div class="result-row">
                            <small>WHT Rate:</small>
                            <span id="whtTaxRate">₦0</span>
                          </div>
                          <div class="result-row">
                            <small>WHT Due:</small>
                            <span id="whtTaxDue">₦0</span>
                          </div>
                          <div class="result-row">
                            <small>Net Payment:</small>
                            <span id="whtNetAmount">₦0</span>
                          </div>
                          <button class="back-button" onclick="showForm('whtForm')">
                            Back to Form
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
      class="modal fade"
      id="searchModal"
      aria-labelledby="searchModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content rounded-xl">
          <div class="modal-header">
            <i class="fa fa-search mr-2"></i>
            <input
              type="text"
              class="form-control search-input"
              id="searchInput"
              placeholder="Search..."
            />
            <!-- <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button> -->
          </div>
          <div class="modal-body">
            <div id="searchResults" class="search-results"></div>
          </div>
        </div>
      </div>
    </div>
`);

let lgaList2 = {
  Abia: [
    "Aba North",
    "Aba South",
    "Arochukwu",
    "Bende",
    "Ikwuano",
    "Isiala Ngwa North",
    "Isiala Ngwa South",
    "Isuikwuato",
    "Obi Ngwa",
    "Ohafia",
    "Osisioma",
    "Ugwunagbo",
    "Ukwa East",
    "Ukwa West",
    "Umuahia North",
    "muahia South",
    "Umu Nneochi",
  ],
  Adamawa: [
    "Demsa",
    "Fufure",
    "Ganye",
    "Gayuk",
    "Gombi",
    "Grie",
    "Hong",
    "Jada",
    "Larmurde",
    "Madagali",
    "Maiha",
    "Mayo Belwa",
    "Michika",
    "Mubi North",
    "Mubi South",
    "Numan",
    "Shelleng",
    "Song",
    "Toungo",
    "Yola North",
    "Yola South",
  ],
  AkwaIbom: [
    "Abak",
    "Eastern Obolo",
    "Eket",
    "Esit Eket",
    "Essien Udim",
    "Etim Ekpo",
    "Etinan",
    "Ibeno",
    "Ibesikpo Asutan",
    "Ibiono-Ibom",
    "Ika",
    "Ikono",
    "Ikot Abasi",
    "Ikot Ekpene",
    "Ini",
    "Itu",
    "Mbo",
    "Mkpat-Enin",
    "Nsit-Atai",
    "Nsit-Ibom",
    "Nsit-Ubium",
    "Obot Akara",
    "Okobo",
    "Onna",
    "Oron",
    "Oruk Anam",
    "Udung-Uko",
    "Ukanafun",
    "Uruan",
    "Urue-Offong Oruko",
    "Uyo",
  ],
  Anambra: [
    "Aguata",
    "Anambra East",
    "Anambra West",
    "Anaocha",
    "Awka North",
    "Awka South",
    "Ayamelum",
    "Dunukofia",
    "Ekwusigo",
    "Idemili North",
    "Idemili South",
    "Ihiala",
    "Njikoka",
    "Nnewi North",
    "Nnewi South",
    "Ogbaru",
    "Onitsha North",
    "Onitsha South",
    "Orumba North",
    "Orumba South",
    "Oyi",
  ],

  Bauchi: [
    "Alkaleri",
    "Bauchi",
    "Bogoro",
    "Damban",
    "Darazo",
    "Dass",
    "Gamawa",
    "Ganjuwa",
    "Giade",
    "Itas-Gadau",
    "Jama are",
    "Katagum",
    "Kirfi",
    "Misau",
    "Ningi",
    "Shira",
    "Tafawa Balewa",
    " Toro",
    " Warji",
    " Zaki",
  ],

  Bayelsa: [
    "Brass",
    "Ekeremor",
    "Kolokuma Opokuma",
    "Nembe",
    "Ogbia",
    "Sagbama",
    "Southern Ijaw",
    "Yenagoa",
  ],
  Benue: [
    "Agatu",
    "Apa",
    "Ado",
    "Buruku",
    "Gboko",
    "Guma",
    "Gwer East",
    "Gwer West",
    "Katsina-Ala",
    "Konshisha",
    "Kwande",
    "Logo",
    "Makurdi",
    "Obi",
    "Ogbadibo",
    "Ohimini",
    "Oju",
    "Okpokwu",
    "Oturkpo",
    "Tarka",
    "Ukum",
    "Ushongo",
    "Vandeikya",
  ],
  Borno: [
    "Abadam",
    "Askira-Uba",
    "Bama",
    "Bayo",
    "Biu",
    "Chibok",
    "Damboa",
    "Dikwa",
    "Gubio",
    "Guzamala",
    "Gwoza",
    "Hawul",
    "Jere",
    "Kaga",
    "Kala-Balge",
    "Konduga",
    "Kukawa",
    "Kwaya Kusar",
    "Mafa",
    "Magumeri",
    "Maiduguri",
    "Marte",
    "Mobbar",
    "Monguno",
    "Ngala",
    "Nganzai",
    "Shani",
  ],
  "Cross River": [
    "Abi",
    "Akamkpa",
    "Akpabuyo",
    "Bakassi",
    "Bekwarra",
    "Biase",
    "Boki",
    "Calabar Municipal",
    "Calabar South",
    "Etung",
    "Ikom",
    "Obanliku",
    "Obubra",
    "Obudu",
    "Odukpani",
    "Ogoja",
    "Yakuur",
    "Yala",
  ],

  Delta: [
    "Aniocha North",
    "Aniocha South",
    "Bomadi",
    "Burutu",
    "Ethiope East",
    "Ethiope West",
    "Ika North East",
    "Ika South",
    "Isoko North",
    "Isoko South",
    "Ndokwa East",
    "Ndokwa West",
    "Okpe",
    "Oshimili North",
    "Oshimili South",
    "Patani",
    "Sapele",
    "Udu",
    "Ughelli North",
    "Ughelli South",
    "Ukwuani",
    "Uvwie",
    "Warri North",
    "Warri South",
    "Warri South West",
  ],

  Ebonyi: [
    "Abakaliki",
    "Afikpo North",
    "Afikpo South",
    "Ebonyi",
    "Ezza North",
    "Ezza South",
    "Ikwo",
    "Ishielu",
    "Ivo",
    "Izzi",
    "Ohaozara",
    "Ohaukwu",
    "Onicha",
  ],
  Edo: [
    "Akoko-Edo",
    "Egor",
    "Esan Central",
    "Esan North-East",
    "Esan South-East",
    "Esan West",
    "Etsako Central",
    "Etsako East",
    "Etsako West",
    "Igueben",
    "Ikpoba Okha",
    "Orhionmwon",
    "Oredo",
    "Ovia North-East",
    "Ovia South-West",
    "Owan East",
    "Owan West",
    "Uhunmwonde",
  ],

  Ekiti: [
    "Ado Ekiti",
    "Efon",
    "Ekiti East",
    "Ekiti South-West",
    "Ekiti West",
    "Emure",
    "Gbonyin",
    "Ido Osi",
    "Ijero",
    "Ikere",
    "Ikole",
    "Ilejemeje",
    "Irepodun-Ifelodun",
    "Ise-Orun",
    "Moba",
    "Oye",
  ],
  Enugu: [
    "Aninri",
    "Awgu",
    "Enugu East",
    "Enugu North",
    "Enugu South",
    "Ezeagu",
    "Igbo Etiti",
    "Igbo Eze North",
    "Igbo Eze South",
    "Isi Uzo",
    "Nkanu East",
    "Nkanu West",
    "Nsukka",
    "Oji River",
    "Udenu",
    "Udi",
    "Uzo Uwani",
  ],
  FCT: [
    "Abaji",
    "Bwari",
    "Gwagwalada",
    "Kuje",
    "Kwali",
    "Municipal Area Council",
  ],
  Gombe: [
    "Akko",
    "Balanga",
    "Billiri",
    "Dukku",
    "Funakaye",
    "Gombe",
    "Kaltungo",
    "Kwami",
    "Nafada",
    "Shongom",
    "Yamaltu-Deba",
  ],
  Imo: [
    "Aboh Mbaise",
    "Ahiazu Mbaise",
    "Ehime Mbano",
    "Ezinihitte",
    "Ideato North",
    "Ideato South",
    "Ihitte-Uboma",
    "Ikeduru",
    "Isiala Mbano",
    "Isu",
    "Mbaitoli",
    "Ngor Okpala",
    "Njaba",
    "Nkwerre",
    "Nwangele",
    "Obowo",
    "Oguta",
    "Ohaji-Egbema",
    "Okigwe",
    "Orlu",
    "Orsu",
    "Oru East",
    "Oru West",
    "Owerri Municipal",
    "Owerri North",
    "Owerri West",
    "Unuimo",
  ],
  Jigawa: [
    "Auyo",
    "Babura",
    "Biriniwa",
    "Birnin Kudu",
    "Buji",
    "Dutse",
    "Gagarawa",
    "Garki",
    "Gumel",
    "Guri",
    "Gwaram",
    "Gwiwa",
    "Hadejia",
    "Jahun",
    "Kafin Hausa",
    "Kazaure",
    "Kiri Kasama",
    "Kiyawa",
    "Kaugama",
    "Maigatari",
    "Malam Madori",
    "Miga",
    "Ringim",
    "Roni",
    "Sule Tankarkar",
    "Taura",
    "Yankwashi",
  ],
  Kaduna: [
    "Birnin Gwari",
    "Chikun",
    "Giwa",
    "Igabi",
    "Ikara",
    "Jaba",
    "Jema a",
    "Kachia",
    "Kaduna North",
    "Kaduna South",
    "Kagarko",
    "Kajuru",
    "Kaura",
    "Kauru",
    "Kubau",
    "Kudan",
    "Lere",
    "Makarfi",
    "Sabon Gari",
    "Sanga",
    "Soba",
    "Zangon Kataf",
    "Zaria",
  ],
  Kano: [
    "Ajingi",
    "Albasu",
    "Bagwai",
    "Bebeji",
    "Bichi",
    "Bunkure",
    "Dala",
    "Dambatta",
    "Dawakin Kudu",
    "Dawakin Tofa",
    "Doguwa",
    "Fagge",
    "Gabasawa",
    "Garko",
    "Garun Mallam",
    "Gaya",
    "Gezawa",
    "Gwale",
    "Gwarzo",
    "Kabo",
    "Kano Municipal",
    "Karaye",
    "Kibiya",
    "Kiru",
    "Kumbotso",
    "Kunchi",
    "Kura",
    "Madobi",
    "Makoda",
    "Minjibir",
    "Nasarawa",
    "Rano",
    "Rimin Gado",
    "Rogo",
    "Shanono",
    "Sumaila",
    "Takai",
    "Tarauni",
    "Tofa",
    "Tsanyawa",
    "Tudun Wada",
    "Ungogo",
    "Warawa",
    "Wudil",
  ],
  Katsina: [
    "Bakori",
    "Batagarawa",
    "Batsari",
    "Baure",
    "Bindawa",
    "Charanchi",
    "Dandume",
    "Danja",
    "Dan Musa",
    "Daura",
    "Dutsi",
    "Dutsin Ma",
    "Faskari",
    "Funtua",
    "Ingawa",
    "Jibia",
    "Kafur",
    "Kaita",
    "Kankara",
    "Kankia",
    "Katsina",
    "Kurfi",
    "Kusada",
    "Mai Adua",
    "Malumfashi",
    "Mani",
    "Mashi",
    "Matazu",
    "Musawa",
    "Rimi",
    "Sabuwa",
    "Safana",
    "Sandamu",
    "Zango",
  ],
  Kebbi: [
    "Aleiro",
    "Arewa Dandi",
    "Argungu",
    "Augie",
    "Bagudo",
    "Birnin Kebbi",
    "Bunza",
    "Dandi",
    "Fakai",
    "Gwandu",
    "Jega",
    "Kalgo",
    "Koko Besse",
    "Maiyama",
    "Ngaski",
    "Sakaba",
    "Shanga",
    "Suru",
    "Wasagu Danko",
    "Yauri",
    "Zuru",
  ],
  Kogi: [
    "Adavi",
    "Ajaokuta",
    "Ankpa",
    "Bassa",
    "Dekina",
    "Ibaji",
    "Idah",
    "Igalamela Odolu",
    "Ijumu",
    "Kabba Bunu",
    "Kogi",
    "Lokoja",
    "Mopa Muro",
    "Ofu",
    "Ogori Magongo",
    "Okehi",
    "Okene",
    "Olamaboro",
    "Omala",
    "Yagba East",
    "Yagba West",
  ],
  Kwara: [
    "Asa",
    "Baruten",
    "Edu",
    "Ekiti",
    "Ifelodun",
    "Ilorin East",
    "Ilorin South",
    "Ilorin West",
    "Irepodun",
    "Isin",
    "Kaiama",
    "Moro",
    "Offa",
    "Oke Ero",
    "Oyun",
    "Pategi",
  ],
  Lagos: [
    "Agege",
    "Ajeromi-Ifelodun",
    "Alimosho",
    "Amuwo-Odofin",
    "Apapa",
    "Badagry",
    "Epe",
    "Eti Osa",
    "Ibeju-Lekki",
    "Ifako-Ijaiye",
    "Ikeja",
    "Ikorodu",
    "Kosofe",
    "Lagos Island",
    "Lagos Mainland",
    "Mushin",
    "Ojo",
    "Oshodi-Isolo",
    "Shomolu",
    "Surulere",
  ],
  Nasarawa: [
    "Akwanga",
    "Awe",
    "Doma",
    "Karu",
    "Keana",
    "Keffi",
    "Kokona",
    "Lafia",
    "Nasarawa",
    "Nasarawa Egon",
    "Obi",
    "Toto",
    "Wamba",
  ],
  Niger: [
    "Agaie",
    "Agwara",
    "Bida",
    "Borgu",
    "Bosso",
    "Chanchaga",
    "Edati",
    "Gbako",
    "Gurara",
    "Katcha",
    "Kontagora",
    "Lapai",
    "Lavun",
    "Magama",
    "Mariga",
    "Mashegu",
    "Mokwa",
    "Moya",
    "Paikoro",
    "Rafi",
    "Rijau",
    "Shiroro",
    "Suleja",
    "Tafa",
    "Wushishi",
  ],
  Ogun: [
    "Abeokuta North",
    "Abeokuta South",
    "Ado-Odo Ota",
    "Egbado North",
    "Egbado South",
    "Ewekoro",
    "Ifo",
    "Ijebu East",
    "Ijebu North",
    "Ijebu North East",
    "Ijebu Ode",
    "Ikenne",
    "Imeko Afon",
    "Ipokia",
    "Obafemi Owode",
    "Odeda",
    "Odogbolu",
    "Ogun Waterside",
    "Remo North",
    "Shagamu",
  ],
  Ondo: [
    "Akoko North-East",
    "Akoko North-West",
    "Akoko South-West",
    "Akoko South-East",
    "Akure North",
    "Akure South",
    "Ese Odo",
    "Idanre",
    "Ifedore",
    "Ilaje",
    "Ile Oluji-Okeigbo",
    "Irele",
    "Odigbo",
    "Okitipupa",
    "Ondo East",
    "Ondo West",
    "Ose",
    "Owo",
  ],
  Osun: [
    "Atakunmosa East",
    "Atakunmosa West",
    "Aiyedaade",
    "Aiyedire",
    "Boluwaduro",
    "Boripe",
    "Ede North",
    "Ede South",
    "Ife Central",
    "Ife East",
    "Ife North",
    "Ife South",
    "Egbedore",
    "Ejigbo",
    "Ifedayo",
    "Ifelodun",
    "Ila",
    "Ilesa East",
    "Ilesa West",
    "Irepodun",
    "Irewole",
    "Isokan",
    "Iwo",
    "Obokun",
    "Odo Otin",
    "Ola Oluwa",
    "Olorunda",
    "Oriade",
    "Orolu",
    "Osogbo",
  ],
  Oyo: [
    "Afijio",
    "Akinyele",
    "Atiba",
    "Atisbo",
    "Egbeda",
    "Ibadan North",
    "Ibadan North-East",
    "Ibadan North-West",
    "Ibadan South-East",
    "Ibadan South-West",
    "Ibarapa Central",
    "Ibarapa East",
    "Ibarapa North",
    "Ido",
    "Irepo",
    "Iseyin",
    "Itesiwaju",
    "Iwajowa",
    "Kajola",
    "Lagelu",
    "Ogbomosho North",
    "Ogbomosho South",
    "Ogo Oluwa",
    "Olorunsogo",
    "Oluyole",
    "Ona Ara",
    "Orelope",
    "Ori Ire",
    "Oyo",
    "Oyo East",
    "Saki East",
    "Saki West",
    "Surulere",
  ],
  Plateau: [
    "Bokkos",
    "Barkin Ladi",
    "Bassa",
    "Jos East",
    "Jos North",
    "Jos South",
    "Kanam",
    "Kanke",
    "Langtang South",
    "Langtang North",
    "Mangu",
    "Mikang",
    "Pankshin",
    "Qua an Pan",
    "Riyom",
    "Shendam",
    "Wase",
  ],
  Rivers: [
    "Port Harcourt",
    "Obio-Akpor",
    "Okrika",
    "Ogu–Bolo",
    "Eleme",
    "Tai",
    "Gokana",
    "Khana",
    "Oyigbo",
    "Opobo–Nkoro",
    "Andoni",
    "Bonny",
    "Degema",
    "Asari-Toru",
    "Akuku-Toru",
    "Abua–Odual",
    "Ahoada West",
    "Ahoada East",
    "Ogba–Egbema–Ndoni",
    "Emohua",
    "Ikwerre",
    "Etche",
    "Omuma",
  ],
  Sokoto: [
    "Binji",
    "Bodinga",
    "Dange Shuni",
    "Gada",
    "Goronyo",
    "Gudu",
    "Gwadabawa",
    "Illela",
    "Isa",
    "Kebbe",
    "Kware",
    "Rabah",
    "Sabon Birni",
    "Shagari",
    "Silame",
    "Sokoto North",
    "Sokoto South",
    "Tambuwal",
    "Tangaza",
    "Tureta",
    "Wamako",
    "Wurno",
    "Yabo",
  ],
  Taraba: [
    "Ardo Kola",
    "Bali",
    "Donga",
    "Gashaka",
    "Gassol",
    "Ibi",
    "Jalingo",
    "Karim Lamido",
    "Kumi",
    "Lau",
    "Sardauna",
    "Takum",
    "Ussa",
    "Wukari",
    "Yorro",
    "Zing",
  ],
  Yobe: [
    "Bade",
    "Bursari",
    "Damaturu",
    "Fika",
    "Fune",
    "Geidam",
    "Gujba",
    "Gulani",
    "Jakusko",
    "Karasuwa",
    "Machina",
    "Nangere",
    "Nguru",
    "Potiskum",
    "Tarmuwa",
    "Yunusari",
    "Yusufari",
  ],
  Zamfara: [
    "Anka",
    "Bakura",
    "Birnin Magaji Kiyaw",
    "Bukkuyum",
    "Bungudu",
    "Gummi",
    "Gusau",
    "Kaura Namoda",
    "Maradun",
    "Maru",
    "Shinkafi",
    "Talata Mafara",
    "Chafe",
    "Zurmi",
  ],
};

let STATES2 = `
  <option value="Abia">Abia</option>
  <option value="Adamawa">Adamawa</option>
  <option value="Akwa Ibom">Akwa Ibom</option>
  <option value="Anambra">Anambra</option>
  <option value="Bauchi">Bauchi</option>
  <option value="Bayelsa">Bayelsa</option>
  <option value="Benue">Benue</option>
  <option value="Borno">Borno</option>
  <option value="Cross River">Cross River</option>
  <option value="Delta">Delta</option>
  <option value="Ebonyi">Ebonyi</option>
  <option value="Edo">Edo</option>
  <option value="Ekiti">Ekiti</option>
  <option value="Enugu">Enugu</option>
  <option value="FCT">Federal Capital Territory</option>
  <option value="Gombe">Gombe</option>
  <option value="Imo">Imo</option>
  <option value="Jigawa" selected>Jigawa</option>
  <option value="Kaduna">Kaduna</option>
  <option value="Kano">Kano</option>
  <option value="Katsina">Katsina</option>
  <option value="Kebbi">Kebbi</option>
  <option value="Kogi">Kogi</option>
  <option value="Kwara">Kwara</option>
  <option value="Lagos">Lagos</option>
  <option value="Nasarawa">Nasarawa</option>
  <option value="Niger">Niger</option>
  <option value="Ogun">Ogun</option>
  <option value="Ondo">Ondo</option>
  <option value="Osun">Osun</option>
  <option value="Oyo">Oyo</option>
  <option value="Plateau">Plateau</option>
  <option value="Rivers">Rivers</option>
  <option value="Sokoto">Sokoto</option>
  <option value="Taraba">Taraba</option>
  <option value="Yobe">Yobe</option>
  <option value="Zamfara">Zamfara</option>
`;

$(".stat").html(STATES2);

let stateSelect2 = document.querySelector("#selectState");
let lgaSelect2 = document.querySelector("#selectLGA");

if (stateSelect2) {
  // lgaSelect = ""
  stateSelect2.innerHTML = STATES2;

  if (lgaSelect2) {
    lgaList2["Jigawa"].forEach((lga) => {
      lgaSelect2.innerHTML += `
    <option value="${lga}">${lga}</option>
  `;
    });
  }

  stateSelect2.addEventListener("change", function () {
    let selectedState = $(this).val();

    let arrStates = Object.values(lgaList2);
    let finalarrState = arrStates[stateSelect2.selectedIndex];

    lgaSelect2.innerHTML = "";

    finalarrState.forEach((opt, ii) => {
      lgaSelect2.innerHTML += `
        <option value="${opt}">${opt}</option>
      `;
    });
  });
}

function convertNumberToWords(number) {
  let [integer, fraction] = String(number).split(".");
  let output = "";

  if (integer[0] === "-") {
    output = "negative ";
    integer = integer.substring(1);
  } else if (integer[0] === "+") {
    output = "positive ";
    integer = integer.substring(1);
  }

  if (integer[0] === "0") {
    output += "zero";
  } else {
    integer = integer.padStart(36, "0");
    let group = integer.match(/.{1,3}/g);
    let groups2 = group.map((g) => convertThreeDigit(g[0], g[1], g[2]));

    for (let z = 0; z < groups2.length; z++) {
      if (groups2[z] !== "") {
        output +=
          groups2[z] +
          convertGroup(11 - z) +
          (z < 11 &&
            !groups2.slice(z + 1, -1).includes("") &&
            groups2[11] !== "" &&
            group[11][0] === "0"
            ? " and "
            : ", ");
      }
    }

    output = output.replace(/, $/, "");
  }

  if (fraction > 0) {
    output += " naira and";
    output += " " + numberToWords(fraction);

    output += " Kobo";
  }

  return output;
}

function convertGroup(index) {
  switch (index) {
    case 11:
      return " decillion";
    case 10:
      return " nonillion";
    case 9:
      return " octillion";
    case 8:
      return " septillion";
    case 7:
      return " sextillion";
    case 6:
      return " quintrillion";
    case 5:
      return " quadrillion";
    case 4:
      return " trillion";
    case 3:
      return " billion";
    case 2:
      return " million";
    case 1:
      return " thousand";
    case 0:
      return "";
  }
}

function convertThreeDigit(digit1, digit2, digit3) {
  let buffer = "";

  if (digit1 === "0" && digit2 === "0" && digit3 === "0") {
    return "";
  }

  if (digit1 !== "0") {
    buffer += convertDigit(digit1) + " hundred";
    if (digit2 !== "0" || digit3 !== "0") {
      buffer += " and ";
    }
  }

  if (digit2 !== "0") {
    buffer += convertTwoDigit(digit2, digit3);
  } else {
    if (digit3 !== "0") {
      buffer += convertDigit(digit3);
    }
  }

  return buffer;
}

function convertTwoDigit(digit1, digit2) {
  if (digit2 === "0") {
    switch (digit1) {
      case "1":
        return "ten";
      case "2":
        return "twenty";
      case "3":
        return "thirty";
      case "4":
        return "forty";
      case "5":
        return "fifty";
      case "6":
        return "sixty";
      case "7":
        return "seventy";
      case "8":
        return "eighty";
      case "9":
        return "ninety";
    }
  } else {
    if (digit1 === "1") {
      switch (digit2) {
        case "1":
          return "eleven";
        case "2":
          return "twelve";
        case "3":
          return "thirteen";
        case "4":
          return "fourteen";
        case "5":
          return "fifteen";
        case "6":
          return "sixteen";
        case "7":
          return "seventeen";
        case "8":
          return "eighteen";
        case "9":
          return "nineteen";
      }
    } else {
      let temp = convertDigit(digit2);
      switch (digit1) {
        case "2":
          return "twenty-" + temp;
        case "3":
          return "thirty-" + temp;
        case "4":
          return "forty-" + temp;
        case "5":
          return "fifty-" + temp;
        case "6":
          return "sixty-" + temp;
        case "7":
          return "seventy-" + temp;
        case "8":
          return "eighty-" + temp;
        case "9":
          return "ninety-" + temp;
      }
    }
  }
}

function convertDigit(digit) {
  switch (digit) {
    case "0":
      return "zero";
    case "1":
      return "one";
    case "2":
      return "two";
    case "3":
      return "three";
    case "4":
      return "four";
    case "5":
      return "five";
    case "6":
      return "six";
    case "7":
      return "seven";
    case "8":
      return "eight";
    case "9":
      return "nine";
  }
}

function numberToWords(num) {
  const ones = [
    "",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
  ];
  const teens = [
    "",
    "eleven",
    "twelve",
    "thirteen",
    "fourteen",
    "fifteen",
    "sixteen",
    "seventeen",
    "eighteen",
    "nineteen",
  ];
  const tens = [
    "",
    "ten",
    "twenty",
    "thirty",
    "forty",
    "fifty",
    "sixty",
    "seventy",
    "eighty",
    "ninety",
  ];

  function convertLessThanOneThousand(n) {
    let word = "";
    if (n >= 100) {
      word += ones[Math.floor(n / 100)] + " hundred ";
      n %= 100;
    }
    if (n >= 20) {
      word += tens[Math.floor(n / 10)] + " ";
      n %= 10;
    }
    if (n > 0) {
      if (n < 10) word += ones[n] + " ";
      else word += teens[n - 10] + " ";
    }
    return word.trim();
  }

  if (num === 0) return "zero";

  let words = "";
  if (num < 0) {
    words += "negative ";
    num = Math.abs(num);
  }

  if (num >= 1000000000) {
    words +=
      convertLessThanOneThousand(Math.floor(num / 1000000000)) + " billion ";
    num %= 1000000000;
  }
  if (num >= 1000000) {
    words +=
      convertLessThanOneThousand(Math.floor(num / 1000000)) + " million ";
    num %= 1000000;
  }
  if (num >= 1000) {
    words += convertLessThanOneThousand(Math.floor(num / 1000)) + " thousand ";
    num %= 1000;
  }
  if (num > 0) {
    words += convertLessThanOneThousand(num);
  }

  return words.trim();
}

document.addEventListener("DOMContentLoaded", () => {
  const searchModals = document.querySelectorAll(".search-modal");
  const searchToggles = document.querySelectorAll(".search-toggle");
  const closeButtons = document.querySelectorAll(".close-modal");

  // Open Modal
  searchToggles.forEach((toggle) => {
    toggle.addEventListener("click", (event) => {
      const targetModal = document.querySelector(
        toggle.getAttribute("data-target")
      );
      if (targetModal) {
        targetModal.classList.remove("hidden");
      }
    });
  });

  // Close Modal
  closeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const modal = button.closest(".search-modal");
      if (modal) {
        modal.classList.add("hidden");
      }
    });
  });

  // Close Modal on Outside Click
  window.addEventListener("click", (event) => {
    searchModals.forEach((modal) => {
      if (event.target === modal) {
        modal.classList.add("hidden");
      }
    });
  });
});

$(document).ready(function () {
  let searchData = [];
  let isSearchOpen = false;

  // Load JSON data
  $.getJSON("./assets/js/centralSearch.json", function (data) {
    searchData = data;
  });

  // Handle search input
  $(".search-input").on("input", function () {
    const query = $(this).val().toLowerCase();

    if (query.length < 1) {
      $(".search-results").addClass("hidden");
      return;
    }

    const results = searchData.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
    );

    if (results.length > 0) {
      displayResults(results);
    } else {
      displayNoResults();
    }
  });

  // Display search results
  function displayResults(results) {
    const resultsHtml = results
      .map(
        (item) => `
            <a href="${item.link}" class="flex items-center p-3 hover:bg-gray-100 border-b border-gray-100">
              <img src="${item.img}" alt="${item.title}" class="w-12 h-12 object-cover rounded mr-3">
              <div class="w-full">
                <div class="font-medium text-gray-900">${item.title}</div>
                <div class="text-sm text-gray-500 truncate">${item.description}</div>
              </div>
            </a>
        `
      )
      .join("");

    $(".search-results").html(resultsHtml).removeClass("hidden");
  }

  // Display no results message
  function displayNoResults() {
    $(".search-results")
      .html('<div class="p-4 text-center text-gray-500">No results found</div>')
      .removeClass("hidden");
  }

  // Prevent search input click from closing modal
  $(".search-input").click(function (e) {
    e.stopPropagation();
  });

  // Keyboard shortcuts
  $(document).keydown(function (e) {
    if (e.key === "Escape" && isSearchOpen) {
      $(".search-modal").addClass("hidden");
      $(".search-results").addClass("hidden");
      isSearchOpen = false;
    }

    if ((e.ctrlKey || e.metaKey) && e.key === "k") {
      e.preventDefault();
      if (!isSearchOpen) {
        isSearchOpen = true;
        $(".search-modal").removeClass("hidden");
        $(".search-input").focus();
      }
    }
  });
});

// const userDataaaaa = JSON.parse(localStorage.getItem("userData"));

var Tawk_API = Tawk_API || {},
  Tawk_LoadStart = new Date();

// window.Tawk_API.visitor = {
//   name: userDataaaaa.fullname || null,
//   email: userDataaaaa.email || null
// };
(function () {
  var s1 = document.createElement("script"),
    s0 = document.getElementsByTagName("script")[0];
  s1.async = true;
  s1.src = "https://embed.tawk.to/67c882ced32913191469291c/1iljjttt2";
  s1.charset = "UTF-8";
  s1.setAttribute("crossorigin", "*");
  s0.parentNode.insertBefore(s1, s0);
})();

document.addEventListener("DOMContentLoaded", function () {
  // Tab switching functionality
  const tabs = document.querySelectorAll(".calculator-method");
  const tabContents = document.querySelectorAll(".calculator-tab");

  tabs.forEach((tab) => {
    tab.addEventListener("click", function (e) {
      e.preventDefault();

      // Remove active class from all tabs
      tabs.forEach((t) => t.classList.remove("active-method"));

      // Add active class to clicked tab
      this.classList.add("active-method");

      // Get the target tab content
      const targetId = this.querySelector("a")
        .getAttribute("href")
        .substring(1);

      // Hide all tab contents
      tabContents.forEach((content) => content.classList.remove("active"));

      // Show the target tab content
      document.getElementById(targetId).classList.add("active");
    });
  });

  // PAYE Calculator (API Integration)
  document.getElementById("payeForm").addEventListener("submit", (e) => {
    e.preventDefault();
    showLoader("payeLoader", "payeForm", "payeResult");

    const annualGrossIncome =
      parseFloat(document.getElementById("payeMonthlyIncome").value) * 12;

    const payload = {
      annual_gross_income: annualGrossIncome,
    };

    fetch(`${HOST}/noauth-calculate-paye`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        document.getElementById("payeGrossIncome").textContent = formatPrice(
          data.data.transaction_amount
        );
        showResult("payeLoader", "payeForm", "payeResult");
      })
      .catch((error) => {
        console.error("Error calculating PAYE:", error);
        alert("An error occurred while calculating PAYE. Please try again.");
        showForm("payeForm");
      });
  });

  // Withholding Tax Calculator (API Integration)
  document.getElementById("whtForm").addEventListener("submit", (e) => {
    e.preventDefault();
    showLoader("whtLoader", "whtForm", "whtResult");

    const amount = parseFloat(document.getElementById("whtAmount").value);
    const transaction_type = document.getElementById("transaction_type").value;

    const recipient_type = document.getElementById("recipient_type").value;

    const payload = {
      transaction_amount: amount,
      transaction_type,
      recipient_type,
    };

    fetch(`${HOST}/noauth-calculate-wht`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          document.getElementById("whtGrossAmount").textContent = formatPrice(
            data.data.transaction_amount
          );
          document.getElementById(
            "whtTaxRate"
          ).textContent = `${data.data.wht_rate.toFixed(2)}%`;
          document.getElementById("whtTaxDue").textContent = formatPrice(
            data.data.wht_due
          );
          document.getElementById("whtNetAmount").textContent = formatPrice(
            data.data.net_payment
          );
          showResult("whtLoader", "whtForm", "whtResult");
        } else {
          throw new Error("API returned an error status");
        }
      })
      .catch((error) => {
        console.error("Error calculating WHT:", error);
        alert("An error occurred while calculating WHT. Please try again.");
        showForm("whtForm");
      });
  });
});

function showLoader(loaderId, formId, resultId) {
  document.getElementById(loaderId).style.display = "block";
  document.getElementById(formId).style.display = "none";
  document.getElementById(resultId).style.display = "none";
}

function showResult(loaderId, formId, resultId) {
  document.getElementById(loaderId).style.display = "none";
  document.getElementById(resultId).style.display = "block";
}

function showForm(formId) {
  document.getElementById(formId).style.display = "block";
  document.getElementById(formId.replace("Form", "Result")).style.display =
    "none";
}

function formatPrice(amount, currency = "NGN") {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    currencyDisplay: "symbol", // Use symbol (₦) instead of code (NGN)
  }).format(amount);
}
