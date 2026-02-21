// components/SEO.jsx
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, image, url }) => {
  const defaultTitle = 'CollegeSecracy | Smarter Counseling & Exam Tools';
  const defaultDescription =
    'CollegeSecracy offers smart tools for score estimation, college prediction, and counseling support for JEE, NEET, and other exams.';

  const finalTitle = title ? `${title} | CollegeSecracy` : defaultTitle;
  const finalDescription = description || defaultDescription;
  const finalImage = image || '/logo.webp';
  const finalUrl = url || window.location.href;

  return (
    <Helmet>
      {/* Basic SEO */}
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content="CollegeSecracy, JEE, NEET, College Predictor, Exam Tools, Score Estimator, Counseling, Result Analysis" />
      <meta name="author" content="CollegeSecracy Team" />

      {/* Open Graph for Facebook, LinkedIn etc. */}
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={finalUrl} />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={finalImage} />
    </Helmet>
  );
};

export default SEO;
