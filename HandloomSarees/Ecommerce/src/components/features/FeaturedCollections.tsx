// import { Link } from 'react-router-dom';
// import { ArrowRight, Sparkles } from 'lucide-react';
// import { useState, useEffect, useRef } from 'react';
// import img1 from '@/assets/img8.jpg';
// import img2 from '@/assets/img9.jpg';
// import img3 from '@/assets/img10.jpg';

// const CSS = `
// @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Jost:wght@300;400;500;600&display=swap');

// .fc-root {
//   position: relative;
//   padding: 100px 0 110px;
//   background: linear-gradient(170deg, #FFF9F0 0%, #F8EEE2 50%, #F5E6D3 100%);
//   overflow: hidden;
//   font-family: 'Jost', sans-serif;
// }

// /* bg decoration */
// .fc-orb-a {
//   position: absolute; top: -60px; right: -60px;
//   width: 400px; height: 400px; border-radius: 50%;
//   background: radial-gradient(circle, rgba(196,152,10,.08) 0%, transparent 70%);
//   pointer-events: none;
// }
// .fc-orb-b {
//   position: absolute; bottom: -80px; left: -80px;
//   width: 500px; height: 500px; border-radius: 50%;
//   background: radial-gradient(circle, rgba(128,0,32,.07) 0%, transparent 70%);
//   pointer-events: none;
// }

// .fc-wrap {
//   max-width: 1280px; margin: 0 auto;
//   padding: 0 56px; position: relative; z-index: 1;
// }
// @media(max-width:900px){ .fc-wrap { padding: 0 24px; } }
// @media(max-width:480px){ .fc-wrap { padding: 0 16px; } }

// /* HEADER */
// .fc-head {
//   text-align: center; margin-bottom: 64px;
//   transition: opacity .9s, transform .9s;
// }
// .fc-head.hidden { opacity: 0; transform: translateY(28px); }
// .fc-head.visible { opacity: 1; transform: translateY(0); }

// .fc-badge {
//   display: inline-flex; align-items: center; gap: 8px;
//   background: rgba(196,152,10,.12); border: 1px solid rgba(196,152,10,.35);
//   padding: 7px 20px; border-radius: 100px; margin-bottom: 18px;
// }
// .fc-ey {
//   font-family: 'Jost'; font-size: 11px; letter-spacing: .26em;
//   text-transform: uppercase; color: #C4980A; font-weight: 600;
// }
// .fc-title {
//   font-family: 'Cormorant Garamond', serif;
//   font-size: clamp(36px, 5.5vw, 60px);
//   font-weight: 400; color: #800020; line-height: 1.07; margin-bottom: 16px;
// }
// .fc-gd {
//   width: 56px; height: 1px; background: #C4980A; margin: 0 auto 20px;
// }
// .fc-subtitle {
//   font-family: 'Jost'; font-size: 15px; font-weight: 300;
//   color: #4a3828; line-height: 1.8; max-width: 520px; margin: 0 auto;
// }

// /* GRID */
// .fc-grid {
//   display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px;
// }
// @media(max-width:900px){ .fc-grid { grid-template-columns: 1fr; gap: 22px; } }

// /* CARD */
// .fc-card {
//   position: relative; border-radius: 24px; overflow: hidden;
//   aspect-ratio: 3 / 4;
//   box-shadow: 0 16px 56px rgba(0,0,0,.14);
//   transition: transform .65s cubic-bezier(.4,0,.2,1), box-shadow .65s, opacity .7s;
//   display: block; text-decoration: none;
// }
// .fc-card.hidden { opacity: 0; transform: translateY(40px); }
// .fc-card.visible { opacity: 1; transform: translateY(0); }
// .fc-card:hover { transform: translateY(-8px); box-shadow: 0 28px 80px rgba(0,0,0,.22); }

// .fc-card-img {
//   position: absolute; inset: 0;
//   width: 100%; height: 100%; object-fit: cover;
//   transition: transform 1s cubic-bezier(.4,0,.2,1);
// }
// .fc-card:hover .fc-card-img { transform: scale(1.08); }

