import { useState } from 'react';
import { Download, Phone, Mail, Plane, CreditCard, Compass, MapPin, ChevronDown, ChevronUp } from 'lucide-react';

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
    const bodyText = `Name: ${enquiryName}\nContact Number: ${enquiryPhone}\nEmail: ${enquiryEmail}\nMessage:\n${enquiryMessage}`;

    // Save a copy in localStorage (captured)
    try {
      const saved = JSON.parse(localStorage.getItem('enquiries') || '[]');
      saved.push({ name: enquiryName, phone: enquiryPhone, email: enquiryEmail, message: enquiryMessage, date: new Date().toISOString() });
      localStorage.setItem('enquiries', JSON.stringify(saved));
    } catch (err) {
      console.warn('Could not save enquiry to localStorage', err);
    }

    // Attempt server-side send first
    (async () => {
      try {
        const resp = await fetch('/api/enquiry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: enquiryName, phone: enquiryPhone, email: enquiryEmail, message: enquiryMessage }),
        });

        if (resp.ok) {
          setEnquiryName('');
          setEnquiryPhone('');
          setEnquiryEmail('');
          setEnquiryMessage('');
          alert('Enquiry submitted successfully.');
          return;
        }
      } catch (err) {
        console.warn('Server send failed, falling back to mailto', err);
      }

      // Fallback to mailto if server-side not available
      const mailto = `mailto:shivansh@immerseindiatours.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
      window.open(mailto);
      setEnquiryName('');
      setEnquiryPhone('');
      setEnquiryEmail('');
      setEnquiryMessage('');
      setTimeout(() => alert('Enquiry captured and mail client opened (fallback). If neither worked, configure server SMTP.'), 200);
    })();
  };

  // Download itinerary section as PDF (client-side)
  const downloadItineraryPDF = async () => {
    try {
      const { jsPDF } = await import('jspdf');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const marginX = 14;
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const usableWidth = pageWidth - marginX * 2;
      let cursorY = 16;

      const ensureSpace = (neededHeight: number) => {
        if (cursorY + neededHeight > pageHeight - 16) {
          pdf.addPage();
          cursorY = 16;
        }
      };

      const addHeading = (text: string, size: number, bold = true, gapAfter = 4) => {
        pdf.setFont('helvetica', bold ? 'bold' : 'normal');
        pdf.setFontSize(size);
        const lines = pdf.splitTextToSize(text, usableWidth);
        ensureSpace(lines.length * (size * 0.45) + gapAfter);
        pdf.text(lines, marginX, cursorY);
        cursorY += lines.length * (size * 0.45) + gapAfter;
      };

      const addParagraph = (text: string, size = 11, gapAfter = 4) => {
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(size);
        const lines = pdf.splitTextToSize(text, usableWidth);
        ensureSpace(lines.length * (size * 0.45) + gapAfter);
        pdf.text(lines, marginX, cursorY);
        cursorY += lines.length * (size * 0.45) + gapAfter;
      };

      addHeading('Itinerary Overview: Panj Takht Yatra', 16);
      addHeading('Dates: 05th – 16th October 2026', 12, true, 8);
      addHeading('Day Wise Programme', 13, true, 6);

      itineraryDays.forEach((day) => {
        const title = `${String(day.day).padStart(2, '0')}th Oct-26 (Day ${day.day}): ${day.title}`;
        addHeading(title, 11, true, 3);
        addParagraph(day.description, 10, 8);
      });

      pdf.save('Panj-Takht-Yatra-Itinerary.pdf');
    } catch (err) {
      console.error('Error generating PDF', err);
      alert('Could not generate PDF. Try reloading the page and allow images to load.');
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
      <div className="fixed right-1 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-3">
        <button
          onClick={() => scrollToSection('enquiry')}
          className="px-6 py-2 bg-[#C9A961] text-[#1A1A1A] hover:bg-[#D4A574] transition-all duration-300 tracking-wide shadow-md flex items-center gap-2 whitespace-nowrap rounded-sm text-sm"
        >
          Book Now
        </button>
        <button
          onClick={downloadItineraryPDF}
          className="px-6 py-2 bg-[#1E3A5F] text-white hover:bg-[#2A4A6F] transition-all duration-300 tracking-wide shadow-md flex items-center gap-2 whitespace-nowrap rounded-sm text-sm"
        >Download Itinerary
        </button>
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#D4A574]/20">
        <div className="max-w-7xl mx-auto px-6 h-[80px] flex items-center justify-between">
          {/* Logo */}
          <div className="h-full flex items-center">
            <img
              src="/takht.png"
              alt="Takht Sahib"
              className="h-full w-auto object-contain"
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
            <a href="/Terms&Conditions.pdf" className="text-[#1A1A1A] hover:text-[#C9A961] transition-colors" target="_blank" rel="noopener noreferrer">Terms & Conditions</a>
          </nav>

          {/* Book Now Button */}
          <button
            onClick={() => scrollToSection('enquiry')}
            className="px-6 py-2 bg-[#C9A961] text-[#1A1A1A] hover:bg-[#D4A574] transition-all duration-300 tracking-wide"
          >
            Book Now
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden mt-16">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1764782884713-08c039f92e71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=2000"
            alt="Golden Temple"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50" />
        </div>

        <div className="relative z-10 text-center text-white px-6 max-w-5xl mx-auto">
          <h1 className="mb-6 tracking-wide text-[64px]" style={{ fontFamily: 'var(--font-serif)' }}>
            Sri Panj Takht Sahib Yatra
          </h1>
          <p className="text-2xl md:text-3xl font-light tracking-wide mx-[0px] mt-[0px] mb-[10px]" style={{ fontFamily: 'var(--font-serif)' }}>
            12 Days Sacred Journey of a Lifetime
          </p>
          <p className="text-lg mb-12 tracking-widest opacity-90" style={{ fontFamily: 'var(--font-sans)' }}>(05 – 16 October 2026)</p>

          <div className="max-w-2xl mx-auto mb-12">
            
          </div>

          
        </div>
      </section>

      {/* Highlights Section with Icons */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-[#FAF7F2] rounded-full flex items-center justify-center">
                <CreditCard className="w-8 h-8 text-[#C9A961]" />
              </div>
              <p className="text-sm uppercase tracking-widest text-[#6B5D4F] mb-2">Early Bird Offer</p>
              <div className="flex items-baseline justify-center gap-3">
                <span className="text-base text-[#9A8F7E] line-through">£2350</span>
                <span className="text-3xl" style={{ fontFamily: 'var(--font-serif)' }}>£2250<span className="text-sm align-top">*</span></span>
              </div>
              <p className="text-sm text-[#6B5D4F] mt-2">Based on twin / triple share</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-[#FAF7F2] rounded-full flex items-center justify-center">
                <Download className="w-8 h-8 text-[#C9A961]" />
              </div>
              <p className="text-sm uppercase tracking-widest text-[#6B5D4F] mb-2">Experience</p>
              <p className="text-2xl" style={{ fontFamily: 'var(--font-serif)' }}>Spiritual Journey</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-[#FAF7F2] rounded-full flex items-center justify-center">
                <Plane className="w-8 h-8 text-[#C9A961]" />
              </div>
              <p className="text-sm uppercase tracking-widest text-[#6B5D4F] mb-2">Flights</p>
              <p className="text-2xl" style={{ fontFamily: 'var(--font-serif)' }}>Included</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-[#FAF7F2] rounded-full flex items-center justify-center">
                <Compass className="w-8 h-8 text-[#C9A961]" />
              </div>
              <p className="text-sm uppercase tracking-widest text-[#6B5D4F] mb-2">Experience</p>
              <p className="text-2xl" style={{ fontFamily: 'var(--font-serif)' }}>Guided Yatra</p>
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
             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-1 max-w-3xl mx-auto text-left text-[15px] leading-[1.6]">
                <p><strong>Sri Hazur Sahib,</strong> Nanded</p>
                <p><strong>Sri Harmandir Sahib,</strong> Patna</p>

                <p><strong>Sri Kesgarh Sahib,</strong> Anandpur Sahib</p>
                <p><strong>Sri Damdama Sahib,</strong> Talwandi Sabo</p>

                <p><strong>Sri Akal Takht Sahib,</strong> Amritsar</p>
              </div>
            <p className="text-[15px]">
              This pilgrimage also offers the opportunity to explore other historically significant Gurudwaras, and sacred sites located around these major centers of worship, enriching the spiritual and cultural experience even further.
            </p>
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
              <p className="text-sm uppercase tracking-widest text-[#6B5D4F] mb-2 font-bold">Starting From</p>
              <p className="text-lg" style={{ fontFamily: 'var(--font-serif)' }}>£2250</p>
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
        <div className="grid grid-cols-5 gap-2 px-4">
          {["/1.png", "/2.png", "/3.png", "/4.png", "/5.png"].map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`Temple image ${index + 1}`}
              className="w-full h-[240px] object-cover rounded-md"
            />
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
                <li className="text-[15px]">All domestic flights</li>
                <li className="text-[15px]">Airport transfers</li>
                <li className="text-[15px]">Private coach transport</li>
                <li className="text-[14px]">Experienced guide</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl mb-4 text-[#C9A961]" style={{ fontFamily: 'var(--font-serif)' }}>Accommodation</h3>
              <ul className="space-y-2 text-[#3A3A3A]">
                <li className="text-[15px]">10 nights quality hotels</li>
                <li className="text-[15px]">Twin/double rooms</li>
                <li className="text-[15px]">Daily housekeeping</li>
                <li className="text-[14px]">Modern amenities</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl mb-4 text-[#C9A961]" style={{ fontFamily: 'var(--font-serif)' }}>Experiences</h3>
              <ul className="space-y-2 text-[#3A3A3A]">
                <li className="text-[14px]">All Five Takhts visits</li>
                <li className="text-[15px]">Guided Gurudwara tours</li>
                <li className="text-[15px]">Evening prayers & kirtan</li>
                <li className="text-[15px]">Langar participation</li>
                <li className="text-[15px]">Historical insights</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl mb-4 text-[#C9A961]" style={{ fontFamily: 'var(--font-serif)' }}>Meals</h3>
              <ul className="space-y-2 text-[#3A3A3A]">
                <li className="text-[15px]">Daily breakfast</li>
                <li className="text-[15px]">Selected lunches</li>
                <li className="text-[15px]">Selected dinners</li>
                <li className="text-[15px]">Vegetarian options</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl mb-4 text-[#C9A961]" style={{ fontFamily: 'var(--font-serif)' }}>Assistance</h3>
              <ul className="space-y-2 text-[#3A3A3A]">
                <li className="text-[15px]">24/7 support</li>
                <li className="text-[15px]">Travel documentation</li>
                <li className="text-[14px]">Pre-departure briefing</li>
                <li className="text-[15px]">ATOL protection</li>
              </ul>
            </div>
          </div>

          <div className="pt-12 border-t border-[#D4A574]/30">
            <h2 className="text-3xl mb-8" style={{ fontFamily: 'var(--font-serif)' }}>Your Journey Excludes</h2>
            <ul className="grid md:grid-cols-3 gap-4 text-[#3A3A3A]">
              <li className="text-[15px]">Any VISA, Insurance, etc.</li>
              <li className="text-[15px]">Expenses of personal nature</li>
              <li className="text-[15px]">Tips to driver, tour guide, helper, etc.</li>
              <li className="text-[14px]">Any item which is not mentioned in “Includes”.</li>
              <li className="text-[15px]">Extension of stay or routing, like different return dates, etc.</li>
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

          <p className="text-center text-sm text-[#6B5D4F] mt-8">
            Or email us directly at <a href="mailto:info@sikhchannelyatras.com" className="text-[#C9A961] hover:underline">info@sikhchannelyatras.com</a>
          </p>
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
                Creating meaningful spiritual journeys with reverence, authenticity, and care since our inception.
              </p>
            </div>

            <div>
              <h4 className="text-lg mb-4" style={{ fontFamily: 'var(--font-serif)' }}>Contact</h4>
              <div className="space-y-2 text-sm opacity-80">
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  0203 909 5800
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  info@sikhchannelyatras.com
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-lg mb-4" style={{ fontFamily: 'var(--font-serif)' }}>Partner</h4>
              <p className="text-sm opacity-80">
                Sparrow Path<br />
                Luxury Spiritual Travel
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-white/20 space-y-6">
            {/* Logos and managed by */}
            <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
              <div className="flex items-center gap-4">
                <img src="/atol.png" alt="ATOL" className="h-10" />
                <img src="/channel.png" alt="Channel" className="h-10" />
                <img src="/pts.png" alt="PTS" className="h-10" />
                <img src="/sparrowpath.png" alt="Sparrow Path" className="h-10" />
              </div>
              <div className="text-right text-sm opacity-90">
                <div>Managed by <strong>Sparrow Path</strong></div>
              </div>
            </div>

            {/* ATOL protection statement */}
            <div className="bg-white/5 p-4 rounded-md text-[13px] text-white/90 leading-relaxed">
              All the flights and flight-inclusive holidays on this website are financially protected by the ATOL scheme. When you pay you will be supplied with an ATOL Certificate. Please ask for it and check to ensure that everything you booked (flights, hotels and other services) is listed on it. Please see our booking conditions for further information or for more information about financial protection and the ATOL Certificate go to: <a href="https://www.atol.org.uk/atolcertificate" className="underline">www.atol.org.uk/atolcertificate</a>.
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm opacity-70">
              <p>© 2026 Sikh Channel Yatras. All rights reserved.</p>
              <div className="flex gap-6">
                <a href="" className="hover:opacity-100 transition-opacity">Privacy Policy</a>
                <a href="/Terms&Conditions.pdf" className="hover:opacity-100 transition-opacity" target="_blank" rel="noopener">Terms & Conditions</a>
              </div>
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
    description: "Board overnight flights from London Heathrow."
  },
  {
    day: 2,
    title: "Arrival in Hyderabad",
    description: "Arrival in Hyderabad. Transfer to hotel for an overnight stay. Meals: Dinner at the hotel."
  },
  {
    day: 3,
    title: "Travel Hyderabad to (Hazur Sahib) via Nanak Jhira Sahib. (8 hours)",
    description: "Travel to Bidar, Karnataka. Visit Gurdwara Sri Nanak Jhira Sahib for Darshan. Continue the journey to Nanded for a 2-night stay. Meals: Breakfast • Langar lunch at the Gurdwara • Dinner at the hotel."
  },
  {
    day: 4,
    title: "In Hazur Sahib",
    description: "Early morning visit to Gurdwara Takht Sri Hazur Sahib Ji. Later visit other significant historical Gurdwaras in Nanded, followed by Langar at one of the Gurdwaras. Meals: Breakfast • Langar lunch at the Gurdwara • Langar dinner at the Gurdwara."
  },
  {
    day: 5,
    title: "Travel Hazur Sahib – Hyderabad Airport (6 hours) / Fly to Patna",
    description: "Travel to Hyderabad Hyderabad Airport and fly to Patna for 2-night stay. Meals: Breakfast • Langar Lunch at the Gurdwara • Dinner at the hotel."
  },
  {
    day: 6,
    title: "In Patna Sahib (Visit the Takht Sri Harmandir Sahib, Patna)",
    description: "Visit Takht Sri Harmandir Sahib and other important and historic Gurdwaras. Meals: Breakfast • Langar Lunch at the Gurdwara • Dinner at the hotel."
  },
  {
    day: 7,
    title: "Fly Patna to Chandigarh. (By Flight) & travel to Mohali",
    description: "Fly Patna to Chandigarh. Transfer to hotel in Mohali for a 2-night stay. Meals: Breakfast • Light refreshments • Dinner at the hotel."
  },
  {
    day: 8,
    title: "In Mohali (Chandigarh) – Day trip to Anandpur Sahib (1 hour)",
    description: "Visit, Anandpur Fort, Takht Sri Kesgarh Sahib Ji and Sis Ganj Gurdwara. Meals: Breakfast • Langar Lunch at the Gurdwara • Dinner at the hotel."
  },
  {
    day: 9,
    title: "Mohali – Fatehgarh Sahib - Bhatinda (5 Hrs)",
    description: "Visit Sri Fatehgarh Sahib in Sirhind. Travel to Bhatinda for 1 night stay. Continue the journey towards Bhatinda for an overnight stay. Meals: Breakfast • Langar Lunch at the Gurdwara • Dinner at the hotel."
  },
  {
    day: 10,
    title: "Bhatinda – Talwandi Sabo - Amritsar (225 Kms / 7 Hrs)",
    description: "Visit Gurdwara Takht Sri Damdama Sahib. Travel to Amritsar a 2-night stay. Meals: Breakfast • Langar Lunch at the Gurdwara • Dinner at the hotel."
  },
  {
    day: 11,
    title: "In Amritsar",
    description: "Early morning visit the Sri Akal Takht Sahib ji & Sri Harmandir Sahib. Rest of the day free for own activities. Meals: Breakfast • No lunch (Free day) • Dinner at the hotel."
  },
  {
    day: 12,
    title: "Departure out of Amritsar",
    description: "Take your flights back to the UK or pre-arrange an extension of stay. Return to UK."
  }
];
