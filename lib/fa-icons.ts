// Disable FA auto CSS injection — we import the CSS manually in providers
import { config, library } from '@fortawesome/fontawesome-svg-core'
config.autoAddCss = false

import {
  // General
  faStore, faBuilding, faHouse, faStar, faHeart, faMagnifyingGlass,
  faBell, faLocationDot, faMapPin, faTag, faTags, faAward, faShield,
  faGlobe, faPhone, faEnvelope, faClock, faCalendar, faUsers, faGear,
  faCircleInfo, faBriefcase, faList, faMap,
  // Food & Shopping
  faUtensils, faBasketShopping, faCartShopping, faMugHot, faPizzaSlice,
  faBurger, faCakeCandles, faWineGlass, faAppleWhole, faCarrot,
  faBowlFood, faFish, faBreadSlice, faIceCream,
  // Health
  faStethoscope, faHospital, faHeartPulse, faPills, faSyringe, faTooth,
  faEye, faBrain, faBaby, faWheelchair, faBandage, faKitMedical,
  faMicroscope, faDna,
  // Education
  faGraduationCap, faBook, faBookOpen, faSchool, faPen, faPencil,
  faChalkboardUser, faAtom, faFlask,
  // Transport
  faCar, faBus, faPlane, faTaxi, faMotorcycle, faBicycle, faTruck,
  faTrain, faShip, faGasPump, faRoad, faHelicopter,
  // Services
  faWrench, faHammer, faScrewdriverWrench, faScissors, faPaintbrush,
  faBolt, faFire, faDroplet, faBroom, faToolbox, faRecycle, faScrewdriver,
  // Tech
  faLaptop, faMobileScreenButton, faWifi, faDesktop, faKeyboard, faCamera,
  faPrint, faMicrochip, faPlug, faBatteryFull, faSatelliteDish, faServer,
  faHardDrive, faHeadphones,
  // Finance
  faDollarSign, faCreditCard, faBuildingColumns, faCoins, faChartLine,
  faMoneyBillWave, faReceipt, faWallet, faPiggyBank, faHandHoldingDollar,
  faChartBar, faChartPie, faScaleBalanced,
  // Beauty & Fashion
  faGem, faFaceSmile, faSpa, faShower, faShirt, faGlasses, faRing,
  faPersonDress, faHatCowboy, faSocks,
  // Entertainment & Sport
  faMusic, faFilm, faGamepad, faDumbbell, faFutbol, faBasketball,
  faChess, faDice, faTrophy, faTicket, faGuitar, faPalette,
  faMasksTheater, faCameraRetro,
  // Real Estate
  faKey, faDoorOpen, faCouch, faBath, faBed, faHouseChimneyWindow,
  faRulerCombined, faPaintRoller, faWarehouse, faStairs,
  // Nature
  faLeaf, faTree, faSun, faMoon, faSnowflake, faUmbrella, faSeedling,
  faPaw, faWater, faMountainSun, faWind, faFireFlameCurved,
} from '@fortawesome/free-solid-svg-icons'

library.add(
  // General
  faStore, faBuilding, faHouse, faStar, faHeart, faMagnifyingGlass,
  faBell, faLocationDot, faMapPin, faTag, faTags, faAward, faShield,
  faGlobe, faPhone, faEnvelope, faClock, faCalendar, faUsers, faGear,
  faCircleInfo, faBriefcase, faList, faMap,
  // Food & Shopping
  faUtensils, faBasketShopping, faCartShopping, faMugHot, faPizzaSlice,
  faBurger, faCakeCandles, faWineGlass, faAppleWhole, faCarrot,
  faBowlFood, faFish, faBreadSlice, faIceCream,
  // Health
  faStethoscope, faHospital, faHeartPulse, faPills, faSyringe, faTooth,
  faEye, faBrain, faBaby, faWheelchair, faBandage, faKitMedical,
  faMicroscope, faDna,
  // Education
  faGraduationCap, faBook, faBookOpen, faSchool, faPen, faPencil,
  faChalkboardUser, faAtom, faFlask,
  // Transport
  faCar, faBus, faPlane, faTaxi, faMotorcycle, faBicycle, faTruck,
  faTrain, faShip, faGasPump, faRoad, faHelicopter,
  // Services
  faWrench, faHammer, faScrewdriverWrench, faScissors, faPaintbrush,
  faBolt, faFire, faDroplet, faBroom, faToolbox, faRecycle, faScrewdriver,
  // Tech
  faLaptop, faMobileScreenButton, faWifi, faDesktop, faKeyboard, faCamera,
  faPrint, faMicrochip, faPlug, faBatteryFull, faSatelliteDish, faServer,
  faHardDrive, faHeadphones,
  // Finance
  faDollarSign, faCreditCard, faBuildingColumns, faCoins, faChartLine,
  faMoneyBillWave, faReceipt, faWallet, faPiggyBank, faHandHoldingDollar,
  faChartBar, faChartPie, faScaleBalanced,
  // Beauty & Fashion
  faGem, faFaceSmile, faSpa, faShower, faShirt, faGlasses, faRing,
  faPersonDress, faHatCowboy, faSocks,
  // Entertainment & Sport
  faMusic, faFilm, faGamepad, faDumbbell, faFutbol, faBasketball,
  faChess, faDice, faTrophy, faTicket, faGuitar, faPalette,
  faMasksTheater, faCameraRetro,
  // Real Estate
  faKey, faDoorOpen, faCouch, faBath, faBed, faHouseChimneyWindow,
  faRulerCombined, faPaintRoller, faWarehouse, faStairs,
  // Nature
  faLeaf, faTree, faSun, faMoon, faSnowflake, faUmbrella, faSeedling,
  faPaw, faWater, faMountainSun, faWind, faFireFlameCurved,
)