// /* gradient overlay */
// .fc-card-overlay {
//   position: absolute; inset: 0;
//   transition: opacity .5s;
// }

// /* Gold shimmer sweep */
// .fc-card-shine {
//   position: absolute; inset: 0; pointer-events: none; overflow: hidden;
// }
// .fc-card-shine::after {
//   content: '';
//   position: absolute; top: 0; left: -80%; width: 60%; height: 100%;
//   background: linear-gradient(90deg, transparent, rgba(196,152,10,.22), transparent);
//   transform: skewX(-15deg);
//   transition: left 0s;
// }
// .fc-card:hover .fc-card-shine::after {
//   left: 130%;
//   transition: left 1.1s cubic-bezier(.4,0,.2,1);
// }

// /* Glass panel */
// .fc-card-panel {
//   position: absolute; bottom: 0; left: 0; right: 0;
//   padding: 26px 28px;
//   backdrop-filter: blur(12px);
//   background: rgba(0,0,0,.32);
//   border-top: 1px solid rgba(196,152,10,.35);
// }

// .fc-card-line {
//   height: 2px; background: #C4980A;
//   width: 48px;
//   margin-bottom: 14px;
//   border-radius: 1px;
//   transition: width .5s cubic-bezier(.4,0,.2,1);
// }
// .fc-card:hover .fc-card-line { width: 80px; }

// .fc-card-title {
//   font-family: 'Cormorant Garamond', serif;
//   font-size: clamp(22px, 3vw, 30px);
//   font-weight: 500; color: white; line-height: 1.1;
//   margin-bottom: 8px;
//   transition: transform .45s;
// }
// .fc-card:hover .fc-card-title { transform: translateY(-3px); }

// .fc-card-desc {
//   font-family: 'Jost'; font-size: 13px; font-weight: 300;
//   color: rgba(255,255,255,.8); line-height: 1.6;
//   margin-bottom: 18px;
//   transition: transform .45s .04s;
// }
// .fc-card:hover .fc-card-desc { transform: translateY(-3px); }

// .fc-card-cta {
//   display: flex; align-items: center; gap: 6px;
//   font-family: 'Jost'; font-size: 12px; letter-spacing: .14em;
//   font-weight: 600; text-transform: uppercase; color: #D4AF37;
//   position: relative;
// }
// .fc-card-cta-label {
//   position: relative;
// }
// .fc-card-cta-label::after {
//   content: ''; position: absolute; left: 0; bottom: -2px;
//   width: 0; height: 1px; background: #D4AF37;
//   transition: width .45s;
// }
// .fc-card:hover .fc-card-cta-label::after { width: 100%; }

// .fc-card-arrow {
//   transition: transform .45s;
// }
// .fc-card:hover .fc-card-arrow { transform: translateX(5px); }

// /* gold ring on hover */
// .fc-card-ring {
//   position: absolute; inset: 0; border-radius: 24px;
//   border: 1.5px solid transparent;
//   transition: border-color .45s;
//   pointer-events: none; z-index: 3;
// }
// .fc-card:hover .fc-card-ring { border-color: rgba(196,152,10,.55); }

// @media(max-width:480px){
//   .fc-card-panel { padding: 20px 20px; }
// }
// `;

// const COLLECTIONS = [
//   {
//     title: 'Wedding Collection',
//     description: 'Luxurious silk sarees woven for your most cherished day',
//     image: img1,
//     link: '/shop?occasion=Wedding',
//     overlay: 'linear-gradient(to top, rgba(128,0,32,.88) 0%, rgba(75,0,130,.55) 45%, transparent 80%)',
//   },
//   {
//     title: 'Festive Sarees',
//     description: 'Celebrate traditions with vibrant heritage colours',
//     image: img2,
//     link: '/shop?occasion=Festive',
//     overlay: 'linear-gradient(to top, rgba(75,0,130,.88) 0%, rgba(128,0,32,.55) 45%, transparent 80%)',
//   },
//   {
//     title: 'Casual Elegance',
//     description: 'Handwoven cotton for effortless everyday grace',
//     image: img3,
//     link: '/shop?occasion=Casual',
//     overlay: 'linear-gradient(to top, rgba(10,4,2,.90) 0%, rgba(128,0,32,.55) 45%, transparent 80%)',
//   },
// ];

