import React from 'react';
import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';

const SEO = ({ title, description, keywords, image, url, structuredData }) => {
  const siteTitle = 'NPS ECOMMERCE';
  const defaultDescription = 'Tu tienda de confianza para productos increíbles.';
  const defaultKeywords = 'ecommerce, tienda, productos, nps';
  const defaultImage = '/logo.png'; // Make sure this exists or update
  const siteUrl = 'https://www.npsecommerce.com'; // Placeholder

  const metaTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const metaDescription = description || defaultDescription;
  const metaKeywords = keywords || defaultKeywords;
  const metaImage = image ? `${siteUrl}${image}` : `${siteUrl}${defaultImage}`;
  const metaUrl = url ? `${siteUrl}${url}` : siteUrl;

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{metaTitle}</title>
      <meta name='description' content={metaDescription} />
      <meta name='keywords' content={metaKeywords} />
      <link rel='canonical' href={metaUrl} />

      {/* Open Graph tags (Facebook, LinkedIn, etc.) */}
      <meta property='og:type' content='website' />
      <meta property='og:title' content={metaTitle} />
      <meta property='og:description' content={metaDescription} />
      <meta property='og:image' content={metaImage} />
      <meta property='og:url' content={metaUrl} />
      <meta property='og:site_name' content={siteTitle} />

      {/* Twitter tags */}
      <meta name='twitter:card' content='summary_large_image' />
      <meta name='twitter:title' content={metaTitle} />
      <meta name='twitter:description' content={metaDescription} />
      <meta name='twitter:image' content={metaImage} />

      {/* Structured Data (JSON-LD) */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

SEO.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  keywords: PropTypes.string,
  image: PropTypes.string,
  url: PropTypes.string,
  structuredData: PropTypes.object,
};

export default SEO;
