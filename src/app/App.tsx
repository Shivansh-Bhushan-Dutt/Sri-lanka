import { useState } from 'react';
import { Phone, Coffee, Sparkles, Handshake, Compass, MapPin, ChevronDown, ChevronUp } from 'lucide-react';

export default function App() {
  const [openDay, setOpenDay] = useState<number | null>(1);

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
      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const endpoint = import.meta.env.VITE_ENQUIRY_ENDPOINT || (isLocalhost ? 'http://localhost:3001/api/enquiry' : '');

      if (!endpoint) {
        throw new Error('Enquiry endpoint not configured');
      }

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
          className="px-4 py-2 md:px-6 md:py-2 bg-[#1E3A5F] text-white hover:bg-[#2A4A6F] transition-all duration-300 tracking-wide shadow-md flex items-center gap-2 whitespace-nowrap rounded-sm text-xs md:text-sm cursor-pointer"
        >
          Download Itinerary
        </a>

        <a
          href="/Terms&Conditions.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 md:px-6 md:py-2 bg-[#C9A961] text-[#1A1A1A] hover:bg-[#D4A574] transition-all duration-300 tracking-wide shadow-md flex items-center gap-2 whitespace-nowrap rounded-sm text-xs md:text-sm cursor-pointer"
        >
          Terms & Conditions
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
      <section className="relative h-screen flex items-end justify-center overflow-hidden mt-16">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1764782884713-08c039f92e71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=2000"
            alt="Golden Temple"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50" />
        </div>

        <div className="relative z-10 text-center text-white px-6 max-w-5xl mx-auto mb-13">
          <h1 className="mb-6 tracking-wide text-[36px] sm:text-[48px] md:text-[64px]" style={{ fontFamily: 'var(--font-serif)' }}>
            Sri Panj Takht Sahib Yatra
          </h1>
          <p className="text-lg sm:text-2xl md:text-3xl font-light tracking-wide mx-[0px] mt-[0px] mb-[10px]" style={{ fontFamily: 'var(--font-serif)' }}>
            12 Days Sacred Journey of a Lifetime
          </p>
          <p className="text-sm sm:text-lg mb-10 sm:mb-12 tracking-widest opacity-90" style={{ fontFamily: 'var(--font-sans)' }}>(05 – 16 October 2026)</p>

          <div className="max-w-2xl mx-auto mb-12">
            
          </div>
        </div>
      </section>

      {/* Highlights Section with Icons */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div className="text-center sm:col-span-2 md:col-span-1">
              <div className="relative text-center bg-[#FAF7F2] border border-[#C9A961]/40 rounded-2xl px-4 py-6 sm:px-5 sm:py-8 shadow-[0_12px_35px_rgba(201,169,97,0.18)]">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#C9A961] text-[#1A1A1A] px-4 py-1 text-[11px] uppercase tracking-[0.18em] font-medium">
                  Limited Offer
                </div>

                <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 bg-white rounded-full flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-[#C9A961]" />
                </div>

                <p className="text-sm uppercase tracking-widest text-[#6B5D4F] mb-2">
                  <strong> Early Bird Offer</strong>
                </p>

                <div className="flex items-baseline justify-center gap-3">
                  <span className="text-sm sm:text-base text-[#9A8F7E] line-through">£2350</span>
                  <span
                    className="text-3xl sm:text-4xl text-[#1A1A1A]"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    £2250<span className="text-sm"> pp</span>
                  </span>
                </div>

                <p className="text-sm text-[#6B5D4F] mt-2">
                  Valid Till 15th June
                </p>
              </div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-[#FAF7F2] rounded-full flex items-center justify-center">
                <Handshake className="w-8 h-8 text-[#C9A961]" />
              </div>
              <p className="text-sm uppercase tracking-widest text-[#6B5D4F] mb-2">Experience</p>
              <p className="text-2xl" style={{ fontFamily: 'var(--font-serif)' }}>Spiritual Journey</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-[#FAF7F2] rounded-full flex items-center justify-center">
                <Compass className="w-8 h-8 text-[#C9A961]" />
              </div>
              <p className="text-sm uppercase tracking-widest text-[#6B5D4F] mb-2">Guided Yatra</p>
              <p className="text-2xl" style={{ fontFamily: 'var(--font-serif)' }}>Expert-led visits</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-[#FAF7F2] rounded-full flex items-center justify-center">
                <Coffee className="w-8 h-8 text-[#C9A961]" />
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
              The <strong>Sri Panj Takht Sahib Yatra</strong> is a sacred pilgrimage that covers the Five Takhts—the highest seats of spiritual and temporal authority in Sikhism. These revered Gurudwaras serve as guiding pillars for the Sikh community, preserving tradition, offering spiritual direction, and commemorating defining moments in Sikh history.
            </p>
             <div className="grid grid-cols-1 md:grid-cols-[1.3fr_1fr] gap-x-10 gap-y-1 max-w-[820px] mx-auto text-left text-[15px] leading-[1.6]">
                <p><strong>Takht Sachkhand Sri Hazur Abchalnagar Sahib,</strong> Nanded</p>
                <p><strong>Takht Sri Harimandir Ji,</strong> Patna Sahib</p>

                <p><strong>Takht Sri Kesgarh Sahib,</strong> Anandpur Sahib</p>
                <p><strong>Takht Sri Damdama Sahib,</strong> Talwandi Sabo</p>

                <p><strong>Sri Akal Takht Sahib,</strong> Amritsar</p>
              </div>
            <p className="text-[15px]">
              This pilgrimage also offers the opportunity to explore other historically significant Gurudwaras, and sacred sites located around these major centers of worship, enriching the spiritual and cultural experience even further.
            </p>
            <p><strong> Waheguruji ka Khalsa! Waheguruji ki Fateh! </strong></p>
          </div>
        </div>
      </section>

      {/* Program Routing */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl mb-8" style={{ fontFamily: 'var(--font-serif)' }}>Program Routing</h2>

          <p className="mb-12 text-[#6B5D4F] leading-relaxed text-[20px]">
            London – Hyderabad – Nanded – Patna – Chandigarh – Anandpur Sahib – Talwandi Sabo – Amritsar
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t border-[#D4A574]/30">
            <div>
              <p className="text-sm uppercase tracking-widest text-[#6B5D4F] mb-2 font-bold">Duration</p>
              <p className="text-lg" style={{ fontFamily: 'var(--font-serif)' }}>11 Nights / 12 Days</p>
            </div>
            <div>
              <p className="text-sm uppercase tracking-widest text-[#6B5D4F] mb-2 font-bold">Departure</p>
              <p className="text-lg" style={{ fontFamily: 'var(--font-serif)' }}>05 October 2026</p>
            </div>
            <div>
              <p className="text-sm uppercase tracking-widest text-[#6B5D4F] mb-2 font-bold">Package price</p>
              <p className="text-lg" style={{ fontFamily: 'var(--font-serif)' }}>from £ 2350 pp</p>
            </div>
            <div>
              <p className="text-sm uppercase tracking-widest text-[#6B5D4F] mb-2 font-bold">Reservation</p>
              <p className="text-lg" style={{ fontFamily: 'var(--font-serif)' }}>0203 909 5800</p>
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
              <div key={day.day} className="border-l-4 border-[#C9A961]">
                <button
                  onClick={() => toggleDay(day.day)}
                  className="w-full text-left px-8 py-6 bg-white hover:bg-[#FAF7F2] transition-colors flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <MapPin className="w-6 h-6 text-[#C9A961] flex-shrink-0" />
                    <div>
                      <p className="text-sm text-[#6B5D4F] mb-1">Day {day.day}</p>
                      <h3 className="text-2xl" style={{ fontFamily: 'var(--font-serif)' }}>
                        {day.title}
                      </h3>
                    </div>
                  </div>
                  {openDay === day.day ? (
                    <ChevronUp className="w-6 h-6 text-[#C9A961] flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-[#C9A961] flex-shrink-0" />
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
              src: "/1.png",
              title: "Sri Harmandir Sahib, Patna",
            },
            {
              src: "/2.png",
              title: "Sri Hazur Sahib, Nanded",
            },
            {
              src: "/3.png",
              title: "Sri Kesgarh Sahib, Anandpur Sahib",
            },
            {
              src: "/4.png",
              title: "Sri Akal Takht Sahib, Amritsar",
            },
            {
              src: "/5.png",
              title: "Sri Damdama Sahib, Talwandi Sabo",
            },
          ].map((item, index) => (
            <div key={index} className="text-center">
              <img
                src={item.src}
                alt={item.title}
                className="w-full h-[240px] object-cover rounded-md"
              />

              <p className="mt-1 text-[12px] text-[#6B5D4F] tracking-wide leading-snug" > {item.title} </p>
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
                <li className="text-[14px]">All domestic flights</li>
                <li className="text-[14px]">Private coach transport</li>
                <li className="text-[14px]">Experienced Tour manager</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl mb-4 text-[#C9A961]" style={{ fontFamily: 'var(--font-serif)' }}>Accommodation</h3>
              <ul className="space-y-2 text-[#3A3A3A]">
                <li className="text-[14px]">10 nights quality hotels</li>
                <li className="text-[14px]">Twin/double rooms</li>
                <li className="text-[14px]">Daily housekeeping</li>
                <li className="text-[14px]">Modern amenities</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl mb-4 text-[#C9A961]" style={{ fontFamily: 'var(--font-serif)' }}>Experiences</h3>
              <ul className="space-y-2 text-[#3A3A3A]">
                <li className="text-[14px]">All Five Takhts</li>
                <li className="text-[14px]">Other Historical Gurudwaras</li>
                <li className="text-[14px]">Special Darshans</li>
                <li className="text-[14px]">Spiritual insights</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl mb-4 text-[#C9A961]" style={{ fontFamily: 'var(--font-serif)' }}>Meals</h3>
              <ul className="space-y-2 text-[#3A3A3A]">
                <li className="text-[14px]">Daily breakfast</li>
                <li className="text-[14px]">Langar participation</li>
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
              <li className="text-[14px]">Expenses of personal nature.</li>
              <li className="text-[14px]">Tips to drivers, helpers, hotels staff, etc.</li>
              <li className="text-[14px]">Extensions or change in routing, upgrades, etc.</li>
              <li className="text-[14px]">Optional tours, or excursions, etc.</li>
              <li className="text-[14px]">Any item not mentioned in includes</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Enquiry Section */}
      <section id="enquiry" className="py-32 px-6 bg-[#FAF7F2]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-5xl mb-6 text-center" style={{ fontFamily: 'var(--font-serif)' }}>Begin Your Sacred Journey</h2>
          <p className="text-center text-lg text-[#6B5D4F] mb-12 max-w-2xl mx-auto">
            Share your details and our yatra specialists will guide you through every step of this profound pilgrimage.
          </p>

          <form className="space-y-6" onSubmit={handleEnquirySubmit}>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm uppercase tracking-widest text-[#6B5D4F] mb-2">Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-white border border-[#D4A574]/30 focus:border-[#C9A961] focus:outline-none transition-colors"
                  placeholder="Your full name"
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
                onChange={(e) => setEnquiryEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm uppercase tracking-widest text-[#6B5D4F] mb-2">Message</label>
              <textarea
                rows={6}
                className="w-full px-4 py-3 bg-white border border-[#D4A574]/30 focus:border-[#C9A961] focus:outline-none transition-colors resize-none"
                placeholder="Tell us about your pilgrimage aspirations..."
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
      <footer className="py-16 px-6 bg-[#1E3A5F] text-white">
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
                  The holidays offered on SikhChannelYatras are a product powered and managed by Sparrow Path Ltd UK, a member of Protected Trust Services (PTS). All applicable bookings are protected under the ATOL 12960 licence held by Sparrow Path Ltd.
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
    title: "Departure from London (International Flights)",
    description: (<div>
      <p>
        Board an afternoon or evening flight from London Heathrow and settle in for your journey. This will be an overnight flight, and <strong>flights may operate on indirect routes</strong> depending on availability.
      </p>
    </div>)
  },
  {
    day: 2,
    title: "Arrival in Hyderabad",
    description: (<div>
      <p>
        Upon arrival, and after completing customs, immigration formalities, and baggage collection, the group will be met by our <strong>representative</strong> outside the arrival terminal. The group will then be transferred to the hotel for checkin. In the evening, a <strong>briefing session</strong> will be conducted. Dinner and overnight stay will be at the hotel in Hyderabad.
      </p><br/>
      <p><strong>Meals:</strong> Dinner at a local restaurant or at the hotel.</p>
    </div>)
  },
  {
    day: 3,
    title: "Travel Hyderabad to (Hazur Sahib) via Nanak Jhira Sahib. (Coach-320 kms/8 hrs)",
    description: (<div>
      <p>
        Breakfast at the hotel. After breakfast, depart from Hyderabad and drive to Bidar, Karnataka. Visit <strong>Gurdwara Sri Nanak Jhira Sahib</strong> for Darshan, followed by Langar at the Gurdwara. Later, continue the journey to <strong> Hazur Sahib (Nanded).</strong> Upon arrival, check in at the hotel for <strong>a twonight stay.</strong>
      </p><br/>
      <p>Dinner and overnight stay at the hotel.</p><br/>
      <p><strong>Meals:</strong> Breakfast at the hotel • Langar lunch at the Gurdwara • Dinner at the hotel.</p>
    </div>)  
  },
  {
    day: 4,
    title: "In Hazur Sahib",
    description: (<div>
      <p>
        Early morning visit to Gurdwara Takht Sri Hazur Sahib Ji for Darshan. Return to the hotel for breakfast. Later in the morning, the group will proceed to visit several significant historical Gurdwaras, followed by Langar at one of the Gurdwaras.
      </p><br/>
      <p>The visits will include:</p><br/>
      <ul className="list-disc pl-5 space-y-1">
        <li>Gurdwara Sri Maltekri Sahib</li>
        <li>Gurdwara Sri Heera Ghat Sahib</li>
        <li>Gurdwara Sri Mata Devan Ji</li>
        <li>Gurdwara Sri Shikar Ghat Sahib</li>
        <li>Gurdwara Sri Nagina Ghat Sahib</li>
        <li>Gurdwara Sri Banda Ghat Sahib</li>
      </ul><br/>
      <p>In the evening, visit Takht Sri Hazur Sahib once again for Darshan, followed by Langar. Overnight stay at the hotel in Nanded.</p><br/>
      <p><strong>Meals:</strong> Breakfast at the hotel • Langar lunch at the Gurdwara • Langar dinner at the Gurdwara.</p>
    </div>)
  },
  {
    day: 5,
    title: "Travel Hazur Sahib – Hyderabad Airport (290 kms / 6 hours) / Fly to Patna",
    description: (<div>
      <p>
        Early breakfast at the hotel. After breakfast, depart from Nanded and begin the drive to Hyderabad. En route, stop at <strong>Gurdwara Yaadgari Baba Zorawar Singh Ji Baba Fateh Singh Ji</strong> for Darshan, followed by Langar. Continue the journey to<strong> Hyderabad Airport </strong> and check in for the flight to Patna.
      </p><br/>
      <p>
        Upon arrival in Patna, transfer to the hotel for checkin for a <strong>twonight stay</strong>. Dinner and overnight stay at the hotel in Patna.
      </p><br/>
      <p><strong>Meals:</strong> Breakfast at the hotel • Langar lunch at the Gurdwara • Dinner at the hotel.</p>
    </div>)
  },
  {
    day: 6,
    title: "In Patna Sahib (Visit the Takht Sri Harmandir Sahib, Patna)",
    description: (<div>
      <p>
        Begin your day with breakfast at the hotel before heading to <strong>Gurdwara Takht Sri Patna Sahib</strong> for Darshan. Later, visit several other important and historic Gurdwaras, taking in their spiritual and cultural significance.
      </p><br/>
      <p>The visits will include:</p><br/>
      <ul className="list-disc pl-5 space-y-1">
        <li>Gurdwara Bal Maini Sahib</li>
        <li>Gurdwara Kangan Ghat</li>
        <li>Gurdwara Guru Ka Bagh</li>
      </ul><br/>
      <p>Enjoy Langar lunch at one of the Gurdwaras. Return to the hotel in the evening for dinner and an overnight stay.</p><br/>
      <p><strong>Meals:</strong> Breakfast at the hotel • Langar lunch at the Gurdwara • Dinner at the hotel.</p>
    </div>)
  },
  {
    day: 7,
    title: "Fly Patna to Chandigarh (By Flight)",
    description: (<div>
      <p>
        Enjoy a leisurely breakfast at the hotel before taking your flight from Patna to Chandigarh. On arrival at <strong>Chandigarh Airport</strong>, proceed to Mohali and check in to your hotel for a <strong>twonight stay.</strong> Dinner and overnight stay at the hotel.
      </p><br/>
      <p><strong>Meals:</strong> Breakfast at the hotel • Langar lunch at the Gurdwara • Dinner at the hotel.</p>
    </div>)   
  },
  {
    day: 8,
    title: "Chandigarh – Day trip to Anandpur Sahib (40 kms / 1 hour)",
    description: (<div>
      <p>
        Begin your day with an early breakfast, then set out for <strong>Sri Anandpur Sahib Ji.</strong>
      </p><br/>
      <ul className="list-disc pl-5 space-y-1">
        <li>Explore the historic Anandpur Fort</li>
        <li>Visit Gurdwara Takht Sri Kesgarh Sahib Ji</li>
        <li>Sri Sis Ganj Gurdwara.</li>
      </ul><br/>
      <p>After partaking in Langar, the group will travel back to Mohali for dinner and a restful overnight stay at the hotel.</p><br/>
      <p><strong>Meals:</strong> Breakfast at the hotel • Langar lunch at the Gurdwara • Dinner at the hotel.</p>
    </div>)
  },
  {
    day: 9,
    title: "Chandigarh – Fatehgarh Sahib - Bhatinda (200 kms / 5 Hrs)",
    description: (<div>
      <p>
        Breakfast at the hotel before travelling to <strong>Sirhind</strong> to visit <strong>Sri Fatehgarh Sahib</strong> for Darshan. After Darshan and Langar, continue the journey towards <strong>Bhatinda</strong>. Upon arrival, check in to the hotel. Dinner and overnight stay at the hotel.
      </p><br/>
      <p><strong>Meals:</strong> Breakfast at the hotel • Langar lunch at the Gurdwara • Dinner at the hotel.</p>
    </div>)   
  },
  {
    day: 10,
    title: "Bhatinda – Talwandi Sabo (35 Kms | 60 minutes) - Amritsar (225 Kms / 5 Hrs)",
    description: (<div>
      <p>
        Begin your day with breakfast at the hotel before departing for <strong>Talwandi Sabo</strong>. Here, you will visit <strong>Gurdwara Takht Sri Damdama Sahib</strong>, revered as the fifth Takht of Sikhism. This historic site is where <strong>Guru Gobind Singh Ji</strong> finalised and authenticated the Adi Granth in 1706, incorporating the hymns of <strong>Guru Tegh Bahadur Ji</strong>. It is also remembered for the momentous <strong>Baisakhi of 1706</strong>, when Guru Ji prepared Amrit for nearly 1.2 lakh devotees — a tradition still honoured with deep devotion each year.
      </p><br/>
      <p> Following the visit, continue the journey to <strong>Amritsar</strong>, stopping en route for Darshan at <strong>Tarn Taran</strong>. On arrival, check in to your hotel for a <strong>twonight stay</strong>. Dinner and overnight stay at the hotel.
      </p><br/>
      <p><strong>Meals:</strong> Breakfast at the hotel • Langar lunch at the Gurdwara • Dinner at the hotel.</p>
    </div>)  
  },
  {
    day: 11,
    title: "In Amritsar",
    description: (<div>
      <p>Early this morning, visit <strong>Gurdwara Sri Akal Takht Sahib Ji</strong> and witness the <strong>Palki Sewa</strong>, followed by prayers and Darshan at <strong>Sri Harmandir Sahib Ji (Golden Temple)</strong>. You will also have the opportunity to partake in Langar at the world’s largest community kitchen, where <strong>tens of thousands of people</strong> are served freshly prepared meals every day at no cost.
      </p><br/>
      <p> Return to your hotel for breakfast. The remainder of the day is free for guests’ own independent activities. Dinner and overnight stay at the hotel.
      </p><br/>
      <p><strong>Meals:</strong> Breakfast at the hotel • No lunch (free day) • Dinner at the hotel.</p>
    </div>)  
  },
  {
    day: 12,
    title: "Departure out of Amritsar",
    description: (<div>
      <p>The group will be transferred to <strong>Amritsar Airport</strong> as scheduled for onward flights to the UK. Upon arrival in London, the tour comes to an end.</p><br/>
      <p> <strong>Passengers Extending Their Stay in India:</strong> Guests planning to extend their stay in Punjab may check out of the hotel on <strong>16th October 2026 by 1100 hours</strong>. All onward departures will need to be arranged <strong>independently</strong>, unless prior arrangements have been made with us.
      </p><br/>
      <p><strong>End of the Services!</strong></p>
    </div>)  
  }
];