// export function FeaturedCollections() {
//   const [isVisible, setIsVisible] = useState(false);
//   const sectionRef = useRef<HTMLElement>(null);

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       entries => { if (entries[0].isIntersecting) setIsVisible(true); },
//       { threshold: 0.12 }
//     );
//     if (sectionRef.current) observer.observe(sectionRef.current);
//     return () => observer.disconnect();
//   }, []);

//   return (
//     <>
//       <style>{CSS}</style>
//       <section className="fc-root" ref={sectionRef}>
//         <div className="fc-orb-a" /><div className="fc-orb-b" />

//         <div className="fc-wrap">

//           {/* Header */}
//           <div className={`fc-head ${isVisible ? 'visible' : 'hidden'}`}>
//             <div className="fc-badge">
//               <Sparkles size={13} color="#C4980A" />
//               <span className="fc-ey">Curated Collections</span>
//             </div>
//             <h2 className="fc-title">Featured Collections</h2>
//             <div className="fc-gd" />
//             <p className="fc-subtitle">
//               Discover timeless handwoven elegance crafted by master artisans across India.
//             </p>
//           </div>

//           {/* Cards */}
//           <div className="fc-grid">
//             {COLLECTIONS.map((col, i) => (
//               <Link
//                 key={i}
//                 to={col.link}
//                 className={`fc-card ${isVisible ? 'visible' : 'hidden'}`}
//                 style={{ transitionDelay: `${i * 180}ms` }}
//               >
//                 <img src={col.image} alt={col.title} className="fc-card-img" />
//                 <div className="fc-card-overlay" style={{ background: col.overlay }} />
//                 <div className="fc-card-shine" />

//                 <div className="fc-card-panel">
//                   <div className="fc-card-line" />
//                   <h3 className="fc-card-title">{col.title}</h3>
//                   <p className="fc-card-desc">{col.description}</p>
//                   <div className="fc-card-cta">
//                     <span className="fc-card-cta-label">Explore Now</span>
//                     <ArrowRight size={14} className="fc-card-arrow" />
//                   </div>
//                 </div>

//                 <div className="fc-card-ring" />
//               </Link>
//             ))}
//           </div>

//         </div>
//       </section>
//     </>
//   );
// }


//below code is updated code 
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Jost:wght@300;400;500;600&display=swap');

.fc-root {
  position: relative;
  padding: 100px 0 110px;
  background: linear-gradient(170deg, #FFF9F0 0%, #F8EEE2 50%, #F5E6D3 100%);
  overflow: hidden;
  font-family: 'Jost', sans-serif;
}

.fc-orb-a {
  position: absolute; top: -60px; right: -60px;
  width: 400px; height: 400px; border-radius: 50%;
  background: radial-gradient(circle, rgba(196,152,10,.08) 0%, transparent 70%);
  pointer-events: none;
}

.fc-orb-b {
  position: absolute; bottom: -80px; left: -80px;
  width: 500px; height: 500px; border-radius: 50%;
  background: radial-gradient(circle, rgba(128,0,32,.07) 0%, transparent 70%);
  pointer-events: none;
}

.fc-wrap {
  max-width: 1280px; margin: 0 auto;
  padding: 0 56px; position: relative; z-index: 1;
}
@media(max-width:900px){ .fc-wrap { padding: 0 24px; } }
@media(max-width:480px){ .fc-wrap { padding: 0 16px; } }

.fc-head {
  text-align: center; margin-bottom: 64px;
  transition: opacity .9s, transform .9s;
}
.fc-head.hidden { opacity: 0; transform: translateY(28px); }
.fc-head.visible { opacity: 1; transform: translateY(0); }

.fc-badge {
  display: inline-flex; align-items: center; gap: 8px;
  background: rgba(196,152,10,.12); border: 1px solid rgba(196,152,10,.35);
  padding: 7px 20px; border-radius: 100px; margin-bottom: 18px;
}
.fc-ey {
  font-family: 'Jost'; font-size: 11px; letter-spacing: .26em;
  text-transform: uppercase; color: #C4980A; font-weight: 600;
}
.fc-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(36px, 5.5vw, 60px);
  font-weight: 400; color: #800020; line-height: 1.07; margin-bottom: 16px;
}
.fc-gd {
  width: 56px; height: 1px; background: #C4980A; margin: 0 auto 20px;
}
.fc-subtitle {
  font-family: 'Jost'; font-size: 15px; font-weight: 300;
  color: #4a3828; line-height: 1.8; max-width: 520px; margin: 0 auto;
}

