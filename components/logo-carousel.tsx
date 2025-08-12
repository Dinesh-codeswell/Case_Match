"use client"

import { useState } from "react"

export default function LogoCarousel() {
  const [failedImages, setFailedImages] = useState(new Set())

  // Replace with your actual Logo.dev API key
  const LOGO_DEV_API_KEY = "pk_RhoEcQeiTyy1kK1PHHSEaA"

  const allLogos = [
    // IITs
    {
      name: "IIT Bombay",
      domain: "iitb.ac.in",
      fallback:
        "https://upload.wikimedia.org/wikipedia/en/thumb/1/1d/Indian_Institute_of_Technology_Bombay_Logo.svg/1200px-Indian_Institute_of_Technology_Bombay_Logo.svg.png",
      height: "h-12",
      link: "https://www.iitb.ac.in/",
    },
    {
      name: "IIT Delhi",
      domain: "iitd.ac.in",
      fallback: "https://upload.wikimedia.org/wikipedia/en/f/fd/Indian_Institute_of_Technology_Delhi_Logo.svg",
      height: "h-12",
      link: "https://home.iitd.ac.in/",
    },
    {
      name: "IIT Madras",
      domain: "iitm.ac.in",
      fallback:
        "https://upload.wikimedia.org/wikipedia/en/thumb/6/69/IIT_Madras_Logo.svg/1200px-IIT_Madras_Logo.svg.png",
      height: "h-12",
      link: "https://www.iitm.ac.in/",
    },
    {
      name: "IIT Kharagpur",
      domain: "iitkgp.ac.in",
      fallback:
        "https://upload.wikimedia.org/wikipedia/en/thumb/4/41/Indian_Institute_of_Technology_Kharagpur_Logo.svg/1200px-Indian_Institute_of_Technology_Kharagpur_Logo.svg.png",
      height: "h-12",
      link: "https://www.iitkgp.ac.in/",
    },
    {
      name: "IIT Kanpur",
      domain: "iitk.ac.in",
      fallback:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/IIT_Kanpur_Logo.svg/1200px-IIT_Kanpur_Logo.svg.png",
      height: "h-12",
      link: "https://www.iitk.ac.in/",
    },
    {
      name: "IIT Roorkee",
      domain: "iitr.ac.in",
      fallback:
        "https://upload.wikimedia.org/wikipedia/en/thumb/0/0c/Indian_Institute_of_Technology_Roorkee_logo.png/1200px-Indian_Institute_of_Technology_Roorkee_logo.png",
      height: "h-12",
      link: "https://www.iitr.ac.in/",
    },
    {
      name: "IIT Guwahati",
      domain: "iitg.ac.in",
      fallback:
        "https://upload.wikimedia.org/wikipedia/en/thumb/5/58/Indian_Institute_of_Technology_Guwahati_Logo.svg/1200px-Indian_Institute_of_Technology_Guwahati_Logo.svg.png",
      height: "h-12",
      link: "https://www.iitg.ac.in/",
    },
    // IISc
    {
      name: "IISc Bangalore",
      domain: "iisc.ac.in",
      fallback:
        "https://upload.wikimedia.org/wikipedia/en/thumb/9/91/Indian_institute_of_science_logo.png/1200px-Indian_institute_of_science_logo.png",
      height: "h-12",
      link: "https://iisc.ac.in/",
    },
    // IIMs
    {
      name: "IIM Ahmedabad",
      domain: "iima.ac.in",
      fallback:
        "https://upload.wikimedia.org/wikipedia/en/thumb/c/c4/Indian_Institute_of_Management_Ahmedabad_Logo.svg/1200px-Indian_Institute_of_Management_Ahmedabad_Logo.svg.png",
      height: "h-12",
      link: "https://www.iima.ac.in/",
    },
    {
      name: "IIM Bangalore",
      domain: "iimb.ac.in",
      fallback:
        "https://upload.wikimedia.org/wikipedia/en/thumb/c/c0/Indian_Institute_of_Management_Bangalore_Logo.svg/1200px-Indian_Institute_of_Management_Bangalore_Logo.svg.png",
      height: "h-12",
      link: "https://www.iimb.ac.in/",
    },
    {
      name: "IIM Calcutta",
      domain: "iimcal.ac.in",
      fallback:
        "https://upload.wikimedia.org/wikipedia/en/thumb/5/57/Indian_Institute_of_Management_Calcutta_Logo.svg/1200px-Indian_Institute_of_Management_Calcutta_Logo.svg.png",
      height: "h-12",
      link: "https://www.iimcal.ac.in/",
    },
    // Other Top Institutes
    {
      name: "BITS Pilani",
      domain: "bits-pilani.ac.in",
      fallback:
        "https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/BITS_Pilani-Logo.svg/1200px-BITS_Pilani-Logo.svg.png",
      height: "h-12",
      link: "https://www.bits-pilani.ac.in/",
    },
    {
      name: "NIT Trichy",
      domain: "nitt.edu",
      fallback: "https://upload.wikimedia.org/wikipedia/en/thumb/e/ed/NIT_Trichy_Logo.png/1200px-NIT_Trichy_Logo.png",
      height: "h-12",
      link: "https://www.nitt.edu/",
    },
    {
      name: "VIT Vellore",
      domain: "vit.ac.in",
      fallback:
        "https://upload.wikimedia.org/wikipedia/en/thumb/c/c5/Vellore_Institute_of_Technology_seal_2017.svg/1200px-Vellore_Institute_of_Technology_seal_2017.svg.png",
      height: "h-12",
      link: "https://vit.ac.in/",
    },
    {
      name: "SRM University",
      domain: "srmist.edu.in",
      fallback: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/SRM_logo.png/1200px-SRM_logo.png",
      height: "h-12",
      link: "https://www.srmist.edu.in/",
    },
    {
      name: "Manipal University",
      domain: "manipal.edu",
      fallback:
        "https://upload.wikimedia.org/wikipedia/en/thumb/f/f8/Manipal_Academy_of_Higher_Education_logo.png/1200px-Manipal_Academy_of_Higher_Education_logo.png",
      height: "h-12",
      link: "https://manipal.edu/",
    },
    {
      name: "Amity University",
      domain: "amity.edu",
      fallback:
        "https://upload.wikimedia.org/wikipedia/en/thumb/1/1c/Amity_University_logo.svg/1200px-Amity_University_logo.svg.png",
      height: "h-12",
      link: "https://www.amity.edu/",
    },
    {
      name: "Symbiosis University",
      domain: "siu.edu.in",
      fallback:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Symbiosis_International_University_logo.png/1200px-Symbiosis_International_University_logo.png",
      height: "h-12",
      link: "https://www.siu.edu.in/",
    },
    {
      name: "Christ University",
      domain: "christuniversity.in",
      fallback:
        "https://upload.wikimedia.org/wikipedia/en/thumb/5/58/Christ_University_Logo.png/1200px-Christ_University_Logo.png",
      height: "h-12",
      link: "https://christuniversity.in/",
    },
    {
      name: "Jadavpur University",
      domain: "jaduniv.edu.in",
      fallback:
        "https://upload.wikimedia.org/wikipedia/en/thumb/c/c5/Jadavpur_University_Logo.svg/1200px-Jadavpur_University_Logo.svg.png",
      height: "h-12",
      link: "https://www.jaduniv.edu.in/",
    },
    {
      name: "Anna University",
      domain: "annauniv.edu",
      fallback:
        "https://upload.wikimedia.org/wikipedia/en/thumb/1/1c/Anna_University_Logo.svg/1200px-Anna_University_Logo.svg.png",
      height: "h-12",
      link: "https://www.annauniv.edu/",
    },
    {
      name: "University of Hyderabad",
      domain: "uohyd.ac.in",
      fallback:
        "https://upload.wikimedia.org/wikipedia/en/thumb/2/2f/University_of_Hyderabad_logo.png/1200px-University_of_Hyderabad_logo.png",
      height: "h-12",
      link: "https://www.uohyd.ac.in/",
    },
    {
      name: "Jamia Millia Islamia",
      domain: "jmi.ac.in",
      fallback:
        "https://upload.wikimedia.org/wikipedia/en/thumb/4/4c/Jamia_Millia_Islamia_logo.png/1200px-Jamia_Millia_Islamia_logo.png",
      height: "h-12",
      link: "https://www.jmi.ac.in/",
    },
    // Delhi University and Colleges
    {
      name: "Delhi University",
      domain: "du.ac.in",
      fallback:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Delhi_University%27s_official_logo.png/1200px-Delhi_University%27s_official_logo.png",
      height: "h-12",
      link: "https://www.du.ac.in/",
    },
    {
      name: "St. Stephen's College",
      domain: "ststephens.edu",
      fallback:
        "https://upload.wikimedia.org/wikipedia/en/thumb/e/e6/St._Stephen%27s_College%2C_Delhi.png/1200px-St._Stephen%27s_College%2C_Delhi.png",
      height: "h-12",
      link: "https://www.ststephens.edu/",
    },
    {
      name: "Hindu College",
      domain: "hinducollege.ac.in",
      fallback:
        "https://upload.wikimedia.org/wikipedia/en/thumb/4/40/Hindu_College_Delhi_logo.png/1200px-Hindu_College_Delhi_logo.png",
      height: "h-12",
      link: "https://www.hinducollege.ac.in/",
    },
    {
      name: "Lady Shri Ram College",
      domain: "lsr.edu.in",
      fallback:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Lady_Shri_Ram_College_for_Women.svg/1200px-Lady_Shri_Ram_College_for_Women.svg.png",
      height: "h-12",
      link: "https://lsr.edu.in/",
    },
    {
      name: "SRCC",
      domain: "srcc.edu",
      fallback:
        "https://upload.wikimedia.org/wikipedia/en/thumb/d/dd/Shri_Ram_College_of_Commerce_logo.png/1200px-Shri_Ram_College_of_Commerce_logo.png",
      height: "h-12",
      link: "https://www.srcc.edu/",
    },
    {
      name: "Miranda House",
      domain: "mirandahouse.ac.in",
      fallback:
        "https://upload.wikimedia.org/wikipedia/en/thumb/6/67/Miranda_House_logo.png/1200px-Miranda_House_logo.png",
      height: "h-12",
      link: "https://www.mirandahouse.ac.in/",
    },
    {
      name: "Hansraj College",
      domain: "hansrajcollege.ac.in",
      fallback:
        "https://upload.wikimedia.org/wikipedia/en/thumb/e/e5/Hansraj_College_logo.png/1200px-Hansraj_College_logo.png",
      height: "h-12",
      link: "https://www.hansrajcollege.ac.in/",
    },
    {
      name: "Ramjas College",
      domain: "ramjas.du.ac.in",
      fallback:
        "https://upload.wikimedia.org/wikipedia/en/thumb/1/1f/Ramjas_College_logo.png/1200px-Ramjas_College_logo.png",
      height: "h-12",
      link: "https://www.ramjas.du.ac.in/",
    },
    {
      name: "Kirori Mal College",
      domain: "kmcollege.ac.in",
      fallback:
        "https://upload.wikimedia.org/wikipedia/en/thumb/7/73/Kirori_Mal_College_logo.png/1200px-Kirori_Mal_College_logo.png",
      height: "h-12",
      link: "https://www.kmcollege.ac.in/",
    },
    {
      name: "Gargi College",
      domain: "gargicollege.in",
      fallback:
        "https://upload.wikimedia.org/wikipedia/en/thumb/2/28/Gargi_College_logo.png/1200px-Gargi_College_logo.png",
      height: "h-12",
      link: "https://www.gargicollege.in/",
    },
    {
      name: "Venkateswara College",
      domain: "svc.ac.in",
      fallback:
        "https://upload.wikimedia.org/wikipedia/en/thumb/d/d7/Venkateswara_College_logo.png/1200px-Venkateswara_College_logo.png",
      height: "h-12",
      link: "https://www.svc.ac.in/",
    },
    {
      name: "Daulat Ram College",
      domain: "dr.du.ac.in",
      fallback:
        "https://upload.wikimedia.org/wikipedia/en/thumb/5/5a/Daulat_Ram_College_logo.png/1200px-Daulat_Ram_College_logo.png",
      height: "h-12",
      link: "https://dr.du.ac.in/",
    },
    // Tech Giants
    {
      name: "Google",
      domain: "google.com",
      fallback:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1200px-Google_2015_logo.svg.png",
      height: "h-8",
      link: "https://www.google.com/",
    },
    {
      name: "Microsoft",
      domain: "microsoft.com",
      fallback:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/1200px-Microsoft_logo.svg.png",
      height: "h-8",
      link: "https://www.microsoft.com/",
    },
    {
      name: "Amazon",
      domain: "amazon.com",
      fallback: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1200px-Amazon_logo.svg.png",
      height: "h-8",
      link: "https://www.amazon.com/",
    },
    {
      name: "Apple",
      domain: "apple.com",
      fallback:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/1200px-Apple_logo_black.svg.png",
      height: "h-8",
      link: "https://www.apple.com/",
    },
    {
      name: "Meta",
      domain: "meta.com",
      fallback:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Meta_Platforms_Inc._logo.svg/1200px-Meta_Platforms_Inc._logo.svg.png",
      height: "h-8",
      link: "https://about.meta.com/",
    },
    {
      name: "Netflix",
      domain: "netflix.com",
      fallback:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/1200px-Netflix_2015_logo.svg.png",
      height: "h-8",
      link: "https://www.netflix.com/",
    },
    // Indian IT Giants
    {
      name: "TCS",
      domain: "tcs.com",
      fallback:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Tata_Consultancy_Services_Logo.svg/1200px-Tata_Consultancy_Services_Logo.svg.png",
      height: "h-8",
      link: "https://www.tcs.com/",
    },
    {
      name: "Infosys",
      domain: "infosys.com",
      fallback:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Infosys_logo.svg/1200px-Infosys_logo.svg.png",
      height: "h-8",
      link: "https://www.infosys.com/",
    },
    {
      name: "Wipro",
      domain: "wipro.com",
      fallback:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Wipro_Primary_Logo_Color_RGB.svg/1200px-Wipro_Primary_Logo_Color_RGB.svg.png",
      height: "h-8",
      link: "https://www.wipro.com/",
    },
    {
      name: "Reliance",
      domain: "ril.com",
      fallback:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Reliance_Industries_Logo.svg/1200px-Reliance_Industries_Logo.svg.png",
      height: "h-8",
      link: "https://www.ril.com/",
    },
    // Consulting
    {
      name: "McKinsey",
      domain: "mckinsey.com",
      fallback:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/McKinsey_%26_Company_logo.svg/1200px-McKinsey_%26_Company_logo.svg.png",
      height: "h-8",
      link: "https://www.mckinsey.com/",
    },
    {
      name: "BCG",
      domain: "bcg.com",
      fallback:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Boston_Consulting_Group_2020_logo.svg/1200px-Boston_Consulting_Group_2020_logo.svg.png",
      height: "h-8",
      link: "https://www.bcg.com/",
    },
    {
      name: "Bain",
      domain: "bain.com",
      fallback:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Bain_and_Company_logo.svg/1200px-Bain_and_Company_logo.svg.png",
      height: "h-8",
      link: "https://www.bain.com/",
    },
    // Big 4 Consulting Firms
    {
      name: "Deloitte",
      domain: "deloitte.com",
      fallback:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Deloitte_Logo.svg/1200px-Deloitte_Logo.svg.png",
      height: "h-8",
      link: "https://www2.deloitte.com/",
    },
    {
      name: "PwC",
      domain: "pwc.com",
      fallback: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/PwC_Logo.svg/1200px-PwC_Logo.svg.png",
      height: "h-8",
      link: "https://www.pwc.com/",
    },
    {
      name: "EY",
      domain: "ey.com",
      fallback:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/EY_logo_2019.svg/1200px-EY_logo_2019.svg.png",
      height: "h-8",
      link: "https://www.ey.com/",
    },
    {
      name: "KPMG",
      domain: "kpmg.com",
      fallback: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/KPMG_logo.svg/1200px-KPMG_logo.svg.png",
      height: "h-8",
      link: "https://kpmg.com/",
    },
    {
      name: "Accenture",
      domain: "accenture.com",
      fallback: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Accenture.svg/1200px-Accenture.svg.png",
      height: "h-8",
      link: "https://www.accenture.com/",
    },
    // Investment Banks
    {
      name: "Goldman Sachs",
      domain: "goldmansachs.com",
      fallback:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Goldman_Sachs.svg/1200px-Goldman_Sachs.svg.png",
      height: "h-8",
      link: "https://www.goldmansachs.com/",
    },
    {
      name: "JP Morgan",
      domain: "jpmorgan.com",
      fallback:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/JPMorgan_Chase_logo.svg/1200px-JPMorgan_Chase_logo.svg.png",
      height: "h-8",
      link: "https://www.jpmorgan.com/",
    },
    {
      name: "Morgan Stanley",
      domain: "morganstanley.com",
      fallback:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Morgan_Stanley_Logo_1.svg/1200px-Morgan_Stanley_Logo_1.svg.png",
      height: "h-8",
      link: "https://www.morganstanley.com/",
    },
    // Indian Startups/Unicorns
    {
      name: "Flipkart",
      domain: "flipkart.com",
      fallback: "https://upload.wikimedia.org/wikipedia/en/thumb/7/7c/Flipkart_logo.svg/1200px-Flipkart_logo.svg.png",
      height: "h-8",
      link: "https://www.flipkart.com/",
    },
    {
      name: "Paytm",
      domain: "paytm.com",
      fallback:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Paytm_Logo_%28standalone%29.svg/1200px-Paytm_Logo_%28standalone%29.svg.png",
      height: "h-8",
      link: "https://paytm.com/",
    },
    {
      name: "Ola",
      domain: "olacabs.com",
      fallback: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Ola_Cabs_logo.png/1200px-Ola_Cabs_logo.png",
      height: "h-8",
      link: "https://www.olacabs.com/",
    },
    {
      name: "Zomato",
      domain: "zomato.com",
      fallback: "https://upload.wikimedia.org/wikipedia/en/thumb/7/75/Zomato_logo.png/1200px-Zomato_logo.png",
      height: "h-8",
      link: "https://www.zomato.com/",
    },
    {
      name: "Swiggy",
      domain: "swiggy.com",
      fallback: "https://upload.wikimedia.org/wikipedia/en/thumb/1/12/Swiggy_logo.svg/1200px-Swiggy_logo.svg.png",
      height: "h-8",
      link: "https://www.swiggy.com/",
    },
  ]

  // Function to get logo from Logo.dev API
  const getLogoUrl = (domain, size = "300") => {
    if (!LOGO_DEV_API_KEY || LOGO_DEV_API_KEY === "your-api-key-here") {
      console.warn("Logo.dev API key not found. Using fallback images.")
      return null
    }
    return `https://img.logo.dev/${domain}?token=${LOGO_DEV_API_KEY}&size=${size}&format=png&retina=true`
  }

  const handleImageError = (index, logo) => {
    setFailedImages((prev) => new Set([...prev, index]))
  }

  const handleImageLoad = (index) => {
    setFailedImages((prev) => {
      const newSet = new Set(prev)
      newSet.delete(index)
      return newSet
    })
  }

  const getImageSrc = (logo, index) => {
    // If API key is not available or image failed, use fallback
    if (!LOGO_DEV_API_KEY || LOGO_DEV_API_KEY === "your-api-key-here" || failedImages.has(index)) {
      return logo.fallback
    }

    // Try Logo.dev API first
    return getLogoUrl(logo.domain)
  }

  return (
    <section className="py-16 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-center text-sm text-gray-600 uppercase tracking-wide mb-8 font-medium">
          Our community members come from
        </h2>
        <div className="overflow-hidden">
          <div className="flex w-max animate-infinite-scroll">
            {/* Duplicate the logos to create a seamless loop */}
            {allLogos.concat(allLogos).map((logo, index) => (
              <a
                key={`logo-${index}`}
                href={logo.link}
                className="flex-shrink-0 block mx-8"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className={`${logo.height} w-auto flex items-center justify-center min-w-[120px]`}>
                  <img
                    src={getImageSrc(logo, index) || "/placeholder.svg"}
                    alt={logo.name}
                    className={`${logo.height} w-auto max-w-full transition-all duration-300 opacity-90 hover:opacity-100 object-contain`}
                    loading="lazy"
                    onError={() => handleImageError(index, logo)}
                    onLoad={() => handleImageLoad(index)}
                    style={{
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = "scale(1.05)"
                      e.target.style.opacity = "1"
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = "scale(1)"
                      e.target.style.opacity = "0.9"
                    }}
                  />
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Optional: Add categories below */}
        <div className="mt-12 text-center">
          <div className="flex flex-wrap justify-center gap-6 text-xs text-gray-500 uppercase tracking-wider">
            <span>Premier Institutes</span>
            <span>•</span>
            <span>Delhi University Colleges</span>
            <span>•</span>
            <span>Tech Giants</span>
            <span>•</span>
            <span>Consulting Firms</span>
            <span>•</span>
            <span>Investment Banks</span>
            <span>•</span>
            <span>Indian Unicorns</span>
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes infinite-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-infinite-scroll {
          animation: infinite-scroll 60s linear infinite;
        }
        
        .animate-infinite-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  )
}
