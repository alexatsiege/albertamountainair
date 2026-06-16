// Reviews.tsx — React island with Framer Motion animations
// Usage: <Reviews client:load reviews={reviews} heading={heading} />

import { motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';

interface Review {
  name: string;
  rating: number;
  text: string;
  date?: string;
  source?: 'google' | 'bbb' | 'homeadvisor';
}

interface Props {
  reviews?: Review[];
  heading?: string;
  rating?: number;
  reviewCount?: number;
  businessName?: string;
}

const defaultReviews: Review[] = [
  { name: 'Sarah M.', rating: 5, text: 'Called at 8am and they were at my door by 10. Fixed the furnace in under an hour. Incredibly professional and reasonably priced.', date: '2 weeks ago', source: 'google' },
  { name: 'Jason K.', rating: 5, text: 'Best HVAC company in the area. Fair pricing, showed up on time, and the technician actually explained what was wrong and why. Will never call anyone else.', date: '1 month ago', source: 'google' },
  { name: 'Lisa P.', rating: 5, text: 'Our AC went out on the hottest day of the summer and they had it fixed quickly. Professional, courteous, and reasonably priced. Cannot recommend enough!', date: '3 weeks ago', source: 'google' },
  { name: 'Mike R.', rating: 5, text: 'Got three quotes for a new heat pump. Jay Moody was the most honest — they told me what I actually needed, not the most expensive option. Installed perfectly.', date: '2 months ago', source: 'google' },
  { name: 'Karen T.', rating: 5, text: 'Annual tune-up service is worth every penny. Technician was thorough, polite, and left the area spotless. Our system runs better than it has in years.', date: '1 month ago', source: 'google' },
  { name: 'David H.', rating: 5, text: 'Had them install a mini-split in our addition. Perfect job, cleaned up everything, and the Mass Save® rebate process was easier than expected because they handled the paperwork.', date: '3 months ago', source: 'google' },
];

const StarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#FBBC05">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

const GoogleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

export default function Reviews({ reviews = defaultReviews, heading = 'What Our Customers Say', rating = 4.9, reviewCount = 280, businessName = 'Our Company' }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  const cardVariants = {
    hidden:  { opacity: 0, y: 30, scale: 0.97 },
    visible: (i: number) => ({
      opacity: 1, y: 0, scale: 1,
      transition: { delay: prefersReducedMotion ? 0 : i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    }),
  };

  return (
    <section className="reviews-section" id="reviews">
      <div className="reviews-container">
        {/* Header */}
        <motion.div
          className="reviews-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="eyebrow-r">Customer Reviews</span>
          <h2 className="reviews-heading">{heading}</h2>
          <div className="reviews-aggregate">
            <div className="agg-score-r">{rating}</div>
            <div>
              <div className="agg-stars-r">{Array.from({ length: 5 }).map((_, i) => <StarIcon key={i} />)}</div>
              <div className="agg-count">Based on {reviewCount}+ verified reviews</div>
            </div>
            <div className="agg-source">
              <GoogleIcon /> Google Reviews
            </div>
          </div>
        </motion.div>

        {/* Cards */}
        <div className="reviews-grid">
          {reviews.map((review, i) => (
            <motion.div
              key={i}
              className="review-card"
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              whileHover={{ y: -6, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
            >
              <div className="card-top">
                <div className="reviewer-avatar">{review.name.charAt(0)}</div>
                <div>
                  <div className="reviewer-name">{review.name}</div>
                  <div className="review-stars">{Array.from({ length: review.rating }).map((_, j) => <StarIcon key={j} />)}</div>
                </div>
                <div className="review-source-badge">
                  {review.source === 'google' && <><GoogleIcon /><span>Google</span></>}
                </div>
              </div>
              <p className="review-text">"{review.text}"</p>
              <div className="review-date">{review.date}</div>
            </motion.div>
          ))}
        </div>

        {/* Overall CTA */}
        <motion.div
          className="reviews-footer"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <a
            href="https://www.google.com"
            target="_blank"
            rel="noopener"
            className="see-all-reviews"
          >
            See all {reviewCount}+ reviews on Google
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </motion.div>
      </div>

      <style>{`
        .reviews-section {
          padding: 80px 0;
          background: #F8F9FA;
        }
        .reviews-container {
          max-width: 1280px; margin: 0 auto; padding: 0 32px;
        }
        .reviews-header { text-align: center; margin-bottom: 48px; }
        .eyebrow-r {
          display: inline-block;
          font-size: 0.7rem; font-weight: 700; letter-spacing: 0.12em;
          text-transform: uppercase; color: #2563EB; margin-bottom: 12px;
        }
        .reviews-heading {
          font-family: 'Outfit', sans-serif;
          font-size: clamp(1.8rem, 3vw, 2.4rem); font-weight: 800;
          color: #1A1A2E; margin-bottom: 20px;
        }
        .reviews-aggregate {
          display: inline-flex; align-items: center; gap: 16px;
          background: #fff; border: 1px solid #E5E7EB;
          border-radius: 16px; padding: 14px 24px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
        }
        .agg-score-r { font-family: 'Outfit', sans-serif; font-size: 2rem; font-weight: 900; color: #1A1A2E; }
        .agg-stars-r { display: flex; gap: 2px; margin-bottom: 2px; }
        .agg-count { font-size: 0.75rem; color: #6B7280; }
        .agg-source {
          display: flex; align-items: center; gap: 6px;
          font-size: 0.78rem; color: #6B7280; font-weight: 600;
          border-left: 1px solid #E5E7EB; padding-left: 16px;
        }
        .reviews-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        .review-card {
          background: #fff; border: 1px solid #E5E7EB;
          border-radius: 16px; padding: 24px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.04);
          cursor: default;
        }
        .card-top {
          display: flex; align-items: center; gap: 12px;
          margin-bottom: 16px;
        }
        .reviewer-avatar {
          width: 40px; height: 40px; border-radius: 50%;
          background: #2563EB; color: #fff;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Outfit', sans-serif; font-weight: 700; font-size: 1rem;
          flex-shrink: 0;
        }
        .reviewer-name { font-weight: 700; font-size: 0.9rem; color: #1A1A2E; margin-bottom: 2px; }
        .review-stars { display: flex; gap: 1px; }
        .review-source-badge {
          margin-left: auto; display: flex; align-items: center; gap: 4px;
          font-size: 0.72rem; color: #9CA3AF; font-weight: 600;
        }
        .review-text {
          font-size: 0.875rem; color: #374151; line-height: 1.7;
          font-style: italic; margin-bottom: 16px;
        }
        .review-date { font-size: 0.72rem; color: #9CA3AF; }
        .reviews-footer { text-align: center; margin-top: 40px; }
        .see-all-reviews {
          display: inline-flex; align-items: center; gap: 8px;
          font-family: 'Outfit', sans-serif; font-size: 0.9rem; font-weight: 700;
          color: #2563EB; text-decoration: none;
          transition: gap 0.2s ease;
        }
        .see-all-reviews:hover { gap: 12px; }
        @media (max-width: 900px) {
          .reviews-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 600px) {
          .reviews-grid { grid-template-columns: 1fr; }
          .reviews-aggregate { flex-direction: column; gap: 8px; text-align: center; }
          .agg-source { border-left: none; padding-left: 0; border-top: 1px solid #E5E7EB; padding-top: 8px; }
        }
      `}</style>
    </section>
  );
}