.fc-loading,
.fc-empty,
.fc-error {
  text-align: center;
  padding: 40px 20px;
  font-size: 14px;
  color: #6d5a4b;
}

.fc-error {
  color: #b42318;
}

.fc-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px;
}
@media(max-width:900px){ .fc-grid { grid-template-columns: 1fr; gap: 22px; } }

.fc-card {
  position: relative; border-radius: 24px; overflow: hidden;
  aspect-ratio: 3 / 4;
  box-shadow: 0 16px 56px rgba(0,0,0,.14);
  transition: transform .65s cubic-bezier(.4,0,.2,1), box-shadow .65s, opacity .7s;
  display: block; text-decoration: none;
}
.fc-card.hidden { opacity: 0; transform: translateY(40px); }
.fc-card.visible { opacity: 1; transform: translateY(0); }
.fc-card:hover { transform: translateY(-8px); box-shadow: 0 28px 80px rgba(0,0,0,.22); }

.fc-card-img {
  position: absolute; inset: 0;
  width: 100%; height: 100%; object-fit: cover;
  transition: transform 1s cubic-bezier(.4,0,.2,1);
}
.fc-card:hover .fc-card-img { transform: scale(1.08); }

.fc-card-overlay {
  position: absolute; inset: 0;
  transition: opacity .5s;
}

.fc-card-shine {
  position: absolute; inset: 0; pointer-events: none; overflow: hidden;
}
.fc-card-shine::after {
  content: '';
  position: absolute; top: 0; left: -80%; width: 60%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(196,152,10,.22), transparent);
  transform: skewX(-15deg);
  transition: left 0s;
}
.fc-card:hover .fc-card-shine::after {
  left: 130%;
  transition: left 1.1s cubic-bezier(.4,0,.2,1);
}

.fc-card-panel {
  position: absolute; bottom: 0; left: 0; right: 0;
  padding: 26px 28px;
  backdrop-filter: blur(12px);
  background: rgba(0,0,0,.32);
  border-top: 1px solid rgba(196,152,10,.35);
}

.fc-card-line {
  height: 2px; background: #C4980A;
  width: 48px;
  margin-bottom: 14px;
  border-radius: 1px;
  transition: width .5s cubic-bezier(.4,0,.2,1);
}
.fc-card:hover .fc-card-line { width: 80px; }

.fc-card-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(22px, 3vw, 30px);
  font-weight: 500; color: white; line-height: 1.1;
  margin-bottom: 8px;
  transition: transform .45s;
}
.fc-card:hover .fc-card-title { transform: translateY(-3px); }

.fc-card-desc {
  font-family: 'Jost'; font-size: 13px; font-weight: 300;
  color: rgba(255,255,255,.8); line-height: 1.6;
  margin-bottom: 18px;
  transition: transform .45s .04s;
}
.fc-card:hover .fc-card-desc { transform: translateY(-3px); }

.fc-card-cta {
  display: flex; align-items: center; gap: 6px;
  font-family: 'Jost'; font-size: 12px; letter-spacing: .14em;
  font-weight: 600; text-transform: uppercase; color: #D4AF37;
  position: relative;
}
.fc-card-cta-label {
  position: relative;
}
.fc-card-cta-label::after {
  content: ''; position: absolute; left: 0; bottom: -2px;
  width: 0; height: 1px; background: #D4AF37;
  transition: width .45s;
}
.fc-card:hover .fc-card-cta-label::after { width: 100%; }

