import { useEffect, useState } from 'react';
import { Phone, Coffee, Sparkles, Handshake, Compass, MapPin, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react';

const heroSlides = [
  {
    image: "/sigiriya.jpg",
    title: "Wonders of Sri Lanka",
    subtitle: "Begin with Misty Hills",
    date: "(10 - 18 November 2026)",
  },
  {
    image: "/sri_lanka.jpg",
    title: "Wonders of Sri Lanka",
    subtitle: "Memorable Journey",
    date: "(10 - 18 November 2026)",
  },
  {
    image: "/pinnawala.jpg",
    title: "Wonders of Sri Lanka",
    subtitle: "the Island of Ancient Kingdoms",
    date: "(10 - 18 November 2026)",
  },
  {
    image: "/southern_coast.jpg",
    title: "Wonders of Sri Lanka ",
    subtitle: "the Golden Beaches",
    date: "(10 - 18 November 2026)",
  },
];

const highlightSlides = [
  {
    image: "/colombo.jpg",
    tag: "Colombo",
    title: "Colonial charm, seaside boulevards & vibrant markets",
    description:
      "Spend meaningful time in Colombo, with guided visits to nearby historic places.",
  },
  {
    image: "/pinnawala.jpg",
    tag: "Pinnawala",
    title: "Elephant Orphanage experience",
    description:
      "Visit continue to revered sites.",
  },
  {
    image: "/sigiriya.jpg",
    tag: "Sigiriya",
    title: "The iconic 5th century Rock Fortress",
    description:
      "Travel guided with context and a carefully paced group itinerary.",
  },
  {
    image: "/dambulla.jpg",
    tag: "Dambulla",
    title: "Ancient cave temples filled with murals & statues",
    description:
      "Continue through completing a powerful route.",
  },
  {
    image: "/kandy.jpg",
    tag: "Kandy",
    title: "Cultural capital & home of the Sacred Tooth Relic",
    description:
      "Continue through completing a powerful route.",
  },
  {
    image: "/nuwara_eliya.jpg",
    tag: "Nuwara Eliya",
    title: "Tea Gardens & scenic drives",
    description:
      "Continue through completing a powerful route.",
  },
  {
    image: "/southern_coast (2).jpg",
    tag: "Southern Coast",
    title: "Golden beaches & tropical relaxation",
    description:
      "Continue through completing a powerful route.",
  },
];

export default function App() {
  const [openDay, setOpenDay] = useState<number | null>(1);
  const [heroIndex, setHeroIndex] = useState(0);
  const [highlightIndex, setHighlightIndex] = useState(0);

  // Enquiry form state
  const [enquiryName, setEnquiryName] = useState('');
  const [enquiryPhone, setEnquiryPhone] = useState('');
  const [enquiryEmail, setEnquiryEmail] = useState('');
  const [enquiryMessage, setEnquiryMessage] = useState('');

  const handleEnquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    if (!enquiryName.trim() || !enquiryEmail.trim()) {
      alert('Please provide at least your name and email.');
      return;
    }

    const subject = 'Sri Panj Takht Sahib Yatra Enquiry';

    // Save a copy in localStorage (captured)
    try {
      const saved = JSON.parse(localStorage.getItem('enquiries') || '[]');
      saved.push({ name: enquiryName, phone: enquiryPhone, email: enquiryEmail, message: enquiryMessage, date: new Date().toISOString() });
      localStorage.setItem('enquiries', JSON.stringify(saved));
    } catch (err) {
      console.warn('Could not save enquiry to localStorage', err);
    }

    const submitViaApi = async () => {
      const endpoint = "/enquiry.php";

      const resp = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: enquiryName, phone: enquiryPhone, email: enquiryEmail, message: enquiryMessage }),
      });

      const dataText = await resp.text();
      let data: any = {};
      try { data = JSON.parse(dataText); } catch { data = { message: dataText }; }
      return { ok: resp.ok, data };
    };

    (async () => {
      try {
        const { ok, data } = await submitViaApi();
        if (!ok) {
          console.error('API submission error', data);
          throw new Error(data?.error || data?.message || 'Submission failed');
        }

        setEnquiryName('');
        setEnquiryPhone('');
        setEnquiryEmail('');
        setEnquiryMessage('');
        alert('Enquiry submitted. We will contact you soon.');
      } catch (err) {
        console.error('Enquiry submit failed', err);
        alert('Submission failed. Please try again later.');
      }
    })();
  };

  // Download itinerary section as PDF (client-side)
  const downloadItineraryPDF = async () => {
    // Serve the static Flyer.pdf from public folder to force a download
    try {
      const a = document.createElement('a');
      a.href = '/Flyer.pdf';
      a.setAttribute('download', 'Panj-Takht-Yatra-Flyer.pdf');
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error('Error triggering PDF download', err);
      alert('Could not download Flyer. Please open /Flyer.pdf manually.');
    }
  };

  const toggleDay = (day: number) => {
    setOpenDay(openDay === day ? null : day);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const heroTimer = window.setInterval(() => {
      setHeroIndex((current) => (current + 1) % heroSlides.length);
    }, 5000);

    return () => window.clearInterval(heroTimer);
  }, []);

  useEffect(() => {
    const highlightTimer = window.setInterval(() => {
      setHighlightIndex((current) => (current + 1) % highlightSlides.length);
    }, 5000);

    return () => window.clearInterval(highlightTimer);
  }, []);

  const goToHeroSlide = (index: number) => {
    setHeroIndex((index + heroSlides.length) % heroSlides.length);
  };

  const goToHighlightSlide = (index: number) => {
    setHighlightIndex((index + highlightSlides.length) % highlightSlides.length);
  };

  const activeHeroSlide = heroSlides[heroIndex];
  const activeHighlightSlide = highlightSlides[highlightIndex];

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Sticky Side Buttons */}
      <div className="fixed right-3 bottom-6 md:right-1 md:top-1/2 md:bottom-auto md:-translate-y-1/2 z-40 flex flex-col gap-2 md:gap-3">
        <a
          href="#enquiry"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection("enquiry");
          }}
          className="px-4 py-2 md:px-6 md:py-2 bg-[#C9A961] text-[#1A1A1A] hover:bg-[#D4A574] transition-all duration-300 tracking-wide shadow-md flex items-center gap-2 whitespace-nowrap rounded-sm text-xs md:text-sm cursor-pointer"
        >
          Book Now
        </a>

        <a
          href="#download-itinerary"
          onClick={(e) => {
            e.preventDefault();
            downloadItineraryPDF();
          }}
          className="px-4 py-2 md:px-6 md:py-2 bg-[#2B5954] text-white hover:bg-[#1F4440] transition-all duration-300 tracking-wide shadow-md flex items-center gap-2 whitespace-nowrap rounded-sm text-xs md:text-sm cursor-pointer"
        >
          Download Itinerary
        </a>
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#D4A574]/20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-[64px] md:h-[80px] flex items-center justify-between">
          {/* Logo */}
          <div className="h-full flex items-center">
            <img
              src="/Ptakht.png"
              alt="Takht Sahib"
              className="h-10 md:h-full w-auto object-contain"
            />
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollToSection('overview')} className="text-[#1A1A1A] hover:text-[#C9A961] transition-colors">
              Overview
            </button>
            <button onClick={() => scrollToSection('itinerary')} className="text-[#1A1A1A] hover:text-[#C9A961] transition-colors">
              Itinerary
            </button>
          </nav>

          {/* Book Now Button */}
          <div className="flex items-center gap-3 md:gap-4">
            <a href="tel:02039095800"
              className="flex items-center gap-2 text-[#1A1A1A] transition-colors font-medium text-[13px] sm:text-sm md:text-lg tracking-wide" >
              <Phone className="w-4 h-4 md:w-5 md:h-5" />
              <span>0203 909 5800</span>
            </a>
            <a
              href="#enquiry"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("enquiry");
              }}
              className="px-3 py-1.5 md:px-6 md:py-2 bg-[#C9A961] text-[#1A1A1A] hover:bg-[#D4A574] transition-all duration-300 tracking-wide cursor-pointer inline-flex items-center justify-center text-xs md:text-sm"
            >
              Book Now
            </a>
          </div>
        </div>
      </header> 

      {/* Hero Section */}
      <section className="hero-slider relative h-[calc(100vh-64px)] md:h-screen min-h-[620px] flex items-end justify-center overflow-hidden mt-16 md:mt-20">
        <div className="absolute inset-0">
          {heroSlides.map((slide, index) => (
            <div
              key={slide.title}
              className={`hero-slide absolute inset-0 ${index === heroIndex ? "is-active" : ""}`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="hero-slide-image w-full h-full object-cover"
              />
            </div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-[#061513]/45 via-[#061513]/20 to-[#061513]/70" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_78%,rgba(201,169,97,0.18),transparent_34%)]" />
        </div>

        <button
          type="button"
          onClick={() => goToHeroSlide(heroIndex - 1)}
          className="absolute left-4 md:left-8 top-1/2 z-20 -translate-y-1/2 h-11 w-11 rounded-full bg-white/15 hover:bg-white/25 text-white backdrop-blur-sm border border-white/25 flex items-center justify-center transition-all"
          aria-label="Previous banner slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          type="button"
          onClick={() => goToHeroSlide(heroIndex + 1)}
          className="absolute right-4 md:right-8 top-1/2 z-20 -translate-y-1/2 h-11 w-11 rounded-full bg-white/15 hover:bg-white/25 text-white backdrop-blur-sm border border-white/25 flex items-center justify-center transition-all"
          aria-label="Next banner slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        <div key={activeHeroSlide.title} className="hero-copy relative z-10 text-center text-white px-6 max-w-5xl mx-auto mb-16 md:mb-20">
          <h1 className="mb-5 tracking-wide text-[38px] leading-[1.08] sm:text-[52px] md:text-[72px]" style={{ fontFamily: 'var(--font-serif)' }}>
            {activeHeroSlide.title}
          </h1>
          <p className="hero-copy-delay-1 text-lg sm:text-2xl md:text-3xl font-light tracking-wide mx-[0px] mt-[0px] mb-[10px]" style={{ fontFamily: 'var(--font-serif)' }}>
            {activeHeroSlide.subtitle}
          </p>
          <p className="hero-copy-delay-2 text-sm sm:text-lg mb-8 sm:mb-10 tracking-widest opacity-90" style={{ fontFamily: 'var(--font-sans)' }}>{activeHeroSlide.date}</p>
          <div className="hero-progress mx-auto flex items-center justify-center gap-2">
            {heroSlides.map((slide, index) => (
              <button
                key={slide.title}
                type="button"
                onClick={() => goToHeroSlide(index)}
                className={`h-[3px] rounded-full transition-all duration-500 ${index === heroIndex ? "w-14 bg-[#C9A961]" : "w-8 bg-white/55 hover:bg-white"}`}
                aria-label={`Show banner slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Highlights Section with Icons */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div className="text-center sm:col-span-2 md:col-span-1">
              <div className="relative text-center bg-[#FAF7F2] border border-[#2B5954]/40 rounded-2xl px-4 py-6 sm:px-5 sm:py-8 shadow-[0_12px_35px_rgba(201,169,97,0.18)]">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#2B5954] text-[#ffffff] px-4 py-1 text-[11px] uppercase tracking-[0.18em] font-medium">
                  Limited Offer
                </div>

                <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 bg-white rounded-full flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-[#2B5954]" />
                </div>

                <p className="text-sm uppercase tracking-widest text-[#6B5D4F] mb-2">
                  <strong> Early Bird Offer</strong>
                </p>

                <div className="flex items-baseline justify-center gap-3">
                  <span className="text-sm sm:text-base text-[#9A8F7E] line-through">£1995</span>
                  <span
                    className="text-3xl sm:text-4xl text-[#1A1A1A]"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    £1895<span className="text-sm"> pp</span>
                  </span>
                </div>

                <p className="text-sm text-[#6B5D4F] mt-2">
                  Valid Till 31st July 2026
                </p>
              </div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-[#FAF7F2] rounded-full flex items-center justify-center">
                <Handshake className="w-8 h-8 text-[#2B5954]" />
              </div>
              <p className="text-sm uppercase tracking-widest text-[#6B5D4F] mb-2">Experience</p>
              <p className="text-2xl" style={{ fontFamily: 'var(--font-serif)' }}>Cultural Journey</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-[#FAF7F2] rounded-full flex items-center justify-center">
                <Compass className="w-8 h-8 text-[#2B5954]" />
              </div>
              <p className="text-sm uppercase tracking-widest text-[#6B5D4F] mb-2">Guided journey</p>
              <p className="text-2xl" style={{ fontFamily: 'var(--font-serif)' }}>Expert-led visits</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-[#FAF7F2] rounded-full flex items-center justify-center">
                <Coffee className="w-8 h-8 text-[#2B5954]" />
              </div>
              <p className="text-sm uppercase tracking-widest text-[#6B5D4F] mb-2">Meals & Stay</p>
              <p className="text-2xl" style={{ fontFamily: 'var(--font-serif)' }}>Comfort & all Meals</p>
            </div>
          </div>
        </div>
      </section>

      {/* Program Overview */}
      <section id="overview" className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl mb-12" style={{ fontFamily: 'var(--font-serif)' }}>Program Overview</h2>

          <div className="space-y-8 text-lg leading-relaxed text-[#3A3A3A]">
            <p className="text-[15px]">
              Discover the Island of Ancient Kingdoms, Sacred Temples, Misty Hills & the Golden Beaches.
            </p>
            <p className="text-[15px]">
            Sri Lanka — <strong>the Wonder of Asia</strong> — invites you on a journey through its timeless heritage, breathtaking landscapes, and warm island hospitality. From the cultural treasures of the ancient capitals to the serenity of tea covered highlands, from vibrant Colombo to the wildlife of Yala and the sun kissed southern coast, this tour captures the very essence of Ceylon.</p>
            <p className="text-[15px]">
            Experience a land where history rises from stone, nature thrives in abundance, and every moment feels like a postcard.</p>
            <p className="text-[15px]">
              <strong>A Journey of Culture, Nature & Serenity Awaits.</strong></p>
            <p className="text-[15px]">
              Let Sri Lanka’s beauty unfold before you — from ancient wonders to lush highlands, from wildlife encounters to tranquil beaches. Your unforgettable island adventure begins here.
            </p>
            <p><strong> Let's go! </strong></p>
          </div>
        </div>
      </section>

      {/* Program Routing */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl mb-8" style={{ fontFamily: 'var(--font-serif)' }}>Program Routing</h2>

          <p className="mb-12 text-[#6B5D4F] leading-relaxed text-[20px]">
            UK Airport → Colombo → Pinnawala → Sigiriya → Dambulla → Spice Village Matale →Kandy → Nuwara Eliya → Southern Coast Beach → Colombo →UK Airport
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t border-[#D4A574]/30">
            <div>
              <p className="text-sm uppercase tracking-widest text-[#6B5D4F] mb-2 font-bold">Duration</p>
              <p className="text-lg" style={{ fontFamily: 'var(--font-serif)' }}>8 Nights / 9 Days</p>
            </div>
            <div>
              <p className="text-sm uppercase tracking-widest text-[#6B5D4F] mb-2 font-bold">Departure</p>
              <p className="text-lg" style={{ fontFamily: 'var(--font-serif)' }}>10th Nov 2026</p>
            </div>
            <div>
              <p className="text-sm uppercase tracking-widest text-[#6B5D4F] mb-2 font-bold">Package price</p>
              <p className="text-lg" style={{ fontFamily: 'var(--font-serif)' }}>from £1995 pp</p>
            </div>
            <div>
              <p className="text-sm uppercase tracking-widest text-[#6B5D4F] mb-2 font-bold">Reservation</p>
              <p className="text-lg" style={{ fontFamily: 'var(--font-serif)' }}>0203 909 5800</p>
            </div>
          </div>
        </div>
      </section>

      {/* Rotating Highlights Feature */}
      <section className="py-20 px-4 sm:px-6 bg-white">
        <div className="highlight-carousel max-w-7xl mx-auto rounded-md bg-[#2B5954] px-5 py-8 sm:px-8 md:px-12 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-8 lg:gap-12 items-center">
            <div className="highlight-media relative overflow-hidden rounded-md bg-[#ffffff]/10">
              {highlightSlides.map((slide, index) => (
                <img
                  key={slide.title}
                  src={slide.image}
                  alt={slide.title}
                  className={`highlight-image absolute inset-0 w-full h-full object-cover ${index === highlightIndex ? "is-active" : ""}`}
                />
              ))}
            </div>

            <div className="min-h-[420px] flex flex-col justify-center">
              <div className="mb-8 flex gap-2">
                {highlightSlides.map((slide, index) => (
                  <button
                    key={slide.title}
                    type="button"
                    onClick={() => goToHighlightSlide(index)}
                    className={`h-1 rounded-full transition-all duration-500 ${index === highlightIndex ? "w-14 bg-[#ffffff]" : "w-12 bg-[#ffffff]/25 hover:bg-[#ffffff]/60"}`}
                    aria-label={`Show trip highlight ${index + 1}`}
                  />
                ))}
              </div>

              <h2 className="mb-7 text-4xl md:text-5xl text-[#ffffff]" style={{ fontFamily: 'var(--font-serif)' }}>
                Highlights of trip
              </h2>

              <div key={activeHighlightSlide.title} className="highlight-copy">
                <span className="inline-flex rounded-md bg-[#010101] px-4 py-2 text-sm font-semibold text-white mb-7">
                  {activeHighlightSlide.tag}
                </span>
                <h3 className="text-2xl md:text-3xl mb-4 text-[#ffffff]" style={{ fontFamily: 'var(--font-sans)' }}>
                  {activeHighlightSlide.title}
                </h3>
                <p className="text-base md:text-lg leading-relaxed text-[#ffffff] max-w-2xl">
                  {activeHighlightSlide.description}
                </p>
              </div>

              <div className="mt-10 flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => goToHighlightSlide(highlightIndex - 1)}
                  className="h-11 w-11 rounded-full bg-[#101010] text-white hover:bg-[#2B5954] flex items-center justify-center transition-colors"
                  aria-label="Previous trip highlight"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => goToHighlightSlide(highlightIndex + 1)}
                  className="h-11 w-11 rounded-full bg-[#101010] text-white hover:bg-[#2B5954] flex items-center justify-center transition-colors"
                  aria-label="Next trip highlight"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Program at a Glance - Accordion Style */}
      <section id="itinerary" className="py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-6xl mb-20 text-center" style={{ fontFamily: 'var(--font-serif)' }}>Program at a Glance</h2>

          <div className="space-y-4">
            {itineraryDays.map((day) => (
              <div key={day.day} className="border-l-4 border-[#2B5954]">
                <button
                  onClick={() => toggleDay(day.day)}
                  className="w-full text-left px-8 py-6 bg-white hover:bg-[#FAF7F2] transition-colors flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <MapPin className="w-6 h-6 text-[#2B5954] flex-shrink-0" />
                    <div>
                      <p className="text-sm text-[#6B5D4F] mb-1">Day {day.day}</p>
                      <h3 className="text-2xl" style={{ fontFamily: 'var(--font-serif)' }}>
                        {day.title}
                      </h3>
                    </div>
                  </div>
                  {openDay === day.day ? (
                    <ChevronUp className="w-6 h-6 text-[#2B5954] flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-[#2B5954] flex-shrink-0" />
                  )}
                </button>

                {openDay === day.day && (
                  <div className="px-8 py-6 bg-[#FDFCFA] border-t border-[#D4A574]/20">
                    <p className="leading-relaxed text-[#3A3A3A] text-[15px]">{day.description}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Image Strip */}
      <section className="py-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 px-4">
          {[
            {
              src: "/sri_lanka.jpg",
            },
            {
              src: "/kandy.jpg",
            },
            {
              src: "/southern_coast.jpg",
            },
            {
              src: "/dambulla.jpg",
            },
            {
              src: "/nuwara_eliya.jpg",
            },
          ].map((item, index) => (
            <div key={index} className="text-center">
              <img
                src={item.src}
                // alt={item.title}
                className="w-full h-[240px] object-cover rounded-md"
              />

              {/* <p className="mt-1 text-[12px] text-[#6B5D4F] tracking-wide leading-snug" > {item.title} </p> */}
            </div>
          ))}
        </div>
      </section>

      {/* Journey Includes/Excludes */}
      <section className="py-32 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl mb-16 text-center" style={{ fontFamily: 'var(--font-serif)' }}>Your Journey Includes</h2>

          <div className="grid md:grid-cols-5 gap-12 mb-20">
            <div>
              <h3 className="text-xl mb-4 text-[#C9A961]" style={{ fontFamily: 'var(--font-serif)' }}>Overall</h3>
              <ul className="space-y-2 text-[#3A3A3A]">
                <li className="text-[14px]">Return flights from London</li>
                <li className="text-[14px]">Exciting cultural tours</li>
                <li className="text-[14px]">Private coach transport</li>
                <li className="text-[14px]">Experienced Tour manager</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl mb-4 text-[#C9A961]" style={{ fontFamily: 'var(--font-serif)' }}>Accommodation</h3>
              <ul className="space-y-2 text-[#3A3A3A]">
                <li className="text-[14px]">7 nights quality hotels</li>
                <li className="text-[14px]">Twin/double rooms</li>
                <li className="text-[14px]">Daily housekeeping</li>
                <li className="text-[14px]">Modern amenities</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl mb-4 text-[#C9A961]" style={{ fontFamily: 'var(--font-serif)' }}>Experiences</h3>
              <ul className="space-y-2 text-[#3A3A3A]">
                <li className="text-[14px]">Exquisite Landscapes, Beaches & Tea Gardens</li>
                <li className="text-[14px]">Colonial Charm & traditional folk dances</li>
                <li className="text-[14px]">Two UNESCO World Heritage Sites & Elephants</li>
                <li className="text-[14px]">Historical monuments & local Gurdwara</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl mb-4 text-[#C9A961]" style={{ fontFamily: 'var(--font-serif)' }}>Meals</h3>
              <ul className="space-y-2 text-[#3A3A3A]">
                <li className="text-[14px]">Daily breakfast</li>
                <li className="text-[14px]">Traditional local cuisines</li>
                <li className="text-[14px]">Selected dinners</li>
                <li className="text-[14px]">Vegetarian options</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl mb-4 text-[#C9A961]" style={{ fontFamily: 'var(--font-serif)' }}>Assistance</h3>
              <ul className="space-y-2 text-[#3A3A3A]">
                <li className="text-[14px]">24/7 support</li>
                <li className="text-[14px]">Travel documentation</li>
                <li className="text-[14px]">Pre-departure briefing</li>
                <li className="text-[14px]">ATOL protection</li>
              </ul>
            </div>
          </div>

          <div className="pt-12 border-t border-[#D4A574]/30">
            <h2 className="text-3xl mb-8" style={{ fontFamily: 'var(--font-serif)' }}>Your Journey Excludes</h2>
            <ul className="grid md:grid-cols-3 gap-4 text-[#3A3A3A]">
              <li className="text-[14px]">Any Visa, Travel Insurance, etc.</li>
              <li className="text-[14px]">Any additional entrance fees not listed.</li>
              <li className="text-[14px]">Beverages, snacks, and meals not mentioned.</li>
              <li className="text-[14px]">Personal expenses (laundry, phone calls, etc.)</li>
              <li className="text-[14px]">Tips for guide, driver, and hotel staff</li>
              <li className="text-[14px]">Any services not specified in the itinerary</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Enquiry Section */}
      <section id="enquiry" className="py-32 px-6 bg-[#FAF7F2]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-5xl mb-6 text-center" style={{ fontFamily: 'var(--font-serif)' }}>Begin Your Journey</h2>
          <p className="text-center text-lg text-[#6B5D4F] mb-12 max-w-2xl mx-auto">
            Share your details and our specialists will guide you through every step of this profound journey.
          </p>

          <form className="space-y-6" onSubmit={handleEnquirySubmit}>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm uppercase tracking-widest text-[#6B5D4F] mb-2">Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-white border border-[#D4A574]/30 focus:border-[#C9A961] focus:outline-none transition-colors"
                  placeholder="Your full name"
                  required
                  value={enquiryName}
                  onChange={(e) => setEnquiryName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm uppercase tracking-widest text-[#6B5D4F] mb-2">Contact Number</label>
                <input
                  type="tel"
                  className="w-full px-4 py-3 bg-white border border-[#D4A574]/30 focus:border-[#C9A961] focus:outline-none transition-colors"
                  placeholder="Your phone number"
                  required
                  value={enquiryPhone}
                  onChange={(e) => setEnquiryPhone(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm uppercase tracking-widest text-[#6B5D4F] mb-2">Email</label>
              <input
                type="email"
                className="w-full px-4 py-3 bg-white border border-[#D4A574]/30 focus:border-[#C9A961] focus:outline-none transition-colors"
                placeholder="your@email.com"
                value={enquiryEmail}
                required
                onChange={(e) => setEnquiryEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm uppercase tracking-widest text-[#6B5D4F] mb-2">Message</label>
              <textarea
                rows={6}
                className="w-full px-4 py-3 bg-white border border-[#D4A574]/30 focus:border-[#C9A961] focus:outline-none transition-colors resize-none"
                placeholder="Tell us about your journey aspirations..."
                value={enquiryMessage}
                onChange={(e) => setEnquiryMessage(e.target.value)}
              />
            </div>

            <div className="text-center pt-4">
              <button
                type="submit"
                className="px-10 py-3 bg-[#C9A961] text-[#1A1A1A] hover:bg-[#D4A574] transition-all duration-300 tracking-widest text-sm uppercase"
              >
                Submit Enquiry
              </button>
            </div>
          </form>

          {/* <p className="text-center text-sm text-[#6B5D4F] mt-8">
            Or email us directly at <a href="mailto:info@sikhchannelyatras.com" className="text-[#C9A961] hover:underline">info@sikhchannelyatras.com</a>
          </p> */}
        </div>
      </section>

      {/* Call Us Section */}
      

      {/* Trust Section */}
      

      {/* Footer */}
      <footer className="py-16 px-6 bg-[#2B5954] text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            <div>
              <h3 className="text-2xl mb-4" style={{ fontFamily: 'var(--font-serif)' }}>Sikh Channel Yatras</h3>
              <p className="text-sm opacity-80 leading-relaxed">
                Creating meaningful journeys with reverence, authenticity and care.
              </p>
            </div>

            <div>
              <h4 className="text-lg mb-4" style={{ fontFamily: 'var(--font-serif)' }}>Contact</h4>
              <div className="space-y-2 text-lg opacity-80">
                <a href="tel:02039095800"
                  className="flex items-center gap-2 transition-colors font-medium text-lg tracking-wide hover:opacity-100" >
                  <Phone className="w-6 h-6" />
                  <span>0203 909 5800</span>
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-lg mb-4" style={{ fontFamily: 'var(--font-serif)' }}>Managed & powered by</h4>
              <div className="flex flex-row flex-wrap items-center gap-4 md:gap-6">
                <img src="/sparrowpath.png" alt="Sparrow Path" className="h-10 w-auto object-contain rounded-md" />
                <img src="/pts.png" alt="PTS" className="h-10 w-auto object-contain" />
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/20 space-y-6">
            {/* Logos and managed by */}
            <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
              <div className="flex flex-col md:flex-row items-center gap-14 text-[14px]">
                
                <p className="text-center md:text-left max-w-3xl leading-relaxed">
                  The holidays offered on SikhChannelYatras are a product powered and managed by Sparrow Path Ltd. UK, a member of Protected Trust Services (PTS). All applicable bookings are protected under the ATOL 12960 licence held by Sparrow Path Ltd.
                </p>

                <div className="flex flex-col items-center gap-2 shrink-0">
                  <h4 className="text-lg" style={{ fontFamily: 'var(--font-serif)' }}>In Association With</h4>
                  <img
                    src="/channel.jpg"
                    alt="Sikh Channel"
                    className="h-12 w-auto object-contain rounded-md"
                  />
                </div>

              </div>
            </div>

            {/* ATOL protection statement */}
          <div className="bg-white/5 p-4 rounded-md text-[13px] text-white/90 leading-relaxed">
            <div className="flex flex-col md:flex-row gap-5 items-center">
              <img
                src="/atol.png"
                alt="ATOL"
                className="h-16 md:h-20 w-auto shrink-0"
              />

              <p>
                Many of the flights and flight-inclusive holidays on{" "}
                <a
                  href="https://www.sikhchannelyatras.com"
                  className="hover:text-white transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  www.sikhchannelyatras.com
                </a>{" "}
                are financially protected by the ATOL scheme of Sparrow Path Ltd (12960).
                But ATOL protection does not apply to all holiday and travel services
                listed on the website. Please ask us to confirm what protection may apply
                to your booking. If you do not receive an ATOL Certificate then the booking
                will not be ATOL protected. If you do receive an ATOL Certificate but all
                the parts of your trip are not listed on it, those parts will not be ATOL
                protected. Please see our booking conditions for information, or for more
                information about financial protection and the ATOL Certificate go to:{" "}
                <a
                  href="https://www.atol.org.uk/atolcertificate"
                  className="hover:text-white transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  www.atol.org.uk/atolcertificate.
                </a>{" "}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3 text-center md:text-left text-[13px] text-white/80 leading-relaxed">
            <p>© Sikh Channel Yatras. 2026. All rights reserved.</p>
            <span className="hidden md:inline text-white/40">|</span>
            <p>© Sparrow Path Ltd, UK. 2026. All rights reserved.</p>
          </div>

            <a
              href="/Terms&Conditions.pdf"
              className="text-sm opacity-70 hover:opacity-100 transition-opacity"
              target="_blank"
              rel="noopener noreferrer"
            >
              Terms & Conditions
            </a>
          </div>
          </div>
        </div>
      </footer>

    </div>
  );
}

const itineraryDays = [
  {
    day: 1,
    title: "Departure from the UK",
    description: (<div>
      <p>
        Board your designated flight from the UK.
      </p>
    </div>)
  },
  {
    day: 2,
    title: "Arrival in Sri Lanka & Transfer to Colombo",
    description: (<div>
      <p>
Upon arrival at Bandaranaike International Airport, you will be warmly welcomed by your local representative and transferred to the vibrant capital city, Colombo.
Colombo is a captivating blend of colonial heritage and modern urban life — a city of seaside promenades, bustling markets, stylish cafés, and historic architecture. Depending on your arrival time, enjoy a relaxed evening to unwind and settle in.
Overnight stay in Colombo.
      </p><br/>
    </div>)
  },
  {
    day: 3,
    title: "Colombo City Tour & Gurudwara Visit",
    description: (<div>
      <p>
      After breakfast, embark on a comprehensive <strong>Colombo City Tour.</strong>
      </p><br/>
      <p>Discover the city’s cultural and historical highlights, including:</p><br/>
      <ul className="list-disc pl-5 space-y-1">
        <li>Independence Square</li>
        <li>Local Gurdwara </li>
        <li>The colonial era buildings of the Fort district</li>
        <li>The lively streets of Pettah Market</li>
        <li>The scenic Galle Face Green oceanfront</li>
      </ul><br/>
      <p>A key spiritual highlight is a visit to <strong>Gangaramaya Temple</strong>, renowned for its architecture, sacred relics, and serene atmosphere.</p><br/>
      <p>You will also visit a local <strong>Gurudwara</strong>, offering a meaningful insight into the Sikh community in Sri Lanka and its traditions of devotion, service, and hospitality.
Return to your hotel for an evening at leisure. Overnight stay in Colombo.</p>
    </div>)  
  },
  {
    day: 4,
    title: "Drive to Sigiriya & Climb the Sigiriya Rock Fortress",
    description: (<div>
      <p>
After breakfast, visit the <strong>Pinnawala Elephant Orphanage</strong>, a sanctuary for rescued and orphaned elephants. Observe feeding sessions and the elephants bathing in the river — a memorable experience.
      </p><br/>
      <p>Later, travel towards the Cultural Triangle and arrive in Sigiriya. Climb the legendary <strong>Sigiriya Rock Fortress, a UNESCO World Heritage Site</strong> and one of Sri Lanka’s most iconic landmarks. Built by King Kashyapa in the 5th century, this ancient citadel features:</p><br/>
      <ul className="list-disc pl-5 space-y-1">
        <li>Royal pleasure gardens</li>
        <li>Ingenious water features</li>
        <li>World famous frescoes</li>
        <li>The monumental Lion’s Paw entrance</li>
      </ul><br/>
      <p>At the summit, enjoy sweeping views of the surrounding forests and countryside. Continue to Habarana and relax at your nature surrounded hotel.</p>
      <p>Overnight stay in Habarana.</p>
    </div>)
  },
  {
    day: 5,
    title: "Dambulla Cave Temple, Spice Garden & Kandy City Tour",
    description: (<div>
      <p>
After breakfast, visit the magnificent <strong>Dambulla Cave Temple</strong>, a UNESCO World Heritage Site dating back over 2,000 years. Explore its beautifully preserved murals, Buddha statues, and sacred cave shrines.
      </p><br/>
      <p>Next, visit a traditional spice garden to learn about Sri Lanka’s world famous spices and their role in cuisine, Ayurveda, and wellness (optional).</p><br/>
      <p>Continue to Kandy, the cultural capital of Sri Lanka. Enjoy a city tour featuring:</p><br/>
      <ul className="list-disc pl-5 space-y-1">
        <li>Local markets</li>
        <li>Scenic viewpoints</li>
        <li>The picturesque Kandy Lake</li>
        <li>The monumental Lion’s Paw entrance</li>
      </ul><br/>
      <p>Overnight stay in Kandy.</p>
    </div>)
  },
  {
    day: 6,
    title: "Temple of the Tooth Relic & Nuwara Eliya Excursion (Tea Gardens)",
    description: (<div>
      <p>
After breakfast, visit the revered <strong>Temple of the Sacred Tooth Relic</strong>, one of the most important Buddhist pilgrimage sites in the world.
      </p><br/>
      <p>Thereafter, enjoy a scenic drive to <strong>Nuwara Eliya</strong>, often called Little England for its colonial charm, cool climate, and lush tea covered hills. Explore:</p><br/>
      <ul className="list-disc pl-5 space-y-1">
        <li>Gregory Lake</li>
        <li>Tea plantations & viewpoints</li>
        <li>Colonial era buildings and gardens</li>
        <li>The charming town centre</li>
      </ul><br/>
      <p>Return to Kandy in the evening. Overnight stay in Kandy.</p>
    </div>)
  },
  {
    day: 7,
    title: "Drive to the South Sri Lanka Beach with Turtle Hatchery Visit",
    description: (<div>
      <p>
      After breakfast, depart the hill country and travel towards Sri Lanka’s beautiful coastline. En route, visit a <strong>turtle hatchery</strong>, where conservation teams protect nesting turtles and release hatchlings safely into the ocean. Learn about the five species of sea turtles that visit Sri Lanka’s shores.
      </p><br/>
      <p>Continue to your beach resort and enjoy the remainder of the day at leisure.</p>
    </div>)   
  },
  {
    day: 8,
    title: "Leisure by the Beach",
    description: (<div>
      <p>
      Enjoy a full day at leisure to unwind by the beach, explore the local area, or simply relax with the hotel’s facilities. Overnight stay at the beach.</p>
    </div>)
  },
  {
    day: 9,
    title: "Travel to the Colombo airport for the onwards or return flights",
    description: (<div>
      <p>
        After breakfast, transfer to Bandaranaike International Airport for your return flight to UK
      </p><br/>
       <p><strong>End of the Services!</strong></p>
    </div>)   
  }
];