.fc-card-arrow {
  transition: transform .45s;
}
.fc-card:hover .fc-card-arrow { transform: translateX(5px); }

.fc-card-ring {
  position: absolute; inset: 0; border-radius: 24px;
  border: 1.5px solid transparent;
  transition: border-color .45s;
  pointer-events: none; z-index: 3;
}
.fc-card:hover .fc-card-ring { border-color: rgba(196,152,10,.55); }

@media(max-width:480px){
  .fc-card-panel { padding: 20px 20px; }
}
`;

type CollectionItem = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  banner_image?: string;
  image?: string;
  image_url?: string;
  thumbnail?: string;
  is_active?: boolean;
  is_featured?: boolean;
};

type CollectionsResponse = {
  success?: boolean;
  message?: string;
  data?: CollectionItem[];
};

const OVERLAYS = [
  'linear-gradient(to top, rgba(128,0,32,.88) 0%, rgba(75,0,130,.55) 45%, transparent 80%)',
  'linear-gradient(to top, rgba(75,0,130,.88) 0%, rgba(128,0,32,.55) 45%, transparent 80%)',
  'linear-gradient(to top, rgba(10,4,2,.90) 0%, rgba(128,0,32,.55) 45%, transparent 80%)',
];

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop';

export function FeaturedCollections() {
  const [collections, setCollections] = useState<CollectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setIsVisible(true);
      },
      { threshold: 0.12 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setLoading(true);
        setError('');

        const res = await fetch('http://127.0.0.1:8000/api/v1/collections');
        const data: CollectionsResponse = await res.json();

        const items = Array.isArray(data?.data) ? data.data : [];
        const activeItems = items.filter((item) => item.is_active !== false);
        const featuredItems = activeItems.filter((item) => item.is_featured);

        setCollections(featuredItems.length > 0 ? featuredItems : activeItems);
      } catch (err) {
        console.error('Failed to fetch collections', err);
        setError('Failed to load collections');
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  return (
    <>
      <style>{CSS}</style>

      <section className="fc-root" ref={sectionRef}>
        <div className="fc-orb-a" />
        <div className="fc-orb-b" />

        <div className="fc-wrap">
          <div className={`fc-head ${isVisible ? 'visible' : 'hidden'}`}>
            <div className="fc-badge">
              <Sparkles size={13} color="#C4980A" />
              <span className="fc-ey">Curated Collections</span>
            </div>

            <h2 className="fc-title">Featured Collections</h2>
            <div className="fc-gd" />

            <p className="fc-subtitle">
              Discover timeless handwoven elegance crafted by master artisans across India.
            </p>
          </div>

          {loading ? (
            <div className="fc-loading">Loading collections...</div>
          ) : error ? (
            <div className="fc-error">{error}</div>
          ) : collections.length === 0 ? (
            <div className="fc-empty">No collections available right now.</div>
          ) : (
            <div className="fc-grid">
              {collections.map((col, i) => {
                const image =
                  col.banner_image ||
                  col.image ||
                  col.image_url ||
                  col.thumbnail ||
                  FALLBACK_IMAGE;

                return (
                  <Link
                    key={col.id}
                    to={`/collections/${col.slug}`}
                    className={`fc-card ${isVisible ? 'visible' : 'hidden'}`}
                    style={{ transitionDelay: `${i * 180}ms` }}
                  >
                    <img
                      src={image}
                      alt={col.name}
                      className="fc-card-img"
                    />

                    <div
                      className="fc-card-overlay"
                      style={{
                        background: OVERLAYS[i % OVERLAYS.length],
                      }}
                    />

                    <div className="fc-card-shine" />

                    <div className="fc-card-panel">
                      <div className="fc-card-line" />
                      <h3 className="fc-card-title">{col.name}</h3>
                      <p className="fc-card-desc">
                        {col.description || 'Explore this curated handloom collection.'}
                      </p>

                      <div className="fc-card-cta">
                        <span className="fc-card-cta-label">Explore Now</span>
                        <ArrowRight size={14} className="fc-card-arrow" />
                      </div>
                    </div>

                    <div className="fc-card-ring" />
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}